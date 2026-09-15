# Agent Architectures — Different Designs for Different Problems

> *"Jaise engineering mein different problem domains ke liye different architectures hote hain — microservices vs monolith, RDBMS vs NoSQL — agent design mein bhi patterns hain. ReAct, Plan-and-Execute, Reflection, MRKL, Toolformer — yeh sirf names nahi hain, yeh different trade-offs hain. Job mein aise sawaal aate hain: 'Is problem ke liye kaunsa agent architecture use karoge?' Is file ke baad, jawab ata hai confidently."*

---

## Opening Hook — The Surgeon vs The Analyst

Two scenarios:

**Scenario A:** A surgeon in an operating room.
No time for long-term planning. Must react to each moment.
Sees bleeding → clamps. Sees tissue → cuts. Observes response → adapts.
Pure reactive decision loop. No upfront planning.

**Scenario B:** A management consultant preparing a strategy report.
Weeks of planning. Define framework. Gather data. Analyze. Structure findings. Write report.
Heavy upfront planning. Execution follows the plan.

**Both are intelligent. Both solve problems. But completely different architectures.**

AI agent design has the same spectrum: Pure reactive vs full planning.
Understanding when each is appropriate → understanding agent architectures.

---

## Architecture 1: ReAct (Reactive-Action)

**The foundational agent architecture.**

**Pattern:**
Thought → Action → Observation → Thought → Action → Observation → ... → Final Answer.

**Characteristics:**
Reactive: Decides next action based on current observation.
No upfront planning.
Tight thought-action-observation loop.

**Strengths:**
Natural and easy to implement.
Good for exploratory tasks where you don't know the path in advance.
Adaptive: New information → changes approach immediately.
Works well for search-based tasks.

**Weaknesses:**
Can get stuck in local decisions without big-picture view.
May miss global optimization opportunities.
For complex multi-step tasks: Loses track of overall goal.
Can meander when a clear plan would be more efficient.

**Best for:**
Information retrieval tasks.
Simple tool-use tasks.
Tasks with clear, immediate feedback from each action.
Research tasks where the path isn't known in advance.

**Example tasks:**
"Find the current stock price of Apple and compare to 6 months ago."
"Search for and summarize recent news about AI regulation."
"Find the Python documentation for async/await."

---

## Architecture 2: Plan-and-Execute

**Plan the whole thing first. Then execute.**

**Pattern:**
PLAN: Decompose task into ordered steps.
EXECUTE: Follow the plan step by step.
REPLAN (optional): If execution goes wrong, update plan.

**Characteristics:**
Heavy upfront planning.
Systematic execution.
Can support replanning when things go wrong.

**Strengths:**
Clear progress tracking: Know which step we're on.
Parallelism: Independent steps can run simultaneously.
Better for known-structure tasks.
Reduces aimless exploration.

**Weaknesses:**
Plan may be wrong: Doesn't know what it doesn't know.
Replanning overhead: When plan fails, need new planning step.
Less adaptive to surprising intermediate results.

**Best for:**
Tasks with predictable structure.
Multi-step workflows.
Tasks where progress tracking matters.
When subtasks can be parallelized.

**Example tasks:**
"Research our 5 top competitors and create a comparison matrix."
"Refactor the authentication module: Document → Analyze → Propose changes → Implement → Test."
"Create a marketing report: Research → Outline → Draft → Edit → Format."

---

## Architecture 3: Reflection / Self-Critique

**Generate, then evaluate and improve.**

**Pattern:**
GENERATE: Produce initial response/plan/action.
REFLECT/CRITIQUE: Evaluate what was generated.
IMPROVE: Update based on critique.
(Optional: Repeat until criteria met.)

**Types:**

**Output reflection:**
Generate answer → critique answer → improve answer.
Good for: High-quality output generation.

**Action reflection:**
Take action → reflect on result → decide if action was correct → improve next action.
Good for: Learning from mistakes during task execution.

**Reflexion (Shinn et al., 2023):**
After task fails: Generate verbal reflection.
Store reflection in memory.
Before similar future task: Retrieve reflection.
Agent improves over multiple task attempts.

**Strengths:**
Higher quality outputs.
Self-correction capability.
With memory: Improves over time.

**Weaknesses:**
Slower (additional generation steps).
Additional compute cost.
May not always improve (reflection can be wrong too).

**Best for:**
High-quality output tasks (writing, analysis, code).
Tasks where quality matters more than speed.
Long-running agents that should improve over time.

---

## Architecture 4: MRKL (Modular Reasoning, Knowledge, and Language)

**Multi-expert system with routing.**

**Concept:**
One "router" LLM: Decides which expert to call.
Multiple specialized "experts" (modules): Each handles specific task type.
Experts can be: Neural (LLMs), Symbolic (calculators, DBs), Hybrid.

**Pattern:**
User query → Router: Which expert handles this?
Route to expert → Expert processes → Returns result.
Router: Synthesizes results into final answer.
May call multiple experts sequentially.

**Characteristics:**
Clear separation of concerns.
Experts can be non-LLM systems.
Scales well: Add new experts for new capabilities.

**Strengths:**
Best tool for each job (calculator for math, search for facts).
Clean architecture.
Extensible: Add expert without changing others.

**Weaknesses:**
Router must correctly identify which expert to use.
Expert coordination can be complex.
Experts must have compatible I/O.

**Best for:**
Systems with diverse task types.
When some tasks are better handled by non-LLM systems.
Enterprise systems integrating multiple specialized services.

---

## Architecture 5: Toolformer-Style (Tool-Augmented LLM)

**LLM learns to call tools through its own training.**

**Concept:**
Unlike ReAct where tool use is prompted/designed:
The model is TRAINED to call tools.
During text generation: Model inserts tool call inline.
"The population of France is [SEARCH(France population)] according to..."

**Training:**
Model learns: When generating text, when to insert tool calls.
Tool calls embedded naturally in text.
Results substituted inline.

**Characteristics:**
More natural tool use (learned, not prompted).
Better calibrated: Knows when tool needed vs not.
Tighter integration between reasoning and tool use.

**Relevance:**
GPT-4's function calling, Claude's tool use: Similar in spirit.
The boundary between "prompted" and "trained" tool use is blurring.

**Best for:**
Production systems where tool use needs to be reliable.
When you have data to train on.

---

## Architecture 6: Tree of Thoughts (ToT)

**Explore multiple reasoning paths simultaneously.**

**Pattern:**
Instead of one linear reasoning chain:
Expand multiple "thoughts" at each step.
EVALUATE each thought's promise.
Prune bad paths. Explore good ones.
Find best path through search.

**Characteristics:**
Like chess AI (MCTS): Exploring multiple moves ahead.
Allows backtracking.
Best path selected, not just first path.

**Strengths:**
Better for complex reasoning where first thought isn't always right.
Can backtrack and try different approach.
Finds better solutions for combinatorial/planning problems.

**Weaknesses:**
Exponentially more expensive (multiple thoughts at each step).
Complex to implement.
Overkill for most practical tasks.

**Best for:**
Complex reasoning tasks where search helps.
Mathematical problem solving.
Planning tasks with discrete decision points.
Creative tasks where multiple directions should be explored.

---

## Architecture 7: Code-as-Plan (Programs as Agent Brains)

**Generate executable programs as the agent's plan.**

**Concept:**
Instead of natural language plans:
Agent generates a PROGRAM that encodes the plan.
Program is executed.
Output is the agent's result.

**Implementations:**
ProgPrompt: Generate a program → execute it.
Voyager (for Minecraft): LLM generates executable code to accomplish tasks.
Interpreting Python: LLM writes Python → Python executes → LLM interprets result.

**Why programs as plans:**
Formal. Unambiguous. Computer executes exactly.
No interpretation needed (vs natural language plans).
Can check correctness programmatically.
Loops, conditionals built in.

**Best for:**
Tasks with precise execution requirements.
Tasks where natural language plans are ambiguous.
Tasks with clear success criteria that can be tested.
Software engineering tasks.

---

## Choosing the Right Architecture

**Decision framework:**

**Is the task well-structured with known steps?**
Yes → Plan-and-Execute.
No → ReAct.

**Is quality more important than speed?**
Yes → Add Reflection layer on top.
No → Pure ReAct or Plan-and-Execute.

**Are multiple expert systems involved?**
Yes → MRKL router pattern.
No → Simpler single-agent pattern.

**Is the reasoning complex with many branches?**
Yes → Tree of Thoughts (if compute allows).
No → Linear chain (ReAct/Plan).

**Is the task code-like or precisely executable?**
Yes → Code-as-Plan.
No → Natural language plan.

**Practical advice:**
Most production agents: ReAct + optional Reflection.
For structured workflows: Plan-and-Execute.
Start simple. Add complexity only when needed.

---

## Architecture Anti-patterns

**What NOT to do:**

**Over-engineering:**
Task can be done with 3 tool calls.
You build: Multi-agent, Tree of Thoughts, full planning loop.
Result: Slow, expensive, complex, same quality.
Fix: Match complexity to need.

**Under-engineering:**
Complex research task → basic ReAct with 1 tool.
No memory, no planning, no reflection.
Result: Poor quality, aimless.
Fix: Match complexity to need.

**Tightly coupled agents:**
Agent A hard-coded to call Agent B.
Changing Agent A requires changing Agent B.
Fix: Loose coupling via message passing, not direct calls.

**God agent:**
One agent responsible for everything.
Becomes unmaintainable.
Fix: Single responsibility per agent. Each does one thing well.

---

## Anthropic Insider Angle

Agent architectures are a rapidly evolving area, and what was cutting-edge in 2023 is baseline in 2025.

**The simplicity principle:** At Anthropic, when building Claude-based agents for real tasks, we typically start with the simplest possible architecture. A well-prompted Claude with a few good tools in ReAct mode often outperforms complex multi-architecture systems. The complexity comes in when the simple approach clearly has gaps. Don't pre-emptively add complexity.

**Reflection is underused in production:** Reflexion-style architecture (generate → critique → improve) provides significant quality gains for high-stakes outputs, but many production systems skip it because it adds latency. The trade-off: For a single-user, quality-critical application — the 2-3 second additional latency is worth 20-30% quality improvement. For high-throughput, latency-sensitive applications — skip it.

**Plan-and-Execute for enterprise workflows:** When enterprise customers deploy Claude for complex workflows (contract review, financial analysis, research reports), Plan-and-Execute consistently performs better than pure ReAct. Why: These tasks have natural structure. Making that structure explicit improves reliability and allows progress tracking (important for long-running tasks).

**The emerging architecture:** What we're seeing emerge for sophisticated production agents: Planning → Execution with reflection → Verification → Critique → Final output. Four-stage pipeline. Each stage specialized. This is becoming the standard for high-quality agent systems.

---

## Common Misconceptions

**Misconception 1: "Tree of Thoughts is always better than ReAct"**
ToT is much more expensive (exponential exploration). For most tasks: ReAct is more cost-effective with similar quality. ToT: Good for specific problems where search through reasoning paths matters. Not a general replacement.

**Misconception 2: "Plan-and-Execute is better because planning is rational"**
Upfront plans are often wrong. Environments are uncertain. ReAct's adaptability is a feature, not a bug. For tasks with uncertainty: ReAct often better. For predictable structure: Plan-and-Execute often better.

**Misconception 3: "Architecture choice doesn't matter much"**
Wrong architecture → completely different quality, reliability, cost. Matching architecture to task is critical. This is one of the highest-leverage design decisions.

**Misconception 4: "Newer architectures are always better"**
ReAct (2022) still excellent for many tasks. Newer doesn't mean universally better. Evaluate based on your specific task and constraints.

---

## Interview Questions

**Q1: Agent architectures kya hain? Common patterns kaunse hain?**

**Answer:** Agent architectures = different ways to structure how an agent reasons and acts. Common patterns: (1) ReAct: Thought → Action → Observation loop. Reactive. Adaptive. No upfront planning. (2) Plan-and-Execute: Plan all steps upfront. Execute sequentially. Replan if needed. (3) Reflection/Self-critique: Generate → Critique → Improve. Quality-focused. (4) MRKL: Router + specialized experts. Each expert handles different tasks. (5) Tree of Thoughts: Multiple reasoning branches. Evaluate and prune. (6) Code-as-Plan: Generate executable programs as plans. How to choose: Well-structured task → Plan-and-Execute. Exploratory task → ReAct. Quality critical → Add Reflection. Multiple specialists → MRKL. Complex reasoning → ToT (if compute allows). Practical: Most production systems → ReAct + optional Reflection. Structured enterprise workflows → Plan-and-Execute. Don't over-engineer.

**Q2: ReAct aur Plan-and-Execute mein kab kaunsa use karein?**

**Answer:** ReAct: Reactive. Decide next action based on current observation. No upfront planning. Strengths: Adaptive, exploratory, handles uncertainty well, simpler to implement. Best for: Information search tasks, exploratory research, tasks with unpredictable paths, short-medium tasks. Plan-and-Execute: Create full plan first. Then execute step by step. Strengths: Clear progress tracking, supports parallelism, systematic, good for structured tasks. Best for: Multi-step workflows with known structure, tasks where parallelism matters, long tasks where progress needs tracking, enterprise workflows. Decision: "Does this task have a predictable structure?" Yes → Plan-and-Execute. "Is the task exploratory or path-unknown?" Yes → ReAct. "Will I need to track progress or parallelize?" Yes → Plan-and-Execute. Real example: "Research our 5 competitors" → Plan (define 5 analysis dimensions, create 5 tasks, run in parallel, synthesize) → Plan-and-Execute wins. "Help me debug this unexpected error" → ReAct wins (can't plan; investigate, observe, react to findings).

**Q3: Reflection architecture kya hai? Kab significant improvement milta hai?**

**Answer:** Reflection pattern: Three stages. (1) Generate: Initial output (answer, plan, code). (2) Reflect/Critique: Evaluate the generated output. "Is this accurate? What's missing? What could be wrong?" (3) Improve: Update output based on critique. Reflexion (Shinn et al.): Extended reflection stored in memory. After task failure: "What went wrong? What should I do differently?" Store as explicit memory. Before similar future task: Retrieve reflection → incorporate into approach. Agent improves over time. When reflection gives significant improvement: (1) Complex tasks: Simple tasks → reflection adds little. Complex, multi-step → reflection catches errors. (2) High-quality requirements: When quality matters more than speed. Legal analysis, medical info, financial reasoning. (3) Creative tasks: Writing, design — iterative improvement fundamental. (4) Correctness-critical: Code generation — first attempt often has bugs → reflection + retry catches many. When NOT worth it: Simple factual queries (reflection adds no value). Time-critical applications (2-3x slower). High-volume, low-stakes tasks. Quantitatively: Complex tasks: 20-30% quality improvement. Cost: 2-3x more tokens, 2-3x slower.

**Q4: MRKL architecture kya hai? Real-world mein kaise implement karein?**

**Answer:** MRKL (Modular Reasoning, Knowledge, Language): Router + expert modules. Router (LLM): "Which expert should handle this?" Expert modules: Specialized for different task types. Can be: LLMs (specialized), calculators, databases, rule-based systems, APIs. Router routes to right expert. Synthesizes results. Example: Customer service bot. Router sees query. Routes to: Calculator expert: "What's the total of my last 3 invoices?" → Arithmetic. Database expert: "What's my account status?" → DB query. Policy expert: "What's your return policy?" → Policy RAG. General LLM: Everything else. Implementation steps: (1) Define expert modules. What each handles. Input/output schema. (2) Train/prompt router. "For each query, which expert is most appropriate? Options: [expert1, expert2, expert3]." (3) Expert execution. Run the appropriate expert with the query. (4) Result synthesis. If multiple experts needed: Router combines results. When MRKL over single agent: Multiple distinct task types with different best tools. When specialized non-LLM modules (rule engines, calculators) are best for some tasks. When you want clean separation of concerns by task type.

**Q5: Kaunsa architecture complex reasoning tasks ke liye best hai?**

**Answer:** Complex reasoning tasks: Mathematical problem solving, multi-step logical deduction, complex planning, combinatorial problems. Options: (1) Chain-of-Thought (CoT): Linear reasoning chain. Better than direct answer. Captures intermediate steps. Suitable for most complex reasoning. (2) Tree of Thoughts (ToT): Multiple reasoning branches. Evaluate promising branches. Backtrack from dead ends. Better for: Problems where first approach might be wrong. Planning with discrete decision points. When compute available. (3) Self-consistency: Generate K CoT paths. Take majority answer. Effectively: Ensemble over reasoning paths. Less expensive than ToT. (4) Plan-and-Execute with reflection: Plan steps. Execute. Reflect on each step. Good for multi-step tasks with clear sub-goals. Recommendation by task: Math problems: Self-consistency (sample 5 CoT paths, take majority) → cost-effective, good accuracy. Complex planning: Plan-and-Execute → explicit, trackable. Open-ended reasoning: ReAct + Reflection → adaptive + quality. Combinatorial search: ToT → if compute allows.

**Q6: Production agent architecture design karte time key decisions kya hain?**

**Answer:** Key design decisions: (1) Single vs multi-agent: Does task benefit from parallelism or specialization? Most tasks: Single agent. Complex tasks with independent sub-tasks: Multi-agent. Don't over-engineer. (2) Planning depth: Reactive (ReAct) or planned (Plan-and-Execute)? Predictable structure → Plan. Exploratory → React. (3) Reflection: Add reflection for quality-critical outputs. Skip for speed-critical or simple tasks. (4) Tool set: Minimal effective set. More tools = more confusion. Start minimal, add based on observed gaps. (5) Memory: Working memory (context window) sufficient for short tasks. External memory for cross-session continuity, large knowledge bases. (6) Human-in-the-loop: Where are the human oversight checkpoints? Especially for irreversible or high-stakes actions. (7) Failure handling: What happens when tool fails? When agent gets stuck? Max steps? Graceful degradation. (8) Observability: How will you monitor and debug? Logging, tracing, intermediate output capture. Framework choice: Prototype: LangChain or AutoGen (fast iteration). Production: Raw API or LangGraph (control and stability). Evaluation: Before building complex architecture, build evaluation suite. Test if simpler architecture achieves needed quality.

---

## Key Takeaways

- **ReAct** = reactive loop; good for exploratory, adaptive tasks; most common baseline
- **Plan-and-Execute** = plan all steps first; good for structured, predictable tasks
- **Reflection** = generate → critique → improve; 20-30% quality gain for complex tasks
- **MRKL** = router + experts; best when multiple specialist tools/systems involved
- **Tree of Thoughts** = multi-path reasoning; expensive but powerful for combinatorial problems
- **Code-as-Plan** = programs as plans; precise, unambiguous for code-like tasks
- **Choose by task** = structure→Plan, exploration→ReAct, quality→Reflection, specialists→MRKL
- **Anti-patterns** = over-engineering, under-engineering, tight coupling, god agent
- **Start simple** = match complexity to need; add sophistication only when simple fails

---

*Agli file: `06_Agentic_Failures.md` — Agent kab aur kyun fail karta hai: Failure modes aur mitigation*
