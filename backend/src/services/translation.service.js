
import openai from "./openai.client.js";

export async function translateText(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful translator. Translate the following text to English. Return ONLY the translation, no extra text."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 100
    });

    return response.choices[0]?.message?.content?.trim() || text;
  } catch (e) {
    console.error("Translation failed:", e.message);
    return text; // Fallback to original
  }
}
