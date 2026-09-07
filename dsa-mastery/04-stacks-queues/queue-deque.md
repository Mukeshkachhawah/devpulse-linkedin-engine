# Queue & Deque — Core Lesson

> Previous: Stack. Next: Monotonic Stack/Queue. Related: BFS in graphs.

---

## 1. What is it?

A **queue** is **First In, First Out (FIFO)**.  
Enqueue at the **back**, dequeue at the **front**.

A **deque** (double-ended queue) allows insert/delete at **both** ends.

```text
Queue:   front → [A][B][C] ← back
         leave A first (A arrived first)

Deque:   ←→ [A][B][C] ←→
         push/pop front or back
```

---

## 2. Explain like I am 10

Queue = line at an ice-cream shop. First kid in line gets ice cream first. New kids join the back.

Deque = a magical line where sometimes a VIP can join the front, or someone at the back can leave early — both ends are doors.

**Memory picture:** ticket queue vs a two-door tunnel.

---

## 3. Real life story

Printer jobs: first submitted job prints first.

Customer support call queue.

In games/UI: event queues process events in order.

Sliding window maximum uses a deque of useful indices (monotonic deque) — next lesson deep dive.

---

## 4. Why does this exist?

When order of arrival must be respected (fairness), FIFO is the rule.

BFS (breadth-first search) explores neighbors level by level — that **is** a queue.

Deque gives flexibility for problems that need both stack-like and queue-like ends without two structures.

---

## 5. What problem existed before this?

People used circular arrays with `head`/`tail` indices for OS I/O buffers. The ADT “queue” named the contract.

Without circular buffering, naive “pop front of vector” is O(n) — a real performance bug.

---

## 6. What happens without it?

- BFS becomes wrong if you use a stack (that’s DFS)  
- Simulations of lines need awkward index shifting  
- Sliding window maximum falls back to O(nk)  
- Fair scheduling ideas disappear  

---

## 7. How did people invent this?

From operations research and OS scheduling: jobs wait in lines. Circular buffers in hardware.

STL `deque` in C++ is a chunked array allowing O(1) end ops; `queue` is an adapter.

---

## 8. Computer intuition

```text
Ring buffer (circular queue):

size 5, head=3, tail=1 (example)
indices: 0 1 2 3 4
values:  - C - A B
head points to A, tail to next empty after C
```

`std::queue` typically uses `deque` underneath.  
`std::deque` supports `push_front`, `push_back`, `pop_front`, `pop_back` in O(1).

**Never** use `vector` and `erase(begin())` as a queue in hot code — O(n) per pop.

---

## 9. Mathematical intuition

Each element enters and leaves once → O(n) total for n operations if each op is O(1).

BFS complexity O(V+E) relies on each node being enqueued about once.

Amortized analysis for dynamic ring growth similar to vectors.

---

## 10. Step-by-step working

### BFS level order (tree)

1. Queue ← root  
2. While queue not empty:  
   - pop front `u`  
   - process `u`  
   - push children  

### Generate binary numbers 1..n

Enqueue "1"; loop: dequeue s, print, enqueue s+"0", s+"1".

### Sliding window max (preview)

Deque stores indices in decreasing order of values; pop back while smaller; pop front if out of window.

---

## 11. Dry run

Queue ops:

```text
enqueue 10:  [10]
enqueue 20:  [10, 20]
enqueue 30:  [10, 20, 30]
dequeue → 10; queue [20, 30]
dequeue → 20; queue [30]
```

BFS tree:

```text
    1
   / \
  2   3
 / \
4   5

q: 1 → pop 1, push 2,3
q: 2,3 → pop 2, push 4,5
q: 3,4,5 → pop 3
q: 4,5 → ...
order: 1,2,3,4,5
```

---

## 12. Visualization

```text
STACK (LIFO)          QUEUE (FIFO)
  | C | ← top           front A → B → C back
  | B |                 leave A first
  | A |
  pop C first

DEQUE
front ↔ [ A | B | C ] ↔ back
```

Sticky picture: ice-cream line + two-door tunnel.

---

## 13. Complexity

| Structure | push ends | pop ends | random access |
|---|---|---|---|
| queue (deque-backed) | back O(1) | front O(1) | no |
| deque | both O(1) | both O(1) | yes `[i]` O(1) in C++ |
| list as queue | O(1) | O(1) | no |
| vector erase front | O(n) | — | yes |

BFS tree: O(n) time / O(w) queue width space.

---

## 14. Why this complexity?

Deque chunks avoid shifting all elements on front ops. Vector front erase shifts everyone → O(n).

BFS visits each node once; each edge examined once → linear in size.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    if (!root) return ans;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* u = q.front(); q.pop();
            level.push_back(u->val);
            if (u->left) q.push(u->left);
            if (u->right) q.push(u->right);
        }
        ans.push_back(level);
    }
    return ans;
}

// Circular queue (fixed size)
struct MyCircularQueue {
    vector<int> a;
    int head = 0, cnt = 0, cap;
    MyCircularQueue(int k) : a(k), cap(k) {}
    bool enQueue(int val) {
        if (isFull()) return false;
        a[(head + cnt) % cap] = val;
        cnt++;
        return true;
    }
    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        cnt--;
        return true;
    }
    int Front() { return isEmpty() ? -1 : a[head]; }
    int Rear() { return isEmpty() ? -1 : a[(head + cnt - 1) % cap]; }
    bool isEmpty() { return cnt == 0; }
    bool isFull() { return cnt == cap; }
};

// Deque basics
void dequeDemo() {
    deque<int> d;
    d.push_back(1);
    d.push_front(0);
    d.pop_back();
    d.pop_front();
}
```

*(Assume `TreeNode` with `left`/`right`/`val` as usual.)*

---

## 16. STL usage

```cpp
queue<int> q;           // adapter
q.push(1); q.front(); q.back(); q.pop(); // pop void

deque<int> dq;
dq.push_front(1);
dq.push_back(2);
dq[0];                  // random access OK

priority_queue<int> pq; // NOT FIFO — heap (later chapter)
```

**Trap:** `queue::pop()` is void — same as stack.  
**Trap:** `priority_queue` is not a FIFO queue.

---

## 17. Brute Force

Simulate queue with `vector` + erase begin:

```cpp
vector<int> q;
q.push_back(x);
q.erase(q.begin()); // O(n) — brute / wrong for large n
```

Sliding window max brute: for each window, scan k elements → O(nk).

---

## 18. Better

Use `std::queue` / `deque` for O(1) ends. For window max, better than brute is sparse table O(1) query after O(n log n) build — or monotonic deque O(n).

---

## 19. Optimal

BFS with queue: optimal O(n) for trees.  
Circular buffer for fixed capacity: O(1) ops, O(k) space.  
Sliding window max with monotonic deque: O(n) — see next lesson.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Stack and queue are the same — both ends structures."
  ↓
Fails: LIFO vs FIFO change algorithm results (DFS vs BFS)
  ↓
Correct: Choose by order semantics

Wrong: "pop_front on vector is fine."
  ↓
Fails: O(n) shifts; TLE on large simulations
  ↓
Correct: deque/queue/list for front removal

Wrong: "priority_queue is a faster queue."
  ↓
Fails: Different ADT — highest priority first
  ↓
Correct: Use heap chapter tools when priority matters
```

---

## 21. Common mistakes

1. Using stack for BFS  
2. Forgetting `sz = q.size()` snapshot for level loops (size changes as you push)  
3. Infinite BFS if graph nodes re-enqueued without visited  
4. Circular queue modulo bugs  
5. Confusing `front`/`back`  
6. Memory: holding pointers in queue without lifetime clarity  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Implement a queue using two stacks.”  
**Expected:** In-stack and out-stack; amortized O(1); explain pouring only when out empty.

### Amazon
**Ask:** “Design circular queue.”  
**Expected:** Ring buffer, full/empty distinction via size or sentinel; modulo arithmetic.

### Microsoft
**Ask:** “Binary tree level order / zigzag.”  
**Expected:** Queue BFS; zigzag with deque or reverse flag.

### OpenAI
**Ask:** “When is deque the right default container in C++?”  
**Expected:** Need both-end ops; middle insert still costly; vs `vector` for pure append; vs `list` for true splice stability.

**Interview phrase:**

```text
"BFS needs FIFO so earlier nodes expand first — I'll use a queue
and freeze level size before processing children."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Task / job scheduling | Queue |
| Message brokers (idea) | Queue semantics |
| BFS shortest path unweighted | Queue |
| IO buffers | Circular queue |
| Undo + redo | Two stacks; browsers similar |
| Recent history both ends | Deque |

---

## 24. Related concepts + pattern recognition cues

**Related:** stack, monotonic deque, BFS, circular buffer, producer–consumer.

| Cue | Structure |
|---|---|
| Level by level / shortest unweighted | Queue |
| Nesting / nearest previous | Stack |
| Sliding window extrema | Monotonic deque |
| Both ends ops | Deque |
| Max always | Priority queue (heap) |

**Decision snack:**

```text
Fair line / BFS? → queue
Plates / brackets? → stack
Window max/min? → monotonic deque
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Queue = ice-cream line (FIFO)
Deque = two doors
BFS = queue + level size snapshot
Don't erase vector begin as queue
pop() is void — read front first
```

### Checklist

- [ ] Contrast LIFO vs FIFO with one example each  
- [ ] Dry-run BFS on a 5-node tree  
- [ ] Explain circular queue full/empty  
- [ ] Code level-order from memory  
- [ ] Name why vector front-pop is bad  

### Practice roadmap

1. Easy: Implement Queue using Stacks, Number of Recent Calls, Circular Queue  
2. Medium: Level Order, Zigzag Level Order, Rotting Oranges, Open the Lock  
3. Link: Sliding Window Maximum (monotonic deque)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Line vs plates picture |
| 3 | Code level order blind |
| 7 | Two stacks = queue + circular queue |
| 15 | BFS grid problem timed |
| 30 | Teach amortized two-stack queue |
| 90 | Mock: BFS + design queue |

```text
Item: Queue & Deque
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
