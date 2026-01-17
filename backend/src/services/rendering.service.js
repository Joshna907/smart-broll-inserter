import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import axios from "axios";
import crypto from "crypto";

// Helper to normalize paths for FFmpeg (Windows compatibility)
const normalizePath = (p) => p.split(path.sep).join(path.posix.sep);

// Helper to download a file
// Helper to download a file with simple caching
async function downloadFile(url, destPath) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error(`Invalid URL provided for download: ${url}`);
  }

  // Check if file exists and is not empty (simple cache)
  if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 0) {
          console.log(`Using cached file: ${destPath}`);
          return; 
      }
  }

  console.log(`Downloading file to ${destPath}...`);
  const writer = fs.createWriteStream(destPath);
  
  try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
  } catch (err) {
      // Cleanup empty file on error
      writer.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      throw err;
  }
}

export async function renderVideo(plan, outputDir = "public/outputs") {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }


  // Helper to generate hash from string
  const getHash = (str) => crypto.createHash('md5').update(str).digest('hex').substring(0, 8);

  // Use URL hash for filename to enable caching across requests
  const aRollHash = getHash(plan.a_roll_url);
  const aRollPath = path.join(outputDir, `aroll_${aRollHash}.mp4`);
  
  // Output filename needs timestamp to avoid collisions if overlay logic changes, or just overwrite?
  // User wants "Download Final Cut". Let's stick to timestamp for FINAL output to avoid browser caching issues,
  // but cache INPUT files.
  const timestamp = Date.now();
  const finalPath = path.join(outputDir, `final_${timestamp}.mp4`);
  
  // 1. Download A-roll
  console.log("Downloading A-roll...");
  await downloadFile(plan.a_roll_url, aRollPath);

  // 2. Prepare FFmpeg command
  // Use absolute path for input to avoid ffmpeg confusion on Windows
  let command = ffmpeg(normalizePath(path.resolve(aRollPath)));
  const tempFiles = [aRollPath];

  // 3. Build complex filter for overlays
  // Inputs: 0=A-roll, 1..N=B-rolls
  // Filter: [0:v][1:v]overlay=enable='between(t,start,end)'[v1];[v1][2:v]overlay=...
  
  const complexFilters = [];
  let lastStream = "0:v";
  
  const insertions = plan.timeline || plan.insertions || [];

  console.log("Downloading and queuing B-rolls...");
  for (let i = 0; i < insertions.length; i++) {
    const ins = insertions[i];
    // Hash the B-roll URL for consistent caching
    const bRollHash = ins.url ? getHash(ins.url) : `temp_${i}`; 
    const bRollPath = path.join(outputDir, `broll_${bRollHash}.mp4`);
    
    // Download B-roll
    // Note: In a real app, we'd cache these or check if they exist
    // For this assignment, we use the URL provided in the B-roll metadata or the mock URL
    // We need the URL. The timeline service should pass it through. 
    // Assuming plan.insertions includes the 'url' property now.
    
    if (ins.url) {
        await downloadFile(ins.url, bRollPath);
        tempFiles.push(bRollPath);
        
        // Add input with absolute path
        command = command.input(normalizePath(path.resolve(bRollPath)));
        
        // Add overlay filter
        // We need to scale B-roll to match A-roll (assuming 1080p for now or generic scaling)
        // Simplest strategy: Scale B-roll to 1920x1080 (force) before overlaying
        
        // Input index for this B-roll is i + 1 (since 0 is A-roll)
        const inputIdx = i + 1;
        const nextStream = i === insertions.length - 1 ? "v_out" : `v_tmp_${i}`;
        
        // Filter logic:
        // [inputIdx:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[scaled_broll];
        // [lastStream][scaled_broll]overlay=enable='between(t,${ins.start_sec},${ins.start_sec + ins.duration_sec})'[nextStream]
        
        // Note: fluent-ffmpeg complexFilter syntax handles the mapping strings
        // But manual string construction is often more reliable for dynamic chains
        
        // Let's settle on a simpler overlay for this MVP
        // We assume consistent aspect ratios or just force overlay
        
        complexFilters.push({
            filter: 'overlay',
            options: { enable: `between(t,${ins.start_sec},${ins.start_sec + ins.duration_sec})` },
            inputs: [lastStream, `${inputIdx}:v`],
            outputs: nextStream
        });
        
        lastStream = nextStream;
    }
  }

  // 4. Run FFmpeg
  return new Promise((resolve, reject) => {
    if (complexFilters.length === 0) {
        console.log("No insertions to render. Returning original A-roll.");
        // Even if no insertions, we should return the local path of the A-roll we downloaded
        // so the frontend can download it from our server.
        // We already downloaded it to aRollPath.
        // Let's just rename/copy it to finalPath or just use aRollPath.
        
        // Simpler: Just copy aRollPath to finalPath to keep naming consistent
        try {
            fs.copyFileSync(aRollPath, finalPath);
            return resolve(`/outputs/${path.basename(finalPath)}`);
        } catch (e) {
            // Fallback
            return resolve(`/outputs/${path.basename(aRollPath)}`);
        }
    }
    
    const finalOutputPath = normalizePath(path.resolve(finalPath));
    console.log("Starting render process. Output:", finalOutputPath);
    
    command
      .complexFilter(complexFilters) // Don't auto-map, we do it manually
      //.outputOptions('-map 0:a') // Keep original audio
      // We need to map the FINAL video stream AND the original audio
      .outputOptions(['-map', `[${lastStream}]`, '-map', '0:a']) 
      .on('start', (cmd) => {
          console.log("FFmpeg Command:", cmd);
      })
      .output(finalOutputPath)
      .on('end', () => {
        console.log("Render finished:", finalPath);
        // Cleanup temp files (optional, maybe keep for debugging)
        tempFiles.forEach(f => {
            try { fs.unlinkSync(f); } catch(e) {}
        });
        
        // Return relative path for serving
        resolve(`/outputs/${path.basename(finalPath)}`);
      })
      .on('error', (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })
      .run();
  });
}
