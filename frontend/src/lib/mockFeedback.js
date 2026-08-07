export const MOCK_FEEDBACK_DATA = {
  header: {
    title: "ASSESSMENT COMPLETE",
    subtitle: "AI Assessment Cockpit • Technical Evaluation Report",
    questionsCount: 8,
    topicsCount: 5,
    adaptiveFollowUpsCount: 2,
    timestamp: "August 7, 2026 • 21:45 UTC",
  },
  overallScore: {
    score: 84,
    label: "TECHNICAL DEPTH",
    assessmentTag: "Strong Conceptual & Architectural Foundation",
    dimensions: [
      { name: "Conceptual Understanding", score: 88 },
      { name: "Application & Architecture", score: 82 },
      { name: "Reasoning Depth & Edge Cases", score: 80 },
    ],
  },
  knowledgeProfile: [
    { topic: "Retrieval-Augmented Generation (RAG)", score: 90, status: "Strong" },
    { topic: "LLMs & Prompt Engineering", score: 85, status: "Strong" },
    { topic: "Vector Databases & Indexing", score: 72, status: "Developing" },
    { topic: "Agentic AI & Orchestration", score: 84, status: "Strong" },
    { topic: "Evaluation & Observability", score: 78, status: "Good" },
  ],
  observationNarrative:
    "The candidate demonstrated strong conceptual understanding of Retrieval-Augmented Generation (RAG) and articulated the necessity of hybrid search retrieval before generation clearly. When the interview probed deeper into vector indexing algorithms (e.g., HNSW recall trade-offs) and chunking boundary overlap, the explanation indicated an opportunity to strengthen practical tuning knowledge.",
  strengths: [
    {
      title: "Strong Conceptual Reasoning in RAG",
      description: "Articulated the separation of retrieval and generation steps in enterprise RAG systems with clarity.",
    },
    {
      title: "Clear Multi-Agent State Awareness",
      description: "Demonstrated good comprehension of supervisor-worker patterns and preventing infinite tool execution loops.",
    },
    {
      title: "Deterministic LLM Output Control",
      description: "Effective understanding of JSON mode, function calling, and system steering constraints.",
    },
    {
      title: "Cross-Domain Technical Connections",
      description: "Consistently connected prompt engineering fundamentals with downstream API integration constraints.",
    },
  ],
  knowledgeGaps: [
    {
      title: "Vector Database Index Tuning",
      description: "Further exploration needed on tuning HNSW M and efConstruction parameters to balance recall vs. query latency.",
    },
    {
      title: "Chunking & Boundary Overlap Strategies",
      description: "Consider experimenting with semantic chunking rather than fixed-size token splitting for document boundaries.",
    },
    {
      title: "Production RAG Observability",
      description: "Deepen practical experience with automated evaluation triads (Faithfulness, Answer Relevance, Context Relevance).",
    },
  ],
  recommendations: [
    {
      step: "01",
      title: "Deepen Vector Retrieval & Index Tuning",
      description: "Benchmark ANN search latency vs. recall using Milvus or Qdrant under varying graph index configurations.",
      topic: "Vector Databases",
    },
    {
      step: "02",
      title: "Experiment with Semantic Document Chunking",
      description: "Compare fixed-size token splitting against sentence-level semantic similarity boundaries for document RAG.",
      topic: "Retrieval-Augmented Generation",
    },
    {
      step: "03",
      title: "Implement Automated RAG Evaluation Pipelines",
      description: "Set up Ragas or TruLens evaluation hooks to continuously measure hallucination rate and answer faithfulness.",
      topic: "Evaluation & Observability",
    },
  ],
  evidence: [
    {
      id: "ev-1",
      strengthTitle: "Strong Conceptual Reasoning in RAG",
      questionNumber: 1,
      questionText: "Why is vector/keyword retrieval necessary before the generation step in an enterprise RAG system, rather than feeding raw documents directly into the context window?",
      candidateAnswer: "Retrieval filters out noise and keeps context size manageable, enabling accurate generation within prompt limits and reducing cost.",
      observationSignal: "Demonstrates clear understanding of context window limits, latency trade-offs, and noise suppression prior to LLM synthesis.",
    },
    {
      id: "ev-2",
      strengthTitle: "Vector Indexing Technical Probe",
      questionNumber: 4,
      questionText: "How does HNSW balance search latency versus recall compared to flat exact search?",
      candidateAnswer: "HNSW builds a multi-layer graph for fast approximate nearest neighbor search, sacrificing exact recall for logarithmic latency scaling.",
      observationSignal: "Understands graph layer navigation but can benefit from benchmarking specific graph construction parameters in production.",
    },
  ],
};
