import React from 'react';

export function CandidateCard({ candidate, isSelected, onSelect }) {
  const { member, missions, signals } = candidate;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(candidate);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(candidate)}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:-translate-y-1 ${
        isSelected
          ? 'bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/50'
          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
      }`}
    >
      {/* Header Profile Info */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105 ${
            isSelected 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900' 
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
          }`}>
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              {member.name}
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              )}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{member.jobRole}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
          isSelected 
            ? 'bg-blue-950 border-blue-800 text-blue-300' 
            : 'bg-slate-950 text-slate-500 border-slate-800'
        }`}>
          {member.id}
        </span>
      </div>

      {/* Basic Metrics Strip */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-3.5 pt-2.5 border-t border-slate-800/60">
        <span className="text-slate-300">{member.yearsExperience} Yrs Exp</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400 truncate">{member.education}</span>
      </div>

      {/* TECHNICAL DNA SIGNALS */}
      <div className="mt-3.5 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
          Technical DNA Profile
        </span>
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">RAG & Retrieval</span>
            <span className="text-blue-400 font-bold">●●●●●</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Agentic AI</span>
            <span className="text-indigo-400 font-bold">●●●●○</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300">Vector Indexing</span>
            <span className="text-violet-400 font-bold">●●●●●</span>
          </div>
        </div>
      </div>
    </div>
  );
}
