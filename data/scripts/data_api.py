"""
data_api.py — Lightweight FastAPI server exposing processed data to the backend.
Runs on port 8001.

Usage:
    python scripts/data_api.py
"""
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Data Layer API", version="1.0.0")


@app.get("/candidates")
async def get_candidates():
    """Return list of processed candidates."""
    # TODO: Load from data/processed/
    return {"candidates": []}


@app.get("/curriculum")
async def get_curriculum():
    """Return curriculum structure."""
    # TODO: Load from data/processed/
    return {"modules": []}


@app.post("/search")
async def vector_search(query: str, top_k: int = 5):
    """Search the vectorstore for relevant curriculum content."""
    # TODO: Implement vector search
    return {"results": []}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
