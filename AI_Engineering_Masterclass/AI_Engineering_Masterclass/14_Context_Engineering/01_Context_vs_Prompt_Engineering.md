# Context Engineering vs Prompt Engineering — Do Alag Skills

> *"Prompt engineering bolta hai: model se kya kehna hai. Context engineering bolta hai: model ke saamne kya rakhna hai. 2023 mein sab prompt pe focused the. 2025 mein production systems ka bottleneck prompts nahi — context hai. Galat docs retrieve hue, stale memory aayi, too much noise — prompt kitna bhi accha ho, answer kharab."*

---

## Opening Hook — Same Prompt, Different Worlds

**Prompt (identical dono cases mein):**
"Based on the provided information, should we renew Vendor X's contract?"

**Case A context:** Last year's vendor scorecard, SLA breaches, alternative quotes, legal risk note.

**Case B context:** Marketing blog about Vendor X, an outdated PDF from 2019, and three unrelated Slack dumps.

Same model. Same prompt. Completely different decisions.

**Yahi farq hai.** Prompt engineering = instruction quality. Context engineering = information quality inside the window.

---

## Definitions

**Prompt Engineering:**
Designing the *instructions* — role, task, format, constraints, examples — that steer model behavior.

**Context Engineering:**
Designing the *information pipeline* that fills the model's context window: what to fetch, how to filter, how to order, how to compress, how to isolate, and how to keep it safe.

**Relationship:**
Prompt = steering wheel.
Context = road + map + traffic.
Bad road + perfect steering = still crash.

---

## What Goes Into a Context Window

Typical production request:

1. **System instructions** (prompt engineering territory)
2. **Tool schemas / MCP resources**
3. **Retrieved documents** (RAG)
4. **Conversation / agent history**
5. **User/profile state** (preferences, permissions)
6. **Working scratchpad** (intermediate agent steps)
7. **Current user message**

Context engineering owns items 2–6. Prompt engineering owns item 1 (and how 7 is framed).

---

## When Prompt Engineering Wins

- Task is clear and self-contained
- Model already knows the domain (general knowledge)
- Format/style/persona is the main failure mode
- Few examples fix the behavior

Examples: rewrite email tone, classify ticket type, generate JSON for a known schema.

---

## When Context Engineering Wins

- Answer depends on *private / fresh / large* knowledge
- Multi-turn agents that accumulate state
- Multi-source systems (docs + tools + memory)
- Cost/latency dominated by tokens in context
- Security risk comes from untrusted retrieved content

Examples: internal policy Q&A, coding agents over a repo, support bots with CRM + docs.

---

## The Shift in Industry Language

**Old framing:** "Write a better prompt."

**New framing:** "Design the context layer."
- Which sources?
- What retrieval policy?
- What compaction strategy?
- What isolation boundaries?
- How do we evaluate context quality separately from generation quality?

Prompt skill abhi bhi zaroori hai. Lekin AI engineer ka job ab zyada tar *context systems* banana hai.

---

## Mental Model — Two Levers

**Lever A — Instruction clarity (prompt):**
Ambiguous → clear. Vague role → precise role. No format → schema.

**Lever B — Evidence quality (context):**
Missing → retrieved. Noisy → filtered. Stale → refreshed. Huge → compacted. Contaminated → isolated.

Production debugging order:
1. Was the right context present?
2. Was noise too high?
3. Were instructions clear?
Agar pehle do fail — prompt rewrite se time waste.

---

## Anthropic Insider Angle

Claude products (and Claude-powered agents) live or die on context quality. A beautiful system prompt cannot compensate for retrieving the wrong policy PDF or stuffing 80K tokens of near-duplicates into the window.

Internal practice: evaluate **context faithfulness** and **retrieval usefulness** as first-class metrics — not just final answer quality. When answers fail, we ask: "Did Claude have the facts it needed?" before "Did we prompt Claude wrong?"

Also: long context is not free. More tokens = more cost, more latency, and sometimes *worse* attention ("lost in the middle"). Context engineering is often about putting *less* but *better* information in front of the model.

---

## Common Misconceptions

**Misconception 1: "Longer context always better"**
No. Noise dilutes attention. Compaction often beats dumping everything.

**Misconception 2: "Context engineering = RAG only"**
RAG is one source. Memory, tools, MCP resources, user state, agent traces — sab context hain.

**Misconception 3: "Prompt templates solve production"**
Templates help. Pipelines that choose *what fills the template* matter more at scale.

**Misconception 4: "Better model removes need for context design"**
Stronger models use context more skillfully — they don't invent your private docs.

---

## Interview Questions

**Q1: Context engineering aur prompt engineering mein kya farq hai?**

**Answer:** Prompt engineering designs instructions (role, task, format, constraints, examples) that steer behavior without changing weights. Context engineering designs the information that enters the context window — retrieval, memory, tools, state, compaction, isolation, security. Prompt answers "how should the model behave?" Context answers "what evidence does the model see?" In production, many failures are context failures: wrong docs retrieved, stale memory, overloaded windows. Fix order: verify context presence and quality first, then refine prompts. Both skills are required; modern AI engineering weights context systems heavily because private/fresh knowledge and multi-source agents dominate real apps.

**Q2: Kab prompt pe focus karein, kab context pe?**

**Answer:** Focus on prompt when: task is self-contained, domain knowledge is already in the model, failures are format/style/persona. Focus on context when: answers need private or changing data, agents accumulate state, multiple sources feed the model, token cost/latency dominate, or untrusted content can be injected via retrieval. Rule of thumb: if swapping the documents changes the answer quality more than rewriting the instruction, you have a context problem.

**Q3: Context window mein typically kya-kya hota hai?**

**Answer:** (1) System instructions. (2) Tool/MCP schemas and resources. (3) Retrieved knowledge (RAG chunks). (4) Conversation and agent history. (5) User/profile/permissions state. (6) Intermediate scratchpad. (7) Current user turn. Context engineering owns selecting, filtering, ordering, and compressing 2–6. Budgeting tokens across these slots is a design decision: pin critical instructions, retrieve top relevant evidence, summarize history, drop duplicates.

**Q4: "Lost in the middle" context engineering ko kaise affect karta hai?**

**Answer:** Models often attend more strongly to beginning and end of long contexts than the middle. Dumping 50 chunks unordered can bury the one critical paragraph mid-window. Mitigations: retrieve fewer higher-quality chunks; put critical evidence near the query or near the end; rerank; compress; structure with clear headings; avoid near-duplicate fillers. Context engineering is placement and selection, not only retrieval recall.

---

## Key Takeaways

- **Prompt** = how to behave; **Context** = what evidence to see
- Same prompt + bad context = bad decisions
- Context includes RAG, memory, tools/MCP, state — not just docs
- Debug context quality before rewriting prompts
- Less-but-better often beats longer-but-noisier windows

---

*Agli file: `02_Context_Layer_and_Sources.md` — Context layer ka architecture*
