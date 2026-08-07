// src/hooks/useInterviewSession.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MOCK_INTERVIEW_QUESTIONS } from '../lib/interviewQuestionsData';
import { MOCK_CANDIDATES } from '../lib/candidatesData';
import { MOCK_KNOWLEDGE_MAP } from '../lib/mockKnowledgeMap';

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

  // Load candidate on mount from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selected_candidate');
      if (stored) {
        try {
          setCandidate(JSON.parse(stored));
        } catch (e) {
          setCandidate(MOCK_CANDIDATES[0]);
        }
      } else {
        setCandidate(MOCK_CANDIDATES[0]);
      }
    }
  }, []);

  const questions = MOCK_INTERVIEW_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
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

  const submitAnswer = (answerText) => {
    if (!answerText.trim() || sessionState !== SESSION_STATES.QUESTION) return;

    // 1. Enter SUBMITTING state briefly
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

    // 2. Transition to ANALYZING state
    setTimeout(() => {
      setSessionState(SESSION_STATES.ANALYZING);

      // 3. Complete analysis & transition to next question or completion
      setTimeout(() => {
        if (currentQuestionIndex + 1 < totalQuestions) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);

          // If next question is an adaptive follow-up, flag state accordingly
          if (questions[nextIndex]?.isFollowUp) {
            setSessionState(SESSION_STATES.SHOWING_FOLLOW_UP);
            setTimeout(() => setSessionState(SESSION_STATES.QUESTION), 600);
          } else {
            setSessionState(SESSION_STATES.QUESTION);
          }
        } else {
          setSessionState(SESSION_STATES.COMPLETED);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('assessment_history', JSON.stringify(updatedHistory));
          }
          router.push('/feedback');
        }
      }, 1400);
    }, 400);
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
    submitAnswer,
  };
}
