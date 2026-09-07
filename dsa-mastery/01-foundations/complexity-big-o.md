# Complexity & Big-O

**Module:** 01-foundations  
**Level target:** L4 (explain, dry-run, code comparisons, interview wording)  
**Prerequisite:** basic C++ loops and functions  
**Memory picture:** A factory line — Big-O counts how many boxes you open, not how fancy the boxes look.

---

## 1. What is it?

**Time complexity** answers: *If the input grows, how much work grows?*  
**Space complexity** answers: *If the input grows, how much extra memory grows?*

**Big-O** is a shorthand that names the *growth shape* of that work, for large inputs. We ignore constants and small details, and keep the term that grows the fastest.

New words:

- **Input size `n`** — how big the problem is (array length, string length, number of nodes).
- **Operation** — one basic step the computer treats as roughly equal cost (compare two numbers, read/write one array cell).
- **Asymptotic** — “when `n` is very large.”
- **Upper bound** — “this will not grow faster than …”

---

## 2. Explain like I am 10

Imagine you have a pile of toys.

- If you look at **each toy once**, more toys → more looking. That grows **like the pile** → O(n).
- If you compare **every toy with every other toy**, the work grows much faster → O(n²).
- If you can keep **cutting the pile in half** (like “is my toy in this half?”), the pile shrinks fast → O(log n).

Big-O is a sticker that says how your work grows when the pile gets bigger.

---

## 3. Real life story

You work at a library.

**Task A:** Find if a book title exists in a messy shelf of `n` books. You check one by one. Double the books → roughly double the time. Growth: **linear**, O(n).

**Task B:** The same shelf is sorted. You open the middle, throw away half, repeat. Double the books → only about **one extra check**. Growth: **logarithmic**, O(log n).

**Task C:** You pair every book with every other book to see title clashes. Double the books → about **four times** the pairs. Growth: **quadratic**, O(n²).

Companies care about this because real systems face millions of users and records. A slow growth shape turns into “the app freezes” or “the bill explodes.”

---

## 4. Why does this exist?

Code that “works on 10 items” can die on 10 million items. Interviews and production both need a shared language to compare solutions **before** you measure every machine.

Big-O lets two engineers say:

```text
Mine is O(n log n) time and O(1) extra space.
Yours is O(n²) time.
For large n, mine wins on time.
```

Without that language, debates stay fuzzy: “mine feels faster.”

---

## 5. What problem existed before this?

Early programmers often only asked: “Does it finish on my machine today?” That fails when:

- input size jumps from homework size to industry size
- hardware changes
- many people share one server

People needed a machine-independent way to talk about growth. Big-O (and related notations) became that tool in algorithms.

---

## 6. What happens without it?

Without complexity thinking:

1. You pick a nested-loop solution that passes tiny tests and fails at scale.
2. You waste memory with huge copies and hit limits.
3. In interviews, you cannot defend why your approach is good.
4. In systems, one endpoint becomes a bottleneck for the whole product.

```text
"It works for n = 100"
        ↓
shipped to production with n = 10,000,000
        ↓
timeouts, angry users, expensive servers
```

---

## 7. How did people invent this?

Humans noticed patterns: sorting, searching, and counting always grew in a few common shapes. Mathematicians formalized **asymptotic notation** so we could prove upper/lower bounds. Engineers adopted **Big-O** in interviews and design docs because it is practical: pick the dominant term, drop constants, compare candidates fast.

Common family of shapes people kept seeing:

```text
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
```

(For large enough `n`. Constants can change small cases.)

---

## 8. Computer intuition

The computer does steps. CPU time is mostly:

- how many times you touch memory
- how many times you branch / compute

When we say a loop over an array of size `n` is O(n), we mean: the number of array visits grows proportionally with `n`.

```text
MEMORY PICTURE — reading an array once

index:  0   1   2   3   4
value: [7] [2] [9] [1] [5]
         ^
         walk once → about n visits → O(n) time
         extra memory: a few variables → O(1) space
```

Nested loops over the same `n`:

```text
for i in 0..n-1:
    for j in 0..n-1:
        // one body

i=0:  j j j j j   (n times)
i=1:  j j j j j
...
i=n-1: j j j j j

Total visits ≈ n * n → O(n²)
```

---

## 9. Mathematical intuition

Let `T(n)` be the number of basic steps for input size `n`.

We say `T(n) = O(f(n))` if there exist constants `c > 0` and `n0` such that for all `n ≥ n0`:

```text
T(n) ≤ c * f(n)
```

Meaning: after some point, `T(n)` never grows faster than a constant times `f(n)`.

Practical recipe used in interviews:

1. Count loops / recursive branches carefully.
2. Write an expression like `3n² + 10n + 50`.
3. Drop lower-order terms → `3n²`.
4. Drop constant coefficient → **O(n²)**.

Related notations (know names, use Big-O most of the time):

| Notation | Meaning (simple) |
|---|---|
| Big-O | upper bound on growth |
| Omega (Ω) | lower bound on growth |
| Theta (Θ) | tight: same order upper and lower |

Also know:

- **Best / average / worst case** — different inputs of the same size can cost differently. Interviews usually want **worst-case** unless they ask otherwise.
- **Amortized** — average cost per operation over a long sequence (example: dynamic array push_back).

---

## 10. Step-by-step working

**Goal:** Find the maximum in an unsorted array.

Steps:

1. Start with `best = first element` (or a tiny sentinel if empty-handled).
2. Walk each remaining element once.
3. If current > best, update best.
4. Return best.

Work: about `n` comparisons → O(n) time.  
Extra memory: a few ints → O(1) space.

**Goal:** Check if any two numbers sum to `target` (later you will use hashing; here we compare growth).

Brute:

1. For each index `i`
2. For each index `j > i`
3. If `a[i] + a[j] == target`, return true

Pairs ≈ `n(n-1)/2` → O(n²) time, O(1) extra space.

---

## 11. Dry run

Array: `[4, 1, 7, 3]`, find max.

| Step | i | a[i] | best | notes |
|---|---|---|---|---|
| start | — | — | 4 | take first |
| 1 | 1 | 1 | 4 | 1 < 4, keep |
| 2 | 2 | 7 | 7 | update |
| 3 | 3 | 3 | 7 | keep |

Result: `7`. Visits: 4 elements → grows with `n`.

Two-sum brute dry run for `target = 10`, array `[4, 1, 7, 3]`:

```text
i=0 (4): check 1,7,3 → 4+1=5, 4+7=11, 4+3=7
i=1 (1): check 7,3   → 1+7=8, 1+3=4
i=2 (7): check 3     → 7+3=10  FOUND
```

Comparisons grow like triangles under the square → O(n²).

---

## 12. Visualization

```text
GROWTH SKETCH (rough, for large n)

ops
 |                         *  O(n²)
 |                    *
 |               *
 |          *                    * O(n log n)
 |     *                    *
 |  *  *  *  *  *  *  *  *  *  *  O(n)
 | *                             O(log n)
 |*______________________________ O(1)
 +--------------------------------→ n
```

```text
BINARY SEARCH HALVING (O(log n) checks)

[................]  n
[........]          n/2
[....]              n/4
[..]                n/8
[]                  ~1

How many cuts until 1? about log2(n)
```

```text
MEMORY: O(n) extra space vs O(1)

Input array A: [a0 a1 a2 ... an-1]

O(1) extra:   only a few scalars   →  ○ ○ ○

O(n) extra:   copy / freq map size n
              [b0 b1 b2 ... bn-1]
```

---

## 13. Complexity

Common table (time, typical):

| Pattern | Complexity |
|---|---|
| Few arithmetic ops, array index | O(1) |
| Halve search space each step | O(log n) |
| One pass | O(n) |
| Sort comparison-based (general) | O(n log n) |
| Nested loop over n×n | O(n²) |
| Triple nested | O(n³) |
| Subsets / recursion branching 2 | O(2ⁿ) |
| All permutations | O(n!) |

Space:

| Pattern | Extra space |
|---|---|
| In-place few variables | O(1) |
| Recursion depth d | O(d) call stack |
| Copy of input / hash of all keys | O(n) |

---

## 14. Why this complexity?

- **O(1):** work does not depend on `n` (example: access `a[i]`, add two numbers).
- **O(log n):** each step throws away a constant fraction (often half) of the space.
- **O(n):** each element (or each of `n` items) is processed a constant number of times.
- **O(n log n):** often “do O(log n) work per element” or “divide and conquer merge cost.”
- **O(n²):** each pair, or loop i with inner loop proportional to n.
- **Exponential / factorial:** exploring almost all combinations; grows so fast it is only OK for tiny `n`.

Why we drop constants: for large `n`, `n²` beats `100n`. For tiny `n`, constants matter — say that in interviews when relevant.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// O(n) time, O(1) extra space
int findMax(const vector<int>& a) {
    if (a.empty()) throw runtime_error("empty");
    int best = a[0];
    for (size_t i = 1; i < a.size(); ++i) {
        if (a[i] > best) best = a[i];
    }
    return best;
}

// O(n^2) time, O(1) extra space
bool twoSumBrute(const vector<int>& a, int target) {
    int n = (int)a.size();
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (a[i] + a[j] == target) return true;
        }
    }
    return false;
}

// O(n) time average, O(n) extra space (hash set)
bool twoSumHash(const vector<int>& a, int target) {
    unordered_set<int> seen;
    for (int x : a) {
        int need = target - x;
        if (seen.count(need)) return true;
        seen.insert(x);
    }
    return false;
}

int main() {
    vector<int> a = {4, 1, 7, 3};
    cout << findMax(a) << "\n";                 // 7
    cout << boolalpha << twoSumBrute(a, 10) << "\n"; // true
    cout << twoSumHash(a, 10) << "\n";          // true
}
```

---

## 16. STL usage

Complexity of common STL pieces you will use every week:

| Tool | Typical cost (know the guarantee) |
|---|---|
| `vector` random access `a[i]` | O(1) |
| `vector` push_back | amortized O(1) |
| `sort(a.begin(), a.end())` | O(n log n) |
| `lower_bound` on sorted range | O(log n) |
| `unordered_map` / `unordered_set` find/insert | average O(1), worst O(n) |
| `map` / `set` find/insert | O(log n) |
| `priority_queue` push/pop | O(log n) |
| `deque` push/pop ends | O(1) |

Interview tip: if the interviewer cares about worst-case guarantees, prefer `map`/`set` (log n) over `unordered_*` (hash worst-case).

---

## 17. Brute Force

For two-sum: check all pairs → O(n²) time, O(1) space.

When brute is OK:

- `n` is tiny (constraints say n ≤ 100 and O(n²) fits)
- you need a correct baseline first

Always state constraints mentally:

```text
n ≤ 20        → 2^n maybe OK
n ≤ 100       → n³ maybe OK
n ≤ 1e5       → need ~ n log n or better
n ≤ 1e7+      → need near-linear / linear
```

---

## 18. Better

Sort + two pointers for two-sum existence (if duplicates / indices rules allow your variant):

1. Sort O(n log n)
2. Left/right pointers move inward O(n)

Total O(n log n) time, O(1) or O(n) space depending on whether you may mutate / need index mapping.

Still not always best if you need original indices and average O(n) is accepted — hashing wins then.

---

## 19. Optimal

For “does any pair sum to target?” with average-case hashing allowed:

- One pass + `unordered_set` → **O(n)** time average, **O(n)** space.

“Optimal” means: best for the constraints and requirements (time vs space vs worst-case). Always ask what to optimize.

```text
Decision sketch for two-sum style:

Need O(1) extra space + can sort?  → sort + two pointers
Need original indices + fast average? → hash map
Need strict worst-case log factors? → balanced tree map
```

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "I have two loops, so it is always O(n²)."
  Why it fails: inner loop may run O(1) or O(log n) or O(n - i).
  Correct: multiply (or sum) the real iteration counts.

Wrong: "Hash map is always O(1), so always best."
  Why it fails: worst-case, memory, and simplicity matter; constants matter for small n.
  Correct: state average vs worst-case; match constraints.

Wrong: "O(2n) is worse than O(n)."
  Why it fails: Big-O drops constants; both are O(n).
  Correct: say both linear; mention constant only if asked about practical speed.

Wrong: "Recursive code is free on space."
  Why it fails: call stack uses memory proportional to depth.
  Correct: count recursion depth in space.
```

---

## 21. Common mistakes

1. Forgetting that `sort` is O(n log n), then saying “my algorithm is O(n).”
2. Claiming `unordered_map` is O(1) worst-case.
3. Ignoring output size (building a huge answer is not free).
4. Confusing **extra** space with total space including input.
5. Using O(n!) / O(2ⁿ) without checking constraints.
6. Counting only loops and missing recursive branching.
7. Saying “O(n/2) = O(n/2)” as if different from O(n).

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Is your solution O(n)? Prove it.”  
**Expected answer:**  
“Each element enters the hash set at most once and we do a constant amount of work per element, so time is linear in n on average. Extra memory stores up to n keys, so O(n) space. If we need worst-case guarantees, I would use a tree map and accept O(n log n).”

### Amazon-style (leadership + practical)

**Interviewer:** “n can be 5 million in production. What do you pick and why?”  
**Expected answer:**  
“O(n²) is too slow. I would use a linear pass with a hash set if memory allows. I would also discuss memory limits, collision risk, and monitoring latency. If memory is tight, sort + two pointers uses less extra RAM at O(n log n) time.”

### Microsoft-style

**Interviewer:** “Walk me through Big-O of this nested loop where inner runs from i to n.”  
**Expected answer:**  
“Outer i from 0..n-1, inner length is n-i. Sum is n + (n-1) + … + 1 = n(n+1)/2 → O(n²).”

### OpenAI-style (clear reasoning)

**Interviewer:** “Explain Big-O to a teammate who only writes product code.”  
**Expected answer:**  
“Big-O is a growth label. It tells us how runtime and memory stretch when data grows. We use it to reject solutions that will melt at scale, and to choose among correct options. I still measure hotspots, but Big-O filters bad designs early.”

**Interview habits that score well:**

- State time and space together.
- State best/average/worst when relevant.
- Tie complexity to constraints.
- Offer a tradeoff (time vs space).

---

## 23. Company use cases

| Company-style system | Complexity thinking in real life |
|---|---|
| Google Search / ranking pipelines | Must stay near-linear or n log n on huge corpora |
| Amazon checkout / inventory | Hot paths need low latency; avoid quadratic scans of catalogs |
| Microsoft Office / cloud docs | Large documents: prefer incremental O(k) updates over full O(n) rebuilds when possible |
| OpenAI / ML platforms | Batch sizes and token counts; algorithms over sequences must scale with length |
| Any backend API | Database query without index can become O(n) table scan under load |

---

## 24. Related concepts + pattern recognition cues

**Related:** recursion stack space, amortized analysis, binary search, sorting lower bounds, hashing, two pointers, sliding window.

**Pattern cues — when complexity is the real topic:**

```text
IF constraints show n = 1e5 and your idea is nested loops
→ alarm: need better than O(n²)

IF you "look at all pairs / all subsets"
→ O(n²) or worse; ask if structure (sort/hash/window) can reduce

IF search space halves each step
→ think O(log n)

IF each element processed constant times with hash/window
→ aim O(n)
```

Connects forward to: arrays/strings (two pointers, sliding window), trees/graphs (V+E), DP (state count × transition cost).

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Big-O = growth sticker for large n
Count dominant work + extra memory
Brute → Better → Optimal under constraints
Say time AND space in interviews
```

### Checklist (close the file and answer)

- [ ] Define Big-O in one sentence
- [ ] Order: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- [ ] Dry-run why triangle sum is O(n²)
- [ ] Code max-find and two-sum hash in C++ from memory
- [ ] Explain unordered_map average vs worst case

### Practice plan

1. Re-derive complexities for your last 10 solutions.
2. For each new problem, write complexity **before** coding.
3. Solve 5 easy/medium problems where the win is moving O(n²) → O(n).

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite the growth order + one example each |
| 3 | Dry-run two-sum brute vs hash on paper |
| 7 | Code both from memory; state complexities aloud |
| 15 | Teach Big-O for 5 minutes; quiz yourself on STL costs |
| 30 | Mixed: analyze 3 random old solutions |
| 90 | Mock: explain tradeoffs to Google/Amazon/Microsoft/OpenAI prompts above |

```text
Item: Complexity & Big-O
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90 days
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Explain to a child with toys/library |
| L2 | Dry-run and count operations on a small array |
| L3 | Implement and label brute/better/optimal in C++ |
| L4 | Defend complexity under interview follow-ups |
| L5 | Spot hidden quadratic bugs in real code reviews |
