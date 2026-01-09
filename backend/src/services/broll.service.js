import fs from "fs";
import path from "path";
import axios from "axios";
import { exec } from "child_process";
import openai from "./openai.client.js";

// Helper to download a file
async function downloadFile(url, destPath) {
  const writer = fs.createWriteStream(destPath);
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
}

// Helper to extract a frame
async function extractFrame(videoPath, framePath) {
  return new Promise((resolve, reject) => {
    // Extract a frame at 1 second mark (or 50% if we knew duration, but 1s is usually safe for preview)
    // -ss 00:00:01.000 -vframes 1
    exec(`ffmpeg -y -i "${videoPath}" -ss 00:00:01.000 -vframes 1 "${framePath}"`, (error) => {
      if (error) {
        // If 1s fails (maybe short video), try 0s
        exec(`ffmpeg -y -i "${videoPath}" -ss 00:00:00.000 -vframes 1 "${framePath}"`, (err2) => {
            if (err2) return reject(err2);
            resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

export async function describeBroll(videoUrl) {
    if (!videoUrl) return "No video URL provided";

    const tempId = Date.now() + Math.random().toString(36).substring(7);
    const tempVideoPath = `temp_broll_${tempId}.mp4`;
    const tempFramePath = `temp_frame_${tempId}.jpg`;

    try {
        console.log(`Downloading B-roll for analysis: ${videoUrl}...`);
        await downloadFile(videoUrl, tempVideoPath);

        console.log("Extracting frame...");
        await extractFrame(tempVideoPath, tempFramePath);

        const imageBuffer = fs.readFileSync(tempFramePath);
        const base64Image = imageBuffer.toString('base64');

        console.log("Analyzing B-roll content with GPT-4o...");
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe what is happening in this video frame in one concise sentence. Focus on the main subject and action." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ],
                },
            ],
            max_tokens: 50,
        });

        const description = response.choices[0].message.content;
        console.log(`Generated Description: "${description}"`);
        return description;

    } catch (error) {
        console.error("Error analyzing B-roll:", error);
        return "Visual footage"; // Fallback
    } finally {
        // Cleanup
        try {
            if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
            if (fs.existsSync(tempFramePath)) fs.unlinkSync(tempFramePath);
        } catch (e) {
            console.warn("Cleanup failed:", e);
        }
    }
}
