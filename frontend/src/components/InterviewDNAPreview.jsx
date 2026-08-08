import React from 'react';

export default function InterviewDNAPreview() {
  return (
    <section id="why-adaptive" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-400 bg-violet-950/60 border border-violet-800/50 px-3 py-1 rounded-full">
          ✦ Unique Candidate Fingerprint
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          EVERY INTERVIEW LEAVES A <br />
          <span className="text-violet-400">KNOWLEDGE SIGNATURE.</span>
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          No two candidates follow the same path. The interview generates a unique radial knowledge signature capturing depth, adaptability, and architectural strength.
        </p>
      </div>

      {/* Constellation Radial Visualization Container */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-4xl mx-auto">
        <div className="relative flex justify-center items-center py-4">
          <svg viewBox="0 0 500 420" className="w-full h-auto max-w-[480px] drop-shadow-xl selection:bg-none">
            {/* Concentric Signal Rings */}
            <circle cx="250" cy="210" r="160" className="fill-none stroke-slate-800/60" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="250" cy="210" r="110" className="fill-none stroke-slate-800" strokeWidth="1" />
            <circle cx="250" cy="210" r="60" className="fill-none stroke-blue-500/20" strokeWidth="1.5" />

            {/* Radial Spoke Rays */}
            <line x1="250" y1="50" x2="250" y2="370" stroke="#1e293b" strokeWidth="1" />
            <line x1="90" y1="210" x2="410" y2="210" stroke="#1e293b" strokeWidth="1" />
            <line x1="130" y1="90" x2="370" y2="330" stroke="#1e293b" strokeWidth="1" />
            <line x1="130" y1="330" x2="370" y2="90" stroke="#1e293b" strokeWidth="1" />

            {/* Constellation Polygon (Candidate DNA Area) */}
            <polygon
              points="250,70 360,130 380,210 320,310 210,340 120,210 160,110"
              className="fill-violet-500/20 stroke-violet-400"
              strokeWidth="2.5"
            />

            {/* Center Core Candidate Node */}
            <g transform="translate(250,210)">
              <circle r="20" className="fill-slate-950 stroke-violet-400 animate-pulse" strokeWidth="2.5" />
              <text y="5" textAnchor="middle" className="text-[10px] font-mono fill-violet-300 font-bold">◉ CANDIDATE</text>
            </g>

            {/* Signal Nodes around Fingerprint */}
            {/* RAG Systems */}
            <g transform="translate(250,70)">
              <circle r="6" className="fill-emerald-400" />
              <text y="-12" textAnchor="middle" className="text-[10px] font-mono fill-emerald-300 font-bold">RAG Systems (94%)</text>
            </g>

            {/* Vector DB */}
            <g transform="translate(360,130)">
              <circle r="6" className="fill-blue-400" />
              <text x="12" y="4" className="text-[10px] font-mono fill-blue-300 font-bold">Vector DB (88%)</text>
            </g>

            {/* API Architecture */}
            <g transform="translate(380,210)">
              <circle r="6" className="fill-indigo-400" />
              <text x="12" y="4" className="text-[10px] font-mono fill-indigo-300 font-bold">APIs & FastAPI (82%)</text>
            </g>

            {/* Optimization */}
            <g transform="translate(320,310)">
              <circle r="6" className="fill-emerald-400" />
              <text x="12" y="4" className="text-[10px] font-mono fill-emerald-300 font-bold">Optimization (90%)</text>
            </g>

            {/* Adaptability */}
            <g transform="translate(210,340)">
              <circle r="6" className="fill-violet-400" />
              <text y="16" textAnchor="middle" className="text-[10px] font-mono fill-violet-300 font-bold">Adaptability (96%)</text>
            </g>

            {/* Systems Depth */}
            <g transform="translate(120,210)">
              <circle r="6" className="fill-amber-400" />
              <text x="-12" y="4" textAnchor="end" className="text-[10px] font-mono fill-amber-300 font-bold">Problem Solving (78%)</text>
            </g>

            {/* Code Quality */}
            <g transform="translate(160,110)">
              <circle r="6" className="fill-blue-400" />
              <text x="-12" y="4" textAnchor="end" className="text-[10px] font-mono fill-blue-300 font-bold">Architecture (85%)</text>
            </g>
          </svg>
        </div>

        <p className="text-center text-xs font-mono text-slate-400 pt-2">
          "No two interview paths look exactly the same."
        </p>
      </div>
    </section>
  );
}
