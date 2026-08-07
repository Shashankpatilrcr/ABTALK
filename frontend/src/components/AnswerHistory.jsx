import React from 'react';

export function AnswerHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-4 pt-2 border-t border-slate-800/80">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Submitted Responses ({history.length})
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {history.map((item, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-500 font-mono text-[10px]">
              <span>Q{idx + 1}: {item.questionTopic}</span>
              <span>{item.timestamp}</span>
            </div>
            <p className="text-slate-300 italic">"{item.answer}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
