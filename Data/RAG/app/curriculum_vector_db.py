from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any

import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from sklearn.feature_extraction.text import TfidfVectorizer


COLLECTION_NAME = "curriculum"
BACKEND_ROOT = Path(__file__).resolve().parent.parent
STORAGE_DIR = BACKEND_ROOT / "storage"


class TfidfEmbeddingFunction(EmbeddingFunction[Documents]):
    """Chroma-compatible embedding function backed by local TF-IDF vectors."""

    def __init__(self) -> None:
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            stop_words="english",
        )
        self._is_fitted = False

    def fit(self, texts: list[str]) -> None:
        self.vectorizer.fit(texts)
        self._is_fitted = True

    def __call__(self, input: Documents) -> Embeddings:
        if not self._is_fitted:
            raise ValueError("TfidfEmbeddingFunction must be fitted before use.")

        vectors = self.vectorizer.transform(input)
        return vectors.toarray().astype("float32").tolist()


def build_vector_db(chunks: list[dict[str, Any]], persist_path: str | Path):
    """
    Build a persistent ChromaDB collection from curriculum chunks.

    To swap in OpenAI embeddings later, replace TfidfEmbeddingFunction with:

        from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

        embedding_function = OpenAIEmbeddingFunction(
            api_key=os.environ["OPENAI_API_KEY"],
            model_name="text-embedding-3-small",
        )

    Then keep the same collection.add(...) and query_vector_db(...) calls.
    """
    persist_path = Path(persist_path)
    documents = [_chunk_to_text(chunk) for chunk in chunks]

    embedding_function = TfidfEmbeddingFunction()
    embedding_function.fit(documents)

    client = chromadb.PersistentClient(path=str(persist_path))
    _reset_collection(client, COLLECTION_NAME)

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_function,
        metadata={"hnsw:space": "cosine"},
    )

    collection.add(
        ids=[str(chunk["chunk_id"]) for chunk in chunks],
        documents=documents,
        metadatas=[_chunk_to_metadata(chunk) for chunk in chunks],
    )

    return collection


def query_vector_db(collection, query_text: str, top_k: int = 5) -> list[dict[str, Any]]:
    """Return the top_k most semantically relevant curriculum chunks."""
    results = collection.query(
        query_texts=[query_text],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    matches = []
    for chunk_id, document, metadata, distance in zip(
        ids, documents, metadatas, distances
    ):
        matches.append(
            {
                "chunk_id": chunk_id,
                "score": _distance_to_similarity(distance),
                "distance": distance,
                "metadata": metadata,
                "text": document,
            }
        )

    return matches


def _reset_collection(client, collection_name: str) -> None:
    try:
        client.delete_collection(collection_name)
    except Exception:
        pass


def _chunk_to_text(chunk: dict[str, Any]) -> str:
    topics = _as_list(chunk.get("topics"))
    objectives = _as_list(chunk.get("learning_objectives"))
    tools = _as_list(chunk.get("tools"))

    sections = []
    if topics:
        sections.append("Topics: " + "; ".join(topics))
    if objectives:
        sections.append("Learning objectives: " + "; ".join(objectives))
    if tools:
        sections.append("Tools: " + "; ".join(tools))

    return "\n".join(sections)


def _chunk_to_metadata(chunk: dict[str, Any]) -> dict[str, Any]:
    metadata = {}

    if "module_id" in chunk:
        metadata["module_id"] = chunk["module_id"]
    if "module_title" in chunk:
        metadata["module_title"] = chunk["module_title"]
    if "day" in chunk:
        metadata["day"] = chunk["day"]

    return metadata


def _as_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    return [str(value)]


def _distance_to_similarity(distance: float | None) -> float | None:
    if distance is None:
        return None
    return 1.0 - distance


def _sample_curriculum_chunks() -> list[dict[str, Any]]:
    return [
        {
            "chunk_id": "module-1-day-1",
            "module_id": 1,
            "module_title": "Programming Foundations",
            "day": 1,
            "topics": ["Python functions", "parameters", "return values"],
            "learning_objectives": [
                "Write reusable Python functions",
                "Trace function inputs and outputs",
            ],
            "tools": ["Python", "VS Code"],
        },
        {
            "chunk_id": "module-1-day-2",
            "module_id": 1,
            "module_title": "Programming Foundations",
            "day": 2,
            "topics": ["recursive functions", "base cases", "call stacks"],
            "learning_objectives": [
                "Explain how recursive calls build up on the call stack",
                "Identify base cases that stop recursion",
                "Trace recursive execution step by step",
            ],
            "tools": ["Python", "Debugger"],
        },
        {
            "chunk_id": "module-2-day-3",
            "module_id": 2,
            "module_title": "Retrieval Systems",
            "day": 3,
            "topics": ["embeddings", "vector search", "semantic retrieval"],
            "learning_objectives": [
                "Convert text into searchable vectors",
                "Compare semantic search with keyword search",
            ],
            "tools": ["ChromaDB", "scikit-learn"],
        },
    ]


if __name__ == "__main__":
    persist_dir = STORAGE_DIR / "chroma_curriculum_db"
    if persist_dir.exists():
        shutil.rmtree(persist_dir)

    collection = build_vector_db(_sample_curriculum_chunks(), persist_dir)
    matches = query_vector_db(
        collection,
        query_text="recursive functions and call stacks",
        top_k=3,
    )

    for rank, match in enumerate(matches, start=1):
        metadata = match["metadata"]
        print(f"Rank {rank}")
        print(f"ID: {match['chunk_id']}")
        print(f"Score: {match['score']:.4f}")
        print(f"Module: {metadata.get('module_id')} - {metadata.get('module_title')}")
        print(f"Day: {metadata.get('day')}")
        print(match["text"])
        print()
