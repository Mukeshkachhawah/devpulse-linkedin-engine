# System Design — AI Systems Ko Architect Karna

> *"System design interviews AI mein sabse underrated skill hai. Log sochte hain: 'Main model build karta hoon, architect alag hota hai.' Wrong. Senior AI engineer ka kaam hai: End-to-end system design karna — data pipeline se serving tak. Yeh woh interview round hai jahan junior aur senior engineer clearly differentiate hote hain. Maine Google Brain aur Anthropic dono mein dekha hai: Best engineers woh hain jo single model ko production system mein sochte hain."*

---

## System Design Interview Framework

**For every AI system design, cover these layers:**

**1. Requirements clarification** (5 minutes)
Functional: What does the system do?
Non-functional: Scale, latency, accuracy, availability.
Constraints: Budget, team, existing infrastructure.

**2. High-level architecture** (5 minutes)
Components: Data ingestion, processing, model, serving, monitoring.
Data flow: How data moves through the system.

**3. Deep dive into key components** (15 minutes)
Focus on: The interesting/challenging parts.
Not every component equally.

**4. Data strategy** (5 minutes)
Training data: Where does it come from?
Serving data: What features at inference?
Data pipeline: Batch vs. stream.

**5. Model decisions** (5 minutes)
Architecture choice.
Training approach.
Evaluation strategy.

**6. Serving and scalability** (5 minutes)
Deployment: How is model served?
Scale: How does it handle load?
Latency: How to meet SLA?

**7. Monitoring and maintenance** (5 minutes)
What to monitor?
How to detect degradation?
Retraining strategy.

---

## Design Problem 1 — Semantic Search System

**Problem:** "Design a semantic search system for a company's internal document repository. 100K documents. 1M searches per day."

### Step 1 — Requirements

**Functional:**
User searches with natural language query.
System returns top-10 most semantically relevant documents.
Results: Document title, excerpt, relevance score.

**Non-functional:**
Latency: < 500ms P95.
Scale: 1M queries/day = ~12 queries/second average. Peak: 3-5x.
Availability: 99.9% uptime.
Accuracy: Relevant results in top-3 for 80%+ of queries.

**Constraints:**
Documents: Mixture of PDFs, Word, HTML.
Update frequency: ~100 new documents per day.

### Step 2 — High-Level Architecture

**Two phases:**

**Offline phase (document indexing):**
Document ingestion → Text extraction → Chunking → Embedding generation → Vector DB storage.

**Online phase (query processing):**
User query → Query embedding → Vector DB search → Reranking → Results.

### Step 3 — Deep Dive: Key Components

**Document Processing Pipeline:**
Extract text from PDFs (PyPDF2, Apache Tika), Word (python-docx), HTML.
Chunking: 512-token chunks with 50-token overlap. Why overlap: Don't split context at chunk boundary.
Metadata: Document ID, title, author, date, URL.

**Embedding Model:**
Choice: OpenAI text-embedding-3-large (API, simpler) or sentence-transformers/all-mpnet-base-v2 (self-hosted, more control).
Dimension: 1536 (OpenAI) or 768 (sentence transformers).
Batch processing: Process documents in batches for efficiency.

**Vector Database:**
At 100K documents with 5 chunks each = 500K vectors.
Choice: Pinecone (managed, simpler) or Qdrant (open source, more control).
Index: HNSW for approximate nearest neighbor.
Metadata filters: Filter by document type, date, author.

**Query Processing:**
Query → Same embedding model (critical: same model for query and documents).
Search: Top-50 candidates from vector DB.
Reranking: Cross-encoder reranker (Cohere Rerank or BGE-reranker) on top-50.
Return: Top-10 after reranking.

### Step 4 — Scaling

**Read path (queries):**
12 avg queries/second, 50-60 peak.
Vector DB: Horizontal scaling.
Embedding service: Load balanced.
Reranker: Potentially most expensive. Can be scaled horizontally.

**Caching:**
Query cache: Common queries → cached results (Redis).
Embedding cache: Cache embeddings for repeated queries.

### Step 5 — Monitoring

**Key metrics:**
Latency (P50, P95, P99).
Search result quality: Click-through rate. Did user click a result?
Zero-result rate: Queries with no good results.

**Data drift:**
Monitor: Distribution of query lengths, query complexity.
Alert: If click-through rate drops (users not finding results).

---

## Design Problem 2 — LLM-Powered Customer Support Agent

**Problem:** "Design an AI customer support system for an e-commerce company. 50,000 tickets per day. Should resolve 60% without human agent."

### Step 1 — Requirements

**Functional:**
Customer submits support request.
AI attempts to resolve.
If AI can't resolve: Routes to human agent.
AI can: Access order history, return policies, FAQ.
Humans always available for escalation.

**Non-functional:**
Response time: < 5 seconds for AI response.
AI resolution rate target: 60%.
Customer satisfaction: AI-resolved tickets CSAT > 80% (vs. human: 90%).
Availability: 24/7.

### Step 2 — Architecture

**Components:**
Intent classifier: What is the customer trying to do?
Knowledge base: Returns policies, FAQs, common issues.
Order system integration: Access to customer's actual order data.
LLM orchestrator: Takes intent + knowledge + order data → generates response.
Escalation engine: Decides if AI should hand off to human.
Human agent interface: When escalated.
Feedback loop: Label resolution outcomes.

### Step 3 — Intent Classification (First Layer)

**Classify before sending to expensive LLM:**
Categories: Order status, return request, product question, account issue, complaint, billing, general inquiry.
Model: Fine-tuned smaller model (Mistral-7B or BERT-based classifier).
Routing: Order status → order lookup + template response (no LLM needed).
Complex query → full LLM pipeline.

Why classify first:
50% of queries: Simple order status + FAQ. Don't need expensive LLM.
Cost reduction: 50%.
Latency improvement: Template response faster than LLM.

### Step 4 — RAG Knowledge Base

**FAQ and policy documents:**
Chunk: Support articles, return policies, product guides.
Embed and index.

**Retrieval:**
Customer query → semantic search → top-5 relevant articles.
Include: In LLM context.

**Order system integration:**
Customer authenticated → fetch: Recent orders, order status, return history.
Include: Relevant order data in context.

### Step 5 — LLM Orchestration

**System prompt:**
"You are a customer service agent for [Company]. You have access to: [order data], [retrieved articles]. Your goal: Resolve the customer's issue. If you cannot resolve, say so clearly and ask to escalate. Do not invent policies. Only use information provided."

**Response generation:**
Temperature: Low (0.2) for factual accuracy.
Chain-of-thought: Internal reasoning + customer-facing response.

**Escalation decision:**
Rule-based: Certain keywords always escalate (complaint, legal, urgent).
LLM-based: Ask model "Should this be escalated?" as separate call.
Threshold: If model uncertainty high (flagged in response) → escalate.

### Step 6 — Quality and Safety

**Guardrails:**
Don't make refund promises unless in policy.
Don't give incorrect order information (always verify from order system).
Toxic/abusive customer input: Handle gracefully, not mirror.

**Monitoring:**
Resolution rate: % of tickets resolved by AI.
CSAT: Customer satisfaction survey for AI-resolved tickets.
Escalation rate: % escalated to human.
Wrong information rate: Audit sample for accuracy.

---

## Design Problem 3 — Real-Time Content Moderation

**Problem:** "Design an AI content moderation system for a social media platform. 10M posts per day."

### Step 1 — Requirements

**Functional:**
Every post: Moderated before publishing or within seconds.
Categories: Spam, hate speech, violence, explicit content, misinformation.
Decision: Publish, review queue (human), remove.
Appeals: User can appeal removal.

**Non-functional:**
Throughput: 10M posts/day = ~115 posts/second.
Latency: < 1 second for moderation decision.
Accuracy: < 0.1% false positive rate (false removal). < 2% false negative rate (missed violations).

### Step 2 — Tiered Moderation Architecture

**Tier 1 — Fast signal (< 100ms):**
Hash-based: Known violating content (CSAM hash matching, known spam URLs).
Rule-based: Exact keyword matching.
Result: Block immediately for high-confidence violations.

**Tier 2 — ML classifier (< 500ms):**
Fast lightweight classifier: BERT-small or DistilBERT fine-tuned.
Handles: Most content (90%).
Score: Probability of each violation category.
Decision: < threshold → publish. > threshold → Tier 3. Very high → Remove.

**Tier 3 — LLM analysis (< 2 seconds):**
Complex cases needing nuanced understanding.
Context-dependent hate speech.
Sarcasm that looks like hate speech.
LLM decision with explanation.

**Tier 4 — Human review queue:**
Very high stakes (borderline cases).
High-follower accounts (more impact).
Appeals.

### Step 3 — Multimodal Extension

**Text only → Text + Image + Video:**

Images: Vision classifier (CLIP-based). Nudity, violence, hate symbols.
Video: Frame extraction + image classifier. Audio extraction + speech-to-text + text classifier.

**Fusion:**
Each modality gives a signal.
Decision model: Fuse text + image + video signals.

### Step 4 — Data Strategy

**Training data:**
Historical violation decisions (labeled by human moderators).
Adversarial: Users trying to evade detection.
Multilingual: Platform has global users.

**Active learning:**
Human reviewers in Tier 4: Label.
High-uncertainty model predictions: Route to human for labeling.
Retrain model on new labeled data periodically.

### Step 5 — Handling Scale

**115 posts/second average, up to 500/second at peak:**
Tier 1-2: Stateless, easy to scale horizontally.
Tier 3 (LLM): Most expensive. Run on 3-5% of posts. GPU cluster.
Queue-based: Asynchronous for non-real-time decisions.
Real-time: Only for pre-publish gating.

---

## Design Problem 4 — ML Feature Store

**Problem:** "Design a feature store for a company with 10 ML models sharing common features."

### Requirements

**Why feature store:**
10 models: Each computing same features independently.
Training-serving skew: Feature computed differently in training vs. serving.
Data freshness: Some features need real-time, some can be batch.

### Architecture

**Three storage layers:**

**Offline store (batch features):**
Source: Data warehouse (BigQuery, Snowflake).
Compute: Batch jobs (daily, hourly).
Storage: Parquet files, data warehouse tables.
Used for: Training.

**Online store (real-time features):**
Low-latency serving.
Redis, DynamoDB.
Must be updated in near-real-time.
Used for: Inference.

**Streaming layer:**
Real-time feature computation.
Kafka → Flink/Spark Streaming → Online store.
Features: Last 1-hour activity, current session features.

### Feature Registry

**Metadata about every feature:**
Name, description, owner.
Data type, range.
Computation logic (same code for training and serving).
Monitoring: Drift detection spec.

**Training-serving consistency:**
Key property: Same code produces training features and serving features.
Prevents: Training-serving skew.

---

## Common System Design Mistakes to Avoid

**1. Starting with model before defining requirements:**
Wrong: "I'll use GPT-4 for this."
Right: Define requirements first. Then choose model.

**2. No discussion of data pipeline:**
Model training: Needs data. Where does it come from?
Serving: What features at inference? Where?
Data pipeline: Critical component. Often forgotten.

**3. No discussion of failure modes:**
What happens when model is wrong?
What happens when a component goes down?
Fallback strategies.

**4. Ignoring cost:**
"Use the most powerful model."
Cost: $X/day at scale.
Design: Must be cost-appropriate.

**5. No monitoring discussion:**
How do you know if the system is working?
How do you detect degradation?
How do you retrain?

**6. Forgetting about cold start:**
No data initially. Model is bad. Gets better with data. How?
Initial bootstrap strategy.

---

## Interview Tips for System Design

**Ask clarifying questions before designing:**
"What's the expected scale in terms of requests per day?"
"What's the latency requirement?"
"Is real-time processing required or is batch acceptable?"
"What's the existing infrastructure?"

**Draw diagrams:**
Data flow diagram: How data moves.
Component diagram: What components exist.
Share your screen and draw or use whiteboard.

**Think out loud:**
Don't: Design silently then present.
Do: "I'm thinking about X because Y. An alternative would be Z. I'll go with X because..."

**Tradeoff discussion:**
"I could use API here, which is simpler, or self-host, which is cheaper at scale. Given the described scale of 1M requests/day, let me calculate break-even..."

**Don't over-specify:**
Don't: Name every specific tool.
Do: Describe what kind of component and why. Then name options.

---

## Key Takeaways

- **Framework**: Requirements → Architecture → Components → Data → Model → Serving → Monitoring
- **Semantic search**: Offline indexing (chunk → embed → vector DB) + online querying (embed → ANN search → rerank)
- **Support agent**: Intent classify first (saves LLM cost) → RAG + order data → LLM → escalation logic
- **Content moderation**: Tiered architecture (fast rules → fast ML → slow LLM → human review)
- **Feature store**: Offline (training) + online (serving) + streaming; training-serving consistency is critical
- **Common mistakes**: Model before requirements, no data pipeline, no failure modes, no monitoring, ignoring cost
- **Interview tip**: Clarify requirements first; draw diagrams; think out loud; discuss tradeoffs

---

*Agli file: `03_Scenario_Based.md` — Scenario-based interviews: Real world problems handle karna*
