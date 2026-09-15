# MCP in Production — Security, Permissions, When Not to Use

> *"MCP demo mein 'filesystem server connect' magic lagta hai. Production mein sawaal badal jaate hain: kaunse tools allow? Kaun user? Kaun tenant? Audit kahan? Injection ke baad bhi blast radius kitna? Yeh file production judgment sikhati hai."*

---

## Opening Hook — The Over-Permissioned Demo

Demo: MCP server with shell access + email send + DB admin.
Everyone claps.
Security team: "Turn it off."

Production MCP is mostly **permission design**, secondarily protocol.

---

## Security Controls Checklist

1. **Server allowlist** per environment (dev ≠ prod)
2. **Tool allowlist** inside each server (read-only prod by default)
3. **User consent / OAuth** for third-party systems
4. **Tenant isolation** in every handler
5. **Secrets stay in server env**, never in model context
6. **Output size limits** and PII redaction before context pack
7. **Human confirmation** for destructive/irreversible tools
8. **Audit logs**: who, which tool, args hash, result status, latency
9. **Rate limits** to stop agent loops burning money/APIs
10. **Incident kill switch** to disable a server globally

---

## Permissions Model

Think in layers:

| Layer | Example |
|-------|---------|
| Host policy | "Only GitHub + Notion servers" |
| User grants | OAuth scopes |
| Tool class | READ vs WRITE vs IRREVERSIBLE |
| Data ACL | Row/file level checks in server |
| Runtime | Step budgets, confirmations |

If any layer is missing, assume breach eventually.

---

## MCP vs Plain Function Calling — Decision Guide

**Prefer plain in-process functions when:**
- Tool is private to one app
- Ultra-low latency tight loop
- No reuse across hosts needed
- Simpler deployment than another process

**Prefer MCP when:**
- Multiple hosts should share the integration
- You want ecosystem / third-party servers
- Clear process isolation for credentials is valuable
- Partners should extend your agent without forking your app

**Hybrid (common):**
MCP for shared enterprise systems; local functions for app-specific glue.

---

## Operational Concerns

- **Versioning:** Server upgrades can break schemas; negotiate capabilities; changelog
- **Observability:** Trace host spans + server spans; correlate request IDs
- **SLOs:** Tool error rate, p95 latency per tool
- **Change management:** Treat tool schema changes like public API changes
- **Eval gates:** Golden trajectories that must still call the right tools after upgrades

---

## Failure Modes Specific to MCP

- Host connected to malicious/unreviewed community server
- Confused deputy: server uses broad token while model is user-scoped
- Schema drift between environments
- Tool result injection (treat as untrusted context — Module 14)
- Resource enumeration leaking file paths across users

---

## Anthropic Insider Angle

MCP increases *leverage* and *risk* together. The winning pattern we see: tightly scoped official servers, strong host allowlists, and treating every tool result with the same suspicion as web browsing.

Also: production teams should measure **tool precision** (did the agent call the right tool?) separately from answer quality — MCP makes that measurable if you log manifests.

---

## Common Misconceptions

**Misconception 1: "MCP server = trusted by default"**
Only as trusted as your review + scopes.

**Misconception 2: "Read-only servers are harmless"**
Reads can still exfiltrate sensitive data into chats/logs.

**Misconception 3: "More servers = better agent"**
More tools confuse models and expand attack surface. Curate.

**Misconception 4: "Protocol compliance means production-ready"**
Compliance ≠ ACL, multi-tenant safety, or cost controls.

---

## Interview Questions

**Q1: Production mein MCP harden kaise karein?**

**Answer:** Allowlist servers/tools; OAuth/user grants; tenant ACL in handlers; keep secrets server-side; limit output size/PII; confirm irreversible actions; audit every call; rate-limit; provide kill switch. Combine with context isolation so tool outputs cannot override system policy. Review third-party servers like dependencies.

**Q2: Kab MCP, kab plain function calling?**

**Answer:** Use MCP for reusable/shared integrations and process-isolated credentials across hosts. Use plain functions for private, in-app tools where reuse is unnecessary. Hybrid is normal. Decision drivers: reuse, isolation, operational complexity, latency.

**Q3: Confused deputy problem MCP mein?**

**Answer:** Server holds a powerful credential and performs actions the end user shouldn't amplify. Mitigate with per-user tokens when possible, downscoped service accounts, authorization checks against the invoking user, and avoiding god-mode servers. Host identity must flow into server authZ decisions.

**Q4: MCP ke baad bhi prompt injection kyun relevant hai?**

**Answer:** Because tool/resource payloads enter the model context. A webpage or ticket fetched via MCP can embed instructions. Protocol plumbing does not neutralize hostile content. Apply Module 14 defenses regardless of MCP.

---

## Key Takeaways

- Production MCP = permissions + audit + scoped servers
- Curate tools; don't connect everything
- Hybrid MCP + local functions is common
- Schema changes are API changes
- Protocol ≠ safety

---

*Module 15 complete! Related: `14_Context_Engineering/`, `09_AI_Agents/02_Tools_and_Functions.md`*

*Agli practical track: Agents SDKs + MLOps observability (`09` / `10`)*
