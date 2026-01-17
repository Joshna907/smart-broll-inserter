import { translateText } from "./translation.service.js";
import { transcribeFromURL } from "./transcription.service.js";
import { matchSegments } from "./matching.service.js";
import openai from "./openai.client.js";
import { describeBroll } from "./broll.service.js";

export async function generateTimelinePlan(input) {
  // 1. Safety default & A-roll Analysis
  if (!input.a_roll?.metadata) {
    input.a_roll.metadata = "User talking video";
  }

  // 2. Validate and Enrich B-Rolls
  console.log("Validating B-roll metadata...");
  for (const b of input.b_rolls) {
    if (!b.metadata || b.metadata.trim().length === 0) {
      console.log(`B-roll ${b.id} missing metadata. Generating description...`);
      if (b.url) {
          b.metadata = await describeBroll(b.url);
      } else {
          b.metadata = "Visual clip"; // Last resort
      }
    }
  }

  const transcript = await transcribeFromURL(input.a_roll.url);

  if (!transcript.hasSpeech) {
    console.log("No speech detected. Returning empty plan.");
    return {
      insertions: []
    };
  }

  const segments = transcript.segments;

  // Translation Step
  if (transcript.language && transcript.language !== "english") {
    console.log(`Detected non-English language: ${transcript.language}. Translating transcript for better matching...`);
    for (const segment of segments) {
      segment.translatedText = await translateText(segment.text);
    }
  }

  // 3. Matching
  const matches = await matchSegments(transcript.segments, input.b_rolls);

  const insertions = [];
  let lastInsertionEnd = 0;

  const totalDuration = segments[segments.length - 1].end;
  
  // Constraints
  const MIN_GAP_SECONDS = 2; // User Request: Reduced gap for higher density
  
  // Dynamic buffer: For short videos, use smaller buffers
  const isShortVideo = totalDuration < 30;
  const CRITICAL_BUFFER_START = 0; // User Request: Allow immediate starts (0.0s)
  const CRITICAL_BUFFER_END = 0; // User Request: Allow insertions at the very end
  const MAX_INSERTIONS = 6;
  const DEFAULT_DURATION = 2.0; // Standard B-roll duration

  console.log(`Filtering ${matches.length} matches...`);

  for (const m of matches) {
    // 6 insertions max
    if (insertions.length >= MAX_INSERTIONS) break;

    const start = m.start;
    const end = start + DEFAULT_DURATION;

    // Filter: Critical Speaking Moments (Start/End of video)
    if (start < CRITICAL_BUFFER_START || end > totalDuration - CRITICAL_BUFFER_END) {
        continue;
    }

    // Filter: Frequency (Avoid overlap + buffer)
    // Check against ALL existing insertions, because we process in Confidence Order (not Time Order)
    const isTooClose = insertions.some(ins => {
        const insEnd = ins.start_sec + ins.duration_sec;
        // Check if New Start is too close to Existing End
        // OR New End is too close to Existing Start
        // We want a gap of MIN_GAP_SECONDS between clips
        const gapBefore = start - insEnd;
        const gapAfter = ins.start_sec - end;
        
        // If it's effectively "inside" or "too close"
        // Overlap Logic: (StartA <= EndB) and (EndA >= StartB)
        const overlapping = (start < insEnd) && (end > ins.start_sec);
        if (overlapping) return true;

        // Gap Logic - Only check the relevant side
        // If Existing is Before Us: Check Gap Before
        if (insEnd <= start) { 
            if (gapBefore < MIN_GAP_SECONDS) return true;
        }
        
        // If Existing is After Us: Check Gap After
        if (ins.start_sec >= end) {
            if (gapAfter < MIN_GAP_SECONDS) return true;
        }
        
        return false;
    });

    if (isTooClose) {
        continue;
    }

    // Prepare Insertion
    const bRollData = input.b_rolls.find(b => b.id === m.broll_id);
    const bRollContext = bRollData?.metadata || "Relevant visual";
    let reason = "Visual matches spoken context";

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Explain in one short sentence why this B-roll matches the spoken audio. Format: 'Speaker mentions [X], clip shows [Y]'."
          },
          {
            role: "user",
            content: `Audio: "${m.text}"\nClip Metadata: "${bRollContext}"`
          }
        ],
        max_tokens: 30
      });

      reason = completion.choices[0]?.message?.content || reason;
    } catch {
      console.warn("Reason generation failed, using default.");
    }

    console.log(`Accepted Insertion: ${m.broll_id} at ${start}s`);
    
    insertions.push({
      start_sec: Number(start.toFixed(2)),
      duration_sec: Number(DEFAULT_DURATION.toFixed(1)),
      broll_id: m.broll_id,
      url: bRollData?.url, // Internal use only, stripped in route
      confidence: Number(m.confidence.toFixed(2)),
      reason: reason
    });

    lastInsertionEnd = end;
  }

  // Rescue Logic: If we have matches but 0 insertions (likely due to strict filters on short video), force one.
  if (insertions.length === 0 && matches.length > 0) {
      console.log("No insertions after filtering. Forcing best match (Rescue Mode).");
      const best = matches[0];
      // Clamp start time to fit in video
      let safeStart = Math.max(0, best.start);
      if (safeStart + DEFAULT_DURATION > totalDuration) {
          safeStart = Math.max(0, totalDuration - DEFAULT_DURATION);
      }
      
      insertions.push({
          start_sec: Number(safeStart.toFixed(2)),
          duration_sec: Number(DEFAULT_DURATION.toFixed(1)),
          broll_id: best.broll_id,
          url: input.b_rolls.find(b => b.id === best.broll_id)?.url, // Internal use
          confidence: Number(best.confidence.toFixed(2)),
          reason: "Best available visual (Forced match)"
      });
  }

  // Sort insertions by start time (just in case)
  insertions.sort((a, b) => a.start_sec - b.start_sec);

  // Generate transcript summary
  let transcript_summary = "Video content analysis";
  try {
      const summaryCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              { role: "system", content: "Summarize the following video transcript in one short sentence." },
              { role: "user", content: transcript.segments.map(s => s.translatedText || s.text).join(" ") }
          ],
          max_tokens: 50
      });
      transcript_summary = summaryCompletion.choices[0]?.message?.content || transcript_summary;
  } catch (err) {
      console.warn("Summary generation failed:", err.message);
  }

  console.log(`Generated ${insertions.length} insertions.`);
  
  // Return STRICT JSON format as requested + helper data for frontend
  return {
    insertions, // The REQUIRED output
    
    // Extra metadata for Frontend/Rendering (not part of strict JSON spec but useful)
    meta: {
        a_roll_duration: totalDuration,
        language: transcript.language || "unknown",
        transcript_summary,
        transcript: segments
    }
  };
}
