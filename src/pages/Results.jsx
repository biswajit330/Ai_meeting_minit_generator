import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Copy,
  Check,
  Download,
  ArrowLeft,
  Calendar,
  Sparkles,
  FileText,
  FileQuestion,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [isExpandedTranscript, setIsExpandedTranscript] = useState(false);

  // If accessed directly without data
  if (!state || (!state.transcription && !state.summary)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/70">
            <FileQuestion className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">No meeting minutes found.</h2>
            <p className="mt-2 text-sm text-slate-600">
              Generate minutes first.
            </p>
          </div>
          <Link
            to="/generate"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all"
          >
            Go to Generate
          </Link>
        </div>
      </div>
    );
  }

  const { title, date, summary, transcription } = state;

  const handleCopy = async (text, type) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === "summary") {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      } else {
        setCopiedTranscript(true);
        setTimeout(() => setCopiedTranscript(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownload = (content, filename) => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine if transcript is long enough to warrant show more / less
  const isLongTranscript = (transcription || "").length > 600;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generate
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                handleDownload(
                  summary,
                  `${(title || "meeting").toLowerCase().replace(/[^a-z0-9]/g, "-")}-summary.txt`
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              Download Summary
            </button>

            <button
              type="button"
              onClick={() =>
                handleDownload(
                  transcription,
                  `${(title || "meeting").toLowerCase().replace(/[^a-z0-9]/g, "-")}-transcript.txt`
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Download Transcript
            </button>
          </div>
        </div>

        {/* Meeting Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Generated Minutes
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title || "Untitled Meeting"}
            </h1>
          </div>

          {date && (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-fit">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{date}</span>
            </div>
          )}
        </div>

        {/* Section 1: AI Summary (Large Highlighted Card) */}
        <div className="bg-linear-to-br from-indigo-50/90 via-white to-violet-50/70 p-6 sm:p-8 rounded-3xl border-2 border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">AI Summary</h2>
                <p className="text-xs text-slate-500">Concise synthesis of the meeting discussion</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(summary, "summary")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 transition-colors shadow-xs"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary Content */}
          <div className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed whitespace-pre-wrap pt-2">
            {summary || "No summary was provided by the backend."}
          </div>
        </div>

        {/* Section 2: Full Transcript (Scrollable Box) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Full Transcript</h2>
                <p className="text-xs text-slate-500">Word-for-word audio transcription</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(transcription, "transcript")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
            >
              {copiedTranscript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Transcript
                </>
              )}
            </button>
          </div>

          {/* Transcript Content Box */}
          <div
            className={`p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-wrap transition-all overflow-y-auto ${
              isExpandedTranscript || !isLongTranscript
                ? "max-h-200"
                : "max-h-64 overflow-hidden relative"
            }`}
          >
            {transcription || "No transcription was provided by the backend."}

            {/* Gradient fade if collapsed */}
            {!isExpandedTranscript && isLongTranscript && (
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {isLongTranscript && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsExpandedTranscript(!isExpandedTranscript)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-100 transition-colors"
              >
                {isExpandedTranscript ? (
                  <>
                    Show Less
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Back Button */}
        <div className="text-center pt-4 pb-8">
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generate
          </button>
        </div>
      </div>
    </div>
  );
}
