# Complexity Communication

> How to **speak** Big-O clearly in interviews — not just write it at the end.

---

## 1. What Interviewers Want

1. Correct order of growth for **time** and **extra space**.  
2. A **reason** tied to your loops / data structures.  
3. Awareness of **best / average / worst** when it matters.  
4. Matching algorithm choice to **constraints** (`n = 1e5` ⇒ avoid O(n²)).

---

## 2. Simple Definitions

**Time complexity:** How the number of basic steps grows as input grows.  
**Space complexity:** Extra memory beyond the input (clarify if you count input).  
**Big-O:** Upper bound style used in interviews (usually tight typical bound).

Kid idea: If the guest list doubles, does your work double, or square, or stay almost flat?

---

## 3. Speak-Aloud Formula

Always use this 3-part sentence:

> "**Time** is O(___) because ___. **Extra space** is O(___) because ___."

Examples:

> "Time is O(n) because each index enters and leaves the window once. Extra space is O(min(n, Σ)) for the frequency map."

> "Time is O(n log k) for n pushes into a size-k heap. Extra space is O(k)."

> "Time is O(V+E) for BFS. Extra space is O(V) for the queue and dist array."

---

## 4. Constraint → Needed Complexity

| Typical limit | Roughly need |
|---|---|
| n ≤ 20 | O(2^n) / O(n!) maybe OK |
| n ≤ 100 | O(n³) sometimes |
| n ≤ 1,000 | O(n²) usually OK |
| n ≤ 1e5 | O(n log n) or better |
| n ≤ 1e6 | O(n) / O(n log n) tight |
| n ≤ 1e8 | O(n) careful constants |

Say this in clarify phase:

> "With n up to 1e5, I'll aim for O(n log n) or O(n)."

---

## 5. Common Patterns → Complexity Cheats

| Pattern | Time | Extra space |
|---|---|---|
| Single pass + hash | O(n) avg | O(n) |
| Two pointers | O(n) after sort O(n log n) | O(1) |
| Sliding window | O(n) | O(A) alphabet / O(k) |
| Binary search | O(log n) | O(1) |
| BS + O(n) check | O(n log R) | O(1) |
| Sort | O(n log n) | O(1)–O(n) |
| Heap n ops | O(n log n) | O(n) |
| Size-k heap | O(n log k) | O(k) |
| DFS/BFS graph | O(V+E) | O(V) |
| Dijkstra | O((V+E) log V) | O(V) |
| DP | O(#states × work) | O(#states) |
| Backtracking | O(b^d) pruned | O(depth) |

---

## 6. How to Analyze Your Own Code

### Nested loops

```text
for i in 1..n:
  for j in 1..n:      → O(n²)
  for j in i..n:      → still O(n²)
for L:
  while R advances only forward → O(n) total
```

### Recursion

Time ≈ number of calls × work per call.  
Space ≈ max stack depth (plus memo table if any).

### Amortized

Sliding window / two pointers / stack next-greater: each element pushed/popped **once** → O(n).

### Hash tables

Average O(1) lookup; mention worst-case if interviewer cares (rare in interviews unless adversarial).

---

## 7. Master Theorem / Logs (Light)

You rarely need the full Master Theorem. Useful lines:

- Halve each time + O(1) work → O(log n)  
- Halve + O(n) work (merge sort) → O(n log n)  
- Binary search on answer with O(n) check → O(n log R)

---

## 8. Space Nuances Interviewers Like

1. **Output space:** "If I don't count the answer array, extra space is O(1)."  
2. **Recursion stack:** "Skewed tree uses O(n) stack."  
3. **In-place:** "We overwrite the input buffer."  
4. **Memo vs recompute:** space/time tradeoff stated clearly.

---

## 9. Comparing Alternatives Aloud

```text
Approach A: sort + scan     O(n log n) time, O(1) space
Approach B: hash one pass   O(n) time, O(n) space
I'd pick B if memory allows; else A.
```

This shows judgment — top-1% signal.

---

## 10. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Two nested loops always O(n²)" | Inner may move once overall | Amortized analysis |
| "BFS is O(n²)" | Only on dense adj matrix | O(V+E) on lists |
| "DP is O(n)" always | Depends on states | Count states |
| Forgetting log from heap/sort | Underestimate | Include log factors |
| Ignoring recursion space | Incomplete | State stack depth |

---

## 11. Scripts for Hot Moments

**When asked "Can you do better?"**

> "Yes — current is O(n²). Because the array is sorted I can two-pointer in O(n)."

**When you are unsure of a log factor**

> "We binary search a range of size R and each check is O(n), so O(n log R)."

**When using randomness (quickselect)**

> "Average O(n), worst O(n²) unless we add safeguards."

---

## 12. Dry-Run Complexity Check

After coding, ask:

1. How many times does each element get processed?  
2. Cost of each map/heap op?  
3. Any hidden nested scans inside the loop?  
4. Did sort dominate?

---

## 13. Mini Practice

State time/space in one sentence each:

1. Two Sum hash  
2. Merge sort  
3. Dijkstra  
4. LIS O(n log n) tails  
5. Combination sum backtracking  

---

## Revision Checklist

- [ ] 3-part complexity sentence is automatic  
- [ ] I map `n` limits to target Big-O  
- [ ] I analyze amortized windows/stacks correctly  
- [ ] I mention extra space every time  

**Spaced:** End every practice problem with the spoken complexity sentence — no exceptions.
