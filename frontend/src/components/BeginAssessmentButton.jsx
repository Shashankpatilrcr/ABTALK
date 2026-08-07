import React from 'react';

export function BeginAssessmentButton({ selectedCandidate, onBegin }) {
  const isEnabled = Boolean(selectedCandidate);

  return (
    <button
      disabled={!isEnabled}
      onClick={() => isEnabled && onBegin(selectedCandidate)}
      className={`group w-full py-4 px-6 rounded-2xl font-mono text-xs uppercase font-bold tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
        isEnabled
          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
          : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800 shadow-none'
      }`}
    >
      <span>BEGIN AI ASSESSMENT MISSION</span>
      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1.5">
        →
      </span>
    </button>
  );
}
