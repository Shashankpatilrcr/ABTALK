import React, { useState } from 'react';

export function EvidencePanel({ evidenceList }) {
  const [expandedId, setExpandedId] = useState(evidenceList?.[0]?.id || null);

  if (!evidenceList || evidenceList.length === 0) return null;

  return (
    <section className="space-y-4 pt-4 border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></span>
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            Evidence Highlights & Reasoning Traces
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Why the assessment engine reached this score
        </span>
      </div>

      <div className="space-y-3">
        {evidenceList.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div 
              key={item.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-900/90 border-violet-500/40 shadow-lg shadow-violet-950/20' 
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Collapsed Bar / Trigger */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded">
                    Q{item.questionNumber} TRACE
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{item.strengthTitle}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">{item.questionText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Verified Signal
                  </span>
                  <span className="text-xs font-mono text-violet-400">
                    {isExpanded ? 'Hide Trace ▲' : 'View Trace ▼'}
                  </span>
                </div>
              </button>

              {/* Expanded Connected Flow */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                  {/* Step 1: Question Prompt */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      01 Evaluation Prompt
                    </span>
                    <p className="text-xs font-medium text-slate-200 bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg">
                      {item.questionText}
                    </p>
                  </div>

                  {/* Connector Arrow */}
                  <div className="flex justify-center -my-1 text-slate-500 font-mono text-xs">
                    ↓ candidate response
                  </div>

                  {/* Step 2: Candidate Answer */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                      02 Recorded Candidate Answer
                    </span>
                    <p className="text-xs italic text-slate-300 bg-blue-950/20 border border-blue-900/40 p-3 rounded-lg leading-relaxed">
                      "{item.candidateAnswer}"
                    </p>
                  </div>

                  {/* Connector Arrow */}
                  <div className="flex justify-center -my-1 text-slate-500 font-mono text-xs">
                    ↓ ai evaluation signal
                  </div>

                  {/* Step 3: Assessment Signal */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      03 Verified Technical Signal
                    </span>
                    <div className="text-xs text-slate-200 bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-lg flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <p className="leading-relaxed">{item.observationSignal}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
