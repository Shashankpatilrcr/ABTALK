import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LandingHero({ appTheme, onToggleTheme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Auto-play 1 sequence over 4 seconds on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(timer);
        return 4;
      });
    }, 850);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative min-h-[90vh] flex flex-col justify-between pt-6 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-slate-800/60">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_10%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-20 flex items-center justify-between max-w-7xl w-full mx-auto pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-mono font-bold text-base shadow-md">
            ✦
          </div>
          <span className="text-sm sm:text-base font-mono font-extrabold uppercase tracking-widest text-slate-100">
            AI INTERVIEW INTELLIGENCE
          </span>
        </div>

        <div className="flex items-center gap-5 sm:gap-8">
          <Link
            href="/curriculum"
            className="hidden sm:inline-block text-sm font-mono font-bold text-slate-300 hover:text-blue-400 transition-colors"
          >
            Curriculum
          </Link>
          <a
            href="#how-it-works"
            className="hidden sm:inline-block text-sm font-mono font-bold text-slate-300 hover:text-blue-400 transition-colors"
          >
            How it works
          </a>
          <a
            href="#why-adaptive"
            className="hidden sm:inline-block text-sm font-mono font-bold text-slate-300 hover:text-blue-400 transition-colors"
          >
            Why adaptive
          </a>

          <ThemeToggle theme={appTheme} onToggle={onToggleTheme} />

          <Link
            href="/launchpad"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
          >
            <span>Begin Assessment</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </nav>

      {/* Hero Body Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-8">
        
        {/* Left Headline & Concept Statement */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-mono font-extrabold uppercase tracking-widest shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            Adaptive Intelligence Engine
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-100 leading-[1.05]">
            EVERY CANDIDATE <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              TAKES A DIFFERENT PATH.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-lg leading-relaxed font-sans">
            An adaptive technical interviewer that follows how candidates think — not a predetermined question script.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/launchpad"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
            >
              <span>Begin Assessment</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <a
              href="#how-it-works"
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <span>See how it works</span>
              <span className="text-slate-500">↓</span>
            </a>
          </div>

          {/* Micro Telemetry Signal Pill */}
          <div className="pt-4 flex items-center gap-6 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Candidate Signal</span>
              <span className="text-slate-200 font-bold">Technical Depth 86</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Current Domain</span>
              <span className="text-blue-400 font-bold">RAG Retrieval</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">AI Decision</span>
              <span className="text-emerald-400 font-bold">✦ Probe Deeper</span>
            </div>
          </div>
        </div>

        {/* Right Signature Visual — LIVING INTERVIEW PATH NETWORK */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Living AI Interview Path Network
            </span>
            <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded">
              Interactive Reasoning Topology
            </span>
          </div>

          {/* SVG Living Network Graph */}
          <div className="relative w-full overflow-hidden flex justify-center items-center bg-slate-900/60 rounded-xl p-4 border border-slate-800/50">
            <svg viewBox="0 0 560 395" className="w-full h-auto drop-shadow-lg selection:bg-none">
              {/* Connection Lines with Animated Step Visibility */}
              {/* Candidate (280,30) -> Context (280,90) */}
              <line
                x1="280" y1="30" x2="280" y2="90"
                stroke={activeStep >= 1 ? '#3b82f6' : '#1e293b'}
                strokeWidth={activeStep >= 1 ? '2' : '1'}
                className="transition-all duration-500"
              />

              {/* Context (280,90) -> AI Reasoning (280,160) */}
              <line
                x1="280" y1="90" x2="280" y2="160"
                stroke={activeStep >= 2 ? '#3b82f6' : '#1e293b'}
                strokeWidth={activeStep >= 2 ? '2' : '1'}
                className="transition-all duration-500"
              />

              {/* AI Reasoning (280,160) -> Strong Signal Branch Left (160,230) */}
              <line
                x1="280" y1="160" x2="160" y2="230"
                stroke={activeStep >= 3 ? '#10b981' : '#1e293b'}
                strokeWidth={activeStep >= 3 ? '2.5' : '1'}
                className="transition-all duration-500"
              />

              {/* AI Reasoning (280,160) -> Gap Branch Right (400,230) */}
              <line
                x1="280" y1="160" x2="400" y2="230"
                stroke={activeStep >= 3 ? '#64748b' : '#1e293b'}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="transition-all duration-500"
              />

              {/* Strong Signal (160,230) -> Deep Probe (160,300) */}
              <line
                x1="160" y1="230" x2="160" y2="300"
                stroke={activeStep >= 4 ? '#10b981' : '#1e293b'}
                strokeWidth={activeStep >= 4 ? '2.5' : '1'}
                className="transition-all duration-500"
              />

              {/* Gap (400,230) -> Clarify (400,300) */}
              <line
                x1="400" y1="230" x2="400" y2="300"
                stroke="#334155" strokeWidth="1" strokeDasharray="3 3"
              />

              {/* Deep Probe (160,300) -> Knowledge Insight (280,350) */}
              <line
                x1="160" y1="300" x2="280" y2="350"
                stroke={activeStep >= 4 ? '#10b981' : '#1e293b'}
                strokeWidth={activeStep >= 4 ? '2' : '1'}
                className="transition-all duration-500"
              />

              {/* Clarify (400,300) -> Knowledge Insight (280,350) */}
              <line x1="400" y1="300" x2="280" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              {/* NODES */}
              {/* 1. CANDIDATE NODE */}
              <g
                transform="translate(280, 30)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('CANDIDATE')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="12" className="fill-slate-900 stroke-blue-500" strokeWidth="2" />
                <circle r="4" className="fill-blue-400" />
                <rect x="20" y="-10" width="90" height="20" rx="4" className="fill-slate-900/90 stroke-slate-700" />
                <text x="26" y="4" className="text-[10px] font-mono fill-slate-200 font-bold">CANDIDATE</text>
              </g>

              {/* 2. CONTEXT NODE */}
              <g
                transform="translate(280, 90)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('CONTEXT')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="10" className={`transition-all duration-300 ${activeStep >= 1 ? 'fill-blue-950 stroke-blue-400' : 'fill-slate-950 stroke-slate-800'}`} strokeWidth="2" />
                <rect x="-115" y="-10" width="95" height="20" rx="4" className="fill-slate-900/90 stroke-slate-800" />
                <text x="-108" y="4" className="text-[10px] font-mono fill-slate-300 font-semibold">CONTEXT SYNC</text>
              </g>

              {/* 3. AI REASONING NODE */}
              <g
                transform="translate(280, 160)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('AI_REASONING')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {activeStep >= 2 && <circle r="22" className="fill-blue-500/20 stroke-blue-400 animate-pulse" strokeWidth="1.5" />}
                <circle r="14" className={`transition-all duration-300 ${activeStep >= 2 ? 'fill-blue-600 stroke-white' : 'fill-slate-900 stroke-slate-700'}`} strokeWidth="2" />
                <text y="4" textAnchor="middle" className="text-[11px] font-mono fill-white font-bold">AI</text>
                <rect x="24" y="-10" width="110" height="20" rx="4" className="fill-slate-900/90 stroke-blue-800/60" />
                <text x="30" y="4" className="text-[10px] font-mono fill-blue-300 font-bold">AI REASONING</text>
              </g>

              {/* 4A. STRONG SIGNAL BRANCH */}
              <g
                transform="translate(160, 230)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('STRONG_SIGNAL')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="11" className={`transition-all duration-300 ${activeStep >= 3 ? 'fill-emerald-950 stroke-emerald-400' : 'fill-slate-950 stroke-slate-800'}`} strokeWidth="2" />
                <rect x="-135" y="-10" width="115" height="20" rx="4" className="fill-emerald-950/90 stroke-emerald-800/60" />
                <text x="-128" y="4" className="text-[10px] font-mono fill-emerald-300 font-bold">STRONG SIGNAL</text>
              </g>

              {/* 4B. GAP BRANCH */}
              <g
                transform="translate(400, 230)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('GAP')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="8" className="fill-slate-950 stroke-slate-700" strokeWidth="1.5" />
                <rect x="18" y="-10" width="80" height="20" rx="4" className="fill-slate-950/90 stroke-slate-800" />
                <text x="24" y="4" className="text-[10px] font-mono fill-slate-400">GAP SIGNAL</text>
              </g>

              {/* 5. ✦ ADAPTIVE DEEP PROBE */}
              <g
                transform="translate(160, 300)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('DEEP_PROBE')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {activeStep >= 4 && <circle r="22" className="fill-emerald-500/30 stroke-emerald-400 animate-ping opacity-75" />}
                <circle r="14" className={`transition-all duration-300 ${activeStep >= 4 ? 'fill-emerald-500 stroke-white' : 'fill-slate-950 stroke-slate-800'}`} strokeWidth="2.5" />
                <text y="4" textAnchor="middle" className="text-[10px] font-mono fill-white">✦</text>
                <rect x="-145" y="-10" width="125" height="20" rx="4" className="fill-emerald-950/90 stroke-emerald-400" />
                <text x="-138" y="4" className="text-[10px] font-mono fill-emerald-300 font-bold">✦ DEEP PROBE</text>
              </g>

              {/* 6. KNOWLEDGE INSIGHT PATH */}
              <g
                transform="translate(280, 345)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode('KNOWLEDGE_PATH')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="12" className={`transition-all duration-300 ${activeStep >= 4 ? 'fill-blue-950 stroke-emerald-400' : 'fill-slate-950 stroke-slate-800'}`} strokeWidth="2" />
                <rect x="-65" y="-28" width="130" height="20" rx="4" className="fill-slate-900/90 stroke-slate-700" />
                <text y="-14" textAnchor="middle" className="text-[10px] font-mono fill-slate-200 font-bold">KNOWLEDGE PATH</text>
              </g>
            </svg>
          </div>

          {/* Interactive Hover Tooltip Bar */}
          <div className="mt-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Node Status:</span>
            <span className="text-emerald-400 font-bold">
              {hoveredNode === 'CANDIDATE' && 'Candidate Profile Synced (Day 1 - RAG)'}
              {hoveredNode === 'CONTEXT' && 'Contextual Knowledge History Loaded'}
              {hoveredNode === 'AI_REASONING' && 'Evaluating candidate response depth in real-time'}
              {hoveredNode === 'STRONG_SIGNAL' && 'High confidence detected in Vector Retrieval'}
              {hoveredNode === 'DEEP_PROBE' && '✦ ADAPTIVE PROBE: AI dynamically branching deeper'}
              {hoveredNode === 'GAP' && 'Shallow coverage detected — scheduling clarification'}
              {hoveredNode === 'KNOWLEDGE_PATH' && 'Candidate Knowledge Signature generated'}
              {!hoveredNode && '✦ Hover any network node to inspect AI reasoning state.'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
