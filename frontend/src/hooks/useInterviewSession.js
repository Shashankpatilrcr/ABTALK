// src/hooks/useInterviewSession.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MOCK_KNOWLEDGE_MAP } from '../lib/mockKnowledgeMap';
import { sendAnswer, startInterview } from '../lib/api';

export const SESSION_STATES = {
  QUESTION: 'QUESTION',
  SUBMITTING: 'SUBMITTING',
  ANALYZING: 'ANALYZING',
  SHOWING_FOLLOW_UP: 'SHOWING_FOLLOW_UP',
  COMPLETED: 'COMPLETED',
};

export function useInterviewSession() {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionState, setSessionState] = useState(SESSION_STATES.QUESTION);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [exploredConceptIds, setExploredConceptIds] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    questionsAnswered: 0,
    minQuestions: 8,
    daysCovered: [],
    minDays: 4,
  });

  // Load candidate on mount from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selected_candidate');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCandidate(parsed);
        } catch (e) {
          setCandidate(null);
        }
      } else {
        setCandidate(null);
      }
    }
  }, []);

  // Initialize session when candidate is loaded
  useEffect(() => {
    if (!candidate) return;

    let cancelled = false;
    setSessionState(SESSION_STATES.ANALYZING);
    setSessionId(null);
    setError(null);
    sessionStorage.removeItem('interview_session_id');

    startInterview(candidate)
      .then((response) => {
        if (cancelled) return;
        setSessionId(response.session_id);
        sessionStorage.setItem('interview_session_id', response.session_id);
        const firstQ = toQuestion(response, 0);
        setQuestions([firstQ]);
        setCurrentQuestionIndex(0);
        setAnswerHistory([]);
        setSessionState(SESSION_STATES.QUESTION);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Backend interview start error:', err);
        setError(`Failed to connect to backend: ${err.message}. Make sure the FastAPI server and Ollama are running.`);
        setSessionState(SESSION_STATES.QUESTION);
      });

    return () => {
      cancelled = true;
    };
  }, [candidate?.member?.id]);

  const totalQuestions = Math.max(questions.length, 8);
  const currentQuestion = questions[currentQuestionIndex] || null;
  const nextQuestion = questions[currentQuestionIndex + 1] || null;
  const isFollowUpNext = nextQuestion?.isFollowUp || false;

  // Record concept exploration whenever currentQuestion changes
  useEffect(() => {
    if (currentQuestion?.conceptId) {
      setExploredConceptIds((prev) => {
        if (!prev.includes(currentQuestion.conceptId)) {
          return [...prev, currentQuestion.conceptId];
        }
        return prev;
      });
    }
  }, [currentQuestion]);

  const submitAnswer = async (answerText) => {
    if (!answerText.trim() || sessionState !== SESSION_STATES.QUESTION) return;

    setError(null);
    setSessionState(SESSION_STATES.SUBMITTING);

    const newEntry = {
      questionId: currentQuestion.id,
      questionTopic: currentQuestion.topic,
      conceptId: currentQuestion.conceptId,
      isFollowUp: currentQuestion.isFollowUp,
      answer: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...answerHistory, newEntry];
    setAnswerHistory(updatedHistory);

    let activeSessionId = sessionId;
    if (!activeSessionId && candidate) {
      try {
        const startRes = await startInterview(candidate);
        activeSessionId = startRes.session_id;
        setSessionId(activeSessionId);
        sessionStorage.setItem('interview_session_id', activeSessionId);
      } catch (err) {
        console.error('Could not re-establish session:', err);
        setError(`Failed to reconnect session: ${err.message}`);
        setSessionState(SESSION_STATES.QUESTION);
        return;
      }
    }

    try {
      setSessionState(SESSION_STATES.ANALYZING);
      const response = await sendAnswer(activeSessionId, answerText);

      if (response.progress) {
        setProgress({
          questionsAnswered: response.progress.questions_asked ?? (currentQuestionIndex + 1),
          minQuestions: response.progress.min_questions ?? 8,
          daysCovered: response.progress.days_covered ?? [],
          minDays: response.progress.min_days ?? 4,
        });
      }

      if (response.interview_complete || response.status === 'completed') {
        setSessionState(SESSION_STATES.COMPLETED);
        sessionStorage.setItem('assessment_history', JSON.stringify(updatedHistory));
        router.push('/feedback');
        return;
      }

      const next = toQuestion(response, questions.length);
      setQuestions((prev) => [...prev, next]);
      setCurrentQuestionIndex((prev) => prev + 1);
      setSessionState(next.isFollowUp ? SESSION_STATES.SHOWING_FOLLOW_UP : SESSION_STATES.QUESTION);
      if (next.isFollowUp) {
        setTimeout(() => setSessionState(SESSION_STATES.QUESTION), 600);
      }
    } catch (err) {
      console.error('Backend sendAnswer error:', err);
      setError(`Failed to submit answer: ${err.message}`);
      setSessionState(SESSION_STATES.QUESTION);
    }
  };

  return {
    candidate,
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentStep: currentQuestionIndex + 1,
    totalSteps: totalQuestions,
    sessionState,
    isAnalyzing: sessionState === SESSION_STATES.ANALYZING || sessionState === SESSION_STATES.SUBMITTING,
    isFollowUpNext,
    answerHistory,
    knowledgeMap: MOCK_KNOWLEDGE_MAP,
    activeConceptId: currentQuestion?.conceptId,
    exploredConceptIds,
    progress,
    error,
    submitAnswer,
  };
}

function toQuestion(response, index) {
  const topic = response.curriculum_topic || 'Technical Assessment';
  const text = response.question || response.next_question || 'Can you walk me through your technical experience?';
  return {
    id: `api-q-${index + 1}`,
    question: text,
    topic,
    subtopic: response.curriculum_day ? `Day ${response.curriculum_day}` : 'Adaptive probe',
    conceptId: slugify(topic),
    difficulty: 'Medium',
    difficultyTrend: index > 0 ? 'Adaptive' : 'Personalized',
    isFollowUp: index > 0,
  };
}

function slugify(value) {
  return String(value || 'topic')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
