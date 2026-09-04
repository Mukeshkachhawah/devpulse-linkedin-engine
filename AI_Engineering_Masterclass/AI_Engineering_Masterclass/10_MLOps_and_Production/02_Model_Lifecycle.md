# Model Lifecycle — Ek Model Ka Poora Safar

> *"Log sirf training ke baare mein sochte hain. Data diya, model train kiya, done. Lekin yaar, training toh ek chota sa hissa hai. Model ka asli kaam production mein hota hai — aur wahan jaane ke liye: Data validate karo, experiments track karo, model ko register karo, deploy karo, monitor karo, retrain karo. Yeh poora cycle samajhna real AI engineer banana hai."*

---

## Opening Hook — The Unsung Hero

Behind every successful AI product:
Not just "the model."
But the PIPELINE that trains it, the REGISTRY that stores it, the SERVING infrastructure that runs it, the MONITORING system that watches it, the RETRAINING pipeline that updates it.

The model is the star. The lifecycle infrastructure is the unsung hero.
Without it: The model is a one-time science experiment.
With it: The model becomes a living, improving production asset.

---

## Stage 1: Data Management

**Everything starts with data quality.**

**Data collection:**
Where does data come from? APIs, databases, user interactions, web scraping.
Collection frequency: Real-time streaming vs batch.
Data governance: Legal right to use this data? GDPR compliance?

**Data validation (the step everyone skips):**
Before training: Validate data quality.
Check: Schema (expected columns/types), statistics (distributions as expected), missing values within acceptable range, no duplicates.
Tool: Great Expectations — define expectations, run against data, report violations.

Why critical: "Garbage in, garbage out." Training on bad data = bad model. But you don't discover this until model is deployed and failing.

**Data versioning:**
Data changes. Model trained on version 1 data ≠ model trained on version 2.
For reproducibility: Track which version trained on which model.
Tool: DVC (Data Version Control) — like Git but for data files.

**Feature engineering and feature stores:**
Features: Derived from raw data. Input to model.
Feature store: Central repository of computed features. Reusable across models.
Tools: Feast, Tecton, Vertex AI Feature Store.

Why feature stores matter: Without: Same feature computed by 10 different models independently. → Inconsistency, duplicated effort, training-serving skew.
With: Feature computed once. Consistent everywhere.

**Training-serving skew:**
CRITICAL PROBLEM. Training: Feature computed one way. Serving: Feature computed slightly differently.
Result: Model tested on training distribution. In production: Different distribution. Silent degradation.
Feature store prevents this: Same code path for training and serving.

---

## Stage 2: Experiment Tracking

**Scientific rigor for ML experiments.**

**What experiment tracking means:**
Train 50 different model configurations.
Track: Hyperparameters used, training metrics, evaluation metrics, artifacts (model file).
Compare: Which configuration performed best?
Reproduce: Can I re-run exactly the same experiment?

**MLflow:**
The most popular open-source ML experiment tracking.
Log: Parameters (learning rate, batch size), metrics (loss, accuracy), artifacts (model, plots).
Compare: Side-by-side experiment comparison.
Reproduce: Environment logged with experiment.

**Weights & Biases:**
More advanced. Real-time training curves.
Sweeps: Automated hyperparameter search.
Reports: Share experiments with team.
Collaboration: Multiple people can see each other's experiments.

**Why this matters in production:**
"We need to roll back to the model from 3 weeks ago."
Without tracking: Can you? No.
With tracking: Pull up experiment X from 3 weeks ago. Reproduce the exact model.

"Why did this model degrade?"
Without tracking: Guess.
With tracking: Compare current model's experiment to past model's experiment. Find the difference.

---

## Stage 3: Model Training Pipeline

**Automated, reproducible training.**

**Training as a pipeline:**
Not: Manually run training script.
Instead: Automated pipeline. Each step: Data loading → Preprocessing → Training → Evaluation → Registration.

**Tools:**
Kubeflow Pipelines: Kubernetes-native ML pipeline.
Apache Airflow: General DAG workflow orchestrator.
Prefect, ZenML: Modern ML pipeline tools.

**What makes a good training pipeline:**

**Parameterized:**
All hyperparameters as parameters.
Not hardcoded in script.
Can trigger pipeline with different parameters.

**Idempotent:**
Run it 10 times with same inputs → same output every time.

**Logged:**
Every run: Parameters, metrics, artifacts, timing logged.

**Testable:**
Smoke tests: Runs quickly with small data sample.
Catches: Code errors, schema errors before full training run.

**Distributed training:**
Large models → need multiple GPUs.
Data parallelism: Split data across GPUs.
Model parallelism: Split model across GPUs.
Frameworks: PyTorch DDP, DeepSpeed, Megatron-LM.
Infrastructure: Kubernetes + GPU nodes. Cloud: AWS SageMaker, Google Vertex AI.

---

## Stage 4: Model Evaluation

**Decide if model is good enough to deploy.**

**Evaluation metrics:**
Depends on task.
Classification: Accuracy, precision, recall, F1, AUC-ROC.
Regression: MAE, RMSE, R².
Ranking: NDCG, MRR.
Language: BLEU, ROUGE, BERTScore, human evaluation.

**Sliced evaluation (critical):**
Overall accuracy 90% sounds great.
But: Accuracy on ethnic minority subgroup = 65%.
Metric slicing: Evaluate model on different data slices.
Catch: Performance disparities before deployment.

**Evaluation datasets:**
Test set: Held out from training. Never seen.
Validation set: Used for hyperparameter tuning.
Production representative set: Matches production distribution.

**Challenge for LLMs:**
Automated metrics insufficient.
Need: Human evaluation for quality.
Emerging: LLM-as-judge (use another LLM to evaluate).
Still imperfect: LLM-as-judge has its own biases.

**Benchmark comparison:**
New model vs previous production model.
If new model better on all metrics → promote.
If new model better on some, worse on others → decision needed.

---

## Stage 5: Model Registry

**Central store of all trained models.**

**What a model registry provides:**
Versioned models: v1, v2, v3.
Model metadata: Who trained it, when, what data, what metrics.
Stage management: Development → Staging → Production.
Lineage: Which data version trained this model?

**MLflow Model Registry:**
Free, open source.
Stages: None → Staging → Production → Archived.
Comments: Annotate why model was promoted/rejected.
API: Query current production model programmatically.

**Cloud registries:**
AWS SageMaker Model Registry.
Google Vertex AI Model Registry.
Azure ML Model Registry.
Managed, integrated with cloud training/serving.

**For LLMs:**
Register: Model checkpoint, LoRA adapters.
Also register: Prompt versions that work with this model.
Track: RLHF/Constitutional AI training steps.

---

## Stage 6: Model Deployment

**Moving model from registry to serving.**

**Deployment strategies:**

**Blue-Green deployment:**
Blue: Current production model.
Green: New model, fully deployed alongside blue.
Switch: Route traffic to green. Blue stays as rollback.
Zero downtime.

**Canary deployment:**
New model gets 5-10% of traffic.
Monitor for errors/performance issues.
Gradually increase: 10% → 25% → 50% → 100%.
Or rollback if issues detected.

**Shadow deployment:**
New model receives real traffic but results not shown to users.
Compare: New model's predictions vs current model's predictions.
Validate quality before going live.

**A/B testing:**
Split traffic: Group A gets model A, Group B gets model B.
Measure: Business metric (click-through, conversion, satisfaction).
Determine: Which model is actually better for the business goal?

**For LLMs:**
Canary with prompt changes: New prompt → small traffic.
A/B test: Different prompts or model versions.
Shadow: Log new model's responses without showing to users.

---

## Stage 7: Model Serving

**Running the model to serve predictions at scale.**

**Key serving metrics:**
Latency: P50, P95, P99 response times.
Throughput: Requests per second.
Availability: % of time serving is up.
Cost: $/1K predictions.

**Serving infrastructure:**

**REST API:**
Most common. HTTP endpoint.
Model wrapped in API. Client calls endpoint.
Simple. Universal.

**gRPC:**
Binary protocol. Faster than REST.
Used for: High-performance, internal services.

**Batch prediction:**
Not real-time. Predictions run on schedule.
"Run model on all rows in this table every hour."
Cheaper. Lower latency requirements.

**Model serving frameworks:**
TorchServe: PyTorch models.
TF Serving: TensorFlow models.
BentoML: Framework-agnostic. Good for classical + deep learning.
Triton Inference Server: NVIDIA's high-performance serving.

**For LLMs:**
vLLM: Open-source LLM serving. Highly efficient. PagedAttention for memory efficiency.
Text Generation Inference (TGI): HuggingFace's serving framework.
Cloud: AWS Bedrock, Google Vertex AI, Azure OpenAI — managed LLM serving.

---

## Stage 8: Retraining and Model Updates

**Models degrade. Must be updated.**

**When to retrain:**
Scheduled: Every N weeks regardless of performance.
Triggered: When drift detected above threshold.
Triggered: When labeled samples show accuracy drop.
Event-based: Major world event (pandemic, policy change) → immediate retrain.

**Retraining pipeline:**
New data available → Validate → Retrain → Evaluate → Compare with current production → If better: Deploy.
Automated or semi-automated.

**For LLMs:**
Full retraining: Rare, expensive. Only for major capability updates.
Fine-tuning updates: New LoRA adapter trained on new data. Cheaper.
Prompt updates: Often the fastest way to update LLM behavior.
Model version upgrade: Base model provider (Anthropic, OpenAI) releases new version → evaluate → migrate.

**Continuous training:**
Production data → Label (crowdsource or rules) → Add to training data → Retrain.
The model improves from its own production experience.
Very powerful but requires: Reliable labeling, drift detection, quality gates.

---

## Anthropic Insider Angle

The model lifecycle for frontier LLMs is unlike any other model lifecycle. The scale and cost are different by orders of magnitude.

**Claude's training lifecycle:** Each version of Claude involves months of work: Data curation, pretraining (weeks on thousands of GPUs), RLHF training, Constitutional AI, safety evaluation. The "deploy → monitor → retrain" cycle exists but at a much larger scale and lower frequency than typical ML models. Between major versions: Prompt changes, fine-tuning adapters, and safety patches are how we update behavior.

**Evaluation is the hardest part:** For Claude, what does "this model is better" mean? Better at following instructions? Better at reasoning? Safer? Less biased? All of these simultaneously? Frontier model evaluation requires: Thousands of carefully designed benchmarks, human evaluations, red-teaming, safety evaluations. Deciding "this version is ready to ship" is genuinely one of the hardest problems.

**The model registry for alignment:** We track not just model performance metrics but alignment properties: Is the new model less likely to be harmful? More honest? Better calibrated? These alignment properties need to be tracked alongside accuracy metrics. This is unique to safety-focused labs.

**Production serving at scale:** Claude serves millions of requests per day. This requires: Sophisticated load balancing, geographic distribution of inference, careful capacity planning, real-time scaling. The engineering required to serve a frontier LLM reliably and at low latency is substantial — and this is often invisible to users.

---

## Common Misconceptions

**Misconception 1: "Model development = model lifecycle"**
Development (training) is ~20% of the lifecycle work. Operations (deployment, monitoring, maintenance) is ~80%. Many data scientists focus only on development. AI engineers must understand the full lifecycle.

**Misconception 2: "Once a model is deployed, it doesn't need updates"**
Models degrade. Data changes. Business requirements change. "Ship and forget" = guaranteed failure in 6-12 months.

**Misconception 3: "Experiment tracking is optional overhead"**
Without experiment tracking: Can't reproduce results, can't compare models, can't roll back, can't explain model decisions. It takes 1 day to set up MLflow. It saves weeks of debugging over time.

**Misconception 4: "More data always improves model"**
Quality data > quantity data. Training on stale, low-quality, or poorly labeled data degrades models. Data validation before training is critical.

---

## Interview Questions

**Q1: Model lifecycle ke stages kya hain? Har stage mein kya important hai?**

**Answer:** 8 stages: (1) Data management: Collection, validation, versioning, feature engineering. Key: Data quality gates, training-serving skew prevention. (2) Experiment tracking: Track hyperparameters, metrics, artifacts. Key: Reproducibility, comparison. (3) Training pipeline: Automated, parameterized, logged. Key: Automation, reproducibility. (4) Model evaluation: Metrics, sliced evaluation, comparison. Key: Don't evaluate only overall accuracy — evaluate subgroups. (5) Model registry: Versioned models, stages, lineage. Key: Single source of truth for model versions. (6) Model deployment: Blue-green, canary, A/B test. Key: Gradual rollout, rollback capability. (7) Model serving: REST/gRPC, latency, throughput. Key: Reliability, performance at scale. (8) Retraining: When to retrain, automated pipeline. Key: Models degrade, must maintain. Lifecycle is a CYCLE not a linear path. After retraining → back to evaluation → back to deployment. Ongoing iteration.

**Q2: Training-serving skew kya hai? Kaise prevent karein?**

**Answer:** Training-serving skew: Training features computed differently from serving features. Result: Model sees different distribution in production vs training. Silent accuracy degradation. Example: Feature "days_since_last_purchase." Training: Computed at batch time using historical data. Serving: Computed at request time. Different logic → different values → model trained on one distribution, sees another. Causes: Different code paths (Python training vs Java serving). Different libraries. Different rounding/encoding. Different missing value handling. Prevention: (1) Feature store: Single computation logic for features. Both training and serving use SAME feature code. Training: Reads from feature store. Serving: Reads from same feature store. Eliminates skew at source. (2) Shared preprocessing: Same preprocessing code used for training and serving. Not "similar code" — SAME code. (3) Consistency tests: After serving deployment: Compare features at serving time vs training time for same examples. If different: Feature skew detected. (4) Shadow testing: New serving code → run on production traffic → compare features vs what training produced. Detection: Input feature distribution monitoring. Training distribution vs production distribution. If diverged: Investigate skew.

**Q3: Model registry ki kya zarurat hai? Kya store karna chahiye?**

**Answer:** Why model registry: Multiple models (version 1, 2, 3), multiple stages (development, staging, production). Without registry: Chaos. "Which model file is production?" "Can we roll back to last week?" "What data was this trained on?" Impossible to answer reliably. What to store in registry: (1) Model artifact: The model file (weights, pickle, ONNX, etc.). (2) Metadata: Training date. Data version used. Code version (Git commit). Hyperparameters. (3) Metrics: Evaluation metrics on test set. Comparison with previous version. (4) Stage: Development / Staging / Production / Archived. (5) Lineage: Which experiment produced this model? Which data? Who ran it? (6) Serving configuration: How to run this model. Resource requirements. (7) For LLMs: Prompt versions that work with this model checkpoint. How to use: Model comparison: "Is new model better than current production?" → Compare registry entries. Rollback: "New model causing issues" → Promote previous production version. Audit: "Which model was serving on Nov 15 at 3pm?" → Registry query.

**Q4: Deployment strategies kya hain? LLMs ke liye kaunsa best hai?**

**Answer:** Deployment strategies: (1) Blue-Green: Deploy new (green) alongside old (blue). Switch all traffic at once. Rollback: Switch back to blue. Zero downtime. Risk: All users get new version at once. (2) Canary: New version gets small % of traffic (5-10%). Monitor. Gradually increase if no issues. Risk: Small user segment may see degraded experience. (3) Shadow: New model runs on real traffic. Results not shown to users. Compare quality. Risk: Zero user impact. Can't test user behavior. (4) A/B test: Traffic split between versions. Measure business metrics per group. Best for: Determining which version is better for business goal. For LLMs specifically: Canary with prompt changes is most practical. New prompt → small % → monitor quality and safety → gradually increase. A/B test: Compare different model versions (or prompt versions) on business metrics (user satisfaction, task completion rate). Shadow deployment: Good for major version changes (model v2 vs v3). No risk while validating quality. Real-world: Most LLM applications: Shadow or A/B test for validation. Canary for gradual rollout. Blue-green for zero-downtime switches. 

**Q5: When should a model be retrained? Retraining pipeline kaise design karein?**

**Answer:** When to retrain: (1) Scheduled: Fixed cadence regardless of metrics. Monthly, quarterly. Simple, predictable. Downside: May retrain unnecessarily or not frequently enough. (2) Performance-triggered: Accuracy drops below threshold. Drift score exceeds threshold. Detected automatically → trigger retraining. (3) Data-triggered: New labeled data available exceeds N samples. Retrain with expanded data. (4) Event-triggered: Major external event (pandemic, policy change, product launch). Immediate retraining warranted. Retraining pipeline design: (1) Data freshness: Automated data pipeline. New data → validate → add to training set. (2) Training: Run training pipeline. Same as original with new data. (3) Evaluation: Compare new model to current production model. On held-out test set. Better? → Proceed. Worse? → Investigate. (4) Staging: Deploy to staging. Run integration tests. (5) A/B test (optional): Run new model alongside old. Confirm improvement. (6) Promote: Push new model to production. (7) Archive: Old model archived in registry. Automation: Trigger (drift/schedule/data) → Auto-train → Auto-evaluate → If better → Auto-deploy (or human approval checkpoint).

**Q6: LLM inference ko cost-effectively kaise serve karein production mein?**

**Answer:** LLM serving challenges: Expensive (vs classical models), slow (seconds vs ms), memory-intensive (large models), stateful (conversation context). Cost optimization strategies: (1) Caching: Semantic caching: If user asks same/similar question → return cached answer. 20-40% of LLM queries can be cache hits. Tools: GPTCache, Redis with semantic search. (2) Quantization: Reduce model precision: float32 → int8 or int4. Memory: 4x smaller. Inference: 2-3x faster. Quality: Small degradation. vLLM supports quantization. (3) Batching: Process multiple requests together. Continuous batching: New requests join the batch without waiting. vLLM: Excellent continuous batching support. (4) Model distillation: Train smaller model to mimic larger. For high-volume, lower-stakes queries: Use smaller model. (5) Request routing: Simple queries → smaller, cheaper model. Complex queries → larger, more expensive model. Save cost on simple queries. (6) KV cache: Attention KV cache. Reuse computation for shared prefixes. System prompt shared → cache it. (7) Efficient serving: vLLM: Best open-source LLM serving. PagedAttention for memory. Continuous batching. Up to 24x throughput vs naive serving. Cloud: AWS Bedrock, Google Vertex AI — managed with auto-scaling.

---

## Key Takeaways

- **8 lifecycle stages** = data → experiments → training → evaluation → registry → deployment → serving → retraining
- **Training-serving skew** = same feature code for training AND serving; use feature store
- **Experiment tracking** = every run logged; reproducible; comparable; MLflow or W&B
- **Model registry** = versioned artifacts + metadata + lineage + stage management
- **Deployment strategies** = canary (gradual) for safety; A/B test for comparison; shadow for validation
- **Retraining triggers** = scheduled, performance-triggered, data-triggered, event-triggered
- **LLM inference optimization** = caching (20-40% savings), quantization, continuous batching, routing
- **vLLM** = best open-source LLM serving; PagedAttention; continuous batching

---

*Agli file: `03_Model_Monitoring.md` — Production mein model health check*
