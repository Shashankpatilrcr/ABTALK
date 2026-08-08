import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MOCK_FEEDBACK_DATA } from '../lib/mockFeedback';
import { EvidencePanel } from './EvidencePanel';
import { MOCK_INTERVIEW_QUESTIONS } from '../lib/interviewQuestionsData';
import { InterviewJourney } from './InterviewJourney';
import { ThemeToggle } from './ThemeToggle';

export default function FeedbackReport({ feedbackData = MOCK_FEEDBACK_DATA, candidate, appTheme, onToggleTheme }) {
  const router = useRouter();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [toast, setToast] = useState({ show: true, title: '✓ Assessment Complete', message: 'Technical intelligence evaluation is ready.' });
  const [showNotifications, setShowNotifications] = useState(false);

  const candidateInfo = candidate?.member || {
    name: "Alex Turner",
    jobRole: "Backend Software Engineer",
    yearsExperience: 7,
    education: "B.S. Computer Science",
  };

  const {
    header,
    overallScore,
    knowledgeProfile,
    observationNarrative,
    strengths,
    knowledgeGaps,
    recommendations,
    evidence,
  } = feedbackData;

  // Animated Score counter from 0 to overallScore.score on mount
  useEffect(() => {
    let start = 0;
    const end = typeof overallScore?.score === 'number' ? overallScore.score : 75;
    const duration = 800; // ms
    const increment = Math.ceil(end / (duration / 16)) || 1;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [overallScore?.score]);

  // Toast helper trigger
  const triggerToast = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  const handleDownload = () => {
    triggerToast('✓ Report Ready', 'Assessment intelligence report exported to PDF format.');
  };

  const handleStartNew = () => {
    triggerToast('↻ New Assessment', 'Resetting session and returning to launchpad...');
    setTimeout(() => router.push('/'), 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative pb-16">
      {/* Background radial glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* 1. TOP GLOBAL HEADER WITH NOTIFICATION BELL & DOWNLOAD */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-200 lg:hidden p-1"
            title="Return to Launchpad"
          >
            ☰
          </button>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-100 flex items-center gap-2 uppercase">
            <span className="text-violet-400">✦</span> AI INTERVIEW AGENT
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
            ✓ ASSESSMENT COMPLETE
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              🔔 <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">2</span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-40 space-y-2 text-xs font-mono animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[10px] uppercase text-slate-400">
                  <span>Assessment Updates</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-300">✕</button>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800 space-y-0.5">
                    <span className="text-emerald-400 text-[10px] font-bold block">✓ Interview Completed</span>
                    <span className="text-[10px] text-slate-400">8 questions & 2 adaptive follow-ups</span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800 space-y-0.5">
                    <span className="text-violet-400 text-[10px] font-bold block">✦ Intelligence Report Generated</span>
                    <span className="text-[10px] text-slate-400">Verified candidate score: 84/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700/80 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-all hover:translate-y-[-1px]"
          >
            <span>Download Report</span>
            <span className="text-blue-400">↓</span>
          </button>
          
          <button
            onClick={handleStartNew}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all hover:translate-y-[-1px]"
          >
            Start New Assessment →
          </button>
          <ThemeToggle theme={appTheme} onToggle={onToggleTheme} className="ml-4" />
      </div>
      </header>

      {/* MAIN LAYOUT WITH PERSISTENT SIDEBAR ON DESKTOP */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 animate-fadeIn">
        
        {/* DESKTOP CANDIDATE SIDEBAR (3 cols on LG) */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
          
          {/* Candidate Identity Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-950">
                {candidateInfo.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 text-base leading-tight">{candidateInfo.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{candidateInfo.jobRole}</p>
              </div>
            </div>

            {/* Candidate Metadata Badges */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span>Experience</span>
                <span className="font-mono text-slate-200">{candidateInfo.yearsExperience || 7} Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Evaluation Date</span>
                <span className="font-mono text-slate-200">Aug 7, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status</span>
                <span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px]">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Compact Assessment Journey Progress */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
              Assessment Flow State
            </span>
            
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 01 Setup & Target
                </span>
                <span className="text-[10px] text-slate-500">Done</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 02 AI Interview Room
                </span>
                <span className="text-[10px] text-slate-500">Done</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 03 Adaptive Probes
                </span>
                <span className="text-[10px] text-slate-500">Done</span>
              </div>
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 04 Intelligence Report
                </span>
                <span className="text-[10px] bg-blue-950 border border-blue-800 px-1.5 rounded">Active</span>
              </div>
            </div>
          </div>

          {/* Assessment Signal Strips */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-2 gap-3 text-center font-mono">
            <div className="bg-slate-950/60 border border-slate-800/60 p-2.5 rounded-xl">
              <span className="text-slate-500 block text-[9px] uppercase">Questions</span>
              <span className="text-slate-200 font-bold text-sm mt-0.5 block">{header.questionsCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 p-2.5 rounded-xl">
              <span className="text-slate-500 block text-[9px] uppercase">Domains</span>
              <span className="text-indigo-400 font-bold text-sm mt-0.5 block">{header.topicsCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 p-2.5 rounded-xl">
              <span className="text-slate-500 block text-[9px] uppercase">Adaptive</span>
              <span className="text-violet-400 font-bold text-sm mt-0.5 block">{header.adaptiveFollowUpsCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/60 p-2.5 rounded-xl">
              <span className="text-slate-500 block text-[9px] uppercase">Duration</span>
              <span className="text-emerald-400 font-bold text-sm mt-0.5 block">29m</span>
            </div>
          </div>

        </aside>

        {/* MAIN COMMAND CENTER DASHBOARD (9 cols on LG) */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* SECTION HEADER & HERO TITLE */}
          <div>
            <span className="text-[11px] font-mono tracking-widest text-violet-400 bg-violet-950/40 border border-violet-800/50 px-2.5 py-1 rounded-md uppercase">
              ✦ Assessment Intelligence Command Center
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-3">
              Technical Evaluation & Reasoning Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
              Evidence-based evaluation of candidate technical knowledge, architecture comprehension, and adaptive follow-up reasoning.
            </p>
          </div>

          {/* 4. HERO SCORE PANEL WITH ANIMATED COUNT UP */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300">
            {/* Subtle glow accent */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Dominant Score */}
            <div className="lg:col-span-5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-8">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest">
                Overall Technical Score
              </span>
              <div className="flex items-baseline gap-4 mt-3">
                <span className="text-6xl sm:text-7xl font-extrabold text-blue-400 font-mono tracking-tight transition-all">
                  {animatedScore}
                </span>
                <span className="text-2xl font-bold text-slate-500 font-mono">/ 100</span>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-sm font-bold text-slate-100 uppercase tracking-wider block">
                  {overallScore.label}
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span>✦</span> {overallScore.assessmentTag}
                </span>
              </div>
            </div>

            {/* Right Assessment Dimensions */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Evaluation Dimensions
              </span>
              
              {overallScore.dimensions.map((dim, i) => {
                const colors = [
                  { text: 'text-blue-400', bar: 'bg-blue-500' },
                  { text: 'text-indigo-400', bar: 'bg-indigo-500' },
                  { text: 'text-violet-400', bar: 'bg-violet-500' },
                ];
                const color = colors[i % colors.length];

                return (
                  <div key={i} className="space-y-1.5 group">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                      <span>{dim.name}</span>
                      <span className={`font-mono font-bold ${color.text}`}>{dim.score}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ease-out ${color.bar}`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. VISUAL KNOWLEDGE PROFILE */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                  Technical Knowledge Profile
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-400">Evaluated Modules</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Relative comprehension across core AI engineering focus domains.</p>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {knowledgeProfile.map((item, idx) => {
                const isStrong = item.status === 'Strong';
                const isGood = item.status === 'Good';

                return (
                  <div 
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 hover:translate-y-[-2px] ${
                      isStrong
                        ? 'bg-slate-950/80 border-blue-900/50 hover:border-blue-700/60 shadow-lg shadow-blue-950/10'
                        : isGood
                          ? 'bg-slate-950/80 border-indigo-900/50 hover:border-indigo-700/60 shadow-lg shadow-indigo-950/10'
                          : 'bg-slate-950/80 border-amber-900/50 hover:border-amber-700/60 shadow-lg shadow-amber-950/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-100 leading-snug">{item.topic}</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        isStrong
                          ? 'bg-blue-950/80 border-blue-800/60 text-blue-300'
                          : isGood
                            ? 'bg-indigo-950/80 border-indigo-800/60 text-indigo-300'
                            : 'bg-amber-950/80 border-amber-800/60 text-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-mono text-slate-300">
                        <span className="font-semibold">Proficiency</span>
                        <span className="font-bold text-slate-100">{item.score}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className={`h-2 rounded-full transition-all duration-700 ${
                            isStrong ? 'bg-blue-500' : isGood ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. "WHAT WE OBSERVED" — AI OBSERVATION PANEL */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                ✦ AI Assessment Observation
              </h3>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl space-y-3">
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed font-sans">
                {observationNarrative}
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs sm:text-sm font-mono">
                <span className="text-violet-400 font-bold uppercase text-xs bg-violet-950/60 border border-violet-800/50 px-2 py-0.5 rounded">
                  KEY SYNTHESIS
                </span>
                <span className="text-slate-300">
                  Excellent conceptual foundation <span className="text-slate-100 font-bold">→</span> practical optimization is the primary growth opportunity.
                </span>
              </div>
            </div>
          </section>

          {/* 7. STRENGTHS & 8. AREAS TO STRENGTHEN WITH CRISP BULLETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STRENGTHS */}
            <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-base">✓</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                    Key Technical Strengths
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400">Verified Signals</span>
              </div>

              <div className="space-y-3">
                {strengths.map((s, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors">
                    <h4 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {s.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed pl-4">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AREAS TO STRENGTHEN */}
            <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-base">△</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                    Areas to Strengthen
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-amber-400">Growth Opportunities</span>
              </div>

              <div className="space-y-3">
                {knowledgeGaps.map((g, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-500 font-bold">0{idx + 1}</span>
                        {g.title}
                      </h4>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded uppercase">
                        {idx === 0 ? 'HIGH' : 'MEDIUM'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed pl-5">{g.description}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* 9. RECOMMENDED NEXT STEPS PROGRESSION */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                  Actionable Growth Journey
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Recommended technical focus path following the assessment.</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded">
                3-Step Plan
              </span>
            </div>

            {/* Horizontal / Connected Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between relative group hover:border-blue-700/60 hover:translate-y-[-2px] transition-all duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="w-7 h-7 rounded-full bg-blue-950 border border-blue-700/60 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {rec.step}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold uppercase font-mono">{rec.topic}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100 pt-1 leading-snug">{rec.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-xs font-mono font-semibold text-emerald-400">
                    Target Outcome: Accelerated Depth
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 10. INTEGRATED INTERVIEW JOURNEY */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
              Interview Evaluation Timeline
            </h3>
            <InterviewJourney 
              questions={MOCK_INTERVIEW_QUESTIONS}
              currentQuestionIndex={MOCK_INTERVIEW_QUESTIONS.length - 1}
            />
          </section>

          {/* 11. EVIDENCE HIGHLIGHTS */}
          <EvidencePanel evidenceList={evidence} />

        </main>

      </div>

      {/* NOTIFICATION TOAST BAR */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-fadeIn">
          <span className="text-blue-400 font-bold">{toast.title}</span>
          <span className="text-slate-400">{toast.message}</span>
          <button 
            onClick={() => setToast((prev) => ({ ...prev, show: false }))} 
            className="text-slate-500 hover:text-slate-300 ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
