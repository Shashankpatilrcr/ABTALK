import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MOCK_CANDIDATES } from '../lib/candidatesData';
import { ThemeToggle } from '../components/ThemeToggle';

export default function BlueprintPage({ appTheme, onToggleTheme }) {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('rag');
  const [activeDepth, setActiveDepth] = useState('DEEP');

  // Load candidate from sessionStorage or fallback to first candidate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selected_candidate');
      if (stored) {
        try {
          setCandidate(JSON.parse(stored));
        } catch (e) {
          setCandidate(MOCK_CANDIDATES[0]);
        }
      } else {
        setCandidate(MOCK_CANDIDATES[0]);
      }
    }
  }, []);

  const domains = [
    {
      id: 'python',
      label: 'Python Fundamentals',
      status: 'EXPLORED',
      icon: '●',
      priority: 'HIGH',
      depth: 'STANDARD',
      color: 'blue',
      why: "Core language foundation for backend evaluation.",
      concepts: [
        { name: 'Data Structures & Type Hints', status: '✓' },
        { name: 'Memory & Garbage Collection', status: '✓' },
        { name: 'Generators & Iterators', status: '○' },
      ],
      strategy: ['Verify syntax & typing', 'Evaluate memory efficiency', 'Probe execution performance'],
      evidence: ['Clean code layout', 'Understands GIL impact'],
    },
    {
      id: 'fastapi',
      label: 'Backend & APIs',
      status: 'IN PROGRESS',
      icon: '◉',
      priority: 'HIGH',
      depth: 'DEEP',
      color: 'blue',
      why: "Matches target job role requirements.",
      concepts: [
        { name: 'FastAPI Routing & Schemas', status: '✓' },
        { name: 'Async / Await Concurrency', status: '✓' },
        { name: 'Dependency Injection', status: '○' },
      ],
      strategy: ['Start with endpoint design', 'Test async IO bounds', 'Probe middleware safety'],
      evidence: ['Non-blocking IO understanding', 'Pydantic schema validation'],
    },
    {
      id: 'rag',
      label: 'RAG Architecture',
      status: 'ADAPTIVE',
      icon: '✦',
      priority: 'CRITICAL',
      depth: 'DEEP PROBE',
      color: 'emerald',
      why: "Candidate demonstrated prior experience in AI/RAG systems.",
      concepts: [
        { name: 'Embeddings & Distance Metrics', status: '✓' },
        { name: 'Retrieval & Hybrid Search', status: '✓' },
        { name: 'Context Chunking Strategies', status: '○' },
        { name: 'Context Window Optimization', status: '○' },
      ],
      strategy: ['Start with retrieval basics', 'Test practical vector DBs', 'Probe chunking trade-offs', 'Evaluate latency under scale'],
      evidence: ['Retrieval accuracy reasoning', 'Chunking trade-off awareness', 'Latency awareness'],
    },
    {
      id: 'vector_db',
      label: 'Vector Databases',
      status: 'PLANNED',
      icon: '○',
      priority: 'MEDIUM',
      depth: 'STANDARD',
      color: 'indigo',
      why: "Essential storage layer for semantic search.",
      concepts: [
        { name: 'HNSW vs IVF Indexing', status: '○' },
        { name: 'Metadata Filtering', status: '○' },
        { name: 'Persistence & Sharding', status: '○' },
      ],
      strategy: ['Test vector indexing basics', 'Evaluate filtering trade-offs'],
      evidence: ['Index type selection reasoning'],
    },
    {
      id: 'optimization',
      label: 'Optimization & Latency',
      status: 'PLANNED',
      icon: '○',
      priority: 'HIGH',
      depth: 'DEEP',
      color: 'violet',
      why: "Key differentiator for senior engineering candidates.",
      concepts: [
        { name: 'Batch Inference & Caching', status: '○' },
        { name: 'Quantization Trade-offs', status: '○' },
        { name: 'Profiling & Bottlenecks', status: '○' },
      ],
      strategy: ['Assess profiling approach', 'Probe memory vs throughput'],
      evidence: ['System profiling proficiency'],
    },
    {
      id: 'system_design',
      label: 'System Architecture',
      status: 'PLANNED',
      icon: '○',
      priority: 'HIGH',
      depth: 'DEEP',
      color: 'amber',
      why: "Evaluates end-to-end component design.",
      concepts: [
        { name: 'Microservices & Event Loops', status: '○' },
        { name: 'API Contracts & Schemas', status: '○' },
        { name: 'Fault Tolerance & Retries', status: '○' },
      ],
      strategy: ['Diagram high-level topology', 'Test failover strategies'],
      evidence: ['Distributed systems trade-offs'],
    },
  ];

  const currentDomainObj = domains.find((d) => d.id === selectedDomain) || domains[2];

  const handleBeginInterview = () => {
    if (candidate) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selected_candidate', JSON.stringify(candidate));
      }
      router.push(`/interview?candidateId=${candidate.member?.id || 'c1'}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white p-4 sm:p-6 lg:p-10 transition-colors duration-300">
      {/* Radial Atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fadeIn">
        
        {/* Top Navbar Header */}
        <header className="border-b border-slate-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/launchpad"
              className="text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900/80 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>← Launchpad</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded font-bold">
                  ✦ INTERVIEW BLUEPRINT
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ● READY FOR INTERVIEW
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">An adaptive assessment plan built around the candidate.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={appTheme} onToggle={onToggleTheme} />
            <button
              onClick={handleBeginInterview}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2 group"
            >
              <span>BEGIN INTERVIEW</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </header>

        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">CANDIDATE</span>
            <span className="text-slate-100 font-bold truncate block">{candidate?.member?.name || 'Alex Chen'}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">ROLE</span>
            <span className="text-blue-400 font-bold truncate block">{candidate?.member?.jobRole || 'Senior AI Engineer'}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">ASSESSMENT</span>
            <span className="text-slate-200 font-bold block">Adaptive Technical</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">DOMAINS</span>
            <span className="text-slate-100 font-bold block">8 Domains</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">CONCEPTS</span>
            <span className="text-slate-100 font-bold block">24 Concepts</span>
          </div>
          <div className="bg-slate-900/80 border border-emerald-500/40 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-emerald-400 uppercase block font-bold">ADAPTIVE DEPTH</span>
            <span className="text-emerald-300 font-bold block">HIGH (DEEP PROBE)</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">EST. COVERAGE</span>
            <span className="text-slate-200 font-bold block">~75 min</span>
          </div>
        </div>

        {/* MAIN VISUAL GRID: Blueprint Map & Domain Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Interactive Blueprint Map */}
          <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 font-mono text-xs">
              <span className="text-slate-200 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Adaptive Blueprint Map
              </span>
              <span className="text-slate-400 text-[11px]">Click domain node to view assessment strategy</span>
            </div>

            {/* Topology Map Graphic */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/60 relative overflow-hidden">
              <svg viewBox="0 0 650 380" className="w-full h-auto drop-shadow-md selection:bg-none">
                {/* Center Lines */}
                <line x1="325" y1="190" x2="160" y2="100" stroke="#3b82f6" strokeWidth="2" />
                <line x1="325" y1="190" x2="490" y2="100" stroke="#3b82f6" strokeWidth="2" />
                <line x1="325" y1="190" x2="160" y2="280" stroke="#10b981" strokeWidth="2.5" />
                <line x1="325" y1="190" x2="490" y2="280" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="325" y1="190" x2="325" y2="70" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="325" y1="190" x2="325" y2="310" stroke="#8b5cf6" strokeWidth="2" />

                {/* Sub-branch lines for RAG (160,280) */}
                <line x1="160" y1="280" x2="80" y2="340" stroke="#10b981" strokeWidth="2" />
                <line x1="160" y1="280" x2="160" y2="350" stroke="#10b981" strokeWidth="2" />
                <line x1="160" y1="280" x2="240" y2="340" stroke="#10b981" strokeWidth="2" />

                {/* CENTER CANDIDATE NODE */}
                <g transform="translate(325, 190)">
                  <circle r="26" className="fill-slate-950 stroke-blue-500 animate-pulse" strokeWidth="3" />
                  <text y="-2" textAnchor="middle" className="text-[10px] font-mono fill-blue-300 font-bold">CANDIDATE</text>
                  <text y="10" textAnchor="middle" className="text-[9px] font-mono fill-slate-400">PROFILE</text>
                </g>

                {/* DOMAIN NODES */}
                {/* 1. Python */}
                <g
                  transform="translate(160, 100)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('python')}
                >
                  <circle r="14" className={`transition-all ${selectedDomain === 'python' ? 'fill-blue-500 stroke-white scale-125' : 'fill-blue-950 stroke-blue-400'}`} strokeWidth="2" />
                  <rect x="-60" y="-30" width="120" height="20" rx="4" className="fill-slate-950/90 stroke-slate-700" />
                  <text y="-17" textAnchor="middle" className="text-[10px] font-mono fill-slate-200 font-bold">Python (Explored)</text>
                </g>

                {/* 2. FastAPI Backend */}
                <g
                  transform="translate(490, 100)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('fastapi')}
                >
                  <circle r="14" className={`transition-all ${selectedDomain === 'fastapi' ? 'fill-blue-500 stroke-white scale-125' : 'fill-blue-950 stroke-blue-400'}`} strokeWidth="2" />
                  <rect x="-65" y="-30" width="130" height="20" rx="4" className="fill-slate-950/90 stroke-slate-700" />
                  <text y="-17" textAnchor="middle" className="text-[10px] font-mono fill-slate-200 font-bold">Backend & APIs (Active)</text>
                </g>

                {/* 3. RAG Architecture (Adaptive) */}
                <g
                  transform="translate(160, 280)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('rag')}
                >
                  <circle r="22" className="fill-emerald-500/30 stroke-emerald-400 animate-ping opacity-75" />
                  <circle r="16" className={`transition-all ${selectedDomain === 'rag' ? 'fill-emerald-400 stroke-white scale-125' : 'fill-emerald-500 stroke-white'}`} strokeWidth="2.5" />
                  <text y="4" textAnchor="middle" className="text-[10px] font-mono fill-white">✦</text>
                  <rect x="-70" y="-34" width="140" height="22" rx="4" className="fill-emerald-950 stroke-emerald-400" />
                  <text y="-20" textAnchor="middle" className="text-[10px] font-mono fill-emerald-300 font-bold">✦ RAG Architecture</text>
                </g>

                {/* RAG Subnodes */}
                <g transform="translate(80, 340)">
                  <circle r="6" className="fill-emerald-400" />
                  <text y="16" textAnchor="middle" className="text-[9px] font-mono fill-slate-300">Chunking</text>
                </g>
                <g transform="translate(160, 350)">
                  <circle r="6" className="fill-emerald-400" />
                  <text y="16" textAnchor="middle" className="text-[9px] font-mono fill-slate-300">Embeddings</text>
                </g>
                <g transform="translate(240, 340)">
                  <circle r="6" className="fill-emerald-400" />
                  <text y="16" textAnchor="middle" className="text-[9px] font-mono fill-slate-300">Retrieval</text>
                </g>

                {/* 4. Vector DB */}
                <g
                  transform="translate(490, 280)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('vector_db')}
                >
                  <circle r="12" className={`transition-all ${selectedDomain === 'vector_db' ? 'fill-indigo-500 stroke-white' : 'fill-slate-950 stroke-slate-700'}`} strokeWidth="2" />
                  <rect x="-60" y="-30" width="120" height="20" rx="4" className="fill-slate-950/90 stroke-slate-800" />
                  <text y="-17" textAnchor="middle" className="text-[10px] font-mono fill-slate-400">Vector Databases</text>
                </g>

                {/* 5. System Design */}
                <g
                  transform="translate(325, 70)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('system_design')}
                >
                  <circle r="12" className={`transition-all ${selectedDomain === 'system_design' ? 'fill-amber-500 stroke-white' : 'fill-slate-950 stroke-slate-700'}`} strokeWidth="2" />
                  <rect x="-60" y="-30" width="120" height="20" rx="4" className="fill-slate-950/90 stroke-slate-800" />
                  <text y="-17" textAnchor="middle" className="text-[10px] font-mono fill-slate-400">System Design</text>
                </g>

                {/* 6. Optimization */}
                <g
                  transform="translate(325, 310)"
                  className="cursor-pointer group"
                  onClick={() => setSelectedDomain('optimization')}
                >
                  <circle r="12" className={`transition-all ${selectedDomain === 'optimization' ? 'fill-violet-500 stroke-white' : 'fill-slate-950 stroke-slate-700'}`} strokeWidth="2" />
                  <rect x="-70" y="16" width="140" height="20" rx="4" className="fill-slate-950/90 stroke-slate-800" />
                  <text y="29" textAnchor="middle" className="text-[10px] font-mono fill-slate-300 font-bold">Optimization & Latency</text>
                </g>
              </svg>
            </div>

            {/* Status Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5"><span className="text-slate-500">○</span> Planned</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-400 font-bold">◉</span> In Progress</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-500">●</span> Explored</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">✦</span> Adaptive</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">✓</span> Strong</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">△</span> Gap Area</span>
            </div>
          </div>

          {/* Right Domain Detail Side Panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">SELECTED KNOWLEDGE DOMAIN</span>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
                  {currentDomainObj.icon} {currentDomainObj.label}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                currentDomainObj.status === 'ADAPTIVE'
                  ? 'text-emerald-300 bg-emerald-950 border-emerald-700'
                  : 'text-blue-300 bg-blue-950 border-blue-800'
              }`}>
                {currentDomainObj.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Priority</span>
                <span className="text-slate-200 font-bold">{currentDomainObj.priority}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Assessment Depth</span>
                <span className="text-emerald-400 font-bold">{currentDomainObj.depth}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Why this matters</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentDomainObj.why}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Target Concepts</span>
              <div className="space-y-1.5 font-mono text-xs">
                {currentDomainObj.concepts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded border border-slate-800/80">
                    <span className="text-slate-300">{c.name}</span>
                    <span className={c.status === '✓' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Assessment Strategy</span>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                {currentDomainObj.strategy.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-blue-400 text-xs">↓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Expected Evidence</span>
              <div className="space-y-1 text-xs text-slate-400 font-sans">
                {currentDomainObj.evidence.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* SECTION: WHY THIS CURRICULUM & ADAPTIVE DEPTH CONTROL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Why This Curriculum */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2.5 py-0.5 rounded inline-block">
              WHY THESE TOPICS?
            </span>
            <h3 className="text-lg font-bold text-slate-100">Personalized Assessment Rationale</h3>

            <div className="space-y-3 font-mono text-xs pt-2">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Role Relevance (Senior AI Engineer)</span>
                  <span className="text-blue-400 font-bold">92%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Candidate Experience Match</span>
                  <span className="text-emerald-400 font-bold">81%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Target Knowledge Coverage</span>
                  <span className="text-violet-400 font-bold">74%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Read-Only Adaptive Depth Control */}
          <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded inline-block mb-2">
                ADAPTIVE DEPTH CONTROL
              </span>
              <h3 className="text-base font-bold text-slate-100">Probing Depth Config</h3>

              <div className="my-6 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>SURFACE</span>
                  <span className="text-emerald-400 font-bold">● DEEP PROBE</span>
                  <span>EXHAUSTIVE</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[70%] w-4 h-4 rounded-full bg-white border-2 border-emerald-400 shadow-md" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-800 pt-3">
              "The interviewer can spend more time on areas where the candidate demonstrates strong reasoning or uncertainty."
            </p>
          </div>

        </div>

        {/* SECTION: PLANNED VS ADAPTIVE PATH */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">DYNAMIC EXECUTION TOPOLOGY</span>
            <h3 className="text-2xl font-bold text-slate-100">Planned vs Possible Adaptive Path</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            {/* Planned Path */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-slate-400 font-bold uppercase text-[11px] block border-b border-slate-800 pb-2">ORIGINAL BLUEPRINT</span>
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">Python</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">Backend</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">RAG</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">System Design</span>
              </div>
            </div>

            {/* Adaptive Branch Path */}
            <div className="bg-slate-900 p-5 rounded-xl border border-emerald-500/40 space-y-3">
              <span className="text-emerald-400 font-bold uppercase text-[11px] block border-b border-slate-800 pb-2">POSSIBLE ADAPTIVE PATH</span>
              <div className="space-y-1.5 text-slate-200">
                <div>Python → Backend</div>
                <div className="text-emerald-400 font-bold">↳ ↓ RAG</div>
                <div className="text-emerald-400 font-bold pl-4">↳ ✦ Context Chunking</div>
                <div className="text-emerald-400 font-bold pl-8">↳ ✦ Retrieval Latency</div>
                <div>↳ Optimization</div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs font-mono text-slate-400">
            "Your blueprint is a starting point — candidate responses determine where the interview goes deeper."
          </p>
        </div>

        {/* BOTTOM ACTION AREA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <Link
            href="/launchpad"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-800 px-4 py-2 rounded-xl transition-colors"
          >
            ← Back to Candidate
          </Link>

          <button
            onClick={handleBeginInterview}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
          >
            <span>BEGIN INTERVIEW</span>
            <span className="group-hover:translate-x-1.5 transition-transform text-sm">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
