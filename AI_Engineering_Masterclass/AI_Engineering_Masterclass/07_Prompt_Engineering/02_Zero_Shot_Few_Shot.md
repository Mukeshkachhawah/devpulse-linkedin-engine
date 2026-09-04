# Zero-Shot aur Few-Shot Learning — Examples Ki Power

> *"GPT-3 aaya aur puri field hilgi. Kyun? Kyunki pehli baar ek model tha jisko koi specific training nahi chahiye thi task ke liye. Sirf kuch examples prompt mein — aur model karta tha kaam. This was called 'few-shot learning.' Researchers were shocked. Economics of AI shifted completely."*

---

## Opening Hook — Ek Alien Ko Kaise Sikhate Ho?

Imagine karo tum ek alien se mila jisne English kabhi nahi padhi.
Lekin woh extremely intelligent hai.

Sirf kehdo: "Translate to French."
Alien: "What is French? What is translating?"

Ab do: 3 examples.
"Hello → Bonjour"
"Thank you → Merci"
"Good morning → Bonjour Matin"

Ab kehdo: "Cat → ?"
Alien: "Chat" (guesses correctly)

Alien ne 3 examples se PATTERN identify kiya. Rules seekhe without explicit teaching.

**LLMs in few-shot mode work exactly like this alien.**

---

## Zero-Shot Learning — No Examples

**Definition:**
Ask model to perform a task without ANY examples.
Model uses ONLY knowledge from pre-training.

**Example:**
"Classify the sentiment of this review: 'The food was terrible and the service was slow.' Positive, Negative, or Neutral?"

No examples. Model knows "classify sentiment" from training.

**When zero-shot works:**
- Well-known tasks (summarization, translation, sentiment)
- Tasks with clear natural language descriptions
- Tasks model has seen frequently in training data

**When zero-shot fails:**
- Novel task formats
- Specialized domain (medical coding, legal citations)
- Tasks requiring specific output structure
- Tasks counter to model's training distribution

---

## Few-Shot Learning — Power of Examples

**Definition:**
Provide K examples (input-output pairs) before the actual task.
Model recognizes pattern. Applies to new input.

**Format:**
```
Input: [example_input_1]
Output: [example_output_1]

Input: [example_input_2]
Output: [example_output_2]

Input: [example_input_3]
Output: [example_output_3]

Input: [actual_input]
Output:
```

Model generates the "Output:" continuation.

**K values:**
1-shot: 1 example. Minimal.
3-shot: 3 examples. Good for most tasks.
5-shot: 5 examples. Better for complex patterns.
10+ shot: For very complex or nuanced patterns.

**Context window limits:**
Can't add infinite examples. Each example uses tokens.
Typical: 3-5 examples is sweet spot for most tasks.

---

## Why Few-Shot Works — The Mechanism

**In-context learning (ICL):**
The model doesn't update its weights from examples.
It "reads" the examples and adjusts its generation based on the pattern.

**Mechanistic explanation (Induction Heads):**

Induction heads (Olsson et al., 2022):
Specific attention circuits that learn to copy-complete patterns.
If sequence contains: A, B, ..., A — predict B.

Applied to few-shot:
(input1 → output1), (input2 → output2), (input3 → ?)

Induction heads identify: input-output mapping pattern.
Complete: input3 → [expected output3 based on pattern].

**Bayesian interpretation:**
Few-shot examples update model's implicit "prior" about what task is being performed.
Prior (training): Many possible tasks.
After examples: High probability this is specifically "sentiment classification with 3 categories."

---

## Example Quality — What Makes Good Few-Shot Examples?

**Critical insight:** Example quality matters MORE than quantity.

**Good few-shot examples:**

1. **Representative:** Cover range of input types.
   Not 5 examples of the same easy case. Mix easy/hard, different categories.

2. **Diverse:** Show different input variations.
   For sentiment: Positive, negative, neutral examples.
   For NER: Examples with person, organization, location entities.

3. **Correct:** Examples must be right.
   Wrong examples confuse the model.
   Quality >> quantity.

4. **Format-demonstrating:** Show EXACTLY the format you want.
   Output: {"entity": "Apple", "type": "ORG"}
   Not: Output: Apple is an organization.

5. **Boundary-illustrating:** Show edge cases.
   What does "unclear" sentiment look like? Include it.

---

## Example Selection Strategies

**Random selection:**
Random examples from your example bank.
Simple. Often works.
Problem: May not cover relevant cases for specific input.

**Dynamic (retrieved) examples:**
For each input, retrieve SIMILAR examples from example bank.
Embedding similarity: embed(input) → nearest neighbor examples.

Better: More relevant examples for each specific case.
kNN-based selection: k-nearest neighbor examples.

**Coverage-based:**
Ensure examples cover all categories, edge cases.
For classification: At least one example per class.
For generation: Examples with diverse style, length, content.

**Chain-of-thought examples:**
For reasoning tasks: Include step-by-step reasoning in examples.
Input: [problem]
Reasoning: Step 1... Step 2... Step 3...
Output: [final answer]

---

## The Few-Shot Format

**Critical: Consistent format.**

If your examples use one format, the actual task must use the same.

**Good format:**
```
Review: Great product, works perfectly.
Sentiment: Positive

Review: Terrible quality, broke after one day.
Sentiment: Negative

Review: Average product, nothing special.
Sentiment: Neutral

Review: [actual review]
Sentiment:
```

**Bad format (inconsistent):**
```
"Great product" → positive
Terrible product. Sentiment is negative.
[actual review]
What is the sentiment?
```

Mixed formats → model confusion about what pattern to continue.

---

## One-Shot vs Few-Shot vs Many-Shot

### One-Shot
1 example. Minimal context.
Sufficient for: Simple formatting, very familiar tasks.
Insufficient for: Complex patterns, ambiguous tasks.

### Few-Shot (2-10 examples)
The sweet spot for most tasks.
3-shot: Standard recommendation.
5-shot: For complex tasks.

### Many-Shot (100+ examples)
Recent research (2024): With very long context windows, many-shot can approach fine-tuning quality.

Claude, Gemini: 100K+ context window → hundreds of examples possible.
Many-shot ICL: Near fine-tuning performance without training.
Cost: More tokens per query.

---

## Zero-Shot Chain of Thought

**"Let's think step by step."**

The magic phrase that unlocks reasoning without examples.

**Standard zero-shot:**
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 balls. How many balls does he have now?
A: 11.

Model often wrong on math.

**Zero-shot CoT:**
Q: Roger has 5 tennis balls... How many balls does he have now? Let's think step by step.
A: Roger starts with 5 balls. He buys 2 cans × 3 balls = 6 balls. Total: 5 + 6 = 11 balls.

Model correct. SAME model. Different prompt.

**Why does it work?**
Activates reasoning circuits from training data.
Training data full of: "Let me solve this step by step. First... then... therefore..."
The phrase triggers this pattern.

**Works for:**
Math word problems.
Logical reasoning.
Multi-step deduction.
Complex analysis.

**Doesn't work for:**
Simple factual recall.
One-step tasks.
Tasks that don't benefit from explicit reasoning.

---

## Comparing Approaches — When To Use What

| Approach | When to Use | Strength | Weakness |
|----------|-------------|----------|----------|
| Zero-shot | Familiar tasks, prototyping | Fast, no examples needed | Fails on novel patterns |
| One-shot | Simple format specification | Minimal tokens | Insufficient for complex |
| Few-shot (3-5) | Most production tasks | Good balance | Requires good examples |
| Many-shot (100+) | Complex tasks, long context | Near fine-tuning | Token cost |
| Zero-shot CoT | Math, reasoning | No examples needed | Only helps on reasoning |
| Few-shot CoT | Complex reasoning | Best for reasoning | More tokens, needs examples |

---

## Zero-Shot vs Fine-tuning — The Key Question

**For production AI systems:**

Zero/few-shot: Flexible, fast, no training data needed.
Fine-tuning: Consistent, efficient at scale, better for specialized tasks.

**The continuum:**
1. Zero-shot: Does it work well enough?
2. Few-shot: Add examples, does it work now?
3. Many-shot: Very long context, near fine-tuning.
4. Fine-tune: When few-shot doesn't cut it.

**Rule of thumb:**
New task → Start zero-shot (quick check).
Not good enough → Few-shot (add examples).
Still not good enough → Many-shot (if context allows).
Still not good enough → Fine-tune.

---

## Anthropic Insider Angle

Few-shot learning was what made GPT-3 transformative. I remember the moment we realized that properly constructed few-shot prompts on GPT-3 could approximate fine-tuning performance on many tasks. That completely changed the economics of AI deployment.

**At Anthropic:** Claude is specifically trained to be good at few-shot in-context learning. The system prompts for Claude include careful formatting. The few-shot examples in the documentation — we spent considerable time curating them to be representative, diverse, and correctly formatted.

**Insight on example selection:** The MOST impactful thing for few-shot performance isn't the number of examples — it's whether the examples MATCH the actual input distribution. I've seen cases where 2 well-chosen examples dramatically outperform 10 mediocre examples. Spend the time selecting good examples.

**Dynamic few-shot retrieval:** In production systems at scale, we found that retrieving examples similar to the current input consistently outperforms fixed few-shot examples. The cost is higher (embedding computation, retrieval) but the quality improvement is significant. For high-stakes tasks, dynamic retrieval is worth it.

**Constitutional AI and few-shot:** Interestingly, Constitutional AI uses a form of few-shot — the "constitution" provides principle examples that the model uses to evaluate its own outputs. The model is essentially doing few-shot in-context learning of constitutional principles. This is why Constitutional AI is so powerful — it leverages the model's in-context learning capability for self-improvement.

---

## Common Misconceptions

**Misconception 1: "More examples = always better"**
Quality >> quantity. 3 great examples beat 20 mediocre ones. The model learns the pattern from the pattern — bad examples teach a bad pattern.

**Misconception 2: "Few-shot = teaching the model"**
Model weights don't change. You're showing it the pattern for THIS query. No learning across queries. Next query, start fresh.

**Misconception 3: "'Let's think step by step' is magic"**
It's not. It works because it activates reasoning patterns from training data. It helps on reasoning tasks, not on recall or simple formatting. Understanding WHY helps you apply it correctly.

**Misconception 4: "Zero-shot is always inferior"**
For well-known tasks, zero-shot with a clear, detailed instruction can match or beat few-shot. The model knows what "summarize" means — adding examples may not help much and costs tokens.

---

## Interview Questions

**Q1: Zero-shot aur few-shot learning mein kya fundamental difference hai?**

**Answer:** Zero-shot: Task description only, no examples. "Classify sentiment: [text]". Model uses ONLY pre-training knowledge. Works: Familiar tasks (sentiment, translation, summarization). Fails: Novel formats, specialized domains. Few-shot: Provide K input-output examples before actual task. "Input: [X] → Output: [Y]. Now: Input: [Z] → Output: ?" Model identifies pattern from examples, applies to new input. Why few-shot often better: (1) Specifies exact output format; (2) Shows edge cases; (3) Demonstrates task nuance; (4) Reduces ambiguity about what "good" output looks like. When zero-shot preferred: (1) Model already knows task well; (2) Token budget tight; (3) No good examples available; (4) Task simple enough.

**Q2: Few-shot examples kaise choose karein? Quality kya factors determine karte hain?**

**Answer:** Key factors for good few-shot examples: (1) Representativeness: Cover the range of inputs expected in production. Not 5 easy cases — mix of easy/medium/hard. (2) Diversity: Different categories, types, edge cases. For classification: Example per class. (3) Correct: Wrong examples = wrong pattern learned. Quality absolute requirement. (4) Format-exact: Output format in examples must exactly match desired production output. (5) Edge cases: Include tricky cases. What does "borderline positive" look like? Selection strategies: Static: Hand-picked examples covering all cases. Dynamic: For each input, retrieve most similar examples from example bank via embedding similarity. Dynamic consistently outperforms static for diverse inputs. Practical: Start with 3-5 hand-picked diverse examples. If task is important, implement dynamic retrieval. Monitor outputs — if model failing on specific input types, add examples for those types.

**Q3: Zero-shot Chain-of-Thought kaise kaam karta hai? Mathematical reasoning mein kyun effective hai?**

**Answer:** Standard zero-shot: Question → Direct answer. Model skips steps. Gets multi-step problems wrong. Zero-shot CoT: Add "Let's think step by step" (or similar). Model generates explicit reasoning steps. Then gives answer. Why "Let's think step by step" works: Training data full of examples where someone writes: "To solve this, first... then... therefore." Phrase activates this pattern. Forces sequential reasoning. Each step: Simple enough to be done correctly. Composition: Step 1 correct → Step 2 correct → ... → Final answer correct. Mathematical reasoning improvement: "Roger has 5 tennis balls. Buys 2 cans of 3. How many?" Without CoT: Model might say "9" (just multiply without proper reasoning). With CoT: "Start with 5. Add 2×3=6. Total: 5+6=11." Correct! Why math specifically: Multi-step arithmetic requires composing operations. Each operation: Easy for model. Doing 5 operations in one hop: Hard. Sequential reasoning solves this.

**Q4: Dynamic few-shot retrieval kaise kaam karta hai?**

**Answer:** Static few-shot: Same examples for every input. "Good average" but not optimal for each specific input. Dynamic retrieval: For each new input, find most relevant examples from example bank. Steps: (1) Embed all example inputs using embedding model (e.g., text-embedding-ada-002). (2) Store in vector database or simple list. (3) For new input: Embed it. (4) Find k nearest examples (cosine similarity or L2 distance). (5) Include those k examples in prompt. Construct: "Here are similar examples: [retrieved examples]. Now do: [actual input]." Why better: Examples similar to input → more relevant pattern. Model sees closest analogies to current task. More accurate than generic examples. Production implementation: Vector store (Pinecone, Weaviate, Faiss) for example retrieval. Retrieval adds latency (~50-100ms). Worth it for high-stakes tasks. Example banks: Maintain and curate example bank. Include diverse, verified correct examples. Update when new failure modes discovered.

**Q5: Many-shot learning kya hai? Standard few-shot se kab better hai?**

**Answer:** Many-shot: 100-1000+ examples in context. Enabled by very long context windows (Claude: 200K, Gemini: 1M). Recent research (2024): Many-shot ICL can approach fine-tuning performance on many tasks. Why better than few-shot: (1) More examples → better pattern establishment; (2) Can cover diverse edge cases; (3) Reduces variance in model outputs; (4) Better calibration to specific task nuances. When to use: (1) Task quality needs to match fine-tuning but you can't/won't fine-tune; (2) You have many verified examples; (3) Cost: More tokens per query, but saving on training infrastructure. When NOT to use: (1) Token budget tight; (2) Good 5-shot already sufficient; (3) High query volume (100s of examples × millions of queries = enormous token cost). Comparison: Fine-tuning: One-time training cost. Per-query: Efficient (no examples in prompt). Many-shot ICL: Zero training cost. Per-query: Expensive (many examples in prompt). Decision: Many-shot useful for low-to-medium volume, high quality needed, can't/don't want to fine-tune.

**Q6: Few-shot prompting aur fine-tuning equivalent kab hote hain? Kab kaunsa prefer karein?**

**Answer:** Equivalence scenario: For simple pattern tasks with many examples in context: Many-shot ICL ≈ fine-tuning quality. The in-context learning capability is strong enough to approximate fine-tuning. Prefer few-shot when: (1) Task changes frequently (updating examples much easier than retraining); (2) Limited labeled data (few good examples available); (3) Rapid prototyping (no training pipeline needed); (4) Different task variants (different examples for different use cases, one model); (5) Low query volume (token cost acceptable). Prefer fine-tuning when: (1) Very consistent format needed at scale (format violations costly); (2) Specialized knowledge model doesn't have (domain-specific terminology, internal data); (3) High query volume (shorter prompts = significant cost savings at millions of queries); (4) Low latency requirement (fewer tokens in prompt = faster response); (5) Consistent persona/style that must remain across very long conversations. Practical rule: Start with 5-shot. If quality insufficient after optimization → fine-tune. If examples take up too much context or query volume high → fine-tune for efficiency.

---

## Key Takeaways

- **Zero-shot** = task description only; works for well-known tasks
- **Few-shot** = K examples before task; activates pattern via in-context learning
- **Induction heads** = attention mechanism that enables pattern completion from examples
- **Example quality** >> example quantity; 3 great > 20 mediocre
- **Dynamic retrieval** = retrieve similar examples for each input; better than static
- **Zero-shot CoT** = "Let's think step by step" activates reasoning circuits
- **Many-shot** = 100+ examples; approaches fine-tuning with long context windows
- **Decision rule** = zero-shot → few-shot → many-shot → fine-tune as needed
- **Few-shot doesn't update weights** = model "learns" only for this query, resets next

---

*Agli file: `03_Chain_of_Thought.md` — Step-by-step reasoning ki power*
