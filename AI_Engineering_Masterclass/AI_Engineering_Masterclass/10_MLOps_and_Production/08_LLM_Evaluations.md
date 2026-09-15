# LLM Evaluations — Deterministic, Model-Based, Human, Metrics

> *"Train accuracy wali duniya LLMs pe toot jaati hai. 'Sahi answer' subjective ho sakta hai, format matter karta hai, safety matter karti hai, aur RAG mein context alag fail ho sakta hai. Evaluation design AI engineer ki superpower hai — iske bina tum ship kar rahe ho vibe pe."*

---

## Opening Hook — The Metric That Lied

Team ships new prompt. Offline "win rate" vs GPT-4 judge: +8%.
Production thumbs-down: worse.

Why? Judge favored longer answers; users wanted short. Metric misaligned.

**Evals are only as good as their contract with product quality.**

---

## Evaluation Types

### 1. Deterministic Evals
Code checks with exact rules:
- Valid JSON / schema
- Required keywords present/absent
- Regex for IDs, dates
- Latency < threshold
- Tool sequence constraints (must call `search` before answer)
- Safety blocklists

**Pros:** Cheap, reliable, CI-friendly.
**Cons:** Miss semantic quality.

### 2. Model-Based Evals (LLM-as-judge)
Another model scores relevance, faithfulness, tone, toxicity.
Pairwise: A vs B preference.

**Pros:** Scales semantic judgment.
**Cons:** Judge bias, cost, needs calibration vs humans.

### 3. Human Evals
Experts rate samples on rubrics; side-by-side preferences; red-team sessions.

**Pros:** Gold standard for nuanced domains.
**Cons:** Slow, expensive; inter-rater variance.

### 4. Hybrid (production default)
Deterministic gates + sampled model judges + periodic human panels.

---

## Metrics That Matter

**Generation:** correctness, faithfulness, relevance, toxicity/refusal appropriateness, format compliance.

**RAG/context:** context precision/recall, citation validity (see Module 14 + RAGAS).

**Agents:** task success rate, steps-to-success, irreversible-action violations, tool precision/recall.

**Ops:** cost/task, p95 latency, regression rate on golden set.

---

## Tooling

| Tool | Role |
|------|------|
| **RAGAS** | RAG-centric metrics (faithfulness, answer relevance, context precision/recall) |
| **DeepEval** | Unit-test style LLM evals in CI; many metric helpers |
| **LangSmith** | Datasets, run evals on traces, compare versions |
| **Langfuse** | Scores on traces; self-host friendly |
| Custom scripts | Deterministic validators + domain rubrics |

Start: golden set + deterministic tests + one judge metric. Add RAGAS/DeepEval when RAG/agent complexity grows.

---

## Regression Testing for LLMs

Golden set of prompts with expected properties.
On every prompt/model/retriever change:
1. Run suite
2. Diff metrics vs baseline
3. Block merge on safety or hard regressions
4. Allow soft metric dips only with review

Behavioral examples: "must cite," "must refuse X," "JSON schema," "no PII echo."

Details of CI wiring: `06_CI_CD_for_ML.md`. This lesson is the *what* of eval design.

---

## Building a Judge Rubric

Bad: "Score 1-5 quality."
Good:
- Faithfulness 0/1 with definition
- Completeness checklist
- Tone pass/fail for brand
- Separate safety score

Show the judge few-shot graded examples.
Measure judge agreement with humans (Cohen's κ or simple %).

---

## Anthropic Insider Angle

Frontier evals mix automated batteries, red-teaming, and human preference. For application teams: steal the *discipline*, not the scale. A 200-example golden set with clear rubrics beats a vague "LLM score" on 10 prompts.

Also: evaluate **refusals** and **over-refusals**. A "safer" prompt that blocks legitimate support questions is a product regression.

---

## Common Misconceptions

**Misconception 1: "One overall score is enough"**
Split by failure mode and slice (language, intent, tenant).

**Misconception 2: "Judge model should be the same as prod model"**
Often use a strong judge; watch cost and shared blind spots.

**Misconception 3: "Offline evals replace online feedback"**
Distribution shifts; keep thumbs/escalations in the loop.

**Misconception 4: "DeepEval/RAGAS = strategy"**
Tools implement metrics; you still choose what "good" means.

---

## Interview Questions

**Q1: Deterministic vs model-based vs human evals?**

**Answer:** Deterministic: rule/code checks — fast, CI-stable, limited semantics. Model-based: LLM judges semantic quality — scalable, biased, needs calibration. Human: nuanced gold standard — expensive. Production systems combine all three: hard deterministic gates, model judges for semantic regression, humans for calibration and high-stakes domains.

**Q2: RAGAS aur DeepEval kab use karein?**

**Answer:** RAGAS when evaluating RAG pipelines with faithfulness and context metrics. DeepEval when you want unit-test style assertions in CI across general LLM behaviors. Neither replaces product-specific rubrics or human review. Use alongside golden sets and deterministic schema tests.

**Q3: Regression suite LLM ke liye kaise design karein?**

**Answer:** Curate golden prompts with expected constraints (format, must-include facts, refusals). Version it. Run on every change. Compare to baseline; block on safety/hard failures. Include adversarial and empty-retrieval cases. Track flaky judge tests separately from deterministic ones.

**Q4: LLM-as-judge fail kab karta hai?**

**Answer:** When rubrics are vague, when length/style biases dominate, when judge shares blind spots with the candidate model, or when domain expertise is required (medical/legal). Mitigate with explicit rubrics, few-shot graded examples, pairwise checks, and human calibration samples.

---

## Key Takeaways

- Four types: deterministic, model-based, human, hybrid
- Align metrics to product; split RAG/agent/gen metrics
- Tools: RAGAS, DeepEval, LangSmith, Langfuse
- Golden-set regression is mandatory for prompt/model changes
- Calibrate judges; watch online feedback

---

*Module 10 LLM track complete. Related: `07_LLM_Observability.md`, `06_CI_CD_for_ML.md`, `14_Context_Engineering/05_Context_Evaluation.md`*

*Agli module: `11_AI_Ethics_and_Safety`*
