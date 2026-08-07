import React from 'react';

export function AnalysisState({ isFollowUpNext }) {
  return (
    <div className={`border rounded-xl p-6 text-center space-y-3 my-4 shadow-lg transition-all duration-300 ${
      isFollowUpNext 
        ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/20' 
        : 'bg-slate-900/90 border-blue-500/40 shadow-blue-950/20'
    }`}>
      <div className="flex justify-center items-center gap-2">
        <span className={`w-2 h-2 rounded-full animate-ping ${isFollowUpNext ? 'bg-emerald-400' : 'bg-blue-500'}`}></span>
        <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isFollowUpNext ? 'text-emerald-400' : 'text-blue-400'}`}>
          ANALYZING RESPONSE...
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-300">
        <p className="animate-pulse">Understanding reasoning & technical depth...</p>
        <p className="text-slate-500 text-[11px]">
          {isFollowUpNext 
            ? 'Preparing adaptive probe based on technical coverage...' 
            : 'Selecting next technical domain question...'}
        </p>
      </div>

      <div className="w-48 mx-auto bg-slate-950 rounded-full h-1 overflow-hidden border border-slate-800">
        <div className={`h-1 animate-pulse w-full bg-gradient-to-r ${
          isFollowUpNext ? 'from-emerald-600 via-teal-500 to-emerald-400' : 'from-blue-600 via-indigo-500 to-blue-400'
        }`}></div>
      </div>
    </div>
  );
}
