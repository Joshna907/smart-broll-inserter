import express from "express";
// FINAL FORCE PUSH: Dynamic Host Verified
import { generateTimelinePlan } from "../services/timeline.service.js";
import { renderVideo } from "../services/rendering.service.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Serve static files from public directory where videos are saved
// This ideally should be in server.js, but we can do it here/server wide
// For simplicity, we just return the full URL relative to server root

router.post("/", async (req, res) => {
  try {
    console.log("Received Plan Request:", JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.a_roll || !req.body.a_roll.url) {
        return res.status(400).json({ error: "Invalid request. 'a_roll.url' is required." });
    }

    // 1. Generate the Plan (Core Logic)
    const result = await generateTimelinePlan(req.body); 
    // result = { insertions: [...], meta: { ... } }

    // 2. Hydrate with URLs for Rendering & Frontend
    const bRollMap = new Map((req.body.b_rolls || []).map(b => [b.id, b.url]));
    const insertionsWithUrls = result.insertions.map(ins => ({
        ...ins,
        url: bRollMap.get(ins.broll_id)
    }));

    // 3. Prepare Object for Rendering
    const videoRenderPlan = {
        a_roll_url: req.body.a_roll.url,
        insertions: insertionsWithUrls
    };

    // 4. Trigger Render (Optional)
    let fullDownloadUrl = null;
    // DISABLED: Synchronous rendering causes timeouts (502) on free tier hosting (Render).
    // The core requirement is the JSON Plan.
    /*
    console.log("Starting video render...");
    const videoPath = await renderVideo(videoRenderPlan);
    // Dynamic URL for production
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    fullDownloadUrl = `${protocol}://${host}${videoPath}`;
    */
    console.log("Skipping video render to prevent timeout. Returning Plan only.");
    fullDownloadUrl = null; // UI will hide download button or we can provide a dummy


    // 5. Save STRICT JSON Artifact (Requirement)
    const timestamp = Date.now();
    const jsonPath = path.join("public/outputs", `plan_${timestamp}.json`);
    const strictOutput = {
        insertions: result.insertions.map(({ url, ...rest }) => rest) // Remove URL from strict output if we want to be super clean, or keep it. Requirement says "At minimum...". Keeping it clean.
    };
    
    try {
        if (!fs.existsSync("public/outputs")) fs.mkdirSync("public/outputs", { recursive: true });
        fs.writeFileSync(jsonPath, JSON.stringify(strictOutput, null, 2));
        console.log("Saved STRICT JSON plan artifact:", jsonPath);
    } catch (e) {
        console.error("Failed to save JSON artifact:", e);
    }

    // 6. Response to Frontend
    res.json({
      duration: result.meta?.a_roll_duration || 0,
      downloadUrl: fullDownloadUrl,
      transcript: result.meta?.transcript || [],
      transcript_summary: result.meta?.transcript_summary || "",
      timeline: insertionsWithUrls, // Frontend needs URLs to show thumbnails if implemented, or just for verification
      
      // Legacy Adapter for Frontend Visualization (if needed)
      steps: insertionsWithUrls.map((i, idx) => ({
        id: `step_${idx + 1}`,
        content: {
          start: i.start_sec,
          end: i.start_sec + i.duration_sec,
          camera: i.broll_id,
          reason: i.reason
        }
      }))
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


export default router;
