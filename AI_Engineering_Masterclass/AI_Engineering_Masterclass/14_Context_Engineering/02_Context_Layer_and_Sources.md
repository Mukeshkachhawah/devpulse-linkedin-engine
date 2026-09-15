# Context Layer and Sources — Model Ke Liye Information Pipeline

> *"LLM ek brain hai bina eyes ke — jab tak tum context layer na banao. Context layer woh system hai jo decide karta hai: is query ke liye kaunsi files, kaunsi memories, kaunse tools, kaunsa user state window mein aayega. Yeh layer accha hai toh model smart lagta hai. Yeh layer kharab hai toh model 'dumb' lagta hai — jabki model same hai."*

---

## Opening Hook — The Librarian Metaphor

Ek genius professor hai. Usse koi bhi sawaal pooch sakte ho.
Lekin uske paas library access nahi — sirf jo kitaab uske desk pe rakhi hai, wahi padh sakta hai.

Tumhari job: har sawaal se pehle *sahi kitaabein* desk pe rakhna.
Zyada kitaabein = confusion.
Galat kitaabein = wrong lecture.
Purani kitaabein = outdated advice.

**Context layer = woh librarian + desk policy.**

---

## What Is a Context Layer?

**Definition:**
The software subsystem that assembles, budgets, and governs everything placed into the model context for a request — separate from the model weights and separate from the final generation step.

**Responsibilities:**
1. Discover candidate sources
2. Retrieve / fetch relevant pieces
3. Filter, dedupe, authorize
4. Compress / summarize to fit budget
5. Order and format for the model
6. Log what was included (for evals and audits)

**Not the context layer:**
- Model training
- Pure UI chat rendering
- Downstream business actions (those are tools/agents)

---

## Source Types

### 1. Static / Curated Knowledge
Docs, wikis, policies, product manuals.
Usually via embeddings + vector search (RAG).
Change frequency: medium.

### 2. Operational Systems
CRM tickets, orders, inventory, feature flags.
Usually via APIs / SQL / MCP tools.
Change frequency: high. Must be fresh.

### 3. Memory Systems
User preferences, past session summaries, agent episodic logs.
See Module 09 memory lessons.
Change frequency: per user / per session.

### 4. Tool Outputs (Live)
Search results, code execution, browser pages.
Arrive *during* the turn; become new context mid-loop.

### 5. MCP Resources
Standardized resources exposed by MCP servers (files, DB rows, tickets).
Same role as tools/data connectors, with a shared protocol.
Deep dive: Module 15.

### 6. Conversation and Agent State
Prior turns, plan steps, scratchpad, pending confirmations.
Often the largest silent consumer of tokens.

### 7. Policy / Security Context
User role, tenant ID, PII redaction rules, allowlists.
Must be applied *before* retrieval results enter the window.

---

## Architecture Pattern

```
User request
    → Intent / routing (optional)
    → Source selectors (which systems to query)
    → Retrievers / tool calls / MCP reads
    → AuthZ + PII filters
    → Rank / merge / dedupe
    → Compaction (fit token budget)
    → Prompt assembly (system + context packs + user)
    → Model
```

**Key insight:** Prompt templates are the last mile. Most complexity sits in selectors → filters → compaction.

---

## Token Budgeting

Treat the window like RAM with partitions:

| Slot | Typical share | Notes |
|------|---------------|-------|
| System + safety | 5–15% | Pinned; rarely compacted |
| Tools/schemas | 5–20% | Can grow with many tools |
| Retrieved evidence | 30–50% | Highest ROI to optimize |
| History / memory | 10–30% | Summarize aggressively |
| User message | small | Must fit fully |

Budgets are product-specific. Coding agents may give more to repo context; support bots more to CRM + policy.

---

## Source Selection Policy

Not every query should hit every source.

**Examples:**
- "What is our refund policy?" → docs only
- "Where is my order #123?" → orders API only
- "Summarize yesterday's thread and draft a reply" → memory + email + style guide

**Routing approaches:**
- Rules (keyword / intent classifier)
- Small router model
- Agent decides which tools to call (dynamic)

Static always-on retrieval for every message = expensive and noisy.

---

## Freshness and Authority

**Freshness:** Prefer live systems for facts that change (prices, inventory, ticket status).

**Authority:** Prefer canonical sources (policy wiki) over Slack gossip.

**Conflict resolution:** When two sources disagree, encode priority:
1. Live system of record
2. Dated official policy
3. Memory / chat history
4. Web / informal

Put that priority *in instructions* and enforce in ranking.

---

## Anthropic Insider Angle

When building Claude-powered assistants, we treat context assembly as a product surface. Users blame "the AI" when the assistant missed a file that never entered the window.

Practical discipline: log a **context manifest** per request — source IDs, chunk IDs, tool call IDs, token counts per slot. Without manifests, you cannot debug or evaluate. Context engineering without observability is guessing.

Also: permissioning belongs in the context layer. Never retrieve a document the user cannot access and "hope the model ignores it." If it is in the window, assume it can leak into the answer.

---

## Common Misconceptions

**Misconception 1: "One vector DB is the whole context layer"**
Vector search is one retriever. Live APIs, memory, MCP, history still matter.

**Misconception 2: "Stuff everything; model will sort it out"**
Models degrade with noise; costs explode; injection surface grows.

**Misconception 3: "Context layer = LangChain"**
Frameworks help implement. The *design* (sources, budgets, policies) is the skill.

**Misconception 4: "MCP replaces RAG"**
MCP standardizes access. You still need retrieval, ranking, and budgeting.

---

## Interview Questions

**Q1: Context layer kya hota hai?**

**Answer:** The subsystem that decides and assembles what enters the model context for each request: selecting sources, retrieving data, enforcing auth/PII filters, ranking/deduping, compacting to a token budget, formatting packs, and logging a manifest. It sits between user intent and the model call. Separating it from "the prompt" clarifies ownership: prompts steer behavior; the context layer supplies evidence and state. Production quality depends heavily on this layer because private and fresh information cannot come from weights alone.

**Q2: Context sources ke types kya hain?**

**Answer:** (1) Curated knowledge via RAG. (2) Operational systems via APIs/SQL. (3) Memory (preferences, session summaries, episodic logs). (4) Live tool outputs mid-turn. (5) MCP resources. (6) Conversation/agent state. (7) Security/policy context (roles, tenant, redaction). Good systems route queries to the right subset instead of querying all sources every time.

**Q3: Token budget kaise design karein?**

**Answer:** Partition the window: pin system/safety; allocate tools/schemas; give the largest flexible share to evidence; summarize history/memory; always reserve space for the user message. Measure token share per slot in production. If history eats 60%, answers suffer — compact. If evidence is 5%, retrieval is underpowered. Budgeting is iterative and product-specific.

**Q4: MCP context layer mein kahan fit hota hai?**

**Answer:** MCP provides a standard way for hosts/clients to read resources and call tools from servers. In the context layer, MCP is a *connector interface* — another source type alongside REST APIs and vector DBs. It does not replace ranking, authZ, or compaction. See Module 15 for Host/Client/Server architecture.

---

## Key Takeaways

- Context layer = librarian + desk policy for the model
- Multiple source types; route per intent
- Budget tokens by slot; measure in production
- AuthZ before retrieval enters the window
- Log context manifests for debug and evals

---

*Agli file: `03_Context_Techniques.md` — Compaction, isolation, multi-agent sharing*
