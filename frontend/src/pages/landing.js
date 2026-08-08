import React from 'react';
import LandingHero from '../components/LandingHero';
import MultiplePathsSection from '../components/MultiplePathsSection';
import KnowledgePathPreview from '../components/KnowledgePathPreview';
import InterviewDNAPreview from '../components/InterviewDNAPreview';
import AdaptiveMoment from '../components/AdaptiveMoment';
import TraditionalVsAdaptive from '../components/TraditionalVsAdaptive';
import LandingFinalCTA from '../components/LandingFinalCTA';

export default function LandingPage({ appTheme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* 1. First Viewport — Living Interview Path Hero */}
      <LandingHero appTheme={appTheme} onToggleTheme={onToggleTheme} />

      {/* 2. One Question. Multiple Paths */}
      <MultiplePathsSection />

      {/* 3. The Interview Has a Memory */}
      <KnowledgePathPreview />

      {/* 4. Every Interview Leaves a Knowledge Signature */}
      <InterviewDNAPreview />

      {/* 5. See the Moment the AI Changes Course */}
      <AdaptiveMoment />

      {/* 6. Traditional vs Adaptive */}
      <TraditionalVsAdaptive />

      {/* 7. Final Clean CTA */}
      <LandingFinalCTA />
    </div>
  );
}
