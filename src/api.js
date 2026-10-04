/**
 * Sample data generator for frontend demo presentation
 */
export function getSampleMinutes(meetingTitle = "") {
  const title = meetingTitle.trim() || "Product Strategy & Engineering Sync";
  return {
    summary: `The team held a strategic review on "${title}". Key discussions centered on backend latency improvements, audio processing performance, and export workflow readiness. The architecture demonstrates stable throughput with high transcription fidelity. Priorities include stress-testing longer recording sessions and deploying the automated pipeline ahead of the upcoming milestone review.`,
    transcription: `Good morning everyone, thank you for joining today's session on ${title}. Today we want to review our meeting processing pipeline, verify the latest audio transcription benchmarks, and ensure our summary extraction meets quality standards.

Over the past sprint, we tuned the audio ingestion service to handle multipart form uploads seamlessly. File validation for MP3, WAV, and M4A is functioning properly, and our background transcription queue has reduced turnaround latency by nearly 40%.

From the user perspective, both live microphone recording and local file uploads produce clean audio streams, and the copy and download capabilities allow users to immediately archive both the transcript and summary. Everything is looking solid, and we will proceed with end-to-end testing this week. Thank you all for your contributions.`
  };
}

/**
 * Creates a valid, playable sample audio WAV file for instant demonstration
 */
export function createSampleAudioFile() {
  const sampleRate = 16000;
  const duration = 2.5; // 2.5 seconds
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");

  // "fmt " Sub-chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // "data" Sub-chunk
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  // Generate a pleasant harmonic chime
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.min(Math.floor(t * 1.6), notes.length - 1);
    const freq = notes[noteIndex];
    const envelope = Math.max(0, 1 - ((t * 1.6) % 1) * 1.2);
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.35;
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return new File([blob], "Sample-Meeting-Audio.wav", { type: "audio/wav" });
}

/**
 * Sends audio to backend or provides sample demo output
 */
export async function generateMinutes(audioFile, options = {}) {
  const { isDemo = false, meetingTitle = "" } = options;

  // If explicitly in demo mode, simulate AI processing delay and return sample result
  if (isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return getSampleMinutes(meetingTitle);
  }

  const formData = new FormData();
  formData.append("audio", audioFile);

  try {
    const response = await fetch("http://localhost:8000/api/generate-minutes", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData?.detail) errorMsg = errorData.detail;
        else if (errorData?.message) errorMsg = errorData.message;
        else if (errorData?.error) errorMsg = errorData.error;
      } catch {
        // ignore
      }
      throw new Error(errorMsg || "Failed to generate minutes");
    }

    return await response.json();
  } catch (err) {
    if (err.name === "TypeError" && (err.message?.includes("fetch") || err.message?.includes("NetworkError"))) {
      const customErr = new Error(
        "Could not connect to backend at http://localhost:8000/api/generate-minutes."
      );
      customErr.isBackendOffline = true;
      throw customErr;
    }
    throw err;
  }
}
