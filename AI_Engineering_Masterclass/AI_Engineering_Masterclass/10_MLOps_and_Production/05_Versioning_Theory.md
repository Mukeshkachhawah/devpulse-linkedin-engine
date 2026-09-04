# Versioning Theory — Models, Data, aur Code Ko Track Karna

> *"Git jaante ho? Code versioning. Same concept ML mein extend karo. Model versioning: Konsa checkpoint production mein hai? Data versioning: Kis dataset pe train hua? Prompt versioning: Kaunsa prompt version kab deploy hua? Bina versioning ke: Chaos hai. Kuch break hota hai — rollback kaise karoge? Experiment reproduce kaise karoge? Yeh sirf best practice nahi hai — yeh professional ML engineering ki foundation hai."*

---

## Opening Hook — The "Which Version?" Problem

A production model starts giving weird results.
Engineer: "Let's roll back to last week's model."
Team: "Uh... which file was last week's model? It was trained on... what data exactly?"

Another engineer: "I improved the prompt last week. Wait, was it Monday's version or Thursday's version that we deployed?"

A third: "I changed the preprocessing code. Did the production model use the new preprocessing or old?"

**Nobody knows. Nothing is versioned. Can't roll back. Can't reproduce. Incident duration: 3 days instead of 1 hour.**

This is what happens without versioning.

---

## The Versioning Problem in ML

**ML has more things to version than traditional software:**

Traditional software:
1. Code (Git handles this).

ML adds:
2. Training data (huge, binary, not Git-able).
3. Model weights (huge binary files).
4. Model hyperparameters (configuration).
5. Preprocessing/feature engineering code.
6. Evaluation results.
7. Experiment configuration.
8. For LLMs: Prompts.
9. For LLMs: RLHF annotations.
10. Dependencies and environment.

**The challenge:** All of these must be:
Tracked together (which code + which data + which config = which model).
Reproducible.
Rollback-able.

---

## Code Versioning (Git)

**Assumed knowledge, but key points for ML:**

**Everything as code:**
Model architecture: Code (not UI clicks).
Training pipeline: Code.
Preprocessing: Code.
Evaluation: Code.
Infrastructure (Terraform): Code.

**ML-specific Git practices:**

**Tag model releases:**
When model deployed → create Git tag.
"Model v2.3.1 deployed on this commit."
Can go back to exact code at any production model's deployment.

**Branch for experiments:**
Main: Production-stable code.
Experiment branches: Try different architectures, hyperparameters.
Merge: Only successful experiments.

**Commit discipline:**
Hyperparameter changes: Commit with explanation.
Never: "Updated model" — always say WHAT changed and WHY.

---

## Data Versioning (DVC)

**The biggest unique challenge in ML versioning.**

**Why Git doesn't work for data:**
Large files (GB-TB): Git is terrible for large binary files.
Git LFS: Stores large files in separate storage but has limits.
DVC: Purpose-built for large ML artifacts.

**DVC (Data Version Control):**
Works alongside Git.
Stores data files in remote storage (S3, GCS, Azure Blob).
In Git: Tiny pointer files (.dvc files) that reference data versions.
Commands: Like Git — dvc add, dvc push, dvc pull.

**How it works:**
1. You have dataset.csv (5GB).
2. `dvc add dataset.csv` → creates dataset.csv.dvc (tiny pointer file).
3. `git add dataset.csv.dvc` → commit the pointer.
4. `dvc push` → uploads actual file to S3/GCS.
5. Another machine: `git pull` (gets pointer) + `dvc pull` (gets actual data).

**Result:**
Git commit X → References dataset version Y.
Can restore: Exact dataset version used for any historical model.

**Data lineage:**
Which pipeline produced this data?
Raw → Cleaned → Featured → Split (train/test).
DVC tracks the pipeline that produces data.
Can reproduce any stage of data pipeline.

---

## Model Versioning (Model Registry)

**Central store of all trained model artifacts.**

**What to version in model registry:**

**Model artifact:**
The actual model weights file.
For PyTorch: .pt or .pth file.
For HuggingFace: config.json + weights file(s).
For LLMs: Multiple shards (model.safetensors.00001-of-00003).

**Metadata:**
Model name and version number.
Training date.
Git commit hash (code version).
DVC commit (data version).
Training hyperparameters.
Evaluation metrics (on multiple datasets/slices).
Who trained it.

**Stage:**
Registered → Staging → Production → Archived.
Each stage transition: Documented with reason and reviewer.

**For LLMs specifically:**
Base model + adapter version.
System prompt version.
Constitutional AI revision version.

**MLflow Model Registry:**
Free, open-source.
Track model stages.
Comments on each transition.
REST API for programmatic access.
"What is the current production model?" → One API call.

---

## Prompt Versioning (LLM-Specific)

**Prompts are behavior. Must be versioned like code.**

**Why prompt versioning matters:**
Small prompt change → 20% quality change (positive or negative).
Without version control: Can't trace when quality changed.
Without history: Can't roll back to working prompt.
Without testing: Deployed broken prompt silently.

**What to version:**
The full prompt text.
Name/identifier.
Version number.
Author.
Date.
Associated model version.
Evaluation metrics.

**Version scheme:**
Semantic versioning: v1.0.0 → v1.0.1 (minor tweak) → v1.1.0 (significant change) → v2.0.0 (major rewrite).

**Prompt registry:**
Centralized store of prompt versions.
Production system: Uses prompt_id=customer_service_v3.2.1.
Can roll back: Change production to v3.2.0.
Can A/B test: Route 10% to v3.2.2, 90% to v3.2.1.

**Simple implementation:**
Prompts stored in database or files.
Git for version control of prompt files.
Deployment config: Which prompt version.

**Advanced:**
Dedicated prompt management platforms: PromptLayer, LangSmith, Weights & Biases Prompts.
Testing: Evaluation metrics for every prompt version.
Promotion workflow: Staging → Production with approval.

---

## Experiment Tracking and Reproducibility

**Every experiment fully reproducible.**

**What makes an experiment reproducible:**
Code version (Git commit hash).
Data version (DVC commit hash).
Hyperparameters (all of them).
Environment (Python version, package versions).
Random seeds.
Hardware configuration.

**MLflow experiment logging:**
Log: Parameters (learning_rate=0.001, batch_size=32, etc.).
Log: Metrics (train_loss, val_accuracy, etc.).
Log: Artifacts (model checkpoint, confusion matrix, etc.).
Log: Tags (experiment group, owner, notes).
Auto-log: Git commit, environment, etc.

**To reproduce experiment:**
MLflow run ID → Get all above information.
Restore environment (Docker or conda).
Restore code (git checkout <commit>).
Restore data (dvc checkout <commit>).
Run training with logged hyperparameters.
Result: Identical model.

**Why not always reproducible despite best efforts:**
Non-deterministic operations: GPU floating point operations not always identical.
External data: API pulled different data at training time vs reproduction time.
Random library behavior: Some frameworks have non-deterministic ops by default.
Mitigation: Set all random seeds. Note non-deterministic ops. Accept some variation.

---

## Environment Versioning

**Same code + different environment ≠ same results.**

**The environment includes:**
Python version.
All package versions (numpy, torch, transformers, etc.).
CUDA version (if using GPU).
OS / Linux distribution.
Hardware.

**Tools:**

**pip requirements.txt:**
List of packages and versions.
Simple but: Doesn't capture Python version, CUDA, OS.

**conda environment.yml:**
Better: Captures Python version, dependencies.
Cross-platform: Mostly reproducible across machines.

**Docker:**
Gold standard for reproducibility.
Packages everything: OS, Python, all packages.
"Run this Docker image → identical environment every time."
Dockerfile in Git → versioned environment.

**Key practice:**
Pin all dependencies to exact versions.
Not: `numpy >= 1.20` (could install different version each time).
Yes: `numpy==1.26.4` (always exact version).

---

## Lineage Tracking

**Which inputs produced which outputs?**

**Model lineage:**
Which code (Git commit) + which data (DVC commit) + which hyperparameters = which model version.
Full traceability from model to its origins.

**Why lineage matters:**
Compliance: "Which data was this model trained on?" (GDPR: Is any European user data in training set?)
Debugging: "Why did model degrade after deployment?" → Trace back to input changes.
Reproduction: "Reproduce model version 2.3.1" → Get all inputs.
Audit: "What changed between model v2.3.0 and v2.3.1?"

**Practical lineage implementation:**
When registering model in registry:
Store: Git commit hash, DVC commit hash, experiment run ID.
One ID per component → traceable back to everything.

**MLflow runs:**
Automatically logs: Git commit hash.
With DVC: Also log DVC commit.
Now: Model registry entry → MLflow run ID → Git commit + DVC commit.
Full lineage.

---

## Anthropic Insider Angle

Versioning at the scale of frontier models is uniquely challenging. The artifacts are enormous, the experiments are expensive, and mistakes have serious consequences.

**The Claude versioning challenge:** Each version of Claude has multiple components: Base model checkpoint, RLHF model checkpoint, Constitutional AI annotations, safety evaluation results, and associated system prompts. Tracking the lineage across all of these — and being able to answer "what changed from Claude 2 to Claude 3?" with precision — requires sophisticated version management. This is partly why model versioning is a first-class concern.

**Prompt versioning is underestimated:** One thing I emphasize to engineers building on Claude: Treat your system prompts with the same rigor as code. Version control them in Git. Have a testing suite for each version. Track evaluation metrics. Promotion workflow (staging → production). I've seen production incidents caused by "just tweaking the wording a bit" that had major quality implications. The engineering discipline around prompts is what separates amateurs from professionals.

**Experiment reproduction at frontier scale:** Full reproduction of frontier model training is very difficult even for us. Non-determinism in large-scale distributed training means that even with the same code, data, and hyperparameters, you won't get bit-for-bit identical weights. What we track instead: Configuration and behavior equivalence. Does this reproduce similar benchmark performance? Can we reconstruct the training run to understand what happened? Perfect reproduction isn't always possible — meaningful documentation is what matters.

**DVC for large datasets:** Training datasets for frontier models are terabytes to petabytes. DVC's model of "small pointer in Git, large files in object storage" scales to this. The key: Tracking not just the data but the pipeline that produced it. Which filtering steps, deduplication approaches, and quality filters were applied. This pipeline reproducibility is as important as the data itself.

---

## Common Misconceptions

**Misconception 1: "Git is sufficient for ML versioning"**
Git: Great for code. Terrible for large binary files (data, model weights). Need DVC for data, model registry for models, dedicated experiment tracking for runs.

**Misconception 2: "Version pinning is over-engineering"**
"Latest numpy" seems fine until: You can't reproduce a model 6 months later. A package update breaks your training code. Production uses different version than development. Pin everything. It's cheap insurance.

**Misconception 3: "Prompts don't need version control"**
Prompts = behavior. Unversioned prompts = uncontrolled behavior changes. Version prompts with the same rigor as code.

**Misconception 4: "Experiment tracking is only for large teams"**
Solo ML engineer: MLflow takes 1 day to set up. Saves hours of debugging over the following months. "Which hyperparameters did I use for that good experiment last month?" MLflow: instant lookup. Without it: hunting through old notebooks.

---

## Interview Questions

**Q1: ML mein kya-kya version karein? Regular software versioning se kaise alag hai?**

**Answer:** Regular software: Just code (Git). ML adds: (1) Code: Git (same as software). (2) Data: DVC — large binary files, Git pointers to DVC remote. (3) Model weights: Model registry — MLflow, SageMaker, custom. (4) Hyperparameters: Experiment tracking (MLflow, W&B). (5) Environment: Docker, requirements.txt pinned. (6) For LLMs: Prompts — Git + prompt registry. (7) Evaluation results: Tied to each experiment/model version. Why ML needs more: Data is a first-class artifact (not code). Same code + different data = different model. Same data + different code = different model. Must version both and link them. Also: Models can't be diffed like code (binary weights). Versioning serves different purposes: For data: "What was model trained on?" For models: "Roll back to previous version." For experiments: "Which hyperparameter change improved performance?"

**Q2: DVC kya hai? Data versioning kyun important hai?**

**Answer:** DVC (Data Version Control): Git for data. How it works: Large files stored in remote storage (S3, GCS). Tiny .dvc pointer files stored in Git. When you need data: dvc pull → fetches from storage. When you push data: dvc push → uploads to storage. Why data versioning important: (1) Reproducibility: "What data trained model v2.3?" → DVC commit reference in model registry → exact dataset. (2) Rollback: "New training data caused degradation." → Roll back to previous data version. Retrain. (3) Lineage: Understand transformation pipeline. Raw → Filtered → Augmented → Split. DVC tracks pipeline stages. (4) Collaboration: Multiple team members pull exact same dataset. No "works on my machine" data issues. (5) Compliance: GDPR. "Was European user data used?" → Trace which data files, check content. What to version: Training datasets. Validation/test sets. Preprocessing artifacts (e.g., vocabulary files, normalizer statistics). Evaluation datasets. Feature store snapshots.

**Q3: Experiment tracking kaise set up karein? Key things kya log karein?**

**Answer:** Setup (MLflow - 1 day effort): Install mlflow. Start tracking server (local or hosted). Instrument training code: Add mlflow.log_param(), mlflow.log_metric(), mlflow.log_artifact(). What to log: (1) Hyperparameters: ALL hyperparameters. Learning rate, batch size, architecture choices, loss function, optimizer. Nothing should be hardcoded without logging. (2) Metrics: Training loss curve. Validation metrics at each epoch. Final test set metrics. (3) Artifacts: Model checkpoint. Confusion matrix or evaluation plots. Training data stats. (4) Environment: Auto-logged: Python version, package versions, Git commit. Manual: Hardware config, GPU type. (5) Tags: Experiment group ("architecture_search"), owner ("john"), notes ("tried residual connections"). Result: Any experiment reproducible. Compare runs: Which hyperparameter change improved accuracy? Find best runs easily. Share with team without re-running. Pro tip: Use mlflow autolog for PyTorch/TensorFlow. Automatic logging of standard metrics and params. Add custom logging on top.

**Q4: Prompt versioning production mein kaise implement karein?**

**Answer:** Why treat prompts like code: Prompt = model behavior. Change prompt = change behavior. Without versioning: Can't track when behavior changed. Can't roll back. Can't A/B test systematically. Implementation: (1) Storage: Prompts in Git repository as files. prompts/customer_service_v3.2.1.txt Organized by use case + version. (2) Version format: Semantic versioning: v{major}.{minor}.{patch}. Major: Complete rewrite. Minor: Significant changes. Patch: Small tweaks. (3) Prompt registry: Database or config store: {prompt_id: "customer_service", version: "3.2.1", text: "..."} Application reads by: prompt_id + version OR prompt_id + "latest production". (4) Deployment config: production_config.yaml: customer_service_prompt_version: "3.2.1" Changing this config = changing which prompt is active. (5) Evaluation before promotion: For each prompt version: Run evaluation suite. Compare to current production metrics. Only promote if metrics improve or stable. (6) Testing prompts: Test on representative query set. Test edge cases. Test safety. Document expected behavior. Workflow: Write new prompt → Test → Staging deploy → A/B test → Full promotion.

**Q5: Lineage tracking kya hai? Compliance aur debugging mein kyun important hai?**

**Answer:** Lineage: Full traceability. Which inputs (code, data, config) → which outputs (model). Why for compliance: GDPR: User right to know/delete their data. If user data was in training set → must be able to identify and potentially retrain. Requires: Know exactly which data was used. Trace data source → user IDs. Financial regulations: "This credit model makes decisions based on what data? Trained how?" Auditability requires lineage. Why for debugging: Model degraded. Questions: Which data version? Any recent data pipeline changes? Which code version? Any recent code changes? With lineage: One query to model registry → all inputs. Narrow down quickly. Without lineage: Hunt through old Jupyter notebooks, Slack messages. Implementation: At model registration time, store: Git commit hash → code version. DVC commit hash → data version. MLflow run ID → hyperparameters + metrics. Date/time. Human notes. For LLMs: Also: Prompt version. RLHF annotation batch ID. Evaluation dataset version. Full lineage chain: "Model v2.3.1 was trained on dataset v4.7, using code at git commit abc123, with hyperparameters from MLflow run xyz."

**Q6: Environment versioning kaise handle karein? Common issues kya hain?**

**Answer:** Environment components: Python version, all packages (exact versions), CUDA/GPU driver versions, OS/base image. Tools by use case: requirements.txt: Basic Python packages. Simple but misses Python version, CUDA. Use: Minimal projects. conda environment.yml: Python version + packages. Better reproducibility. Cross-platform mostly. Use: Development environments. Docker: Gold standard. Everything: OS, Python, CUDA, packages. Reproducible anywhere Docker runs. Use: Production, CI/CD. Common issues: (1) "Works on my machine": Missing CUDA version. Package version differences. Fix: Docker. Same Docker image everywhere. (2) "numpy deprecated function" after upgrade: Package not pinned. pip install upgraded it. Fix: Pin ALL packages to exact versions. requirements.txt: numpy==1.26.4 (not numpy>=1.20). (3) CUDA version mismatch: PyTorch compiled with CUDA 12.1. Machine has CUDA 11.8. Fix: Docker with specific CUDA base image. (4) Non-determinism: Even same environment: Non-deterministic GPU operations. torch.use_deterministic_algorithms(True): Forces determinism at cost of some performance. Best practices: Docker in production: Always. Pin all dependencies: Always. Document CUDA version: Always. Test environment reproduction: Run fresh Docker build and verify training works.

---

## Key Takeaways

- **Version everything** = code (Git) + data (DVC) + models (registry) + prompts (Git+registry) + environment (Docker)
- **DVC** = Git for large data files; pointer in Git, data in S3/GCS
- **Model registry** = versioned models with metadata, lineage, and stage tracking
- **Experiment tracking** = log all params, metrics, artifacts per run; MLflow or W&B
- **Prompt versioning** = treat prompts like code; Git + semantic versioning + evaluation before promotion
- **Lineage** = which code + data + config → which model; essential for debugging + compliance
- **Environment** = Docker for production; pin all dependencies; document CUDA version
- **Reproducibility** = Git commit + DVC commit + MLflow run = fully specified experiment

---

*Agli file: `06_CI_CD_for_ML.md` — ML ke liye automated testing aur deployment pipeline*
