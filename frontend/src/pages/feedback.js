import React, { useState, useEffect } from 'react';
import FeedbackReport from '../components/FeedbackReport';
import { MOCK_FEEDBACK_DATA } from '../lib/mockFeedback';

export default function FeedbackPage({ appTheme, onToggleTheme }) {
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCandidate = sessionStorage.getItem('selected_candidate');
      if (storedCandidate) {
        try {
          setCandidate(JSON.parse(storedCandidate));
        } catch (e) {}
      }
    }
  }, []);

  return (
    <FeedbackReport
      feedbackData={MOCK_FEEDBACK_DATA}
      candidate={candidate}
      appTheme={appTheme}
      onToggleTheme={onToggleTheme}
    />
  );
}

