# Model Monitoring — Production Mein AI Ki Health Check

> *"Yaar, ek cheez jo sabse zyada miss hoti hai production systems mein: monitoring. Log model deploy karte hain, celebrate karte hain, aage badh jaate hain. 3 mahine baad model quietly fail ho raha hota hai. Users complain karte hain. Tum nahi jaante kya galat hua. Proper monitoring ka matlab hai: Tum PEHLE jaante ho, users BAAD mein. Yahi professional aur amateur ML engineering mein difference hai."*

---

## Opening Hook — The Silent Failure

A fintech company deployed a credit risk model. Accuracy: 87%.
They deployed. They moved on. No monitoring.

8 months later:
• Bad loan rate: Up 23%.
• Noticed only because CFO reviewed quarterly report.
• Investigation: Model was missing a data source for 8 months. A database migration broke the feature pipeline.
• Feature "days_since_payment" was returning NULL for all users.
• Model: Treating everyone as "no payment history" → low risk → approving risky applicants.

**The model was "serving" for 8 months. No errors. No alerts. Just quietly approving bad loans.**

This is a real failure pattern. Monitoring would have caught it day 1.

---

## Why Model Monitoring Is Different

**Software monitoring:**
Server up/down? ✓ / ✗ — Binary.
Error rate? Percentage of exceptions.
Latency? Time for response.
If all systems green: Software is working.

**Model monitoring adds:**
Model green (serving) ≠ Model correct (quality).
Model can be technically serving but:
Producing wrong predictions.
Silently degrading.
Missing on subpopulations.
No error thrown. No exception. Just wrong output.

**The types of failures:**
Technical failure: Server down, error thrown. Easy to detect.
Model failure: Predictions wrong. Hard to detect without monitoring.

---

## The Three Pillars of Model Monitoring

### Pillar 1: Infrastructure Monitoring

**The table stakes. Must have.**

**Metrics to monitor:**
Availability: % of time model is responding.
Latency: P50, P95, P99 response times.
Throughput: Requests per second.
Error rate: % of requests returning errors.
Resource usage: CPU, memory, GPU utilization.

**Tools:**
Prometheus: Metrics collection.
Grafana: Dashboard visualization.
Datadog, New Relic: Managed APM (Application Performance Monitoring).
Kubernetes health checks: Pod restarts, node health.

**Alerts:**
Error rate > 5% → PagerDuty alert.
P99 latency > 5 seconds → Alert.
CPU > 90% → Scale up.

**This is standard DevOps monitoring extended to ML services.**

### Pillar 2: Data/Model Monitoring

**The ML-specific layer. Harder to set up but critical.**

**Input monitoring (data drift detection):**
Monitor: Distribution of input features in production.
Compare to: Distribution during training.
If diverged: Data drift. Model may be unreliable.

**Statistical tests for drift:**
Kolmogorov-Smirnov (KS) test: Compares two distributions. For continuous features.
Population Stability Index (PSI): Commonly used in credit risk. Measures magnitude of shift.
Chi-square test: For categorical features.
Jensen-Shannon divergence: Symmetric measure of distribution similarity.

**Output monitoring (prediction drift):**
Monitor: Distribution of model predictions/scores.
Sudden shift in score distribution = something wrong.
Example: Model suddenly predicting "high risk" for everyone → feature issue.

**Model performance monitoring (requires labels):**
Direct accuracy measurement: Get ground truth labels → Compare to predictions.
Challenge: Labels often delayed (click-through: days, fraud: weeks, churn: months).
Approximate metrics: Use proxy labels where direct labels unavailable.

### Pillar 3: Business Metrics Monitoring

**The metric you actually care about.**

**Examples:**
Customer service AI: Customer satisfaction score, resolution rate.
Recommendation system: Click-through rate, purchase rate.
Fraud detection: Bad loan rate, fraud missed rate.
Content moderation: Harmful content rate, false positive rate.

**Why track separately:**
Infrastructure metrics green + model metrics green ≠ business goal achieved.
Need to tie model to business outcomes.

**Connecting model metrics to business metrics:**
Model accuracy UP → Business metric UP: Good.
Model accuracy UP → Business metric FLAT: Model not aligned with goal.
Model accuracy DOWN → Business metric UP: Maybe different success definition needed.

---

## Monitoring for LLMs — Different Challenges

**LLM monitoring requires different approaches:**

### Traditional Metrics (Still Applicable)
Latency, throughput, error rate: Same as any model.
Token usage: Input + output tokens (directly affects cost).
Cost per request: Must monitor for budget.

### LLM-Specific Metrics

**Output quality:**
Classical: Right/wrong classification.
LLM: Is this response helpful? Accurate? Safe?
Hard to measure automatically.

**Approaches to LLM output quality monitoring:**
(1) Human sampling: Sample 1-5% of production outputs. Human reviewers rate quality. Statistical estimate of overall quality.
(2) LLM-as-judge: Use another LLM to evaluate responses. "On a scale 1-5, how helpful is this response?" Automated but not perfect — LLMs have biases.
(3) Rule-based heuristics: Check specific patterns. Responses too long/short? Contains forbidden phrases? Specific format violated?
(4) User feedback signals: Thumbs up/down. "Was this helpful?" Explicit feedback from users.
(5) Downstream metrics: Did user follow up with the same question (suggests dissatisfaction)? Did user complete the task they were trying to do?

**Hallucination monitoring:**
Fact-checking against ground truth database.
Claim extraction + verification pipeline.
Hard to automate fully. Best approaches: Sample + human review.

**Safety monitoring:**
Monitor for: Harmful content generation, policy violations, jailbreak attempts.
Automated classifiers for: Toxicity, explicit content, sensitive topics.
Log and alert on: Refused responses, safety interventions.

**Prompt injection monitoring:**
Log cases where model behavior changes unexpectedly.
Monitor for: Unusual instruction patterns in inputs.
Track: Refusal rates (sudden spike may indicate injection attempts).

---

## Setting Up a Monitoring Dashboard

**What a production ML/LLM monitoring dashboard should show:**

**Summary health:**
Overall system status (green/yellow/red).
Active alerts.
Last 24 hours: Request volume, error rate, latency.

**Request metrics:**
Request rate over time.
Latency distribution (P50, P95, P99).
Error breakdown by type.

**Model quality:**
If labeled data available: Rolling accuracy/F1.
Prediction distribution over time.
Data drift scores.

**Business metrics:**
Whatever you actually care about.
Customer satisfaction, task completion, conversion.

**Cost (for LLMs):**
Total token usage.
Cost per day/week.
Cost per request average.
Trajectory (is cost growing unexpectedly?).

---

## Drift Detection Deep Dive

**Data drift is the #1 cause of silent model degradation.**

**Types of drift:**

**Covariate shift (input drift):**
Input feature distribution changes.
Model output may be unreliable.

**Prior probability shift:**
Class distribution changes.
More spam than before. Fraud rate changes.

**Concept drift:**
Relationship between features and labels changes.
Model trained on old relationship is now wrong.

**Virtual drift:**
Input distribution changes but relationship to labels doesn't.
Model still correct but drift is detected.
May trigger unnecessary retraining.

**Drift detection methods:**

**Statistical tests (per-feature):**
Run KS test or PSI on each feature.
If score exceeds threshold: Feature is drifted.
Aggregate: How many features are drifted?

**Multivariate drift:**
Test whole input distribution (not per-feature).
Domain Classifier approach: Train classifier to distinguish training vs production samples. If classifier performs well → distributions are different (drift).

**Tools:**
Evidently AI: Open source. Best-in-class for ML monitoring.
WhyLogs: Lightweight data logging and drift detection.
Arize AI: Commercial. Good for LLMs too.
Gantry: LLM-focused monitoring.

---

## Alerting and Response

**Monitoring without action is just dashboards.**

**Alerting principles:**

**Don't alert on everything:**
Alert fatigue: Too many alerts → teams start ignoring them.
Only alert on: Actionable conditions. What can you do about this?

**Alert levels:**
Critical: Service down, error rate > X%. Page on-call. Immediate response.
Warning: Performance degrading, drift detected. Notify team. Investigate in next sprint.
Informational: Quality trend negative. Review in next planning cycle.

**Response playbooks:**
When alert fires: What do you do?
Error rate spike: Check recent deployments. Check external dependencies. Roll back if deployment was recent.
Drift detected: Investigate data source. Is feature pipeline working? Retrain with new data.
Quality degradation: Check recent prompt changes. Check model version. Sample outputs for review.

**SLOs (Service Level Objectives):**
Define what "acceptable" looks like before incidents.
Availability SLO: 99.9% uptime.
Latency SLO: P99 < 3 seconds.
Quality SLO: User satisfaction > 4.2/5.
When SLO breached: Escalate.

---

## Anthropic Insider Angle

Monitoring Claude in production at scale is one of the most technically interesting challenges. The scale makes it unique.

**What we monitor for Claude:** At the system level: Standard infrastructure metrics. At the model level: Safety violations, refusal rates, response quality sampling, user satisfaction signals. The challenge: Millions of queries per day. Can't review all. Must sample intelligently. What do you sample? Potentially problematic responses. Unusual refusals. User-reported issues. Random sample for baseline quality.

**The hallucination detection challenge:** One of the hardest monitoring problems for LLMs is detecting hallucinations at scale. For factual domains (medical, legal, financial), this matters enormously. Current best approach: (1) Domain-specific fact databases. (2) Claim extraction pipeline. (3) Verification against ground truth. But building this for every domain is expensive. This remains an unsolved problem for general-purpose monitoring.

**Safety monitoring as a first-class concern:** For Claude, safety monitoring is as important as quality monitoring. We track: How often is Claude refusing requests? Are the refusals appropriate? What's the rate of harmful content generation? Are jailbreak attempts succeeding? This informs both product decisions and future training.

**The feedback loop:** The most valuable monitoring output is feeding back into training. Production failures → human-labeled data → training examples. This closed loop is how we continuously improve Claude. Building this feedback mechanism is harder than setting up monitoring itself.

---

## Common Misconceptions

**Misconception 1: "Green infrastructure metrics = model is working"**
Model can serve without errors while producing wrong predictions. Must monitor model quality, not just infrastructure.

**Misconception 2: "Monitoring is set-and-forget"**
Thresholds need updating as business evolves. Alert conditions need reviewing. New metrics added as new failure modes discovered. Monitoring is ongoing maintenance.

**Misconception 3: "LLM quality can be fully automated"**
Current automated metrics (BLEU, BERTScore, LLM-as-judge) are imperfect. Human evaluation for sample remains important. Automate what you can. Sample + human review for the rest.

**Misconception 4: "Drift detection triggers automatic retraining"**
Drift = input distribution changed. Not always = model needs retraining. Sometimes: Distribution change doesn't affect model performance. Drift detection → investigate → decide whether to retrain. Don't auto-retrain blindly.

---

## Interview Questions

**Q1: Model monitoring ke three pillars kya hain? LLMs ke liye kaise different hai?**

**Answer:** Three pillars: (1) Infrastructure monitoring: Availability, latency, throughput, error rate, resource usage. Same as any service. Tools: Prometheus, Grafana, Datadog. (2) Data/model monitoring: Input drift detection. Output prediction monitoring. Performance metrics (if labels available). ML-specific. Tools: Evidently AI, Arize, WhyLogs. (3) Business metrics monitoring: What you actually care about. Satisfaction, conversion, fraud rate. Ties model to business outcomes. LLM differences: Infrastructure: Same + add token usage, cost per request. Data/model: Quality is subjective. Hard to automate. Approaches: LLM-as-judge, human sampling, user feedback signals. Business: Harder to attribute — did the LLM cause the business outcome? Safety: Additional dimension. Harmful content rate, refusal rate, jailbreak attempts. Unique challenge: Classical model right/wrong. LLM: Right/wrong/harmful/misleading/hallucinated. Multiple quality dimensions.

**Q2: Data drift kya hai? Kaise detect karein?**

**Answer:** Data drift: Production input distribution diverges from training distribution. Model may produce unreliable predictions. Types: Covariate shift (input distribution), concept drift (feature-label relationship), prior probability shift (label distribution). Detection methods: (1) Per-feature statistical tests: KS test (continuous features). Chi-square test (categorical). PSI (Population Stability Index): Especially used in finance. Each feature: Compare training distribution vs production distribution. If test statistic > threshold → drift for that feature. (2) Aggregate drift score: How many features drifted? If >X% features drifted → model drift alert. (3) Domain classifier: Train classifier: "Is this sample from training or production?" If classifier achieves high accuracy → distributions are significantly different. (4) Prediction drift: Monitor output distribution. If prediction distribution shifts significantly: Something changed. (5) Tools: Evidently AI: Best open source. Generates drift reports automatically. Whylogs: Lightweight, embeds in pipeline. Usage: Run monitoring on samples (not every request). Daily or hourly comparison to training baseline. Alert when drift score > threshold.

**Q3: LLM output quality kaise monitor karein production mein?**

**Answer:** Challenge: LLM quality is subjective. Classical automation insufficient. Approaches: (1) Human sampling: Sample 1-5% of production responses. Human reviewers rate: Helpfulness, accuracy, safety (1-5 scale). Aggregate score tracks quality trend. Statistical: 100 samples → statistically meaningful estimate of overall quality. (2) LLM-as-judge: Automated. Faster. Use frontier model (Claude, GPT-4) as evaluator. Prompt: "Rate this response on helpfulness (1-5) and accuracy (1-5)." Limitations: LLMs have biases. Can miss subtle errors. Useful as one signal, not ground truth. (3) User feedback signals: Thumbs up/down. Completion rate (did user finish their task?). Follow-up questions (same question again = unsatisfied). Implicit: Did user convert/complete desired action? (4) Rule-based: Format compliance: Is output in expected format? Length: Too short (unhelpful) or too long (not following constraints)? Forbidden content: Contains phrases it shouldn't? (5) Downstream task success: If LLM is part of larger pipeline: Does the overall pipeline succeed? Practical approach: All of the above. Different signals catch different quality issues. Dashboard combining: LLM-as-judge score, user satisfaction, format compliance, human sample rate.

**Q4: Alerting strategy kaise design karein? Alert fatigue kaise avoid karein?**

**Answer:** Alert fatigue problem: Too many alerts → team ignores them → critical alerts missed. Alert design principles: (1) Actionable only: Alert must require action. If no action possible → not an alert. Informational → dashboards, not alerts. (2) Severity levels: Critical: Immediate response needed. Error rate > X%. Service down. Page on-call. Warning: Investigate in 24 hours. Drift above threshold. Performance degrading. Informational: Review in next sprint. Negative quality trend. (3) Right thresholds: Too sensitive → false positives → fatigue. Too lenient → real issues missed. Tune based on historical data. What would have triggered vs what was actually a problem? (4) Correlation and grouping: Multiple symptoms of same incident → one alert, not 10. Alert: "System issue detected: error rate up, latency up, CPU up." Not three separate alerts. (5) Playbooks: Every alert has a playbook: What does this alert mean? What do you check first? What are likely causes? What's the fix? Reduces time-to-resolution. (6) On-call rotation: Not everyone gets all alerts. Route to right person. ML quality → ML team. Infrastructure → DevOps. SLOs: Define acceptable. Alert only when SLO breached. Not on every dip.

**Q5: Model performance degradation kaise debug karein?**

**Answer:** Systematic debugging approach: (1) When did it start? Check time-series charts: When did metric start degrading? Correlate with: Code deployments, data pipeline changes, external events. (2) What changed? Recent code deployments. Data source changes. Feature pipeline changes. Model version changes. Infrastructure changes. New use cases / user segments? (3) Slice the data: Is degradation uniform or in a segment? By user type, geography, feature, time of day? If one slice affected: Points to specific cause. (4) Feature analysis: Check feature distributions. Are any features showing unusual values? NULLs where there shouldn't be? Out-of-range values? Frozen (same value for everything = pipeline issue)? (5) Prediction analysis: Sample predictions. Manual review. What's different about wrong predictions? Pattern in errors? (6) Compare to last working version: If using model registry: What changed between last good model and current? Data version? Hyperparameters? (7) Shadow testing: Deploy previous model version in shadow mode. Compare predictions. If previous model better → rollback candidate. Most common root causes: Feature pipeline broken (data source changed, NULL values). Distribution shift (new user segment, product change). Code bug introduced. External API change. Data labeling issue.

**Q6: Cost monitoring LLMs ke liye kaise karein?**

**Answer:** Why cost monitoring critical: LLMs: Expensive. GPT-4: $0.03-0.06/1K tokens. High volume × high cost = very large bills. Without monitoring: Bill surprise at end of month. Cost metrics to track: (1) Total cost: Daily, weekly, monthly cost. Trend: Is cost growing? Proportional to usage growth? (2) Cost per request: Average tokens × price per token. Track over time. Should be stable if usage patterns stable. (3) Cost breakdown: By endpoint/use case. By model (if multiple). By token type (input vs output). Where is cost concentrated? (4) Usage efficiency: Tokens per request: Are requests getting longer? Unnecessary verbose? Token efficiency: Are users getting value per token? (5) Cache hit rate: If caching implemented: What % of requests are cache hits? Cache = free. Higher cache hit rate = lower cost. Alerting on cost: Alert: Daily cost > budget threshold. Alert: Cost per request > X (may indicate prompt change that expanded context). Alert: Cost growing > 20% week-over-week without proportional user growth. Optimization triggers: High cost per request → investigate prompt length. Low cache hit rate → improve caching. Certain endpoints disproportionately expensive → optimize or rate-limit.

---

## Key Takeaways

- **Three pillars** = infrastructure (DevOps), data/model (ML-specific), business (outcomes)
- **Green infrastructure ≠ model working** = must monitor model quality separately
- **Data drift** = input distribution changed; statistical tests (KS, PSI, Chi-square)
- **LLM quality monitoring** = human sampling + LLM-as-judge + user feedback + rule-based
- **Alert fatigue** = actionable alerts only; severity levels; clear playbooks
- **Cost monitoring** = tokens × price; track per-request; alert on unexpected growth
- **Debug degradation** = timeline → what changed → data slicing → feature analysis → prediction analysis
- **Tools** = Evidently AI (drift), Prometheus+Grafana (infra), Arize AI (LLM), LangSmith (traces)

---

*Agli file: `04_Serving_Theory.md` — Model ko fast aur reliable kaise serve karein*
