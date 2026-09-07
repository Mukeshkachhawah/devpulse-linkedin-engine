# Heap and Priority Queue — Core Lesson

**Module:** 06-trees  
**Level target:** L4  
**Prerequisite:** arrays, binary trees shape idea, sorting basics  
**Memory picture:** A pyramid of scores — the biggest (or smallest) score always sits at the tip; swapping restores the pyramid rule.

> Previous: BST. Next: Trie.

---

## 1. What is it?

A **binary heap** is a **complete binary tree** stored in an array that obeys the **heap property**:

- **Max-heap:** every parent ≥ its children (root = maximum)
- **Min-heap:** every parent ≤ its children (root = minimum)

A **priority queue** is the ADT: “insert with priority” + “remove best priority.” A binary heap is the usual implementation.

New words:

- **Complete tree** — filled level by level, left to right (no holes on the left).
- **Heapify / sift** — bubble a value up or down to restore the property.
- **Top / peek** — look at best element without removing.

Heaps are **not** BSTs. Inorder of a heap is not sorted.

---

## 2. Explain like I am 10

Kids line up for a ride. The rule: the tallest kid always stands at the front of a special triangle line. When a new kid comes, they stand at the end, then keep swapping with parents until the triangle rule is true again. When the tallest leaves, the last kid jumps to the front and sinks down to the right place.

**Memory picture:**

```text
Max-heap pyramid

        90
      /    \
    70      80
   / \     /
 40  50  60

Array: [90, 70, 80, 40, 50, 60]
Index:  0   1   2   3   4   5
```

---

## 3. Real life story

Hospital ER: patients have urgency scores. Doctors always treat the highest urgency next — not FIFO. That is a priority queue. Same idea: OS process schedulers, Dijkstra’s “next closest node,” Huffman coding, and “top-K trending posts.”

---

## 4. Why does this exist?

You often need repeated “get min/max” while inserting. Sorting the whole array each time is O(n log n) per wave. Keeping a full sorted list makes each insert O(n). A heap gives:

- insert O(log n)
- get-min or get-max O(1)
- extract-min/max O(log n)

You do **not** get fast arbitrary search or sorted full traversal for free.

---

## 5. What problem existed before this?

People rescanned the array for the minimum every time → O(n) per extract → O(n²) for n extracts. Or kept a sorted array → inserts expensive. Heaps (Williams, 1964) and heapsort fixed the “always need the extreme” pattern.

---

## 6. What happens without it?

1. Dijkstra / Prim become sluggish or incorrectly coded with linear scans.
2. Top-K problems become full sorts every update.
3. You misuse BST when you only needed min/max.
4. You confuse “heap” with “memory heap” (free store) — different meaning!

```text
Need next minimum 10^5 times
scan array each time → ~10^10 ops → TLE
```

---

## 7. How did people invent this?

The array representation of a complete tree makes parent/child index math O(1) without pointers. Heapsort and priority queues made heaps a standard library primitive. C++ `priority_queue` is a max-heap by default over a `vector`.

---

## 8. Computer intuition

Index math (0-based):

```text
parent(i) = (i - 1) / 2
left(i)   = 2*i + 1
right(i)  = 2*i + 2
```

**Push (max-heap):** append, sift up while parent &lt; me.

**Pop:** swap root with last, remove last, sift down root choosing larger child.

```text
PUSH 85 into max-heap [90,70,80,40,50,60]

append → [90,70,80,40,50,60,85]
85 at i=6, parent i=2 val 80 → swap
[90,70,85,40,50,60,80]
parent of 85 is 90 ≥ 85 → stop
```

---

## 9. Mathematical intuition

Height of a complete binary tree with n nodes is ⌊log₂ n⌋. Sift up/down moves at most O(height) = O(log n) levels.

Building a heap from n items bottom-up is **O(n)**, not O(n log n) — sum of heights argument. Heapsort: build O(n) + n extracts → O(n log n).

For top-K in a stream: maintain a **min-heap of size K** for K largest — each insert O(log K), total O(n log K).

---

## 10. Step-by-step working

**Top K largest:**

1. Push first K elements into a min-heap.
2. For each next value `x`: if `x` &gt; heap.top(), pop then push `x`.
3. Heap holds K largest; top is the Kth largest.

**Merge K sorted lists:**

1. Min-heap of current heads (value, list id, index).
2. Pop smallest, push next from that list.
3. Repeat → O(N log K).

**Median of stream (classic):**

1. Max-heap for lower half, min-heap for upper half.
2. Rebalance sizes so they differ by at most 1.
3. Median from tops.

---

## 11. Dry run

Top 3 largest of `[3,1,5,12,2,11]`:

```text
K=3 min-heap after first 3: [1,3,5]  (min-heap top=1)
12 > 1 → pop 1, push 12 → [3,5,12]
2  ≤ 3 → skip
11 > 3 → pop 3, push 11 → [5,11,12]
Answer set: 5,11,12
```

---

## 12. Visualization

```text
ARRAY AS TREE

index: 0  1  2  3  4  5
val:  90 70 80 40 50 60

         0
       /   \
      1     2
     / \   /
    3  4  5
```

```text
POP max

         90                 60                 80
       /    \             /    \             /    \
     70      80   →     70      80   →     70      60
    / \     /          / \               / \
  40  50  60         40  50            40  50

swap root↔last, delete last, sift down
```

---

## 13. Complexity

| Operation | Time |
|---|---|
| peek top | O(1) |
| push / pop | O(log n) |
| build heap | O(n) |
| heapsort | O(n log n) |
| top-K with size-K heap | O(n log K) |

Extra space: O(n) for the array, or O(K) for top-K.

---

## 14. Why this complexity?

Each sift climbs or falls at most the height. Build-heap is clever: most nodes are near the bottom and sift little — amortized O(n). You cannot do better than Ω(n log n) comparison sorting in general; heap is in that class.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// Manual min-heapify down
void siftDown(vector<int>& a, int i, int n) {
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, best = i;
        if (l < n && a[l] < a[best]) best = l;
        if (r < n && a[r] < a[best]) best = r;
        if (best == i) break;
        swap(a[i], a[best]);
        i = best;
    }
}

void buildHeap(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; --i) siftDown(a, i, n);
}

vector<int> topKLargest(const vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minH; // min-heap
    for (int x : nums) {
        minH.push(x);
        if ((int)minH.size() > k) minH.pop();
    }
    vector<int> ans;
    while (!minH.empty()) { ans.push_back(minH.top()); minH.pop(); }
    return ans; // not sorted desc; sort if needed
}

// Dijkstra-ready: min-heap of pairs (dist, node)
void dijkstraHint(int n, int src, const vector<vector<pair<int,int>>>& g) {
    const long long INF = 4e18;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>,
                   greater<pair<long long,int>>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue; // stale
        for (auto [v, w] : g[u]) {
            if (dist[v] > d + w) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

---

## 16. STL usage

```cpp
priority_queue<int> maxH; // largest on top
priority_queue<int, vector<int>, greater<int>> minH;

priority_queue<pair<int,int>> maxPair; // compares first, then second
```

| Trick | How |
|---|---|
| Min-heap of ints | `greater<int>` |
| Max-heap of “small is better” custom | store negated values, or custom comparator |
| Decrease-key | not supported directly — push new pairs + ignore stale (Dijkstra pattern) |
| Heap algorithms on vector | `make_heap`, `push_heap`, `pop_heap` |

`std::set` can also simulate a priority queue with arbitrary delete — heavier constants, but supports erase by value.

---

## 17. Brute Force

For each of n extracts, scan remaining array for min → O(n²). For top-K: sort fully O(n log n) — OK if one-shot and K≈n; wasteful for stream + small K.

---

## 18. Better

Sort once and take K — O(n log n). Or Quickselect average O(n) for Kth only (no full order). Better than repeated scans; may lose to heap for streaming top-K.

---

## 19. Optimal

- Online top-K: O(n log K) min-heap of size K — standard interview optimal.
- Static Kth: Quickselect average O(n); worst-case O(n) with median-of-medians (rare in interviews).
- Need decrease-key heavily: Fibonacci heap theory — mention only; practice uses binary heap + stale entries.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Heap is sorted; I can binary search it."
  ↓
Fails: only parent-child order; siblings unordered
  ↓
Correct: Heap ≠ BST; only top is guaranteed extreme

Wrong: "C++ priority_queue is a min-heap."
  ↓
Fails: default is max-heap
  ↓
Correct: use greater<T> for min-heap

Wrong: "I can update a node's priority inside priority_queue easily."
  ↓
Fails: no decrease-key API
  ↓
Correct: push new entry; skip outdated pops

Wrong: "For K largest, use a max-heap of all n."
  ↓
Fails: uses more space/time than needed
  ↓
Correct: min-heap of size K for K largest
```

---

## 21. Common mistakes

1. Using max-heap when you needed min (Dijkstra bug).
2. Forgetting stale distance checks in Dijkstra.
3. Off-by-one in manual index math.
4. Assuming `priority_queue` iteration is sorted order.
5. Storing pointers/objects without careful comparator (must be const-correct strict weak ordering).
6. Using heap for BST interview questions.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Find Kth largest in an unsorted array.”  
**Expected:** Quickselect or size-K min-heap; discuss average vs worst case.

### Amazon
**Ask:** “Merge K sorted lists.”  
**Expected:** Min-heap of heads; complexity O(N log K).

### Microsoft
**Ask:** “Median from data stream.”  
**Expected:** Two heaps; rebalance; careful even/odd.

### OpenAI
**Ask:** “Why not always use `std::set` instead of heap?”  
**Expected:** Set gives O(log n) delete-by-value and order stats-ish iteration; heap is lighter for pure priority ops and has better constants; set is O(log n) for everything including peek of begin.

**Interview phrase:**

```text
"I'll keep a binary heap as a priority queue — O(log n) push/pop,
O(1) peek. For K largest in a stream, a min-heap of size K is enough."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Maps / GPS routing | Dijkstra PQ |
| Job schedulers | Priority workers |
| Top trending / top sellers | Size-K heaps |
| Compression | Huffman tree via heap |
| Event simulation | Next-event min-heap |

---

## 24. Related concepts + pattern recognition cues

**Related:** sorting, Quickselect, Dijkstra, Prim, Huffman, two-heap median, BST/`set`.

| Cue | Structure |
|---|---|
| Repeated min/max extract | Heap |
| K largest / smallest stream | Opposite heap size K |
| Need ordered full scan | Sort or BST |
| Need erase arbitrary key often | `set` / hash + lazy |
| Graph shortest path non-negative | Dijkstra + min-heap |

**Decision snack:**

```text
Only care about extreme? → heap
Need sorted order always? → multiset / sort
Kth element once? → quickselect or heap
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Complete tree in an array
Parent beats children (min or max)
Push sift up, pop sift down — O(log n)
K largest → min-heap of size K
Default C++ PQ = max-heap
```

### Checklist

- [ ] Index formulas from memory
- [ ] Dry-run push/pop
- [ ] Top-K pattern
- [ ] Two-heap median idea
- [ ] Dijkstra stale entry pattern

### Practice roadmap

1. Easy: Last Stone Weight, Kth Largest in Array (heap way)
2. Medium: Top K Frequent, Merge K Lists, K Closest Points, Task Scheduler
3. Harder: Find Median from Data Stream, IPO, sliding window median

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite min vs max + index math |
| 3 | Dry-run top-K |
| 7 | Code min-heap PQ usage blind |
| 15 | Median stream on paper |
| 30 | Teach Dijkstra + PQ |
| 90 | Mock: merge K lists + top-K |

```text
Item: Heap / Priority Queue
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
