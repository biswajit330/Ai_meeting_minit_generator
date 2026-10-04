import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AudioRecorder({ onAudioReady, onClear, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up streams and timers on unmount
  useEffect(() => {
    return () => {
      stopTracks();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMessage("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      if (onClear) onClear();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/wav",
        });

        const extension = mediaRecorder.mimeType?.includes("webm")
          ? "webm"
          : mediaRecorder.mimeType?.includes("mp4")
          ? "m4a"
          : "wav";

        const fileName = `meeting-recording-${new Date().toISOString().slice(0, 10)}.${extension}`;
        const audioFile = new File([audioBlob], fileName, {
          type: audioBlob.type || "audio/wav",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        if (onAudioReady) {
          onAudioReady(audioFile);
        }
        stopTracks();
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);
      stopTracks();
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone access was denied. Please allow microphone permission in your browser.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No microphone detected. Please connect an audio input device.");
      } else {
        setErrorMessage("Unable to access microphone: " + (err.message || "Unknown error"));
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const deleteRecording = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingDuration(0);
    setErrorMessage("");
    if (onClear) onClear();
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording in Progress */}
      {isRecording ? (
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
            <div>
              <p className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Recording in progress</p>
              <p className="text-3xl font-mono font-bold tracking-tight">{formatTime(recordingDuration)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Recording
          </button>
        </div>
      ) : audioUrl ? (
        /* Recorded Audio Preview */
        <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold">Audio recorded ({formatTime(recordingDuration)})</span>
            </div>
            <button
              type="button"
              onClick={deleteRecording}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/60 rounded-lg transition-colors disabled:opacity-50"
              title="Delete recording"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Recording
            </button>
          </div>

          {/* Audio player & Play button */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100/80 shadow-xs">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-xs"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              className="w-full h-8"
              controls
            />
          </div>
        </div>
      ) : (
        /* Initial Ready State */
        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-col items-center justify-center text-center transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Mic className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Record Live Audio</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mb-4">
            Click to start recording your meeting directly from your microphone
          </p>

          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-sm transition-all disabled:opacity-50"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        </div>
      )}
    </div>
  );
}
