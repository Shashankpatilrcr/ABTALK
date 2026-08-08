// src/components/KnowledgeEvidencePopover.jsx
import React from 'react';
import { KNOWLEDGE_STATES } from '../lib/knowledgeProfileEngine';

export function KnowledgeEvidencePopover({ topicData, onClose }) {
  if (!topicData) return null;

  const {
    name,
    state,
    score,
    evidence = [],
    hasRecovered,
    triggeredFollowUp,
    confidence,
  } = topicData;

  const isGap = state === KNOWLEDGE_STATES.GAP;
  const isStrong = state === KNOWLEDGE_STATES.STRONG;
  const isPartial = state === KNOWLEDGE_STATES.PARTIAL;
  const isUnexplored = state === KNOWLEDGE_STATES.UNEXPLORED;

  const badgeColor = isStrong
    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800/80'
    : isPartial
      ? 'bg-amber-950/90 text-amber-400 border-amber-800/80'
      : isGap
        ? 'bg-red-950/90 text-red-400 border-red-800/80'
        : 'bg-slate-950/90 text-slate-400 border-slate-800/80';

  const icon = isStrong ? '🟢' : isPartial ? '🟡' : isGap ? '🔴' : '⚪';

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-2xl z-50 text-xs font-sans max-w-sm w-full space-y-3 animate-fadeIn relative">
      {/* Top Header */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <h4 className="font-bold text-slate-100 text-sm">{name}</h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Confidence: <span className="text-slate-200 capitalize font-bold">{confidence}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${badgeColor}`}>
            {state}
          </span>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 font-mono text-xs p-1"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recovery Badge if applicable */}
      {hasRecovered && (
        <div className="bg-emerald-950/60 border border-emerald-800/60 p-2 rounded-lg text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
          <span>✦</span>
          <span><strong>Recovered during interview:</strong> Candidate improved understanding on follow-up probe.</span>
        </div>
      )}

      {/* Primary Status Banner */}
      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1">
        <div className="flex justify-between text-slate-300">
          <span>Score Assessment:</span>
          <span className="font-bold text-slate-100">{score !== null ? `${score}%` : 'Not Assessed'}</span>
        </div>
        {triggeredFollowUp && (
          <div className="text-violet-400 text-[10px] flex items-center gap-1">
            <span>✦</span> Triggered targeted adaptive follow-up
          </div>
        )}
      </div>

      {/* Evidence Breakdown */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
          Observed Evidence ({evidence.length} signals)
        </span>

        {isUnexplored || evidence.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic p-2 bg-slate-950/40 rounded border border-slate-800/40">
            No questions asked yet for this topic. Evidence suggests unassessed state.
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            {evidence.map((e, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/90 border border-slate-800/80 p-2.5 rounded-lg space-y-1 text-[11px]"
              >
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-blue-400">
                    Q{e.questionNumber} {e.isFollowUp ? '✦ Probe' : 'Question'}
                  </span>
                  <span className={`font-bold ${
                    e.state === KNOWLEDGE_STATES.STRONG
                      ? 'text-emerald-400'
                      : e.state === KNOWLEDGE_STATES.PARTIAL
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}>
                    {e.score}%
                  </span>
                </div>
                <p className="text-slate-300 line-clamp-2 leading-relaxed">{e.questionText}</p>
                <p className="text-slate-400 text-[10px] pt-1 border-t border-slate-800/60 italic">
                  Signal: {e.signal}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
