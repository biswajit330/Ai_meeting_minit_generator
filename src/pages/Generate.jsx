import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Mic,
  FileAudio,
  Trash2,
  Calendar,
  Type,
  AlertCircle,
  ArrowRight,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import AudioRecorder from "../components/AudioRecorder";
import Loading from "../components/Loading";
import { generateMinutes, createSampleAudioFile, getSampleMinutes } from "../api";

export default function Generate() {
  const navigate = useNavigate();

  // Demo Mode state (defaults to true so anyone can test before adding the backend)
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Meeting metadata
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Audio source selection: 'upload' | 'record'
  const [activeTab, setActiveTab] = useState("upload");

  // Selected audio file state
  const [audioFile, setAudioFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Status & Error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  const allowedExtensions = [".mp3", ".wav", ".m4a"];

  const validateAndSetFile = (file) => {
    setErrorMessage("");
    setIsBackendOffline(false);
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage("Invalid file format. Please upload an audio file ending with .mp3, .wav, or .m4a");
      return;
    }

    setAudioFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setErrorMessage("");
    setIsBackendOffline(false);
  };

  const handleLoadSampleAudio = () => {
    setErrorMessage("");
    setIsBackendOffline(false);
    const sampleFile = createSampleAudioFile();
    setAudioFile(sampleFile);
    if (!meetingTitle) {
      setMeetingTitle("Q3 Product Strategy & Architecture Sync");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsBackendOffline(false);

    if (!audioFile) {
      setErrorMessage("Please select or record an audio file first.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await generateMinutes(audioFile, {
        isDemo: isDemoMode,
        meetingTitle: meetingTitle.trim(),
      });

      if (!data || typeof data.transcription === "undefined" || typeof data.summary === "undefined") {
        throw new Error("Backend response did not contain expected transcription and summary fields.");
      }

      navigate("/results", {
        state: {
          title: meetingTitle.trim() || "Untitled Meeting",
          date: meetingDate,
          transcription: data.transcription,
          summary: data.summary,
        },
      });
    } catch (err) {
      console.error("Generate error:", err);
      if (err.isBackendOffline) {
        setIsBackendOffline(true);
        setErrorMessage(
          "Could not connect to Python backend at http://localhost:8000/api/generate-minutes. You can switch to Demo Mode to view sample minutes immediately."
        );
      } else {
        setErrorMessage(err.message || "Failed to generate meeting minutes. Please check your backend.");
      }
      setIsLoading(false);
    }
  };

  const handleForceDemoGenerate = async () => {
    setErrorMessage("");
    setIsBackendOffline(false);
    setIsLoading(true);

    // Simulate short processing
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const sample = getSampleMinutes(meetingTitle.trim());

    navigate("/results", {
      state: {
        title: meetingTitle.trim() || "Untitled Meeting",
        date: meetingDate,
        transcription: sample.transcription,
        summary: sample.summary,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {isLoading && <Loading title="Generating Meeting Minutes..." />}

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Title & Demo Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Generate Meeting Minutes
            </h1>
            <p className="mt-1.5 text-slate-600 text-sm sm:text-base">
              Provide meeting details and your audio recording to generate transcriptions and AI summaries.
            </p>
          </div>

          {/* Demo Mode Toggle Switch */}
          <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200 shadow-xs w-fit shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-slate-800">Demo Mode</span>
                <span className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isDemoMode ? "Sample preview active" : "Live backend (port 8000)"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isDemoMode}
              onClick={() => {
                setIsDemoMode(!isDemoMode);
                setErrorMessage("");
                setIsBackendOffline(false);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isDemoMode ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDemoMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="p-4 bg-indigo-50/80 border border-indigo-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-indigo-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>
                <strong>Demo Mode is Active:</strong> You can upload any audio, record with mic, or load our sample audio to generate a realistic sample result.
              </span>
            </div>
            {!audioFile && (
              <button
                type="button"
                onClick={handleLoadSampleAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-xs shrink-0 w-fit"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Load Sample Audio
              </button>
            )}
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm space-y-2">
              <div>
                <p className="font-semibold">Backend Connection Notice</p>
                <p className="mt-0.5 text-rose-700 leading-relaxed">{errorMessage}</p>
              </div>

              {isBackendOffline && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleForceDemoGenerate}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Preview with Sample Result
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setIsBackendOffline(false);
              }}
              className="text-xs text-rose-500 hover:text-rose-800 font-semibold underline px-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Meeting Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-lg font-bold text-slate-900">Meeting Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Meeting Title */}
              <div>
                <label htmlFor="meeting-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-600" />
                    Meeting Title
                  </span>
                </label>
                <input
                  id="meeting-title"
                  type="text"
                  placeholder="e.g., Weekly Team Sync"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm transition-all"
                />
              </div>

              {/* Meeting Date */}
              <div>
                <label htmlFor="meeting-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Meeting Date
                  </span>
                </label>
                <input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Audio Input */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="text-lg font-bold text-slate-900">Audio Source</h2>
              </div>

              {/* Toggle Mode Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("upload");
                    setErrorMessage("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "upload"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("record");
                    setErrorMessage("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "record"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Record
                </button>
              </div>
            </div>

            {/* Active Tab: Upload Audio */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                {audioFile ? (
                  /* Selected File Box */
                  <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileAudio className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate" title={audioFile.name}>
                          {audioFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(audioFile.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={removeAudioFile}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/70 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Upload Dropzone */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                        : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="file"
                      id="audio-upload"
                      accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/m4a,audio/x-m4a,audio/mp4"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-base font-semibold text-slate-900">
                      Click to upload or drag & drop audio
                    </p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Supported formats: <span className="font-semibold text-slate-700">.mp3, .wav, .m4a</span>
                    </p>

                    {/* Quick Load Sample Audio button */}
                    <div className="relative z-10 pt-2 border-t border-slate-200/70 inline-block">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLoadSampleAudio();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Click to load sample audio for instant demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Tab: Record Audio */}
            {activeTab === "record" && (
              <div>
                <AudioRecorder
                  onAudioReady={(file) => setAudioFile(file)}
                  onClear={() => setAudioFile(null)}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Audio Confirmation Note */}
            {audioFile && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50/70 px-3.5 py-2.5 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Audio ready to process: <strong className="font-semibold">{audioFile.name}</strong></span>
                </div>
                <span className="text-[11px] font-mono text-emerald-800">{formatFileSize(audioFile.size)}</span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!audioFile || isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-base text-white bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              {isDemoMode ? "Generate Minutes (Demo Preview)" : "Generate Minutes"}
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              {isDemoMode ? (
                <span>
                  Demo Mode: Simulates AI audio processing with sample minutes. You can toggle to Live Backend anytime.
                </span>
              ) : (
                <span>
                  Sends audio to Python backend at <code className="font-mono text-slate-600">http://localhost:8000/api/generate-minutes</code>
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
