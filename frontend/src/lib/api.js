const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
export const MOCK_MODE = false;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Backend error ${res.status}: ${detail}`);
  }

  return res.json();
}

export async function startInterview(candidate) {
  return request('/start-interview', {
    method: 'POST',
    body: JSON.stringify({
      candidate,
      role: candidate?.member?.jobRole || 'Technical Interview',
      difficulty: 'medium',
    }),
  });
}

export async function sendAnswer(sessionId, answer) {
  return request('/answer', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, answer }),
  });
}

export async function getFeedback(sessionId) {
  return request(`/feedback/${sessionId}`);
}

export async function getCandidates() {
  return request('/candidates');
}

export async function getCurriculum() {
  return request('/curriculum');
}

