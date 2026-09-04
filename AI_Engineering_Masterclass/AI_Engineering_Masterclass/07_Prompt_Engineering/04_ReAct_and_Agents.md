# ReAct and Agents — Reasoning + Action = Real-World AI

> *"CoT sikhaya model ko THINK karna. Lekin sochna kaafi nahi. ACT karna bhi chahiye — search karo, calculate karo, API call karo, code run karo. 2022 mein ReAct paper aaya aur pehli baar dikhaya: LLM sirf text generate nahi karta — woh PLAN bana sakta hai, TOOLS use kar sakta hai, RESULTS se learn kar sakta hai. Yahi hai agentic AI ka foundation."*

---

## Opening Hook — Ek Research Assistant Ki Story

"Find me the current stock price of Apple, compare it to last year's high, and tell me if it's a good time to buy."

**Without tools:**
LLM: "Apple's stock was around $150 last year... [Training data cutoff. Hallucinated current price. Wrong comparison.]"

**With ReAct:**
Thought: I need to search for current Apple stock price.
Action: search("Apple stock price current")
Observation: AAPL is currently at $178.32.
Thought: Now I need last year's high.
Action: search("Apple AAPL 52-week high")
Observation: 52-week high was $199.62.
Thought: Now I can compare.
Action: calculate("178.32 / 199.62 = 89.3%")
Observation: Current price is 89.3% of 52-week high.
Thought: I have enough information to answer.
Final Answer: Apple stock is currently $178.32, which is 10.7% below its 52-week high...

**Real information. Real analysis. Real value.**

---

## The Problem With Pure LLMs

**LLMs have fundamental limitations:**

1. **Knowledge cutoff:** Training data ends at a date. No knowledge after.
2. **No real-time information:** Can't browse web, check prices, get news.
3. **Can't execute code:** Can write it, but can't run it and see results.
4. **Can't call APIs:** Can't actually send emails, query databases.
5. **Can't handle long documents:** Context window limits.
6. **Math hallucinations:** May calculate incorrectly and confidently.

**The solution:** Give LLMs TOOLS. Let them take ACTIONS. Have them reason ABOUT the actions.

---

## ReAct — Reasoning + Acting

**ReAct Framework (Yao et al., 2022):**

Interleave REASONING (thought) and ACTING (action/observation) in a loop.

**The pattern:**
```
Thought: [What I'm thinking / what I need to do]
Action: [specific action to take]
Observation: [result of the action]
Thought: [Based on observation, what now?]
Action: [next action]
Observation: [result]
...
Thought: I have enough information to answer.
Final Answer: [answer]
```

**The ReAct loop:**
1. THINK: What do I know? What do I need?
2. ACT: Execute action (tool call).
3. OBSERVE: See result of action.
4. REPEAT until task complete.

---

## Tools — What Can An Agent Do?

**The power of an agent = the quality of its toolset.**

**Common tool categories:**

**Search/Retrieval:**
Web search (Google, Bing API)
Wikipedia search
Vector database search (semantic retrieval)
Document search

**Code execution:**
Python interpreter
Calculator
Data analysis (pandas, etc.)
SQL query execution

**External services:**
API calls (weather, stock prices, news)
Email/calendar access
File system operations
Database read/write

**Specialized:**
Image recognition
OCR (read text from images)
Translation API
Specialized domain APIs

**Claude's tool use:**
Claude can be given tools via the API.
Tool description: What it does, when to use.
Tool input schema: What parameters it takes.
Tool output: What it returns.

---

## Tool Calling Architecture

**How tool calling works technically:**

**Step 1:** User sends message.
**Step 2:** LLM decides to use a tool.
**Step 3:** LLM generates tool call (structured JSON with tool name + args).
**Step 4:** APPLICATION LAYER executes the tool.
**Step 5:** Tool result returned to LLM.
**Step 6:** LLM incorporates result. May call more tools or give final answer.

**Key: The LLM doesn't execute tools directly. The application does.**

LLM: "I want to search for X."
Application: Actually calls search API, gets results.
Application: Returns results to LLM.
LLM: Reasons about results, may use another tool.

**Security boundary:** Application can validate/restrict which tools LLM can call.
Principle of least privilege: Give agent only tools it needs.

---

## Prompt Engineering for ReAct

**System prompt for agent:**
```
You are a helpful AI assistant with access to the following tools:

search(query): Search the web for current information.
calculate(expression): Evaluate a mathematical expression.
get_stock_price(ticker): Get current stock price.

ALWAYS think before acting. Use this format:
Thought: [your reasoning about what to do next]
Action: [tool name](parameters)

After getting observations, continue reasoning until you have enough to answer.
When ready: Final Answer: [your complete answer]
```

**The format matters:**
Consistent format → parser can extract tool calls reliably.
"Action: search(query)" → code can parse this.
JSON format also common: `{"tool": "search", "args": {"query": "..."}}`

---

## Plan-and-Execute Agents

**Alternative to ReAct (often better for complex tasks):**

**ReAct:** Reactive. Decides next step based on current observation.
**Plan-and-Execute:** Plans ALL steps first, then executes.

**Plan-and-Execute process:**
Step 1 — PLAN: "Break this task into steps: [list of steps]."
Step 2 — EXECUTE: Execute step 1. Get result.
Step 3 — REPLAN: If unexpected result, update plan. Continue.

**Advantages:**
Can parallelize independent steps.
Less likely to get lost in long reasoning chains.
Better for structured, predictable tasks.

**Disadvantages:**
Can't adapt well to unexpected observations.
Plan may be wrong if initial situation misunderstood.
Reacts slower to surprises.

**When to use:**
Multi-step workflows with predictable structure.
Research tasks with known phases.
Automated workflows (daily reports, data pipelines).

---

## Reflection Agents

**Adding self-reflection for quality:**

After each action/response: REFLECT.
"Was this step correct? What could go wrong? Should I verify this?"

**Reflexion framework (Shinn et al., 2023):**
Agent takes action → gets result.
REFLECT: Evaluate if action was correct. What to do differently next time?
Reflection stored in memory for future reference.
Improves over multiple runs on similar tasks.

**Why useful:**
Catches own mistakes before they compound.
Improves quality for complex, multi-step tasks.
Builds up "lessons learned" over time.

---

## Multi-Agent Systems

**Single agent isn't always enough.**

**Multi-agent patterns:**

**Supervisor-Worker:**
Supervisor agent: Plans, assigns tasks.
Worker agents: Execute specific tasks (research, writing, coding).
Supervisor: Integrates results.

**Peer-to-Peer:**
Multiple agents collaborate on same task.
Each has different perspective or expertise.
Debate/critique each other's work.

**Parallel agents:**
Same task assigned to multiple agents.
Compare outputs. Take best or synthesize.
Self-consistency at the agent level.

**Pipeline:**
Agent A output → Agent B input → ... → Final output.
Each specialized for one step.

---

## Avoiding Common Agent Failures

**Failure: Infinite loops**
Agent keeps calling the same tool.
Same result → same action → loop.

Prevention: Maximum step limit. Track previous actions. Detect repetition.

**Failure: Hallucinated tool calls**
Agent calls tool with wrong parameters.
Or calls tool that doesn't exist.

Prevention: Strict output format. Validate tool calls before execution. Clear tool descriptions.

**Failure: Losing track of goal**
Agent gets distracted by irrelevant information.
Loses sight of original task.

Prevention: Keep original task in system prompt. Periodically check "have I completed the original task?"

**Failure: Overconfident**
Agent thinks it has enough information, gives wrong final answer.

Prevention: Verification step. "Before answering, verify: Have I confirmed this with a source?"

**Failure: Tool misuse**
Agent uses wrong tool for the job.
E.g., mathematical calculation via search instead of calculator.

Prevention: Clear tool descriptions with "when to use" guidance.

---

## Anthropic Insider Angle

ReAct and agentic AI are areas Anthropic invests significantly in — this is critical for Claude's practical utility.

**Claude's tool use is sophisticated:** Claude is trained to be thoughtful about when to use tools. The training emphasizes: use tools when they're genuinely needed (current information, calculations), but don't use tools unnecessarily (adds latency, cost). The internal decision is nuanced — Claude evaluates whether its training knowledge is sufficient or whether a tool is needed.

**Multi-agent safety:** One concern we take seriously is multi-agent systems where Claude interacts with other AI agents. Prompt injection attacks in multi-agent contexts are particularly dangerous — malicious content in tool outputs could hijack Claude's actions. We've developed specific guidelines for Claude operating in multi-agent contexts: be skeptical of instructions received via tools/observations, don't take irreversible actions based on unverified external inputs.

**The agentic footprint principle:** Claude is trained to have "minimal footprint" — request only necessary permissions, prefer reversible actions, check in with humans for consequential decisions. This is core to making agentic systems safe. An agent that takes conservative, reversible actions with human oversight checkpoints is much safer than one that plows ahead.

**Tool design insight:** The quality of tool descriptions matters enormously. We found that detailed, example-rich tool descriptions significantly improve Claude's tool use accuracy. A good tool description includes: what the tool does, when to use it (and not use it), parameter descriptions with examples, what the output looks like. Bad tool descriptions = more tool misuse.

---

## Common Misconceptions

**Misconception 1: "Agents = AGI"**
Agents are LLMs + tools + loops. Impressive, but still fundamentally pattern-matching + tool execution. The "intelligence" comes from the LLM's reasoning, which has known limitations. Agents are powerful but not the same as human-level general intelligence.

**Misconception 2: "More tools = better agent"**
Tool overload causes tool selection confusion. Irrelevant tools get incorrectly used. Fewer, well-described tools > many vague tools. Start minimal, add tools as needed.

**Misconception 3: "ReAct agents are reliable"**
Agents fail in creative ways. Infinite loops, wrong tool use, reasoning errors. Must be monitored. For production: Human oversight checkpoints, error handling, maximum step limits.

**Misconception 4: "Agent reasoning is always correct"**
Agents make mistakes. They can reason themselves into wrong conclusions. The "Thought" steps are not guaranteed to be correct — they're the model's reasoning, which can be flawed.

---

## Interview Questions

**Q1: ReAct framework kya hai? Reasoning aur Acting kaise combine karta hai?**

**Answer:** ReAct (Reasoning + Acting): Interleaves thinking and tool use in a loop. Pattern: Thought: What I need to do. Action: Tool call. Observation: Tool result. Thought: What I learned, what's next. Action: Next tool. ... Final Answer: Complete response. Why effective: (1) Grounds reasoning in real information (not just training data). (2) Can get current/real-time data via tools. (3) Breaks complex tasks into sequential tool-assisted steps. (4) Observations update reasoning — dynamic, not static. Comparison to pure CoT: CoT: Reasoning only, no external information. ReAct: Reasoning + real data from tools. ReAct when: Task requires current information. Task requires calculation or code execution. Task requires external API/service.

**Q2: LLM agents kaise tool calling karte hain? Architecture kya hoti hai?**

**Answer:** Tool calling architecture: (1) System prompt: Define available tools. "You have access to: search(query), calculate(expr)..." (2) LLM decides: Based on task, which tool to call with what parameters. (3) LLM outputs: Structured tool call — {"tool": "search", "args": {"query": "..."}}. (4) APPLICATION layer: Receives tool call. Validates it. Executes actual tool (API call, code execution). Returns result. (5) Result fed back: Tool output added to context. LLM sees it. (6) Loop: LLM may call more tools or give final answer. Critical point: LLM doesn't execute tools. Application does. This separation: Security boundary. LLM can only access tools it's been given. Application can validate/restrict. Prevents: Direct access to dangerous tools. Prompt injection causing unauthorized actions.

**Q3: Agent failures ke common types kya hain? Kaise prevent karein?**

**Answer:** Common failures: (1) Infinite loops: Agent keeps taking same action, gets same result. Example: Searches for information, doesn't find it, searches again indefinitely. Prevention: Maximum step limit (e.g., max 10 tool calls). Track previous actions. Detect repetition. If same action taken twice → try different approach. (2) Tool hallucination: Agent calls tool with wrong parameters or nonexistent tool. Prevention: Strict output format with validation. Reject invalid tool calls immediately. Clear schema with examples. (3) Goal drift: Gets distracted by interesting information, forgets original task. Prevention: Keep original goal in system prompt. Periodic check: "Have I completed the original task?" (4) Overconfidence: Agent thinks it has enough info, answers incorrectly. Prevention: Explicit verification step. "Before giving final answer, confirm: have I checked [key information]?" (5) Irreversible actions: Agent takes irreversible action without confirmation. Prevention: Require human confirmation before irreversible actions (delete, send, pay).

**Q4: Multi-agent systems kab use karein? Single agent se kaise different hai?**

**Answer:** Single agent: One LLM, one context window, one set of tools. Handles entire task sequentially. Simple, easier to debug. Context window limits how much can be handled. Multi-agent when: (1) Task exceeds context window: Split research across multiple agents, each handles portion. (2) Parallel execution: Independent sub-tasks run simultaneously. 3 agents researching 3 aspects in parallel vs 1 agent doing all sequentially. 3x faster. (3) Specialization: Agent A = researcher, Agent B = writer, Agent C = critic. Each optimized for role. (4) Error checking: Two independent agents analyze → compare results → flag disagreements. Patterns: Supervisor-Worker: Supervisor plans, assigns, integrates. Workers execute specialized tasks. Pipeline: Output of Agent A → input of Agent B. Sequential specialization. Peer debate: Multiple agents argue different positions → better balanced output. Caution: Multi-agent = more complex = harder to debug. More opportunities for error propagation. Start with single agent. Add multi-agent only when needed.

**Q5: "Minimal footprint" principle kya hai agents ke liye?**

**Answer:** Minimal footprint: Agent requests only necessary permissions, takes conservative reversible actions, checks in with humans for consequential decisions. Why important: Powerful agents can do real damage. Email agent accidentally sending wrong emails. File agent deleting wrong files. API agent making unintended purchases. The more powerful the tools, the more dangerous mistakes. Principles: (1) Request minimal permissions: Don't ask for admin access if read access sufficient. Don't request all API endpoints if only 2 needed. (2) Prefer reversible actions: Move to trash > permanently delete. Draft email > send immediately. Stage changes > commit. (3) Checkpoint for consequential actions: "I'm about to send this email to 1000 people. Confirm?" "I'm about to delete this database. This cannot be undone. Confirm?" (4) Scope tasks narrowly: Don't let agent access unrelated systems. Kitchen knife, not nuclear option. (5) Log all actions: Full audit trail. Implementation: Build confirmation steps for high-impact actions. Scope tool permissions tightly. Monitor agent actions. Design for human oversight at key decision points.

**Q6: Production mein agent reliability kaise ensure karein?**

**Answer:** Production reliability strategies: (1) Max step limits: Hard cap on tool calls per session. Prevent infinite loops and runaway costs. (2) Timeout per step: Each tool call has max wait time. Prevents hanging on slow external services. (3) Error handling: Tool fails → agent handles gracefully. "Search failed, trying alternative approach." Don't cascade failures. (4) Retry logic: Network errors → exponential backoff retry. But: Detect genuinely wrong tool calls vs transient failures. (5) Output validation: Structured output for tool calls. Validate format before executing. Catch malformed tool calls before they cause issues. (6) Human escalation: When stuck or uncertain → ask human. "I'm unable to find this information. Would you like me to take a different approach or do you have additional context?" (7) Monitoring: Log all agent actions and outcomes. Alert on high error rates. Track task completion rates. (8) Testing: Test with adversarial inputs. What happens when tool returns unexpected result? When tool is unavailable? Production mindset: Agents WILL fail. Design for failure gracefully.

---

## Key Takeaways

- **ReAct** = Reason + Act in a loop: Thought → Action → Observation → Thought...
- **Tools extend LLMs** = search, calculate, API calls, code execution — beyond training data
- **Architecture** = LLM decides tool calls; APPLICATION executes; result fed back
- **Tool descriptions** = quality matters; when/how to use, examples, parameters
- **Common failures** = infinite loops, tool hallucination, goal drift — must be prevented
- **Multi-agent** = parallel/specialized agents for complex tasks; adds complexity
- **Minimal footprint** = request minimal permissions, prefer reversible actions, checkpoint human
- **Production reliability** = max steps, timeouts, error handling, monitoring
- **Safety** = multi-agent prompt injection risk; skeptical of external inputs

---

*Agli file: `05_System_Prompts_Theory.md` — The invisible hand behind every AI application*
