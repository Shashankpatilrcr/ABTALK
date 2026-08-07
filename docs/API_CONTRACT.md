# API Contract

> **Status**: Draft — lock this with your team before building.

---

## Endpoint

```
POST /api/interview
```

No authentication required.

---

## Request

### Start Interview (first call)

```json
{
  "sessionId": "abc-123",
  "candidate": {
    "member": {
      "id": "CAND-001",
      "name": "Sarah Johnson",
      "jobRole": "Senior Data Engineer",
      "yearsExperience": 9,
      "education": "MS Computer Science",
      "status": "COMPLETED"
    },
    "missions": [
      { "day": 7, "title": "Embeddings Explained", "passed": true, "attempts": 1 }
    ],
    "signals": {
      "commitDays": 28,
      "missionsCompleted": 30,
      "missionsFirstTry": 20
    }
  }
}
```

### Conversation Turn (subsequent calls)

```json
{
  "sessionId": "abc-123",
  "message": "I think embeddings are numerical representations of text..."
}
```

---

## Response

### Mid-interview

```json
{
  "reply": "That's a solid explanation. Can you tell me more about...",
  "done": false
}
```

### End of interview (`done: true`)

```json
{
  "reply": "Thank you, that concludes our interview.",
  "done": true,
  "feedback": {
    "summary": "Strong candidate with clear understanding of...",
    "strengths": ["First-attempt completions", "Good grasp of RAG"],
    "gaps": ["Prompt engineering depth", "Monitoring skills"],
    "next": ["Review observability tools", "Build a RAG prototype"]
  }
}
```

---

## Rules

| Rule | Detail |
|------|--------|
| Session state | Must be maintained server-side using `sessionId` |
| First request | Must include `candidate` object; no `message` |
| Subsequent requests | Must include `message`; no `candidate` |
| Final response | Must set `done: true` and include `feedback` |
| Content-Type | `application/json` |
