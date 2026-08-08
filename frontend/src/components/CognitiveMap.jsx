import React, { useState } from 'react';

export function CognitiveMap({ 
  knowledgeMap, 
  activeTopic, 
  exploredTopics = [], 
  isFollowUp = false 
}) {
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // High-visibility coordinate layout for 8 technical nodes + Root
  const layoutCoords = {
    rag_retrieval: { x: 130, y: 100, label: "RAG Retrieval" },
    rag_gen: { x: 370, y: 100, label: "RAG Generation" },
    embeddings: { x: 130, y: 190, label: "Embeddings" },
    vector_db: { x: 130, y: 280, label: "Vector Databases" },
    prompt_eng: { x: 370, y: 190, label: "Prompt Engineering" },
    agentic_ai: { x: 250, y: 360, label: "Agentic AI" },
    mcp: { x: 370, y: 360, label: "Model Context Protocol" },
    observability: { x: 250, y: 440, label: "Observability & Triads" },
  };

  const nodes = knowledgeMap?.nodes ? Object.values(knowledgeMap.nodes) : [];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[500px] shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] pointer-events-none" />

      <div className="relative z-10">
        {/* Header & Mobile Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              <span>✦</span> Cognitive Map 2.0
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isFollowUp && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded shadow-md">
                ✦ DEEPER PROBE
              </span>
            )}
            
            <button 
              onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
              className="lg:hidden text-xs font-mono text-slate-300 border border-slate-700 bg-slate-950 px-2.5 py-1 rounded"
            >
              {isMobileCollapsed ? 'Show Map' : 'Hide Map'}
            </button>
          </div>
        </div>

        <p className="hidden lg:block text-xs text-slate-400 mb-3 leading-relaxed">
          Real-time knowledge exploration tree mapping candidate technical responses.
        </p>

        {/* SVG Graph Visualization Container */}
        <div className={`${isMobileCollapsed ? 'hidden lg:block' : 'block'} relative w-full overflow-hidden flex justify-center items-center my-1 bg-slate-950/90 border border-slate-800/80 rounded-xl p-3 shadow-inner`}>
          <svg viewBox="0 0 500 490" className="w-full h-auto max-h-[440px] drop-shadow-md">
            {/* Base Hierarchy Connection Lines */}
            <line x1="250" y1="35" x2="130" y2="100" stroke={activeTopic === 'rag_retrieval' || exploredTopics.includes('rag_retrieval') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'rag_retrieval' ? "3" : "2"} strokeDasharray="4 4" className="transition-all duration-500" />
            <line x1="250" y1="35" x2="370" y2="100" stroke={activeTopic === 'rag_gen' || exploredTopics.includes('rag_gen') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'rag_gen' ? "3" : "2"} strokeDasharray="4 4" className="transition-all duration-500" />
            <line x1="130" y1="100" x2="130" y2="190" stroke={activeTopic === 'embeddings' || exploredTopics.includes('embeddings') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'embeddings' ? "3" : "2"} className="transition-all duration-500" />
            <line x1="130" y1="190" x2="130" y2="280" stroke={activeTopic === 'vector_db' || exploredTopics.includes('vector_db') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'vector_db' ? "3" : "2"} className="transition-all duration-500" />
            <line x1="370" y1="100" x2="370" y2="190" stroke={activeTopic === 'prompt_eng' || exploredTopics.includes('prompt_eng') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'prompt_eng' ? "3" : "2"} className="transition-all duration-500" />
            <line x1="130" y1="280" x2="250" y2="360" stroke={activeTopic === 'agentic_ai' || exploredTopics.includes('agentic_ai') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'agentic_ai' ? "3" : "2"} className="transition-all duration-500" />
            <line x1="250" y1="360" x2="370" y2="360" stroke={activeTopic === 'mcp' || exploredTopics.includes('mcp') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'mcp' ? "3" : "2"} className="transition-all duration-500" />
            <line x1="250" y1="360" x2="250" y2="440" stroke={activeTopic === 'observability' || exploredTopics.includes('observability') ? "#3b82f6" : "#334155"} strokeWidth={activeTopic === 'observability' ? "3" : "2"} className="transition-all duration-500" />

            {/* Root Node */}
            <g transform="translate(250, 35)">
              <circle r="18" className="fill-slate-950 stroke-blue-500 animate-pulse" strokeWidth="2.5" />
              <text y="5" textAnchor="middle" className="fill-blue-300 text-xs font-bold font-mono">RAG</text>
            </g>

            {/* Concept Nodes */}
            {nodes.map((node) => {
              const coords = layoutCoords[node.id] || { x: 250, y: 200, label: node.label };
              const isCurrent = activeTopic === node.id;
              const isExplored = exploredTopics.includes(node.id) && !isCurrent;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="transition-all duration-500 ease-out cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Pulsing Aura Ring for CURRENT active node */}
                  {isCurrent && (
                    <>
                      <circle 
                        r={isFollowUp ? "28" : "24"} 
                        className={`animate-ping opacity-75 ${
                          isFollowUp ? 'fill-emerald-400/30' : 'fill-blue-400/30'
                        }`}
                      />
                      <circle 
                        r={isFollowUp ? "26" : "22"} 
                        className={`animate-pulse ${
                          isFollowUp 
                            ? 'fill-emerald-500/20 stroke-emerald-400' 
                            : 'fill-blue-500/20 stroke-blue-400'
                        }`} 
                        strokeWidth="2" 
                      />
                    </>
                  )}

                  {/* Core Circle */}
                  <circle 
                    r={isCurrent ? "14" : isExplored ? "11" : "9"} 
                    className={`transition-all duration-500 ${
                      isCurrent 
                        ? isFollowUp ? 'fill-emerald-400 stroke-white scale-110' : 'fill-blue-500 stroke-white scale-110' 
                        : isExplored 
                          ? 'fill-indigo-900 stroke-indigo-400' 
                          : 'fill-slate-950 stroke-slate-700'
                    }`} 
                    strokeWidth={isCurrent ? "3" : "2"} 
                  />

                  {/* Visible Text Label Pill */}
                  <g transform={`translate(${coords.x > 250 ? 22 : -22}, 4)`}>
                    <rect 
                      x={coords.x > 250 ? "0" : "-130"} 
                      y="-12" 
                      width="130" 
                      height="20" 
                      rx="4"
                      className={`transition-all duration-300 ${
                        isCurrent 
                          ? isFollowUp ? 'fill-emerald-950 stroke-emerald-400' : 'fill-blue-950 stroke-blue-400 shadow-lg'
                          : isExplored 
                            ? 'fill-slate-900/90 stroke-indigo-700/60' 
                            : 'fill-slate-950/90 stroke-slate-800/60'
                      }`}
                      strokeWidth={isCurrent ? "1.5" : "1"}
                    />
                    <text 
                      x={coords.x > 250 ? "8" : "-8"} 
                      y="2" 
                      textAnchor={coords.x > 250 ? "start" : "end"} 
                      className={`text-[11px] font-mono font-bold transition-colors ${
                        isCurrent 
                          ? isFollowUp ? 'fill-emerald-300' : 'fill-blue-300' 
                          : isExplored 
                            ? 'fill-slate-200' 
                            : 'fill-slate-400'
                      }`}
                    >
                      {coords.label || node.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Active Concept Footer & Legend */}
      <div className="bg-slate-950/90 border border-slate-800/80 p-3.5 rounded-xl text-xs space-y-2.5 mt-3 relative z-10">
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">Active Concept Focus</span>
          <span className={`font-bold uppercase tracking-wider ${isFollowUp ? 'text-emerald-400' : 'text-blue-400'}`}>
            ✦ {activeTopic ? (layoutCoords[activeTopic]?.label || activeTopic) : 'RAG Retrieval'}
          </span>
        </div>

        {/* 3 Visual States Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span>Unexplored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>Explored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Current</span>
          </div>
        </div>
      </div>
    </div>
  );
}
