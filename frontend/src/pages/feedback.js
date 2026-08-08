import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FeedbackReport from '../components/FeedbackReport';
import { getFeedback } from '../lib/api';

export default function FeedbackPage({ appTheme, onToggleTheme }) {
  const [candidate, setCandidate] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCandidate = sessionStorage.getItem('selected_candidate');
      if (storedCandidate) {
        try {
          setCandidate(JSON.parse(storedCandidate));
        } catch (e) {}
      }

      const sessionId = sessionStorage.getItem('interview_session_id');
      if (sessionId) {
        setLoading(true);
        setError(null);
        getFeedback(sessionId)
          .then((feedback) => {
            setFeedbackData(toReportData(feedback));
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching feedback:', err);
            setError(`Failed to retrieve assessment feedback: ${err.message}. Ensure the backend server and local Ollama model are running.`);
            setLoading(false);
          });
      } else {
        setError('No active interview session found. Please complete an interview first.');
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Evaluating your answers and generating technical report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-xl max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto text-xl font-mono">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-100">Feedback Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error}
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
    <FeedbackReport
      feedbackData={feedbackData}
      rawFeedback={feedbackData?.rawFeedback}
      candidate={candidate}
      appTheme={appTheme}
      onToggleTheme={onToggleTheme}
    />
  );
}

function toReportData(feedback) {
  const results = feedback.results || [];
  const validScores = results.map(r => r.score).filter(s => typeof s === 'number');
  const avgScore = feedback.average_score || (validScores.length
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length
    : 7.0);
  const score = Math.round(avgScore * 10);
  const topics = feedback.covered_curriculum_topics || [];
  const strengths = feedback.overall_strengths?.length ? feedback.overall_strengths : ['Completed the technical interview.'];
  const weaknesses = feedback.overall_weaknesses?.length ? feedback.overall_weaknesses : ['More evidence needed for specific gap identification.'];
  const suggestions = feedback.overall_suggestions?.length ? feedback.overall_suggestions : ['Keep practicing concise technical explanations.'];

  return {
    rawFeedback: feedback,
    header: {
      title: "ASSESSMENT COMPLETE",
      subtitle: "AI Assessment Cockpit • Technical Evaluation Report",
      questionsCount: results.length,
      topicsCount: topics.length,
      adaptiveFollowUpsCount: Math.max(0, results.length - topics.length),
      timestamp: new Date().toLocaleString(),
    },
    overallScore: {
      score,
      label: score >= 80 ? 'STRONG TECHNICAL DEPTH' : score >= 60 ? 'DEVELOPING TECHNICAL DEPTH' : 'FOUNDATIONAL TECHNICAL DEPTH',
      dimensions: [
        { name: 'Average Answer Quality', score },
        { name: 'Curriculum Coverage', score: Math.min(100, Math.max(20, topics.length * 20)) },
        { name: 'Completed Evaluations', score: results.length ? Math.round((validScores.length / results.length) * 100) : 100 },
      ],
    },
    knowledgeProfile: topics.map((topic, i) => {
      const topicScore = validScores[i % validScores.length] ? Math.round(validScores[i % validScores.length] * 10) : score;
      return {
        topic,
        score: topicScore,
        status: topicScore >= 80 ? 'Strong' : topicScore >= 60 ? 'Good' : 'Developing',
      };
    }),
    observationNarrative: `The candidate completed ${results.length} responses across ${topics.length} curriculum topics with an average evaluated score of ${avgScore.toFixed(1)}/10.`,
    strengths: strengths.map((item, index) => ({
      title: `Strength ${index + 1}`,
      description: item,
    })),
    knowledgeGaps: weaknesses.map((item, index) => ({
      title: `Growth Area ${index + 1}`,
      description: item,
    })),
    recommendations: suggestions.slice(0, 3).map((item, index) => ({
      step: String(index + 1).padStart(2, '0'),
      title: `Recommended Practice ${index + 1}`,
      description: item,
      topic: topics[index % Math.max(topics.length, 1)] || 'Interview Practice',
    })),
    evidence: results.slice(0, 8).map((result, index) => ({
      id: `ev-${index + 1}`,
      strengthTitle: result.strength || `Question ${index + 1}`,
      questionNumber: index + 1,
      questionText: result.question,
      candidateAnswer: result.answer,
      observationSignal: result.suggestion || result.weakness || result.evaluation_error || 'Evaluation recorded.',
    })),
  };
}
