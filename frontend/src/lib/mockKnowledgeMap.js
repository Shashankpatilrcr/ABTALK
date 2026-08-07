export const MOCK_KNOWLEDGE_MAP = {
  root: {
    id: "rag",
    label: "RAG Architecture",
    children: ["rag_retrieval", "rag_gen"],
  },
  nodes: {
    rag_retrieval: {
      id: "rag_retrieval",
      label: "Retrieval",
      parentId: "rag",
      children: ["embeddings", "vector_db"],
    },
    rag_gen: {
      id: "rag_gen",
      label: "Generation",
      parentId: "rag",
      children: ["prompt_eng"],
    },
    embeddings: {
      id: "embeddings",
      label: "Embeddings",
      parentId: "rag_retrieval",
      children: [],
    },
    vector_db: {
      id: "vector_db",
      label: "Vector DB",
      parentId: "rag_retrieval",
      children: ["agentic_ai"],
    },
    prompt_eng: {
      id: "prompt_eng",
      label: "Prompt Eng",
      parentId: "rag_gen",
      children: [],
    },
    agentic_ai: {
      id: "agentic_ai",
      label: "Agentic AI",
      parentId: "vector_db",
      children: ["mcp"],
    },
    mcp: {
      id: "mcp",
      label: "MCP Protocol",
      parentId: "agentic_ai",
      children: ["observability"],
    },
    observability: {
      id: "observability",
      label: "Observability",
      parentId: "mcp",
      children: [],
    },
  },
};
