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
    // Use translated text if available, otherwise original
    const textToMatch = segment.translatedText || segment.text;
    const segEmbedding = await getEmbedding(textToMatch);

    let best = null;
    let bestScore = 0;

    for (const b of brollEmbeddings) {
      const score = cosineSimilarity(segEmbedding, b.embedding);
      if (score > bestScore) {
        bestScore = score;
        best = b;
      }
    }

      
      // Always capture the best match for this segment, even if low confidence
      if (best) {
         // console.log(`Segment "${segment.text.substring(0, 20)}..." best match: ${best.id} (${bestScore.toFixed(2)})`);
          matches.push({
            start: segment.start,
            text: segment.text,
            broll_id: best.id,
            confidence: bestScore
          });
      }
  }

  // Sort matches by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence);

  // Fallback Logic:
  // 1. Try to find "good" matches (> 0.40)
  const goodMatches = matches.filter(m => m.confidence > 0.40);
  
  if (goodMatches.length > 0) {
    return goodMatches;
  }

  // 2. If NO matches were good enough, return the top 5 anyway (Force Insert)
  console.log("No high-confidence matches found. Using fallback matches.");
  return matches.slice(0, 5);
}


export function prepareBrollTexts(brolls) {
  return brolls.map(b => ({
    id: b.id,
    text: b.metadata
  }));
}
