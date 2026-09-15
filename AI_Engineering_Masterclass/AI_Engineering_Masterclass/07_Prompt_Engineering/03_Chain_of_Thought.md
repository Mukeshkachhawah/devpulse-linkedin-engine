# Chain of Thought — Step-by-Step Reasoning Ki Shakti

> *"Ek exam mein tumhara problem: Sirf final answer likhte ho. Teacher kehta hai: 'Steps dikho.' Kyun? Kyunki steps se pata chalta hai tum samjhe ho ya nahi. Same logic LLMs pe apply hota hai — aur kisi ko nahi pata tha jab tak 2022 mein yeh paper nahi aaya."*

---

## Opening Hook — The Grade School Math Problem

"John has 5 apples. He gives 2 to Mary. Mary has 3 apples already. They both give half their apples to a food bank. How many apples does the food bank receive?"

**Without Chain-of-Thought (GPT-3):**
"4 apples."
(Partially right by accident, wrong reasoning)

**With Chain-of-Thought:**
"John starts with 5, gives 2 to Mary → John has 3 apples.
Mary had 3, gets 2 from John → Mary has 5 apples.
John gives half of 3 = 1.5 → 1 apple (rounding) to food bank.
Mary gives half of 5 = 2.5 → 2 apples to food bank.
Food bank receives 1 + 2 = 3 apples."

**Same model. Same parameters. Just "show your work."**
Multi-step math problems: CoT improves accuracy by 20-40%.

---

## Chain-of-Thought — The Core Idea

**Chain-of-Thought (CoT) Prompting:**
Encourage the model to produce INTERMEDIATE REASONING STEPS before giving the final answer.

"Show your work" for AI.

**Why intermediate steps help:**
Each step = one small logical move.
Small move = tractable for the model.
Series of small moves → correct final answer.
Without steps: Model tries to "jump" to answer directly → fails on complex tasks.

**Wei et al., 2022** — The paper that changed everything.
"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models."

**Key finding:**
CoT significantly helps on arithmetic, commonsense, symbolic reasoning.
BUT: Only for large models (≥100B parameters).
Small models: CoT doesn't help or hurts.
Large models: Dramatic improvements.

---

## Types of Chain-of-Thought

### Type 1: Few-Shot CoT

Provide examples WITH reasoning steps.

**Format:**
```
Question: [problem]
Reasoning: [step 1] [step 2] [step 3]...
Answer: [final answer]

Question: [problem 2]
Reasoning: [step 1] [step 2]...
Answer: [final answer]

Question: [actual problem]
Reasoning:
```

Model: Generates reasoning steps + final answer.

**Strength:** Examples demonstrate what "good reasoning" looks like.
**Weakness:** Need to write reasoning examples (effort).

### Type 2: Zero-Shot CoT

No reasoning examples. Just tell it to reason.

**The magic phrase:**
"Let's think step by step."

Or alternatives:
"Think through this carefully."
"Let's reason through this."
"Walk me through your reasoning."
"Analyze this step by step."

**Why it works:** Training data is full of "Let me think step by step" reasoning patterns.
The phrase activates that pattern.
Model generates intermediate reasoning without examples.

**Strength:** No examples needed. Works on any reasoning task.
**Weakness:** Less control over reasoning format/quality than few-shot CoT.

### Type 3: Auto-CoT

Automatically generate chain-of-thought examples.

Process:
1. Cluster problems by type.
2. For each cluster, sample representative problem.
3. Use zero-shot CoT to generate reasoning for sample.
4. Use these auto-generated examples as few-shot examples.

No human labeling! Scalable way to create CoT examples.
Quality: Auto-generated CoT can introduce errors.
Mitigation: Verify examples or use only high-confidence ones.

---

## Where CoT Dramatically Helps

**Arithmetic / Math Word Problems:**
Multi-step calculation. Error compounds without steps.
CoT: Write out each arithmetic step.
Improvement: 50-90% on difficult problems.

**Logical Reasoning:**
"If A then B. If B then C. Is A implies C?" → 3-step deduction.
CoT: Write out each implication step.

**Commonsense Reasoning:**
"Can I walk from my house to the moon?"
CoT: "Moon is 384,000 km. Walking at 5 km/h = 76,800 hours = 8.8 years (if could walk in space, which isn't possible). Therefore: No."

**Multi-Constraint Problems:**
"Schedule a meeting for next Monday between 2pm-5pm, avoiding existing meetings [list], preferring late afternoon."
CoT: List constraints, check each time slot systematically.

**Code Debugging:**
"What's wrong with this code?" + code.
CoT: Trace execution line by line, identify where logic breaks.

---

## Where CoT Doesn't Help

**Simple factual lookup:**
"What is the capital of France?"
CoT: Unnecessary. Model knows "Paris" directly.

**Simple classification:**
"Sentiment of 'Great product': Positive, Negative, Neutral?"
CoT: Overkill for simple 3-class classification.

**Procedural tasks with clear format:**
"Translate to Spanish: Hello" → "Hola."
No reasoning needed.

**Very long CoT can hurt:**
If model gets confused during reasoning, generates wrong steps, compounds errors.
Sometimes more errors in CoT than direct answer.
Evaluation: Always compare CoT vs direct answer on your specific task.

---

## Self-Consistency — CoT's Upgrade

**Problem with single CoT:**
One reasoning path → one answer.
Model might make a mistake in reasoning.

**Self-consistency (Wang et al., 2022):**
Sample MULTIPLE reasoning paths from the model.
Same problem, temperature > 0 → different reasoning chains.
Take MAJORITY VOTE on final answers.

**Why it works:**
If multiple independent reasoning paths agree → more likely correct.
Like asking 5 smart people independently → trust where they agree.

**Example:**
Path 1: "5+6=11, round up to 12." → Answer: 12
Path 2: "5+6=11." → Answer: 11
Path 3: "5 apples, 6 apples, 11 total." → Answer: 11
Path 4: "5+6=11." → Answer: 11

Majority vote: 3 out of 4 say 11. → Final answer: 11. ✓

**Improvement over single CoT:**
Arithmetic benchmarks: +5-10% accuracy.
Commonsense reasoning: +8-15% accuracy.
Works without additional training.

**Cost:**
K samples × K times the inference cost.
Typical: K=10-20 samples.
Worth it for high-stakes questions.

---

## Decomposition — Break Problems Apart

**Related to CoT but different:**
Instead of step-by-step reasoning WITHIN one prompt:
Break problem into sub-problems. Solve each independently. Combine.

**Least-to-most prompting:**
Step 1: Ask model to identify sub-problems.
"What sub-problems need to be solved to answer this?"

Step 2: Solve sub-problems (simplest first → hardest).
Each sub-problem solved in its own prompt.

Step 3: Combine sub-answers for final answer.

**Example:**
Main question: "What is the impact of climate change on agricultural output in South Asia by 2050?"

Sub-problems:
1. What are main climate change impacts in South Asia?
2. How do these impacts affect different crops?
3. What do current models predict for 2050?
4. Integrate: How does this affect overall agricultural output?

Each solved separately → better individual answers → better combined answer.

**When to use:**
Problems with clear decomposable structure.
When individual sub-problems require extensive context.
When errors in one step shouldn't cascade to all steps.

---

## Tree of Thoughts (ToT)

**Beyond linear CoT — a search process.**

**Linear CoT:**
Step 1 → Step 2 → Step 3 → Answer.
If Step 2 wrong, answer wrong.

**Tree of Thoughts (Yao et al., 2023):**
At each step: Generate MULTIPLE possible next steps.
Evaluate each step (is this promising?).
Explore the most promising branch.
Backtrack if branch leads to dead end.

**Essentially: BFS/DFS search over reasoning steps.**

**When ToT helps:**
Complex planning problems.
Creative writing with constraints.
Puzzles where wrong early moves can be caught.

**Example (Game of 24):**
"Use 4 numbers (1, 2, 4, 6) with arithmetic to make 24."
CoT (linear): Try one approach, may fail.
ToT: Systematically try combinations, backtrack when stuck, find solution.

**Cost:** Exponential in branching factor.
Practical: Limit depth and branching. Not for every task.

---

## Verified Reasoning (Self-Verification)

**Two-stage prompting for accuracy:**

Stage 1: Generate answer + reasoning.
Stage 2: Verify the answer.

"Check: Is this answer correct? Point out any errors."
OR: "What's wrong with this reasoning?"

**Why it helps:**
Model generating answer and model verifying are different operations.
Even if generator makes mistakes, verifier can often catch them.
Gives model opportunity to self-correct.

**Process-based supervision:**
Research direction: Train models to be good at verifying reasoning steps.
Not just final answer correctness, but step-level correctness.
Still active research area.

---

## CoT in Production — Practical Considerations

**When to use CoT:**

High-stakes tasks: When errors are costly.
Math/logic heavy: Multi-step calculations.
Complex analysis: Multi-factor trade-off decisions.
Debugging: Finding bugs in code or logic.

**When to skip CoT:**

Simple tasks: Over-engineering.
Low latency: CoT adds tokens → slower.
Cost-sensitive: More tokens = more money.

**Latency and cost:**
CoT responses are typically 3-5x longer.
3x more tokens = 3x more processing + 3x inference cost.
For high-volume applications: Significant cost.

**Hybrid approach:**
Use CoT selectively.
Route complex questions to CoT-enabled path.
Simple questions to direct answer.
Complexity classifier: Fast model determines if CoT needed.

---

## Anthropic Insider Angle

Chain-of-thought prompting is deeply relevant to how Claude works and how we approach complex reasoning.

**Claude's natural CoT tendency:** Claude is trained to reason step by step even when not explicitly asked, especially for complex questions. This is by design — we want Claude to be accurate on reasoning tasks. The explicit "think step by step" is less necessary for Claude than for some models because Claude has internalized this reasoning style.

**Extended thinking:** Claude now has an "extended thinking" mode where it explicitly reasons internally before responding. This is Claude's explicit chain-of-thought at the model level, not just via prompting. The model has a private scratchpad for reasoning. This internal CoT is more thorough than what appears in the response. The public-facing reasoning is a summary of internal deliberation.

**Self-consistency at Anthropic:** We found self-consistency particularly valuable for mathematical and logical tasks in safety contexts. If a model gives inconsistent answers to logically equivalent questions → sign of unstable reasoning → potential safety concern. Testing self-consistency was part of our safety evaluation.

**The scaling observation:** CoT working only at large scales was fascinating. We saw this internally — smaller models don't benefit from CoT (or actually get confused by it). Only at ~100B+ do reasoning circuits develop sufficiently for CoT to activate them. This connects to the emergence story — reasoning capability emerges at scale, CoT just activates latent reasoning.

**Production CoT:** In Claude API production systems, we see many operators using CoT in system prompts. "Think through your answer step by step before responding." For complex tasks like document analysis, legal review, financial assessment — the CoT approach consistently produces better outputs. The latency cost is worth it for these use cases.

---

## Common Misconceptions

**Misconception 1: "CoT is always better than direct answer"**
For simple tasks: CoT can introduce errors. Model gets confused trying to reason unnecessarily. Always evaluate CoT vs direct answer on your specific task.

**Misconception 2: "More reasoning steps = more accurate"**
Not necessarily. Long reasoning chains can compound errors. The reasoning quality matters, not just length. Bad reasoning → confidently wrong answer.

**Misconception 3: "CoT works on small models too"**
CoT mostly works on large models (≥100B). Small models don't have reasoning circuits developed enough. GPT-3.5 benefits; BERT/DistilBERT don't.

**Misconception 4: "Self-consistency always worth the cost"**
Self-consistency is K times more expensive. For many production tasks: Acceptable single error rate vs K× cost. Calculate the trade-off for your use case.

---

## Interview Questions

**Q1: Chain-of-Thought prompting kya hai? Kaise kaam karta hai?**

**Answer:** Chain-of-Thought: Encourage model to produce intermediate reasoning steps before final answer. "Show your work" for AI. Implementation: Few-shot CoT: Provide examples WITH reasoning steps. "Question: X. Reasoning: Step 1, Step 2, Step 3. Answer: Y." Zero-shot CoT: Just add "Let's think step by step." Why it works: (1) Multi-step problems → each step tractable. Composing steps = tractable answer. Without steps → trying to solve all at once → fails; (2) Activates reasoning patterns from training data. Training full of "let me think through this step by step" text; (3) Forces explicit intermediate states that model can attend to. Key finding (Wei et al. 2022): Dramatic improvements on arithmetic, commonsense reasoning. ONLY for large models (≥100B). Small models: CoT doesn't help. This connects to emergent reasoning capabilities.

**Q2: Self-consistency kya hai? Ek single CoT se kaise better hai?**

**Answer:** Single CoT limitation: One reasoning path → one answer. If model makes error in reasoning chain → wrong final answer. Self-consistency (Wang et al. 2022): Sample MULTIPLE reasoning paths (K=10-20). Same problem, temperature > 0 → different chains. Take majority vote on final answers. Why better: Multiple independent reasoning paths → systematic errors less likely. Errors that are idiosyncratic to one path won't appear in others. Like independent expert consultations. Example: Problem has answer 42. CoT paths: 7 paths → 42. 2 paths → 43 (arithmetic slip). 1 path → 41. Majority: 42. Correct! Improvement: Arithmetic: +5-10% accuracy. Commonsense reasoning: +8-15%. Works without additional training. Cost: K× inference cost. K=10 samples = 10× cost. Worth it: High-stakes tasks (medical, legal, financial decisions). Not worth it: Simple production tasks at scale.

**Q3: Tree of Thoughts kya hai? Regular CoT se kaise different hai?**

**Answer:** Linear CoT: One reasoning path. Step 1 → Step 2 → Step 3 → Answer. If Step 2 is wrong → cascades to wrong answer. Can't recover. Tree of Thoughts (ToT): At each step, generate MULTIPLE possible next steps. Evaluate each: "Is this direction promising?" Explore most promising branch. If leads to dead end: Backtrack to previous step. Try different branch. Search process: BFS (breadth-first) or DFS (depth-first) over reasoning tree. When ToT > CoT: Complex planning (step ordering matters). Constraint satisfaction (many constraints to satisfy). Puzzles (wrong early move detectable). Creative tasks with many constraints. Game of 24 example: Use 1, 2, 4, 6 to make 24. Linear CoT: Try 1+2+4+6=13. Wrong. Try 1×2×4+6=14. Wrong. Stuck. Tree of Thoughts: Branch: (6-1)×(4+2-2)... systematically explore, backtrack when impossible. Finds 6×(4-2+1)=18... keeps trying... 6×4=24 → 1×2=2 → no... eventually finds solution. Cost: Expensive. Branching factor × depth. Practical for important complex problems.

**Q4: Decomposition prompting kya hai? Kab useful hai?**

**Answer:** Decomposition: Break complex problem into independent sub-problems. Solve each separately. Combine. Least-to-most prompting: Step 1: "What sub-problems need to be solved?" Step 2: Solve simplest first, use answers in harder ones. Step 3: Final answer using all sub-answers. When useful: (1) Clearly decomposable problem. "Climate impact on South Asia agriculture" → 4 clear sub-questions; (2) Sub-problems are independently addressable; (3) Context window constraints: Complex problem doesn't fit in single context. Break into pieces; (4) Error isolation: If one sub-problem fails, don't affect others. Advantages over single long CoT: Each sub-problem gets focused attention. Longer effective context via chaining. Can use different tools/sources for different sub-problems. Example in production: Complex document analysis. "Analyze this 50-page contract for: (1) payment terms, (2) liability clauses, (3) termination conditions." Three separate prompts, each focused.

**Q5: CoT production mein use karte time kya considerations hain?**

**Answer:** Key considerations: (1) Latency: CoT responses 3-5x longer. Each additional token = processing time + cost. If 200ms baseline → CoT = 600-1000ms. Acceptable? Depends on use case. (2) Cost: More output tokens = higher API cost. At scale: 3x tokens = 3x API cost. Significant. (3) When to use: High-stakes decisions. Mathematical/logical reasoning. Complex analysis. When to skip: Simple classification/extraction. High-volume low-complexity tasks. Latency-critical. (4) Selective routing: Not every query needs CoT. Classify queries: Simple → direct answer. Complex → CoT. Routing model: Small fast model decides if CoT needed. (5) Verification: Even with CoT, verify answers. Especially for math: Check final calculation. Self-verification prompt after CoT. (6) Prompt format: Structure CoT clearly. "Reasoning: [steps]. Final answer: [answer]." Parse final answer from structured output.

**Q6: Claude ka "extended thinking" standard prompting se kaise different hai?**

**Answer:** Standard prompting + CoT instruction: User or system prompt says "think step by step." Model generates reasoning in output that user sees. Reasoning becomes part of conversation context. Extended thinking (Claude): Model has INTERNAL reasoning space not visible in default output. Like a private scratchpad. Model reasons thoroughly internally first. Then produces final response summarizing reasoning. Key differences: (1) Privacy: Internal reasoning not shown to user (unless explicitly requested). (2) Depth: Can explore more branches, backtrack — not constrained by user-facing output length. (3) Quality: Internal reasoning can be more tentative/exploratory without affecting user experience. (4) Efficiency: User sees concise answer. Internal reasoning stays internal. When extended thinking shows in output: When explicitly enabled in API. When showing reasoning is valuable (education, explanation). How to prompt for it: In standard mode: "Think through this carefully before answering" — CoT appears in output. Extended thinking mode: Reasoning happens internally, response is the conclusion. Both approaches improve reasoning quality, just with different visibility.

---

## Key Takeaways

- **Chain-of-Thought** = intermediate reasoning steps before final answer; "show your work"
- **Zero-shot CoT** = "Let's think step by step" activates reasoning without examples
- **Few-shot CoT** = examples with reasoning shown; better control over reasoning quality
- **Only helps at scale** = ≥100B parameters; small models don't benefit
- **Self-consistency** = multiple reasoning paths + majority vote; +5-15% accuracy
- **Tree of Thoughts** = branching + backtracking; for complex planning/constraint problems
- **Decomposition** = break into sub-problems; each solved independently
- **Production trade-off** = CoT better quality vs 3-5x more tokens = more latency + cost
- **Claude extended thinking** = internal CoT scratchpad; deeper reasoning, cleaner output

---

*Agli file: `04_ReAct_and_Agents.md` — Reasoning + Action = Agents*
