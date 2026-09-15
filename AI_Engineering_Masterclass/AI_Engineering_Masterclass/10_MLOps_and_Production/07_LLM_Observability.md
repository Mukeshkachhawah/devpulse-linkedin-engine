# LLM Observability — Traces, Cost, Latency, Production Eyes

> *"Classical monitoring poochta hai: server up hai? Error rate kitni hai? LLM observability poochta hai: is request ne kaunse tools call kiye? Kitne tokens? Kaunsa prompt version? Retrieval mein kya aaya? Kahan slow hua? Bina traces ke agent debug karna andhere mein haath maarne jaisa hai."*

---

## Opening Hook — The 12-Second Answer

User complains: "Bot is slow."
Infra dashboard: CPU fine, p50 latency "OK."

Reality in a trace:
- Retrieval: 200ms
- Rerank: 150ms
- LLM TTFT: 900ms
- Three tool calls in a loop: 9s
- User waited on a pointless retry

Without span-level observability, you optimize the wrong layer.

---

## What LLM Observability Adds

Beyond uptime:
1. **Tracing** — nested spans for retrieval, tools, LLM calls, retries
2. **Logging** — prompts/versions, context manifests, outputs (with redaction)
3. **Cost monitoring** — tokens × price per feature/tenant
4. **Latency breakdown** — TTFT, TPOT, tool time, queue time
5. **Quality signals** — feedback, judge scores, safety flags
6. **Production monitoring** — drift in prompt length, tool mix, error classes

Deep classical drift/infra content: `03_Model_Monitoring.md`.
This lesson focuses on **LLM-native** observability.

---

## Tracing and Logging

**Trace:** One user request end-to-end.
**Span:** A step (embed, search, LLM, tool).

Log per span:
- Name, start/end, status
- Model id, prompt version
- Token in/out
- Tool name + sanitized args
- Retrieved doc IDs (not always full text)
- Error type

**Redaction:** Strip secrets, PII before storage. Traces are a compliance surface.

---

## Cost and Latency Monitoring

**Cost metrics:**
- $ / day by endpoint
- $ / successful task
- Cache hit savings
- Top costly traces

**Latency metrics:**
- TTFT (time to first token)
- Total wall time
- % time in tools vs model
- p95/p99 by route

Alert when: cost/request jumps after a prompt change; tool loops explode step counts.

---

## Tooling Landscape

| Tool | Strength |
|------|----------|
| **LangSmith** | LangChain-native traces, datasets, eval runs |
| **Langfuse** | Open-source-friendly LLM tracing/evals, self-host option |
| **Helicone** | Proxy-style observability for LLM HTTP APIs; cost/latency |
| **Arize AI** | Broader ML + LLM monitoring, drift and prod analytics |

Pick based on stack:
- Heavy LangChain → LangSmith or Langfuse
- Raw OpenAI/Anthropic HTTP → Helicone-style proxy or OpenTelemetry
- Enterprise ML platform already on Arize → extend it

You can combine: Helicone for API metrics + Langfuse for app traces.

---

## Production Monitoring Practices

1. Sample 100% of errors; sample N% of successes for deep payload logs
2. Correlate traces with release version / prompt SHA
3. Dashboard: traffic, cost, TTFT, tool error rate, thumbs-down rate
4. On-call playbooks for cost spikes and agent loop storms
5. Retain traces per policy; encrypt at rest

---

## Anthropic Insider Angle

At scale, the rare failure is only findable if traces exist. "Claude gave a bad answer" becomes actionable when you can see the exact context pack and tool sequence.

We also watch **safety telemetry** as first-class: refusal rates, jailbreak-like patterns, anomalous tool use after external fetches. Observability is part of the safety system, not only SRE.

---

## Common Misconceptions

**Misconception 1: "API provider dashboard is enough"**
It lacks your retrieval/tool spans and prompt versions.

**Misconception 2: "Log full prompts forever"**
Privacy, cost, and leak risk. Redact + sample + retain thoughtfully.

**Misconception 3: "Observability = evaluation"**
Observability watches production. Evaluation judges quality (next lesson). You need both.

**Misconception 4: "Open source means zero ops"**
Self-hosted Langfuse still needs storage, auth, and retention design.

---

## Interview Questions

**Q1: LLM observability classical monitoring se kaise alag hai?**

**Answer:** Classical monitoring covers infra health and basic latency/errors. LLM observability adds token/cost accounting, prompt/version lineage, retrieval and tool spans, context manifests, and quality/safety signals. Agents require nested traces because most wall time and failures hide in tool loops, not CPU graphs.

**Q2: LangSmith, Langfuse, Helicone, Arize — kab kaun?**

**Answer:** LangSmith: deep integration with LangChain/LangGraph workflows and eval datasets. Langfuse: flexible tracing/evals, strong self-host story. Helicone: quick wins via API proxy for cost/latency/logging on provider calls. Arize: when you want unified ML+LLM monitoring and drift analytics. Choose by existing stack; combining proxy metrics with app-level traces is common.

**Q3: Cost spike kaise debug karein?**

**Answer:** Break down $ by route and model; inspect traces for longer prompts, higher k retrieval, lost caching, or agent step explosions. Diff prompt SHA and context budget vs last week. Set alerts on $/request and steps/trace, not only monthly bill.

**Q4: Tracing mein kya log na karein?**

**Answer:** Raw secrets, full unrestricted PII, complete customer documents when IDs suffice, and unnecessary high-cardinality payloads. Prefer doc IDs + hashes; store full text in controlled evidence stores when legally required.

---

## Key Takeaways

- Traces > only uptime for LLM/agent systems
- Monitor cost, TTFT, tool loops, prompt versions
- Tools: LangSmith, Langfuse, Helicone, Arize — pick for stack
- Redact; sample; retain with policy
- Pair with evals lesson next

---

*Agli file: `08_LLM_Evaluations.md` — Deterministic, model-based, human evals*

*Related: `03_Model_Monitoring.md`, `14_Context_Engineering/05_Context_Evaluation.md`*
