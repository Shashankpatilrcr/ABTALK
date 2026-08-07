// lib/api.js
// All calls to the backend POST /api/interview

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// ─── Mock responses (used when NEXT_PUBLIC_MOCK_MODE=true) ───────────────────

const MOCK_RESPONSES = [
  "Tell me about your experience with vector databases. You completed the 'Vector Databases Overview' mission on your first attempt — impressive!",
  "Interesting. Can you explain how embeddings work and why they're useful for semantic search?",
  "Great explanation! I noticed you needed 4 attempts on 'Prompt Engineering Fundamentals'. What was the most challenging concept there for you?",
  "That's a thoughtful reflection. Last question: walk me through how you would design a multi-agent system for a real-world application.",
];

let mockIndex = 0;

async function mockCall(isStart) {
  await new Promise((r) => setTimeout(r, 1200)); // simulate latency
  if (isStart) {
    return { reply: "Welcome! Let's begin your AI interview. I've reviewed your learning history and I'm ready to dive in. First — can you describe your background and what drew you to AI engineering?", done: false };
  }
  const reply = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
  mockIndex++;
  const done = mockIndex >= MOCK_RESPONSES.length;
  return {
    reply,
    done,
    feedback: done ? {
      summary: "Strong candidate with solid fundamentals in embeddings and vector search. Shows good self-awareness about areas of difficulty.",
      strengths: ["First-attempt success on foundational topics", "Clear understanding of vector search concepts", "Consistent commitment (28 days)"],
      gaps: ["Prompt engineering depth needs reinforcement", "Monitoring & observability (skipped)"],
      next: ["Complete the Monitoring & Observability mission", "Practice prompt chaining exercises", "Build a small RAG project end-to-end"],
    } : undefined,
  };
}

// ─── Real API calls ───────────────────────────────────────────────────────────

/**
 * Start a new interview session.
 * @param {string} sessionId
 * @param {object} candidate — full candidate object from candidates.json
 * @returns {{ reply: string, done: boolean, feedback?: object }}
 */
export async function startInterview(sessionId, candidate) {
  if (MOCK_MODE) return mockCall(true);

  const res = await fetch(`${BASE_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, candidate }),
  });
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  return res.json();
}

/**
 * Send a candidate message during an active interview.
 * @param {string} sessionId
 * @param {string} message
 * @returns {{ reply: string, done: boolean, feedback?: object }}
 */
export async function sendMessage(sessionId, message) {
  if (MOCK_MODE) return mockCall(false);

  const res = await fetch(`${BASE_URL}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  });
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  return res.json();
}
