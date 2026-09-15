# Context Techniques — Compaction, Isolation, Sharing, Long Context

> *"Context engineering ki asli craft techniques mein hai. Retrieve karna easy hai. Hard part: noise hataana, history summarize karna, agents ke beech context share karna bina leak ke, aur long windows ko smartly use karna. Yeh techniques seekh lo — tumhara RAG 'demo' se 'production' ban jaata hai."*

---

## Opening Hook — The Overloaded Desk

Desk pe 200 pages rakhi hain.
Professor confuse ho gaya.
Tumne "more context" diya — help nahi ki, harm kiya.

Techniques ka goal: **maximum signal, minimum tokens, clear boundaries.**

---

## 1. RAG with Dynamic Filters

Basic RAG: embed query → top-k chunks.

Production RAG adds filters:
- **Metadata:** tenant, product version, language, doc type, date range
- **ACL:** only docs user can read
- **Recency:** prefer last N days for changelogs
- **Hybrid:** BM25 + dense for exact IDs / error codes

Dynamic filters = context selection policy expressed as query constraints.

---

## 2. Memory as Context

Pull only relevant memory:
- Preference memory always (tone, locale) — small
- Episodic memory via retrieval (similar past sessions)
- Avoid dumping full chat logs forever

Pattern: **summarize → store → retrieve summaries**, not raw transcripts.

---

## 3. Context Compaction

**Goal:** Shrink content while keeping task-critical facts.

Techniques:
- **Extractive compression:** keep only sentences relevant to query
- **Abstractive summary:** LLM summarizes chunks before main call
- **Entity/fact packing:** structured bullets (dates, amounts, IDs)
- **Deduping:** remove near-duplicate chunks (MMR helps)
- **Hierarchical summaries:** map-reduce over large corpora

Tradeoff: compression can drop nuance. Evaluate faithfulness of compressed context.

---

## 4. Long-Context Processing

Modern models: 128K–1M+ tokens.
Temptation: put the whole repo / all PDFs in.

**Still engineer:**
- Pin instructions at edges
- Section headers and structure
- Retrieve-then-read: first find candidates, then fill long window with ranked set
- Sliding / map-reduce for documents larger than window
- Watch "lost in the middle"

Long context is a capability, not a strategy by itself.

---

## 5. State and Historical Context

Agent loops accumulate:
- Tool results
- Plans
- Failed attempts

Without management → overflow and goal amnesia.

Patterns:
- **Pinned goals:** always re-inject original objective
- **Rolling summary:** every N steps, summarize scratchpad
- **Checkpoint state:** external store for large artifacts; context holds pointers
- **Error distillation:** keep "what failed + why", drop raw stacks unless needed

---

## 6. Multi-Agent Context Sharing

Shared context options:
1. **Blackboard:** shared store all agents read/write
2. **Message passing:** supervisor sends sliced context to workers
3. **Artifacts:** workers write files; others load on demand

**Rule:** share *results*, not entire histories, unless necessary.

Worker prompt should include:
- Task slice
- Only relevant evidence
- Output schema
- Explicit non-goals

---

## 7. Context Isolation

Isolation = prevent cross-contamination between:
- Tenants (SaaS)
- Users
- Agents
- Trusted instructions vs untrusted tool/doc text

Mechanisms:
- Separate retrieval indexes per tenant
- Separate message roles / delimiters for untrusted content
- Tool-output sandboxing (treat as data)
- No shared scratchpad across security domains

Isolation failures = data leaks and prompt injection cascades.

---

## Technique Selection Cheat Sheet

| Problem | Technique |
|---------|-----------|
| Wrong docs | Better filters + rerank |
| Too many tokens | Compaction + dedupe |
| Agent forgets goal | Pin + rolling summary |
| Multi-agent chaos | Sliced message passing |
| Cross-tenant risk | Hard isolation + ACL |
| Huge corpus | Hierarchical summary / map-reduce |

---

## Anthropic Insider Angle

Agent products fail quietly when compaction deletes the one sentence that mattered — or when isolation is soft and a tool page injects instructions.

We prefer **structured context packs** (JSON/Markdown sections with clear labels: `POLICY`, `TOOL_RESULT`, `USER_MEMORY`) over undifferentiated blobs. Structure helps Claude treat sections differently and helps humans audit manifests.

Also: multi-agent systems should default to *minimal share*. Every extra shared paragraph is an injection and confusion surface.

---

## Common Misconceptions

**Misconception 1: "Reranking replaces compaction"**
Rerank orders; compaction shrinks. Often need both.

**Misconception 2: "Summaries are always safe"**
Summaries can hallucinate. For legal/medical, prefer extractive spans with citations.

**Misconception 3: "Isolation is just separate prompts"**
If retrieval can see other tenants' data, prompts cannot save you.

**Misconception 4: "More agents need more shared context"**
More agents usually need *clearer contracts* and *less* shared mush.

---

## Interview Questions

**Q1: Context compaction kya hai? Kab use karein?**

**Answer:** Compaction reduces tokens while preserving task-critical information: extractive cuts, abstractive summaries, fact packing, deduping, hierarchical map-reduce. Use when retrieved or historical context exceeds budget, contains duplicates, or dilutes attention. Risks: dropping key facts or introducing summary hallucinations. Mitigate with faithfulness checks, citations to source spans, and evals that score compacted context separately. Prefer extractive methods for high-stakes domains.

**Q2: Multi-agent context sharing kaise design karein?**

**Answer:** Prefer message passing of sliced task context over dumping full histories. Use a blackboard only for small shared state. Workers get: goal slice, relevant evidence, schema, constraints. Share artifacts by reference when large. Minimal share reduces cost, confusion, and injection blast radius. Supervisor synthesizes worker outputs rather than concatenating raw traces.

**Q3: Context isolation kyun zaroori hai?**

**Answer:** Without isolation, systems leak data across tenants/users, and untrusted content can hijack agents. Enforce ACL at retrieval, separate indexes, delimit untrusted tool/doc text as data, and avoid shared scratchpads across security domains. Isolation is a security and reliability property of the context layer, not a prompt flourish.

**Q4: Long context models ke baad bhi RAG kyun?**

**Answer:** Because corpora exceed even large windows, attention quality can degrade, cost/latency rise with tokens, and permissions still require selective retrieval. Pattern: retrieve candidates, then optionally use long context for the ranked subset. Long context complements RAG; it does not delete the need for selection policies.

---

## Key Takeaways

- Techniques = filters, memory retrieval, compaction, long-context discipline, state mgmt, sharing, isolation
- Signal/token ratio is the north star
- Structure context packs; don't dump blobs
- Minimal multi-agent sharing by default
- Isolation is hard security, not soft prompting

---

*Agli file: `04_Context_Security_and_Failure_Modes.md` — Injection, leaks, failure taxonomy*
