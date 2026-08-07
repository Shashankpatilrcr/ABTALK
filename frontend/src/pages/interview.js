import React from 'react';
import Link from 'next/link';
import { useInterviewSession } from '../hooks/useInterviewSession';
import { InterviewHeader } from '../components/InterviewHeader';
import { CandidateContext } from '../components/CandidateContext';
import { QuestionCard } from '../components/QuestionCard';
import { ResponseInput } from '../components/ResponseInput';
import { AnalysisState } from '../components/AnalysisState';
import { AnswerHistory } from '../components/AnswerHistory';
import { CognitiveMap } from '../components/CognitiveMap';
import { InterviewJourney } from '../components/InterviewJourney';

export default function InterviewPage({ appTheme, onToggleTheme }) {
  const {
    candidate,
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentStep,
    totalSteps,
    isAnalyzing,
    isFollowUpNext,
    answerHistory,
    knowledgeMap,
    activeConceptId,
    exploredConceptIds,
    submitAnswer,
  } = useInterviewSession();

  // Fallback UI if candidate session is unavailable
  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-xl max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl font-mono">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-100">Session Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your assessment session could not be restored. Please return to the launchpad to select a candidate and begin.
          </p>
          <Link 
            href="/"
            className="inline-block px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Return to Launchpad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans animate-fadeIn relative selection:bg-blue-500 selection:text-white">
      {/* Background Subtle Atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Header */}
      <InterviewHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        candidateName={candidate?.member?.name}
        candidateRole={candidate?.member?.jobRole}
        appTheme={appTheme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main 3-Zone Cockpit (Proportions: Left ~20%, Center ~45%, Right ~35%) */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* ZONE 1 — CANDIDATE INTELLIGENCE RAIL (Left: 2.5 cols ~20% on LG) */}
        <aside className="lg:col-span-3 xl:col-span-2 space-y-4">
          <CandidateContext
            candidate={candidate}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentQuestion={currentQuestion}
          />
        </aside>

        {/* ZONE 2 — AI QUESTION CANVAS & CONVERSATION (Center: 5.5 cols ~45% on LG) */}
        <main className="lg:col-span-5 xl:col-span-6 space-y-5">
          {/* Compact Exploration Indicator */}
          <InterviewJourney
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
          />

          {/* Question Display Canvas */}
          <QuestionCard question={currentQuestion} />

          {/* AI Analysis State Transition */}
          {isAnalyzing ? (
            <AnalysisState isFollowUpNext={isFollowUpNext} />
          ) : (
            /* Candidate Response Input Area */
            <ResponseInput onSubmit={submitAnswer} isSubmitting={isAnalyzing} />
          )}

          {/* Submitted Answer History */}
          <AnswerHistory history={answerHistory} />
        </main>

        {/* ZONE 3 — COGNITIVE MAP 2.0 CONSTELLATION (Right: 4 cols ~35% on LG) */}
        <aside className="lg:col-span-4 h-full min-h-[580px]">
          <CognitiveMap
            knowledgeMap={knowledgeMap}
            activeTopic={activeConceptId}
            exploredTopics={exploredConceptIds}
            isFollowUp={currentQuestion?.isFollowUp}
          />
        </aside>

      </div>
    </div>
  );
}
