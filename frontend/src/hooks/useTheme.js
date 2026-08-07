import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('ab-talk-theme') || 'dark';
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function applyTheme(t) {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;
    if (t === 'light') {
      html.classList.add('light-mode');
    } else {
      html.classList.remove('light-mode');
    }
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('ab-talk-theme', next);
  }

  return { theme, toggleTheme, isLight: theme === 'light' };
}
