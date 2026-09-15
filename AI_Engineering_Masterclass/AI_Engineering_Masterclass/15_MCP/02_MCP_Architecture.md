# MCP Architecture — Host, Client, Server, Data, Transport

> *"MCP samajhne ke liye paanch pieces yaad rakho: Host (AI app), Client (protocol speaker inside host), Server (tool/data provider), Data layer (tools/resources/prompts), Transport layer (kaise bytes move hote hain). Confusion tab aata hai jab log 'MCP' bolke sirf server samajhte hain."*

---

## Opening Hook — Restaurant Model

- **Host:** Restaurant (Claude Desktop, Cursor, your agent service)
- **Client:** Waiter who speaks the house protocol
- **Server:** Kitchen stations (grill, bakery) — each a specialist
- **Data layer:** Menu items (tools), pantry inventory lists (resources), recipe cards (prompts)
- **Transport:** How orders travel (walk to kitchen vs phone to ghost kitchen)

Same menu language → many kitchens plug in.

---

## 1. MCP Host

The AI-powered application the user interacts with.

Examples: IDE agent, chat desktop app, company agent platform.

**Host responsibilities:**
- UX and authn of the end user
- Policy: which servers are allowed
- Orchestrating the LLM
- Mapping MCP tools → model tool/function interface
- Assembling context from resources/tool results
- Enforcement: confirmations, logging, rate limits

Host is the *security and product owner*.

---

## 2. MCP Client

Component **inside the host** that speaks MCP to one or more servers.

**Client responsibilities:**
- Initialize connection / handshake
- Negotiate capabilities
- List tools, resources, prompts
- Invoke tools; read resources
- Handle errors, timeouts, cancellations

One host may run multiple clients (one per server connection).

---

## 3. MCP Server

Separate process or service exposing capabilities.

Examples: filesystem server, Postgres server, GitHub server, Slack server, browser server.

**Server responsibilities:**
- Implement tools/resources/prompts
- Hold credentials to backend systems (ideally)
- Validate inputs; enforce its own authZ where applicable
- Return structured results / errors

Servers should be least-privileged toward backends.

---

## 4. Data Layer

What moves *semantically* over MCP:

### Tools
Callable operations with JSON Schema parameters.
Side effects possible (write, send, delete).

### Resources
Addressable read-only (or read-mostly) data.
Host may pull into context without a "tool call" framing.
Examples: `file://...`, ticket URIs, schema docs.

### Prompts
Parameterized templates the server offers (e.g., "deep code review").
Host can present them as slash-commands / workflows.

**Design tip:** Prefer resources for large readable context; tools for actions and queries with arguments.

---

## 5. Transport Layer

How client and server exchange protocol messages.

Common patterns (conceptual):
- **Local stdio:** Host spawns server as subprocess; communicate via stdin/stdout. Great for desktop/IDE.
- **Remote HTTP / streaming transports:** Server runs elsewhere; client connects over network. Needed for shared enterprise services.

Transport concerns:
- Latency and reliability
- Authn between client and remote server
- Sandboxing local servers
- Versioning and capability negotiation

Data layer semantics stay stable; transport varies by deployment.

---

## Sequence — Typical Tool Call

```
User asks host to "create a GitHub issue"
Host → LLM with MCP-derived tool schemas
LLM returns tool call { name, arguments }
Host client → MCP server: tools/call
Server → GitHub API
Server → client: result
Host packs result into context
LLM → final user answer
```

---

## Local vs Remote Topology

**Local:**
- Low latency, easy secrets on machine, user-scoped
- Harder to share across team centrally

**Remote:**
- Central governance, shared audit, scalable
- Needs strong authn/authZ, network controls

Enterprises often mix: local filesystem server + remote company data server.

---

## Anthropic Insider Angle

Architecture clarity matters for safety reviews: *which process holds tokens?* Ideally the MCP server holds GitHub PATs, not the model prompt. The host should see tool results, not necessarily raw long-lived secrets.

Capability negotiation at connect time lets hosts degrade gracefully when a server lacks a feature — better than assuming every server is identical.

---

## Common Misconceptions

**Misconception 1: "Host and client are the same thing"**
Host is the product; client is the protocol module inside it.

**Misconception 2: "Server includes the LLM"**
LLM lives in the host. Server is tools/data.

**Misconception 3: "Resources are just tools with no args"**
Resources are for addressable data fetch/subscribe patterns; tools are actions. Different UX and caching implications.

**Misconception 4: "Transport choice is cosmetic"**
It changes security, deployment, and multi-user sharing dramatically.

---

## Interview Questions

**Q1: MCP ke main components explain karo.**

**Answer:** Host: user-facing AI app that owns policy and LLM orchestration. Client: in-host protocol speaker managing connections and calls. Server: exposes tools/resources/prompts and talks to real systems. Data layer: semantic primitives (tools, resources, prompts). Transport layer: stdio/local or remote network channels carrying protocol messages. Understanding the split prevents conflating product security (host) with integration logic (server).

**Q2: Tools vs resources?**

**Answer:** Tools are parameterized actions that may have side effects and are typically mediated like function calls. Resources are readable data addresses the host can load into context. Use tools for "search issues with query Q" or "create issue"; use resources for "contents of file X" or "schema of table Y." Mixing them carelessly blurs caching and permission models.

**Q3: Local stdio vs remote transport kab?**

**Answer:** Local stdio: desktop/IDE, single-user, tight loop, machine-local secrets. Remote: shared enterprise data, centralized audit, multiple hosts. Remote needs mutual auth and network hardening. Many systems use both.

**Q4: Security boundary kahan hai?**

**Answer:** Primary boundaries: (1) User authn to host. (2) Host policy allowlisting servers/tools. (3) Client↔server auth for remote. (4) Server↔backend credentials. (5) Treating tool outputs as untrusted context. Compromising a server is serious — scope its credentials narrowly.

---

## Key Takeaways

- Five pieces: Host, Client, Server, Data, Transport
- LLM lives in the host
- Data layer = tools + resources + prompts
- Transport = local vs remote deployment choice
- Host owns product security policy

---

*Agli file: `03_Building_MCP_Server_and_Client.md` — Conceptual build steps*
