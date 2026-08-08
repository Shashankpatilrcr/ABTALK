import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurriculum } from '../lib/api';
import { ThemeToggle } from '../components/ThemeToggle';

export default function CurriculumPage({ appTheme, onToggleTheme }) {
  const [curriculumDays, setCurriculumDays] = useState([]);
  const [modulesList, setModulesList] = useState([]);
  const [cohortTitle, setCohortTitle] = useState('AI Cohort · 31 Days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getCurriculum();
        const payload = data?.curriculum || data || {};
        
        let days = [];
        let mods = [];
        
        if (Array.isArray(payload)) {
          days = payload;
        } else if (typeof payload === 'object') {
          if (payload.cohort) setCohortTitle(payload.cohort);
          if (Array.isArray(payload.days)) days = payload.days;
          if (Array.isArray(payload.modules)) mods = payload.modules;
        }

        // Map module titles onto each day
        const enrichedDays = days.map((item) => {
          let modTitle = 'General Module';
          if (mods.length > 0) {
            const matchedMod = mods.find((m) => {
              if (Array.isArray(m.days) && m.days.length === 2) {
                return item.day >= m.days[0] && item.day <= m.days[1];
              }
              return false;
            });
            if (matchedMod) modTitle = `Module ${matchedMod.n}: ${matchedMod.title}`;
          }
          return { ...item, moduleName: modTitle };
        });

        setCurriculumDays(enrichedDays);
        setModulesList(mods);
      } catch (err) {
        console.error("Failed to load curriculum:", err);
        setError("Could not load curriculum data from backend API.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const moduleOptions = ['All', ...modulesList.map((m) => `Module ${m.n}: ${m.title}`)];

  // Filtered days based on search & module selection
  const filteredDays = curriculumDays.filter((day) => {
    const matchesModule = selectedModule === 'All' || day.moduleName === selectedModule;
    const q = searchQuery.toLowerCase();
    const toolsStr = Array.isArray(day.tools) ? day.tools.join(' ') : '';
    const objStr = Array.isArray(day.objectives) ? day.objectives.join(' ') : '';
    const matchesSearch = !q || 
      day.title?.toLowerCase().includes(q) || 
      day.description?.toLowerCase().includes(q) ||
      day.moduleName?.toLowerCase().includes(q) ||
      toolsStr.toLowerCase().includes(q) ||
      objStr.toLowerCase().includes(q) ||
      `day ${day.day}`.includes(q);
    return matchesModule && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-mono font-bold text-base shadow-md group-hover:scale-105 transition-transform">
              ✦
            </div>
            <span className="text-sm sm:text-base font-mono font-extrabold uppercase tracking-widest text-slate-100">
              AI INTERVIEW AGENT
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/"
              className="text-xs sm:text-sm font-mono font-semibold text-slate-400 hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/curriculum"
              className="text-xs sm:text-sm font-mono font-bold text-blue-400 border-b-2 border-blue-500 pb-0.5"
            >
              Curriculum
            </Link>
            <ThemeToggle theme={appTheme} onToggle={onToggleTheme} />
            <Link
              href="/launchpad"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Begin Assessment</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono text-xs font-semibold mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {cohortTitle.toUpperCase()}
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight mb-4">
            Cohort <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Curriculum Roadmap</span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            Explore the complete 31-day AI Cohort syllabus covering RAG, Vector Databases, Prompt Engineering, Multi-Agent Systems, MCP, and Production AI Deployment.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
            <div className="text-center border-r border-slate-800/80">
              <div className="text-xl sm:text-2xl font-bold font-mono text-blue-400">{curriculumDays.length || 31}</div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Curriculum Days</div>
            </div>
            <div className="text-center border-r border-slate-800/80">
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">{modulesList.length || 8}</div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">Hands-on AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search topics, tools, or objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
            />
            <span className="absolute left-3.5 top-3 text-slate-500 font-mono text-sm">🔍</span>
          </div>

          {/* Module Filter Select dropdown for mobile / clean UI */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
            >
              {moduleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-mono text-sm">Loading 31-Day AI Cohort Curriculum...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
            <div className="text-red-400 font-mono font-bold mb-2">⚠️ Error Loading Data</div>
            <p className="text-slate-300 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-semibold rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {/* Days Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDays.map((item) => (
              <div
                key={item.day}
                className="bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-600/5 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono text-xs font-bold shrink-0">
                      Day {item.day}
                    </span>
                    {item.moduleName && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/40 px-2.5 py-0.5 rounded-full truncate max-w-[200px]" title={item.moduleName}>
                        {item.moduleName}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors mb-3">
                    {item.title}
                  </h3>

                  {/* Objectives List */}
                  {Array.isArray(item.objectives) && item.objectives.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Learning Objectives:
                      </div>
                      <ul className="space-y-1">
                        {item.objectives.slice(0, 3).map((obj, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-blue-400 shrink-0">•</span>
                            <span className="leading-snug">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools Badges */}
                  {Array.isArray(item.tools) && item.tools.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {item.tools.map((tool, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-500 mt-2">
                  <span className="text-[11px] uppercase tracking-wider">{item.type || `Topic #${item.day}`}</span>
                  <Link 
                    href="/launchpad"
                    className="text-blue-400 hover:text-blue-300 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                  >
                    <span>Test Knowledge</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Fallback */}
        {!loading && !error && filteredDays.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-2xl my-8">
            <div className="text-3xl mb-3">🔎</div>
            <div className="text-slate-200 font-bold text-base mb-1">No Matching Curriculum Topics Found</div>
            <p className="text-slate-400 text-sm">Try adjusting your search query or filter selection.</p>
          </div>
        )}
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center border-t border-slate-800/60 mt-12">
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 mb-4 relative z-10">
            Ready to Test Your Technical Knowledge?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto mb-8 relative z-10">
            Start your personalized 8-turn technical assessment. The AI agent will evaluate your answers and deliver a structured feedback report.
          </p>

          <Link
            href="/launchpad"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold uppercase tracking-wider shadow-xl shadow-blue-600/30 transition-all duration-200 hover:scale-105 relative z-10"
          >
            <span>Start Technical Interview</span>
            <span>→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
