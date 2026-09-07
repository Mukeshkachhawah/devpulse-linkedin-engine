# Monotonic Stack & Monotonic Queue — Core Lesson

> Previous: Stack, Queue & Deque. Next: Expression & Next Greater (focused drills). Sibling pattern for windows.

---

## 1. What is it?

A **monotonic stack** keeps elements (often **indices**) in sorted order by value — either **increasing** or **decreasing** along the stack.

A **monotonic queue/deque** does the same with front/back removals so the front is always the **max** or **min** of the current window.

```text
Decreasing stack (top is smaller):  [9, 7, 3]  for next greater
Increasing stack (top is larger):   [1, 4, 6]  for next smaller

Monotonic deque for window max:
values in deque order decreasing: front = current max
```

---

## 2. Explain like I am 10

You stand in a line of kids by height. You want, for each kid, the first taller kid to their right.

You keep a line of kids who are still “waiting for someone taller.” The line of waiters is always getting shorter as you go (heights decrease). When a tall kid arrives, they answer many short waiters at once.

For window max: you keep only kids who could still be the tallest in the current classroom window — kick out anyone shorter behind them; kick out anyone who left the window.

**Memory picture:** waiting line of shorter people waiting for the next taller hero.

---

## 3. Real life story

Daily temperatures: for each day, how many days until a warmer day? Monotonic decreasing stack of indices.

Stock span: how many consecutive previous days had price ≤ today? Monotonic stack.

Sliding window maximum on a stock ticker: monotonic deque.

---

## 4. Why does this exist?

Brute force looks right for each i: O(n²).  

Monotonic structures answer “next greater / window extrema” in **O(n)** because each index is pushed and popped **at most once**.

---

## 5. What problem existed before this?

Nested loops. Or segment trees / sparse tables for range max — powerful but heavy for interviews when a deque suffices.

Monotonic stack became a standard contest/interview pattern for “nearest greater/smaller.”

---

## 6. What happens without it?

- O(n²) TLE on n = 1e5  
- Histogram largest rectangle becomes painful  
- Window max uses heap O(n log n) with lazy deletes — harder to code cleanly  
- You miss a huge cluster of Medium/Hard problems  

---

## 7. How did people invent this?

From stack-based algorithms for histograms and from competitive programming crystallization of “maintain candidates.” Same family as Cartesian trees (tree built via monotonic stack).

---

## 8. Computer intuition

Store **indices**, not only values — you need distance and window bounds.

```text
// Next Greater Element to the right (NGE)
stack empty, decreasing by a[idx]
for i in 0..n-1:
  while stack not empty and a[stack.top] < a[i]:
    ans[stack.top] = a[i]
    stack.pop()
  stack.push(i)
// leftovers: ans = -1
```

Invariant: values at indices in stack are in decreasing order (for NGE).

Monotonic deque window max:

```text
for i in 0..n-1:
  while dq not empty and dq.front <= i-k: dq.pop_front()
  while dq not empty and a[dq.back] <= a[i]: dq.pop_back()
  dq.push_back(i)
  if i >= k-1: out.push(a[dq.front])
```

---

## 9. Mathematical intuition

**Amortized O(1) per index:** each index enters stack/deque once and leaves once → total O(n) pops across the whole run.

Correctness: when you pop j because a[i] is greater, every k between j and i was already processed; i is the first greater to the right of j.

For window max: any index with smaller value than a newcomer, and older, can never be max while the newcomer remains in the window.

---

## 10. Step-by-step working

### Next Greater to the right

1. Stack holds indices with decreasing values  
2. For each new i, pop while `a[top] < a[i]` — assign answer  
3. Push i  
4. Unanswered → -1  

### Next Greater to the left

Scan right-to-left, or mirror comparisons.

### Largest rectangle in histogram

For each bar i, find left/right first **strictly smaller** bars → width = right - left - 1; area = height[i]*width. Use monotonic increasing stack.

### Sliding window maximum

Monotonic decreasing deque of indices; front is max.

---

## 11. Dry run

Array `a = [2, 1, 2, 4, 3]`, next greater right:

```text
i=0, 2  stack:[0]
i=1, 1  1<2 keep; stack:[0,1]
i=2, 2  pop 1 → ans[1]=2;  a[0]=2 not <2; stack:[0,2]
i=3, 4  pop 2 → ans[2]=4; pop 0 → ans[0]=4; stack:[3]
i=4, 3  3<4; stack:[3,4]
end: ans[3]=ans[4]=-1

ans = [4, 2, 4, -1, -1]
```

Window max, k=3, `a=[1,3,-1,-3,5,3,6,7]`:

```text
i=0: dq[0] 
i=1: pop 0 (1<3); dq[1]
i=2: dq[1,2]  window max a[1]=3
i=3: dq[1,2,3] max 3
i=4: pop smaller backs; pop out-of-window; dq[4] max 5
...
```

---

## 12. Visualization

```text
MONOTONIC DECREASING STACK (waiting for greater)

indices →   0  1  2  3  4
values  →   2  1  2  4  3

When 4 arrives, it "shoots lasers left"
answering who waited: positions 2 and 0 get 4

    4
   /
  2   2
 /   /
2   1     3
```

```text
WINDOW DEQUE (max)

window: [ -1, -3, 5 ]
deque values decreasing: 5   ( -1,-3 dropped as useless)
front = 5 = max
```

---

## 13. Complexity

| Problem | Time | Space |
|---|---|---|
| Next greater | O(n) | O(n) |
| Window max | O(n) | O(k) |
| Histogram rectangle | O(n) | O(n) |
| Brute each next greater | O(n²) | O(1) |

---

## 14. Why this complexity?

Amortized analysis: ≤ n pushes, ≤ n pops. Window deque also pops front when index leaves — each index once.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> nextGreaterElements(vector<int>& a) {
    int n = a.size();
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] < a[i]) {
            ans[st.top()] = a[i];
            st.pop();
        }
        st.push(i);
    }
    return ans;
}

// Circular next greater (scan 2n)
vector<int> nextGreaterElementsCircular(vector<int>& a) {
    int n = a.size();
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = 0; i < 2 * n; i++) {
        int val = a[i % n];
        while (!st.empty() && a[st.top()] < val) {
            ans[st.top()] = val;
            st.pop();
        }
        if (i < n) st.push(i);
    }
    return ans;
}

vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> dq;
    vector<int> out;
    for (int i = 0; i < (int)a.size(); i++) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) out.push_back(a[dq.front()]);
    }
    return out;
}

int largestRectangleArea(vector<int>& h) {
    h.push_back(0); // sentinel
    stack<int> st;
    int best = 0;
    for (int i = 0; i < (int)h.size(); i++) {
        while (!st.empty() && h[st.top()] > h[i]) {
            int height = h[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();
            best = max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    h.pop_back();
    return best;
}
```

---

## 16. STL usage

```cpp
stack<int> st;
deque<int> dq;   // for monotonic queue — need both ends

// heap alternative for window max:
priority_queue<pair<int,int>> pq; // value, index — lazy expire
```

Prefer `deque` for monotonic queue. Prefer `stack` or `vector` for monotonic stack.

---

## 17. Brute Force

```cpp
vector<int> ngeBrute(vector<int>& a) {
    int n = a.size();
    vector<int> ans(n, -1);
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[j] > a[i]) { ans[i] = a[j]; break; }
    return ans;
}
```

Window max brute: O(nk).

---

## 18. Better

Sparse table / segment tree for range max: O(1) or O(log n) query after preprocess — good for offline range queries, heavier than deque for pure sliding window.

Heap + lazy delete: O(n log n).

---

## 19. Optimal

Monotonic stack/deque: O(n) time, O(n) space — optimal for these online nearest-greater / sliding extrema patterns in the comparison model for one pass.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Store values only in the stack."
  ↓
Fails: Need index for distance / window expiry
  ↓
Correct: Store indices; read values via a[idx]

Wrong: "Use < or <= casually."
  ↓
Fails: Strict vs non-strict changes equal-element answers
  ↓
Correct: Match problem: next greater vs next greater-or-equal

Wrong: "Forget to remove front outside window."
  ↓
Fails: Wrong max from old index
  ↓
Correct: Expire dq.front() when <= i-k

Wrong: "Each pop is expensive so total is O(n²)."
  ↓
Fails: Analysis counts total pops across all i
  ↓
Correct: Amortized O(n)
```

---

## 21. Common mistakes

1. Wrong comparison strictness  
2. Circular NGE forgetting 2n loop / only push i < n  
3. Histogram missing sentinel 0 at end  
4. Using queue instead of deque (need back pops)  
5. Answering with index instead of value or vice versa  
6. Off-by-one width in histogram `i - left - 1`  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Largest rectangle in histogram — derive left/right smaller.”  
**Expected:** Monotonic increasing stack; width formula; O(n); corner empty stack → left = -1.

### Amazon
**Ask:** “Daily Temperatures.”  
**Expected:** Monotonic decreasing stack of indices; ans[i] = days wait; clear dry-run.

### Microsoft
**Ask:** “Sliding Window Maximum.”  
**Expected:** Monotonic deque; explain why pop back; complexity O(n).

### OpenAI
**Ask:** “Heap vs monotonic deque for window max?”  
**Expected:** Deque O(n) and exact window; heap O(n log n) simpler conceptually; lazy expiry pitfalls.

**Interview phrase:**

```text
"I'll maintain a monotonic stack of indices so each element
is pushed and popped once — total O(n) for next greater."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Sensor streams window max | Monotonic deque |
| UI layout histogram packing | Rectangle stack |
| Market tick next surge | NGE |
| Compilers / Cartesian tree | Mono stack build |
| Game fog-of-war nearest taller wall | NGE geometry |

---

## 24. Related concepts + pattern recognition cues

**Related:** next greater lesson, sliding window, sparse table, Cartesian tree, DFS + stack.

| Cue | Tool |
|---|---|
| Next greater/smaller left/right | Monotonic stack |
| Window max/min | Monotonic deque |
| Largest rectangle / maximal square variants | Mono stack |
| Subarray min sums contribution | Mono stack + counts |
| Only need global max | Simple variable |

**Decision snack:**

```text
Nearest different height? → mono stack
Extremum in moving window? → mono deque
Nested match only? → plain stack
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Indices in the stack, not just values
Each index push/pop ≤ once → O(n)
Decreasing stack → next greater
Increasing stack → next smaller / histogram
Deque front = window max (decreasing)
```

### Checklist

- [ ] Dry-run NGE on 5 elements  
- [ ] Code window max  
- [ ] Explain `<` vs `<=`  
- [ ] Histogram width formula  
- [ ] Circular NGE trick (2n)  

### Practice roadmap

1. Easy/Med: Next Greater Element I/II, Daily Temperatures, Online Stock Span  
2. Medium: Sliding Window Maximum, Remove K Digits, Asteroid Collision  
3. Hard: Largest Rectangle in Histogram, Maximal Rectangle, Sum of Subarray Minimums  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Waiting-line picture + NGE dry-run |
| 3 | Code NGE + window max blind |
| 7 | Histogram rectangle |
| 15 | Timed Hard mono-stack |
| 30 | Teach amortized O(n) out loud |
| 90 | Mock: temperatures + window max + histogram |

```text
Item: Monotonic Stack & Queue
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
