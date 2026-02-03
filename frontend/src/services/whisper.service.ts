import { apiRequest } from "@/lib/queryClient";

export interface WhisperTranscription {
  text: string;
  language?: string;
  duration?: number;
}

export class WhisperRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    console.log("[Whisper] Starting recording...");

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use webm format for better compatibility
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log("[Whisper] Recording started");
    } catch (error) {
      console.error("[Whisper] Failed to start recording:", error);
      throw new Error("Failed to access microphone");
    }
  }

  async stopRecording(): Promise<Blob> {
    console.log("[Whisper] Stopping recording...");

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.mediaRecorder!.mimeType,
        });
        
        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        console.log("[Whisper] Recording stopped, blob size:", audioBlob.size);
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<WhisperTranscription> {
  console.log("[Whisper] Transcribing audio blob:", audioBlob.size, "bytes");

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  try {
    const response = await apiRequest("/api/transcribe", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
      headers: {},
    });

    const result = await response.json();
    console.log("[Whisper] Transcription result:", result);
    return result;
  } catch (error) {
    console.error("[Whisper] Transcription failed:", error);
    throw error;
  }
}

export const whisperRecorder = new WhisperRecorder();