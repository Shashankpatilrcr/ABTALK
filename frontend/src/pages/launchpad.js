import React from 'react';
import CandidateSelector from '../components/CandidateSelector';

export default function LaunchpadPage({ appTheme, onToggleTheme }) {
  return <CandidateSelector appTheme={appTheme} onToggleTheme={onToggleTheme} />;
}
