import React from 'react';

export function QuestionCard({ question }) {
  if (!question) return null;

  return (
    <div className={`rounded-2xl p-6 sm:p-8 space-y-5 transition-all duration-300 relative overflow-hidden ${
      question.isFollowUp 
        ? 'bg-slate-900/90 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/30' 
        : 'bg-slate-900/60 border border-slate-800/80 shadow-xl'
    }`}>
      {/* Category Tag Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap font-mono">
          <span className="text-xs font-bold px-3 py-1 rounded-md bg-blue-950/80 border border-blue-800/60 text-blue-300 uppercase tracking-widest">
            ✦ {question.topic}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
            {question.subtopic}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {question.difficultyTrend || question.difficulty}
          </span>
        </div>

        {question.isFollowUp && (
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1 rounded-md flex items-center gap-1.5 shadow-md animate-pulse">
            <span>✦</span> ADAPTIVE FOLLOW-UP
          </span>
        )}
      </div>

      {/* Adaptive Follow-up Explanation Signal */}
      {question.isFollowUp && (
        <div className="text-xs text-emerald-300 font-mono flex items-start gap-2 bg-emerald-950/40 border border-emerald-800/50 p-3.5 rounded-xl leading-relaxed">
          <span className="text-emerald-400 font-bold">↳</span>
          <div>
            <span className="font-bold text-emerald-400 block uppercase text-[10px]">Adaptive Signal Triggered</span>
            <span>The interviewer is probing deeper into context boundaries based on your previous response.</span>
          </div>
        </div>
      )}

      {/* Main Large Question Canvas Typography */}
      <div className="pt-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed tracking-tight">
          "{question.question}"
        </h2>
      </div>
    </div>
  );
}
