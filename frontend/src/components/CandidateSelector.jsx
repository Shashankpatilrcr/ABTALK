import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MOCK_CANDIDATES } from '../lib/candidatesData';
import { CandidateCard } from './CandidateCard';
import { AssessmentConfig } from './AssessmentConfig';
import { BeginAssessmentButton } from './BeginAssessmentButton';
import { ThemeToggle } from './ThemeToggle';

export default function CandidateSelector({ candidates = MOCK_CANDIDATES, appTheme, onToggleTheme }) {
  const router = useRouter();
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0] || null);

  const handleBeginAssessment = (candidate) => {
    if (!candidate) return;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selected_candidate', JSON.stringify(candidate));
      sessionStorage.removeItem('assessment_history');
    }
    router.push(`/interview?candidateId=${candidate.member.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn relative z-10">
        
        {/* Top Assessment Header */}
        <header className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-violet-400 bg-violet-950/40 border border-violet-800/50 px-2.5 py-0.5 rounded">
                ✦ ASSESSMENT ENGINE LAUNCHPAD
              </span>
              <span className="text-xs font-mono text-slate-500">• Cohort v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mt-2">
              Assessment Launchpad
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Select a target candidate to initiate an evidence-backed adaptive technical assessment.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl text-xs font-mono">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="font-bold text-slate-200">Assessment Engine Ready</div>
              <div className="text-slate-500 text-[10px]">Adaptive RAG & Vector Evaluation</div>
            </div>
          </div>
          {onToggleTheme && (
            <ThemeToggle theme={appTheme} onToggle={onToggleTheme} />
          )}
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Candidate List Section */}
          <section className="lg:col-span-7 space-y-4" aria-label="Candidate Selection">
            <div className="flex justify-between items-center font-mono">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Select Candidate ({candidates.length})
              </h2>
              <span className="text-[11px] text-slate-500">Click a profile to inspect technical DNA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((c) => (
                <CandidateCard
                  key={c.member.id}
                  candidate={c}
                  isSelected={selectedCandidate?.member?.id === c.member.id}
                  onSelect={setSelectedCandidate}
                />
              ))}
            </div>
          </section>

          {/* Assessment Configuration & Launch Section */}
          <section className="lg:col-span-5 space-y-5" aria-label="Assessment Configuration">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Mission Control Blueprint
            </h2>

            <AssessmentConfig selectedCandidate={selectedCandidate} />

            <BeginAssessmentButton
              selectedCandidate={selectedCandidate}
              onBegin={handleBeginAssessment}
            />
          </section>

        </main>
      </div>
    </div>
  );
}
