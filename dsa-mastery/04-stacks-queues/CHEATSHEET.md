# Stacks & Queues — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Order semantics?
  ├─ LIFO / nesting / undo           → stack
  ├─ FIFO / BFS / fair line          → queue
  └─ Both ends / window mono         → deque

"Next greater/smaller / warmer"      → monotonic stack (indices)
"Max/min in sliding window"          → monotonic deque
Expression tokens postfix            → RPN stack
Infix + precedence                   → op/value stacks (calc)
```

---

## Templates (C++)

### Valid parentheses

```cpp
stack<char> st;
// push openers; on close, check match; return st.empty()
```

### BFS level snapshot

```cpp
queue<Node*> q; q.push(root);
while (!q.empty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        auto* u = q.front(); q.pop();
        // push children
    }
}
```

### Next greater right

```cpp
stack<int> st; // indices, decreasing values
vector<int> ans(n, -1);
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) {
        ans[st.top()] = a[i]; st.pop();
    }
    st.push(i);
}
```

### Window max

```cpp
deque<int> dq;
for (int i = 0; i < n; i++) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) out.push_back(a[dq.front()]);
}
```

### RPN

```cpp
// push numbers; on op: b=pop, a=pop, push a op b
```

### Min stack

```cpp
stack<pair<int,int>> st; // val, min_so_far
```

---

## Complexity

| Pattern | Time | Space |
|---|---|---|
| Parentheses / RPN / Calc | O(n) | O(n) |
| NGE / Daily temps | O(n) | O(n) |
| Window max mono | O(n) | O(k) |
| Histogram rect | O(n) | O(n) |

---

## Interview Lines

```text
"LIFO → stack; FIFO → queue."
"Mono stack: each index push/pop once ⇒ O(n)."
"Store indices for distance and window expiry."
"pop() is void — read top/front first."
```

---

## Trap List

```text
[ ] Bracket counter alone for mixed types
[ ] BFS without visited (graphs)
[ ] Level for without sz snapshot
[ ] Mono < vs <=
[ ] Circular NGE 2n + push only i<n
[ ] Histogram sentinel / width i-left-1
[ ] RPN pop order b then a
```

---

## Company Cue Map

| Flavor | Likely |
|---|---|
| Google | Calculator / histogram intuition |
| Amazon | Temperatures, circular queue, RPN |
| Microsoft | Level order, NGE, zigzag |
| OpenAI | ADT trade-offs; heap vs mono deque |

---

## Spaced Repetition Hook

Days **1 / 3 / 7 / 15 / 30 / 90** — lesson §25 + `../00-SPACED-REPETITION.md`.
