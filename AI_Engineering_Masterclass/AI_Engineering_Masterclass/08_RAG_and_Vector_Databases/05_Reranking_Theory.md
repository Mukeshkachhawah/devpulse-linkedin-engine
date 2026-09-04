# Reranking Theory — Retrieved Results Ko Refine Karna

> *"Vector search fast hai par perfect nahi. 100 documents retrieve kiye — lekin top 5 mein actual answer nahi hai, position 23 mein hai. LLM ko position 23 ka document nahi mila. Answer miss hua. Reranking iss problem ko solve karta hai: Retrieve fast → Rerank accurately. Yeh two-stage architecture hai jo production RAG ko actually kaam karaata hai."*

---

## Opening Hook — The Search Results Problem

Google search.
You type: "best Python web framework for beginners."
Vector similarity might return:
- "Python web frameworks overview" (very similar)
- "Django vs Flask comparison" (similar)
- "Why I hate Python web frameworks" (semantically related, but negative review)
- "Web development in Python tutorial" (related domain)

Are these the RIGHT results for a beginner? Maybe not.
A better ranking would understand: user wants beginner-friendly recommendation.

**Reranking = taking these initial results and re-ordering them by actual relevance to the SPECIFIC query.**

---

## The Two-Stage Retrieval Architecture

**Stage 1: Fast Recall (Retrieval)**
Goal: Get all potentially relevant documents.
Speed: Must be fast (milliseconds).
Method: Bi-encoder embedding similarity.
Output: Top-100 candidates.
Recall: High (don't miss relevant documents).
Precision: OK (may include some irrelevant).

**Stage 2: Accurate Ranking (Reranking)**
Goal: Order candidates by true relevance.
Speed: Can be slower (100ms acceptable).
Method: Cross-encoder, specialized reranker.
Input: Top-100 candidates from stage 1.
Output: Top-5 or top-10 accurately ranked results.
Precision: High.

**Why two stages?**
Cross-encoder: Expensive. Can't run against 1M documents.
Bi-encoder: Fast. Get to 100 candidates quickly.
Cross-encoder: Run against 100 candidates. Affordable.
Result: Fast + accurate.

---

## How Cross-Encoder Reranking Works

**Bi-encoder (retrieval):**
Embed query independently: q_vec
Embed document independently: d_vec
Score: cosine(q_vec, d_vec)

**Cross-encoder (reranking):**
Input: [query] + [separator] + [document]
Feed BOTH TOGETHER into transformer model.
Model processes them jointly — can compare them.
Output: Single relevance score.

**Why cross-encoder is more accurate:**
Bi-encoder: Each encoded independently. No interaction during encoding.
"May miss subtle relevance signals."

Cross-encoder: Query and document encoded together. Every word of query can attend to every word of document.
"Can detect subtle relevance — exact answer match, contradiction, topic mismatch."

**The cost:**
Bi-encoder: O(n) for indexing (precompute all doc vectors). O(1) per query (just embed query + vector search).
Cross-encoder: O(k) per query — must rerun for each of k candidates.
For k=100: 100 forward passes. Much more compute than bi-encoder.
But: 100 passes on a small model << 1 million passes on any model.

---

## Types of Reranking Models

### Cohere Rerank (API)

**Cohere's commercial reranking API.**
State-of-the-art reranking quality.
Supports multiple languages.
Simple API: Send query + list of documents → get relevance scores.

**Best for:**
Quickest way to add high-quality reranking.
Don't want to manage model infrastructure.

**Cost:** Pay per query (reasonable at most scales).

### BAAI/BGE Reranker (Open Source)

**Open source cross-encoder rerankers.**
BGE-reranker-base: Smaller, faster.
BGE-reranker-large: Higher quality.
BGE-reranker-v2-gemma: Very high quality (uses Gemma architecture).

**Best for:**
Teams wanting open source + control.
High query volume (eliminate per-query API costs).
On-premise requirements.

### FlashRank (Lightweight)

**Ultra-lightweight reranker for efficiency.**
Small models (< 100MB).
Very fast inference.

**Best for:**
Edge deployment.
Latency-critical applications.
Low compute environments.

### LLM as Reranker

**Use main LLM directly for reranking.**

Method 1 — Relevance scoring:
Prompt: "On a scale 1-10, how relevant is this document to the query? Query: [q]. Document: [d]."
Score each candidate. Sort by score.

Method 2 — Listwise reranking:
Prompt: "Rank these 5 documents from most to least relevant to: [query]. Documents: [1]...[5]."
Model outputs ordering.

**Trade-offs:**
Quality: Excellent (frontier model is great judge).
Cost: Very expensive (frontier model pricing × 100 documents).
Speed: Slow.
Best for: When quality is paramount, volume is low.

---

## Reciprocal Rank Fusion (RRF)

**Merging results from multiple retrieval systems WITHOUT a reranker model.**

**Use case:**
You have: Dense retrieval results. Sparse (BM25) retrieval results.
Need to: Merge into a single ranked list.

**RRF formula:**
RRF_score(d) = sum over each retrieval system of: 1 / (k + rank_in_that_system)
k = constant (typically 60).

**Example:**
Document A: Dense rank = 1, Sparse rank = 5.
RRF = 1/(60+1) + 1/(60+5) = 0.0164 + 0.0154 = 0.0318.

Document B: Dense rank = 3, Sparse rank = 2.
RRF = 1/(60+3) + 1/(60+2) = 0.0159 + 0.0161 = 0.0320.

Document B scores higher.

**Why RRF works:**
Position matters. Top result in any system → big contribution.
Late results: Low contribution regardless of system score magnitude.
Score calibration: Doesn't matter. Different systems have different score ranges. RRF uses ranks, not scores. No calibration needed.

**RRF is the standard approach for hybrid search fusion.**

---

## Maximum Marginal Relevance (MMR)

**Reranking for diversity, not just relevance.**

**Problem:**
Top-5 retrieved documents might all be about the same aspect of the topic.
User gets redundant information from 5 sources saying the same thing.

**MMR solution:**
Balance: Relevance to query + Diversity from already-selected documents.

**MMR algorithm:**
1. Select document most similar to query (highest relevance). Add to selected set.
2. For each remaining document:
   Compute: (relevance to query) - λ × (similarity to any already-selected doc).
3. Select document with highest MMR score. Add to selected.
4. Repeat until k documents selected.

**Lambda (λ):**
λ = 1: Purely relevance-based (same as standard retrieval).
λ = 0: Purely diversity-based.
λ = 0.5: Balance between relevance and diversity.

**When to use MMR:**
Summary generation: Need diverse coverage of a topic.
Multi-aspect questions: Question touches multiple sub-topics.
Avoid information repetition: When top results are near-duplicates.

---

## Contextual Compression for Reranking

**Not just reranking WHICH documents, but WHAT within documents.**

**Problem:**
Retrieved 1000-token chunk.
Only 50 tokens are actually relevant to the query.
LLM receives 950 tokens of noise.

**Contextual compression:**
After retrieval, before LLM:
"Extract the parts of this document most relevant to the query. Query: [q]. Document: [d]."
Output: Compressed document (50-150 tokens of relevant content).

**Benefits:**
Smaller context → lower cost.
Less noise → better LLM accuracy.
More chunks can fit in context window.
Effectively increases "usable context."

**Trade-off:**
Additional LLM call per retrieved document.
May discard relevant context that seems tangential.
Best with smart small model for compression.

---

## Practical Reranking Pipeline

**Production-quality RAG pipeline:**

**Step 1: Query processing**
Clean and normalize query.
Optional: Query expansion (HyDE or multi-query).

**Step 2: Initial retrieval**
Dense retrieval: Top-50 from embedding search.
Sparse retrieval: Top-50 from BM25.
Merge: RRF fusion → Top-100 candidates.

**Step 3: Reranking**
Cross-encoder: Score each of 100 candidates.
Or: Cohere Rerank API.
Sort by reranker score.
Take top-5 or top-10.

**Step 4: Optional post-processing**
MMR: For diversity if needed.
Contextual compression: If chunks too large.
Metadata validation: Confirm retrieved docs are authorized for this user.

**Step 5: Context construction**
Format retrieved chunks for LLM.
Include source citations.
Handle context window limits.

**Step 6: LLM generation**
Generate answer from retrieved context.
Extract citations.
Return to user.

---

## Anthropic Insider Angle

Reranking is one of the most impactful improvements you can make to a RAG system after initial setup. The ROI is very high.

**Why reranking matters in practice:** The failure mode of naive RAG (retrieve top-k by embedding similarity) is that the most relevant document is NOT in the top-k. It might be position 15 or 23. Bi-encoders are good but not perfect. A cross-encoder reranker, processing query+document together, dramatically improves this. In internal testing at Claude applications, adding Cohere Rerank improved answer quality metrics by 15-25% across most query types.

**Cost-quality tradeoff in reranking:** Don't use a frontier LLM as your reranker for every query. The quality improvement doesn't justify the cost at scale. Use specialized rerankers (Cohere Rerank, BGE-reranker) for most queries. Reserve LLM-based reranking for high-value, low-frequency queries where quality is paramount and cost per query is acceptable.

**RRF is underrated:** Many engineers overcomplicate hybrid fusion with learned weight functions. RRF is simple, no parameters to tune, and consistently effective. Unless you have strong evidence that tuned fusion weights outperform RRF for your specific data, just use RRF.

**The MMR insight for RAG:** When generating comprehensive answers (summaries, reports) vs specific answers (single facts), the optimal retrieval strategy differs. For comprehensive tasks: Use MMR to ensure diverse coverage. For specific tasks: Pure relevance ranking. This is worth implementing: Add a classifier or heuristic to decide query type, route to appropriate retrieval strategy.

---

## Common Misconceptions

**Misconception 1: "Reranking is always necessary"**
For simple, specific queries with good embedding retrieval: Reranking may add latency with minimal quality gain. For complex queries, long documents, or when recall is critical: Reranking clearly helps. Don't add it blindly — benchmark first.

**Misconception 2: "Cross-encoders are too slow for production"**
For top-100 candidates: Cross-encoder is fast. Modern GPU: 100 documents in 30-50ms. Within acceptable production latency. CPU: Slower (200-500ms) but manageable for non-critical paths.

**Misconception 3: "Higher k (retrieve more) is always better"**
More candidates → more noise → reranker has harder job. Sweet spot usually k=50-100. Beyond 200: Diminishing returns. Noise starts overwhelming signal.

**Misconception 4: "Reranking is the only way to improve ranking"**
Many alternatives: Better chunking, better embedding model, hybrid search. Try these FIRST. Reranking is one tool in the toolkit, not the only or first tool.

---

## Interview Questions

**Q1: Reranking kya hai? RAG pipeline mein kyun add karein?**

**Answer:** Reranking: Second-stage re-ordering of retrieved documents by more accurate relevance measure. Two-stage architecture: Stage 1 (retrieval): Fast bi-encoder → top-100 candidates. Recall-focused: Don't miss relevant docs. Stage 2 (reranking): Cross-encoder → reorder top-100. Precision-focused: Put most relevant at top. Why add reranking: Problem: Bi-encoder similarity ≠ true relevance. Query and document encoded separately. Can miss subtle relevance signals. Result: Most relevant document may be at position 23, not position 1. Impact: LLM only sees top-5 → misses the answer. Reranking moves position 23 to position 1. ROI: 15-25% improvement in answer quality is typical. For most production RAG systems: Worth the added latency (30-50ms). When not worth it: Very simple queries. Very good embedding retrieval. Latency-critical applications where 50ms is too much.

**Q2: Bi-encoder vs cross-encoder: Kya difference hai quality mein? Speed tradeoff?**

**Answer:** Bi-encoder: Query embedded independently. Document embedded independently. Score: cosine(q_vec, d_vec). Quality: Good. Misses subtle relevance — query never "sees" document during encoding. Speed: Fast. Precompute all doc vectors. Query time: 1 embedding + vector search. O(1) effectively. Cross-encoder: Query + document fed together. Every query token can attend to every document token. Score: Direct relevance score. Quality: High. Captures: Exact answer match, paraphrase match, partial relevance, contradiction. Speed: Slow. Must process each pair. O(k) per query where k = candidates to rerank. Numbers: Bi-encoder query: ~5ms (embedding + ANN search). Cross-encoder for 100 candidates: ~30-50ms on GPU, ~200-500ms on CPU. Total with reranking: ~35-55ms on GPU (acceptable). Without GPU: CPU latency often too high for real-time. Practical: Bi-encoder for all initial retrieval (must be fast). Cross-encoder for reranking (can afford 30-50ms additional). Never cross-encoder directly against 1M documents.

**Q3: Reciprocal Rank Fusion (RRF) kya hai? Hybrid search mein kaise use karein?**

**Answer:** RRF: Method to merge ranked lists from multiple retrieval systems. No model needed. Formula: score(d) = sum over systems of 1/(k + rank_in_system). k = constant (typically 60). Practical use in hybrid search: Dense retrieval: Top-50 by embedding similarity. Sparse (BM25): Top-50 by keyword matching. Merge with RRF: Documents appearing in both lists → get contribution from both. Documents appearing in one list → get contribution from that one. Top-100 by RRF score → input to reranker. Why RRF works: Position-based: Top ranks contribute most. Position 1 in any system: Large contribution. Position 50: Small contribution. Scale-invariant: Dense scores range 0.7-0.9. BM25 scores range 0-50. RRF uses ranks, not scores. No calibration needed. Empirically: RRF consistently outperforms naive score averaging. Minimal complexity. Why k=60: Constant dampens the positional scoring function. Value 60 found empirically to work well across datasets. Don't overthink it.

**Q4: Maximum Marginal Relevance (MMR) kya hai? Kab use karein?**

**Answer:** MMR (Maximum Marginal Relevance): Selects documents that are both relevant AND diverse. Standard retrieval: Top-k most relevant. Problem: May return 5 documents all saying the same thing. MMR: Balance relevance vs diversity. Algorithm: (1) Select most relevant document. (2) Next: Score = relevance - λ × max_similarity_to_selected_docs. (3) Select highest MMR score. (4) Repeat until k selected. Lambda: 0 = max diversity, 1 = max relevance. Typical: 0.5 for balance. When MMR is valuable: (1) Summary generation: Need to cover multiple aspects. "Summarize this topic" → want diverse perspectives. (2) Research assistance: User researching broad topic. Want variety of angles. (3) Near-duplicate documents: Database has many similar documents. Without MMR: 5 near-identical retrieved. With MMR: 5 diverse but relevant documents. When NOT to use MMR: Specific factual queries ("What is the deadline?"): Want the most relevant document, not diversity. Performance-critical: MMR adds computation. Only worthwhile for diverse-coverage use cases.

**Q5: Contextual compression kya hai? Reranking se kaise different hai?**

**Answer:** Contextual compression: After retrieval, compress each document to include only content relevant to query. Different from reranking: Reranking: Changes ORDER of documents. Contextual compression: Changes CONTENT of documents. Process: (1) Retrieve top-k chunks. (2) For each chunk: "Extract sentences from this document relevant to [query]: [document]." (3) LLM returns compressed version. (4) Send compressed versions to main LLM. Why useful: 1000-token chunk retrieved for narrow query. Only 50 tokens relevant. Without compression: LLM reads 950 tokens of noise. With compression: LLM reads 50 tokens of signal. Benefits: Smaller context → lower cost. Less noise → better accuracy. More chunks fit in context window. Limitations: Additional LLM call per retrieved document (cost). May discard relevant context that seems tangential. Requires smart compression model. Implementation: Use small fast model for compression. Don't use expensive frontier model for compression (cost). Best practice: Hybrid — use for large chunks only. Small chunks (<200 tokens): Compression not worth it. Large chunks (>500 tokens): Compression valuable.

**Q6: Production RAG pipeline mein reranking add karne ka practical guide kya hai?**

**Answer:** Step-by-step implementation: (1) Baseline: Current RAG pipeline without reranking. Benchmark: Answer quality, latency, retrieval recall@5. (2) Add retrieval candidates expansion: Increase k from 5 to 50-100. More candidates for reranker to work with. (3) Add reranker: Option A: Cohere Rerank API. Quickest. Good quality. Cost per query. Option B: BGE-reranker-large (open source). Self-host. Free at scale. Needs GPU. (4) Measure: Compare before/after. Quality improvement. Latency increase. (5) Optimize: If latency too high: Smaller reranker model. Fewer candidates (50 instead of 100). Or: Cache frequent queries. (6) Optional enhancements: Add MMR if diversity issues observed. Add contextual compression if chunks are large. Typical results: 15-25% quality improvement. 30-50ms added latency (GPU). Often worth the trade-off. Start simple: Add Cohere Rerank first (30 minutes to implement). Measure improvement. Decide if quality gain justifies cost. If yes: Invest in self-hosted reranker for scale.

---

## Key Takeaways

- **Reranking** = second stage after retrieval; takes top-100, returns accurately ranked top-10
- **Cross-encoder** = processes query+document together; more accurate than bi-encoder
- **Two-stage architecture** = bi-encoder (fast recall) + cross-encoder (accurate ranking)
- **RRF** = merge dense + sparse results without a model; simple, effective, no calibration
- **MMR** = relevance + diversity; use for comprehensive queries, not factual queries
- **Contextual compression** = compress retrieved chunks to only relevant sentences
- **Production pipeline** = retrieve top-100 (hybrid) → rerank to top-10 → LLM
- **Cohere Rerank** = best quick start; BGE-reranker = open source alternative
- **ROI** = 15-25% quality improvement; usually worth 30-50ms added latency

---

*Agli file: `06_RAG_vs_Finetuning.md` — Kab kya use karein: RAG vs Fine-tuning decision*
