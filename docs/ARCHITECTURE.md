# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                  │
│  / (Candidate Select) → /interview → /feedback          │
│  src/lib/api.js → POST /api/interview                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (port 8000)
┌────────────────────────▼────────────────────────────────┐
│                    BACKEND (FastAPI)                    │
│  POST /api/interview                                    │
│  ├── orchestrator.py (session mgmt + LLM calls)        │
│  ├── context.py      (conversation history)            │
│  ├── feedback.py     (generate final feedback)         │
│  └── data_client.py  (calls data layer)                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (port 8001)
┌────────────────────────▼────────────────────────────────┐
│                   DATA LAYER (FastAPI)                  │
│  GET  /candidates    → processed candidate list        │
│  GET  /curriculum    → curriculum structure            │
│  POST /search        → vector similarity search        │
│  ├── data/raw/       (curriculum.json, candidates.json)│
│  ├── data/processed/ (enriched data)                   │
│  └── data/vectorstore/ (embeddings)                    │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User selects a candidate** on the frontend
2. **Frontend** sends `POST /api/interview` with `{ sessionId, candidate }`
3. **Backend** initialises session, fetches relevant curriculum context from data layer
4. **Backend** calls LLM with system prompt + candidate context → returns first question
5. **User answers** → frontend sends `POST /api/interview` with `{ sessionId, message }`
6. **Backend** continues conversation until `done: true`
7. **Backend** generates structured feedback and returns it in the final response
8. **Frontend** redirects to `/feedback` and renders the report
