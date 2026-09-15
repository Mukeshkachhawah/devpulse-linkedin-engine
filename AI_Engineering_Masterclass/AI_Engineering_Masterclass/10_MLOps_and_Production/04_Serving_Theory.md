# Serving Theory — AI Models Ko Fast aur Reliable Kaise Chalayein

> *"Model train ho gaya. Ab kya? Production mein deploy karna — real users, real traffic, latency constraints, cost constraints. Serving theory woh engineering hai jo model ko trillion parameter weight file se ek fast, reliable API mein convert karta hai. LLMs ke liye yeh particularly hard hai: Huge models, slow generation, high memory requirements, high cost. Yeh file explain karti hai kaise production teams solve karte hain yeh problems."*

---

## Opening Hook — The Same Model, 100x Different

Scenario A: A data scientist runs the model on their laptop.
Input: One sentence. Output: After 10 seconds. 
"Works great!"

Scenario B: Production with 10,000 concurrent users.
Each user: Waiting.
10,000 × 10 seconds sequential = 100,000 seconds.
System: Completely overwhelmed. Users: Timing out.

**The model is the same. But serving it at scale requires completely different engineering.**

This is the serving problem.

---

## The Model Serving Architecture

**High-level components:**

**Client → Load Balancer → API Server → Model Server → Model Weights**

**Load Balancer:**
Distributes incoming requests across multiple API servers.
Ensures no single server gets overwhelmed.
Health checks: Removes failed servers from rotation.

**API Server:**
Receives HTTP/gRPC requests.
Validates input.
Calls model server.
Formats response.
Returns to client.

**Model Server:**
Loads model weights.
Runs inference.
Returns raw predictions.

**The key question in serving:** How do you run model inference on request X at scale?

---

## Batching — The Fundamental Optimization

**Neural network inference is embarrassingly parallel. But only when batched.**

**Single request:**
Model processes one input.
GPU utilization: Very low (5-10%).
Why: GPU designed for parallel operations. One input doesn't use all GPU cores.

**Batched requests:**
Group multiple inputs together.
Process all simultaneously.
GPU utilization: High (60-90%).
Same time for 64 requests as for 1.

**Static batching:**
Wait for N requests or time T, then batch and process.
Problem: Some requests wait longer. Inconsistent latency.

**Dynamic batching:**
Process requests as they arrive.
Add to current batch if model is busy.
Process immediately if model is idle.
Better latency characteristics.

**Continuous batching (for LLMs):**
LLM-specific problem: Each request has different output length.
Static batching: All requests in batch must finish together.
Slow requests block fast requests from completing.

Continuous batching (vLLM, TGI):
When one request finishes: Immediately add a new request.
No waiting for slow requests.
Much higher throughput.

---

## LLM-Specific Serving Challenges

### Memory Bandwidth Bottleneck

**LLMs are memory-bandwidth bound, not compute-bound.**

GPU has:
Compute (FLOPS): Very fast.
Memory bandwidth: Slower than compute.

For small batches: GPU waits for memory (loading model weights) more than computing.
As batch size grows: Memory bandwidth stays constant. Compute scales.
Optimization: Maximize batch size. Use model parallelism. Use quantization.

### KV Cache

**What it is:**
During generation: Model computes Key and Value matrices for all previous tokens.
These are recomputed at every step → wasteful.
KV cache: Store computed K, V matrices. Reuse them.

**Memory impact:**
Long context + large model = huge KV cache.
8B model, 8K context, batch=32: KV cache = ~8GB.
Runs out of GPU memory for long contexts with large batches.

**PagedAttention (vLLM):**
KV cache managed like OS virtual memory.
Allocated in "pages" (blocks of tokens).
Pages allocated dynamically. Non-contiguous pages OK.
Memory efficiency: More requests can share GPU memory.
Result: vLLM can serve 20-30x more concurrent requests vs naive serving.

### Prefill vs Decode

**Two phases of LLM inference:**

**Prefill:**
Process all input tokens simultaneously.
Compute KV cache for all input tokens.
Compute-heavy. Parallelizable.
Fast for large inputs.

**Decode:**
Generate one token at a time.
Each token requires full attention over all previous tokens.
Sequential. Memory-bandwidth heavy.
Slow per token for large context.

**Implications for serving:**
Long prompts: Prefill is bottleneck.
Long generation: Decode is bottleneck.
Different optimization strategies for each.

**Chunked prefill:**
Split long prompt into chunks.
Process chunks while decoding other requests.
Better GPU utilization.

---

## Quantization for Serving

**Reduce precision to reduce memory and increase speed.**

**FP32 (32-bit float):** Standard training precision. Largest memory.
**BF16 / FP16 (16-bit):** Half precision. 2x smaller. Minimal quality loss. Standard for inference.
**INT8 (8-bit integer):** 4x smaller than FP32. Small quality loss. Significant speedup.
**INT4 / NF4 (4-bit):** 8x smaller. Moderate quality loss. Used in QLoRA, GPTQ.

**Quantization methods:**

**GPTQ (Post-training quantization):**
Quantize weights after training.
4-bit quantization with minimal quality loss.
Run-time efficient.

**GGUF (llama.cpp):**
Format for quantized models.
Can run LLMs on CPU (slowly).
Flexible precision (Q4_K_M, Q8_0, etc.).
For edge/local deployment.

**AWQ (Activation-aware Weight Quantization):**
Better quality than GPTQ at same bit width.
Analyzes activations to find which weights matter most.
Preserve important weights at higher precision.

**Tradeoff:**
4-bit quantization: ~20% speed improvement, ~75% memory reduction, ~1-2% quality loss for most tasks.
For production serving where latency and cost matter: Often worth it.

---

## Hardware for LLM Serving

### NVIDIA GPUs

**Standard for production LLM serving.**

**H100:** Flagship. Best for large-scale production. ~$25K/unit.
**A100:** Previous generation. Still widely used. ~$10K/unit.
**A10G:** Mid-range. Good for smaller models. ~$4K/unit.
**T4:** Entry-level GPU serving. Good for batch/offline.

**Key specs for LLM:**
HBM (High Bandwidth Memory): Amount of GPU RAM. Critical.
Memory bandwidth: GB/s. Critical for decode phase.
NVLink: High-speed GPU interconnect for multi-GPU.

### For Edge / Small Scale

**Apple Silicon (M1/M2/M3):**
Unified memory (CPU+GPU share). Efficient for memory-intensive LLMs.
Good for running 7B-13B models locally.

**Consumer GPUs (RTX 3090/4090):**
24GB VRAM.
Can run 7B-13B models with quantization.
Not production-grade reliability.

### Cloud Options

**AWS:** A100/H100 instances (p4, p5), plus SageMaker endpoints.
**GCP:** A100/H100 (a2/a3), plus Vertex AI endpoints.
**Azure:** NC, ND series GPUs, plus Azure OpenAI Service.
**RunPod, Lambda Labs:** Cheaper GPU cloud for training/inference.

---

## Serving Frameworks

### vLLM

**The standard for open-source LLM serving.**

**What makes it great:**
PagedAttention: Near-optimal GPU memory utilization.
Continuous batching: Maximizes throughput.
Supports: LLaMA, Mistral, Mixtral, Qwen, many others.
OpenAI-compatible API.

**Quantization:** GPTQ, AWQ, BitsAndBytes.
**Multi-GPU:** Tensor parallelism across multiple GPUs.
**Use when:** Serving open-source models. Need high throughput.

### Text Generation Inference (TGI)

**HuggingFace's production serving framework.**

**Features:**
Flash Attention 2 support.
Continuous batching.
Quantization: GPTQ, AWQ, BitsAndBytes.
Token streaming.
OpenAI-compatible API.

**Use when:** HuggingFace model ecosystem. Need managed or self-hosted.

### Ollama

**For local development and testing.**

Simple setup. Runs models locally.
Not for production scale.
Great for developer experience.

### LM Studio

**Desktop app for running local LLMs with a GUI.**
Model download/management, chat UI, and often an OpenAI-compatible local server endpoint for apps.

**Use when:** Exploring open models locally without CLI-first workflows; quick demos on a laptop GPU/CPU.

### OpenRouter

**Multi-provider LLM API router.**
One API surface to reach many hosted models (OpenAI-compatible style in many setups). Useful for model shopping, fallbacks, and comparing providers.

**Use when:** You want provider flexibility without rewriting clients; prototyping across model families. Still apply your own logging, evals, and data-handling policies — routing does not remove compliance duties.

### API Providers

**For production without infrastructure:**
**OpenAI API:** GPT-3.5, GPT-4. Managed. High reliability. High cost.
**Anthropic API (Claude):** Claude models. Managed. Quality.
**AWS Bedrock:** Multiple models (Claude, Llama, Mistral). Managed. AWS-native.
**Google Vertex AI:** Gemini, third-party models. Managed. GCP-native.
**Groq:** Ultra-fast LLM inference (custom LPU hardware). Impressive speed.

---

## Latency Optimization Strategies

**Goal: Reduce time-to-first-token (TTFT) and time-per-output-token (TPOT).**

### Time-to-First-Token (TTFT)
The time from request to first token of response.
Critical for perceived responsiveness.
Dominated by: Prefill phase.

**Optimization:**
Shorter prompts: Less to process. Faster prefill.
Larger batch: Better GPU utilization.
Model parallelism: Split model across GPUs.

### Time-per-Output-Token (TPOT)
Time between consecutive output tokens.
Determines streaming speed.
Dominated by: Decode phase.

**Optimization:**
Quantization: Smaller model = faster memory access.
KV cache efficiency: PagedAttention.
Speculative decoding (below).

### Speculative Decoding

**Smart technique for faster LLM generation.**

Idea: Use a small "draft" model to generate K tokens quickly. Then use big model to verify/correct all K tokens in parallel.

Why faster: Verification is faster than generation (parallel prefill vs sequential decode). Most tokens from small model accepted by big model. Net effect: 2-3x speedup on some workloads.

Use when: Big model + compatible smaller model pair available.

### Prompt Caching

**Cache LLM processing for repeated prompt prefixes.**

System prompt shared across all requests.
Compute KV cache for system prompt once.
Reuse for every request.

Anthropic's prompt caching: Claude API supports caching up to 90% of repeated prefix.
Cost reduction: ~90% on cached tokens.
Latency reduction: Significant TTFT improvement.

---

## Anthropic Insider Angle

Serving Claude at production scale is one of the most interesting engineering challenges I've worked on. The scale, latency requirements, and model size make it genuinely hard.

**Speculative decoding in practice:** We use speculative decoding techniques in Claude serving. The concept is sound: small models generate drafts, large model verifies. The tricky part is: The acceptance rate (how often the small model's tokens are accepted) varies a lot with input type. For some inputs: 90% acceptance. For others: 40%. Calibrating this for a diverse request mix is non-trivial.

**Flash Attention and inference optimization:** Flash Attention (Dao et al., 2022) was a game-changer for LLM efficiency. By reordering operations to minimize memory reads/writes to GPU HBM, it dramatically reduces memory usage and increases speed. We use Flash Attention variants throughout. It's one of those algorithmic improvements that seems simple in retrospect but required deep understanding of GPU memory hierarchy.

**The cost-quality-latency triangle:** Serving decisions are always a three-way tradeoff between cost (compute), quality (model capability), and latency (response speed). Reducing quality (smaller model, more quantization) → faster and cheaper but worse answers. More compute → better quality and lower latency but more expensive. Every serving decision is navigating this triangle based on use case requirements.

**Prompt caching as a first-class feature:** Prompt caching is important enough that we built it as a first-class API feature. For applications with long system prompts (hundreds of tokens), caching provides both latency and cost benefits. It's underused by developers who don't know about it. Make sure to use it in your Claude applications.

---

## Common Misconceptions

**Misconception 1: "Just throw more GPUs at it"**
More GPUs help but don't fix fundamental efficiency issues. Poor batching + more GPUs = expensive, still slow. Fix efficiency first. Then scale out.

**Misconception 2: "Quantization always degrades quality significantly"**
For most tasks: INT8 quantization: Nearly identical quality. 4-bit quantization: 1-3% quality loss. Acceptable for most applications. Test on YOUR benchmark.

**Misconception 3: "API providers are always more expensive than self-hosting"**
For low to medium volume: API providers (OpenAI, Anthropic) often cheaper than self-hosting when you account for: GPU cost, engineer time, infrastructure maintenance, reliability. Self-hosting makes sense at very high volume or for specific control requirements.

**Misconception 4: "Bigger model always better for production"**
Smaller, faster model at lower cost may actually be better for user experience. Faster response + acceptable quality > perfect quality with 10-second wait. Match model size to quality requirements.

---

## Interview Questions

**Q1: LLM serving ke kaunse key performance metrics hain? Kaise optimize karein?**

**Answer:** Key metrics: (1) TTFT (Time-To-First-Token): Time from request to first response token. User perception of responsiveness. Critical for interactive applications. (2) TPOT (Time-Per-Output-Token): Time between consecutive tokens. Streaming speed. Important for long responses. (3) Throughput (tokens/second): How many output tokens produced per second. Total capacity. (4) Latency (P50, P95, P99): End-to-end response time. P99 = worst-case experience. (5) Cost ($/1K tokens): Total cost at scale. Optimization strategies: TTFT: Shorter system prompts. Prompt caching. Model parallelism (tensor parallel across GPUs). TPOT: Quantization (faster memory access). PagedAttention (vLLM). Speculative decoding (2-3x faster for some workloads). Throughput: Continuous batching. Larger batch sizes. Efficient KV cache management (PagedAttention). Cost: Quantization (less compute). Caching (reuse computation). Model routing (smaller model for simple queries). Balance: TTFT vs throughput tradeoff. Optimizing for throughput (large batches) hurts TTFT. Interactive use cases: Optimize TTFT. Batch use cases: Optimize throughput.

**Q2: Continuous batching kya hai? Static batching se kyun better hai?**

**Answer:** Static batching: Collect N requests (or wait T seconds). Process entire batch. Wait for ALL requests in batch to finish. Then process next batch. Problem with LLMs: Requests have variable output length. Request A: Needs 50 tokens. Request B: Needs 500 tokens. Static batch: Request A finishes at step 50. Must wait for Request B to finish at step 500. GPU idle for 450 steps with request A done. Continuous batching (vLLM, TGI): When any request in batch finishes: Immediately add waiting request. New request slot filled without waiting. No GPU idle time from completed requests. Why dramatically better: GPU utilization: Static: ~20-40% GPU utilization (waiting for slow requests). Continuous: ~80-90% utilization. Throughput: 3-10x higher throughput vs static batching. How vLLM implements: Iteration-level scheduling. After each token generation step: Check if any request finished. Fill freed slots with waiting requests. Continuous batching is the single biggest serving optimization for LLMs.

**Q3: KV cache kya hai? PagedAttention kaise improve karta hai?**

**Answer:** KV cache: During attention computation: Every token attends to ALL previous tokens. Requires computing Key and Value matrices for all previous tokens. Without cache: Recompute K,V for all previous tokens at every generation step. O(sequence_length²) work per step. With KV cache: Store computed K,V after first computation. Reuse at subsequent steps. O(sequence_length) work per additional step. Memory cost: Each token: Stores K and V vectors for each layer. 32B model, 8K context: KV cache ~8GB per request. Large batch + long context: KV cache exhausts GPU memory. Problem: Fixed-size KV cache allocation. Must reserve worst-case memory upfront. Actual usage usually less → wasted memory. PagedAttention (vLLM innovation): Like OS virtual memory paging for KV cache. KV cache allocated in non-contiguous "pages" of fixed size. Pages allocated on demand as tokens generated. Pages freed when request completes. Benefit: Near-zero memory waste. More requests fit in same GPU memory. vLLM result: 20-30x more concurrent requests vs naive implementation. Same GPU, same model, dramatically more throughput.

**Q4: API provider vs self-hosted model — kab kaunsa choose karein?**

**Answer:** Decision framework: Cost comparison: Low volume (< 1M tokens/day): API provider almost always cheaper. Medium volume (1M-100M tokens/day): Calculate GPU cost vs API cost. High volume (> 100M tokens/day): Self-hosting often cheaper. Example at 100M tokens/day: API (GPT-4-turbo): ~$100M tokens × $0.03/1K = $3,000/day = $90K/month. Self-hosted (Llama-70B on 4×H100): 4 × $5/hr = $480/day = $14K/month. But: Add DevOps cost, engineer time, reliability risk. Other factors favoring API: No infrastructure work. Managed reliability (SLA). Latest models immediately available. No GPU expertise needed. Other factors favoring self-hosted: Data privacy: Data never leaves your infrastructure. Regulatory: Some industries require data on-premise. Custom model: Fine-tuned model not available via API. Latency control: Dedicated hardware. Recommendation: Start with API. Switch to self-hosted when: Volume justifies cost, or data privacy requires, or need custom model. Hybrid: Use API for rare complex queries, self-hosted for high-volume simple queries.

**Q5: Speculative decoding kya hai? Kab useful hai?**

**Answer:** Problem: LLM generation is sequential. One token at a time. Slow. Core insight: Generate FAST but potentially wrong tokens. Then VERIFY with big model in parallel. Details: (1) Draft model: Small fast model generates K tokens ahead. Example: Drafts "The capital of France is Paris and it" (7 tokens). Fast because small model. (2) Verifier (big model): Accepts or rejects each draft token. "The" ✓ "capital" ✓ "of" ✓ "France" ✓ "is" ✓ "Paris" ✓ "and" ✓ "it" ✗ (big model: "it" wrong → "and the Eiffel Tower"). Verification done in parallel (prefill-style). (3) On rejection: Accept all tokens up to rejection. Re-draft from there. Speedup: Acceptance rate 70-90% for factual text → ~2-3x speedup. Depends heavily on: How similar small model distribution to large model. Task type (factual: high acceptance, creative: lower acceptance). When useful: Large model (expensive) + compatible small model available. Latency critical. Token generation is the bottleneck. When not useful: Already fast enough. No good draft model available. Creative generation (low acceptance rate).

**Q6: LLM serving ke liye hardware selection kaise karein?**

**Answer:** Key hardware requirements: (1) GPU VRAM: Must fit model weights + KV cache in VRAM. Rule of thumb: Model parameters × bytes per param + KV cache. FP16: 2 bytes/param. INT8: 1 byte/param. 70B FP16: 140GB VRAM. 70B INT4: ~35GB VRAM. Multi-GPU for large models. (2) Memory bandwidth: Decode phase is memory-bandwidth bound. Higher bandwidth → faster per-token generation. A100 80GB: 2TB/s. H100 80GB: 3.35TB/s. (3) Interconnect (multi-GPU): NVLink: NVIDIA's high-speed GPU-GPU. Required for tensor parallelism. Good interconnect → efficient multi-GPU. Hardware selection guide: Model size 7B: 1× A10G (24GB, INT8 or FP16). Model size 13B: 1× A100 40GB (FP16) or 1× RTX 4090 (INT8). Model size 70B: 2× A100 80GB (FP16) or 4× A100 40GB. Model size 180B+: 4× H100 80GB or more. Cloud vs on-premise: Production: Cloud (managed, scalable, no capital). High-volume stable load: Consider on-premise ROI. Tips: Always quantize for serving (INT8 standard minimum). Use NVLink when multi-GPU. Monitor GPU utilization — optimize batching if < 60%.

---

## Key Takeaways

- **Batching** = groups requests for GPU efficiency; continuous batching essential for LLMs
- **KV cache** = stores attention keys/values; PagedAttention (vLLM) manages it like virtual memory
- **TTFT vs TPOT** = two different latency metrics; different optimization strategies
- **Quantization** = INT8/INT4 reduces memory + speeds serving; small quality loss
- **vLLM** = PagedAttention + continuous batching = ~20x better throughput vs naive
- **Speculative decoding** = draft small model, verify with large model; 2-3x speedup
- **Hardware** = VRAM must fit model + KV cache; H100/A100 for production
- **API vs self-hosted** = API cheaper at low volume; self-hosted at very high volume or privacy needs
- **Prompt caching** = cache repeated prefixes (system prompts); major cost + latency savings

---

*Agli file: `05_Versioning_Theory.md` — Models, data, aur code ko version control karna*
