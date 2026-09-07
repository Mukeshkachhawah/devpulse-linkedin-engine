# Interview Simulation Bank

> Timed prompts for mocks. **Do not open solutions first.** Use the framework every time.

---

## 1. How to Run a Prompt

1. Set timer (see each set).  
2. Speak aloud (record if alone).  
3. Follow Clarify → Brute → Optimize → Code → Test.  
4. Grade with the rubric in `mock-plan-and-final-checklist.md`.  
5. Log pattern mistakes.

Difficulty tags: **E** easy warm-up, **M** medium, **H** hard.

---

## 2. Set A — Warm-Up Screen (30–35 min, pick 1M or 2E)

| # | Prompt | Pattern hint (cover first) |
|---|---|---|
| A1 | Two Sum | Hash |
| A2 | Valid Parentheses | Stack |
| A3 | Merge Two Sorted Lists | Linked list |
| A4 | Best Time to Buy/Sell Stock I | One pass |
| A5 | Invert Binary Tree | DFS |
| A6 | Climbing Stairs | DP |
| A7 | Maximum Subarray | Kadane |
| A8 | Linked List Cycle | Slow/fast |
| A9 | Binary Search | BS |
| A10 | Flood Fill | DFS/BFS |

---

## 3. Set B — Core Medium Mock (45 min, pick 1)

Cover the hint column until you finish.

| # | Prompt | Expected pattern |
|---|---|---|
| B1 | Longest Substring Without Repeating Characters | Window |
| B2 | 3Sum | Sort + two pointers |
| B3 | Number of Islands | DFS/BFS grid |
| B4 | Course Schedule | Topo / cycle |
| B5 | Kth Largest Element in an Array | Heap / quickselect |
| B6 | Search in Rotated Sorted Array | BS rotated |
| B7 | House Robber | DP |
| B8 | Coin Change | DP unbounded |
| B9 | Implement Trie | Trie |
| B10 | Subsets | Backtracking |
| B11 | Binary Tree Level Order | BFS |
| B12 | Validate BST | Bounds DFS |
| B13 | Min Stack | Aux stack |
| B14 | Product of Array Except Self | Prefix/suffix |
| B15 | Rotate Image | Matrix |

---

## 4. Set C — Pattern Pressure (45 min)

Choose based on weakness:

### C-Window

1. Minimum Window Substring (**H**)  
2. Sliding Window Maximum (**H**)  
3. Longest Repeating Character Replacement (**M**)  

### C-Graph

1. Word Ladder (**H**)  
2. Pacific Atlantic Water Flow (**M**)  
3. Alien Dictionary (**H**)  

### C-DP

1. Longest Increasing Subsequence (**M**)  
2. Edit Distance (**H**)  
3. Word Break (**M**)  

### C-Tree

1. Binary Tree Maximum Path Sum (**H**)  
2. Serialize and Deserialize Binary Tree (**H**)  
3. Lowest Common Ancestor Binary Tree (**M**)  

### C-Heap / Design

1. Find Median from Data Stream (**H**)  
2. Merge k Sorted Lists (**H**)  
3. LRU Cache (**M/H**)  

---

## 5. Set D — Company Tilt Sessions (45–60 min)

### Google-lean session

Pick 1: Word Ladder / Split Array Largest Sum / Alien Dictionary / Random Pick with Weight  

Follow-up questions to self-ask:

- Prove correctness  
- Scale to 10× n  
- Parallelize?

### Amazon-lean session

Pick 1 coding: Number of Islands / LRU Cache / Top K Frequent / Copy List Random Pointer  
+ 10 min LP story: Ownership or Dive Deep  

### Microsoft-lean session

Pick 1: Validate BST / Course Schedule / String parsing medium / Clone Graph  
Focus: clean code + tests  

### Apple-lean session

Pick 1: Serialize tree / Iterator design / Interval merge  
Focus: edges + API clarity  

### NVIDIA-lean session

Pick 1: Matrix algorithm / Bit XOR pair / Grid BFS  
+ discuss memory access / parallelism for 5 minutes  

### Anthropic / OpenAI-lean session

Pick 1 hard: Edit Distance / Max Path Sum / Word Search II / Median of Two Sorted Arrays  
Focus: reasoning depth + calm structure  

---

## 6. Set E — Ambiguity Drills (20 min talk, optional short code)

Practice clarifying only:

1. "Design a leaderboard."  
2. "Find trending hashtags in a stream."  
3. "Detect anomalies in login events."  
4. "Compress logs for storage."  
5. "Rate limit an API."  

Must ask: scale, exactness vs approx, latency, data freshness, failure modes.

---

## 7. Set F — Bug Fix Sims (15–20 min)

Interviewer gives broken approach verbally; you fix:

1. Window that forgets to erase zero freq  
2. Dijkstra without stale-distance skip  
3. BST validate only checking children  
4. Backtracking without undo  
5. Binary search `lo = mid` infinite loop  
6. Topo sort ignoring leftover cycle  

---

## 8. Full Loop Simulation Day

```text
09:00  Medium coding (Set B)
10:00  Break
10:15  Hard / company tilt (Set C or D)
11:15  Break
11:30  Behavioral / LP / design lite (Set E)
12:15  Review all three with rubric
```

Eat and rest between rounds like a real loop.

---

## 9. Scoring Shortcuts

After each problem, answer yes/no:

- [ ] Clarified constraints  
- [ ] Named brute  
- [ ] Named pattern in ≤2 minutes  
- [ ] Correct complexity stated  
- [ ] Dry-ran  
- [ ] Finished with working logic (small bugs OK if found)

**5+ yes** = strong mock.

---

## 10. Progression Rules

| If you... | Then... |
|---|---|
| Fail pattern recognition | Drill Pattern Book 10-min revision daily |
| Fail coding speed | Redo same problem next day cold |
| Fail communication | Shadow mock with voice recording |
| Fail edges | Keep a personal edge-case checklist |
| Pass 3 mocks @ ≥4/5 | Increase hard ratio |

---

## 11. Wrong Thinking vs Correct

| Wrong | Correct |
|---|---|
| Peek hints early | Struggle 15 minutes first |
| Only untimed practice | Timer every mock |
| Same pattern forever | Rotate weak patterns |
| Skip behavioral | Schedule Set E / LP |

---

## 12. Quick Picker (Can't Decide?)

Roll a die:

1. Window / Two Pointers  
2. Tree  
3. Graph  
4. DP  
5. Heap / Design  
6. Backtracking / Trie / BS Answer  

Then pick from the matching set.

---

## Revision Checklist

- [ ] At least one mock scheduled this week from this bank  
- [ ] Hints stay covered until after attempt  
- [ ] Rubric filled after every sim  

**Pair with:** `problem-solving-framework.md` + Pattern Book recognition guide.
