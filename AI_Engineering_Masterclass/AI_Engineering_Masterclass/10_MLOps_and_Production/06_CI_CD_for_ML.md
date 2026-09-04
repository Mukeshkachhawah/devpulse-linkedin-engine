# CI/CD for ML — Automated ML Pipeline Engineering

> *"Software engineering mein CI/CD standard hai: Code change → Auto test → Auto deploy. ML mein yeh zyada complex hai: Data change → Data validate → Auto train → Auto evaluate → Compare with production → If better: Deploy. Yeh continuous training pipeline hai. Is level ka automation achieve karna = ML engineering maturity Level 2. Aur yeh woh skill hai jo top companies hire karte hain."*

---

## Opening Hook — The Manual Deploy Disaster

A team of 5 ML engineers.
Model update: Every 2 weeks.
Process:
1. Engineer A: Manually trains model.
2. Engineer B: Manually evaluates.
3. Both agree: "Looks good."
4. Engineer C: Manually uploads model to serving.
5. Engineer D: Manually updates config.
6. Engineer E: Manually checks it works.
7. Something breaks: 4 hours to diagnose because no audit trail.

**Human hours per deploy: ~20 hours. 5 engineers × 2 weeks = this is all they do.**

With CI/CD:
Code change → GitHub → Automated pipeline runs in 2 hours → Model evaluated → If better → Deployed.
Human hours per deploy: 30 minutes (just review).

**This is the ROI of ML CI/CD.**

---

## What Is CI/CD for ML?

**CI (Continuous Integration) for ML:**
Every code change → Automatically trigger:
- Data validation.
- Pipeline smoke tests.
- Training on sample data.
- Unit tests for all ML code.
If all pass: Merge to main branch.

**CD (Continuous Delivery) for ML:**
Main branch code → Automatically:
- Trigger full training pipeline.
- Evaluate new model.
- Compare to production model.
- If better: Deploy to staging.
- After validation: Deploy to production.

**CT (Continuous Training) — ML-specific:**
New data arrives → Automatically:
- Detect data drift or performance degradation.
- Trigger retraining pipeline.
- Evaluate → Compare → Deploy if better.

---

## ML CI/CD Pipeline Components

### 1. Code CI Pipeline

**Triggers on: Every pull request / code push.**

**Steps:**
Data validation: Run Great Expectations on sample data. Fail if schema violated.
Unit tests: Test each function. Data preprocessing, feature engineering, model code.
Smoke test: Train on tiny dataset (100 samples). Verify pipeline doesn't crash.
Linting/formatting: Code quality checks.
Security scan: Any credentials in code? Known vulnerabilities in dependencies?

**Goal:** Fast feedback (< 15 minutes). Find code errors before full training.

**Tools:**
GitHub Actions: Most common for CI. Free for public repos.
GitLab CI/CD: Alternative. Good for enterprise.
Jenkins: Traditional. More complex.

### 2. Training Pipeline

**Triggers on: Merge to main OR scheduled OR data update.**

**Steps:**
1. Data pull: Get latest versioned data (DVC pull).
2. Data validation: Validate full dataset. Fail if quality issues.
3. Feature engineering: Run feature pipeline.
4. Model training: Full training run with production data.
5. Model evaluation: On held-out test set. Multiple metrics.
6. Model registration: If evaluation passes → register in model registry.

**Infrastructure:**
Kubeflow Pipelines: Kubernetes-native ML pipeline orchestration.
Apache Airflow: DAG-based workflow. Mature, flexible.
Prefect: Modern Python workflow orchestration.
AWS Step Functions: Managed serverless pipelines.
Vertex AI Pipelines: GCP-native.

### 3. Model Evaluation Gate

**The critical decision: Is new model better than current production?**

**Evaluation dimensions:**
Overall metrics: Accuracy, F1, AUC.
Sliced metrics: Performance on different subgroups.
Regression test: Does new model maintain performance on critical cases?
Bias evaluation: Does new model have worse disparities?
Speed: Is latency acceptable?

**Pass/fail criteria:**
Define thresholds before training.
"New model acceptable if: Overall accuracy > current - 0.5%, All slice accuracies > minimum thresholds, No regression on critical test cases."

**Automated comparison:**
New model vs current production model.
Side-by-side on same test set.
Automated decision: Pass/fail.
Human review: For marginal cases.

### 4. Model Serving Deployment

**Automated deployment after model passes evaluation.**

**Staging deployment:**
Deploy to staging environment.
Run integration tests.
Run smoke tests against staging endpoint.
If pass → promote to production.

**Production deployment strategies:**
Canary: 5% → monitor → 25% → monitor → 100%.
Blue-green: Full switch with instant rollback available.
All automated. With automatic rollback if metrics degrade.

**Post-deployment validation:**
Monitor for 24-48 hours.
If metrics degrade → automatic rollback.
Alert: Notify team of deployment + metrics.

---

## Data Validation in CI/CD

**Data quality gates are critical and often missing.**

**What to validate:**

**Schema validation:**
Expected columns present.
Data types correct.
No extra unexpected columns.
Constraint: Row count within expected range.

**Statistical validation:**
Feature distributions within expected range (vs training distribution).
No sudden shifts.
Missing value rates within acceptable range.
No constant features (feature frozen = pipeline issue).

**Business logic validation:**
No negative prices.
Ages within valid range.
Dates in expected range.
IDs in valid format.

**Tool: Great Expectations:**
Define "expectations" (data contract).
Run against each data batch.
Report: Which expectations passed/failed.
Fail pipeline if critical expectations violated.

**Example expectations:**
expect_column_to_exist("user_id")
expect_column_values_to_be_between("age", 0, 120)
expect_column_values_to_not_be_null("label", mostly=True, mostly=0.95)
expect_column_mean_to_be_between("purchase_amount", 40, 200)

---

## Testing Strategy for ML

**Different test types for ML systems:**

### Unit Tests

**Test individual functions:**
Data preprocessing function.
Feature engineering function.
Model architecture components.
Evaluation metric computation.

**Properties:**
Fast (< 1 second each).
Isolated (no external dependencies).
Deterministic (same result every run).
Run on: Every pull request.

### Integration Tests

**Test pipeline components working together:**
Data loading → preprocessing → training works.
Model saves correctly → loads correctly.
Serving endpoint → model runs → returns correct format.

**Properties:**
Medium speed (< 5 minutes).
May use external systems (database, file storage).
Run on: Every merge to main.

### Model Quality Tests

**Test model behavior:**
Performance metrics on held-out test set.
Performance on critical edge cases.
Performance on regression suite.
Bias/fairness metrics.

**Properties:**
Slow (training required or at least full eval run).
Run on: Full pipeline trigger (not every PR).

### End-to-End Tests

**Test entire system:**
Request comes in.
Feature computed.
Model scores.
Response served.
Assert: Correct format, acceptable latency, no errors.

**Properties:**
Slow.
Requires deployed system.
Run on: After deployment to staging.

---

## Feature Pipelines in CI/CD

**Feature engineering as part of the CI/CD pipeline.**

**Feature pipeline:**
Transforms raw data → features for model.
Must be: Reproducible, versioned, tested.

**Training-serving consistency:**
Training: Feature pipeline produces features → Model trained on.
Serving: Feature pipeline produces features at request time → Model scored on.
MUST be same pipeline. Same code. Same logic.
CI/CD ensures: Same code committed for both.

**Feature tests:**
Unit test each feature transformation.
Integration test full feature pipeline.
Statistical test: Feature distributions match expected.
Regression test: Feature values unchanged for known inputs.

**Feature versioning:**
Feature engineering code: Versioned in Git.
Feature definitions: Can be versioned in feature store.
Model: Linked to feature version used during training.
Breaking change in feature: New model version needed.

---

## LLM CI/CD — Unique Considerations

**LLM pipelines have additional components:**

**Prompt testing:**
Every prompt change → automated test.
Test suite: Representative queries + expected quality.
Quality metrics: LLM-as-judge scores, format compliance, safety.
Fail: If prompt change causes quality regression.

**Safety evaluation:**
Every model/prompt change → safety evaluation.
Red-team test suite: Attempts to get harmful outputs.
Pass requirement: No harmful outputs on test suite.
Fail hard: If safety tests fail → Block deployment.

**Behavioral regression testing:**
Does new version still correctly handle: Edge cases, refusals, format requirements.
Golden test set: Input-output pairs where behavior should be preserved.
Alert: When behavior changes on golden set.

**Cost regression:**
New prompt version → estimate cost per request.
If cost significantly higher → flag for review.

---

## Anthropic Insider Angle

Continuous training and automated deployment pipelines are standard at frontier AI labs. The difference from typical MLOps is the scale and the safety requirements.

**Safety as a hard gate:** One thing unique to our CI/CD: Safety evaluation is a hard gate, not a soft metric. If a model version fails safety evaluations — even if it performs better on all other metrics — it does not get deployed. Building this into CI/CD (not just as a human review step) ensures it's never accidentally skipped.

**The evaluation challenge at frontier scale:** For Claude updates, evaluation is enormously complex. Thousands of benchmarks, human evaluations, red-teaming sessions, safety assessments. A full evaluation can take weeks. The CI/CD pipeline needs to: (1) Run fast automated tests that catch obvious regressions. (2) Escalate to human evaluation for anything that passes automated but needs nuanced assessment. (3) Block on safety. Automate everything automatable; make human review efficient for what can't be automated.

**Continuous training vs fine-tuning:** At the frontier model scale, we don't do "continuous training" in the traditional sense (retrain every day with new data). The cost is prohibitive. Instead: Regular major training runs with updated data. Fine-tuning adapters for specific improvements. Prompt updates for behavioral changes. The "CD" for LLMs is more about prompt deployment and adapter deployment than full model deployment.

**Gradual rollout as a CI/CD component:** For Claude releases, we never switch 100% of traffic at once. Gradual rollout: 1% → 5% → 20% → 50% → 100% with monitoring at each stage. Automated rollback triggers if: Error rate increases, quality metrics drop, safety violations detected. This gradual rollout is built into the deployment pipeline.

---

## Common Misconceptions

**Misconception 1: "CI/CD for ML is just running tests"**
CI/CD for ML includes: Data validation, training, model evaluation, deployment, monitoring. Much more than just unit tests. It's the automation of the entire model lifecycle.

**Misconception 2: "We don't need CI/CD until we're a large team"**
Solo engineer benefits enormously from CI/CD. Less manual work. Automatic quality gates. Reproducibility. You'll thank yourself 6 months later when something breaks and you can trace exactly what changed.

**Misconception 3: "CI/CD means always automatically deploying"**
CI/CD doesn't require zero human intervention. Common pattern: Automated training + evaluation + staging deployment. Human approval: Before production deployment. Automation handles mechanics. Humans handle judgment calls.

**Misconception 4: "Model evaluation = test set accuracy"**
Evaluate: Overall accuracy + Slice performance + Regression suite + Safety + Bias + Speed. Single accuracy metric is insufficient. Production failures often come from slices that overall accuracy masks.

---

## Interview Questions

**Q1: CI/CD for ML regular CI/CD se kyun different hai?**

**Answer:** Regular software CI/CD: Code change → Tests → Deploy. That's it. ML adds: (1) Data: Large binary artifacts. Must validate quality. Version in DVC. (2) Training: Expensive computation step between tests and deploy. May take hours. (3) Model evaluation: Can't just test if code runs. Must evaluate if model QUALITY is acceptable. (4) Comparison: Is new model better than current production? Automated comparison required. (5) Continuous training: Data changes → trigger retraining. Not just code changes. (6) For LLMs: Prompt testing, safety evaluation, behavioral regression. ML CI/CD pipeline: Code change → Data validation → Smoke test → Full training → Model evaluation → Compare to production → If better → Staging → Integration tests → Canary deploy → Full deploy. Each step: More complex than standard CI/CD. More domain-specific knowledge required.

**Q2: ML pipeline mein kaunse tests likhne chahiye? Test strategy kya hai?**

**Answer:** Testing pyramid for ML: (1) Unit tests (many, fast): Test individual functions. Data preprocessing. Feature engineering. Metric computation. Model architecture components. Run: Every pull request. < 1 second each. (2) Integration tests (fewer, medium): Data pipeline end-to-end. Model save/load cycle. Serving endpoint format. Run: Every merge. < 5 minutes. (3) Model quality tests (few, slow): Performance on held-out test set. Critical edge case performance. Regression test suite. Run: Full pipeline trigger. Requires training. (4) End-to-end tests: Full system. Request in → prediction out. Run: Post-staging deployment. For LLMs add: (5) Prompt tests: Quality on representative queries. Safety: Red-team test suite. Behavioral regression: Golden set. Test philosophy: Test at the appropriate level. Don't use full training runs to test code correctness (unit tests are cheaper). Don't skip model quality tests (code tests don't verify model quality).

**Q3: Data validation pipeline mein kaise integrate karein?**

**Answer:** Integration approach: Data arrives → Validate → If passes → Continue pipeline. If fails → Alert + stop. What to validate: Schema: Columns, types, constraints. statistics: Distributions within expected range. Business logic: Age > 0, price > 0, valid IDs. Missing values: Within acceptable threshold. Data freshness: Is data from expected date range? Tool: Great Expectations. Define expectations as code. Run automatically in pipeline. Report: Detailed pass/fail with what failed. Where in pipeline: (1) Raw data ingestion: Validate raw data before any transformation. (2) Feature pipeline output: Validate features before model training. (3) Production serving: Validate incoming request data before model scoring. Benefits: Catch data issues early. Don't waste expensive training on bad data. Know when data quality issue vs model issue. Pipeline design: Great Expectations + CI = data quality gate: If validation fails → Fail the CI pipeline. Alert team: "Data validation failed for batch X. These expectations violated: [list]." Don't allow training to proceed on bad data.

**Q4: Model evaluation gate kaise design karein? Kab automated deployment safe hai?**

**Answer:** Evaluation gate design: Define criteria BEFORE training (not after seeing results). Criteria: (1) Overall metric: New model accuracy >= current production accuracy - threshold. Example: Must not be worse than current by more than 0.5%. (2) Slice metrics: Performance on critical subgroups must exceed minimums. Don't let overall accuracy hide disparities. (3) Regression suite: Golden test cases that must pass. Core behaviors that shouldn't break. (4) Safety: Must pass all safety tests. Hard gate. (5) Latency: P99 latency < SLA threshold. Automated decision: All criteria pass → Automatic deployment to staging. Any critical criterion fails → Block. Alert team. Log failure reason. Marginal cases → Human review. When automated deployment safe: Well-tested criteria. Extensive regression test suite. Good rollback mechanism. Monitoring in place. Canary/gradual rollout. When NOT safe: New type of task where quality hard to measure automatically. Safety-critical application. First deployment to a new use case. Human approval required for: Any safety test issues. New user segments. Major version changes. Automated handles: Routine updates. Incremental improvements. Clear pass/fail criteria.

**Q5: LLM pipeline mein prompt testing kaise automate karein?**

**Answer:** Prompt testing automation components: (1) Test suite creation: Representative query set (200-500 queries). Diverse: Different query types, edge cases, potential misuse. Label: Expected quality, format, behavior. Golden test set: Queries where exact expected behavior known. (2) Automated evaluation: For each prompt version: Run test suite. Evaluate with: LLM-as-judge (GPT-4 evaluating quality). Format checker (Is output in expected format?). Safety classifier (Any harmful content?). Keyword regression (Are expected/forbidden phrases present?). (3) Comparison: New prompt version vs current production prompt. Metrics comparison: Overall quality, safety, format compliance. Flag: Any significant regression. Block: If safety tests fail. (4) Implementation: Store prompts in Git. PR for prompt change → CI runs test suite. Results reported in PR. Team reviews before merge. Merge → staging deploy → monitor → production. Tools: LangSmith: Built for LLM testing and tracing. W&B Prompts: Prompt version tracking + evaluation. Custom: Simple script + LLM-as-judge.

**Q6: Continuous training pipeline kaise design karein? Retraining trigger kya hona chahiye?**

**Answer:** Continuous training pipeline: Data → Validate → Train → Evaluate → Compare → Deploy (if better) → Monitor → (loop). Retraining triggers: (1) Schedule: Regular cadence. Weekly or monthly. "Always train on latest N weeks of data." Simple, predictable. May retrain unnecessarily. (2) Data drift trigger: Input distribution drifted beyond threshold. PSI > 0.2 for key features. Automatic retraining triggered. (3) Performance trigger: Model accuracy (on labeled sample) dropped below threshold. P95 of daily labeled accuracy < 0.85 → trigger. (4) Data volume trigger: Training data grown by X samples. Enough new signal to potentially improve model. (5) Scheduled + triggered: Most robust. Scheduled: Ensures regular updates. Triggered: React to sudden changes. Training pipeline automation: Airflow or Prefect: Orchestrate pipeline. Scheduled DAG. Event-triggered DAG (data drift detected → trigger training DAG). Kubernetes jobs: Scalable compute for training. MLflow: Logging and model registry. Comparison job: Automated A/B test on held-out set. Deploy job: Kubernetes rolling update. Monitoring + feedback loop: Production metrics → feedback to training trigger. If quality drops → trigger retraining. Closed loop continuous improvement.

---

## Key Takeaways

- **CI for ML** = code change → data validate → smoke test → unit tests → pass/fail on PR
- **CD for ML** = merge → full training → evaluate → compare → deploy if better → monitor
- **CT (Continuous Training)** = data change / drift → auto-retrain → evaluate → deploy
- **Data validation** = Great Expectations; define expectations as code; hard gate in pipeline
- **Testing pyramid** = unit (many/fast) + integration (medium) + quality (few/slow) + E2E
- **Evaluation gate** = define criteria before training; overall + slices + regression + safety
- **LLM CI/CD** = prompt testing + safety evaluation + behavioral regression as additional gates
- **Retraining triggers** = schedule + drift detection + performance drop + data volume
- **Safety = hard gate** = safety failures block deployment regardless of other metrics

---

*Module 10 complete! Agli module: `11_AI_Ethics_and_Safety` — The most important module*
