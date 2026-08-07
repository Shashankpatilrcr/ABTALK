# Setup Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 20+ |
| npm | 10+ |

---

## 1. Clone & Environment

```bash
git clone <repo-url>
cd ai-interview-agent
cp .env.example .env
# Fill in your API keys in .env
```

---

## 2. Data Layer (Person 2)

```bash
cd data
pip install -r requirements.txt

# Drop raw files
cp ../candidates.json raw/
cp ../curriculum.json raw/

# Run ingestion scripts
python scripts/ingest_curriculum.py
python scripts/process_candidates.py

# Start data API on port 8001
python scripts/data_api.py
```

---

## 3. Backend (Person 1)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Verify: `GET http://localhost:8000/health` → `{ "status": "ok" }`

---

## 4. Frontend (Person 3)

```bash
cd frontend
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Mock Mode (no backend needed)

```bash
# In frontend/.env.local:
NEXT_PUBLIC_MOCK_MODE=true
```

---

## Port Summary

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Backend API | 8000 |
| Data API | 8001 |
