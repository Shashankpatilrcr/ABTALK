// src/lib/knowledgeProfileEngine.js

export const KNOWLEDGE_STATES = {
  STRONG: 'STRONG',
  PARTIAL: 'PARTIAL',
  GAP: 'GAP',
  UNEXPLORED: 'UNEXPLORED',
};

export const TOPIC_DEFINITIONS = [
  { id: 'rag_retrieval', name: 'RAG Retrieval', day: 1, category: 'Retrieval' },
  { id: 'embeddings', name: 'Vector Embeddings', day: 1, category: 'Retrieval' },
  { id: 'vector_db', name: 'Vector Databases', day: 2, category: 'Storage' },
  { id: 'rag_gen', name: 'RAG Generation', day: 2, category: 'Generation' },
  { id: 'prompt_eng', name: 'Prompt Engineering', day: 3, category: 'Generation' },
  { id: 'agentic_ai', name: 'Agentic AI & Tools', day: 3, category: 'Agents' },
  { id: 'mcp', name: 'MCP Protocol', day: 4, category: 'Integration' },
  { id: 'observability', name: 'Observability & Triad', day: 4, category: 'Operations' },
];

/**
 * Computes structured knowledge profile from session Q&A answer history and evaluation results.
 * Handles deterministic state classification (STRONG, PARTIAL, GAP, UNEXPLORED) and recovery detection.
 */
export function computeKnowledgeProfile(history = [], rawFeedbackResults = []) {
  const profileMap = {};

  // Initialize all curriculum topics as UNEXPLORED
  TOPIC_DEFINITIONS.forEach((t) => {
    profileMap[t.id] = {
      topicId: t.id,
      name: t.name,
      day: t.day,
      category: t.category,
      state: KNOWLEDGE_STATES.UNEXPLORED,
      score: null,
      confidence: 'low',
      evidenceCount: 0,
      evidence: [],
      hasRecovered: false,
      initialStateWasGap: false,
      lastEvaluatedQuestion: null,
      triggeredFollowUp: false,
    };
  });

  // Map raw evaluation results if available (from backend feedback endpoint)
  const evalByQuestion = {};
  if (Array.isArray(rawFeedbackResults)) {
    rawFeedbackResults.forEach((res, idx) => {
      evalByQuestion[idx] = res;
    });
  }

  // Process history items sequentially
  history.forEach((entry, idx) => {
    const topicId = entry.conceptId || slugify(entry.questionTopic || entry.topic);
    let item = profileMap[topicId];

    // If topic is not in predefined list, create dynamically
    if (!item) {
      item = {
        topicId,
        name: entry.questionTopic || entry.topic || 'Technical Topic',
        day: entry.curriculumDay || 1,
        category: 'General',
        state: KNOWLEDGE_STATES.UNEXPLORED,
        score: null,
        confidence: 'low',
        evidenceCount: 0,
        evidence: [],
        hasRecovered: false,
        initialStateWasGap: false,
        lastEvaluatedQuestion: null,
        triggeredFollowUp: false,
      };
      profileMap[topicId] = item;
    }

    const evalResult = evalByQuestion[idx];
    
    // Determine answer evidence quality score
    // Uses real backend score (0-10) if present, or deterministic analysis of answer length and adaptive status
    let qScore = 75; // default fallback
    let signalText = 'Answer recorded and verified.';

    if (evalResult && typeof evalResult.score === 'number') {
      qScore = evalResult.score * 10; // convert 0-10 to 0-100
      if (evalResult.weakness) signalText = `Weakness noted: ${evalResult.weakness}`;
      else if (evalResult.strength) signalText = `Strength noted: ${evalResult.strength}`;
    } else {
      // Deterministic fallback based on candidate answer length and follow-up status
      const ansLength = (entry.answer || '').trim().length;
      if (ansLength < 25) {
        qScore = 35;
        signalText = 'Answer lacked sufficient technical depth.';
      } else if (ansLength < 70) {
        qScore = 60;
        signalText = 'Partial explanation provided; missing key architectural details.';
      } else {
        qScore = 85;
        signalText = 'Demonstrated clear technical reasoning.';
      }
    }

    const qState = qScore >= 75 ? KNOWLEDGE_STATES.STRONG : qScore >= 50 ? KNOWLEDGE_STATES.PARTIAL : KNOWLEDGE_STATES.GAP;

    // Record evidence item
    const evidenceItem = {
      questionNumber: idx + 1,
      questionText: entry.question || `Question ${idx + 1}`,
      candidateAnswer: entry.answer || '',
      score: Math.round(qScore),
      state: qState,
      signal: signalText,
      isFollowUp: Boolean(entry.isFollowUp),
    };

    item.evidence.push(evidenceItem);
    item.evidenceCount += 1;
    item.lastEvaluatedQuestion = idx + 1;
    if (entry.isFollowUp) item.triggeredFollowUp = true;

    // Track state transitions & knowledge recovery
    const prevLowestStateWasGap = item.initialStateWasGap || item.state === KNOWLEDGE_STATES.GAP;

    // Calculate aggregated topic score
    const scores = item.evidence.map((e) => e.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    item.score = avgScore;

    // Determine current state based on aggregate score & latest follow-up
    if (avgScore >= 75) {
      item.state = KNOWLEDGE_STATES.STRONG;
    } else if (avgScore >= 50) {
      item.state = KNOWLEDGE_STATES.PARTIAL;
    } else {
      item.state = KNOWLEDGE_STATES.GAP;
    }

    // Mark recovery if it was previously a GAP and now improved after follow-up
    if (prevLowestStateWasGap && (item.state === KNOWLEDGE_STATES.PARTIAL || item.state === KNOWLEDGE_STATES.STRONG)) {
      item.hasRecovered = true;
    }

    if (qState === KNOWLEDGE_STATES.GAP) {
      item.initialStateWasGap = true;
    }

    // Set confidence
    item.confidence = item.evidenceCount >= 3 ? 'high' : item.evidenceCount >= 2 ? 'medium' : 'low';
  });

  const topicsList = Object.values(profileMap);

  // Compute summary metrics
  const strongCount = topicsList.filter((t) => t.state === KNOWLEDGE_STATES.STRONG).length;
  const partialCount = topicsList.filter((t) => t.state === KNOWLEDGE_STATES.PARTIAL).length;
  const gapCount = topicsList.filter((t) => t.state === KNOWLEDGE_STATES.GAP).length;
  const unexploredCount = topicsList.filter((t) => t.state === KNOWLEDGE_STATES.UNEXPLORED).length;
  const recoveredList = topicsList.filter((t) => t.hasRecovered);
  const primaryGap = topicsList.find((t) => t.state === KNOWLEDGE_STATES.GAP);

  return {
    topics: topicsList,
    profileMap,
    summary: {
      strongCount,
      partialCount,
      gapCount,
      unexploredCount,
      totalExplored: strongCount + partialCount + gapCount,
      primaryGapName: primaryGap ? primaryGap.name : null,
      recoveredCount: recoveredList.length,
      recoveredTopics: recoveredList,
    },
  };
}

function slugify(val) {
  if (!val) return 'rag_retrieval';
  const str = String(val).toLowerCase();
  if (str.includes('embed')) return 'embeddings';
  if (str.includes('vector') || str.includes('database') || str.includes('index') || str.includes('store')) return 'vector_db';
  if (str.includes('retriev') || str.includes('search') || str.includes('chunk') || str.includes('hybrid')) return 'rag_retrieval';
  if (str.includes('prompt') || str.includes('gen') || str.includes('context window') || str.includes('few-shot')) return 'prompt_eng';
  if (str.includes('llm') || str.includes('generat') || str.includes('rag') || str.includes('hallucin')) return 'rag_gen';
  if (str.includes('agent') || str.includes('tool') || str.includes('flow') || str.includes('chain')) return 'agentic_ai';
  if (str.includes('mcp') || str.includes('protocol') || str.includes('api') || str.includes('integration')) return 'mcp';
  if (str.includes('observe') || str.includes('eval') || str.includes('triad') || str.includes('monitor') || str.includes('trace') || str.includes('metric')) return 'observability';
  return str.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'rag_retrieval';
}
