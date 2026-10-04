import { Link } from "react-router-dom";
import {
  UploadCloud,
  FileAudio,
  Sparkles,
  FileText,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function Home() {
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background decorative gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-indigo-100/60 via-violet-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI-Powered Meeting Intelligence
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Turn Every Meeting Into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600">
              Clear Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your audio files or record meetings live with your microphone. MinuteAI instantly creates accurate
            full transcriptions and intelligent AI summaries with zero hassle.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/generate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-medium text-slate-700 bg-white hover:bg-slate-100/80 border border-slate-200 shadow-xs transition-colors"
            >
              See How It Works
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Value props pill badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>Supports MP3, WAV, M4A</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>Real-time Audio Recording</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>Direct Export & Copy</span>
            </div>
          </div>
        </div>

        {/* Hero Preview Card */}
        <div className="max-w-4xl mx-auto px-4 mt-14">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-slate-400">Quarterly Strategy Review.mp3</span>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/70">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Summary
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The team finalized the product roadmap for Q3, focusing on performance optimizations and mobile
                  readiness. Target launch dates were confirmed for late October.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Full Transcript
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  &ldquo;Welcome everyone to today’s review. Let’s start with the Q3 milestones. All core backend
                  endpoints have stabilized...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Capabilities</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Everything You Need for Effortless Minutes
            </p>
            <p className="mt-3 text-slate-600 text-base">
              Designed to take meeting audio from any source and deliver clean, actionable outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Audio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag and drop or select your audio recordings in popular formats including MP3, WAV, and M4A, or record
                directly in-browser.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5">
                <FileAudio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Transcription</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transform spoken dialogue into high-accuracy full text transcripts, ready for review, search, and
                immediate archiving.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Save hours of reading with clear, synthesized summaries highlighting the core discussions and key
                outcomes of your meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Process Flow</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              How MinuteAI Works
            </p>
            <p className="mt-3 text-slate-600 text-base">
              A simple, streamlined three-step workflow from audio to meeting minutes.
            </p>
          </div>

          <div className="flex flex-col items-center max-w-md mx-auto space-y-4">
            {/* Step 1 */}
            <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                1
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Upload / Record</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your audio file or record live with your microphone.
                </p>
              </div>
            </div>

            {/* Down Arrow */}
            <div className="flex flex-col items-center text-indigo-500 py-1">
              <span className="w-0.5 h-6 bg-indigo-200"></span>
              <ChevronDown className="w-5 h-5 -mt-1" />
            </div>

            {/* Step 2 */}
            <div className="w-full bg-linear-to-r from-indigo-50 to-violet-50 p-6 rounded-2xl border border-indigo-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">AI Processing</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Audio is processed securely by our Python AI engine to transcribe speech and extract synthesis.
                </p>
              </div>
            </div>

            {/* Down Arrow */}
            <div className="flex flex-col items-center text-indigo-500 py-1">
              <span className="w-0.5 h-6 bg-indigo-200"></span>
              <ChevronDown className="w-5 h-5 -mt-1" />
            </div>

            {/* Step 3 */}
            <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-lg fshrink-0">
                3
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Transcript + Summary</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Read, copy, or download both the summary and full transcription instantly.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 text-center">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              Start Generating Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="font-semibold text-slate-800">MinuteAI</span>
          </div>

          <p>© 2026 MinuteAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
