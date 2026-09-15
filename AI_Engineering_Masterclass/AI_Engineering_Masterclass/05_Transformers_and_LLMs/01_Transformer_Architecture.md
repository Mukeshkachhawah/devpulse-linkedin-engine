# Transformer Architecture — "Attention Is All You Need" Ka Poora Breakdown

> *"June 2017. Main Google Brain ke ek seminar mein tha jab yeh paper present hua. Title hi provocative tha — 'Attention Is All You Need.' Kuch log eye-roll kar rahe the. 'Sirf attention? No recurrence? No convolution?' 6 saal baad, woh paper literally every major AI system ki backbone hai."*

---

## Opening Hook — Ek Paper Jo Puri Field Badal Gayi

**"Attention Is All You Need"** — Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin (2017)

8 authors. Most from Google Brain / Google Research.

The claim: You don't need RNNs. You don't need CNNs. Just attention, applied cleverly with some other components, is enough to build the best NLP models.

**At the time:** RNNs with attention were SOTA. This paper proposed eliminating RNNs entirely — keeping ONLY attention.

**Result:** Outperformed all previous NLP systems. By a lot.

**Legacy:** GPT-1, BERT, GPT-2, T5, GPT-3, ChatGPT, Claude, Gemini — all Transformer variants.

---

## The Transformer — High-Level View

Transformer has two main components:

**Encoder:** Processes input → creates rich representation.
**Decoder:** Generates output → token by token.

For translation: Encoder processes source language, Decoder generates target language.
For language modeling (GPT): Only Decoder used.
For understanding (BERT): Only Encoder used.

---

## Encoder Architecture — Layer by Layer

Each encoder layer has two sublayers:

**Sublayer 1: Multi-Head Self-Attention**
Each position attends to all other positions.
Allows modeling relationships between any two positions.

**Sublayer 2: Feed-Forward Network (FFN)**
Two linear transformations with ReLU (or GELU) in between.
Applied independently to each position.
FFN(x) = max(0, xW₁ + b₁)W₂ + b₂

**Around each sublayer: Residual Connection + Layer Normalization**
Output = LayerNorm(x + Sublayer(x))

The residual connection (+ x) allows gradient to flow directly.
LayerNorm stabilizes training.

**Stack N encoder layers.** Original paper: N=6.

---

## Decoder Architecture

Each decoder layer has THREE sublayers:

**Sublayer 1: Masked Multi-Head Self-Attention**
Attends to previously generated tokens only (causal masking).
Can't peek at future tokens.

**Sublayer 2: Cross-Attention**
Queries from decoder, Keys+Values from encoder.
Allows decoder to attend to input sequence.

**Sublayer 3: Feed-Forward Network**
Same as encoder.

**Same residual + LayerNorm pattern around each sublayer.**

---

## Input Representation — Before the First Layer

**Token Embeddings:**
Input tokens → dense vectors via learned embedding matrix.
Each token = row in embedding matrix.
Dimension: d_model (e.g., 512 in original paper, 768 in BERT-base, 1024 in GPT-2, 12288 in GPT-3).

**Positional Encoding:**
Attention is PERMUTATION INVARIANT — doesn't naturally know position.
"cat sat mat" and "mat sat cat" would produce same attention (without position).

Original paper: SINUSOIDAL positional encoding.
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

Different dimensions use different frequencies.

**Properties:**
- Position encodings have the same dimension as token embeddings
- They can be ADDED together (not concatenated)
- Periodic patterns allow model to detect relative positions

**Modern LLMs: Learned positional embeddings or Rotary Positional Embeddings (RoPE).**

---

## Feed-Forward Network — The "Memory" of Transformers

The FFN sublayer is crucial — often underappreciated.

**Dimension expansion:**
Original: d_model=512, FFN hidden dim = 2048 (4x expansion).
Modern LLMs: Often 4-8x expansion.

**What FFN does:**
While attention = routing information between positions.
FFN = storing and retrieving "factual" information.

Research finding: FFF neurons act as "key-value memories." Different FFN rows activate for different inputs. This is where facts are "stored."

Example: "Eiffel Tower is in ___" → specific FFN neurons activate that contain "Paris" information.

**Why separate FFN and attention?**
Attention: Contextual routing — which positions matter for this prediction.
FFN: Factual lookup — given these activations, what knowledge applies?

This separation is fundamental to how Transformers work as knowledge stores + reasoning engines.

---

## Complete Forward Pass — Walkthrough

For input sentence: "The cat sat on the mat."

**Step 1: Tokenize**
Tokens: ["The", "cat", "sat", "on", "the", "mat", "."]

**Step 2: Token embeddings**
Each token → vector of size d_model via embedding lookup.
Result: 7 × d_model matrix.

**Step 3: Add positional encoding**
Add position-specific vectors to token embeddings.
Result: 7 × d_model matrix (unchanged shape, position info added).

**Step 4: Encoder Layer 1 (of N)**

4a. Multi-Head Self-Attention:
- Each token's Q, K, V computed via linear projections
- H heads run in parallel
- Each head computes attention over all 7 positions
- Heads concatenated, projected
- "cat" now has representation enriched with context from "sat", "mat", etc.

4b. Residual + LayerNorm:
- Add original input to attention output
- Normalize

4c. FFN:
- Each position's representation updated via FFN
- Factual associations added

4d. Residual + LayerNorm again.

**Step 5: Repeat Encoder Layers 2...N**
Each layer: More sophisticated representations.

**Step 6: Final Encoder Output**
7 × d_model matrix — rich contextual representation of each input token.

---

## Output Layer — From Representations to Predictions

**For language modeling (GPT-style):**

Take hidden state at each position → multiply by output projection matrix → logits over vocabulary.

Softmax → probability distribution over vocabulary.

Sample (or argmax) → predicted next token.

**Output projection:** Hidden state (d_model) → vocabulary size (e.g., 50,000 tokens).
Parameter count: d_model × vocab_size = 768 × 50,000 = 38.4M parameters just for output layer!

**Weight tying:** Often tie output projection weights to input embedding weights.
Reduces parameters, regularization effect. Standard in many LLMs.

---

## Key Design Choices — Why These Work

### Residual Connections Throughout

Every sublayer has residual connection: output = x + sublayer(x).

Benefits:
1. Direct gradient path through the network
2. Identity function easily learned (F(x)=0)
3. Can stack many layers without degradation

### Layer Normalization (Post vs Pre)

Original paper: Post-LN (normalize AFTER residual addition).
Modern practice: Pre-LN (normalize BEFORE sublayer, normalize input).

Pre-LN often more stable training, especially for large models.

### Scaling Attention by √d_k

Prevents softmax saturation. Keeps attention weights "spread out" for better gradient flow. (Detailed in previous file.)

### H Attention Heads

Multiple specializations. Different relationship types.
Typical: 8-16 heads in smaller models, up to 96 in GPT-4 class (estimated).

---

## Parameter Count Analysis

For GPT-2 small (117M parameters, d_model=768, 12 layers, 12 heads):

**Per encoder/decoder layer:**
- Self-attention: 4 × d_model² = 4 × 768² ≈ 2.36M
- FFN: 2 × d_model × 4×d_model = 8 × 768² ≈ 4.72M
- LayerNorm: 2 × d_model × 2 ≈ 3K (negligible)
- Total per layer: ≈ 7M

**12 layers:** ≈ 84M
**Embeddings:** 50,257 vocab × 768 ≈ 38.6M
**Total:** ≈ 117M ✓

For GPT-3 (175B): Same math, d_model=12288, 96 layers, 96 heads.

---

## Transformer Variants — The Family Tree

### Encoder-Only (BERT family)
- Bidirectional attention (no causal mask)
- Good for understanding tasks: Classification, NER, QA
- BERT, RoBERTa, ALBERT, DeBERTa

### Decoder-Only (GPT family)
- Causal attention (no future peeking)
- Good for generation tasks
- GPT-1, GPT-2, GPT-3, GPT-4, Claude, LLaMA

### Encoder-Decoder (T5, BART family)
- Encoder processes input, decoder generates output
- Good for: Translation, summarization, question answering
- T5, BART, mT5, NLLB

### Mixture of Experts (MoE)
- Multiple "expert" FFN networks
- Only some experts active per token (routing mechanism)
- More capacity with less compute per example
- GPT-4 reportedly MoE. Mixtral (open source). Gemini 1.5 possibly.
- Efficient scaling: 10x parameters, 2x compute.

---

## Scaling the Transformer

The beauty of Transformer: Simple architecture scales predictably with:
- More layers (depth)
- Wider layers (larger d_model)
- More attention heads
- More FFN hidden dim

Scaling laws (Kaplan et al., 2020) proved this mathematically.

**GPT family scaling:**
- GPT-1: 117M parameters
- GPT-2: 1.5B
- GPT-3: 175B
- GPT-4: Unknown (estimated 1T+?)

Each generation: Qualitative improvement in capabilities.

---

## Anthropic Insider Angle

The Transformer architecture at Anthropic:

Claude uses a Transformer-based architecture. Specific modifications are proprietary, but general principles apply.

**Pre-LN vs Post-LN:** Anthropic early on adopted Pre-LN (Layer Norm BEFORE sublayer) — this is now standard in large models. Pre-LN provides more stable training at large scale, allowing larger learning rates.

**Rotary Positional Embeddings (RoPE):** Many modern LLMs including Claude models use RoPE instead of sinusoidal or learned absolute positions. RoPE encodes relative position within the attention computation itself. Key benefit: Naturally extends to longer contexts than seen during training (though not perfectly). Standard in LLaMA, Claude, Falcon, etc.

**Flash Attention:** Essential for efficiency. Every modern LLM training uses Flash Attention. The memory reduction from O(N²) to O(N) allows training with longer context windows.

**Architectural intuition I developed at Anthropic:** The FFN is where most of the "facts" are stored. Attention is primarily a routing mechanism. When Claude makes a factual claim, it's largely the FFN layers producing that fact, with attention determining WHEN to access which fact based on context. This insight has important implications for retrieval augmented generation (RAG) — RAG supplements weak FFN memories with external retrieval.

---

## Common Misconceptions

**Misconception 1: "Transformer = ChatGPT"**
Transformer is an ARCHITECTURE. ChatGPT is a PRODUCT built using a Transformer-based model (GPT-4) + RLHF fine-tuning + product engineering.

**Misconception 2: "RNNs are dead"**
For resource-constrained deployment and streaming inference, RNNs/LSTMs still used. State Space Models (Mamba) are reviving sequential architectures.

**Misconception 3: "Transformer understands language"**
Transformer models statistical patterns in language. Whether this constitutes "understanding" is philosophically debated. They exhibit understanding-like behavior without guaranteed semantic comprehension.

**Misconception 4: "Longer context = always better"**
Longer context requires quadratic computation. Also, "lost in the middle" problem: Models attend less to information in the middle of very long contexts. Context management is a real challenge.

---

## Interview Questions

**Q1: Transformer architecture ke main components kya hain?**

**Answer:** Main components: (1) Input Representation: Token embeddings + positional encoding. (2) Multi-Head Self-Attention: Each position attends to all others, H parallel heads. (3) Feed-Forward Network (FFN): Two linear layers per position independently. (4) Residual Connections: Skip connections around each sublayer. (5) Layer Normalization: Normalize after residual connection. (6) Stack multiple (usually 6-96+) identical blocks. Encoder-only: All blocks bidirectional attention. Decoder-only: Causal masked attention. Encoder-Decoder: Encoder blocks + cross-attention in decoder.

**Q2: Positional encoding kyun zaruri hai Transformers mein?**

**Answer:** Attention mechanism is permutation invariant — same result regardless of order. "cat sat mat" and "mat sat cat" → same attention outputs (without position). But order matters in language! Solution: Add positional information before attention. Sinusoidal encoding: Different frequencies encode different positions. Each dimension gets a sinusoidal pattern with unique frequency. Properties: (1) Unique encoding for each position; (2) Periodic → can generalize to unseen positions; (3) Relative distances can be computed. Modern alternative — RoPE (Rotary Position Embeddings): Encodes position within QK dot product computation. Better extrapolation to longer sequences. Standard in LLaMA, Claude, Falcon.

**Q3: FFN aur attention mein kya functional difference hai?**

**Answer:** Attention: Routing information between positions. "Which other positions are relevant?" Aggregates information from relevant positions. Varies per input (dynamic routing). FFN: Position-independent transformation. Same function applied to each position independently. "Given current representation, apply knowledge." Research finding (Geva et al., 2021): FFN neurons act as key-value memories. Specific neurons respond to specific inputs and activate associated outputs. Example: "Paris is the capital of ___" → FFN activates neurons encoding "France." While attention routes the context ("capital of France" → relevant to query), FFN provides the actual factual association. This is why retrieval-augmented generation (RAG) helps — it supplements FFN's stored knowledge with retrieved information.

**Q4: Encoder-only vs Decoder-only vs Encoder-Decoder — kab kounsa use karein?**

**Answer:** Encoder-only (BERT): Bidirectional attention. Sees full input at once. Best for: Understanding tasks — classification, NER, QA, sentence embedding. Why: Bidirectional context = richer understanding. Cannot generate. Decoder-only (GPT): Causal attention. Generates left to right. Best for: Text generation, language modeling, instruction following. Why: Autoregressive generation is naturally causal. Can also do classification (via prompting). Encoder-Decoder (T5): Encoder understands input, decoder generates output. Best for: Conditional generation — translation, summarization, structured prediction. Why: Explicit separation of "read input" and "generate output." Industry trend: Decoder-only models (GPT, Claude, LLaMA) dominate due to versatility — can do both generation AND understanding via prompting.

**Q5: Mixture of Experts (MoE) kya hai aur Transformer mein kyun use hota hai?**

**Answer:** MoE architecture: Instead of one FFN per layer, multiple "expert" FFNs. A routing function determines which experts to activate for each token (typically top-2 of 8-64 experts). Only activated experts' compute is used. Why powerful: 10x more parameters, 2x more compute. More parameters = more knowledge capacity. Same compute = same inference cost. Sparse activation: Not all parameters used for every token. Efficiency: Model can be 8x larger without 8x compute. Trade-offs: Training complexity (load balancing across experts). Expert routing is additional overhead. Can be harder to fine-tune. Reported users: GPT-4 (estimated, not confirmed). Gemini 1.5. Mixtral 8x7B (open source). Why it matters: MoE might be how to scale beyond current parameter counts economically.

**Q6: Layer Normalization kahan lagaai jaati hai aur kyun Pre-LN better hai?**

**Answer:** Original paper (Post-LN): output = LayerNorm(x + Sublayer(x)). Normalize AFTER adding residual. Modern (Pre-LN): output = x + Sublayer(LayerNorm(x)). Normalize BEFORE sublayer, add residual. Why Pre-LN better for large models: Post-LN: Residual addition can make values large. LayerNorm then normalizes. But at large depth, gradient flow harder. Pre-LN: Input to each sublayer is always normalized. Gradients flow more stably through residual connections. Enables larger learning rates → faster training. Empirically: Pre-LN required for stably training models > ~12 layers. All modern large LLMs use Pre-LN. Some models use RMS Norm instead of Layer Norm: Simpler, removes centering (mean subtraction), similar empirical results, slightly faster.

---

## Key Takeaways

- **Transformer = attention + FFN + residual + LayerNorm, stacked N times**
- **Encoder = bidirectional attention** — understanding
- **Decoder = causal attention** — generation
- **Positional encoding** = adds order information to permutation-invariant attention
- **FFN = factual memory**, Attention = contextual routing
- **Residual connections** = enable deep stacking
- **Pre-LN** = modern standard for stable training
- **MoE** = scale parameters without proportional compute increase
- **The architecture scales** = same components, 1000x parameters = qualitatively different capabilities

---

*Agli file: `02_Tokenization_Theory.md` — Text ko numbers mein convert karna*
