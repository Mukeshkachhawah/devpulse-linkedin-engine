# MCP Kya Hai — AI Tools Ka USB Standard

> *"Har agent framework apna tool format laata tha. OpenAI ke functions, Claude ke tools, LangChain ke wrappers — same database connector teen baar likho. Model Context Protocol (MCP) ka promise simple hai: ek baar server banao, kai hosts/clients use karo. Yeh AI tooling ka USB-C moment hai — perfect nahi, lekin fragmentation kam karta hai."*

---

## Opening Hook — Connector Hell

Team A: Slack tool for OpenAI Agents.
Team B: Same Slack tool rewritten for a Claude desktop host.
Team C: Same again for an internal LangGraph agent.

Teen maintenance surfaces. Ek bug. Teen patches.

**MCP:** Write one Slack MCP server. Any MCP-compatible host can connect.

---

## What Is MCP?

**Model Context Protocol** — an open protocol (championed by Anthropic, adopted more broadly) for connecting AI applications (hosts) to external tools and data (servers) through a standard client interface.

**Analogy:**
- USB standardizes how devices talk to computers
- MCP standardizes how tools/resources talk to AI apps

**What it standardizes:**
- How tools are described and called
- How resources (readable data) are exposed
- How reusable prompts/templates can be shared
- How transports connect local and remote servers

---

## Why MCP Exists

1. **Interoperability:** Build once, reuse across hosts (IDE agents, chat apps, custom agents)
2. **Ecosystem:** Shared library of community servers (filesystem, GitHub, DBs, browsers)
3. **Clear security boundary:** Server process encapsulates credentials and side effects
4. **Separation of concerns:** Model vendors focus on reasoning; tool authors focus on integrations

Without MCP: N hosts × M tools = N×M integrations.
With MCP: N hosts + M servers = N+M integrations.

---

## MCP vs Plain Function Calling

| | Function calling | MCP |
|--|------------------|-----|
| Scope | One app’s tool schema | Cross-app protocol |
| Discovery | Hardcoded in app | Runtime list from servers |
| Reuse | Copy schemas | Connect existing servers |
| Process model | In-process functions common | Often separate server process |
| Data | Usually tools only | Tools + resources + prompts |

Function calling is still what the *model* does inside a turn.
MCP is how the *host application* obtains tools/resources to offer the model.

---

## Core Primitives

**Tools:** Actions with JSON schemas (search, create_issue, run_query).

**Resources:** Readable data URIs (files, tickets, schemas) the host can load into context.

**Prompts:** Reusable prompt templates served by the server.

Together these feed the **context layer** (Module 14).

---

## Where MCP Fits in an AI App

```
User ↔ Host app (IDE / chat / agent runtime)
         ↕ MCP Client
         ↕ Transport (stdio / HTTP / SSE, etc.)
         ↕ MCP Server (GitHub, DB, filesystem, ...)
              ↕ Real systems
```

The LLM sits inside the host: host decides which MCP tools to expose, executes calls, and packs results into context.

---

## Anthropic Insider Angle

MCP is Anthropic’s bet on an open tooling ecosystem around assistants like Claude. The strategic goal: Claude (and other hosts) should use the same servers enterprises already wire up — reducing lock-in at the *integration* layer even when models differ.

Important honesty: MCP does not magically solve permissions, evaluation, or prompt injection. It standardizes *connection*. Context security (Module 14) and production controls (later in this module) remain your job.

---

## Common Misconceptions

**Misconception 1: "MCP replaces LangChain / agents"**
It replaces ad-hoc tool wiring. Orchestration, memory, and planning still needed.

**Misconception 2: "MCP is only for Claude"**
Protocol is model-agnostic; any host can implement a client.

**Misconception 3: "Using MCP means data is safe"**
Servers still hold credentials; hosts must enforce allowlists and user consent.

**Misconception 4: "MCP = RAG"**
MCP can *expose* document resources; retrieval policy is still context engineering.

---

## Interview Questions

**Q1: MCP kya hai aur kyun bana?**

**Answer:** Model Context Protocol standardizes how AI hosts connect to external tools and data servers — like USB for AI integrations. It reduces N×M custom connectors to N hosts + M servers, enables an ecosystem of reusable servers, and separates tool implementation from model vendors. It defines tools, resources, and prompts over standard transports. It does not replace agent logic, RAG ranking, or security policy.

**Q2: Function calling aur MCP mein farq?**

**Answer:** Function calling is the model-facing mechanism to choose and parameterize tools in a single application. MCP is a cross-application protocol for discovering and invoking tools/resources from separate servers. Hosts often translate MCP tools into the function-calling format the model expects. Use plain functions for app-private logic; use MCP for shared/reusable integrations.

**Q3: MCP context engineering se kaise related hai?**

**Answer:** MCP servers are context sources. Resources and tool results enter the context layer, which must still filter, budget, isolate, and evaluate them. MCP is the pipe; context engineering is what you put through the pipe and how you govern it.

---

## Key Takeaways

- MCP = interoperability protocol for AI tools/data
- Build servers once; connect many hosts
- Primitives: tools, resources, prompts
- Complements — does not replace — agents, RAG, security
- Deep architecture next

---

*Agli file: `02_MCP_Architecture.md` — Host, Client, Server, Data, Transport*
