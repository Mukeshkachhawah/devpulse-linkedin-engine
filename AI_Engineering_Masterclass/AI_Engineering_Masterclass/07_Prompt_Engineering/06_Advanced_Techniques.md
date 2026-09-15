# Advanced Prompt Engineering Techniques — Next Level

> *"Tumne basics seekh liye. Ab woh techniques jo production engineers use karte hain jab basic prompting fail ho jaata hai. Yeh techniques combine hote hain reasoning, decomposition, verification, meta-prompting. Yeh woh cheezein hain jo interviews mein impress karte hain — aur production mein results dete hain."*

---

## Opening Hook — The Thousand-Dollar Mistake

A fintech startup built a document analysis system.
Prompt: "Analyze this financial document and extract: company name, revenue, profit margins."

Testing phase: Works great. 98% accuracy.
Production: Client uploads 400-page annual report.
Result: Missing data, wrong numbers, hallucinated figures.

Problem: Single prompt worked for test documents (10-20 pages).
Broke on real documents (100-400 pages).

**Advanced technique needed: Document chunking + hierarchical processing + verification.**

This module teaches the techniques that handle these real-world challenges.

---

## Technique 1: Prompt Chaining

**Concept:**
Break complex tasks into a sequence of simpler prompts.
Output of prompt N → input for prompt N+1.

**Instead of:**
"Analyze this document AND summarize AND extract entities AND rate sentiment AND write report."
One massive prompt doing 5 things.

**Use:**
Prompt 1: "Summarize this document."
Prompt 2: "From this summary, extract named entities: [summary]."
Prompt 3: "Rate sentiment of these entities: [entities]."
Prompt 4: "Write executive report based on: [summary], [entities], [sentiments]."

**Why better:**
Each prompt focused = better quality for that step.
Can use different models for different steps.
Can validate/filter between steps.
Error in one step visible, fixable without redoing all steps.

---

## Technique 2: Document Chunking + Map-Reduce

**The problem:**
Document longer than context window.
Can't analyze 400 pages in one prompt.

**Map-Reduce approach:**

**MAP phase:**
Split document into chunks (each fits in context window).
Run same prompt on EACH chunk independently.
Prompt: "Extract key facts about revenue from this section: [chunk]"

**REDUCE phase:**
Combine all chunk outputs.
Prompt: "Given these partial analyses, create a unified complete analysis: [all_chunk_outputs]"

**When to use:**
Very long documents.
Data extraction across many records.
Summarization of long text.

**Chunk size considerations:**
Too small: Miss context that spans chunks. More API calls.
Too large: Risk exceeding context. Less parallel.
Overlap: Include last 200 tokens of previous chunk at start of next. Prevents missing cross-boundary information.

---

## Technique 3: Meta-Prompting

**Ask the model to generate better prompts.**

**Use case:**
You know the TASK but not the OPTIMAL PROMPT for it.

**Process:**
1. Describe the task to a "meta-prompt model."
2. Ask it to generate the best prompt for that task.
3. Use the generated prompt.

**Meta-prompt:**
"I need to classify customer support emails into these categories: [categories]. I have a dataset of historical emails. Generate the optimal few-shot prompt for this classification task, including appropriate examples."

Model: Generates optimized prompt with examples.
Use that generated prompt.

**Why it works:**
Models "know" good prompt structures from training data.
Can apply prompt engineering principles better than you describe.
Especially useful when you're unfamiliar with a specific task format.

---

## Technique 4: Prompt Optimization with DSPy

**Automated prompt optimization framework.**

**DSPy (Declarative Self-improving Language Programs):**
Instead of manually engineering prompts:
Define your task in terms of inputs/outputs.
DSPy automatically finds the optimal prompts.

**Process:**
1. Define: Input format, output format, metric for success.
2. Provide: Small labeled dataset (30-50 examples).
3. Run DSPy optimizer.
4. DSPy: Iteratively generates and tests prompt variations. Keeps best.

**Result:** Prompts that you probably wouldn't write manually.
Often 10-30% improvement over hand-crafted prompts on specific tasks.

**When worth using:**
Clear metric for success.
Enough labeled examples.
Task will be run at high volume (ROI on optimization effort).

---

## Technique 5: Constitutional Self-Refinement

**Ask model to critique and improve its own output.**

**Two-stage:**
Stage 1: Generate initial response.
Stage 2: Critique and refine.

**Implementation:**
Prompt 1: "Answer this question: [question]"
Model: [Initial answer]

Prompt 2: "Review your previous answer for: (1) factual accuracy, (2) completeness, (3) clarity. Then provide an improved answer. Format: Critique: [your critique]. Improved answer: [better answer]."

**Critique dimensions to specify:**
Factual accuracy: Any claims that might be wrong?
Completeness: What's missing?
Clarity: Any confusing parts?
Logical consistency: Any contradictions?
Task adherence: Did you actually answer what was asked?

**Why it helps:**
Generating an answer and critiquing it are different tasks.
Sometimes errors visible from "outside" that weren't visible during generation.
Forces model to double-check.

---

## Technique 6: Verified Generation

**For high-stakes outputs, add verification step.**

**After generating answer, run verification prompt:**
"Verify each claim in this answer. For each factual claim:
1. State the claim.
2. Is it something you're confident about, uncertain about, or unknown?
3. If uncertain: Flag for human review.

Answer to verify: [generated answer]"

**Structured verification:**
Model outputs:
- Claims it's confident about: Include in final answer.
- Claims it's uncertain about: Mark with [NEEDS VERIFICATION].
- Claims it doesn't know: Remove or ask user to confirm.

**Application:**
Legal documents: Flag uncertain legal claims.
Medical information: Flag uncertain medical facts.
Financial analysis: Flag uncertain financial data.

---

## Technique 7: Ensemble Prompting

**Multiple prompts → combine outputs.**

**Process:**
1. Same question, multiple DIFFERENT prompt framings.
2. Each framing from different "angle."
3. Combine or vote on outputs.

**Example (medical triage):**
Prompt 1: "As a diagnostician, what are the top 3 possible diagnoses?"
Prompt 2: "As an ER doctor focused on ruling out dangerous conditions, what conditions must be immediately considered?"
Prompt 3: "List symptoms and what each suggests about the patient's condition."

Three different perspectives → more comprehensive analysis → better final answer.

**When useful:**
High-stakes decisions.
Complex, multi-faceted analysis.
When no single framing captures everything.

---

## Technique 8: Structured Generation with Schemas

**Force specific output format.**

**JSON mode:**
Many modern APIs support JSON mode.
Model GUARANTEED to output valid JSON.

**Schema specification:**
```
Analyze this customer review and return JSON with schema:
{
  "sentiment": "positive" | "neutral" | "negative",
  "sentiment_score": <number between -1 and 1>,
  "main_topics": [<list of strings>],
  "action_required": <boolean>,
  "action_type": <string or null>
}

Review: [customer review text]
```

**Production reliability:**
With schema: ~100% correctly formatted JSON.
Without schema: 5-15% formatting errors requiring retry.

**Advanced: TypeScript/Pydantic schema in prompt:**
Describe the exact structure with type hints.
Model follows structure more precisely.

---

## Technique 9: Contextual Compression

**For long contexts: Compress before processing.**

**Problem:**
Large document → can't process all at once.
Map-reduce works but many API calls.

**Compression approach:**
Step 1: Quick extraction — "Extract only the sentences relevant to [topic] from this text."
Step 2: Now process the compressed text with full prompt.

**Two-pass is more efficient:**
Pass 1: Simple extraction (cheap/fast).
Pass 2: Full analysis on extracted content (precise/expensive).

**Example:**
100-page legal contract.
Want: "Find all clauses about intellectual property."

Pass 1: "Extract all sentences mentioning intellectual property, ownership, copyright, patents."
Result: 2 pages of relevant text.

Pass 2: "Analyze these IP-related clauses for risks and obligations: [2 pages]"
Much better analysis at much lower cost.

---

## Technique 10: Dynamic Few-Shot with Semantic Retrieval

**Already covered briefly — here the deep version.**

**Setup:**
1. Curate a bank of 100-1000 high-quality examples.
2. Embed each example with embedding model.
3. For each new input: Embed input → find k most similar examples.
4. Include those k examples in prompt.

**Why significantly better than static few-shot:**
Same restaurant query: Business hours, location questions → retrieve examples about business info.
Medical query: Medication, symptoms → retrieve examples about medical responses.

Each input gets the MOST RELEVANT examples.

**Implementation:**
Example bank stored in vector database (Pinecone, Weaviate, Chroma, FAISS).
At runtime: embed(input) → vector search → k nearest examples → construct prompt.

**Overhead:**
Embedding: ~20ms.
Vector search: ~10ms.
Total: ~30ms extra per query.
Worth it for high-quality applications.

---

## Technique 11: Output Scaffolding

**Provide partial output structure that model must fill.**

**Instead of:** "Write a product review response."

**Use:** 
```
Complete this response template:

"Thank you for your [TONE OF FEEDBACK] feedback about [SPECIFIC PRODUCT ISSUE MENTIONED].

We're [SINCERITY LEVEL + ACTION] regarding [ISSUE].

[ONE SENTENCE explaining what happened or why].

Here's what we're doing: [CONCRETE STEPS].

You can expect [TIMELINE AND OUTCOME].

Please [SPECIFIC NEXT STEP FOR CUSTOMER]."
```

**Why it works:**
Forces model to include all required elements.
Ensures consistent format across responses.
Guides model toward your specific structure.
Great for document templates, email templates, structured reports.

---

## Technique 12: Streaming Responses

**What it is:**
Return tokens to the user as they are generated instead of waiting for the full completion.

**Why it matters:**
- Perceived latency drops dramatically (TTFT matters more than total time)
- Users can cancel early
- UX feels "alive" for chat and coding assistants

**Engineering notes:**
- Back-pressure and partial JSON: don't parse incomplete structured output as final
- UI should show typing state; handle mid-stream errors
- Logging: store final assembled text; optionally sample stream timings
- Pair with prompt caching: cached prefix speeds TTFT further

**When not to stream:**
Batch jobs, offline evals, or when you must validate the entire object before showing anything.

---

## Technique 13: Prompt Caching

**What it is:**
Cache computation (and billing) for a repeated prompt prefix — typically a long system prompt, tool schemas, or static policy docs — across many requests.

**Why it matters:**
- Large fixed prefixes dominate cost
- Providers (e.g., Anthropic, OpenAI) offer discounted cached input tokens
- Improves TTFT when the KV/prefix work is reused

**Design rules:**
- Put stable content first (cacheable prefix); put variable user content last
- Version cached prefixes; bust cache on policy changes
- Don't put per-user secrets in the shared cached prefix
- Measure cache hit rate in observability (`10_MLOps/07_LLM_Observability.md`)

**Related:** Serving-level discussion in `10_MLOps_and_Production/04_Serving_Theory.md`.

---

## Anthropic Insider Angle

Advanced techniques are what distinguish a good AI engineer from a great one. These aren't theoretical — they're what production systems use.

**Verification at Anthropic:** For Claude's self-evaluation capabilities, we found that well-structured verification prompts significantly improve output quality on high-stakes tasks. The key insight: verification is a DIFFERENT cognitive task than generation. The model playing "critic" catches things the model playing "generator" missed.

**Contextual compression internally:** We use hierarchical processing extensively. A document analysis task that seems to require reading everything often can be done in phases: quick scan for relevant sections, deep read of relevant sections. This is both more efficient and often MORE accurate — focused attention beats scattered attention.

**DSPy and automated optimization:** Automated prompt optimization is becoming increasingly important. As models improve, the "base" performance goes up, but the ceiling also goes up. Well-optimized prompts for specialized tasks still significantly outperform naive prompts even on frontier models. DSPy-style optimization is one of the emerging competitive advantages.

**Production advice:** The most important advanced technique in production is PROMPT VERSION CONTROL. Treat prompts like code. Every change versioned. A/B test before switching. Monitor metrics after changes. We've seen production regressions from "small" prompt changes that seemed harmless. This professionalism around prompt management is what separates production AI engineering from toy projects.

---

## Prompt Engineering Anti-patterns at Scale

**Anti-pattern 1: Prompt Sprawl**
Different prompts for slightly different versions of same task.
15 different "summarize" prompts across the codebase.
Maintenance nightmare.
Fix: Parameterized prompts. One template, different parameters.

**Anti-pattern 2: No Versioning**
"Just edit the prompt in the code."
No history of what worked, why things changed.
Fix: Prompt registry. Version, test, deploy prompts like code.

**Anti-pattern 3: Testing on Training Data**
Developing prompts against examples you've seen.
Overfitting your prompt to those examples.
Fix: Hold-out test set. Separate from development.

**Anti-pattern 4: Single Point of Failure**
One prompt for entire complex task.
Single failure → full task failure.
Fix: Modular prompts. Each step own prompt. Error isolation.

---

## Interview Questions

**Q1: Prompt chaining kya hai? Complex tasks ke liye kyun better hai single prompt se?**

**Answer:** Prompt chaining: Complex task broken into sequential simpler prompts. Output of step N → input for step N+1. Why better: (1) Each prompt focused on one subtask → higher quality for that step. Model not juggling 5 things simultaneously; (2) Error isolation: Step 3 fails? Debug step 3 independently. Not the whole chain; (3) Validation between steps: Check step 2 output before feeding to step 3. Filter/clean intermediate results; (4) Different models for different steps: Use fast cheap model for extraction, expensive model for analysis; (5) Parallelism: Independent branches can run simultaneously. Example: Document → Extract sections → Analyze each section (parallel) → Synthesize → Report. vs. Document → [Huge prompt trying to do all at once] → Result often lower quality, less debuggable.

**Q2: Map-reduce prompting kaise kaam karta hai? Long documents ke liye kyun zaruri hai?**

**Answer:** Long document problem: 400-page annual report > context window. Can't process entire doc at once. Map-reduce solution: MAP: Split into N chunks (each fits in context). Run analysis prompt on each chunk independently. N parallel/sequential calls. Each returns partial result. REDUCE: Combine all partial results. Run synthesis prompt: "Given these partial analyses, create complete analysis." Single call for synthesis. Chunking best practices: Chunk by section, not arbitrarily. Include overlap (100-200 token overlap between chunks) to catch cross-boundary information. Store chunk metadata (page numbers, section headers) for attribution. When map: "Extract revenue figures from this section: [chunk]." When reduce: "Combine these partial revenue extractions into a complete revenue analysis. Handle any contradictions or overlaps: [all_extractions]." Result: Can process any document length. Scales with document size.

**Q3: Constitutional self-refinement kya hai? Kab use karein?**

**Answer:** Self-refinement: Two-stage generation + critique process. Stage 1: Generate initial response. "Answer: [question]." Stage 2: Critique and refine. "Critique your previous answer for: accuracy, completeness, clarity. Then write improved version." Why it helps: Generating and critiquing use different cognitive patterns. Errors visible from critique perspective that weren't during generation. Forces double-checking. When to use: (1) High accuracy requirements. Medical information, legal text, financial analysis — where errors costly. (2) Complex reasoning. Multi-step problems where one wrong step ruins answer. (3) Formal writing. Reports, official communications where quality matters. (4) After getting "good" answer, want "great" answer. When NOT to use: Simple factual lookups (Paris is capital of France — critique adds nothing). High volume, low stakes (cost of critique not worth it). Latency-critical (2x response generation = 2x latency).

**Q4: Dynamic few-shot retrieval static few-shot se kyun better hai?**

**Answer:** Static few-shot: Same 3-5 examples for every query. "Average" relevance across all query types. Works when query distribution narrow. Dynamic retrieval: Per-query: Find most similar examples from large bank. Top-k similar examples by embedding similarity. High relevance for each specific query. Why better: Query "What are your business hours?" → retrieve examples about hours/location queries. Query "I'm having a medical emergency" → retrieve examples about urgent escalation. Each query: Maximally relevant examples. How it works: Precompute: Embed all examples, store in vector database. Runtime: Embed query → vector search → k nearest → construct prompt. Overhead: ~30ms for embedding + search. Usually worth it. When to invest: Large example banks (50+ examples). Diverse query types expected. Quality important. Trade-off: More engineering, more infrastructure. Simple static examples sufficient for narrow-scope applications.

**Q5: Output scaffolding kya hai? Format consistency ke liye kyun important hai?**

**Answer:** Output scaffolding: Provide partial template that model must complete. Not "write a review response." Instead: "Complete this template: 'Thank you for your [FEEDBACK_TONE]...'" Why important for consistency: Guarantees required elements present. Every response includes acknowledgment, action, timeline. Format identical across all responses. No missing sections. Production benefits: Customer service: Every complaint response has same required elements. Reduces manual quality checking. Report generation: Consistent structure across 100s of reports. Contract analysis: Standard sections always present. Output parsing: Predictable structure → easier parsing. Know exactly where each element appears. Example patterns: Email response: Greeting + Acknowledgment + Explanation + Action + Close. Analysis report: Executive summary + Findings + Recommendations + Appendix. Data extraction: Fixed field names → reliable JSON parsing. When to use: Whenever you need GUARANTEED structure in output.

**Q6: Production mein prompt versioning kyun zaruri hai? Best practices kya hain?**

**Answer:** Why versioning critical: "Small" prompt change → 20% quality drop in production. No versioning = can't rollback = can't diagnose. Production prompts are production code. They need the same engineering rigor. Common disasters without versioning: "I just tweaked the wording slightly" → performance drops. Can't reproduce the good version. No record of what worked. Best practices: (1) Version control: All prompts in source code repository (Git). Every change: commit message explaining what + why. (2) Evaluation suite: 50-100 labeled examples. Every prompt change: run evaluation. Compare metrics to previous version. Don't deploy regressions. (3) A/B testing: For important changes: Run old and new in parallel. Small traffic to new version. Compare metrics before full rollout. (4) Prompt registry: Central store of all prompts with versions. Deployment maps prompt_id → version. Can pin to specific version. (5) Monitoring: Log model outputs in production. Alert on quality metrics dropping. Regularly sample for quality review. Treat prompt engineering like software engineering.

---

## Key Takeaways

- **Prompt chaining** = complex tasks → sequential simpler prompts; better quality, debuggable
- **Map-reduce** = long docs → chunk (map) → analyze → combine (reduce); handles any length
- **Meta-prompting** = ask model to generate better prompts for specific tasks
- **Constitutional self-refinement** = generate → critique → improve; better accuracy
- **Verified generation** = after answer, explicitly check claims; flag uncertain ones
- **Ensemble prompting** = multiple framings → combine; better for complex analysis
- **JSON schema** = force structured output; much higher format reliability
- **Dynamic few-shot** = retrieve relevant examples per query; better than static
- **Output scaffolding** = provide partial template; guarantees required elements
- **Streaming responses** = lower perceived latency; handle partial structured output carefully
- **Prompt caching** = cache stable prefixes for cost + TTFT; variable content last
- **Version control prompts** = treat like code; evaluation suite; A/B test changes

---

*Module 07 complete! Agli module: `08_RAG_and_Vector_Databases` — Knowledge retrieval ki science*
