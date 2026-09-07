# Stack — Core Lesson

> Previous: Linked Lists. Next: Queue & Deque. Related later: Monotonic Stack, Expressions.

---

## 1. What is it?

A **stack** is a collection with one rule: **Last In, First Out (LIFO)**.

You only add/remove from the **top**.

```text
Push 3:     | 3 |  ← top
Push 1:     | 1 |
            | 3 |
Pop:        | 3 |  (1 leaves first because it arrived last)
```

Core operations: `push`, `pop`, `top`/`peek`, `empty`, sometimes `size`.

---

## 2. Explain like I am 10

A stack of plates.

You put a clean plate on top. You take a plate from the top. You never yank the bottom plate first — the pile falls.

The last plate you set down is the first one you pick up.

**Memory picture:** cafeteria plate stack, or a pile of books.

---

## 3. Real life story

Browser **Back** button: each page you visit is pushed. Back pops to the previous page.

Undo in an editor: each edit pushed; undo pops.

Function calls: when `main` calls `f` calls `g`, `g` finishes first — the call stack is LIFO (you already saw this in recursion foundations).

---

## 4. Why does this exist?

Many problems need “remember the most recent unfinished thing.”

Matching brackets, parsing, DFS path, histogram rectangles, calculating expressions — all need a LIFO memory.

Stack gives a tiny API so you cannot accidentally mess with the middle (discipline = fewer bugs).

---

## 5. What problem existed before this?

People used arrays and managed an index `top` by hand. That works — a stack **is** often an array + index.

The ADT (abstract data type) name “stack” made the rule clear in teaching and APIs so everyone agrees what is allowed.

---

## 6. What happens without it?

- Bracket matching becomes messy counters that fail on nested cases  
- Recursion mental model breaks  
- Undo/back features need ad-hoc lists  
- Interview problems (valid parentheses, daily temperatures style) lack the natural tool  

---

## 7. How did people invent this?

From evaluating arithmetic and from machine call stacks (1950s–60s). Dijkstra and others popularized stack machines for expressions.

Hardware and OS made the call stack concrete: return addresses pushed on call, popped on return.

---

## 8. Computer intuition

Two common implementations:

1. **Dynamic array** (`vector`): push/pop at end — amortized O(1)  
2. **Linked list**: push/pop at head — O(1)

```text
Vector stack (top at back):
[ 10 | 20 | 30 ]  ← back is top

List stack (top at head):
head → 30 → 20 → 10 → ∅
```

Underflow: pop/top on empty → bug. Always check `empty()`.

---

## 9. Mathematical intuition

At any time the stack holds a sequence `s0, s1, ..., sk` where `sk` is top.

Valid stack sequences (input 1..n pushed in order, pop anytime): counted by **Catalan numbers**. Useful trivia for “is this pop order possible?”

Each element is pushed once and popped once → algorithms that process each index once with a stack are often O(n).

---

## 10. Step-by-step working

### Valid parentheses

1. Scan chars left to right  
2. If opening `( [ {` → push  
3. If closing → stack must be non-empty and top must match; else invalid; pop  
4. End: stack must be empty  

### Min stack (get-min in O(1))

Store pairs `(value, min_so_far)` on each push, or dual stacks.

### Next greater (preview)

Walk right-to-left or left-to-right maintaining decreasing/increasing stack of indices — full lesson in monotonic chapter.

---

## 11. Dry run

Valid parentheses: `([]){}`

```text
(  → push (
[  → push ( [
]  → top [ matches ] → pop → (
)  → top ( matches ) → pop → empty
{  → push {
}  → top { matches } → pop → empty
OK
```

Invalid: `([)]`

```text
( [ then ] → matches [ → stack has (
then ) ... wait: after ([)] 
( [ )  → ) does not match [  → FAIL
```

Actually `([)]`:

```text
( push
[ push
) vs top [ → mismatch → invalid
```

---

## 12. Visualization

```text
    CALL STACK           BRACKET STACK

  | g frame |              | [ |
  | f frame |              | ( |
  | main    |              +---+
  +---------+
  LIFO return order
```

**Memory picture sticky:** plates + browser back button.

---

## 13. Complexity

| Op | Time (vector/list) | Notes |
|---|---|---|
| push | Amortized O(1) / O(1) | vector may resize |
| pop | O(1) | |
| top | O(1) | |
| search middle | O(n) | not the point |

Valid parentheses: O(n) time, O(n) space worst case.

---

## 14. Why this complexity?

Each char processed once. Each push/pop O(1). Space bounded by nesting depth (≤ n).

Amortized vector push: occasional resize O(n) but rare; average O(1) per op.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;
            char t = st.top(); st.pop();
            if (c == ')' && t != '(') return false;
            if (c == ']' && t != '[') return false;
            if (c == '}' && t != '{') return false;
        }
    }
    return st.empty();
}

// Min Stack
class MinStack {
    stack<pair<int,int>> st; // {val, min_so_far}
public:
    void push(int val) {
        if (st.empty()) st.push({val, val});
        else st.push({val, min(val, st.top().second)});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};

// Manual vector stack
struct VecStack {
    vector<int> a;
    void push(int x) { a.push_back(x); }
    void pop() { if (!a.empty()) a.pop_back(); }
    int top() { return a.back(); }
    bool empty() { return a.empty(); }
};
```

---

## 16. STL usage

```cpp
#include <stack>
stack<int> st;          // adapter over deque by default
st.push(1);
st.top();
st.pop();               // pop returns void!
st.empty(); st.size();

// Prefer vector as explicit stack in some interviews for clarity:
vector<int> stv;
stv.push_back(x);
stv.pop_back();
stv.back();
```

**Trap:** `stack::pop()` returns `void`. Read `top()` before `pop()`.

`stack` does not offer iterators to middle — intentional.

---

## 17. Brute Force

For “next greater element,” brute is O(n²) nested loops. Stack monotonic reduces to O(n).

For parentheses, a counter works only for one type `()` — fails for multiple types / ordering (`([)]`).

```cpp
// Counter works for pure () nesting balance, NOT for interleaved types
int bal = 0;
for (char c : s) {
    if (c == '(') bal++;
    else if (--bal < 0) return false;
}
return bal == 0;
```

---

## 18. Better

Use an explicit stack of chars/indices. For min queries, store running min (better than scanning whole stack each time → that would be O(n) per getMin).

---

## 19. Optimal

Valid parentheses: O(n)/O(n).  
Min stack: all ops O(1).  
Problems solvable by one pass + stack often O(n) optimal under comparison models for that pattern.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "A counter is enough for all bracket problems."
  ↓
Fails: ([)] is balanced counts but wrong order
  ↓
Correct: Stack remembers the latest unmatched opener

Wrong: "pop() returns the value."
  ↓
Fails: C++ STL pop is void; you drop the value
  ↓
Correct: auto x = st.top(); st.pop();

Wrong: "Stack is always linked list."
  ↓
Fails: Vector-backed stacks are faster in practice
  ↓
Correct: ADT is LIFO; implementation can be array or list
```

---

## 21. Common mistakes

1. Forgetting to check empty before top/pop  
2. Not requiring empty stack at end for parentheses  
3. Using queue by mistake (FIFO)  
4. Storing values when indices are needed (span problems)  
5. Off-by-one in histogram/stack index sentinels  
6. Recursion stack overflow vs explicit stack for DFS  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Valid parentheses — extend to wildcards `*` as ( or ) or empty.”  
**Expected:** Greedy with two stacks or balance ranges; discuss why simple stack morphs.

### Amazon
**Ask:** “Implement stack with getMin in O(1).”  
**Expected:** Pair stack or dual stack; all ops O(1); careful on pop of current min.

### Microsoft
**Ask:** “Decode string `3[a2[c]]`.”  
**Expected:** Stack of counts and strings; nested decode pattern.

### OpenAI
**Ask:** “Stack vs recursion — when prefer explicit stack?”  
**Expected:** Control memory, avoid call-stack limits, iterative DFS, clearer debugging of frames.

**Interview phrase:**

```text
"This is a LIFO problem: the latest unmatched opener
must match the next closer — a stack is the natural structure."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Undo/redo | Stack of commands |
| Browser history | Back stack (+ forward stack)  
| Compilers | Parse stacks, scopes |
| JVM / native runtimes | Call stack |
| DFS path reconstruction | Explicit stack |
| Expression eval | Operand/operator stacks |

---

## 24. Related concepts + pattern recognition cues

**Related:** queue (FIFO), deque, monotonic stack, recursion, DFS, expression parsing.

| Cue | Use stack? |
|---|---|
| Nesting / matching | Yes |
| Undo / nearest previous | Yes |
| “Next greater to the right” | Monotonic stack |
| Level order BFS | Queue, not stack |
| Fair scheduling | Queue |

**Decision snack:**

```text
Last unfinished first? → stack
First arrived first? → queue
Both ends? → deque
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Plates = LIFO
Push / pop / top only
Brackets need stack not just counters
STL pop is void — top then pop
Call stack is the same idea
```

### Checklist

- [ ] Draw push/pop on 3 elements  
- [ ] Dry-run `([)]` vs `{[]}`  
- [ ] Code valid parentheses blind  
- [ ] Explain min stack  
- [ ] Name 3 real systems using stacks  

### Practice roadmap

1. Easy: Valid Parentheses, Min Stack, Implement Stack using Queues  
2. Medium: Decode String, Asteroid Collision, Simplify Path, Daily Temperatures (mono)  
3. Harder: Largest Rectangle in Histogram (mono), Basic Calculator  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Plate picture + parentheses dry-run |
| 3 | Code isValid + MinStack blind |
| 7 | Decode string or simplify path |
| 15 | Timed Medium stack problem |
| 30 | Teach LIFO vs FIFO out loud |
| 90 | Mock: parentheses + calculator-ish |

```text
Item: Stack
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
