# Agent Frameworks and SDKs — Manual Loop se Platform Tak

> *"Pehle agent = while-loop + tool calls + apna state. Phir har vendor ne SDK/platform la diya: OpenAI Agents, Claude Agent SDK, Vertex Agent Builder, Google ADK. Skill yeh nahi ki logos yaad rahein — skill yeh hai ki kab manual, kab SDK, kab managed builder. Over-framework karna bhi failure mode hai."*

---

## Opening Hook — Three Ways to Build the Same Agent

**Task:** Research a URL, summarize, file a ticket.

1. **Manual:** Your HTTP handlers + model tool-calling + Postgres state.
2. **SDK:** Vendor agent runtime with tools, sessions, guardrails.
3. **Managed builder:** Cloud console wiring tools + eval hooks.

All three can work. Complexity and lock-in differ.

---

## 1. Manual Implementation

**What it is:**
You own the loop: plan → call model → execute tools → append results → stop condition.

**Pros:**
- Full control, minimal magic
- Easy to reason about for interviews and debugging
- No framework upgrade churn

**Cons:**
- You build memory, retries, tracing, evals yourself
- Reinventing multi-agent orchestration is costly

**When:** Learning, simple agents, strict compliance boundaries, small surface area.

Covered deeply in `01`–`06` of this module.

---

## 2. OpenAI AgentKit and Agents SDK

**What it is:**
OpenAI’s stack for building agents that use tools/function calling, structured workflows, and (depending on product surface) UI/agent kit components for shipping assistant experiences.

**Strengths:**
- Tight fit if you already standardize on OpenAI models/APIs
- Mature function calling / responses patterns
- Good docs ecosystem and examples

**Tradeoffs:**
- Model/provider gravity toward OpenAI
- Still need your own RAG, authZ, and prod hardening

**When:** OpenAI-centric shops; want official patterns over bespoke loops.

---

## 3. Claude Agent SDK

**What it is:**
Anthropic-oriented tooling/patterns for building agents on Claude — tool use, computer-use style workflows where applicable, and host integrations (including MCP-friendly ecosystems).

**Strengths:**
- Strong tool-use / safety-oriented defaults with Claude
- Natural pairing with MCP servers for tools/data
- Excellent for coding/analysis agents

**Tradeoffs:**
- Best experience assumes Claude as primary model
- Ecosystem moving fast — pin versions

**When:** Claude-first products; MCP-heavy tool landscapes; safety-sensitive assistants.

---

## 4. Vertex AI Agent Builder

**What it is:**
Google Cloud managed capabilities to design and deploy agents connected to enterprise data/tools inside GCP.

**Strengths:**
- IAM, VPC, enterprise admin controls
- Integration with Google data/AI stack
- Less infra DIY for platform teams already on GCP

**Tradeoffs:**
- Cloud lock-in
- Abstraction can hide failure modes — still need evals

**When:** GCP enterprise standard; need managed governance more than custom loops.

---

## 5. Google ADK (Agent Development Kit)

**What it is:**
Google’s agent development toolkit for composing agents/tools/workflows (often alongside Gemini / Google AI stack), aimed at developers who want code-first agent apps with shared primitives.

**Strengths:**
- Code-first composition
- Fits Google model ecosystem
- Useful multi-agent building blocks

**Tradeoffs:**
- Younger/faster-changing than classical web frameworks
- Portability outside Google stack varies

**When:** Building on Gemini + Google tooling with structured multi-agent code.

---

## Comparison Snapshot

| Approach | Control | Speed to demo | Lock-in | Best for |
|----------|---------|---------------|---------|----------|
| Manual | Highest | Medium | Lowest | Simple/critical paths |
| OpenAI Agents/AgentKit | Medium | Fast | OpenAI | OpenAI-standardized orgs |
| Claude Agent SDK | Medium | Fast | Anthropic | Claude + MCP |
| Vertex Agent Builder | Lower | Fastest (managed) | GCP | Enterprise GCP |
| Google ADK | Medium | Fast | Google | Gemini code-first agents |

---

## Decision Framework

1. **Start manual** until the loop is clear.
2. Adopt an **SDK** when session memory, tool plumbing, and team conventions hurt velocity.
3. Adopt a **managed builder** when platform/IAM compliance dominates.
4. Keep **interfaces thin**: tool schemas and MCP servers behind your own ports so swapping hosts is possible.
5. Always keep **evals + traces** outside the vendor magic (`10_MLOps` lessons).

---

## Anthropic Insider Angle

Frameworks accelerate demos; they do not remove agentic failure modes (loops, injection, irreversible actions). We care that teams using Claude agents still implement confirmations, least privilege, and trajectory evals.

MCP + Claude Agent patterns are powerful together: SDK for orchestration, MCP for integrations, your policy layer in the host.

---

## Common Misconceptions

**Misconception 1: "SDK = solved agents"**
You still design tools, context, and safety.

**Misconception 2: "Manual is unprofessional"**
Many production systems stay thin wrappers forever — that's fine.

**Misconception 3: "Must pick one forever"**
Strangler pattern: manual core + SDK for new surfaces is OK.

**Misconception 4: "Multi-agent requires a vendor platform"**
Message-passing supervisors work manually; platforms help at scale.

---

## Interview Questions

**Q1: Manual agent vs SDK kab choose karein?**

**Answer:** Manual when the task is simple, you need maximum transparency, or compliance forbids heavy frameworks. SDK when you want standard sessions/tools/guardrail helpers and your team standardizes on a vendor. Measure: if >50% of engineering time is glue (retries, session, tool wiring), an SDK likely pays off. Keep tool interfaces portable.

**Q2: OpenAI Agents vs Claude Agent SDK vs Vertex Builder?**

**Answer:** Choose primarily by model/cloud standard: OpenAI stack → OpenAI Agents/AgentKit; Claude/MCP-centric → Claude Agent SDK; GCP enterprise governance → Vertex Agent Builder. Google ADK fits Gemini code-first multi-agent apps. Evaluate lock-in, IAM needs, and how well traces/evals integrate — not marketing feature lists alone.

**Q3: Framework adopt karte waqt kya portable rakhein?**

**Answer:** Tool contracts (schemas), MCP servers, prompts/versioning, eval golden sets, and authZ policies. Avoid putting business logic only inside proprietary nodes you cannot export. Thin adapters around vendor runtimes.

**Q4: Multi-agent ke liye kaunsa approach?**

**Answer:** Start with a single agent. If parallelism/specialization needed, add a supervisor pattern manually or via ADK/SDK multi-agent primitives. Platforms help with ops; they don’t remove the need for sliced context and failure signaling (see `04_Multi_Agent_Systems.md`).

---

## Key Takeaways

- Manual loop is the foundation — learn it first
- SDKs: OpenAI Agents/AgentKit, Claude Agent SDK, Google ADK
- Managed: Vertex AI Agent Builder for GCP enterprises
- Choose by cloud/model standard + control needs
- Keep tools/MCP/evals portable; frameworks are adapters

---

*Module 09 complete! Agli module: `10_MLOps_and_Production` — phir Context Engineering (`14`) aur MCP (`15`) bhi schedule mein hain*
