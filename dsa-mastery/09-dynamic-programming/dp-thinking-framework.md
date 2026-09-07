# DP Thinking Framework

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** recursion, Big-O, arrays, basic graphs/trees vocabulary  
**Memory picture:** A notebook of answered questions — if you already solved a sub-question, copy the answer instead of redoing the whole exam.

---

## 1. What is it?

**Dynamic Programming (DP)** is a method to solve a big problem by solving **overlapping subproblems** once, storing each answer, and building the final answer from those stored pieces.

New words:

- **Subproblem** — a smaller version of the same question (often “for index `i`” or “for size `w`”).
- **Overlapping** — the same subproblem appears again and again in a naive recursion tree.
- **Optimal substructure** — the best answer for the big problem is built from best answers of smaller problems.
- **State** — the exact question you store: e.g. `dp[i]`, `dp[i][w]`, `dp[mask]`.
- **Transition** — the rule that combines smaller states into a bigger state.
- **Memoization** — top-down: recurse + cache.
- **Tabulation** — bottom-up: fill a table in order.
- **Base case** — states you know without recursion (empty, zero length, first cell).

DP is **not** “use an array named `dp`.” DP is: **define states → prove reuse → write transitions → pick order**.

---

## 2. Explain like I am 10

Imagine homework with 100 similar math questions.

Without DP: every time a question needs “what is 7+8?”, you add again from scratch.

With DP: you write `7+8=15` in a notebook. Next time you need it, you look it up.

DP = solve once, save, reuse. The hard skill is deciding **what to write in the notebook** (the state).

---

## 3. Real life story

You plan a road trip with many cities. For each city, you ask: “Cheapest way to reach here?”

Once you know the cheapest way to city B, every later path that goes through B can reuse that number. You do not recompute every path from the start for every destination.

```text
Start → A → B → D
Start → C → B → D
              ↑
         reuse "best cost to B"
```

That reuse is DP thinking. Companies use it for pricing, scheduling, recommendations, path costs, and text alignment.

---

## 4. Why does this exist?

Many important problems have:

1. Exponential naive search (all ways / all paths / all subsets)
2. Huge **overlap** in the search tree
3. A clean “best of smaller answers” structure

DP turns “try everything forever” into “fill a table of size roughly number of distinct states.”

Without a framework, people memorize 50 DP problems and freeze on problem 51. With a framework, you invent the table in the interview.

---

## 5. What problem existed before this?

Before DP was taught as a named technique, people used:

- pure recursion (correct but exponential)
- clever closed formulas (rare)
- greedy shortcuts (sometimes wrong)

Richard Bellman coined “dynamic programming” in the 1950s for multi-stage decision problems. Computer science later made the memo table the star of interview prep.

The pain that created DP: **recomputing the same sub-answer millions of times**.

---

## 6. What happens without it?

```text
Naive recursion tree (Fibonacci style)
          f(5)
       /        \
    f(4)         f(3)
   /   \        /   \
 f(3)  f(2)   f(2)  f(1)
  ... same f(2) computed many times
```

Without DP:

1. Time blows up (2ⁿ, n!, or worse).
2. Interviews fail even when the idea is “almost right.”
3. Production systems that score sequences / plans / budgets become too slow.
4. You cannot explain space–time tradeoffs.

---

## 7. How did people invent this? / How humans invented this

Story in simple steps:

1. People wrote recursive definitions (Fibonacci, shortest paths through stages).
2. They noticed the recursion tree had repeated nodes.
3. They stored answers in an array/table (memo).
4. They learned to fill the table in an order that only reads already-known cells (bottom-up).
5. Interview culture packed this into patterns: 1D, knapsack, grid, LCS, interval, bitmask, tree DP.

Invention lesson: **DP is organized remembering**, not magic math.

---

## 8. Computer intuition

The computer does not “understand” DP. You give it:

1. An array/map that maps **state → answer**
2. A loop or recursion that fills missing states
3. A transition that only reads “smaller” states

```text
MEMORY PICTURE — notebook of states

Question: best(i)
Notebook:
  best[0] = ...
  best[1] = ...
  best[2] = ...
  ...
When code asks best(i):
  if notebook has it → return
  else compute using best(smaller), write notebook, return
```

Top-down uses the call stack + cache. Bottom-up uses loops and careful order so the cache is filled before it is read.

---

## 9. Mathematical intuition

DP needs two properties (say them in interviews):

**1) Optimal substructure**  
`OPT(big) = combine(OPT(small1), OPT(small2), …)`

**2) Overlapping subproblems**  
The set of distinct states is much smaller than the size of the recursion tree.

Complexity sketch:

```text
Time ≈ (# distinct states) × (work per transition)
Space ≈ (# states you store)  (sometimes compress)
```

If states = O(n) and transition = O(1) → O(n).  
If states = O(n·W) and transition = O(1) → O(nW).  
If states = O(2ⁿ · n) → classic bitmask DP bound.

---

## 10. Step-by-step working

### The Top-1% DP checklist (memorize)

1. **Define the answer in words**  
   “What exactly do I want?” e.g. max value, min cost, true/false, count ways.

2. **Invent the state**  
   Write: `dp[…] = …` in one English sentence.  
   Include every parameter that changes the answer (index, remaining capacity, last choice, mask, node…).

3. **Write the transition**  
   How does a state depend on smaller states? (`max`, `min`, `+`, `||`, `&&`)

4. **Write base cases**  
   Empty array, zero capacity, first row/col, leaf node.

5. **Choose direction**  
   - Top-down memo if states are sparse / thinking is recursive  
   - Bottom-up if order is clear and you want tight loops

6. **Count complexity from states**  
   Never guess from “it looks nested.”

7. **Optimize space only after correctness**  
   Rolling arrays, `prev/curr`, bitsets — later.

8. **Reconstruct answer if asked**  
   Parent pointers / choice table / reverse walk.

### State design questions

Ask:

- What is my position in the input? (`i`)
- What budget / constraint remains? (`w`, `k`)
- What must I remember about the past? (last color, open brackets, mask of used items)
- Is the answer a number, boolean, or count? (affects transition)

---

## 11. Dry run

Problem: climb stairs — `n` steps, take 1 or 2 at a time. Ways to reach top?

State: `dp[i] = ways to reach step i`  
Transition: `dp[i] = dp[i-1] + dp[i-2]`  
Base: `dp[0]=1`, `dp[1]=1` (or `dp[1]=1`, `dp[2]=2`)

Dry run `n=4`:

```text
i:     0  1  2  3  4
dp:    1  1  2  3  5

Paths for 4:
1+1+1+1
1+1+2
1+2+1
2+1+1
2+2
→ 5 ways
```

Notice: `dp[3]` reused for `dp[4]` and would be reused again for larger `n`. That is the notebook.

---

## 12. Visualization

```text
FRAMEWORK FLOW

Problem statement
      ↓
"Can I define a state in one sentence?"
      ↓ yes
"Do states overlap / reuse?"
      ↓ yes
Write transition + base
      ↓
Estimate (#states × work)
      ↓ fits constraints?
      ↓ yes → implement
      ↓ no  → rethink state / algorithm (greedy, graph, math)


RECURSION TREE → DAG OF STATES

   Naive tree (huge)          DP DAG (shared nodes)
       A                         A
     /   \                      / \
    B     C                    B   C
   / \   / \                    \ /
  D   E E   F                    E
      ↑ overlap collapsed
```

Sticky image: **tree of questions collapses into a shared graph of unique questions.**

---

## 13. Complexity

General formula (say this every time):

| Piece | Cost |
|---|---|
| Number of states | S |
| Transition work per state | T |
| Time | O(S · T) |
| Space | O(S) unless compressed |

Examples:

| Pattern | S | T | Time |
|---|---|---|---|
| Climb stairs | O(n) | O(1) | O(n) |
| 0/1 knapsack | O(nW) | O(1) | O(nW) |
| LCS | O(n·m) | O(1) | O(nm) |
| Interval DP | O(n²) | O(n) | O(n³) |
| Bitmask TSP-style | O(2ⁿ·n) | O(n) | O(2ⁿ·n²) |

---

## 14. Why this complexity?

Because each state is computed **once**. The exponential explosion of the recursion tree disappears when identical nodes share one stored answer.

If your transition scans a range of length O(n), multiply that in. Interval DP is O(n³) for that reason — not because “DP is slow,” but because **T = O(n)**.

---

## 15. C++ implementation

Template: top-down memo for climb stairs.

```cpp
#include <bits/stdc++.h>
using namespace std;

int dfs(int i, vector<int>& memo) {
    if (i < 0) return 0;
    if (i == 0) return 1;
    if (memo[i] != -1) return memo[i];
    return memo[i] = dfs(i - 1, memo) + dfs(i - 2, memo);
}

int climbStairs(int n) {
    vector<int> memo(n + 1, -1);
    return dfs(n, memo);
}
```

Template: bottom-up.

```cpp
int climbStairsBU(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1);
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; ++i)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
```

Template: space-optimized.

```cpp
int climbStairsOpt(int n) {
    if (n <= 1) return 1;
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; ++i) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
```

**Habit:** write the English state comment above `dp`.

```cpp
// dp[i] = number of ways to reach step i
```

---

## 16. STL usage

Useful tools:

| Tool | DP use |
|---|---|
| `vector<int> dp(n, 0)` | dense 1D table |
| `vector<vector<int>> dp(n, vector<int>(m))` | 2D table |
| `vector<long long>` | counts / large values |
| `unordered_map` / `map` | sparse states (careful with TLE) |
| `vector<int> memo(n, -1)` | top-down sentinel |
| `numeric_limits<int>::min()/2` | avoid overflow when adding negatives in max DP |

Tips:

- Prefer `vector` over raw arrays in interviews unless size is tiny/fixed.
- For boolean knapsack, `vector<char>` or `bitset` can help.
- Initialize carefully: `0` for sums/ways, `-inf` for max, `+inf` for min.

---

## 17. Brute Force

Enumerate all valid sequences / subsets / partitions with recursion.

```cpp
// Brute: all ways to climb
int brute(int left) {
    if (left == 0) return 1;
    if (left < 0) return 0;
    return brute(left - 1) + brute(left - 2);
}
```

Correct for tiny `n`, exponential for large `n`. Always start interviews by stating this, then improve.

---

## 18. Better

Add memoization to the same recursion. Same logic, cached states.

This is often the fastest path in a live interview: **speak recursive meaning → add memo array → analyze states**.

---

## 19. Optimal

Bottom-up with minimal space when dependencies allow.

Optimal means:

1. Correct state definition
2. Linear pass over states when possible
3. Space equal to data you must remember (sometimes O(1), sometimes O(W), sometimes O(nm) unavoidable)

Do not call a solution “optimal” only because it is bottom-up. A wrong state with a nice loop is still wrong.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "DP means use a 2D array."
  Why it fails: state may be 1D, bitmask, tree, map.
  Correct: invent state from the question parameters.

Wrong: "If greedy works on one example, skip DP."
  Why it fails: greedy needs a proof; counterexamples exist.
  Correct: ask optimal substructure + exchange argument; else DP/search.

Wrong: "Memo without defining state meaning."
  Why it fails: you cache garbage dimensions / wrong keys.
  Correct: one English sentence for dp[...] first.

Wrong: "I filled a table, so answer is dp[n][n]."
  Why it fails: the answer cell depends on definition.
  Correct: know which cell (or max over cells) is the answer.

Wrong: "DP is always O(n²)."
  Why it fails: complexity follows states × transition.
  Correct: compute S and T every time.

Wrong: "Top-down is cheating / bottom-up is real DP."
  Why it fails: both are DP if states are cached and reused.
  Correct: pick the form that matches clarity and constraints.
```

---

## 21. Common mistakes

1. Missing a parameter in the state (answer depends on “last pick” but state forgot it).
2. Wrong loop order in bottom-up (reading unfilled cells).
3. Using `int` for ways that need `long long`.
4. Off-by-one on base cases (`dp[0]` meaning unclear).
5. Mixing “max value” init with zeros when negatives exist.
6. Modulo forgotten for “count ways.”
7. Reconstructing path without storing choices.
8. Claiming O(1) space while recursion depth is O(n).

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “How do you know DP applies?”  
**Expected answer:**  
“I check overlapping subproblems and optimal substructure. I define `dp[state]` in one sentence, write transitions, then time is number of states times transition work. If states are polynomial and fit constraints, DP is viable.”

### Amazon-style

**Interviewer:** “Customers care about latency. Your DP is O(nW). What do you say?”  
**Expected answer:**  
“I state constraints for `n` and `W`. If `W` is huge, classic knapsack DP may be too slow; I discuss meet-in-the-middle, approximations, or whether the business value needs exact optimality. I never hide the O(nW) dependency.”

### Microsoft-style

**Interviewer:** “Convert your memo recursion to bottom-up.”  
**Expected answer:**  
“List dependencies of each state. Iterate from base states outward so every read is already computed. Same recurrence, loop order replaces the call stack.”

### OpenAI-style

**Interviewer:** “When is DP the wrong hammer?”  
**Expected answer:**  
“When subproblems do not overlap, when a greedy proof exists, when a graph shortest-path model is cleaner, or when state space is enormous with no structure. Also when we only need any feasible solution and exhaustive search with pruning is enough.”

**Speaking tip:** Narrate: “State → transition → base → complexity → code.”

---

## 23. Company use cases

| Company / domain | DP-shaped problem |
|---|---|
| Google | sequence alignment, routing stages, ad auction utilities |
| Amazon | warehouse packing / shipping cost stages, recommendation scoring |
| Microsoft | editor diff (LCS-like), compiler optimization tables |
| OpenAI / ML infra | decoding search, alignment costs, staged planning scores |
| Finance / games | knapsack-like budgets, turn-based optimal play |

Pattern in industry: **multi-stage decisions with reusable stage scores**.

---

## 24. Related concepts + pattern recognition cues

**Related:** recursion, memoization, shortest paths (Bellman-Ford feeling), knapsack, LCS/edit distance, interval DP, bitmask DP, tree DP, greedy (sometimes alternative).

**Cues to open the DP notebook:**

```text
IF "max/min/count ways" + choices at each step
→ try DP state

IF recursion TLE / exponential tree with repeats
→ memoize; count distinct states

IF "capacity / budget / k transactions"
→ add that dimension to state

IF substring / subsequence / match two strings
→ grid DP on indices (i, j)

IF "burst balloons / matrix chain / palindrome partition"
→ interval DP

IF n ≤ 20 and subsets of items/cities
→ bitmask DP
```

**Cues DP may be wrong tool:**

```text
Need any valid arrangement, not optimal → backtracking
Local choice always safe with proof → greedy
Pure reachability on graph without overlapping score table → BFS/DFS
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
DP = define state + reuse answers
Time = #states × work per state
Top-down memo ≡ bottom-up table (same math)
Write English meaning of dp[...] before code
Wrong state → wrong answer forever
```

### Checklist

- [ ] Say optimal substructure + overlapping in your own words
- [ ] Write state sentence for climb stairs, knapsack, LCS
- [ ] Convert one memo solution to bottom-up
- [ ] Compute complexity from S×T, not vibes
- [ ] List 3 wrong-thinking traps

### Practice plan

1. Day 1: climb stairs, house robber, fib — force state sentences.
2. Day 2: 0/1 knapsack + subset sum — add capacity dimension.
3. Day 3: unique paths + LCS — 2D index DP.
4. Day 4: take one hard problem; spend 15 minutes on state only before coding.
5. Weekly: re-explain this framework closed-book for 3 minutes.

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite 8-step checklist + climb stairs dry run |
| 3 | Invent states for 3 random problems without coding |
| 7 | Code memo + BU + space-opt for one 1D DP from memory |
| 15 | Teach framework to a rubber duck with company prompts |
| 30 | Revisit a failed DP from your tracker; rewrite state first |
| 90 | Mock: interviewer only allows state talk for 5 minutes, then code |

```text
Item: DP Thinking Framework
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90 days
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Explain notebook metaphor |
| L2 | Write state + transition for easy 1D |
| L3 | Convert memo ↔ bottom-up |
| L4 | Estimate S×T and spot missing state params |
| L5 | Invent DP for unseen prompts under interview pressure |
