// QuestionBubble.jsx
// Single chat bubble — role: "ai" | "user"
// TODO: Implement

export default function QuestionBubble({ role, content, timestamp }) {
  const isAI = role === 'ai';
  return (
    <div style={{ textAlign: isAI ? 'left' : 'right' }}>
      <span>{content}</span>
    </div>
  );
}
