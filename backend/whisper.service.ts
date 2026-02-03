import FormData from "form-data";
import fetch from "node-fetch";

export interface WhisperTranscription {
  text: string;
  language?: string;
  duration?: number;
}

export class WhisperService {
  private apiKey: string;
  private apiUrl = "https://api.openai.com/v1/audio/transcriptions";

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "DUMMY_OPENAI_API_KEY";
    if (this.apiKey === "DUMMY_OPENAI_API_KEY") {
      console.warn("⚠️  OPENAI_API_KEY not set in .env - using dummy key");
    }
  }

  async transcribe(audioBuffer: Buffer, filename: string): Promise<WhisperTranscription> {
    console.log("[Whisper] Transcribing audio:", filename);

    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename,
      contentType: "audio/webm",
    });
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("response_format", "json");

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[Whisper] API error:", error);
        throw new Error(`Whisper API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log("[Whisper] Transcription successful:", result.text);

      return {
        text: result.text,
        language: result.language,
        duration: result.duration,
      };
    } catch (error) {
      console.error("[Whisper] Transcription failed:", error);
      throw error;
    }
  }
}

export const whisperService = new WhisperService();