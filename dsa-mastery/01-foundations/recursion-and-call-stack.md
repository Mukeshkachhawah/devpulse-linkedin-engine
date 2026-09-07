# Recursion and the Call Stack

**Module:** 01-foundations  
**Level target:** L4  
**Prerequisite:** functions in C++, Big-O basics  
**Memory picture:** A stack of plates — each function call puts a plate on top; when a call finishes, that plate comes off.

---

## 1. What is it?

**Recursion** means a function solves a problem by calling **itself** on a **smaller** piece of the same problem, until it hits a **base case** that needs no further call.

The **call stack** is the computer’s pile of “who called whom.” Each active function call owns a **stack frame**: its parameters, local variables, and return address.

New words:

- **Base case** — the tiny input you answer directly (stop rule).
- **Recursive case** — the step that calls the same function with a smaller input.
- **Stack frame** — one plate of data for one active call.
- **Call stack** — ordered pile of frames (last in, first out).
- **Stack overflow** — too many frames; the pile exceeds the allowed height.

---

## 2. Explain like I am 10

You want to know how many books are in a tall stack.

You cannot see the whole stack at once. So you say:

1. If there are **no books**, answer is 0. (base case)
2. Otherwise: answer is **1 +** (how many books are in the stack **without the top book**).

You keep asking the same question about a shorter stack until you hit empty.

That is recursion: same question, smaller thing, clear stop.

---

## 3. Real life story

You are finding a file in nested folders.

```text
Folder A
  Folder B
    Folder C
      file.txt
```

You open A, then B, then C. When you find the file, you close C, then B, then A — reverse order.

That “open nested, close reverse” feeling is exactly the call stack. Recursion is a natural way to write “process this folder, and for each subfolder, do the same.”

Companies use this for trees (org charts, file systems, HTML DOM), divide-and-conquer algorithms, and backtracking search.

---

## 4. Why does this exist?

Some problems are **self-similar**:

- a tree is a root plus smaller trees
- a list is a head plus a smaller list
- “all paths” = choose one step, then recurse on the rest

Recursion matches the shape of the data. The code can stay short and clear. The call stack remembers where you were without you managing a manual pile (though sometimes an explicit stack is clearer or safer).

---

## 5. What problem existed before this?

Before recursion was common in languages, people wrote everything with loops and manual stacks. That works, but for deeply nested structure the code becomes hard to read: you simulate “going deeper” yourself.

People needed a way to say: “the definition of the solution looks like the definition of the data.” Recursion is that bridge.

---

## 6. What happens without it?

Without recursion (or without understanding the stack):

1. Tree/graph problems feel impossible or become messy nested loops.
2. You write recursive code with **no base case** and crash (infinite recursion / stack overflow).
3. You misunderstand space cost: “I used no array, so O(1) space” — false if depth is `n`.
4. You cannot convert recursion ↔ iteration when an interviewer asks.

```text
Missing base case
      ↓
function calls itself forever
      ↓
call stack grows without bound
      ↓
stack overflow / crash
```

---

## 7. How did people invent this?

Mathematics used **recursive definitions** long before computers (factorial, Fibonacci, induction). Programming languages added recursive functions and a runtime call stack to make those definitions executable. Interview culture kept recursion because trees, backtracking, and divide-and-conquer appear constantly at top companies.

Classic teaching examples that shaped practice:

- factorial / Fibonacci (simple, but Fibonacci naive is slow)
- binary tree traversals
- merge sort / quick sort structure
- DFS on graphs
- backtracking (permutations, subsets, N-Queens)

---

## 8. Computer intuition

When you call a function, the machine:

1. Pushes a new frame (parameters + locals)
2. Runs the function body
3. If it calls another function (including itself), push again
4. When a function returns, pop its frame and continue the caller

```text
MEMORY PICTURE — call stack growing then shrinking

Call factorial(3)

| fact(3) n=3 |  ← top (running)
---------------
(then calls fact(2))

| fact(2) n=2 |
| fact(3) n=3 |
---------------

| fact(1) n=1 |
| fact(2) n=2 |
| fact(3) n=3 |
---------------

| fact(0)     |  base returns 1
| fact(1) ... |
...

returns bubble back:
fact(0)=1
fact(1)=1*1=1
fact(2)=2*1=2
fact(3)=3*2=6
```

Each unfinished call waits for the smaller call’s answer.

---

## 9. Mathematical intuition

Recursion is closely tied to **mathematical induction**:

1. Prove/solve the base case.
2. Assume smaller sizes work.
3. Build the answer for size `n` from smaller answers.

**Recurrence relations** describe time:

Example — naive Fibonacci:

```text
T(n) = T(n-1) + T(n-2) + O(1)
T(0), T(1) = O(1)
```

This grows like Θ(φⁿ) — exponential. Same recursive *idea* can become O(n) with memoization or O(n) / O(1) with iteration.

**Space:** recursion depth `d` usually costs O(d) stack space (unless the language optimizes tail calls — **C++ does not guarantee** tail-call elimination).

---

## 10. Step-by-step working

**Pattern for every recursive function:**

1. Define the function’s meaning in one sentence (“returns sum of 1..n”).
2. Write the **base case** first.
3. Write the **recursive case** that makes progress toward the base (smaller `n`, shorter string, next index).
4. Combine the recursive result with local work.
5. Mentally check: does every path hit a base case? Is there infinite looping on the same input?

**Example: sum of array**

Meaning: `sum(a, i)` = sum of elements from index `i` to end.

- Base: if `i == n`, return 0
- Recurse: return `a[i] + sum(a, i+1)`

---

## 11. Dry run

`sum` on `[5, 2, 9]`, index form:

```text
sum(0) = 5 + sum(1)
sum(1) = 2 + sum(2)
sum(2) = 9 + sum(3)
sum(3) = 0          ← base

Then unwind:
sum(2) = 9 + 0 = 9
sum(1) = 2 + 9 = 11
sum(0) = 5 + 11 = 16
```

**Binary search recursive dry run** on sorted `[1, 3, 4, 7, 9]`, target `7`:

```text
lo=0, hi=4, mid=2, a[2]=4 < 7 → search right
lo=3, hi=4, mid=3, a[3]=7 == 7 → found
```

Stack depth here is O(log n) because the range halves.

---

## 12. Visualization

```text
RECURSION TREE — naive fib(5)

                    fib(5)
                   /      \
               fib(4)    fib(3)
              /    \      /   \
          fib(3) fib(2) fib(2) fib(1)
          /  \    / \    / \
       fib(2) fib(1) ...  ...
        ...

Many repeated nodes → wasted work → exponential time
```

```text
BASE CASE vs RECURSIVE CASE flowchart

        [ start f(n) ]
              |
        n is base?
         /        \
       yes         no
        |           |
     return      make smaller
     answer      call f(smaller)
                    |
               combine + return
```

```text
STACK OVERFLOW picture

Allowed stack height
|--------------------|  ← limit
| frame |
| frame |
| frame |
| ....  |  ← too many recursive calls without return
| frame |
CRASH
```

---

## 13. Complexity

| Algorithm shape | Time | Extra space (stack) |
|---|---|---|
| Linear recursion `f(n)→f(n-1)` with O(1) work | O(n) | O(n) |
| Halving recursion (binary search) | O(log n) | O(log n) recursive / O(1) iterative |
| Two calls on n-1, n-2 (naive fib) | exponential | O(n) depth |
| Tree DFS, n nodes | O(n) | O(h) height |
| Subsets recursion (take/skip) | O(2ⁿ) work | O(n) depth |

Always report **stack space**. Interviews listen for that.

---

## 14. Why this complexity?

- One call that shrinks `n` by 1, O(1) work outside: about `n` calls → O(n) time and O(n) depth.
- Each call halves `n`: about `log n` calls.
- Each call spawns two expensive subcalls on nearly same size: explosion (Fibonacci tree).
- Backtracking that explores all subsets: `2ⁿ` leaves roughly.

Memoization changes time by **not recomputing** the same state; space grows with the number of stored states.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// Linear recursion: O(n) time, O(n) stack
long long fact(int n) {
    if (n < 0) throw runtime_error("negative");
    if (n == 0 || n == 1) return 1; // base
    return n * fact(n - 1);         // recursive case
}

// Sum from index i — clear progress toward base
int sumFrom(const vector<int>& a, int i) {
    if (i == (int)a.size()) return 0;
    return a[i] + sumFrom(a, i + 1);
}

// Binary search — O(log n) time/stack
int binSearch(const vector<int>& a, int lo, int hi, int target) {
    if (lo > hi) return -1; // base: empty range
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) return binSearch(a, mid + 1, hi, target);
    return binSearch(a, lo, mid - 1, target);
}

// Naive Fibonacci — correct but slow (demo only)
long long fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}

// Better Fibonacci with memoization
long long fibMemo(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Iterative Fibonacci — often "optimal" for this problem
long long fibIter(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    cout << fact(5) << "\n"; // 120
    vector<int> a = {5, 2, 9};
    cout << sumFrom(a, 0) << "\n"; // 16
    vector<int> s = {1, 3, 4, 7, 9};
    cout << binSearch(s, 0, (int)s.size() - 1, 7) << "\n"; // 3

    vector<long long> memo(40, -1);
    cout << fibMemo(10, memo) << "\n"; // 55
    cout << fibIter(10) << "\n";
}
```

---

## 16. STL usage

Recursion itself is language-level, but STL partners appear often:

| Tool | Role with recursion |
|---|---|
| `vector` as memo table | top-down DP |
| `unordered_map` memo | sparse states |
| `stack` / `vector` as explicit stack | convert recursion → iteration |
| `priority_queue` | not recursion, but another “structure matches algorithm” idea |

Converting DFS recursion to iterative DFS:

```cpp
void dfsIter(int start, const vector<vector<int>>& g, vector<int>& vis) {
    stack<int> st;
    st.push(start);
    while (!st.empty()) {
        int u = st.top();
        st.pop();
        if (vis[u]) continue;
        vis[u] = 1;
        for (int v : g[u]) {
            if (!vis[v]) st.push(v);
        }
    }
}
```

You manually own the stack that recursion would have used.

---

## 17. Brute Force

Naive recursion that re-explores the same states (naive Fibonacci, naive grid paths without memo) is the brute form: correct structure, terrible repeated work.

Also brute: recurse on all subsets / all permutations when constraints are tiny.

---

## 18. Better

Add **memoization** (top-down DP): store answer for each state.

Or prune the search early in backtracking.

Or shorten depth: prefer index parameters over copying arrays each call.

```cpp
// Bad space habit: pass huge copied vectors by value every call
// Better: pass const reference + index range
```

---

## 19. Optimal

Depends on the problem:

| Problem | Often optimal shape |
|---|---|
| Fibonacci value | iterative O(n) time, O(1) space (or closed form carefully) |
| Tree traversal | recursion O(n)/O(h) or iterative stack |
| Binary search | iterative O(1) space often preferred in interviews |
| Grid unique paths | DP table bottom-up |

“Optimal recursion” means: correct base cases, no wasted recomputation, and stack depth acceptable for constraints (sometimes recursion depth `n = 1e5` **will crash** — then iterate).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Recursion is magic; the computer just knows."
  Why it fails: you cannot debug or count complexity.
  Correct: each call = one stack frame; draw the stack.

Wrong: "No base case needed if n gets smaller."
  Why it fails: floating mistakes / off-by-one never hit stop; stack overflow.
  Correct: write base case first; prove progress.

Wrong: "Recursive solution uses O(1) space if I did not allocate an array."
  Why it fails: stack frames are memory.
  Correct: space includes O(depth).

Wrong: "Fibonacci recursion is fine because the code is short."
  Why it fails: exponential time for moderate n.
  Correct: memoize or iterate; short ≠ fast.

Wrong: "Tail recursion always saves space in C++."
  Why it fails: not guaranteed in C++.
  Correct: do not rely on TCO in interviews with C++.
```

---

## 21. Common mistakes

1. Missing or wrong base case.
2. Not making the input smaller (infinite recursion).
3. Returning nothing / forgetting to return the recursive call’s result.
4. Modifying shared structures and forgetting to undo (backtracking bugs).
5. Deep recursion on `n = 1e5` → stack overflow in C++.
6. Passing huge objects by value.
7. Confusing multiple parameters in the recursive meaning (“what does f(i,j) mean?” unclear).

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “What is the space complexity of your recursive DFS on a linked list of length n?”  
**Expected answer:**  
“Each call waits on the next node, so depth is n. Extra space is O(n) on the call stack, even with no auxiliary array. I can also write an iterative loop with O(1) extra space if we only need traversal.”

### Amazon-style

**Interviewer:** “Production traffic can create a tree of height 50,000. Is recursion OK?”  
**Expected answer:**  
“Default thread stacks may overflow. I would prefer an explicit stack DFS/BFS, or ensure balanced depth, or increase stack only with clear ops approval. I treat deep recursion as a reliability risk.”

### Microsoft-style

**Interviewer:** “Convert this recursive binary search to iterative.”  
**Expected answer:**  
“Keep `lo` and `hi` in a loop. While `lo <= hi`, compute `mid`, move `lo` or `hi`. Same O(log n) time, O(1) extra space. Base failure is the loop ending.”

### OpenAI-style

**Interviewer:** “When is recursion the right tool versus DP iteration?”  
**Expected answer:**  
“If the problem’s natural structure is a tree or a search with branching decisions, recursion (often with memo) matches thinking. If states form a simple sequence/table and depth would be large, bottom-up iteration is usually safer and clearer for performance.”

**Speaking tip:** Before coding, say: “Base case is … Recursive case shrinks … Depth is …”

---

## 23. Company use cases

| Setting | Recursion / stack idea |
|---|---|
| Google file systems / indexing trees | recursive directory & tree walks (or explicit stacks) |
| Amazon warehouse hierarchies | org/location trees; DFS-style aggregation |
| Microsoft compilers / IDEs | AST walks are recursive by nature |
| OpenAI / LLM tooling | recursive descent parsing; tree-of-thought style search (conceptually) |
| Browsers | DOM tree traversal |

---

## 24. Related concepts + pattern recognition cues

**Related:** divide and conquer, DFS, backtracking, top-down DP, induction, explicit stacks, tree height vs size.

**Cues to use recursion:**

```text
IF data is a tree / nested structure
→ recursion or explicit stack

IF "all ways / all paths / choose or skip"
→ backtracking recursion

IF subproblem overlaps
→ recursion + memo (DP)

IF depth can be huge (1e5)
→ prefer iteration
```

**Cues you are in trouble:**

```text
No clear base case
No clear "smaller input"
Recomputing same state many times without memo
```

Connects to: trees, graphs DFS, merge sort, backtracking, DP.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Recursion = base case + smaller same problem
Call stack = plates of unfinished work
Count STACK in space complexity
Short recursive code can still be exponential
Deep n → consider iterative stack
```

### Checklist

- [ ] Draw stack for `fact(4)`
- [ ] Write base + recursive case for array sum
- [ ] Explain why naive fib is exponential
- [ ] Code memo fib and iterative fib in C++
- [ ] Convert recursive binary search to a loop

### Practice plan

1. Implement: factorial, array sum, reverse string recursively.
2. Implement: recursive + iterative binary search.
3. Draw recursion tree for fib(6) once — feel the duplicates.
4. Solve beginner tree problems only after you can draw stacks.
5. One day: rewrite a recursive DFS as `stack<int>`.

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Explain plates metaphor + define base/recursive case |
| 3 | Dry-run sum and fibNaive unwind on paper |
| 7 | Code fact, sumFrom, binSearch, fibMemo from memory |
| 15 | Teach recursion vs iteration for 5 minutes |
| 30 | Convert one recursive solution in your tracker to iterative |
| 90 | Mock interviews using the four company prompts above |

```text
Item: Recursion & Call Stack
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90 days
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Explain with books/plates |
| L2 | Dry-run stack frames on paper |
| L3 | Code recursion + memo + iterative forms |
| L4 | Discuss overflow risk and space in interviews |
| L5 | Freely convert recursion ↔ stack and spot exponential trees |
