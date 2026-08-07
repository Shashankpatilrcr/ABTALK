import React from 'react';

export function AssessmentConfig({ selectedCandidate }) {
  if (!selectedCandidate) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-center text-slate-500 text-sm font-mono">
        Select a candidate profile to view assessment blueprint.
      </div>
    );
  }

  const { member, signals } = selectedCandidate;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
      {/* Target Candidate Summary */}
      <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Target Candidate</span>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">{member.name}</h3>
          <p className="text-xs text-slate-400 font-medium">{member.jobRole} • {member.yearsExperience} yrs exp</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
          ✦ READY TO LAUNCH
        </span>
      </div>

      {/* Segmented Blueprint Selectors */}
      <div className="space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
          Assessment Blueprint Config
        </span>

        {/* Mode Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 block">Interview Protocol Mode</label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button className="p-2.5 rounded-lg border border-blue-500 bg-blue-950/60 text-blue-300 font-semibold text-left flex items-center justify-between">
              <span>✦ Adaptive AI</span>
              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded">ACTIVE</span>
            </button>
            <button className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-500 text-left hover:border-slate-700">
              <span>Standard Fixed</span>
            </button>
          </div>
        </div>

        {/* Intensity & Depth Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/70 border border-slate-800/60 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Follow-up Depth</span>
            <span className="font-bold text-slate-200 block text-xs">Deep Probing (Adaptive)</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/60 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Question Count</span>
            <span className="font-bold text-slate-200 block text-xs">8 Focus Questions</span>
          </div>
        </div>

        {/* Topic Focus Chips */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Topic Focus Blueprint</span>
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50 text-blue-300">RAG & Retrieval</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50 text-indigo-300">LLMs & Steering</span>
            <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/50 text-violet-300">Vector Search</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Agentic AI</span>
          </div>
        </div>
      </div>

      {/* Blueprint Strategy Box */}
      <div className="bg-slate-950/80 border border-slate-800/70 p-4 rounded-xl text-xs space-y-1.5">
        <div className="text-slate-300 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Evaluation Strategy
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Adaptive engine will evaluate reasoning depth and automatically trigger follow-up probes upon detecting incomplete vector index or retrieval answers.
        </p>
      </div>
    </div>
  );
}
