# Pattern Recognition Guide

> **Question this file answers:** *How do I know this is BFS / DP / Binary Search / Greedy / Heap?*

Interview speed comes from **cue → pattern**, not from inventing algorithms from scratch every time.

---

## 1. 30-Second Recognition Ritual

When you read a problem, ask in order:

1. **What is the input shape?** array / string / tree / graph / matrix / stream  
2. **What is asked?** existence / count / min-max / construct / kth / path  
3. **Is order / contiguity important?** contiguous → window; subsequence → DP  
4. **Is there a sorted or monotonic angle?** → binary search / two pointers  
5. **Are there dependencies / connections?** → graph  
6. **Do I need repeated best-next?** → heap  
7. **Do I generate all configs?** → backtracking  
8. **Overlapping subproblems + optimal/ways?** → DP  

Write one sentence: *"This looks like X because Y."*

---

## 2. Master Cue Table

| If you hear / see... | Reach for... | Why |
|---|---|---|
| Contiguous subarray / substring + constraint | Sliding Window | Expand/shrink O(n) |
| Sorted + pair / ends | Two Pointers | Discard half of pairs |
| Unweighted shortest / levels | BFS | First touch = fewest edges |
| Weighted shortest ≥ 0 | Dijkstra | Greedy extract-min |
| Prerequisites / order | Topological Sort | Edges = must-before |
| Components / merge groups | Union-Find / DFS | Connectivity |
| Optimal / #ways + overlapping | DP | Reuse sub-answers |
| Min X such that feasible | Binary Search on Answer | Monotonic ok(x) |
| Top-k / next earliest | Heap | Log-time best |
| All combinations / placements | Backtracking | Explore + undo |
| Prefix dictionary | Trie | Shared prefixes |
| Local choice never hurts | Greedy | Prove exchange / sort key |
| Stream median / running extremes | Two Heaps / Monotonic deque | Maintain invariant |

---

## 3. How Do I Know It Is BFS?

**Yes, BFS if:**

- Graph/grid and you need **shortest path in hops** (unweighted).  
- "Minimum moves / minimum length transformation" with equal step cost.  
- Level-order tree / "right side view" / multi-source infection (rotting oranges).  
- State-space with unit cost (word ladder, unlock patterns).

**Not BFS if:**

- Edge weights differ → Dijkstra / 0-1 BFS.  
- Only connectivity → DFS/UF also fine.  
- Need all paths count with overlapping → often DP.

**Say:** *"Each edge costs 1, so BFS distance is optimal."*

---

## 4. How Do I Know It Is DP?

**Yes, DP if:**

- Min/max/count over sequences of decisions.  
- Same subproblem appears (`i`, `remaining`, `last`, `mask`).  
- Brute recursion TLE but n allows `#states` ~ 10^6–10^7.  
- Classic families: knapsack, LCS, LIS, grid paths, house robber, stocks.

**Not DP if:**

- Pure contiguous window constraint (window first).  
- Greedy proof is clear (activity selection).  
- You only need any path in unweighted graph (BFS).

**Say:** *"State is ..., transition is ..., base is ..."*

---

## 5. How Do I Know It Is Binary Search?

**Yes, Binary Search if:**

- Array sorted / rotated-sorted / matrix row-sorted.  
- Or **answer** lives on a numeric range and `ok(mid)` is monotonic.  
- Phrases: minimize maximum load, maximize minimum distance, minimum speed.

**Not Binary Search if:**

- Feasibility is not monotonic.  
- You need the actual structure via DP/graph.

**Say:** *"If mid works, larger also works; binary search the minimum mid."*

---

## 6. How Do I Know It Is Greedy?

**Yes, Greedy if:**

- Sorting by a key then taking locally best works.  
- Exchange argument / stay-ahead proof feels natural.  
- Examples: interval scheduling, Huffman-like, jump game (reach farthest), gas station.

**Red flag:** Coin change with arbitrary coins — greedy can fail → DP.

**Say:** *"I sort by end time and always take the earliest finishing compatible job; any optimal can be swapped to this."*

---

## 7. How Do I Know It Is a Heap?

**Yes, Heap if:**

- kth / top-k.  
- Repeated "get current best event".  
- Merge k sorted.  
- Scheduling by earliest free time.  
- Dijkstra extract-min.

**Say:** *"I'll keep a size-k min-heap of the best candidates."*

---

## 8. Contiguous vs Subsequence (Critical Split)

```text
Need segment in a row? → Sliding Window / Kadane / Prefix
Need keep order but can skip? → DP (LCS/LIS) / sometimes two pointers on sorted unique
Need any subset? → Knapsack DP / backtracking
```

---

## 9. Array Problem Fast Map

```text
Sorted?
├─ Pair sum / close ends → Two Pointers
├─ Find / bound → Binary Search
└─ Still hard → maybe BS on answer

Unsorted contiguous constraint → Sliding Window / Prefix + Hash
Unsorted pairs sum → Hash Map
Order statistics kth → Quickselect / Heap
Build increasing → Stack monotonic / LIS
```

---

## 10. Graph vs Tree vs Matrix

| Structure | First tools |
|---|---|
| Explicit edges | BFS/DFS/Dijkstra/Topo/UF |
| Tree | DFS recursion / BFS levels |
| Matrix cells | Treat as graph; 4-dir BFS/DFS |
| Words as nodes | Implicit graph (ladder) |

---

## 11. Wrong Pattern → Right Pattern (Common Flips)

| You thought | Symptom | Flip to |
|---|---|---|
| DP | Only contiguous + constraint | Sliding Window |
| DFS shortest | Wrong hop counts | BFS |
| Greedy coins | Fails cases | DP |
| Full sort for kth | OK but slow stream | Heap / Quickselect |
| Nested loops pairs | Sorted available | Two Pointers |
| Brute capacities | Monotonic ok | Binary Search Answer |
| Set of words on board | TLE Word Search II | Trie |

---

## 12. Speak-Aloud Template (Interview Gold)

> "The key property I see is **[contiguous / sorted / unweighted edges / monotonic feasibility / overlapping subproblems]**.  
> That suggests **[pattern]**.  
> Brute force would be **[...]**.  
> Optimized approach: **[...]** with time **[...]**."

---

## 13. 10 Drill Prompts (Name the Pattern Only)

1. Longest substring without repeating → **Sliding Window**  
2. Course schedule → **Topo / Cycle**  
3. Koko bananas → **BS on Answer**  
4. Merge k lists → **Heap**  
5. House robber → **DP**  
6. Word ladder → **BFS**  
7. 3Sum → **Sort + Two Pointers**  
8. N-Queens → **Backtracking**  
9. Word Search II → **Trie + DFS**  
10. Meeting rooms II → **Sort + Min-Heap**  

---

## 14. Practice Habit

For every new problem:

1. Cover the solution.  
2. Force a pattern name in **10 seconds**.  
3. Only then code.  
4. Log mistakes in a "wrong pattern" notebook.

---

## Revision Checklist

- [ ] I run the 30-second ritual every problem  
- [ ] I can explain BFS vs DP vs BS vs Greedy vs Heap triggers  
- [ ] I know contiguous vs subsequence split  
- [ ] I have a one-sentence speak-aloud  

**Spaced:** Review this file before every mock interview.
