import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

// Expose theme globally so all pages can read it without prop drilling
export let globalTheme = 'dark';
export let globalToggleTheme = () => {};

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');

  // Read stored preference before render
  useEffect(() => {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('ab-talk-theme') || 'dark'
      : 'dark';
    setTheme(stored);
    applyThemeClass(stored);
  }, []);

  function applyThemeClass(t) {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('light-mode', t === 'light');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyThemeClass(next);
    localStorage.setItem('ab-talk-theme', next);
  }

  // Expose to pages via window (simple cross-page sharing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__abTalkTheme = theme;
      window.__abTalkToggle = toggleTheme;
    }
  });

  return (
    <Component
      {...pageProps}
      appTheme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
