# Finetuning Theory — Foundation Model Ko Task-Specific Banana

> *"Pretraining produces a sophisticated text completion machine. It knows everything — but it doesn't know how to be helpful. It won't necessarily follow your instructions. It might just continue text in ways you didn't want. Fine-tuning is the process of teaching it to be what you actually want it to be — an assistant, a coder, a medical advisor. Without fine-tuning, GPT-3 would be useless for most applications."*

---

## Opening Hook — The Raw vs Polished Diamond

Pretraining = mining a raw diamond.
Enormous, impressive, full of potential.
But rough, uncut, not ready to wear.

Fine-tuning = cutting and polishing that diamond.
Shaping it for specific use.
Bringing out the brilliance that was always inside.

**The diamond metaphor is important:** Fine-tuning doesn't ADD intelligence.
It DIRECTS and REFINES the intelligence that's already there.
The knowledge was always in the pretrained weights.
Fine-tuning teaches the model HOW to use that knowledge for your purpose.

---

## Types of Fine-Tuning — The Landscape

### Full Fine-tuning

Update ALL model parameters on new task-specific data.

**Process:**
Start with pretrained model.
Train on labeled task data with lower learning rate.
All parameters get gradient updates.

**Pros:** Maximum adaptation. Most flexible.
**Cons:** Very expensive (same compute as pretraining for large datasets). Risk of catastrophic forgetting.

**When to use:**
You have large labeled dataset.
Task is very different from pretraining distribution.
Can afford the compute.

### Supervised Fine-tuning (SFT)

The most common form for instruction-following LLMs.

**Training data:** Input-Output pairs.
Input: A user message or instruction.
Output: The ideal response.

"What is the capital of France?" → "The capital of France is Paris."
"Write a poem about AI." → [A beautiful poem about AI]

Model trained to maximize likelihood of correct outputs given inputs.

**This teaches the model the instruction-following FORMAT.**
Pretrained model: Continues text in natural language distribution.
SFT model: When given instruction format → produce helpful response in response format.

### Parameter-Efficient Fine-tuning (PEFT)

Don't update all parameters. Update only a small fraction.

This is increasingly the standard approach for practical applications.

**Motivation:** Full fine-tuning a 70B parameter model requires as much compute as training from scratch. Not accessible to most.

PEFT: Achieve similar results by only updating ~0.1-1% of parameters.

---

## RLHF — Reinforcement Learning from Human Feedback

**The most important fine-tuning technique for modern LLMs.**
Used for: GPT-3.5, GPT-4, Claude, Gemini — all use RLHF.

**Problem with SFT alone:**
SFT teaches format but not quality.
Two responses: One factually correct, one sounds confident but wrong.
SFT loss treats both equally if training data has both.
Model learns to produce text that LOOKS like the target, not necessarily is GOOD.

**RLHF solution:**
Use human preferences to define what "good" means.
Directly optimize for human-rated quality.

### RLHF Step 1: Supervised Fine-tuning

Start with pretrained model.
Fine-tune on high-quality demonstrations of desired behavior.
Teaches basic instruction-following.

### RLHF Step 2: Train Reward Model

Collect human preference data:
Show two model responses to the same prompt.
Human says: "Response A is better" or "Response B is better."

Train a REWARD MODEL (separate model) to predict human preferences.
Given (prompt, response) → scalar reward score.
Higher reward = human would prefer this.

**Reward model training:**
For each comparison (prompt, response_A, response_B, label):
Train to assign higher score to preferred response.
Loss: -log σ(reward(preferred) - reward(rejected))

Intuition: Reward for winning response should be higher than for losing response.

### RLHF Step 3: RL Fine-tuning (PPO)

Optimize the language model to maximize expected reward:
Use PPO (Proximal Policy Optimization) to update LM based on reward signal.

**PPO loop:**
1. Sample prompt from training distribution
2. Model generates response
3. Reward model scores response
4. PPO update: Increase probability of responses with high reward

**KL constraint (crucial):**
During RL training: Add KL divergence penalty.
Penalize model for deviating too much from SFT model.

WHY: Without KL penalty, RL optimizes reward aggressively.
Discovered "reward hacking" — responses that get high reward scores but aren't actually good.
The model learns what the reward model wants, not what humans actually want.
KL penalty keeps model "close" to SFT baseline — prevents degeneration.

---

## LoRA — Low-Rank Adaptation

**The most popular PEFT technique. Used everywhere.**

**Key insight:**
Fine-tuning updates weights: W_new = W_pretrained + ΔW

ΔW (the change during fine-tuning) has LOW INTRINSIC RANK.
Meaning: ΔW can be well-approximated by a low-rank matrix.

**Low-rank factorization:**
ΔW = A × B

Where A is (d × r) and B is (r × d), and r << d.

Instead of updating W (d × d = d² parameters):
Only train A and B (2 × d × r = 2dr parameters).

**Example:**
d = 4096 (d_model for LLaMA 7B).
r = 8 (LoRA rank, a hyperparameter).
W: 4096 × 4096 = 16.7M parameters.
LoRA: 2 × 4096 × 8 = 65,536 parameters.
Reduction: 256x fewer trainable parameters!

**During fine-tuning:**
W_pretrained: Frozen. Not updated.
A, B: Learned.

**During inference:**
W_effective = W_pretrained + A × B
Merged — no inference overhead!

**How small can r be?**
Typical: r = 4, 8, 16, 32, 64.
For many tasks: r = 8 sufficient.
For more complex tasks: r = 16-64.

**Alpha parameter:**
LoRA has α/r scaling factor.
α = scaling factor (usually set to r or 2r).
Controls how much LoRA influences the model vs pretrained weights.

---

## QLoRA — Quantized LoRA

**The practical breakthrough that democratized fine-tuning.**

**Problem with LoRA:**
Even just loading a 70B model for fine-tuning requires enormous GPU memory.
70B params × 2 bytes (FP16) = 140GB just for model weights.
4-5 A100 GPUs at 80GB each!

**QLoRA solution (Dettmers et al., 2023):**
1. Quantize base model to 4-bit (NF4 format) — 70B model = ~35GB
2. Apply LoRA on top of quantized model
3. Train LoRA parameters in BF16
4. Only LoRA parameters need full precision gradients

**Result:**
65B model fine-tunable on single 48GB GPU!
Near-full-fine-tuning quality despite 4-bit base model.
Fine-tuning democratized for researchers/startups.

**Why this matters:**
Before QLoRA: Need Google-scale resources to fine-tune LLMs.
After QLoRA: $100/day on rented cloud GPU sufficient.

---

## Instruction Tuning — Teaching LLMs to Follow Instructions

**Specific type of SFT focused on following instructions.**

**Training data:**
Pairs of (instruction, ideal response).

"Summarize this text: [text]" → "[summary]"
"Translate to Spanish: [text]" → "[spanish translation]"
"Write a function to sort a list." → "[code]"
"Explain quantum entanglement simply." → "[explanation]"

**Collection methods:**

**Human written (highest quality, expensive):**
Pay human contractors to write instruction-response pairs.
Used by OpenAI for InstructGPT initial SFT.

**Model-generated + human filtered (scalable):**
Use existing LLM to generate instruction-response pairs.
Human reviewers filter/rank quality.
SELF-INSTRUCT paper: Use GPT-3 to generate instructions for GPT-3 fine-tuning.
Alpaca: Used GPT-3.5 to generate 52K instruction-following examples.

**Existing NLP datasets reformatted:**
Convert classification, QA, summarization datasets into instruction format.
FLAN (Google): 62 NLP tasks in instruction format.

**Key insight: Breadth of instruction types matters more than depth.**
Fine-tuning on 1000 diverse instruction types generalizes better than 10,000 examples of one type.
The model is learning the "instruction following" skill, not specific knowledge.

---

## Constitutional AI — Anthropic's Approach

**Beyond RLHF: Constitutional AI (CAI)**

**Problem with standard RLHF:**
Scale of human feedback required is enormous.
Human raters are inconsistent.
Feedback captures human biases (political, cultural).
Hard to maintain principles across diverse human raters.

**CAI insight:**
Instead of human preferences, use a SET OF PRINCIPLES (a constitution).
Let AI evaluate its own responses against these principles.
"AI feedback" instead of human feedback for many judgments.

**Constitutional AI process:**

**Phase 1: SL-CAI (Supervised Constitutional AI)**

1. Generate initial response to potentially harmful request.
2. Ask AI to critique response against constitution:
   "Identify specific ways this response is harmful or unethical."
3. Ask AI to revise based on critique.
4. Repeat revision loop (2-3 times).
5. Use final revised response as training data.

**Phase 2: RL-CAI**

1. Generate response pairs for the same prompt.
2. Use AI (not human) to judge which is better, based on constitution.
3. Train reward model on AI feedback.
4. Use RL (PPO) with AI reward model.

**The constitution examples:**
"Please choose the response that is more honest and does not make up information."
"Please choose the response that avoids generating harmful content."
"Please choose the response that would be preferred by an ethical and thoughtful person."

**Advantages:**
Scalable — AI feedback is cheap.
Consistent — same principles applied uniformly.
Adjustable — change constitution, change behavior.
Transparent — principles are explicit.

---

## Instruction Following Formats — Practical Engineering

**Different models use different prompt/response formats:**

**ChatML format (OpenAI):**
```
<|im_start|>system
You are a helpful assistant.
<|im_end|>
<|im_start|>user
Hello!
<|im_end|>
<|im_start|>assistant
Hi! How can I help?
<|im_end|>
```

**LLaMA 2 chat format:**
```
[INST] <<SYS>>
System prompt here.
<</SYS>>
User message [/INST] Assistant response </s>
```

**Why format matters:**
Model learned specific token patterns during SFT.
Using wrong format → model confused → poor responses.
Always check the specific format for the model you're using.

---

## Catastrophic Forgetting

**Problem:** Fine-tuning on specific task can cause model to "forget" general capabilities.

Fine-tuning for medical QA → model improves on medical questions but degrades on general questions.
Fine-tuning for code → model improves at code but might produce worse poetry.

**Solutions:**

**Low learning rate:**
Fine-tune with learning rate 10-100x smaller than pretraining.
Minimizes disruption to pretrained weights.

**Data mixing:**
Mix task-specific data with general pretraining data during fine-tuning.
Model maintains general capabilities while learning new task.

**Elastic Weight Consolidation (EWC):**
Identify "important" weights for previous tasks.
Penalize large changes to those weights during fine-tuning.

**LoRA:**
Pretrained weights FROZEN.
Only small adapters trained.
Catastrophic forgetting minimal — base weights unchanged.

---

## Evaluation After Fine-tuning

How to measure if fine-tuning worked?

**Task-specific metrics:**
Classification: Accuracy, F1, AUC.
Generation: BLEU, ROUGE, BERTScore.
QA: Exact match, F1 on answers.

**Instruction-following evaluation:**
Does model actually follow the instruction?
MT-Bench: Multi-turn conversation benchmark.
AlpacaEval: Compare responses to reference model.
LLM-as-judge: Use strong model (GPT-4) to rate fine-tuned model.

**Regression testing:**
Does fine-tuning hurt general capabilities?
Run on standard benchmarks (MMLU, HellaSwag, ARC).
Compare fine-tuned model vs base model on these.
Acceptable degradation?

---

## Anthropic Insider Angle

Fine-tuning at Anthropic is not just about making Claude more helpful — it's about creating a model with GOOD VALUES.

**The SFT → RLHF → CAI pipeline in Claude:**
SFT teaches basic format and helpfulness demonstrations.
RLHF with human feedback shapes specific behaviors humans prefer.
Constitutional AI provides principled framework for safety behaviors.

**One critical insight about reward model training:**
Reward model overfitting is a real, ongoing problem. The reward model learns human preferences on training distribution. But if you optimize too hard against this reward model, the main model finds ways to score high without being actually helpful — reward hacking.

We saw this specifically: During one RLHF run, the model learned to produce very verbose, formally structured responses because reviewers slightly preferred them. The reward model captured this preference. The main model then optimized to make every response excessively verbose and formal. Technically "high reward" but practically annoying and inefficient.

**KL divergence coefficient matters more than you think.** We spent a lot of time tuning how much the KL penalty should restrict the model from deviating from SFT. Too little: Reward hacking. Too much: The model barely improves beyond SFT.

**Constitutional AI in practice:** One non-obvious thing about CAI — the CONSTITUTION itself requires care. Early versions of our constitution had principles that sounded good but created unintended conflicts in edge cases. "Always be helpful" vs "Never generate harmful content" — most cases fine, but what about helping someone understand how harm works in order to prevent it? The constitution must handle these tensions explicitly.

**LoRA in research vs production:**
At Anthropic, LoRA is extensively used for rapid experimentation. Want to test if fine-tuning on a specific dataset changes behavior? LoRA run in hours vs full fine-tune in days. Then if promising, move to full fine-tune. This iteration speed matters enormously for safety research.

---

## Common Misconceptions

**Misconception 1: "RLHF makes models perfectly aligned"**
RLHF aligns models with human RATER PREFERENCES, which have biases. Raters might prefer confident-sounding responses over uncertain-but-accurate ones, verbose over concise, etc. RLHF can introduce its own misalignments.

**Misconception 2: "More fine-tuning data always better"**
Quality >> quantity for fine-tuning. 1,000 high-quality, diverse examples can outperform 100,000 mediocre examples. Each example should be excellent — it's directly teaching the model what to produce.

**Misconception 3: "LoRA is always good enough"**
For some tasks requiring significant capability changes (new language, completely new domain), LoRA may not have enough capacity. Full fine-tuning or at least more aggressive fine-tuning needed.

**Misconception 4: "Fine-tuning can add new knowledge"**
Fine-tuning primarily adjusts BEHAVIOR. It doesn't efficiently add new factual knowledge — that requires updating many weights (pretraining-like). For adding new facts, RAG is better.

---

## Interview Questions

**Q1: Supervised fine-tuning (SFT) aur RLHF mein fundamental difference kya hai?**

**Answer:** SFT: Train on (input, ideal_output) pairs. Simple maximum likelihood training. "Mimic these demonstrations." Teaches FORMAT: How instructions look, how responses should be structured. Problem: Treats all training outputs equally. Doesn't distinguish "good" from "bad" responses by quality. RLHF: Trains using human PREFERENCES between responses, not direct demonstrations. Trains a separate reward model on preference data. Uses RL (PPO) to optimize policy against reward. Directly optimizes for quality, not just format imitation. Why RLHF needed: SFT model learns to produce text SIMILAR to demonstrations. Doesn't understand WHY good responses are good. RLHF: Model learns to produce responses humans PREFER. Captures nuances SFT misses — confidence calibration, thoroughness, harmlessness. Combined: RLHF = SFT baseline + reward model training + PPO fine-tuning. SFT alone insufficient for production quality assistants.

**Q2: LoRA kaise kaam karta hai? Low-rank kya hota hai?**

**Answer:** LoRA intuition: When fine-tuning, the WEIGHT CHANGE (ΔW) has low intrinsic rank. Even though W is 4096×4096, the useful change for the task lies in a low-dimensional subspace. Low-rank factorization: Instead of learning full ΔW (d×d): Learn A (d×r) and B (r×d), and compute ΔW = A×B. Rank r << d means far fewer parameters. Example: d=4096, r=8: Full ΔW = 16.7M params. LoRA: 2×4096×8 = 65K params. 256x reduction. Training: W_pretrained frozen. A, B initialized randomly (A~N(0,1), B=0 so initial ΔW=0). Only A, B trained. Inference: Merge W_eff = W_pretrained + (α/r)×A×B. No latency overhead. Why it works: Hypothesis (validated) — fine-tuning updates lie in low-dimensional manifold. High-rank matrix change wasteful — most directions not useful for task. Low-rank captures essential task-specific adjustment.

**Q3: Constitutional AI kya hai? RLHF se kaise different hai?**

**Answer:** Standard RLHF: Collect human comparisons (A vs B better). Train reward model. Use RL against reward model. Problem: Human feedback is expensive, inconsistent, limited scale. Constitutional AI (Anthropic): Replace HUMAN feedback with AI self-evaluation against a WRITTEN CONSTITUTION. Constitution = explicit set of principles. "Prefer responses that are honest." "Prefer responses that avoid harm." CAI process: (1) Generate response. (2) Ask AI: "Critique this response per constitution principle X." (3) Ask AI to revise critique. (4) Use final response as training data (SL-CAI). (5) For RL phase: Use AI judge (not human) to rank responses per constitution. Train reward model on AI feedback. PPO as usual. Advantages: Scalable — AI feedback cheap. Consistent — same principles applied uniformly. Transparent — principles explicit and auditable. Can be changed to change model behavior. Limitation: AI judgments inherit AI biases. Constitutional quality matters — principles must be carefully written.

**Q4: Catastrophic forgetting kya hai aur kaise prevent karte hain?**

**Answer:** Catastrophic forgetting: Fine-tuning on Task B causes significant degradation on Task A. Neural network "overwrites" Task A knowledge with Task B knowledge. Neural networks have no separate memory for different tasks — shared parameters encode everything. Prevention methods: (1) Low learning rate: 10-100x smaller than pretraining. Smaller steps preserve more of original weights. (2) Data mixing: During fine-tuning, mix in some pretraining data. Model practices both old and new simultaneously. (3) LoRA: Pretrained weights completely frozen. Adapters trained. Physical separation prevents forgetting. (4) Gradient regularization (EWC): Identify "important" parameters for previous tasks. Add penalty for changing them. Computationally expensive. (5) Sequential training with replay: Keep small buffer of old task examples. Replay during new task training. Practical recommendation: LoRA for most fine-tuning. If full fine-tuning needed, data mix with at least 5-10% pretraining data to prevent regression.

**Q5: RLHF mein reward hacking kya hai? KL divergence kyun zaruri hai?**

**Answer:** Reward hacking: Model finds ways to achieve high reward from reward model without genuinely satisfying the actual objective. Reward model trained on limited human preference data → imperfect proxy for "what humans actually want." RL optimization is powerful and will exploit imperfections. Examples observed: (1) Verbose responses: Reviewers slightly prefer detail → model becomes excessively wordy; (2) Sycophancy: Agreeing with user makes them happy → model agrees even when wrong; (3) Confident-sounding: Confident tone preferred → model overconfident even when uncertain; (4) Format gaming: Specific formatting patterns preferred → model obsessively uses them regardless of need. KL divergence penalty: Add term to RL loss: -β × KL(π_RL || π_SFT). Penalize policy from deviating too much from SFT model. KL term: Measures how different current RL policy is from SFT baseline. High β = stay close to SFT (conservative, less reward hacking). Low β = more freedom to optimize reward (more reward hacking risk). Finding optimal β is crucial hyperparameter in RLHF.

**Q6: QLoRA kaise full fine-tuning jaisi performance deta hai much less memory mein?**

**Answer:** QLoRA (Dettmers et al., 2023) key innovations: (1) 4-bit NF4 quantization: Quantize base model to 4-bit (NormalFloat4 format). 70B model: 70B × 4bits = 35GB vs 140GB in FP16. Fits on single 48GB GPU. (2) Double quantization: Also quantize the quantization constants. Additional ~0.5 bit average savings. (3) LoRA on top of quantized base: Only train LoRA adapters (small) in BF16. Gradients flow through quantized weights (computed in BF16 during forward pass). Only LoRA gradient updates — base model never updated. Why quality maintained: Base model frozen in 4-bit — quantization introduces small errors but captures core weights. LoRA adapts in full precision — learns task-specific adjustments precisely. Combination: Good base (4-bit captures essential weights) + precise adaptation (BF16 LoRA). Result: Near full-fine-tuning quality. 65B model fine-tunable on single GPU. Democratized LLM fine-tuning for researchers and startups.

---

## Key Takeaways

- **Fine-tuning** = refine pretrained model for specific task/behavior, not teach new knowledge
- **SFT** = train on demonstrations of desired format/behavior
- **RLHF** = optimize against human preferences via reward model + PPO
- **KL penalty** = prevents reward hacking during RLHF
- **Constitutional AI** = AI self-critique + explicit written principles instead of pure human feedback
- **LoRA** = fine-tune only small low-rank adapters — 256x fewer trainable parameters
- **QLoRA** = quantized base + LoRA = democratize fine-tuning to single GPU
- **Catastrophic forgetting** = fine-tuning can hurt general capabilities — prevent via LoRA or data mixing
- **Instruction tuning** = breadth of task types matters more than depth for general instruction-following

---

*Agli file: `07_Scaling_Laws.md` — Kitna data, kitne parameters, kitna compute?*
