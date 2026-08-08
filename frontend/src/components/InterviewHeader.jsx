import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export function InterviewHeader({ currentStep, totalSteps, candidateName, candidateRole, appTheme, onToggleTheme, progress }) {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 px-5 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      
      {/* LEFT — Brand + Live Signal */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-100 uppercase whitespace-nowrap">
            AI Interview Agent
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded hidden sm:inline">
          ● LIVE
        </span>
      </div>

      {/* CENTER — Candidate Identity */}
      {candidateName && (
        <div className="flex-1 flex justify-center items-center gap-2 px-4">
          <span className="w-7 h-7 rounded-full bg-blue-900/70 border border-blue-700/60 text-blue-300 flex items-center justify-center text-xs font-bold font-mono shrink-0">
            {candidateName.charAt(0)}
          </span>
          <div className="text-center hidden md:block">
            <div className="text-sm font-semibold text-slate-100 leading-none">{candidateName}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{candidateRole || 'Technical Assessment'}</div>
          </div>
        </div>
      )}

      {/* RIGHT — Progress + Question Counter + Theme Toggle */}
      <div className="flex items-center gap-3 text-xs font-mono shrink-0">
        {/* PRD §7.2 — Progress bar (questions + days) */}
        {progress && (
          <div className="hidden md:flex flex-col gap-1 mr-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider w-12 text-right">Q</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (progress.questionsAnswered / progress.minQuestions) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400">{progress.questionsAnswered}/{progress.minQuestions}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider w-12 text-right">Days</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (progress.daysCovered.length / progress.minDays) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400">{progress.daysCovered.length}/{progress.minDays}</span>
            </div>
          </div>
        )}
        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Question</div>
          <div className="text-slate-100 font-bold text-base leading-none">
            {String(currentStep).padStart(2, '0')}
            <span className="text-slate-600 font-normal text-xs"> / {String(totalSteps).padStart(2, '0')}</span>
          </div>
        </div>
        <a
          href="/curriculum"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-semibold text-slate-400 hover:text-blue-400 transition-colors hidden lg:inline"
        >
          Curriculum ↗
        </a>
        {onToggleTheme && (
          <ThemeToggle theme={appTheme} onToggle={onToggleTheme} />
        )}
      </div>
    </header>
  );
}
