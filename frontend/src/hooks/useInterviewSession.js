// useInterviewSession.js
// Manages interview state: messages, sessionId, isLoading, isDone, feedback
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { startInterview, sendMessage } from '../lib/api';

export function useInterviewSession() {
  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date().toISOString() }]);
  };

  const start = useCallback(async (candidate) => {
    setIsLoading(true);
    try {
      const res = await startInterview(sessionId, candidate);
      addMessage('ai', res.reply);
      if (res.done) {
        setIsDone(true);
        setFeedback(res.feedback);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const send = useCallback(async (text) => {
    addMessage('user', text);
    setIsLoading(true);
    try {
      const res = await sendMessage(sessionId, text);
      addMessage('ai', res.reply);
      if (res.done) {
        setIsDone(true);
        setFeedback(res.feedback);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return { sessionId, messages, isLoading, isDone, feedback, start, send };
}
