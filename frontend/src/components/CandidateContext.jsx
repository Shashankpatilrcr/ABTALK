import React from 'react';

function SignalBar({ label, value, max = 5, color = 'bg-blue-500' }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] font-mono text-slate-400 w-16 truncate">{label}</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < value ? color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function CandidateContext({ candidate, currentStep, totalSteps, currentQuestion }) {
  if (!candidate) return null;
  const { member, signals } = candidate;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden">
      {/* Identity Header */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-900/70 border border-blue-700/50 text-blue-300 flex items-center justify-center text-sm font-bold font-mono shrink-0">
            {member.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-100 truncate">{member.name}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate">{member.jobRole}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Interview Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Interview Progress</span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/60">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Current Focus */}
        <div className="space-y-1 border-t border-slate-800/60 pt-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Current Focus</span>
          <div className="text-xs font-semibold text-slate-100 mt-0.5">
            {currentQuestion?.topic || '—'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {currentQuestion?.subtopic || '—'}
          </div>
          {currentQuestion?.difficultyTrend && (
            <span className="inline-block mt-1 text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 px-2 py-0.5 rounded">
              {currentQuestion.difficultyTrend}
            </span>
          )}
        </div>

        {/* Technical DNA Signals */}
        <div className="space-y-2.5 border-t border-slate-800/60 pt-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Technical Signals</span>
          <div className="space-y-2">
            <SignalBar label="RAG" value={signals?.ragStrength ?? 5} color="bg-blue-500" />
            <SignalBar label="Retrieval" value={signals?.retrievalStrength ?? 4} color="bg-indigo-400" />
            <SignalBar label="Vector DB" value={signals?.vectorDbStrength ?? 3} color="bg-violet-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

