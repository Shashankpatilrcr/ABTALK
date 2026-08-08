// src/components/KnowledgeGapRadar.jsx
import React, { useState } from 'react';
import { KNOWLEDGE_STATES, TOPIC_DEFINITIONS } from '../lib/knowledgeProfileEngine';
import { KnowledgeSummary } from './KnowledgeSummary';
import { KnowledgeEvidencePopover } from './KnowledgeEvidencePopover';

export function KnowledgeGapRadar({ profileData, compact = false }) {
  const [activePopoverTopic, setActivePopoverTopic] = useState(null);

  if (!profileData) return null;

  const { topics = [], summary = {} } = profileData;

  // Use top 6-8 topics for radar chart polygon
  const radarTopics = topics.slice(0, 8);
  const numAxes = radarTopics.length || 6;
  const centerX = 220;
  const centerY = 200;
  const radius = 140;

  // Calculate polygon points for each level (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index, valueRatio) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const x = centerX + radius * valueRatio * Math.cos(angle);
    const y = centerY + radius * valueRatio * Math.sin(angle);
    return { x, y, angle };
  };

  // Build candidate profile polygon points
  const polygonPoints = radarTopics
    .map((t, idx) => {
      const scoreRatio = t.score !== null ? Math.max(0.15, t.score / 100) : 0.1;
      const { x, y } = getCoordinates(idx, scoreRatio);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
      {/* Background Atmosphere Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent)] pointer-events-none" />

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
              🧠 Knowledge Gap Radar
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time evaluation signals mapped across candidate technical competency dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-300">
            {summary.totalExplored} / {radarTopics.length} Explored
          </span>
        </div>
      </div>

      {/* Summary Section */}
      <KnowledgeSummary summary={summary} />

      {/* Radar Chart Body + Popover Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* SVG Radar Chart Visualization (7 Cols on LG) */}
        <div className="lg:col-span-7 flex justify-center items-center relative bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 shadow-inner">
          
          <svg viewBox="0 0 440 400" className="w-full max-w-[440px] h-auto drop-shadow-xl overflow-visible">
            
            {/* Concentric Grid Polygons */}
            {levels.map((lvl, lIdx) => {
              const pts = radarTopics
                .map((_, idx) => {
                  const { x, y } = getCoordinates(idx, lvl);
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <polygon
                  key={lIdx}
                  points={pts}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={lIdx === levels.length - 1 ? "1.5" : "1"}
                  strokeDasharray={lIdx < levels.length - 1 ? "3 3" : "none"}
                  opacity="0.6"
                />
              );
            })}

            {/* Axes Spoke Lines */}
            {radarTopics.map((_, idx) => {
              const { x, y } = getCoordinates(idx, 1.0);
              return (
                <line
                  key={idx}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}

            {/* Candidate Evaluated Area Polygon */}
            <polygon
              points={polygonPoints}
              className="fill-blue-500/25 stroke-blue-400 transition-all duration-700 ease-out"
              strokeWidth="2.5"
            />

            {/* Axis Node Markers & Interactive Buttons */}
            {radarTopics.map((topic, idx) => {
              const scoreRatio = topic.score !== null ? Math.max(0.15, topic.score / 100) : 0.1;
              const { x, y } = getCoordinates(idx, scoreRatio);
              const labelCoords = getCoordinates(idx, 1.25);

              const isGap = topic.state === KNOWLEDGE_STATES.GAP;
              const isStrong = topic.state === KNOWLEDGE_STATES.STRONG;
              const isPartial = topic.state === KNOWLEDGE_STATES.PARTIAL;
              const isUnexplored = topic.state === KNOWLEDGE_STATES.UNEXPLORED;

              const nodeColor = isStrong
                ? 'fill-emerald-400 stroke-white'
                : isPartial
                  ? 'fill-amber-400 stroke-white'
                  : isGap
                    ? 'fill-red-500 stroke-white'
                    : 'fill-slate-700 stroke-slate-900';

              const icon = isStrong ? '🟢' : isPartial ? '🟡' : isGap ? '🔴' : '⚪';

              return (
                <g key={topic.topicId} className="cursor-pointer group" onClick={() => setActivePopoverTopic(topic)}>
                  {/* Outer Pulsing Aura for GAPs */}
                  {isGap && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      className="fill-red-500/20 stroke-red-500 animate-ping"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Core Node Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isGap || isStrong ? "7" : "5.5"}
                    className={`transition-all duration-300 ${nodeColor}`}
                    strokeWidth="2"
                  />

                  {/* Accessible Label Text */}
                  <text
                    x={labelCoords.x}
                    y={labelCoords.y}
                    textAnchor={labelCoords.x > centerX ? "start" : labelCoords.x < centerX ? "end" : "middle"}
                    dominantBaseline="middle"
                    className={`text-[11px] font-mono font-bold transition-colors ${
                      isGap
                        ? 'fill-red-400 font-extrabold'
                        : isStrong
                          ? 'fill-emerald-300 font-bold'
                          : isPartial
                            ? 'fill-amber-300 font-semibold'
                            : 'fill-slate-400'
                    }`}
                  >
                    {icon} {topic.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Topic List & Active Popover (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
            <span className="font-bold uppercase tracking-wider">Assessed Topics</span>
            <span className="text-slate-400">Click topic for evidence</span>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {radarTopics.map((topic) => {
              const isGap = topic.state === KNOWLEDGE_STATES.GAP;
              const isStrong = topic.state === KNOWLEDGE_STATES.STRONG;
              const isPartial = topic.state === KNOWLEDGE_STATES.PARTIAL;
              const isUnexplored = topic.state === KNOWLEDGE_STATES.UNEXPLORED;

              return (
                <div
                  key={topic.topicId}
                  onClick={() => setActivePopoverTopic(topic)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between hover:translate-y-[-1px] ${
                    isGap
                      ? 'bg-red-950/40 border-red-800/60 hover:border-red-600'
                      : isStrong
                        ? 'bg-slate-950/80 border-emerald-900/50 hover:border-emerald-700'
                        : isPartial
                          ? 'bg-slate-950/80 border-amber-900/50 hover:border-amber-700'
                          : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {isStrong ? '🟢' : isPartial ? '🟡' : isGap ? '🔴' : '⚪'}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{topic.name}</span>
                      {topic.hasRecovered && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                          ✦ RECOVERED
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 pl-5 block">
                      {topic.evidenceCount} signal{topic.evidenceCount !== 1 ? 's' : ''} • Day {topic.day}
                    </span>
                  </div>

                  <div className="font-mono text-right">
                    <span className={`text-xs font-bold ${
                      isStrong ? 'text-emerald-400' : isPartial ? 'text-amber-400' : isGap ? 'text-red-400' : 'text-slate-500'
                    }`}>
                      {topic.score !== null ? `${topic.score}%` : 'Unexplored'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline Active Popover Card */}
          {activePopoverTopic && (
            <div className="pt-2 animate-fadeIn">
              <KnowledgeEvidencePopover
                topicData={activePopoverTopic}
                onClose={() => setActivePopoverTopic(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recovered During Interview Highlight Showcase Section */}
      {summary.recoveredTopics && summary.recoveredTopics.length > 0 && (
        <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-xl space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✦</span>
            <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
              Recovered Knowledge Signals During Adaptive Probing
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {summary.recoveredTopics.map((rt) => (
              <div key={rt.topicId} className="bg-slate-950/80 border border-emerald-800/40 p-2.5 rounded-lg space-y-1">
                <span className="font-bold text-slate-100 block">{rt.name}</span>
                <p className="text-[11px] text-slate-300">
                  Initial gap identified, but candidate successfully recovered score to <span className="text-emerald-400 font-bold">{rt.score}%</span> on follow-up probes.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
