import React from 'react';

export function ThemeToggle({ theme, onToggle, className = '' }) {
  const isLight = theme === 'light';

  return (
    <button
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`
        relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
        border font-mono text-[11px] font-semibold
        transition-all duration-300 cursor-pointer select-none
        ${isLight
          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 shadow-sm'
          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
        }
        ${className}
      `}
    >
      {/* Toggle Track */}
      <span className={`
        relative flex items-center w-8 h-4 rounded-full border transition-all duration-300
        ${isLight
          ? 'bg-amber-400 border-amber-500'
          : 'bg-slate-700 border-slate-600'
        }
      `}>
        {/* Toggle Thumb */}
        <span className={`
          absolute w-3 h-3 rounded-full shadow-sm transition-all duration-300
          ${isLight
            ? 'translate-x-4 bg-white'
            : 'translate-x-0.5 bg-slate-400'
          }
        `} />
      </span>

      {/* Icon + Label */}
      <span className="flex items-center gap-1">
        {isLight ? (
          <>
            <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span>Light</span>
          </>
        ) : (
          <>
            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span>Dark</span>
          </>
        )}
      </span>
    </button>
  );
}
