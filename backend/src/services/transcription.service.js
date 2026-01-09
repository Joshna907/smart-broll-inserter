import fs from "fs";
import path from "path";
import axios from "axios";
import { exec } from "child_process";
import openai from "./openai.client.js";

export async function transcribeFromURL(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string' || !videoUrl.startsWith('http')) {
    console.warn("Invalid video URL provided to transcribeFromURL:", videoUrl);
    return { segments: [], hasSpeech: false };
  }

  const tempVideoPath = `temp_video_${Date.now()}.mp4`;
  const tempAudioPath = `temp_audio_${Date.now()}.wav`;

  try {
    // 1. Download video
    const response = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream"
    });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(tempVideoPath);
      response.data.pipe(stream);
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // 2. Extract audio using ffmpeg
    try {
        await new Promise((resolve, reject) => {
        exec(
            `ffmpeg -y -i "${tempVideoPath}" -t 90 -ar 16000 -ac 1 "${tempAudioPath}"`,
            (error, stdout, stderr) => {
                if (error) {
                    // Check if error is due to missing audio stream
                    if (stderr && (stderr.includes("Output file does not contain any stream") || stderr.includes("does not contain any stream"))) {
                        console.warn("Video has no audio stream. Skipping transcription.");
                        return resolve("NO_AUDIO");
                    }
                    return reject(error);
                }
                resolve("AUDIO_EXTRACTED");
            }
        );
        });
    } catch (ffmpegError) {
        // Double check if we caught it in the promise
        console.warn("FFmpeg extraction failed (likely silent video):", ffmpegError.message);
        return { segments: [], hasSpeech: false };
    }

    if (!fs.existsSync(tempAudioPath)) {
        return { segments: [], hasSpeech: false };
    }

    const audioStats = fs.statSync(tempAudioPath);
    console.log(`Audio file extracted: ${tempAudioPath}, Size: ${audioStats.size} bytes`);

    if (audioStats.size < 1000) {
        console.warn("Audio file is suspiciously small. Likely silent or failed extraction.");
    }

    // 3. Transcribe using Whisper
    // 3. Transcribe using Whisper
    try {
        console.log("Sending audio to OpenAI Whisper...");
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempAudioPath),
          model: "whisper-1", 
          response_format: "verbose_json"
        });
    
        console.log("Whisper Response:", JSON.stringify(transcription, null, 2));
    
        const segments = transcription?.segments || [];
        
        // If segments is undefined but text exists (simple json format)
        if (!segments.length && transcription.text) {
            console.log("No segments found but text exists. Raw text:", transcription.text);
            // We might need "verbose_json" to get segments
        }

        return {
          segments,
          hasSpeech: segments.length > 0 || !!transcription.text,
          language: transcription.language
        };
    } catch (openaiError) {
        console.error("OpenAI Whisper API Warning/Error:", openaiError);
        // Fallback or rethrow?
        throw openaiError;
    }
  } catch (err) {
    console.error("Transcription process failed:", err);
    // Log to file for persistence
    fs.appendFileSync("transcription_errors.log", `${new Date().toISOString()} - ${err.message}\n`);
    return {
      segments: [],
      hasSpeech: false
    };
  } finally {
    // Cleanup
    try {
        if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
        if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
    } catch (cleanupErr) {
        console.warn("Cleanup failed:", cleanupErr);
    }
  }
}
