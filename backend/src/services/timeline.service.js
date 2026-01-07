import { transcribeFromURL } from "./transcription.service.js";
import { matchSegments } from "./matching.service.js";
import openai from "./openai.client.js";

export async function generateTimelinePlan(input) {
  const transcript = await transcribeFromURL(input.a_roll.url);

  const matches = await matchSegments(transcript, input.b_rolls);

  const insertions = [];
  let lastTime = -10;

  for (const m of matches) {
    if (m.start - lastTime >= 5 && insertions.length < 6) {
      insertions.push({
        start_sec: m.start,
        duration_sec: 2.5,
        broll_id: m.broll_id,
        confidence: Number(m.confidence.toFixed(2)),
        reason: "Visual context reinforces spoken message"
      });
      lastTime = m.start;
    }
  }

  return {
    a_roll_duration: transcript[transcript.length - 1].end,
    insertions
  };
}
