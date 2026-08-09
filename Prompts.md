# AI Interview Agent — Prompt Log

This log documents the prompts used to vibe-code this project across all three layers: **Data Layer**, **Backend**, and **Frontend**. Each entry reflects the actual prompt used to generate the corresponding code or design.

---

## 1. Data Layer

Built and tested module-by-module. Each prompt fed the real output/interface of the previous module to keep the chain accurate.

### 1.1 Curriculum Ingestion

```
I have a curriculum JSON file structured like this:
{
  "course_title": "...",
  "modules": [
    {
      "module_id": "...",
      "module_title": "...",
      "days": [
        {"day": <int>, "topics": [...], "learning_objectives": [...], "tools": [...]}
      ]
    }
  ]
}

Write a Python module that parses this into a list of typed "CurriculumChunk"
objects, one per day, with fields: chunk_id, module_id, module_title, day,
topics, learning_objectives, tools. Add a to_text() method that flattens each
chunk into one string for embedding later. Include a main block that loads a
sample file and prints each chunk. Give me the full runnable file.
```

### 1.2 Vector Database Setup (ChromaDB)

```
I'm building a RAG (retrieval-augmented generation) system for an interview
prep platform. I've already got a curriculum ingestion step that parses a
curriculum JSON file into structured chunks — one per day — each with:
- chunk_id
- module_id, module_title
- day number
- topics (list of strings)
- learning_objectives (list of strings)
- tools (list of strings)

Now I need you to set up a vector database for semantic search over this
curriculum content. Requirements:

1. Use ChromaDB (local, persistent, no external API required for this pass).
2. Write a Python function build_vector_db(chunks, persist_path) that:
   - Creates a persistent ChromaDB client at persist_path
   - Creates (or resets) a collection called "curriculum"
   - Converts each chunk into a single text string combining its topics,
     objectives, and tools
   - Adds all chunks into the collection with their text, metadata
     (module_id, module_title, day), and IDs
3. Write a function query_vector_db(collection, query_text, top_k) that
   takes a natural-language question and returns the top_k most semantically
   relevant curriculum chunks.
4. Since I don't have an OpenAI API key yet, use a free local embedding
   method (e.g. TF-IDF via scikit-learn, wrapped as a custom ChromaDB
   embedding function) so it runs fully offline.
5. Add a comment showing exactly how I'd swap in OpenAI's
   text-embedding-3-small embedding function later, once I have an API key,
   without changing anything else in the code.
6. Include a if __name__ == "__main__": block that builds the DB from a
   sample curriculum, runs a test query like "recursive functions and call
   stacks", and prints the results with their similarity scores.

Give me the full, runnable Python file.
```

### 1.3 Candidate Profile Processor

```
I have a candidate profile JSON with this shape:
{
  "candidate_id": "...",
  "name": "...",
  "missions": [
    {"mission_id": "...", "topic": "...", "status": "completed|skipped|in_progress",
     "attempts": <int>, "score": <float or null>}
  ]
}

Write a Python module that:
1. Parses this JSON into a list of typed "TopicSignal" objects (topic, status, attempts, score)
2. Adds a "mastery_label" property with this logic:
   - status == "skipped" -> "unknown"
   - score is None -> "in_progress"
   - score >= 0.85 and attempts <= 1 -> "strong"
   - score >= 0.7 -> "adequate"
   - otherwise -> "weak"
3. Builds a "CandidateKnowledgeMap" that groups topics by their mastery_label
4. Include a main block that loads a sample profile and prints the grouped summary

Give me the full runnable Python file.
```

### 1.4 Candidate Profile Processor — Test Suite

```
I have a Python module called candidate_processor.py that builds a
"CandidateKnowledgeMap" from a candidate's mission history JSON. It labels
each topic as "strong", "adequate", "weak", "unknown", or "in_progress"
based on score/attempts/status.

Write a test script (test_candidate_processor.py) that verifies this
module works correctly. It should:

1. Create a few sample candidate profiles as inline Python dicts (not files),
   covering every edge case:
   - a topic with high score + 1 attempt (should be "strong")
   - a topic with score >= 0.7 but more attempts (should be "adequate")
   - a topic with a low score (should be "weak")
   - a topic marked "skipped" (should be "unknown")
   - a topic with no score yet, status "in_progress" (should be "in_progress")
2. Run each sample through the candidate_processor functions
3. Assert that each topic ends up in the correct bucket, and print a clear
   PASS/FAIL for each case
4. If a test fails, print what was expected vs what was actually returned

Use Python's built-in unittest or plain asserts, whichever is simpler.
Give me the full runnable file.
```

### 1.5 RAG Pipeline

```
I have two working modules:

1. vector_store_chromadb.py — has build_vector_db(chunks, persist_path) and
   query_vector_db(collection, query_text, top_k) which returns the closest
   matching curriculum chunks for any text query.

2. candidate_processor.py — has process_candidate(json_path) which returns a
   CandidateKnowledgeMap with a .topics_by_label(label) method, where label
   is "strong", "adequate", "weak", "unknown", or "in_progress".

Write rag_pipeline.py that:
1. Takes a CandidateKnowledgeMap and a ChromaDB collection
2. For every topic labeled "weak" or "unknown", queries the vector DB using
   that topic as the query text
3. Returns a list of "PersonalizedRetrieval" objects, each with: focus_topic,
   reason ("weak" or "unknown"), and the matched curriculum chunks with scores
4. Include a main block that loads a sample candidate + curriculum, runs the
   pipeline, and prints which curriculum content got matched to which weak spot

Give me the full runnable file.
```

### 1.6 Question Bank Generator

```
I have curriculum_ingestion.py which produces a list of CurriculumChunk
objects, each with topics, learning_objectives, and day number.

Write question_bank_generator.py that:
1. Generates at least 3 questions per topic per chunk, at 3 difficulty
   levels: easy, medium, hard
2. Each question is tagged with: topic, difficulty, learning_objective,
   module_id, day
3. Use simple template-based generation for now (no LLM call) — e.g.
   "Can you explain {topic}?" for easy, "Walk me through applying {topic}..."
   for medium, "What tradeoffs exist with {topic}?" for hard
4. Add a comment showing how I'd swap in an LLM call (Claude/GPT) later for
   higher-quality questions, without changing the rest of the pipeline
5. Include a main block that generates the full bank from a sample curriculum,
   confirms it covers at least 4 distinct days, and saves it to
   question_bank.json

Give me the full runnable file.
```

### 1.7 Data API

```
I have these working modules: curriculum_ingestion.py (ingest_curriculum),
vector_store_chromadb.py (build_vector_db, query_vector_db),
candidate_processor.py (process_candidate, CandidateKnowledgeMap),
rag_pipeline.py (retrieve_for_candidate), and question_bank_generator.py
(generate_question_bank).

Write api.py using FastAPI that exposes:
- GET /candidate/{candidate_id}/summary — returns the candidate's knowledge map
- GET /candidate/{candidate_id}/curriculum — returns curriculum chunks relevant
  to their weak/unknown topics via the RAG pipeline
- GET /candidate/{candidate_id}/questions — returns question bank entries
  matching their weak/unknown topics
- GET /health — returns basic status info

Build everything once at startup. Include a note on how to run it with
uvicorn and test it with curl or the /docs page.

Give me the full runnable file.
```

---

## 2. Backend — LLM Prompt Templates

Prompt templates used inside the interview agent for question generation, adaptive follow-ups, evaluation, and feedback.

### 2.1 Interview Question Generation

```
You are an expert AI interviewer.
Based on the candidate's completed curriculum topics and past responses, generate a technical
interview question.
Requirements:
- Focus on concepts the candidate has studied
- Adjust difficulty based on previous answers
- Ask clear, concise, real-world questions
- Avoid repetition
- Maintain interview flow
Return only one question.
```

### 2.2 Follow-up Question Prompt (Adaptive)

```
You are conducting a live technical interview.
Given the candidate's previous answer, generate a follow-up question.
Requirements:
- If answer is strong → go deeper
- If answer is weak → simplify or clarify
- Probe understanding, not memorization
- Keep it conversational
Return only the next question.
```

### 2.3 Answer Evaluation Prompt

```
You are an expert evaluator.
Evaluate the candidate's answer to a technical question.
Criteria:
- Correctness
- Depth of understanding
- Clarity
- Practical knowledge
Return JSON:
{
"score": (1-10),
"strengths": [],
"weaknesses": [],
"improvement": ""
}
```

### 2.4 Final Feedback Generation Prompt

```
You are an AI interview coach.
Based on the full interview conversation, generate structured feedback.
Include:
- Overall performance summary
- Key strengths
- Key weaknesses
- Suggested improvements
- Recommended topics to revise
Keep it actionable and concise.
```

### 2.5 RAG Context Injection Prompt

```
Use the following curriculum context to guide the interview:
{retrieved_context}
Ensure:
- Questions are aligned with curriculum
- Avoid out-of-scope topics
- Reference concepts implicitly
Do not mention the context explicitly.
```

### 2.6 Codex Prompt — LLM Provider Integration

```
Refactor the backend to replace local Ollama usage with a cloud LLM provider (Google Gemini).
Requirements:
- Add environment-based provider selection (LLM_PROVIDER)
- Implement Gemini API integration
- Keep Ollama as fallback for local development
- Ensure no localhost dependencies in production
- Update requirements.txt accordingly.
```

### 2.7 Codex Prompt — Frontend Responsive Fix

```
Fix the mobile responsiveness issue in the navbar.
Requirements:
- Add hamburger menu for small screens
- Use Tailwind responsive classes
- Ensure Curriculum and Interview links are accessible
- Keep desktop layout unchanged
- Use React state to toggle menu.
```

---

## 3. Frontend

Built in staged prompts, each stage explicitly scoped to prevent scope creep or backend/data-layer edits.

### 3.1 Stage 1 — Application Foundation & Design System

```
We are building the frontend for a hackathon project called "AI Interview Agent".
I am Person 3 and I own the frontend, demo experience, deployment and documentation.
The backend and RAG/data layers are being developed separately by teammates, so DO NOT modify backend or data code.

First, inspect the existing frontend project and understand its current structure.
Do NOT build the entire application yet.
For this stage, ONLY create a premium frontend foundation and application shell.

PRODUCT CONCEPT:
This is NOT a ChatGPT clone.
The product is an adaptive technical assessment system that conducts a multi-turn interview,
adapts follow-up questions based on candidate responses, maintains context, and produces an
evidence-based assessment.
The experience should feel like an "AI Assessment Cockpit".

DESIGN DIRECTION:
- Premium, Technical, Minimal, Dark interface
- Near-black/charcoal background
- Restrained indigo/electric-blue accent
- Excellent typography, subtle borders, sophisticated cards
- Generous spacing, small purposeful animations
- No cartoon robots, no stock illustrations, no excessive gradients
- No generic SaaS dashboard look, no ChatGPT imitation

Create a reusable design system for: buttons, cards, inputs, badges, status indicators,
typography, spacing, navigation, loading states.

Create an application shell that can later contain these three major experiences:
1. Candidate Selection / Assessment Launchpad
2. AI Interview Room
3. Assessment Intelligence Report

For now, DO NOT implement the actual interview logic. Use placeholder content where necessary.
Keep the code clean and component-based.
Do not install unnecessary libraries. Do not modify package configuration unless required.
Do not create fake API calls.

After implementation:
1. Run the application.
2. Check for console errors.
3. Check desktop layout.
4. Check mobile layout.
5. Tell me exactly which files you created or modified.

STOP after completing the foundation. Do not continue to the next feature automatically.

Roadmap:
STAGE 1  → Perfect Candidate Selection
STAGE 2  → Interview Room / Chat UI
STAGE 3  → AI Thinking + Adaptive Follow-up UX
STAGE 4  → Cognitive Map
STAGE 5  → Interview Journey / Progress
STAGE 6  → Assessment Intelligence Report
STAGE 7  → API Integration with Person 1
STAGE 8  → Error handling + Demo polish
STAGE 9  → Deployment
STAGE 10 → README + PROMPTS + final demo
```

### 3.2 Candidate Selection → "Assessment Launchpad"

```
We are continuing development of the existing AI Interview Agent frontend.

IMPORTANT:
The project already has a working Candidate Selection page.
DO NOT recreate the project. DO NOT initialize a new Next.js project.
DO NOT change the framework. DO NOT modify backend or data-layer files.
DO NOT delete existing components. DO NOT modify unrelated functionality.

First inspect the existing frontend code and understand how the current Candidate
Selection page is implemented.

Our product vision: This is NOT a ChatGPT clone. It is an "AI Assessment Cockpit"
that evaluates how a candidate thinks across their AI learning journey.

The overall journey will eventually be:
Candidate Selection → AI Interview Room → Adaptive Follow-ups → Assessment Intelligence Report

For THIS PROMPT ONLY, focus exclusively on improving the existing Candidate Selection experience.

DESIGN GOAL:
Transform the current Candidate Selection page into a premium "Assessment Launchpad".
It should feel like a serious technical assessment platform rather than a normal student project.

Visual direction:
- premium dark interface, near-black/charcoal foundation
- restrained indigo/electric-blue accent
- sophisticated typography, subtle borders, clean spacing
- minimal glass effects, subtle micro-interactions
- professional enterprise-AI aesthetic
- no cartoon robots, no stock images, no excessive gradients, no generic dashboard appearance

The candidate selection experience should communicate:
WHO is being assessed / WHAT they have learned / WHERE their current strengths are /
WHAT the upcoming interview will evaluate

Include, where the existing data structure allows:
1. Candidate identity
2. AI Cohort learning progress
3. Completed learning days
4. Relevant technical topics
5. Candidate level/readiness
6. Assessment configuration
7. Number of questions
8. Adaptive interview status
9. A strong "Begin Assessment" CTA

Create a visually clear hierarchy.

IMPORTANT PRODUCT DETAIL:
Do not expose internal implementation details to the candidate. Use human-readable labels
such as "Learning Journey", "Technical Coverage", "Assessment Mode", "Adaptive Follow-ups",
"Interview Readiness" instead of developer terminology.

INTERACTION:
When the candidate card is selected: add a clear selected state, provide subtle visual
feedback, enable the Begin Assessment button.
When Begin Assessment is clicked: preserve the selected candidate, navigate to the existing
interview route if one exists, otherwise create the minimal route required for the future
Interview Room.
Do NOT implement the actual interview yet.

MOCK DATA:
If the current frontend does not have backend data available, continue using the existing
mock candidate data. Do NOT invent a new API. Keep the data structure isolated so Person 2's
real candidate data can replace it later.

COMPONENT QUALITY:
Prefer reusable components: CandidateCard, CandidateProgress, TechnicalCoverage,
AssessmentConfig, BeginAssessmentButton. Do not create components unnecessarily.

RESPONSIVENESS: The page must work properly on laptop, desktop, and mobile.

QUALITY CHECK:
1. Run the app.
2. Verify Candidate Selection works.
3. Verify candidate selection state.
4. Verify Begin Assessment navigation.
5. Check mobile layout.
6. Check browser console for errors.
7. Make sure existing functionality still works.

IMPORTANT: Do NOT move to the Interview Room yet.
```

### 3.3 Stage 2 — AI Interview Room

```
We are now moving to STAGE 2 of the AI Interview Agent.

IMPORTANT:
The existing Candidate Selection / Assessment Launchpad is already implemented and working.
DO NOT redesign the Candidate Selection page. DO NOT rebuild the project.
DO NOT modify backend code. DO NOT modify the data layer. DO NOT remove existing functionality.

We are now building the SECOND screen: THE AI INTERVIEW ROOM.

PRODUCT VISION:
This should NOT look like ChatGPT.
The candidate should feel like they have entered an intelligent technical assessment environment.
Think: "AI Assessment Cockpit"
The interface should communicate that the system is actively evaluating the candidate's
technical reasoning.

USER FLOW:
Candidate Selection → Begin Assessment → AI Interview Room
When the user clicks the existing "Begin Assessment Session" button, navigate to the
interview page while preserving the selected candidate.

FIRST implement the frontend experience using realistic mock interview data.
Do NOT connect to the backend API yet. Person 1 is building the backend separately.

INTERVIEW ROOM DESIGN — three-zone layout:

ZONE 1 — SESSION CONTEXT (left)
Show: candidate name, role, learning journey progress, current question number,
overall interview progress, current technical topic, current difficulty. Keep it compact.

ZONE 2 — AI INTERVIEW CONVERSATION (center, main focus)
Clean interview conversation experience. Large professional textarea/input with
placeholder "Explain your reasoning...". Include character/word count, Submit Answer
button, keyboard-friendly interaction. After submitting, show an AI analysis state
("ANALYZING RESPONSE — Understanding reasoning... Evaluating technical depth...
Selecting next question...") — this is only a UI state for now — then show the next
mock question.

ZONE 3 — COGNITIVE MAP (key differentiating feature)
A small "Cognitive Map" panel representing concepts being evaluated. The current
concept should be visually highlighted; when the question changes, the active concept
changes. Use subtle animation. DO NOT make this a complicated graph library — a clean
CSS/SVG-based conceptual map is preferred.

TOP HEADER:
Premium interview header: "AI INTERVIEW AGENT", "LIVE ASSESSMENT", "Question 03/08",
"Session Active", optional candidate initials/avatar. Keep it minimal.

QUESTION EXPERIENCE:
Every question needs metadata: Topic, Difficulty, Question type. Reserve space for an
"ADAPTIVE FOLLOW-UP" badge — do NOT implement real adaptive logic yet.

MOCK INTERVIEW DATA:
Create a clean local mock data structure with fields: id, topic, subtopic, difficulty,
type, question. Create at least 8 realistic questions spanning multiple AI topics
(RAG, Vector Databases, Prompt Engineering, AI Agents, LLMs), representing the actual
project requirement of 8+ questions across 4+ curriculum areas. Do not make the
questions trivial.

INTERACTION (must actually work locally, using local state only, no API calls):
1. Show question. 2. Candidate types answer. 3. Candidate clicks Submit. 4. Show
analyzing state. 5. Move to next question. 6. Update question counter. 7. Update
progress. 8. Update current topic. 9. Update Cognitive Map. 10. After final question,
navigate toward the future feedback page.

DESIGN QUALITY:
Make it feel like a premium enterprise AI product. Avoid excessive glowing effects,
giant gradients, cartoon graphics, generic chatbot bubbles, excessive rounded cards,
unnecessary animations. Prefer precise spacing, strong typography, subtle borders,
restrained accent colors, elegant transitions, clear information hierarchy. The
interview conversation must remain the visual center; the Cognitive Map should
support the experience, not dominate it.

RESPONSIVENESS: Desktop = three-zone layout. Tablet = reduce Cognitive Map width.
Mobile = stack sections intelligently; candidate must still complete the interview
comfortably.

CODE QUALITY:
Use reusable components: InterviewHeader, CandidateContext, ChatWindow, QuestionBubble,
ResponseInput, InterviewProgress, CognitiveMap, AnalysisState. Keep interview state
isolated in useInterviewSession.js. Keep mock data isolated from UI components. Do not
create unnecessary dependencies. Do not modify backend or data folders.

Before coding, inspect the existing project and reuse existing components/styles where
appropriate. Do not duplicate existing components. Do not change the existing Candidate
Selection visual design. Only implement the Interview Room and the navigation required
to reach it.

After implementation, test: Begin Assessment, all 8 questions, answer submission,
analyzing state, progress updates, Cognitive Map changes, final-question behavior,
browser console, mobile responsiveness.

STOP after completing STAGE 2. Finally tell me: files created, files modified,
components created, how navigation works, any assumptions made.
```

### 3.4 Stage 3 — Frontend-Only Adaptive Interview Experience

```
STAGE 3 — FRONTEND-ONLY ADAPTIVE INTERVIEW EXPERIENCE

IMPORTANT CONTEXT:
I am Person 3 and I am currently building ONLY the frontend.
Person 1 has NOT implemented the backend/API yet.
Therefore: DO NOT create backend code. DO NOT create API calls. DO NOT assume an API
exists. DO NOT modify backend files. DO NOT modify data-layer files.
Everything in this stage must work using LOCAL MOCK DATA ONLY.
The purpose is to build the final frontend experience now so that the real backend can
be connected later.
The existing Candidate Selection page and Interview Room are already working.
DO NOT redesign them.

GOAL:
Make the interview FEEL adaptive through frontend interaction. Simulate:
Candidate sees question → submits answer → "Analyzing response..." state →
"Adaptive follow-up" state → next question → Cognitive Map updates
This is only a frontend simulation. Do NOT pretend the frontend is actually evaluating
the candidate.

MOCK DATA:
Each question can contain: id, topic, difficulty, question, isFollowUp,
parentQuestionId. Create at least 8 questions covering at least 4 technical topics.

INTERACTION:
When the candidate submits an answer:
1. Disable the input briefly. 2. Show "Analyzing response...". 3. Show a subtle
assessment transition. 4. If the next question has isFollowUp=true, display
"✦ ADAPTIVE FOLLOW-UP — The interviewer is probing deeper into this concept." 5. Show
the follow-up question. 6. Update the question counter. 7. Update the current topic.
8. Update the Cognitive Map.

IMPORTANT: Do NOT generate fake scores. Do NOT generate fake AI analysis. Do NOT claim
the frontend is actually evaluating the answer. This is purely a UI simulation until
Person 1's backend exists.

COGNITIVE MAP:
Keep the existing Cognitive Map. When the topic changes, visually highlight the new
concept. If the follow-up moves deeper into a subtopic, highlight that subtopic. Keep
this visually subtle.

ADAPTIVE FOLLOW-UP UI:
When isFollowUp=true, show a small "✦ ADAPTIVE FOLLOW-UP" badge. Make the question
visually distinct from normal questions. Do NOT add excessive animation.

STATE MANAGEMENT:
Keep the interview state centralized in useInterviewSession.js. Possible states:
QUESTION, SUBMITTING, ANALYZING, SHOWING_FOLLOW_UP, COMPLETED. Do not scatter this
state across components.

BACKEND BOUNDARY:
The mock data must be isolated. Later Person 1's backend response will replace the
mock data. Do NOT create api.js changes in this stage. Do NOT create fetch requests.
Do NOT invent endpoint names.

QUALITY:
Test all mock questions, answer submission, analyzing state, adaptive follow-up state,
Cognitive Map updates, completion, mobile layout, console. Do not move to backend
integration.

STOP after this stage. Report: files modified, files created, mock data location,
state flow, how Person 1's future API can replace the mock data.
```

### 3.5 Stage 4 — Cognitive Map 2.0

```
STAGE 4 — COGNITIVE MAP 2.0

IMPORTANT CONTEXT:
The frontend is currently completely independent from the backend.
Person 1 has NOT implemented the backend yet.
DO NOT create API calls. DO NOT modify backend code. DO NOT modify the data layer.
Continue using the existing MOCK_INTERVIEW_QUESTIONS.
The Candidate Selection page, Interview Room, adaptive follow-up experience, and
existing CognitiveMap component are already implemented.
DO NOT redesign the entire Interview Room. We are ONLY upgrading the Cognitive Map.

PRODUCT IDEA:
The Cognitive Map should communicate: "The interview is exploring the candidate's
knowledge, not simply asking a list of questions." It should visually represent the
technical concepts being explored during the interview. The map must react to the
current question.

MAP STRUCTURE:
Create a concept hierarchy. The structure should come from the mock question's
topic/subtopic metadata. Do NOT hardcode the map directly inside the UI component —
create a centralized mock knowledge structure, e.g.:

const MOCK_KNOWLEDGE_MAP = {
  RAG: { children: ["Retrieval", "Generation", "Embeddings", "Chunking"] },
  "Vector Databases": { children: ["Embeddings", "Similarity Search", "Indexing"] }
};

ACTIVE CONCEPT:
The current question should determine the active concept. The active concept should be
visually highlighted using: subtle glow, slightly larger node, accent border, smooth
transition. Do not use excessive neon effects.

ADAPTIVE FOLLOW-UP:
If the current question isFollowUp: true and explores a deeper concept, highlight the
relationship between the parent concept and the follow-up concept (e.g. a "DEEPER PROBE"
label). Do not expose internal AI reasoning.

PROGRESSION:
The Cognitive Map should remember concepts already explored during the current
interview, using three visual states: UNEXPLORED (muted), EXPLORED (normal accent),
CURRENT (highlighted). This makes the map evolve throughout the interview.

ANIMATION:
When the active concept changes: previous current node becomes explored, new node
becomes current, connection path subtly animates, map smoothly transitions. Animation
should be fast, subtle, professional. Avoid distracting continuous animations.

DESIGN:
The Cognitive Map should feel like a premium technical visualization. Avoid
complicated graph libraries, huge diagrams, excessive glowing, unnecessary labels,
clutter. Prefer clean nodes, thin connections, typography, whitespace, restrained
accent color, smooth transitions. The map must remain secondary to the interview
conversation.

RESPONSIVE BEHAVIOR:
Desktop: right-side panel. Tablet: reduce map size. Mobile: convert into a compact
collapsible section. Do not let the map push the interview input below the fold
unnecessarily.

ARCHITECTURE:
Keep knowledge-map data separate from the component (e.g. mockKnowledgeMap.js). The
CognitiveMap component should receive data through props:
<CognitiveMap knowledgeMap={knowledgeMap} activeTopic={currentTopic}
exploredTopics={exploredTopics} />
Do not make CognitiveMap responsible for interview state — useInterviewSession.js
remains responsible for interview state.

IMPORTANT:
Do not modify the existing API preparation. Do not remove MOCK_INTERVIEW_QUESTIONS.
Do not change the existing interview state machine. Do not redesign Candidate
Selection. Do not build the Feedback Dashboard yet.

TESTING:
Start interview, observe current concept, submit answer, move to next question,
confirm active concept changes, confirm previous concept becomes explored, test
adaptive follow-up, confirm deeper concept is highlighted, complete several questions,
verify the map does not break on mobile. Check browser console for errors.

STOP after completing this stage. Report: files created, files modified, knowledge
map data structure, how active/explored concepts work.
```

### 3.6 Stage 5 — Interview Journey

```
STAGE 5 — INTERVIEW JOURNEY

IMPORTANT:
I am currently building ONLY the frontend. Person 1 has NOT implemented the backend yet.
DO NOT create API calls. DO NOT modify backend files. DO NOT modify the data layer.
DO NOT invent endpoints. Continue using the existing local MOCK_INTERVIEW_QUESTIONS.

The following frontend experiences are already implemented: Candidate Selection /
Assessment Launchpad, AI Interview Room, Local mock interview state machine, Adaptive
Follow-up UI, Cognitive Map. DO NOT redesign those experiences.

We are now adding a compact "Interview Journey" visualization.

PRODUCT IDEA:
The interview should feel like a guided exploration of the candidate's knowledge. The
user should always understand: where they are, where they have been, what is coming
next, which questions were adaptive, which technical topics have been explored. This
should NOT become a large analytics dashboard — a compact, elegant part of the
Interview Room.

INTERVIEW JOURNEY:
Create a horizontal interview timeline with states: COMPLETED (●), ADAPTIVE/FOLLOW-UP
(✦), CURRENT (◉), UPCOMING (○). Use the existing interview state to determine these
states. Do NOT create a second source of truth for question progress.

QUESTION METADATA:
Each timeline node should know: question number, topic, difficulty, isFollowUp,
parentQuestionId. Use the existing MOCK_INTERVIEW_QUESTIONS structure. Do not
duplicate question data.

TOPIC LABELS:
On desktop, optionally show a small topic label below the timeline. Keep labels
compact; do not clutter the interface.

CURRENT QUESTION:
The current question should be visually emphasized using the existing design system.
When moving to the next question: previous current node becomes completed, new node
becomes current, timeline smoothly updates.

ADAPTIVE QUESTIONS:
If a question has isFollowUp: true, show a subtle ✦ indicator. On hover/click, show a
small contextual tooltip/card with topic and which question it follows. Do NOT expose
hidden reasoning or chain-of-thought — only high-level metadata.

INTERACTION:
If technically appropriate, allow clicking a completed question node to show a compact
summary (question number, topic, type, status). Do NOT allow users to edit previous
answers — this is primarily a visualization.

DESIGN:
The timeline should feel premium, precise, technical, minimal, elegant. Avoid huge
timelines, excessive animations, neon effects, complicated charts, unnecessary icons.
The timeline should support the interview rather than compete with the conversation.

RESPONSIVE:
Desktop: horizontal timeline. Tablet: compressed horizontal timeline. Mobile: compact
scrollable timeline or simplified progress indicator. Do not let the timeline make the
interview difficult to use.

ARCHITECTURE:
Create a reusable InterviewJourney component that receives information from the
existing interview session:
<InterviewJourney questions={questions} currentQuestionIndex={currentQuestionIndex}
completedQuestions={completedQuestions} />
Do NOT make the component own the interview state — useInterviewSession.js remains
the source of truth.

IMPORTANT:
Do not modify Candidate Selection, Interview Room layout, Cognitive Map architecture,
backend integration preparation, or API code. Only add the Interview Journey and the
minimum integration required to display it.

TESTING:
Start interview, Q1 appears as current, submit answer, Q1 becomes completed, Q2
becomes current, reach an adaptive question, confirm adaptive indicator appears,
continue through several questions, confirm timeline remains synchronized, test mobile
layout, check browser console for errors.

STOP after completing this stage. Report: files created, files modified, how the
timeline gets its state, how adaptive questions are represented.
```

### 3.7 Stage 6 — Assessment Intelligence Report

```
STAGE 6 — ASSESSMENT INTELLIGENCE REPORT

IMPORTANT CONTEXT:
I am Person 3 and I am building ONLY the frontend. Person 1 has NOT implemented the
backend yet. DO NOT create API calls. DO NOT modify backend files. DO NOT modify the
data layer. DO NOT invent endpoints. Continue using LOCAL MOCK DATA.

The following frontend experiences are already implemented: Candidate Selection /
Assessment Launchpad, AI Interview Room, Adaptive Follow-up UX, Cognitive Map,
Interview Journey. DO NOT redesign those screens.

We are now creating the FINAL major frontend experience: THE ASSESSMENT INTELLIGENCE
REPORT.

PRODUCT IDEA:
This is NOT a generic scorecard. It should feel like an evidence-based technical
assessment generated after the interview. The message: "We didn't just give you a
score. We observed your technical reasoning across the interview." Useful to:
candidate, mentor, technical evaluator, hackathon judge.

PAGE STRUCTURE:
1. Assessment Header 2. Overall Technical Assessment 3. Knowledge Profile
4. What We Observed 5. Strengths 6. Knowledge Gaps 7. Recommended Next Steps
8. Interview Journey Summary

1. ASSESSMENT HEADER: "ASSESSMENT COMPLETE", "AI INTERVIEW AGENT", candidate name,
realistic mock date/time, "8 QUESTIONS / 5 TOPICS / 2 ADAPTIVE FOLLOW-UPS". Do not
fabricate backend metrics dynamically — use mock data explicitly.

2. OVERALL TECHNICAL ASSESSMENT: Strong visual score presentation (e.g. "82 —
TECHNICAL DEPTH — Strong conceptual foundation"). Do not make the score occupy the
entire page. Add supporting dimensions (Conceptual Understanding, Application,
Reasoning Depth) as visual indicators, NOT presented as scientifically calculated
metrics — they are mock presentation data.

3. KNOWLEDGE PROFILE: Multiple technical areas each with a level label (Strong / Good
/ Developing) using clean horizontal indicators. Do not create a giant chart.

4. WHAT WE OBSERVED: A narrative section titled "WHAT WE OBSERVED" with realistic mock
narrative text. This is MOCK feedback — do not imply the frontend generated this
assessment. Keep mock feedback in a centralized data file.

5. STRENGTHS: Clean list (e.g. "Strong conceptual reasoning", "Clear explanation of
RAG fundamentals"). Subtle positive visual treatment, avoid excessive green.

6. KNOWLEDGE GAPS: "AREAS TO STRENGTHEN" with short constructive explanations per
item. Do not make these look like failures.

7. RECOMMENDED NEXT STEPS: 3 recommendations, each with title, one sentence, related
technical topic.

8. INTERVIEW JOURNEY SUMMARY: Reuse the existing Interview Journey component. Show
"8 QUESTIONS / 5 TOPICS / 2 ADAPTIVE FOLLOW-UPS" plus a compact progression summary.
Do NOT duplicate the entire interview timeline unnecessarily.

9. EVIDENCE VIEW (important differentiator): Expandable "Evidence" interaction per
strength (e.g. "[View Evidence]") showing Question → Candidate Response → Assessment
Observation. Do NOT expose hidden chain-of-thought — only the high-level assessment
observation.

MOCK DATA ARCHITECTURE:
Create a centralized mockFeedback.js containing: candidate, overallScore, dimensions,
knowledgeAreas, observations, strengths, knowledgeGaps, recommendations, evidence,
interviewSummary. Do not hardcode feedback inside UI components — this makes it easy
to replace later with Person 1's real API response.

VISUAL DESIGN:
Maintain the existing design language — dark premium interface, restrained accent
color, precise typography, subtle borders, generous spacing, clean cards, minimal
animation. Avoid giant dashboards, excessive charts, pie charts, generic analytics
templates, excessive glowing effects. This is an assessment report, not a BI dashboard.

PAGE EXPERIENCE:
Strong visual hierarchy: Assessment Complete → Overall Assessment → Knowledge Profile
→ What We Observed → Strengths + Areas to Strengthen → Recommended Next Steps →
Evidence → Interview Summary. The user should understand the assessment in under 30
seconds, with deeper info available by expanding sections.

NAVIGATION:
After the final mock interview question, navigate to /feedback or the existing
feedback route. Do not break the existing interview completion behavior. Provide
"Back to Interview" and "Start New Assessment" only if these fit the existing
application structure.

RESPONSIVENESS:
Desktop: two-column layout where appropriate. Mobile: stack sections vertically. The
overall score should remain visually prominent. Evidence sections should be
expandable. No horizontal overflow.

CODE QUALITY:
Use reusable components: FeedbackReport, AssessmentScore, KnowledgeProfile,
ObservationPanel, StrengthsPanel, KnowledgeGaps, RecommendationList, EvidencePanel,
InterviewSummary. Reuse InterviewJourney if possible. Do not duplicate existing logic.
Keep mock data separate from UI.

IMPORTANT BACKEND BOUNDARY:
DO NOT implement API integration. DO NOT create fetch requests. DO NOT create fake
endpoints. DO NOT modify api.js. The future backend will eventually provide overall
assessment, scores, knowledge areas, strengths, knowledge gaps, recommendations,
evidence. For now use local mock data only.

TESTING:
Complete the mock interview, verify navigation to feedback, verify all report
sections, test evidence expansion, test Start New Assessment if implemented, test Back
to Interview, test mobile layout, check browser console, check for horizontal
overflow, verify no existing interview functionality broke.

STOP after completing this stage. Do not begin deployment. Do not begin backend
integration. Report: files created, files modified, mock feedback data structure,
feedback route, components created, how future backend feedback can replace mock data.
```

### 3.8 Stage 7 — Final Product Polish

```
STAGE 7 — FINAL PRODUCT POLISH

IMPORTANT CONTEXT:
The frontend MVP is complete. Existing features: Candidate Selection / Assessment
Launchpad, AI Interview Room, Adaptive Interview Experience, Cognitive Map 2.0,
Interview Journey, Assessment Intelligence Report, Evidence Panel. Build verification
has already passed with next build.

DO NOT add a major new feature. DO NOT redesign the product. DO NOT modify backend
code. DO NOT create API calls. DO NOT invent endpoints. This stage is ONLY about
making the existing frontend feel like one cohesive, premium product.

1. PRODUCT CONSISTENCY: Audit the entire frontend for shared typography, spacing,
borders, radius, buttons, badges, accent colors, shadows, transitions, background
treatment. Remove visual inconsistencies without blindly replacing existing styles —
preserve the strongest existing design decisions.

2. NAVIGATION: Verify the complete flow — Candidate Selection → Begin Assessment →
Interview → Complete Interview → Feedback Report. Ensure no dead ends, session
information preserved correctly, Start New Assessment returns to correct initial
state.

3. MICRO-INTERACTIONS: Add subtle, purposeful transitions (candidate selection,
question transition, adaptive follow-up reveal, Cognitive Map node transition,
Interview Journey progress, feedback section reveal). DO NOT over-animate.

4. LOADING STATES: Audit all transitions where a future API could introduce latency.
Create reusable loading states ("Preparing your assessment...", "Analyzing
response...", "Selecting the next assessment focus...", "Preparing assessment
intelligence..."). These are UI states only — do NOT create fake API calls.

5. ERROR / EMPTY STATES: Add elegant fallback UI for no candidate selected, session
unavailable, interview unavailable, assessment report unavailable. Concise messages
with a clear action (e.g. "Return to Launchpad"). Do not expose technical errors to
the candidate.

6. MOBILE AUDIT: Test every major page at mobile width — Candidate Selection (cards
stack, CTA accessible), Interview (conversation primary, Cognitive Map
compact/collapsible, candidate context doesn't dominate, answer input usable),
Feedback (sections stack, score prominent, evidence readable, no horizontal
overflow). Fix actual responsive issues — do NOT simply reduce font sizes everywhere.

7. ACCESSIBILITY: Audit button labels, form input labels/placeholders, keyboard
navigation, visible focus states, sufficient contrast, understandable interactive
elements. Do not introduce unnecessary accessibility libraries.

8. PERFORMANCE: Do not add heavy dependencies. Check unnecessary re-renders,
unnecessarily large components, duplicate data, unused imports, console warnings.
Remove obvious unused code only when safe.

9. DEMO SAFETY: The frontend must remain fully functional using local mock data. Do
NOT depend on Person 1's backend. Do NOT remove mock fallback behavior. The
application should still demonstrate the entire journey offline: Launchpad →
Interview → Adaptive Follow-up → Cognitive Map → Interview Journey → Feedback Report.

10. FINAL VISUAL AUDIT: Review as if a hackathon judge. Ask: Can I understand the
purpose immediately? Does the page have ONE visual focal point? Is information
presented visually before text? Are there unnecessary boxes? Can I scan it without
reading every sentence? Does the interface feel alive? Does adaptive AI feel visible?
Does the Cognitive Map feel like a real product feature? Does the Feedback Report feel
evidence-based? Would a hackathon judge remember this interface? Fix inconsistencies
discovered — do not add decorative elements just for the sake of looking impressive.

11. VERIFICATION: Run npm run build. Verify no compilation errors, no console errors,
no broken routes, no horizontal overflow, interview completes, feedback opens, reset
works, mobile layout works. Do not modify backend or API integration.

STOP after this polish stage. Report: files modified, issues fixed, responsive
improvements, accessibility improvements, build result.
```

### 3.9 Master UI/UX Redesign Prompt

```
AI INTERVIEW AGENT — COMPLETE UI/UX TRANSFORMATION — MASTER REDESIGN PROMPT

IMPORTANT:
You are working on an EXISTING functional Next.js frontend. DO NOT rebuild the
application logic. DO NOT change backend, API contracts, mock data, interview state
machine, session logic, routes, existing functionality, or data structures unless
required purely for presentation.

Your task is to completely redesign the VISUAL EXPERIENCE of the application. The
current application works, but visually it feels generic, too many rectangular cards,
too much text, repetitive, dashboard-like, flat, visually predictable — "college
project" rather than "real AI product." I want this to look like a product that could
genuinely be launched as a premium AI assessment platform.

THE PRODUCT:
AI INTERVIEW AGENT — an adaptive AI technical interview platform that understands a
candidate's background, evaluates technical knowledge, asks adaptive follow-ups, maps
knowledge, analyzes reasoning, produces evidence-backed assessment, and recommends
what the candidate should improve. The UI must VISUALIZE this intelligence — not
merely display the information. The interface should make the user FEEL that the
system is thinking.

DESIGN PHILOSOPHY:
"LESS DASHBOARD. MORE INTELLIGENT EXPERIENCE."
Feel like: AI intelligence cockpit + premium enterprise SaaS + technical assessment
laboratory. NOT: generic admin dashboard, NOT ChatGPT clone, NOT traditional HR
software, NOT cyberpunk gaming interface. The design should be premium, minimal,
intelligent, visual, calm, fast, memorable.

VERY IMPORTANT: DO NOT make every section a card — this is the biggest problem with
the current UI. Instead use spatial composition, floating information, visual
timelines, connected nodes, large typography, visual indicators, progressive
disclosure, asymmetric layouts, subtle gradients, meaningful color, whitespace. Cards
only when they help grouping.

GLOBAL VISUAL LANGUAGE:
Background: deep midnight navy/almost black, with very subtle atmospheric lighting
(radial gradients + soft blue/violet ambient glow). Do NOT use a giant gradient
background.
Color language: BLUE = active assessment/primary interaction. VIOLET = AI
intelligence/adaptive reasoning. EMERALD = strong/completed/positive. AMBER = growth
opportunity/attention. RED = critical only. SLATE = inactive/upcoming. Consistent
across every page.

TYPOGRAPHY: Modern technical/product hierarchy. Large headings strong but not
gigantic. Labels small uppercase + letter spacing. Numbers large and highly readable.
Body short and concise. Do NOT make everything bold or put long paragraphs into cards.

MOTION SYSTEM: Small interaction 150–200ms, card/panel 200–300ms, major transitions
350–600ms, smooth ease-out. Use opacity, translateY, subtle scale, glow, border
transitions. Avoid bouncing, spinning, excessive scaling, continuous animations.
Respect prefers-reduced-motion.

GLOBAL MICRO-INTERACTIONS: Buttons (hover: lift, brighter border, subtle glow, icon
moves 3px), Cards (hover: translateY(-2px), subtle border illumination), Links (hover:
accent color, arrow moves slightly), Progress (animate entering viewport), Numbers
(count up once), Notifications (slide + fade).

PAGE 1 — ASSESSMENT LAUNCHPAD:
Current problem: candidate cards + configuration card + button feels like a standard
SaaS form. Change the concept — make it feel like "MISSION CONTROL FOR AN AI
ASSESSMENT." Top: "AI INTERVIEW AGENT / Assessment Engine", then "Who are we
assessing?" Create a CANDIDATE SELECTION FIELD where each candidate shows an
avatar/abstract identity mark, name, role, experience, then "TECHNICAL DNA" with small
visual signals (3–4 key areas + "+5 domains", not a huge chip list).
Candidate selection interaction: unselected = quiet/minimal; hover = subtle rise,
background illuminates, technical DNA becomes visible; selected = strong blue/violet
outline, small glowing selection marker, profile expands slightly.
Assessment configuration: not a giant boring form — feel like configuring an AI
mission. Heading "ASSESSMENT BLUEPRINT" with visual selectors for Interview Mode
(Adaptive AI), Depth (Intermediate → Advanced), Follow-up Intensity (Moderate), Topic
Focus (RAG, Architecture, Retrieval, Agents) using segmented controls/intelligent
selectors.
Mission summary before starting: "ASSESSMENT READY" with candidate, expected duration,
technical domains, adaptive depth enabled, then "[ BEGIN AI ASSESSMENT → ]" styled to
feel like launching a mission.

PAGE 2 — INTERVIEW ROOM:
Current problem: left card + question card + answer box + right cognitive map looks
like a normal dashboard. Change the concept to feel like "THE AI IS ACTIVELY EXPLORING
THE CANDIDATE'S KNOWLEDGE."
Top: small command bar — "AI INTERVIEW AGENT", candidate name, "Question 01/08",
time remaining, "Assessment LIVE ●".
Left (Candidate Context): NOT a giant card — a compact vertical identity rail with
avatar, name, role, current domain, difficulty, and a small "TECHNICAL SIGNAL" line.
Center (main experience, must dominate): a "QUESTION CANVAS" — topic label at top
(e.g. "✦ RETRIEVAL-AUGMENTED GENERATION / Conceptual Reasoning"), then large question
typography. The question should feel like the focus of the entire application.
Answer area: not a giant boring textarea — a conversational response surface with
placeholder "Explain your reasoning...", word/character count, "⌘ + Enter to submit",
"SUBMIT ANSWER →" button that transforms into "ANALYZING RESPONSE..." with subtle
animated indicator on submit.
AI thinking state: after submission show "✦ ANALYZING — Understanding technical
reasoning / Checking conceptual depth / Evaluating practical application" (do NOT
expose chain-of-thought, only high-level processing signals), then "✦ ADAPTIVE
FOLLOW-UP DETECTED — Your response triggered deeper probing into [topic]." This should
feel special.
Right (Cognitive Map): not a static tree in a box — a LIVE KNOWLEDGE CONSTELLATION,
nodes connected by thin glowing lines, appearing as the interview progresses.
COMPLETED = emerald, CURRENT = blue glowing node, ADAPTIVE = violet star, UPCOMING =
dim slate. New adaptive questions grow a new node from the relevant concept — this is
a signature visual feature.
Interview Journey: not a generic progress bar — a horizontal knowledge exploration
path (Q1 RAG → Q2 Retrieval → ✦ Q3 Adaptive Probe → Q4 Chunking → Q5 Vector Search)
that feels like the AI navigating a knowledge graph.

PAGE 3 — ADAPTIVE FOLLOW-UP MOMENT:
A special state. When the AI detects a knowledge gap, don't just show "Adaptive
Follow-up" — create a visual transition where the current topic node splits into
deeper concepts (e.g. RAG → Retrieval → Vector Search → ✦ Deeper Probe), with "✦
ADAPTIVE PATH UNLOCKED — Your previous response revealed an opportunity to explore
[topic] depth," then transition naturally into the next question. This should become
a memorable product moment.

PAGE 4 — COGNITIVE MAP:
Make it one of the application's signature features — not a flowchart, but a
knowledge constellation / technical topology / exploration map. Domains become large
conceptual regions with branching sub-nodes. As the interview progresses, nodes
illuminate, connections appear, new branches emerge. The map should tell the story of
what the AI actually explored — more impressive than a conventional progress bar.

PAGE 5 — FEEDBACK / ASSESSMENT REPORT:
Current problem: too much text, too many boxes, feels like a PDF. Change the concept
to "ASSESSMENT INTELLIGENCE CENTER."
Top: candidate identity, "ASSESSMENT COMPLETE ✓", then a visually dominant score
(e.g. "84 / TECHNICAL DEPTH / Strong Technical Potential").
Key signals: compact signal strip instead of giant metric cards (Questions, Technical
Domains, Adaptive Follow-ups, Duration).
Knowledge Profile: a visual radar/constellation across domains (RAG, LLMs, Vector DB,
Agents, System Design) that immediately shows strong/good/developing — not relying
only on horizontal bars.
AI Observation: turn the long paragraph into a structured "✦ AI OBSERVATION" with a
strongest signal line, a nuance line, and a "KEY INSIGHT" line framed as strong
foundation → next growth opportunity.
Strengths: compact signal list with one concise explanation each (e.g. "✓ RAG
fundamentals").
Growth Areas: numbered items with topic, priority (HIGH/MEDIUM), and one short
improvement suggestion each — instead of paragraphs.
Recommended Next Steps: a visual growth path (01 → 02 → 03) that feels like a roadmap
rather than three cards.
Evidence: the proof layer — header "WHY THIS SCORE?" with expandable Question →
Candidate Response → AI Observation → Assessment Signal (e.g. "STRONG"). Do not show
hidden reasoning, only candidate response + high-level assessment evidence.

GLOBAL NOTIFICATION SYSTEM: Premium toast notifications for success ("✓ Assessment
Complete"), adaptive ("✦ Adaptive Follow-up"), analysis ("◌ Response Analyzed"), export
("✓ Report Ready") — dark surface, semantic accent, small icon, subtle glow, slide +
fade. Never huge popups for simple notifications.

GLOBAL EMPTY STATES: Never show blank areas — use elegant empty states (e.g. "No
evidence yet — Complete more interview questions to unlock assessment evidence.").

GLOBAL HOVER LANGUAGE: Every interactive element should communicate it can be
interacted with (node → glow, candidate → lift, question → subtle focus, evidence →
expand indicator, recommendation → arrow movement, button → glow + lift).

GLOBAL COLOR-CODED BULLETS: ✓ green = strength, ⚠ amber = growth, ✦ purple =
adaptive/AI, ● blue = current, ○ slate = upcoming. Use consistently everywhere.

GLOBAL RESPONSIVENESS: Desktop = rich spatial layout. Tablet = adaptive 2-column.
Mobile = single-column experience. Do not simply shrink desktop — recompose the
interface.

IMPORTANT — VISUAL UNIQUENESS: DO NOT copy common SaaS dashboard patterns. Avoid 12
equal cards, huge card grids, generic progress bars everywhere, generic pie charts,
excessive pills, excessive glassmorphism, giant neon borders, random gradients,
generic sidebar dashboard, paragraphs inside boxes. Instead use knowledge
constellation, assessment blueprint, AI thinking states, adaptive path unlocking,
visual journey, evidence chains, technical DNA, semantic color, progressive
disclosure, spatial hierarchy.

THE SIGNATURE EXPERIENCE — one visual story:
LAUNCHPAD "Who are we assessing?" → INTERVIEW "What does the candidate know?" →
ADAPTIVE ENGINE "What should we probe deeper?" → COGNITIVE MAP "How is their knowledge
connected?" → ASSESSMENT "What did we discover?" → EVIDENCE "Why do we believe it?" →
GROWTH PATH "What should they learn next?"

FINAL DESIGN TEST: After implementation, look at each page for 5 seconds and ask: Can
I understand the purpose immediately? Does the page have ONE visual focal point? Is
information presented visually before text? Are there unnecessary boxes? Can I scan it
without reading every sentence? Does the interface feel alive? Does adaptive AI feel
visible? Does the Cognitive Map feel like a real product feature? Would a hackathon
judge remember this interface? If no: remove clutter, increase hierarchy, improve
spacing, improve visual storytelling, improve interaction — do not add more decoration.

FINAL QUALITY BAR: The final product should feel like "An AI system actively
understanding a candidate," NOT "A website displaying interview information." Keep it
simple, fast, technically detailed — but make the information VISUAL.

Run npm run build. Fix all compilation errors. Check every page at /, /interview,
/feedback and every relevant state. Do not modify backend functionality. Do not break
existing API preparation.
```

### 3.10 Backend Integration Prompts

```
1. Integration Prompt Log

Audit the existing frontend and backend and determine exactly what is required to
connect them. Inspect the frontend API layer, interview session hook, interview page,
feedback page, and all FastAPI routes. Identify mismatches in: endpoint URLs, HTTP
methods, request payloads, response schemas, session ID handling, interview state,
feedback flow. Do not modify code during the audit. Return: 1. Current frontend
contract 2. Actual backend contract 3. Every mismatch 4. Exact integration plan
5. Any remaining blockers.

2. Frontend API Wiring

Now integrate the frontend with the actual FastAPI backend based on the verified API
contract. Connect: POST /start-interview, POST /answer, GET /feedback/{session_id}.
Update frontend/src/lib/api.js. Create clean API functions for: startInterview(),
sendAnswer(), getFeedback(). Map backend snake_case responses to the frontend's
camelCase domain model. Use NEXT_PUBLIC_API_URL from .env.local. Do not redesign the
UI or break existing functionality.

3. Interview Session Integration

Connect useInterviewSession.js to the real backend session. When an interview starts:
call POST /start-interview, store the returned session_id, display the returned first
question. When an answer is submitted: send session_id and answer to POST /answer,
display next_question, update question number, update curriculum day/topic, preserve
the existing QUESTION → SUBMITTING → ANALYZING → COMPLETED state machine. Do not
duplicate session state. Do not replace the existing UI components.

4. Cognitive Map Live Integration

Connect the existing CognitiveMap.jsx to live interview data. Use: curriculum_topic,
curriculum_day, question number, adaptive follow-up information. Map backend
curriculum topics to the existing Cognitive Map nodes. When the backend moves to a new
topic: update the active node, mark previously explored topics appropriately,
highlight the current topic, visually distinguish adaptive follow-ups. Do not replace
the existing Cognitive Map design.

5. Feedback Integration

Replace the frontend mock feedback data with the real FastAPI feedback response. When
the interview is completed or the feedback page loads: GET /feedback/{session_id}.
Connect the returned total_score, average_score, overall_strengths, overall_weaknesses,
overall_suggestions, results, covered_curriculum_days, covered_curriculum_topics to
the existing FeedbackReport and EvidencePanel. Preserve the existing visual design. Do
not invent scores or feedback when real backend data is available.

6. Error / Fallback Integration

Make the frontend-backend integration resilient. Handle: backend unavailable, request
timeout, invalid response, missing session ID, failed feedback request, Ollama
unavailable, backend fallback response. Show clear user-friendly UI states without
exposing raw technical errors. Do not silently replace live data with fake data.
Clearly distinguish development mock data from real backend data.

7. End-to-End Integration Test

Perform a complete end-to-end integration test of: Candidate Launchpad → Start
Interview → POST /start-interview → Receive session_id + first question → Submit
candidate answer → POST /answer → Receive next_question → Update Cognitive Map →
Continue adaptive interview → Complete interview → GET /feedback/{session_id} →
Display Assessment Intelligence Report. Verify that the same session_id is maintained
throughout. Check that frontend data matches backend responses. Do not modify code
unless a real integration issue is found. Report every failure and its fix.

8. Final Integration Audit

Perform a final frontend-backend integration audit. Verify: all API endpoints are
correct, request payloads match backend schemas, response mappings are correct,
session_id persists correctly, interview state transitions correctly, Cognitive Map
uses live curriculum data, feedback uses live backend evaluation, mock data is not
accidentally overriding live data, Ollama/RAG fallback behavior is handled correctly,
frontend build succeeds, complete interview flow works. Run npm run build and report:
FILES CHANGED, ENDPOINTS CONNECTED, DATA MAPPINGS, TEST RESULTS, BUILD RESULT,
REMAINING BLOCKERS. Do not claim integration is complete unless the live end-to-end
flow has actually been verified.
```

---

*This log reflects the prompts used to build the Data Layer, Backend, and Frontend of the AI Interview Agent. Each stage was executed sequentially with explicit scope boundaries to keep development auditable and prevent unintended cross-layer changes.*
