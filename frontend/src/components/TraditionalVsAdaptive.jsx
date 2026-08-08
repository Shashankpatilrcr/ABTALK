import React from 'react';

export default function TraditionalVsAdaptive() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
          FIXED QUESTIONS MEASURE PREPARATION. <br />
          <span className="text-blue-400">ADAPTIVE QUESTIONS REVEAL THINKING.</span>
        </h2>
      </div>

      {/* Visual Contrast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Traditional Column */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 space-y-4 text-slate-400 font-mono text-xs shadow-md">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-sm">TRADITIONAL</span>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">Static Script</span>
          </div>

          <ul className="space-y-3 font-sans">
            <li className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600 font-bold text-sm">✕</span>
              <span>Fixed pre-written questions</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600 font-bold text-sm">✕</span>
              <span>Same path for all candidates</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600 font-bold text-sm">✕</span>
              <span>Surface-level keyword scoring</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600 font-bold text-sm">✕</span>
              <span>Generic boilerplate feedback</span>
            </li>
          </ul>
        </div>

        {/* Adaptive Column */}
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 space-y-4 text-slate-200 font-mono text-xs shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="border-b border-slate-800 pb-3 flex items-center justify-between relative z-10">
            <span className="font-bold text-blue-400 uppercase tracking-widest text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ADAPTIVE INTELLIGENCE
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
              ✦ AI ENGINE
            </span>
          </div>

          <ul className="space-y-3 font-sans relative z-10">
            <li className="flex items-center gap-2 text-slate-100 font-medium">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Candidate-specific reasoning path</span>
            </li>
            <li className="flex items-center gap-2 text-slate-100 font-medium">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Dynamic follow-up deep probes</span>
            </li>
            <li className="flex items-center gap-2 text-slate-100 font-medium">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Live state cognitive tree exploration</span>
            </li>
            <li className="flex items-center gap-2 text-slate-100 font-medium">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Evidence-based assessment report</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}
