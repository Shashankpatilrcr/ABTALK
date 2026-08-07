import React from 'react';

export function CandidateProgress({ signals, missions }) {
  const completed = signals?.missionsCompleted || 0;
  const firstTry = signals?.missionsFirstTry || 0;
  const commitDays = signals?.commitDays || 0;
  const totalCohortDays = 31;
  const progressPct = Math.min(100, Math.round((commitDays / totalCohortDays) * 100));

  return (
    <div className="space-y-3 border-t border-slate-800/80 pt-4 mt-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium uppercase tracking-wider">Learning Journey</span>
        <span className="text-blue-400 font-semibold">{commitDays} / {totalCohortDays} Days Active</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="bg-slate-950/60 border border-slate-800/40 rounded p-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-tight">Completed</div>
          <div className="text-xs font-bold text-slate-200">{completed}</div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/40 rounded p-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-tight">First Attempt</div>
          <div className="text-xs font-bold text-emerald-400">{firstTry}</div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/40 rounded p-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-tight">Missions</div>
          <div className="text-xs font-bold text-indigo-300">{missions?.length || 0}</div>
        </div>
      </div>
    </div>
  );
}
