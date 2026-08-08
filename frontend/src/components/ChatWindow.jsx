import { useEffect, useRef } from 'react';
import QuestionBubble from './QuestionBubble';

export default function ChatWindow({ messages = [], isLoading = false }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        minHeight: 400,
        maxHeight: 560,
        overflowY: 'auto',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {messages.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 20px', fontSize: 14 }}>
          Starting interview session...
        </div>
      )}

      {messages.map((msg, index) => (
        <QuestionBubble
          key={index}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f766e',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Interviewer is generating adaptive question...
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

