# Context Evaluation — Pehle Evidence, Phir Answer

> *"Teams final answer pe score karti hain aur sochti hain system improve ho gaya. Reality: kabhi retrieval theek tha, generation kharab; kabhi generation theek attempt karti, context mein fact hi nahi tha. Context evaluation alag se karo — warna tum galat layer pe optimize karoge."*

---

## Opening Hook — Two Failures, Same Symptom

User: "What is our EU data retention period?"
Bot: "30 days." (Wrong; actual is 18 months.)

**Failure A:** Right policy never retrieved → generation guessed.
**Failure B:** Right policy retrieved → model ignored it.

Same bad answer. Opposite fixes.
Only context-level metrics tell you which.

---

## What to Evaluate

### Retrieval / Selection Metrics
- **Context recall:** Needed facts present in assembled context?
- **Context precision:** Assembled chunks actually relevant?
- **Citation coverage:** Critical claims have supporting spans?

### Assembly Metrics
- **Token efficiency:** Useful facts per 1K tokens
- **Freshness:** % of time-sensitive slots from live sources
- **ACL correctness:** Zero unauthorized docs in manifests
- **Duplication rate:** Near-duplicate chunk fraction

### Downstream (still useful)
- Answer faithfulness to *provided* context
- Answer relevance to question
- End-to-end accuracy

Frameworks like **RAGAS** formalize several of these (faithfulness, context precision/recall). Use them — but extend beyond RAG-only to memory/tool manifests.

---

## Evaluation Types

**1. Deterministic checks**
- Schema of context packs valid?
- Required sections present?
- Tenant ID matches?
- Max token budget respected?

**2. Model-based (LLM-as-judge)**
- Is chunk relevant to query?
- Does answer stick to context?
- Did compaction drop a material clause?

**3. Human evals**
- Spot-check hard domains (legal, medical)
- Label gold contexts for a golden set

**4. Online / production**
- User thumbs, escalation rate
- Tool-error rates after retrieval
- Cost per successful task
- Injection/suspicious pattern alerts

---

## Golden Sets for Context

Build 100–300 queries with:
- Gold document/span IDs that *must* appear
- Hard negatives (tempting but wrong docs)
- Multi-source cases (doc + CRM field)
- Adversarial pages (injection strings) that must not alter behavior

Version the golden set like code.

---

## Debugging Loop

```
Bad answer
  → Inspect context manifest
  → Missing gold span? Fix retrieval/filters
  → Present but unused? Fix prompt / packing / placement
  → Present + used but wrong source authority? Fix ranking policy
  → Overflow truncated safety text? Fix budgeting
```

Never start with temperature tweaks.

---

## Anthropic Insider Angle

We separate **context adequacy** from **model compliance**. If Claude lacked the fact, that is a product retrieval bug. If Claude had the fact and contradicted it, that is a model/prompt/eval issue.

For agents, evaluate intermediate contexts too — not only final user-visible answers. A poisoned tool result that was correctly ignored is a success worth measuring.

---

## Common Misconceptions

**Misconception 1: "BLEU/ROUGE on answers is enough"**
They miss retrieval failures and faithfulness.

**Misconception 2: "LLM-as-judge replaces humans"**
Useful for scale; calibrate against humans; watch judge bias.

**Misconception 3: "One offline eval gate is enough"**
Drift happens — docs change, user mix changes. Keep online monitors.

**Misconception 4: "Higher recall@k always better"**
Precision and token budget matter; flooding k can hurt.

---

## Interview Questions

**Q1: Context evaluation kyun alag se karein?**

**Answer:** End-to-end answer scores conflate retrieval/assembly failures with generation failures. Separate metrics (context recall/precision, ACL violations, token efficiency, faithfulness-to-context) tell you which layer to fix. Otherwise teams waste time rewriting prompts when the gold document never entered the window.

**Q2: RAGAS-style metrics context engineering mein kaise map hote hain?**

**Answer:** Context recall/precision evaluate whether retrieved evidence was sufficient and relevant. Faithfulness checks whether the answer sticks to that evidence. Answer relevance checks user question fit. Extend the same ideas to non-RAG sources: memory hits, tool results, MCP resources — score presence and appropriateness in the manifest.

**Q3: Golden set kaise banaye?**

**Answer:** Curate representative queries with labeled must-have spans, hard negatives, multi-source cases, and adversarial content. Keep it versioned. Run on every retrieval/prompt change. Include production samples over time so the set does not go stale.

**Q4: Production mein kya monitor karein?**

**Answer:** Cost/tokens per request, empty-retrieval rate, ACL anomalies, user dissatisfaction, escalation rate, unusual tool sequences after external retrieval, and periodic sampled human review of manifests + answers. Tie alerts to the failure taxonomy (missing, noisy, stale, injection).

---

## Key Takeaways

- Evaluate context adequacy separately from generation
- Use deterministic + model-based + human + online signals
- Maintain golden sets with spans and hard negatives
- Debug via manifests, not vibes
- Optimize the failing layer only

---

*Module 14 complete! Agli module: `15_MCP/` — Model Context Protocol deep dive*

*Related: `08_RAG_and_Vector_Databases/`, `09_AI_Agents/03_Memory_Systems.md`, `10_MLOps` evals*
