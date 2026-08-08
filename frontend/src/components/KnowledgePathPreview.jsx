import React from 'react';

export default function KnowledgePathPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Explanation Column */}
        <div className="lg:col-span-5 space-y-5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full inline-block">
            ✦ State Memory & Topology
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            THE INTERVIEW <br />
            <span className="text-emerald-400">HAS A MEMORY.</span>
          </h2>

          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Every candidate answer alters the live state memory. The system builds an interactive tree mapping verified skills, active probes, and unexplored concepts.
          </p>

          {/* Color Legend */}
          <div className="pt-2 space-y-2 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Blue = Explored Core Concept</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>Emerald = ✦ Adaptive Deep Probe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span>Slate = Unexplored Topic</span>
            </div>
          </div>
        </div>

        {/* Right Lightweight Cognitive Map Preview */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 font-mono text-xs">
            <span className="text-slate-200 font-bold uppercase tracking-wider">Cognitive Map Preview</span>
            <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
              ✦ Active Context Tree
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80">
            <svg viewBox="0 0 450 260" className="w-full h-auto drop-shadow-md selection:bg-none">
              {/* Lines */}
              <line x1="80" y1="40" x2="180" y2="40" stroke="#3b82f6" strokeWidth="2" />
              <line x1="180" y1="40" x2="280" y2="40" stroke="#3b82f6" strokeWidth="2" />
              <line x1="180" y1="40" x2="180" y2="120" stroke="#3b82f6" strokeWidth="2" />
              <line x1="180" y1="120" x2="280" y2="120" stroke="#10b981" strokeWidth="2.5" />
              <line x1="280" y1="120" x2="370" y2="120" stroke="#10b981" strokeWidth="2.5" />
              <line x1="180" y1="120" x2="180" y2="200" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="180" y1="200" x2="280" y2="200" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

              {/* Node 1: Python */}
              <g transform="translate(80,40)">
                <circle r="10" className="fill-blue-600 stroke-white" strokeWidth="2" />
                <rect x="-35" y="-30" width="70" height="18" rx="4" className="fill-slate-950/90 stroke-blue-500" />
                <text y="-18" textAnchor="middle" className="text-[10px] font-mono fill-blue-300 font-bold">Python</text>
              </g>

              {/* Node 2: FastAPI */}
              <g transform="translate(180,40)">
                <circle r="10" className="fill-blue-600 stroke-white" strokeWidth="2" />
                <rect x="-35" y="-30" width="70" height="18" rx="4" className="fill-slate-950/90 stroke-blue-500" />
                <text y="-18" textAnchor="middle" className="text-[10px] font-mono fill-blue-300 font-bold">FastAPI</text>
              </g>

              {/* Node 3: Async */}
              <g transform="translate(280,40)">
                <circle r="8" className="fill-indigo-900 stroke-indigo-400" strokeWidth="1.5" />
                <rect x="-30" y="-30" width="60" height="18" rx="4" className="fill-slate-950/90 stroke-indigo-800" />
                <text y="-18" textAnchor="middle" className="text-[10px] font-mono fill-slate-300">Async</text>
              </g>

              {/* Node 4: RAG Root */}
              <g transform="translate(180,120)">
                <circle r="12" className="fill-blue-500 stroke-white" strokeWidth="2" />
                <rect x="-30" y="-32" width="60" height="18" rx="4" className="fill-slate-950/90 stroke-blue-400" />
                <text y="-20" textAnchor="middle" className="text-[10px] font-mono fill-blue-300 font-bold">RAG</text>
              </g>

              {/* Node 5: ✦ Context Chunking (Emerald Adaptive) */}
              <g transform="translate(280,120)">
                <circle r="14" className="fill-emerald-500 stroke-white animate-pulse" strokeWidth="2.5" />
                <rect x="-55" y="-32" width="110" height="18" rx="4" className="fill-emerald-950/90 stroke-emerald-400" />
                <text y="-20" textAnchor="middle" className="text-[10px] font-mono fill-emerald-300 font-bold">✦ Chunking</text>
              </g>

              {/* Node 6: Vector Search */}
              <g transform="translate(370,120)">
                <circle r="10" className="fill-emerald-950 stroke-emerald-400" strokeWidth="2" />
                <rect x="-45" y="-30" width="90" height="18" rx="4" className="fill-slate-950/90 stroke-slate-700" />
                <text y="-18" textAnchor="middle" className="text-[10px] font-mono fill-slate-200">Vector Search</text>
              </g>

              {/* Unexplored Node: Agentic AI */}
              <g transform="translate(180,200)">
                <circle r="8" className="fill-slate-950 stroke-slate-700" strokeWidth="1.5" />
                <text x="14" y="4" className="text-[10px] font-mono fill-slate-500">Agentic AI (Unexplored)</text>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
