// FeedbackReport.jsx
// Renders structured feedback: summary, strengths, gaps, next steps
// TODO: Implement

export default function FeedbackReport({ feedback }) {
  if (!feedback) return null;
  const { summary, strengths = [], gaps = [], next = [] } = feedback;

  return (
    <div>
      <h2>Interview Feedback</h2>
      <p>{summary}</p>
      {/* TODO: Render strengths, gaps, next as styled columns */}
    </div>
  );
}
