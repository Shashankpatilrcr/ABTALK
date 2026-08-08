// src/components/KnowledgeSummary.jsx
import React from 'react';

export function KnowledgeSummary({ summary }) {
  if (!summary) return null;

  const {
    strongCount = 0,
    partialCount = 0,
    gapCount = 0,
    unexploredCount = 0,
    primaryGapName,
    recoveredCount = 0,
  } = summary;

  return (
    <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 font-mono text-xs space-y-3 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <span className="font-bold text-slate-200 uppercase tracking-widest text-[11px]">
          ✦ Knowledge Profile Signals
        </span>
        
        {/* Count badges */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
            🟢 {strongCount} Strong
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
            🟡 {partialCount} Partial
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-950/60 border border-red-800/50 px-2 py-0.5 rounded">
            🔴 {gapCount} Gap
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            ⚪ {unexploredCount} Unexplored
          </span>
        </div>
      </div>

      {/* Primary Insights Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="text-slate-300">
          {primaryGapName ? (
            <span>
              Evidence suggests a knowledge gap in <span className="text-red-400 font-bold underline">{primaryGapName}</span>.
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold">
              ✓ No critical knowledge gaps detected across evaluated topics.
            </span>
          )}
        </div>

        {recoveredCount > 0 && (
          <div className="text-violet-400 font-bold flex items-center gap-1.5 bg-violet-950/40 border border-violet-800/50 px-2.5 py-1 rounded">
            <span>✦</span> {recoveredCount} topic{recoveredCount > 1 ? 's' : ''} recovered during adaptive probes
          </div>
        )}
      </div>
    </div>
  );
}
