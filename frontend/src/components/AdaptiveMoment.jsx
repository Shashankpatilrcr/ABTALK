import React from 'react';

export default function AdaptiveMoment() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
          ✦ Real-Time Reasoning Loop
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          SEE THE MOMENT THE AI <br />
          <span className="text-emerald-400">CHANGES COURSE.</span>
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          Watch how candidate answer signals trigger immediate cognitive recalibration inside the AI interviewer.
        </p>
      </div>

      {/* Simulated Adaptive Telemetry Sequence Box */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Step Sequence Column */}
          <div className="lg:col-span-7 space-y-4 font-mono text-xs">
            {/* Step 1: Question Q04 */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="text-slate-400 font-bold">Q04 ANSWER SUBMITTED</span>
              <span className="text-blue-400">Candidate Signal Input</span>
            </div>

            <div className="text-center text-slate-500 font-bold">↓</div>

            {/* Step 2: Signal Detected */}
            <div className="bg-slate-900/90 border border-blue-500/40 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold uppercase">
                <span>SIGNAL DETECTED</span>
                <span>Confidence: 94%</span>
              </div>
              <p className="text-slate-100 font-semibold text-sm">
                Candidate demonstrated strong RAG retrieval fundamentals & custom embedding awareness.
              </p>
            </div>

            <div className="text-center text-emerald-400 font-bold text-base">↓ ✦ ADAPTIVE PROBE TRIGGERED</div>

            {/* Step 3: Generated Adaptive Question */}
            <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-xl space-y-1 shadow-lg">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">New Dynamic Question</span>
              <p className="text-emerald-100 font-bold text-sm">
                "How would you optimize retrieval latency when vector indexes scale to millions of embeddings?"
              </p>
            </div>
          </div>

          {/* Right Why & Probing Insight */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase">AI REASONING LOGIC</span>
              <span className="text-emerald-400">WHY?</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span>✓</span>
                <span>Strong retrieval fundamentals</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span>✓</span>
                <span>Good architecture reasoning</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block font-bold">AI is currently probing:</span>
              <div className="space-y-1.5 text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Retrieval optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Latency trade-offs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
