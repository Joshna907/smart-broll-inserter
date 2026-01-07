import fs from "fs";
import axios from "axios";
import openai from "./openai.client.js";

export async function transcribeFromURL(videoUrl) {
  const tempPath = "temp_aroll.mp4";

  const response = await axios.get(videoUrl, {
    responseType: "stream",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*"
    }
  });

  await new Promise(resolve => {
    const stream = fs.createWriteStream(tempPath);
    response.data.pipe(stream);
    stream.on("finish", resolve);
  });

  const transcript = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tempPath),
    model: "whisper-1",
    response_format: "verbose_json"
  });

  fs.unlinkSync(tempPath);

  return transcript.segments.map(seg => ({
    start: seg.start,
    end: seg.end,
    text: seg.text
  }));
}
