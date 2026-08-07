import React, { useState } from 'react';

export function InterviewJourney({ questions = [], currentQuestionIndex = 0 }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Slim Exploration Indicator Bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 px-1">
        {questions.map((q, idx) => {
          const isCompleted = idx < currentQuestionIndex;
          const isCurrent = idx === currentQuestionIndex;
          const isFollowUp = q.isFollowUp;

          let dotStyle = 'bg-slate-800 border-slate-700';
          let symbol = null;

          if (isCurrent) {
            dotStyle = isFollowUp
              ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-900/50'
              : 'bg-blue-500 border-blue-400 shadow-md shadow-blue-900/50';
          } else if (isCompleted) {
            dotStyle = isFollowUp
              ? 'bg-emerald-900 border-emerald-600'
              : 'bg-blue-900 border-blue-700';
          }

          if (isFollowUp) symbol = '✦';

          return (
            <React.Fragment key={q.id || idx}>
              {/* Connector line between nodes */}
              {idx > 0 && (
                <div className={`h-px flex-1 min-w-[8px] max-w-[24px] transition-colors duration-300 ${
                  idx <= currentQuestionIndex ? 'bg-blue-800' : 'bg-slate-800'
                }`} />
              )}

              {/* Node */}
              <div
                className="relative group shrink-0 cursor-pointer"
                onClick={() => isCompleted && setSelectedNode(selectedNode?.id === q.id ? null : q)}
              >
                <div className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                  isCurrent ? 'w-6 h-6 text-[9px] scale-110' : 'w-4 h-4 text-[8px]'
                } ${dotStyle}`}>
                  {symbol && (
                    <span className={`${isCurrent ? 'text-emerald-200' : 'text-emerald-600'} font-bold leading-none`}>
                      {symbol}
                    </span>
                  )}
                  {isCurrent && !symbol && (
                    <span className="w-2 h-2 rounded-full bg-white/80 block" />
                  )}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-44 bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-[10px] text-slate-200 space-y-1">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400">Q{idx + 1}</span>
                    {isFollowUp && (
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                        ✦ ADAPTIVE
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-slate-100">{q.topic}</div>
                  <div className="text-[9px] text-slate-400">{q.subtopic}</div>
                  {isFollowUp && q.parentQuestionId && (
                    <div className="text-[9px] text-emerald-400 font-mono pt-1 border-t border-slate-800">
                      ↳ Deeper probe following Q{q.parentQuestionId}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Current Step Label */}
        <div className="ml-3 shrink-0 font-mono text-[10px] text-slate-400 whitespace-nowrap">
          Q{currentQuestionIndex + 1}
          {questions[currentQuestionIndex]?.isFollowUp && (
            <span className="text-emerald-400 ml-1">✦</span>
          )}
          <span className="text-slate-600"> / {questions.length}</span>
        </div>
      </div>

      {/* Expanded Node Detail on Click */}
      {selectedNode && (
        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs space-y-1 relative animate-fadeIn">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 text-xs font-mono"
          >
            ✕
          </button>
          <div className="font-mono text-blue-400 font-semibold text-[11px] flex items-center gap-1.5">
            <span>Q{questions.findIndex(q => q.id === selectedNode.id) + 1} — {selectedNode.topic}</span>
            {selectedNode.isFollowUp && (
              <span className="text-emerald-400 text-[10px] bg-emerald-950 border border-emerald-800/60 px-1.5 rounded">✦ Adaptive</span>
            )}
          </div>
          <p className="text-slate-400 italic text-[11px]">"{selectedNode.question}"</p>
        </div>
      )}
    </div>
  );
}
