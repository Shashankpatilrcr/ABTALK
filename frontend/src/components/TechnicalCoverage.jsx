import React from 'react';

export function TechnicalCoverage({ missions }) {
  if (!missions || missions.length === 0) return null;

  // Extract key topic tags from mission titles
  const topicTags = missions.slice(0, 5).map(m => {
    let tag = m.title;
    if (tag.includes('&')) tag = tag.split('&')[0];
    return tag.trim();
  });

  return (
    <div className="space-y-2 mt-4">
      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        Technical Coverage Focus
      </div>
      <div className="flex flex-wrap gap-1.5">
        {topicTags.map((topic, i) => (
          <span 
            key={i} 
            className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
          >
            {topic}
          </span>
        ))}
        {missions.length > 5 && (
          <span className="inline-block text-[11px] px-1.5 py-0.5 rounded bg-slate-900/50 border border-slate-800/50 text-slate-500 font-mono">
            +{missions.length - 5} more
          </span>
        )}
      </div>
    </div>
  );
}
