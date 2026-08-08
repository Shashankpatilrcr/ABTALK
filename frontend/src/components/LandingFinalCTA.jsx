import React from 'react';
import Link from 'next/link';

export default function LandingFinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3.5 py-1 rounded-full">
          ✦ DEMO READY
        </span>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          READY TO SEE HOW THEY THINK?
        </h2>

        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Start an adaptive technical assessment with personalized curriculum history and live cognitive tracking.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            href="/launchpad"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-2xl shadow-blue-600/40 flex items-center gap-2 group"
          >
            <span>BEGIN ASSESSMENT</span>
            <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
