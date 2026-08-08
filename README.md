# AI Interview Agent

An AI-powered interview platform that conducts personalized interviews based on candidate learning history and curriculum data.

## Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Data Layer
```bash
cd data
pip install -r requirements.txt
python scripts/ingest_curriculum.py
python scripts/process_candidates.py
python scripts/data_api.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## API Contract

See [docs/API_CONTRACT.md](docs/API_CONTRACT.md)

## Environment Variables

Copy `.env.example` and fill in values:
```bash
cp .env.example .env
```

The backend uses a process-local in-memory session store. Run a single Uvicorn
worker until sessions are moved to shared storage. Start Ollama locally and pull
the configured model before starting the API:

```bash
ollama pull llama3
ollama serve
```

## Team

| Layer    | Owner    |
|----------|----------|
| Backend  | Person 1 |
| Data     | Person 2 |
| Frontend | Person 3 |
