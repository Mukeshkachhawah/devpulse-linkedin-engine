# Building MCP Server and Client — Conceptual Walkthrough

> *"Docs padhke 'architecture' yaad rakhna easy hai. Interview aur real work mein poochte hain: server kaise sochke banate ho? Client host mein kahan hook hota hai? Local kaise connect? Remote kaise? Yeh file theory-first build checklist hai — bina full codebase dump ke."*

---

## Opening Hook — One Useful Server

Don't start with "platform."
Start with one job: **read company runbooks from a folder and search them.**

If you can expose that as an MCP server and consume it from a host, you understand 80% of MCP in practice.

---

## Building an MCP Server — Steps

### Step 1: Choose the job and boundary
- What tools? What resources?
- What backends? (disk, API, DB)
- What must never be exposed?

### Step 2: Define tool schemas
For each tool:
- Name, description (model-facing clarity matters)
- JSON Schema for arguments
- Error shapes (not found, auth failed, validation)

Bad descriptions → model mis-calls tools (same as Module 09 tools lesson).

### Step 3: Define resources
- URI scheme
- List / read semantics
- Optional subscribe/updates if needed

### Step 4: Implement handlers
- Validate inputs
- Call backend with scoped credentials
- Return structured content
- Timeouts and size limits (don't return 50MB blobs blindly)

### Step 5: Wire transport
- Local: stdio entrypoint for desktop hosts
- Remote: authenticated HTTP/streaming endpoint

### Step 6: Package and document
- How to install
- Required env vars
- Permission implications for users

### Step 7: Test without the LLM first
Unit-test tool handlers.
Then integration-test via a simple MCP client CLI.
Only then plug into a full host + model.

---

## Building / Integrating an MCP Client — Steps

Usually you **use** a host that already has a client (Claude Desktop, Cursor, etc.).
If you build a host:

1. Config: list of servers (command for stdio, URL for remote)
2. On session start: connect + initialize + list capabilities
3. Translate tools → model tool definitions
4. On model tool call: dispatch to correct server; await result
5. Insert result into context; continue loop
6. Handle disconnects, retries, partial failure
7. Enforce host policies (tool allowlist, confirmation)

---

## Connect to a Local Server

Pattern:
- Host config points to a command: `node my-server.js` or `python -m my_server`
- Host spawns process
- Client speaks MCP over stdio
- Lifecycle tied to host session

**Good for:** filesystem, local DB tunnels, developer machines.

**Watch for:** PATH issues, env vars, sandbox permissions, zombie processes.

---

## Connect to a Remote Server

Pattern:
- Server deployed as internal service
- Client connects with auth (token/mTLS)
- Shared by many users/hosts
- Central logs

**Good for:** company knowledge bases, ticket systems, shared browsers.

**Watch for:** SSRF if server can fetch URLs; tenant isolation; token leakage into model context.

---

## Design Checklist for Tool Quality

- Descriptions include *when to use* and *when not to use*
- Arguments constrained (enums, max lengths)
- Idempotent tools marked clearly when retries happen
- Destructive tools named obviously (`delete_`, `send_`)
- Pagination for list endpoints
- Stable IDs returned for follow-up tool calls

---

## Minimal Example Shape (Pseudocode)

```
Server:
  tools = [search_runbooks(query), get_runbook(id)]
  resources = [runbook://{id}]

  on search_runbooks(query):
    validate(query)
    return ranked_summaries

  on get_runbook(id):
    authorize(user, id)
    return markdown_body

Host client:
  connect(stdio: run server)
  tools = list_tools()
  expose_to_model(tools)
  when model calls get_runbook:
    result = call_tool(...)
    append_to_context(as UNTRUSTED_OR_INTERNAL labeled block)
```

Theory course: focus on this shape, not a specific SDK version.

---

## Anthropic Insider Angle

The highest-leverage skill when "building MCP" is **tool interface design**, not protocol trivia. Clear schemas and tight permissions determine whether Claude (or any model) uses the server correctly.

Also: test servers with adversarial arguments and oversized inputs. Protocol correctness ≠ production readiness.

---

## Common Misconceptions

**Misconception 1: "I must build a client from scratch"**
Most engineers build servers and configure existing hosts.

**Misconception 2: "If list_tools works, we're done"**
Failure modes show up in multi-step agent loops and large payloads.

**Misconception 3: "Remote is always better"**
Remote adds auth and latency; local is fine for personal tooling.

**Misconception 4: "One mega-server for everything"**
Prefer small servers with clear domains (FS, GH, DB) for blast-radius control.

---

## Interview Questions

**Q1: MCP server banane ka high-level flow?**

**Answer:** Define job boundary → design tool/resource schemas with clear descriptions → implement validated handlers with scoped credentials → choose transport (stdio local vs authenticated remote) → package/docs → test handlers and MCP session without LLM → integrate into host → evaluate with real agent traces. Emphasize schema quality and least privilege.

**Q2: Local vs remote connect tradeoffs?**

**Answer:** Local stdio: simple, user-scoped, low latency, weaker central governance. Remote: shared, auditable, scalable, needs strong authn/authZ and network security. Enterprises often mix both.

**Q3: Host mein client integration ke critical points?**

**Answer:** Server allowlisting, capability discovery, schema translation to the model, tool dispatch, context packing of results, confirmations for destructive tools, timeouts/retries, and logging manifests for evals. The host remains accountable for user safety.

**Q4: Pehle LLM ke bina kyun test karein?**

**Answer:** Isolates server bugs from model nondeterminism. If handlers fail deterministically, fix before blaming prompting. Saves cost and debug time.

---

## Key Takeaways

- Start with one narrow server job
- Schema/description quality is the product
- Test handlers → MCP session → full host+LLM
- Local stdio vs remote = deployment choice
- Prefer small single-domain servers

---

*Agli file: `04_MCP_in_Production.md` — Security, permissions, vs function calling*
