# Company Pattern Map

> How interview **leans** differ. These are tendencies, not guarantees. Always use the universal framework; tilt practice toward the company.

---

## 1. How to Use This File

1. Pick your target company.  
2. Spend **60–70%** of practice on their lean patterns.  
3. Keep **30–40%** broad so you don't get surprised.  
4. Still clarify → brute → optimize every time.

---

## 2. Snapshot Table

| Company | Strong leans | Also common | Style notes |
|---|---|---|---|
| Google | Graphs, recursion/trees, design-of-algorithm, clean proofs | Arrays, BS, DP | Follow-ups; scalability; uniqueness |
| Amazon | Arrays/hash/window, trees, graphs basics, OA patterns | Design LP, greedy | Leadership Principles stories; practical |
| Microsoft | Arrays/strings, trees/graphs, solid coding | DP medium, design | Clarity + production mindset |
| Apple | Practical coding, data structures, concurrency/OS sometimes | Trees, arrays | Quality, edge cases, craft |
| NVIDIA | Algorithms + systems; perf; CUDA/parallel sometimes | Graphs, arrays, bits | Throughput, memory, low-level awareness |
| Anthropic | Strong CS fundamentals; reasoning; clean solutions | Graphs, DP, math-flavored | Clarity of thought; safety of approach |
| OpenAI | Algorithms + ML-adjacent reasoning; hard problem solving | Graphs, DP, math, systems | Depth; communication; tradeoffs |

---

## 3. Google

### Pattern lean

- Graphs (BFS/DFS/topo/shortest)  
- Trees / recursion  
- Binary search on answer  
- Interesting twists on classic problems  
- Occasional hard DP  

### Less about

- Pure memorized LeetCode grind without explanation  
- Messy code that "passes"  

### Practice set ideas

1. Word Ladder / Course Schedule  
2. Number of Islands variants  
3. Random Pick / design + algo mix  
4. Split Array Largest Sum  
5. Alien Dictionary  
6. Employee Free Time-style intervals  
7. Graph valid tree  
8. Median of two sorted arrays (hard classics appear)

### Interview tip

Expect: *"What if n is 10×?"* *"Can you prove it?"* Draw the invariant.

---

## 4. Amazon

### Pattern lean

- Arrays, hashing, sliding window  
- Trees (LCA, views, BST)  
- Graph basics (islands, course schedule)  
- Top-k / heaps  
- OA: debugging + 2 coding questions  

### Leadership Principles (LP)

Be ready to map stories to: Ownership, Customer Obsession, Dive Deep, Bias for Action, Disagree & Commit.

### Practice set ideas

1. Two Sum / Group Anagrams  
2. Longest substring without repeat  
3. Copy List with Random Pointer  
4. Course Schedule  
5. K Closest / Top K Frequent  
6. LRU Cache (design+code)  
7. Number of Islands  
8. Merge Intervals  

### Interview tip

Speak tradeoffs simply. Mention scalability for Amazon-scale when natural.

---

## 5. Microsoft

### Pattern lean

- Solid medium arrays/strings  
- Trees and graphs  
- Linked lists / practical structures  
- Some DP (medium)  
- Design questions in higher levels  

### Practice set ideas

1. Reverse linked list families  
2. Validate BST / Level order  
3. Search rotated array  
4. Coin change  
5. Spiral matrix / rotate  
6. Clone graph  
7. Min stack / calculator mediums  
8. String compression / parsing  

### Interview tip

Code should look maintainable. Name variables well. Discuss testing.

---

## 6. Apple

### Pattern lean

- Correctness and edge cases  
- Arrays/strings/trees  
- Sometimes systems / concurrency / memory  
- Clean API thinking  

### Practice set ideas

1. Palindrome / string processing  
2. Binary tree serialization  
3. Iterator designs (BST iterator)  
4. Concurrent-safe queue discussion (senior)  
5. Merge intervals  
6. Prefetch / cache-aware thinking in discussion  

### Interview tip

Obsess over edge cases and clear interfaces. Quality > flashy.

---

## 7. NVIDIA

### Pattern lean

- Algorithms with **performance** awareness  
- Bit manipulation, arrays, matrices  
- Graphs / geometry-ish sometimes  
- Parallelism, memory bandwidth, SIMT concepts (role-dependent)  
- CUDA / systems for specialized roles  

### Practice set ideas

1. Matrix traverse / rotate / multiply complexity  
2. Bit counting / XOR tricks  
3. Prefix sums / convolution-like thinking  
4. BFS/DFS on grids  
5. Cache locality discussion  
6. Parallel reduction / scan concepts (senior/specialized)  

### Interview tip

When you give O(n), also mention constants, memory access, and whether the algorithm parallelizes.

---

## 8. Anthropic

### Pattern lean

- Fundamentals done extremely well  
- Graphs, trees, DP, math/logic  
- Clear step-by-step reasoning  
- Careful about correctness and assumptions  

### Practice set ideas

1. Classic mediums across all patterns  
2. One hard DP or graph per week  
3. Proof-style explanations (invariants)  
4. Ambiguous problem → ask clarifying questions  

### Interview tip

Show calm structured thinking. Avoid hand-wavy claims. Prefer simple correct over clever fragile.

---

## 9. OpenAI

### Pattern lean

- Hard algorithmic reasoning  
- Graphs + DP + math  
- Systems/ML-adjacent design for some roles  
- Communication of tradeoffs under uncertainty  

### Practice set ideas

1. Hard LeetCode mixed with explanation drills  
2. Design: rate limiter, vector search sketch, training data pipeline (role fit)  
3. Probability / expected value light problems if relevant  
4. Debugging incorrect algorithms aloud  

### Interview tip

Depth matters. Explore alternatives. Say what you'd measure in production.

---

## 10. Cross-Company "Always Hot" List

No matter the company, stay sharp on:

1. Hash map + array  
2. Sliding window  
3. Trees DFS/BFS  
4. Graph BFS + topo  
5. Binary search  
6. Heap top-k  
7. Intervals  
8. LRU / design lite  
9. DP classics (robber, coins, LCS, LIS)  
10. Union-Find  

---

## 11. 2-Week Company Tilt Plan

| Day | Focus |
|---|---|
| 1–2 | Company lean pattern A (5 problems) |
| 3–4 | Company lean pattern B (5 problems) |
| 5 | Mixed medium timed |
| 6 | Mock with framework narration |
| 7 | Review wrong patterns |
| 8–9 | Lean pattern C + one hard |
| 10 | Design / LP / systems as needed |
| 11 | Full mock |
| 12–13 | Weak topic repair |
| 14 | Light revision + sleep |

---

## 12. Wrong Thinking vs Correct

| Wrong | Correct |
|---|---|
| "Only grind company tagged lists" | Tags help; fundamentals + framework win |
| "Google = only hard DP" | Graphs/trees/clarity equally huge |
| "Amazon = only OA" | Onsite still needs trees/graphs/design |
| "AI labs don't ask DSA" | Many still do algorithmic rounds |

---

## Revision Checklist

- [ ] I know my target company's top 3 leans  
- [ ] My practice ratio is ~70% lean / 30% broad  
- [ ] I prepared non-coding parts (LP/systems) if needed  

**Pair with:** `mock-plan-and-final-checklist.md` + Pattern Book.
