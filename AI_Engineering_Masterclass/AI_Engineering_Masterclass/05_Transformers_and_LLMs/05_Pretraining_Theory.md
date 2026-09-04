# Pretraining Theory — LLMs Ko Kaise Sikhate Hain Sab Kuch

> *"Pretraining — yeh word sunke lagta hai koi aur training hai, secondary process. Reality mein yahi primary hai, yahi most expensive hai, yahi model ki core capabilities decide karta hai. GPT-4 training ka estimated cost: $50-100 MILLION dollars. Ek single training run. Iski taraf ye sochke dekho."*

---

## Opening Hook — Internet Ki Puri Library

Imagine karo tum 300 billion pages of text pad rahe ho.
Wikipedia. Reddit. GitHub. arXiv papers. Books. News. Legal documents. Scientific journals.

Pagine pe page. Hour ke baad hour. Month ke baad month.

Aur pura kaam ek hi hai: **Predict what word comes next.**

Itna simple. Itna powerful. Itna expensive.

**Yahi hai pretraining.**

---

## Pretraining Kya Hai?

**Pretraining:** Training a neural network on a MASSIVE amount of unlabeled data with a self-supervised objective, before any task-specific fine-tuning.

**"Pre" kyun hai naam mein?**
This training comes BEFORE any specific task training.
Foundation layer. General capabilities.

**Self-supervised objective:**
Labels automatically derived from the data itself.
No human annotation needed.
"Predict next token" — the input IS the label.

**Scale:**
Typical LLM pretraining:
- Data: 300B - 10T tokens (text from internet + books + code)
- Parameters: 7B - 1T+
- Compute: Thousands of GPUs/TPUs, weeks to months
- Cost: $1M - $100M+

---

## The Pretraining Objective — Self-Supervised Learning

**For decoder-only (GPT-style) models:**

Next token prediction (autoregressive language modeling):
Given tokens [t₁, t₂, ..., tₙ], predict tₙ₊₁.

More precisely: Maximize likelihood of training data.
P(t₁, t₂, ..., tₙ) = Π P(tᵢ | t₁, ..., tᵢ₋₁)

In practice: Minimize cross-entropy loss.
Loss = -log P(correct_next_token | previous_tokens)

**Why this works as a training signal:**
To predict the next word accurately, you must:
- Understand grammar: "The dog [sat/sit/sleep]?" → syntax
- Know world facts: "Paris is the capital of [France]" → knowledge
- Track long-range context: "John walked in. [He] sat down" → coreference
- Understand discourse: What's relevant to continue a conversation?

One simple objective → forces learning everything about language.

---

## Training Data — The First Critical Decision

**What goes in training data determines model capabilities.**

**GPT-3 training data mix:**
- Common Crawl (web pages): 60%
- WebText2 (Reddit-filtered links): 22%
- Books1 (books): 8%
- Books2 (Gutenberg, Internet Archive): 8%
- Wikipedia: 3%

**Key considerations in data selection:**

### Quality Filtering
Web crawl data is noisy. Need to filter:
- Deduplication: Remove duplicate documents
- Language filtering: Keep target language
- Pornographic/low-quality content filtering
- Near-duplicate removal
- Quality heuristics: Minimum length, perplexity thresholds

**C4 (Colossal, Cleaned, Crawled Corpus):**
Web crawl filtered aggressively. Used for T5.
Rules: Remove lines not ending in punctuation. Remove pages with "lorem ipsum". Filter languages. Deduplicate. Etc.

### Data Mixture
Different data types contribute different capabilities:
- Web text: General world knowledge, common language
- Books: Long-form reasoning, narrative structure
- Scientific papers: Technical concepts, logical reasoning
- Code: Structured reasoning, algorithmic thinking, programming
- Wikipedia: Factual accuracy, diverse topics
- Multilingual data: Multiple language capabilities

**Mixture matters:** More code in training → better coding.
More reasoning examples → better reasoning.
More multilingual → better non-English.

---

## Data Deduplication — Why It Matters More Than You Think

**Problem:**
Internet has enormous duplicate content.
Same Wikipedia article in 10 different scraped versions.
Popular quotes repeated millions of times.
Boilerplate text (cookie notices, "All rights reserved") everywhere.

**Effect on model:**
Model sees duplicates many more times → overfits to them.
Memorization instead of generalization.
Model learns to output common phrases verbatim.
Worse performance on rare, important knowledge.

**Deduplication methods:**
Exact deduplication: Remove byte-for-byte identical documents.
Near-duplicate: MinHash, LSH-based similarity.
Sentence-level deduplication: Even within different documents, remove repeated sentences.

**LLaMA 2 findings:**
Careful deduplication improved downstream performance significantly.
Even removing 30% of data via deduplication → better model than using all duplicated data.

**Key insight:** Data quality > data quantity beyond a point.

---

## The Mechanics of LLM Pretraining

### Data Preprocessing Pipeline

1. Download web crawl data (petabytes of HTML)
2. Extract text (remove HTML tags, scripts)
3. Language identification (keep English/target languages)
4. Quality filtering (remove low-quality content)
5. Deduplication (exact + near-duplicate)
6. Tokenization (apply tokenizer, convert to token IDs)
7. Pack into fixed-length chunks (e.g., 4096 tokens each)
8. Shuffle and create training dataset

### Packed Sequences

Pretraining doesn't process separate documents individually.
Pack multiple short documents end-to-end to fill context window.

"Doc1_tokens[EOS]Doc2_tokens[EOS]Doc3_tokens[EOS]..." all packed to 4096 tokens.

Documents separated by End-of-Sequence token.
Model learns: [EOS] = "new document starts."
Attention: Often block documents with attention mask so one doc doesn't attend to previous doc.

### Mini-Batch Training

Mini-batch: Typically 1M-4M tokens per step.
(GPT-3: batch size = 3.2M tokens)

Why large batches?
- More stable gradients
- Better GPU utilization
- Allows larger learning rates (with warmup)

Number of training steps = Total tokens / batch size
GPT-3: 300B tokens / 3.2M tokens per step = ~93,750 steps

### Optimization During Pretraining

**Optimizer:** AdamW (standard).
**Learning rate schedule:**
- Warmup: First 0.1-1% of training, increase LR from 0 to max.
- Cosine decay: Gradually decrease LR for remaining training.
- Final LR: Often ~10% of max LR.

**Why warmup?**
At start: Weights random, gradients volatile.
Large LR early → unstable training, potential early collapse.
Warmup: Start small, let optimization stabilize, then increase.

**Gradient clipping:** Clip gradient norm at 1.0. Prevents explosion.

**Mixed precision:** BF16 (Brain Float 16) for activations + FP32 for critical operations (weight updates).

---

## Compute Requirements — The Numbers

**Training compute formula:**
C ≈ 6 × N × D
C = total FLOPs
N = model parameters
D = training tokens

**Why 6?**
Each token, each parameter: 2 multiplications (forward + backward ≈ 2× forward).
Forward pass: 2 × N FLOPs (multiply + add).
Backward: ~4 × N FLOPs (gradient computation).
Total: 6 × N per token.

**Examples:**
GPT-3 (175B params, 300B tokens): 6 × 175B × 300B = 3.15 × 10²³ FLOPs
A100 GPU: ~3 × 10¹⁴ FLOPs/second (at BF16)
Training time: 3.15 × 10²³ / 3 × 10¹⁴ = 1.05 × 10⁹ GPU-seconds = ~3,000 GPU-years!

**In practice:** Used 10,000 GPUs for months.

**Cost:**
A100 GPU hour: ~$3.
10,000 GPUs × 24h × 90 days = 21.6M GPU-hours × $3 = ~$65M for GPT-3 training.

This is why only large companies train foundation models.

---

## Distributed Training — Making It Feasible

Training LLMs requires distributing across hundreds to thousands of GPUs.

### Data Parallelism

Simplest form: Same model on each GPU, different data.

Each GPU processes its own mini-batch.
Gradients averaged across all GPUs (all-reduce).
All GPUs update parameters synchronously.

**Problem:** Model must fit on one GPU. GPT-3 at 175B params = ~350GB in FP16.
A100 has 80GB. 175B doesn't fit on one GPU!

### Tensor Parallelism (Model Parallelism)

Split individual layers across GPUs.

Attention layer: Each GPU handles subset of attention heads.
FFN layer: Each GPU handles subset of neurons.

Requires: Frequent communication between GPUs (all-reduce within each layer).
GPUs must be connected with fast interconnect (NVLink for within-node, InfiniBand across nodes).

### Pipeline Parallelism

Split model layers across GPUs.
GPU 1: Layers 1-12.
GPU 2: Layers 13-24.
GPU 3: Layers 25-36.
GPU 4: Layers 37-48.

Micro-batches pipeline through: GPU 1 finishes micro-batch, passes to GPU 2, starts next micro-batch.

Reduces "pipeline bubble" (idle time).

### Combination: 3D Parallelism

Modern LLM training: All three combined.
Data parallel: Multiple replicas.
Tensor parallel: Split layers within node.
Pipeline parallel: Distribute layers across nodes.

GPT-3: 3D parallelism across thousands of A100s.

**Megatron-LM (NVIDIA) + DeepSpeed (Microsoft):** Frameworks for this.

---

## Chinchilla Scaling Laws — Optimal Training

**2022. Hoffmann et al. (DeepMind). "Training Compute-Optimal Large Language Models."**

**Key finding:** For a given compute budget, what's the optimal model size vs training tokens?

**Earlier assumption (Kaplan et al. 2020):** More parameters better. Training longer helps marginally.

**Chinchilla finding:** MODELS WERE UNDERTRAINED.

Optimal ratio: **Training tokens ≈ 20 × model parameters**

For 70B parameter model: Train on 70B × 20 = 1.4 TRILLION tokens.

**Evidence:**
Chinchilla (70B params, 1.4T tokens) outperformed Gopher (280B params, 300B tokens).
4x smaller model, better performance, by training 4x longer on more data.

**Why this happened:**
GPT-3 (175B, 300B tokens) was undertrained by this metric.
Models too large for the data they were trained on.
Training longer > training bigger (at same compute budget).

**Chinchilla-optimal recipe:**
Double compute budget → Double both parameters AND tokens equally.

**Modern LLMs applied this:**
LLaMA 2 (7B params): Trained on 2T tokens (way beyond Chinchilla optimal).
Deliberate choice: Overtrain smaller models = better at inference (smaller model, cheaper deployment).

---

## What Gets Learned During Pretraining

Pretraining is mysterious — nobody programs these in explicitly.

**Factual knowledge:**
Model stores facts from training data in FFN weights.
"The Eiffel Tower is in Paris."
"Python uses indentation for blocks."
"H₂O = water."

**Reasoning patterns:**
From math papers, proofs, logic text → model learns inference patterns.
"If A then B. A is true. Therefore B."
Logical and mathematical reasoning emerge.

**World models:**
From physical descriptions, stories → implicit physics/social models.
"Dropped ball falls down." (Physics)
"Insulting someone makes them sad." (Psychology)

**Language skills:**
Grammar, syntax, discourse structure.
How to write formal vs informal.
Narrative structure, argumentation.

**Code:**
From GitHub: Programming patterns, debugging, API usage.
"def function_name():" convention.
Common algorithms.

**All of this EMERGES from just predicting next tokens.** Nothing is programmed explicitly.

---

## Pretraining vs Pre-training for Different Modalities

The pretraining paradigm extends beyond text:

**Vision (MAE — Masked Autoencoders):**
Mask 75% of image patches.
Predict the masked patches.
Same self-supervised principle as BERT MLM, but for images.
ViTs pretrained this way outperform supervised training.

**Code (CodeBERT, Codex, StarCoder):**
Pretrain on GitHub code.
Enables powerful code generation and understanding.

**Audio (Wav2Vec 2.0):**
Mask audio segments, predict representations.
Strong pretrained audio encoders from unlabeled audio.

**Multimodal (CLIP, DALL-E):**
Pretrain on image-text pairs.
Learns multimodal representations.

**The pretraining paradigm is universal:** Self-supervised learning on large unlabeled data → strong representations → fine-tune or prompt for specific tasks.

---

## Data Mixture and Capability Transfer

**Interesting phenomenon:** Training on code improves reasoning on non-code tasks.

**Finding (Liang et al.):** Models trained on more code → better mathematical reasoning, even on pure math problems with no code.

**Why?** Code requires:
- Formal, precise reasoning
- Step-by-step problem decomposition
- Error tracking (bugs must be found and fixed)
- Abstract thinking (functions, variables, control flow)

These reasoning patterns TRANSFER to non-code domains.

Implication: Carefully curated data mixtures = better capabilities than pure language.

**The "code makes you smarter" phenomenon in LLMs.**

---

## Anthropic Insider Angle

Pretraining at Anthropic is the foundation of everything Claude can do.

**Data curation quality:** One thing I can say is that data quality decisions at Anthropic are taken very seriously. We don't just dump Common Crawl in — there's significant engineering effort in filtering, quality assessment, and mixture design. The specific mix and filtering criteria are proprietary, but the principle is: garbage in, garbage out, scaled up.

**Constitutional AI starts from pretraining:** You might think Constitutional AI is just a fine-tuning technique. But the pretraining data matters enormously. Claude's helpfulness, honesty, and harmlessness depend partly on what was in the pretraining data. Constitutional AI then SHAPES these dispositions during fine-tuning — but you're working with clay that pretraining shaped.

**One observation about pretraining at scale:** During pretraining monitoring, we watch for "loss spikes" — sudden increases in training loss. These happen occasionally, usually due to a batch of unusual data. You can usually see in the data what caused it. Sometimes it's just a patch of very dense technical text. Sometimes it's a sequence of code with unusual structure. The model "struggles" on these batches, then recovers. This struggle-and-recovery is actually important — it's part of how the model learns to handle diverse inputs.

**Emergent capabilities timing:** There are specific capability "breakpoints" we observed at certain training depths — not at specific parameter counts (which everyone talks about), but at specific token counts. Certain reasoning capabilities seem to emerge not just from scale but from seeing enough DIVERSE examples. This is why data mixture matters as much as compute.

---

## Common Misconceptions

**Misconception 1: "Pretraining teaches the model facts"**
More precisely: Pretraining embeds statistical associations. The model learns that "Paris" follows "capital of France" — but whether this is "stored knowledge" or "statistical pattern" is philosophically ambiguous. Factual accuracy depends on training data quality.

**Misconception 2: "More training data always better"**
Diminishing returns. Also: Low-quality data can hurt. Carefully curated smaller dataset > larger noisy dataset.

**Misconception 3: "Pretraining = one-time cost"**
LLMs get retrained periodically as new data becomes available, capabilities need updating, or training improvements found. Not a one-time thing for frontier models.

**Misconception 4: "Fine-tuning can fix pretraining mistakes"**
Fine-tuning shapes behavior but doesn't deeply modify fundamental knowledge or capabilities. If the model learned something wrong in pretraining (wrong facts, reasoning errors), fine-tuning can mask these but not fully correct them.

---

## Interview Questions

**Q1: LLM pretraining ka objective kya hai? Self-supervised kaise hai?**

**Answer:** LLM pretraining objective (decoder models): Next token prediction. Given [t₁, ..., tₙ], predict tₙ₊₁. Minimize cross-entropy loss over next token. Train on entire text — no special labeling needed. Self-supervised kyon: Labels automatically derived from input. The "correct next token" is the actual next token in training text. No human annotation required. This enables training on trillion-token scale (no human labelers needed for that much data). Why powerful: Correctly predicting next token at scale requires: Understanding grammar and syntax; World knowledge (facts, relationships); Long-range context tracking; Discourse structure and narrative. Simple objective forces learning complex world model.

**Q2: Chinchilla scaling laws kya batate hain? LLM training pe kya impact pada?**

**Answer:** Chinchilla (2022, DeepMind): Research question — for a fixed compute budget, what model size and training data amount is optimal? Finding: Previous models (GPT-3, Gopher) were UNDERTRAINED relative to their parameter count. Optimal: Training tokens ≈ 20 × number of parameters. Example: 70B parameter model → optimally train on 1.4T tokens. Chinchilla (70B params, 1.4T tokens) outperformed Gopher (280B params, 300B tokens) despite being 4x smaller. Impact: (1) Shifted focus from "bigger models" to "more training tokens." (2) LLaMA 1/2: Deliberately small models trained on massive data — better inference efficiency. (3) Mistral 7B: Significantly outperforms early 13B models because trained longer. (4) Rule of thumb for practitioners: If choosing between bigger model less training vs smaller model more training, lean toward more training tokens.

**Q3: LLM training mein data quality kyun data quantity se zyada important hai?**

**Answer:** Data quality problems at scale: (1) Duplicates: Same text appears 100x → model overfits, learns to reproduce verbatim. Less generalization. (2) Low-quality web content: SEO spam, auto-generated text, boilerplate → teaches model to produce similar low-quality output. (3) Factual errors: Incorrect information in training data → model learns and reproduces incorrect facts. (4) Harmful content: Slurs, bias, harmful instructions → learned patterns difficult to remove later. Evidence: RoBERTa vs BERT — same architecture, RoBERTa trained on better quality data → significantly better. LLaMA 2 findings: Deduplication improved performance more than expected. Quality filtering approaches: MinHash deduplication, language filtering, quality classifiers trained on high-quality text (Wikipedia articles) to score web content. Rule: 1T high-quality tokens > 3T raw web tokens.

**Q4: LLM pretraining distribute kaise kiya jaata hai? Key parallelism strategies kya hain?**

**Answer:** Three main parallelism types for LLM training: Data Parallelism: Multiple copies of model, different data each. Gradients averaged across all replicas. Simple but requires model to fit on one GPU. Tensor Parallelism: Split individual layers across GPUs. Attention heads distributed. FFN neurons distributed. Requires fast GPU-GPU communication (NVLink). Pipeline Parallelism: Different layers on different GPUs. GPU 1: layers 1-12; GPU 2: layers 13-24, etc. Micro-batches pipeline through reducing idle time. 3D Parallelism: Combine all three. Modern training: Data parallel across nodes + Tensor parallel within node (same-GPU NVLink) + Pipeline across node groups. Frameworks: NVIDIA Megatron-LM (tensor parallelism). Microsoft DeepSpeed (ZeRO optimizer — reduces memory requirements). Result: 1000-10000 GPUs working together to train a single model.

**Q5: Pretraining data mein code include karna kyun baaki tasks ko improve karta hai?**

**Answer:** Finding: Models trained with more code → better mathematical reasoning, even on pure text math problems. Why code improves reasoning: (1) Code requires precise, formal specification — ambiguity not tolerated; (2) Algorithmic thinking: Step-by-step decomposition of complex problems; (3) Error tracking: Bugs must be caught, located, fixed — systematic debugging; (4) Abstraction: Functions, classes, variables — managing complexity via abstraction; (5) Logic: Control flow, conditionals, loops — formal logical reasoning. These patterns TRANSFER to non-code domains. Math proofs and code share structural similarity. Scientific reasoning shares step-by-step precision. Evidence: CodeX (Codex trained on code) showed better at multi-step reasoning than GPT-3 trained without code. Practical implication: AI coding assistants like GitHub Copilot — not just code generation. The code training made underlying model smarter across all domains.

**Q6: LLM pretraining ke baad model kya jaanta hai aur kya nahi jaanta?**

**Answer:** What pretraining teaches: (1) Language patterns: Grammar, syntax, discourse structure of training languages; (2) World knowledge: Facts, relationships, concepts seen in training data; (3) Reasoning patterns: Logical inference, mathematical steps, causal reasoning seen in text; (4) Code: Programming patterns, algorithms, debugging from GitHub; (5) Common sense: Physics, social dynamics, cultural norms from everyday text. What pretraining does NOT teach: (1) Following instructions: Pretrained models are not "assistant-brained" — they continue text, not follow commands; (2) Harmlessness: May produce harmful content if continuation seems "natural"; (3) Recent events: Training data has cutoff date — no knowledge after that; (4) Specific task format: "Return JSON output" — not naturally understood; (5) "True" reasoning: May produce confident but wrong answers (hallucination). Gap filled by: RLHF / instruction tuning = teaches following instructions + safety. RAG = provides recent/specific information. Fine-tuning = teaches domain-specific tasks/formats.

---

## Key Takeaways

- **Pretraining** = train on massive unlabeled text via next-token prediction
- **Self-supervised** = labels come from data itself, no human annotation needed
- **Data quality > quantity** — deduplication and filtering critical
- **Compute scaling** = 6 × N_params × N_tokens FLOPs
- **Chinchilla** = train smaller models on more data (20 tokens per param optimal)
- **Distributed training** = 3D parallelism (data + tensor + pipeline) enables scale
- **Emergent capabilities** = reasoning, world knowledge, code understanding all emerge
- **Code in training** = improves reasoning across all domains
- **Pretraining ≠ instruction following** — RLHF needed to add that

---

*Agli file: `06_Finetuning_Theory.md` — Foundation model ko task-specific banana*
