import React, { useState } from 'react';

export function ResponseInput({ onSubmit, isSubmitting }) {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    onSubmit(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Conversational Input Surface */}
      <div className={`relative bg-slate-900/80 border rounded-2xl transition-all duration-300 ${
        text.length > 0
          ? 'border-blue-500/60 shadow-lg shadow-blue-950/30'
          : 'border-slate-800/80 focus-within:border-blue-500/40'
      }`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          rows={5}
          placeholder="Explain your reasoning..."
          className="w-full bg-transparent text-slate-100 text-base leading-relaxed placeholder-slate-600 focus:outline-none resize-none px-5 pt-5 pb-3 font-sans"
        />

        {/* Footer Bar */}
        <div className="flex justify-between items-center px-5 pb-4 pt-2 border-t border-slate-800/60 text-xs font-mono">
          <span className={`transition-colors ${wordCount > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-slate-600 hidden sm:block">Ctrl + Enter to submit</span>
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`group px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
            text.trim() && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-900/40 hover:-translate-y-0.5'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
          }`}
        >
          <span>SUBMIT ANSWER</span>
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}

