// src/pages/index.js
import CandidateSelector from '../components/CandidateSelector';

export default function IndexPage({ appTheme, onToggleTheme }) {
  return <CandidateSelector appTheme={appTheme} onToggleTheme={onToggleTheme} />;
}

