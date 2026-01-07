import { getEmbedding } from "./embedding.service.js";
import openai from "./openai.client.js";

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export async function matchSegments(transcript, brolls) {
  const brollEmbeddings = [];

  for (const b of brolls) {
    brollEmbeddings.push({
      id: b.id,
      text: b.metadata,
      embedding: await getEmbedding(b.metadata)
    });
  }

  const matches = [];

  for (const segment of transcript) {
    const segEmbedding = await getEmbedding(segment.text);

    let best = null;
    let bestScore = 0;

    for (const b of brollEmbeddings) {
      const score = cosineSimilarity(segEmbedding, b.embedding);
      if (score > bestScore) {
        bestScore = score;
        best = b;
      }
    }

    if (bestScore > 0.72) {
      matches.push({
        start: segment.start,
        text: segment.text,
        broll_id: best.id,
        confidence: bestScore
      });
    }
  }

  return matches;
}


export function prepareBrollTexts(brolls) {
  return brolls.map(b => ({
    id: b.id,
    text: b.metadata
  }));
}
