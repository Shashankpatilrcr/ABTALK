export const MOCK_INTERVIEW_QUESTIONS = [
  {
    id: 1,
    topic: "Retrieval-Augmented Generation",
    conceptId: "rag_retrieval",
    subtopic: "Retrieval Fundamentals",
    difficulty: "Intermediate",
    difficultyTrend: "Intermediate → Advanced",
    type: "Conceptual Reasoning",
    question: "Let's explore Retrieval-Augmented Generation (RAG). Why is vector/keyword retrieval necessary before the generation step in an enterprise RAG system, rather than feeding raw documents directly into the context window?",
    isFollowUp: false,
    parentQuestionId: null
  },
  {
    id: 2,
    topic: "Retrieval-Augmented Generation",
    conceptId: "rag_gen",
    subtopic: "Context Chunking & Overlap",
    difficulty: "Intermediate",
    difficultyTrend: "Intermediate → Advanced",
    type: "Architectural Design",
    question: "When chunking large documents for RAG indexing, what are the trade-offs between small chunk sizes (e.g., 128 tokens) vs. large chunk sizes (e.g., 1024 tokens), and how does chunk overlap mitigate boundary context loss?",
    isFollowUp: true,
    parentQuestionId: 1
  },
  {
    id: 3,
    topic: "Embeddings & Semantic Search",
    conceptId: "embeddings",
    subtopic: "Dense Vector Space",
    difficulty: "Intermediate",
    difficultyTrend: "Intermediate → Advanced",
    type: "Technical Trade-off",
    question: "How do dense vector embeddings capture semantic intent compared to sparse lexical retrieval (like BM25), and in what scenarios would a Hybrid Search pipeline perform better than vector search alone?",
    isFollowUp: false,
    parentQuestionId: null
  },
  {
    id: 4,
    topic: "Vector Databases",
    conceptId: "vector_db",
    subtopic: "Indexing & HNSW",
    difficulty: "Advanced",
    difficultyTrend: "Advanced",
    type: "Algorithmic Analysis",
    question: "Hierarchical Navigable Small World (HNSW) is widely used for Approximate Nearest Neighbor (ANN) search. How does HNSW balance search latency versus recall compared to flat exact search?",
    isFollowUp: true,
    parentQuestionId: 3
  },
  {
    id: 5,
    topic: "Prompt Engineering & Context",
    conceptId: "prompt_eng",
    subtopic: "Structured Outputs & Steering",
    difficulty: "Intermediate",
    difficultyTrend: "Intermediate → Advanced",
    type: "Implementation Strategy",
    question: "When steering an LLM to produce strict JSON schema outputs for downstream API execution, what mechanisms (e.g., JSON mode, function calling, system prompt constraints) ensure deterministic parsing?",
    isFollowUp: false,
    parentQuestionId: null
  },
  {
    id: 6,
    topic: "Agentic AI & Orchestration",
    conceptId: "agentic_ai",
    subtopic: "Multi-Agent Coordination",
    difficulty: "Advanced",
    difficultyTrend: "Advanced",
    type: "System Architecture",
    question: "In a multi-agent system (e.g. Supervisor-Worker architecture), how do you handle state management and prevent infinite tool execution loops when an agent receives unexpected environment output?",
    isFollowUp: true,
    parentQuestionId: 5
  },
  {
    id: 7,
    topic: "Model Context Protocol (MCP)",
    conceptId: "mcp",
    subtopic: "Tool Discovery & Security",
    difficulty: "Advanced",
    difficultyTrend: "Advanced",
    type: "Protocol & Security",
    question: "Model Context Protocol (MCP) standardizes how host applications expose data sources and tools to LLMs. What are the key architectural advantages of using MCP over custom ad-hoc tool integrations?",
    isFollowUp: false,
    parentQuestionId: null
  },
  {
    id: 8,
    topic: "Evaluation & Observability",
    conceptId: "observability",
    subtopic: "RAG Evaluation Triad",
    difficulty: "Advanced",
    difficultyTrend: "Advanced",
    type: "Production Engineering",
    question: "Finally, how do you evaluate an enterprise LLM pipeline in production? Describe the RAG evaluation triad (Faithfulness, Answer Relevance, Context Relevance) and how you measure hallucination rate.",
    isFollowUp: true,
    parentQuestionId: 7
  }
];
