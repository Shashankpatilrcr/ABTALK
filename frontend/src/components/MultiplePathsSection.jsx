import React from 'react';

export default function MultiplePathsSection() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-b border-slate-800/60">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3 py-1 rounded-full">
          ✦ Adaptive Branching Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          ONE QUESTION. <br />
          <span className="text-blue-400">MULTIPLE PATHS.</span>
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          The candidate's initial answer signal shifts the entire trajectory of technical probing.
        </p>
      </div>

      {/* Elegant Visual Branch Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Starting Question Pill */}
        <div className="max-w-xl mx-auto text-center space-y-2 mb-10">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Root Trigger Question</span>
          <div className="bg-slate-900 border border-blue-500/40 p-4 rounded-xl shadow-lg">
            <p className="text-sm sm:text-base font-semibold text-slate-100 font-mono">
              "How would you design a production RAG system?"
            </p>
          </div>
        </div>

        {/* 2 Visual Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* Path A: Strong Answer Signal */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-6 space-y-5 shadow-xl relative group hover:border-emerald-500/60 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PATH A: STRONG SIGNAL
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ✦ GO DEEPER
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block uppercase">Candidate Response</span>
                "I use hybrid vector search with BM25 reranking and custom chunking."
              </div>

              <div className="flex items-center justify-center text-emerald-400 font-bold text-sm">
                ↓ AI Dynamic Decision
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-500/40 text-emerald-200 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">✦ Follow-Up Deep Probe</span>
                <p className="font-semibold text-xs">"How do you handle context window overflow during reranking?"</p>
              </div>

              {/* Sub-node Badges */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">Context Chunking</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">Vector Search</span>
                <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px]">Latency Optimization</span>
              </div>
            </div>
          </div>

          {/* Path B: Shallow Answer Signal */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-6 space-y-5 shadow-xl relative group hover:border-amber-500/60 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                PATH B: SHALLOW SIGNAL
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                CLARIFY & ASSIST
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-[10px] text-slate-500 block uppercase">Candidate Response</span>
                "I put data in a database and ask OpenAI to retrieve it."
              </div>

              <div className="flex items-center justify-center text-amber-400 font-bold text-sm">
                ↓ AI Dynamic Decision
              </div>

              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/40 text-amber-200 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Clarification Question</span>
                <p className="font-semibold text-xs">"What specific vector store or embedding model convert your text?"</p>
              </div>

              {/* Sub-node Badges */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">Retrieval Basics</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">Embeddings 101</span>
                <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px]">Guided Probe</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
