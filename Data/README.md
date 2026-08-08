# Interview Prep RAG

This repository is arranged as a small monorepo so frontend and backend folders
from GitHub can be merged cleanly later.

## Structure

- `backend/app/` - Python API and RAG processing code.
- `backend/tests/` - Backend tests.
- `backend/data/` - JSON input/output data used by the backend.
- `backend/storage/` - Generated local ChromaDB files and logs.
- `frontend/` - Placeholder for frontend code.
- `docs/` - Project documentation.

## Backend

From the repository root:

```powershell
python -m backend.tests.test_candidate_processor
```

To run the API from inside `backend`:

```powershell
uvicorn app.api:app --reload
```
