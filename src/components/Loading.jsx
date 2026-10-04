import { Loader2, Sparkles, Mic } from "lucide-react";

export default function Loading({ title = "Generating Minutes..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center">
        {/* Animated Icon Container */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-9 h-9 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">
          Our AI is converting speech to text and drafting your structured summary. This usually takes a few seconds.
        </p>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center justify-center gap-1.5 h-10 w-full bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 mb-6">
          <span className="w-1.5 bg-indigo-500 rounded-full animate-bounce h-4"></span>
          <span className="w-1.5 bg-indigo-600 rounded-full animate-bounce h-7" style={{ animationDelay: "150ms" }}></span>
          <span className="w-1.5 bg-violet-500 rounded-full animate-bounce h-5" style={{ animationDelay: "300ms" }}></span>
          <span className="w-1.5 bg-violet-600 rounded-full animate-bounce h-8" style={{ animationDelay: "200ms" }}></span>
          <span className="w-1.5 bg-indigo-500 rounded-full animate-bounce h-3" style={{ animationDelay: "400ms" }}></span>
          <span className="w-1.5 bg-indigo-700 rounded-full animate-bounce h-6" style={{ animationDelay: "250ms" }}></span>
          <span className="w-1.5 bg-violet-500 rounded-full animate-bounce h-4" style={{ animationDelay: "350ms" }}></span>
        </div>

        {/* Sub-note */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5" />
          <span>Processing audio directly with Python backend</span>
        </div>
      </div>
    </div>
  );
}
