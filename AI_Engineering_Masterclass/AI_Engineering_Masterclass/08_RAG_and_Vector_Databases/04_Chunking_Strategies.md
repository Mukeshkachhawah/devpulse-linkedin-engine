# Chunking Strategies — Documents Ko Split Karne Ki Art

> *"Yaar, chunking mein log sabse zyada galti karte hain RAG mein. Sab log ek hi kaam karte hain: 'chunk size = 512 tokens, overlap = 50 tokens, done.' Phir wonder karte hain ki RAG kaam kyun nahi kar raha. Suno — chunking RAG ka spine hai. Galat chunking = galat retrieval = galat answers. Koi bhi aur cheez perfect ho — LLM, embedding model, vector DB — chunking galat hua toh sab kharab."*

---

## Opening Hook — The Puzzle Pieces Problem

Imagine you cut a novel into pieces to find specific story elements.

Strategy A: Cut every 3 inches — page boundaries don't matter.
Result: Half a sentence here, half a sentence there. Useless fragments.

Strategy B: Cut by chapter.
Result: Finding "who killed the butler?" requires returning the entire chapter.

Strategy C: Cut by scene (a few paragraphs each).
Result: Manageable units that capture complete story elements.

**This is the chunking problem for RAG.**
Too small: Fragments without context.
Too large: Retrieve huge chunks, much of which is irrelevant.
Right size: Meaningful, self-contained units.

---

## Why Chunking Matters More Than People Think

**The cascade of chunking effects:**

1. **Chunk quality → Embedding quality:**
Good chunk = self-contained meaning = good vector.
Fragment = incomplete meaning = poor vector.
"applicable to all employees" (without preceding context) = meaningless.

2. **Chunk size → What retrieval finds:**
Too large: May miss specific answers buried within.
Too small: Lose context needed to understand the answer.

3. **Chunk granularity → Recall vs precision:**
Large chunks: Higher recall (more likely to contain answer).
Small chunks: Higher precision (answer isn't diluted by irrelevant context).

4. **Chunk boundaries → Completeness:**
Bad boundary = splits an answer across chunks.
Good boundary = complete concepts stay together.

---

## Fixed-Size Chunking

**Simplest approach. Often the worst.**

**How it works:**
Split text into chunks of exactly N tokens.
Optional overlap: Include last K tokens of previous chunk at start of next.

**Typical settings:**
Chunk size: 256-1024 tokens.
Overlap: 10-25% of chunk size.

**Why people use it:**
Simple to implement.
Works decently for uniform text (news articles, short documents).

**Why it fails:**
Cuts mid-sentence: "The contract is binding unless the other party... [chunk 1] ...violates section 3.2." [chunk 2]
Cuts mid-concept: Technical explanations that span more than chunk size.
Different content needs different sizes: A one-line fact shouldn't be padded to 512 tokens.

**When acceptable:**
Uniform, dense factual text (product specifications, FAQs).
Everything is roughly similar information density.
Rapid prototyping when quality can be sacrificed.

---

## Sentence-Level Chunking

**Respect sentence boundaries. Don't split mid-sentence.**

**How it works:**
Use sentence tokenizer (NLTK, spaCy).
Group N sentences per chunk.
Or: Single sentence per chunk.

**Advantages:**
Every chunk = at least one complete thought.
Better than fixed-size for most text types.

**Disadvantages:**
Sentence counts vary: Short sentences → small chunks. Long sentences → large chunks.
Single-sentence chunks: Often lack context.
Sentence-level doesn't capture multi-sentence concepts.

**Sentence window chunking (better variant):**
Index: Single sentences (precise embeddings).
Retrieve: Single sentence.
Send to LLM: Window of ±2 sentences around the matched sentence.

Why this helps:
Retrieval: Precision of single-sentence matching.
Generation: Context provided by surrounding sentences.

---

## Recursive Character Text Splitting

**LangChain's approach. One of the most practical.**

**Principle:**
Try to split at natural boundaries. Fall back to lower-level if piece still too big.

**Hierarchy of splits:**
1. Split at: Double newline (\n\n) — paragraph boundaries.
2. If still too big: Split at single newline (\n) — line boundaries.
3. If still too big: Split at ". " — sentence boundaries.
4. If still too big: Split at "! " or "? " — other sentence ends.
5. If still too big: Split at " " — word boundaries.
6. If still too big: Split at character boundaries.

**Why better than fixed-size:**
Respects natural document structure.
Prefers paragraph splits over sentence splits.
Prefers sentence splits over word splits.
Only breaks at lower level when necessary.

**Parameters:**
chunk_size: Target maximum chunk size (tokens).
chunk_overlap: How many tokens to repeat at chunk boundaries.
separators: The hierarchy of split points.

**Best general-purpose approach for most documents.**

---

## Semantic Chunking

**Split at meaning shifts, not character positions.**

**How it works:**
Process text sentence by sentence.
Compute embedding of each sentence.
Find where adjacent sentence embeddings are MOST DIFFERENT.
Split at those high-dissimilarity points.

**The intuition:**
High similarity between adjacent sentences = same topic. Keep together.
Low similarity = topic shift. Split here.

**Algorithm:**
1. Embed all sentences.
2. Compute cosine similarity between consecutive sentence pairs.
3. Find local minima in similarity (topic change points).
4. Split at these minima.

**Advantage:**
Topic-coherent chunks.
Each chunk = one concept/discussion.
Better semantic integrity than character-based splits.

**Disadvantage:**
More compute: Must embed every sentence first.
Chunk sizes vary widely.
Requires tuning the similarity threshold.

**When to use:**
Long, varied documents with distinct sections.
Academic papers, legal documents, technical documentation.
When topic coherence is important for retrieval.

---

## Structural Chunking (Markdown/HTML-aware)

**For structured documents: Use the structure!**

**Markdown structure:**
# Heading 1 → Top-level section
## Heading 2 → Sub-section
### Heading 3 → Sub-sub-section

**Chunk by heading:**
Each H2 section = one chunk.
Or: Each H3 section = one chunk.
Content under heading stays with heading.

**Include heading in chunk:**
When chunking under a heading, include the heading text.
"The return policy is 30 days" → Less useful retrieval target.
"Return Policy: The return policy is 30 days" → Much better. Chunk is self-contained.

**HTML structure:**
Chunk by `<section>`, `<article>`, or `<div>` with semantic class names.
Don't split within `<table>` — tables are best as single chunks.

**Code blocks:**
Keep code examples intact.
Don't split mid-function.
If code is large, chunk at logical unit (class boundary, function boundary).

---

## Parent-Child Chunking

**A sophisticated approach that separates retrieval from context.**

**The insight:**
For retrieval: Small, precise chunks work best (needle in haystack).
For LLM context: Large, context-rich chunks work best.

**Architecture:**
**Child chunks:** Small (128-256 tokens). Precise, specific content.
**Parent chunks:** Large (1024-2048 tokens). Full section with context.

**Mapping:** Each child knows its parent.

**Process:**
Index: Embed all child chunks.
Retrieve: Find most relevant child chunks (precise matching).
Expand: Replace each child chunk with its parent chunk.
LLM: Gets parent chunks (full context).

**Example:**
Document: 10-page policy document.
Parent chunks: Each page (1000 tokens each).
Child chunks: Each paragraph (100-200 tokens each).

Query: "What is the overtime calculation policy?"
Retrieval: Finds child chunk with exact overtime calculation sentence.
Expansion: Returns full parent page (all overtime-related paragraphs).
LLM: Gets complete context, not just one sentence.

---

## Proposition Chunking

**Advanced: Each chunk = one factual proposition.**

**Concept from research (Dense Passage Retrieval evolution):**
Instead of arbitrary text units:
Each chunk = one atomic, self-contained fact.

Example document: "Paris, the capital of France, was founded in the 3rd century BC. It is home to the Eiffel Tower, which was completed in 1889."

Propositions:
- "Paris is the capital of France."
- "Paris was founded in the 3rd century BC."
- "Paris is home to the Eiffel Tower."
- "The Eiffel Tower was completed in 1889."

**Why good:**
Each proposition = maximally specific retrieval unit.
No irrelevant content mixed in.
High precision.

**Implementation:**
Use LLM to extract propositions from text.
Each proposition = one chunk.

**Trade-offs:**
Very expensive to create (LLM call per document).
For document corpora that don't change often, worth it.
Best precision of any chunking strategy.

---

## Chunking for Specific Document Types

### PDFs
**Challenge:** PDFs often lack semantic structure. May have headers/footers, page numbers, multi-column layouts, tables.

**Approach:**
Use PDF parser (PyPDF, pdfminer, Unstructured library).
Unstructured library: Detects document elements (title, header, footer, table, paragraph).
Chunk by detected elements, not page boundaries.
Tables: Keep intact as single chunk or convert to structured text.
Page numbers and headers: Strip before chunking.

### Code Files
**Challenge:** Code has precise syntactic structure. Splitting mid-function breaks semantics.

**Approach:**
Language-aware parsing (tree-sitter).
Chunk at function or class boundaries.
Include function signature in every chunk.
Docstrings: Keep with their function.
Dependencies: Sometimes include import statements.

### Emails/Chat Logs
**Challenge:** Many short messages. Context spans multiple messages.

**Approach:**
Don't split individual messages.
Group messages into windows.
Thread-aware: Keep reply chains together.
Time-based grouping (all messages in 1-hour window).

### Tables
**Challenge:** Tables express relationships that only make sense as a whole.

**Approach:**
Never split a table across chunks.
Table header + all rows = one chunk (if fits in context).
Large tables: Serialize to text format. Or split into row groups (each with header repeated).

---

## Chunk Metadata — Often Neglected

**Every chunk should have metadata:**

**Essential metadata:**
source: Document filename, URL, or ID.
chunk_id: Unique identifier for this chunk.
doc_id: Which document this came from.
position: Chunk number within document (for ordering).

**Useful metadata:**
section: Section heading above this chunk.
page: Page number (for PDFs).
created_at: Document creation date.
updated_at: Last modification date.
category: Document category/type.

**Why metadata matters:**

1. Attribution: "According to policy_document.pdf, page 7..."
2. Filtering: "Only retrieve from documents updated after 2024-01-01."
3. Deduplication: Different chunks from same document.
4. Ordering: If multiple chunks from same document, present in order.

---

## Chunk Size Decision Framework

**Question 1: What's your embedding model's max context?**
Most: 512 tokens.
Some modern: 8192 tokens.
Chunk must fit within embedding model's context.

**Question 2: What's your LLM's context window?**
Context = system + retrieved chunks + query.
If k=5 chunks and max context is 4096: Chunks can be max 800 tokens each.

**Question 3: How specific are user queries?**
Specific factual queries ("What is X?") → Small chunks (more precise matching).
Broad analytical queries ("Explain the overview of X") → Larger chunks.

**Question 4: How granular is your content?**
FAQ: Short Q&A pairs → chunk by Q&A pair.
Legal documents: Dense multi-page clauses → larger chunks.
News articles: Self-contained 500-word articles → maybe whole article per chunk.

**General starting points:**
Dense technical content: 256-512 tokens, 10-15% overlap.
General text: 512-1024 tokens, 10-20% overlap.
Conversational content: 256-512 tokens.
Always test and benchmark on YOUR documents and queries.

---

## Anthropic Insider Angle

Chunking is where most RAG implementations fail in practice, and it's often underinvested because it seems "not AI enough."

**The overlooked importance of chunking:** When building RAG systems for Claude applications, I've found that chunking improvements often outperform other improvements like embedding model upgrades. A 2x better embedding model with poor chunking often loses to a decent embedding model with excellent chunking. The retrieval quality ceiling is set by chunking.

**Document type matters most:** The single biggest chunking mistake is applying one strategy to all document types. Legal contracts need structural chunking at clause level. Technical documentation needs heading-based chunking with code blocks intact. Conversation logs need temporal/thread-based grouping. Match chunking strategy to document type.

**Proposition chunking for high-value corpora:** For applications where the document corpus is small, stable, and high-value (core product documentation, critical policy documents), proposition chunking is worth the extraction cost. Using Claude to extract atomic propositions from these documents, then indexing the propositions, dramatically improves retrieval precision. The extra cost is a one-time expense for a static corpus.

**Always include context in chunks:** A tiny but high-impact improvement: When splitting a 100-page document into chunks, each chunk should be prefixed with its section hierarchy. "Section 3.2.1 — Payment Terms: Invoices are due within 30 days..." The embedding of this chunk is much more informative than just "Invoices are due within 30 days..." which floats free of context.

---

## Common Misconceptions

**Misconception 1: "Bigger chunks = better because more context"**
More context ≠ more useful. A 2000-token chunk retrieved for a specific factual question contains mostly noise. The LLM must "find" the answer in the noise. Small, relevant chunks: LLM just reads and answers. Large chunks with irrelevant content: LLM struggles, may be confused.

**Misconception 2: "Chunking is a one-time setup"**
Should be iterated. As you observe query patterns, adjust chunk size and strategy. If users ask narrow factual questions → smaller chunks. If users ask broad conceptual questions → larger chunks.

**Misconception 3: "Overlap solves all boundary problems"**
Overlap helps but doesn't fully solve the problem. 50-token overlap doesn't help if the answer spans 300 tokens across a boundary. Better: Use parent-child chunking or ensure logical boundaries.

**Misconception 4: "All chunks should be same size"**
Document content varies in information density. A definition paragraph might be 50 words. An explanation paragraph might be 500 words. Forcing same size either truncates or pads. Flexible chunking respects natural unit sizes.

---

## Interview Questions

**Q1: RAG mein chunking kyun important hai? Wrong chunking ke consequences kya hain?**

**Answer:** Chunking is the spine of RAG. Consequences of wrong chunking: (1) Retrieval failure: If answer spans two chunks and neither chunk alone contains the full answer, retrieval may miss it entirely. System can't retrieve what it can't represent as a unit. (2) Semantic fragmentation: Chunk "applicable to all employees" without preceding context embeds poorly. Vector represents meaningless fragment, not the concept. (3) Irrelevant noise: Huge chunks (entire pages) retrieved for specific facts. LLM gets mostly irrelevant content. Quality degrades. (4) Context loss: Tiny chunks (single sentences) retrieved out of context. "The deadline is March 15" — which deadline? LLM doesn't know. (5) Cascade effect: Chunking → embedding → retrieval → generation. Poor chunking cascades into all downstream steps. Why often neglected: Seems like "plumbing" vs "AI." But empirically: Chunking improvements often outperform model upgrades. Invest appropriately.

**Q2: Fixed-size chunking vs semantic chunking — kaunsa better hai? Tradeoffs kya hain?**

**Answer:** Fixed-size chunking: Split at token count N (e.g., 512 tokens). Simple, fast, no extra compute. Cons: Ignores sentence, paragraph, topic boundaries. Cuts mid-sentence/concept frequently. Works OK for uniform text. Semantic chunking: Embed each sentence. Find similarity drops between adjacent sentences. Split at topic boundaries. Better chunk integrity: Each chunk = one topic/concept. Cons: Requires embedding every sentence (extra compute). Chunk sizes vary widely (may need post-processing). Tradeoffs: | Aspect | Fixed-size | Semantic | | Compute | Near-zero | High (embed all sentences) | | Chunk coherence | Low | High | | Consistency | Predictable | Variable sizes | | Implementation | Simple | Complex | | Best for | Uniform text, prototyping | Long varied documents | Practical recommendation: For most production RAG: Recursive character text splitting (LangChain) is the best middle ground. Not as good as semantic but much better than fixed-size, minimal extra compute. Use semantic chunking when: Document quality is critical, documents are long and varied, compute cost is acceptable.

**Q3: Parent-child chunking kya hai? Kab use karein?**

**Answer:** Parent-child chunking: Two granularities of the same document. Child chunks: Small (128-256 tokens). Precise, specific content units. Parent chunks: Large (1024-2048 tokens). Full sections with surrounding context. Mapping: Each child knows its parent. Process: (1) Index child chunks (small = precise embeddings for retrieval). (2) User query → retrieve most relevant children. (3) Expand: Replace children with their parent chunks. (4) LLM processes parent chunks (full context). Why it works: Dense retrieval: Benefits from small, specific embeddings. High precision. Context for generation: LLM needs full context to answer well. Parents provide this. Example: Policy document. Child: "Overtime is calculated at 1.5x base rate." Parent: Entire overtime policy page. Query "overtime calculation" → retrieves child → expands to full policy page → LLM gives complete, contextual answer. When to use: (1) Documents with clear hierarchical structure. (2) When single-sentence retrieval isn't giving enough context to LLM. (3) When retrieval precision matters (small corpora with many similar documents). Not worth it: Simple FAQs where each chunk is already self-contained. Very short documents.

**Q4: PDF aur code jaise structured documents ko kaise chunk karein?**

**Answer:** PDFs challenges: No clean text structure. Headers/footers, page numbers, multi-column layouts, tables embedded. Approach: Use specialized PDF parser: Unstructured library (best), pdfminer, PyPDF. These detect: Title, paragraph, header, footer, table, list. Strip: Page numbers, headers, footers before chunking. Chunk at paragraph/section level based on detected elements. Tables: Keep intact as single chunk. Never split a table. Large tables: Serialize rows to text with repeated header per row group. Code files challenges: Precise syntax. Splitting mid-function = broken chunk. Approach: Language-aware parser (tree-sitter library supports 40+ languages). Chunk at function/class/module level. Include: Function signature, docstring, body as one unit. Add: Module context in metadata (filename, class it belongs to). Imports: Keep at top of file or include relevant imports with each function chunk. Both: Include section/heading context in each chunk. "PDF_file > Section 3 > Subsection 3.2 > [chunk content]." This embedding is much richer.

**Q5: Chunk metadata kya hona chahiye? Retrieval mein kaise use karein?**

**Answer:** Essential metadata: (1) source: Document ID, filename, URL — for attribution. (2) chunk_id: Unique identifier. (3) position: Chunk number within document — for ordering. (4) section: Section heading above this chunk — for context. Useful metadata: (5) page_number: For PDF attribution. (6) created_at/updated_at: Document dates — for freshness filtering. (7) category: Document type/category — for scoped search. (8) language: For multilingual corpora. How to use in retrieval: Attribution: "According to [source], page [page_number]..." Metadata filtering: "Only retrieve from category='technical_docs' AND updated_at > '2024-01-01'." Ordering: When multiple chunks from same doc: Sort by position. Display coherently. Deduplication: Multiple retrieved chunks from same doc? May want to deduplicate at document level, not chunk level. Example advanced filter: "Find relevant chunks for this query, but only from docs in category='customer_policy' that were updated in the last 6 months." Vector search + metadata filtering together = much more targeted retrieval.

**Q6: Chunking strategy kaise choose karein? Decision framework kya hai?**

**Answer:** Decision framework: Step 1 — Document type: Markdown/HTML with clear structure → Structural/heading-based chunking. PDFs with mixed content → Unstructured library + element-based. Code → Language-aware chunking at function/class level. FAQs → Q&A pair per chunk. Emails/chat → Thread or time window. Step 2 — Query type: Specific factual ("What is the deadline?") → Smaller chunks (256-512 tokens). Broad conceptual ("Explain the system architecture") → Larger chunks (512-1024 tokens). Multi-hop ("Who approved the policy described in section 3?") → Parent-child. Step 3 — Scale and compute: Large corpus, frequent updates → Simpler chunking (recursive character split). Small corpus, infrequent updates → Can afford semantic chunking or proposition extraction. Step 4 — Quality requirements: High precision critical → Semantic chunking, proposition chunking. Acceptable precision → Recursive character split. Step 5 — Test and iterate: Benchmark on real queries. Evaluate retrieval recall@k. Try different chunk sizes (256, 512, 1024). Find the sweet spot for your specific data + queries. Golden rule: Never accept first chunking strategy. Always benchmark and iterate.

---

## Key Takeaways

- **Chunking is often the biggest RAG quality lever** — invest appropriately
- **Fixed-size** = simplest, often worst; only acceptable for uniform text
- **Recursive character splitting** = best general-purpose; respects natural boundaries
- **Semantic chunking** = splits at topic shifts; better integrity, higher compute cost
- **Parent-child** = small chunks for precise retrieval + large chunks for LLM context
- **Proposition chunking** = highest precision; LLM extracts atomic facts; expensive
- **Structural chunking** = use document structure (headings, sections) for structured docs
- **Metadata** = essential for attribution, filtering, ordering; don't skip it
- **Test and iterate** = benchmark with real queries; no universal optimal chunk size

---

*Agli file: `05_Reranking_Theory.md` — Retrieved results ko sort karne ki science*
