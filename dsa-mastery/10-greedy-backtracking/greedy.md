# Greedy Algorithms

**Module:** 10-greedy-backtracking  
**Level target:** L5  
**Prerequisite:** sorting, priority queues / heaps basics, proof mindset, DP awareness  
**Memory picture:** Always eat the tastiest safe cookie now — but only when a proof says no future combo of smaller cookies beats that choice.

---

## 1. What is it?

A **greedy algorithm** builds a solution by always making the choice that looks best **right now**, never undoing it, hoping local bests form a global best.

Greedy works only with structure: **greedy choice property** + **optimal substructure**.

New words:

- **Greedy choice property** — there exists an optimal solution that includes the current greedy pick.
- **Exchange argument** — proof style: swap a different optimal pick for the greedy pick without hurting the answer.
- **Counterexample** — one input where greedy fails (kills the approach).
- **Activity selection** — classic: pick most non-overlapping intervals by earliest end time.
- **Fractional knapsack** — greedy by value/weight works when fractions allowed (not for 0/1).

---

## 2. Explain like I am 10

You pack a bag and always grab the shiny toy first.

Sometimes that is smart (if rules say shiny is always safe). Sometimes you grab one huge shiny toy and cannot fit two better normal toys.

Greedy = always shiny-now. You must know when shiny-now is allowed.

---

## 3. Real life story

**Scheduling meetings:** You want max number of non-overlapping meetings. Strategy: always take the meeting that **ends earliest**, then repeat.

```text
Meetings (start,end):
(1,4) (3,5) (0,6) (5,7) (8,9) (5,9)
Pick (1,4), then (5,7), then (8,9) → 3 meetings
```

Companies use greedy for scheduling, Huffman coding, Dijkstra’s “closest node next,” and caching heuristics (sometimes approximate).

---

## 4. Why does this exist?

When greedy is correct, it is usually simpler and faster than DP (often O(n log n) from sorting). Interviews test whether you **prove** or at least justify — not whether you can say the word “greedy.”

---

## 5. What problem existed before this?

People used brute force subsets / DP even when a sort + one pass was enough. They also used greedy wrongly for 0/1 knapsack and lost money.

---

## 6. What happens without it?

```text
Without greedy when it works:
  DP O(nW) or exponential search — slower, heavier

With greedy when it fails:
  wrong answer that looks smart
```

The danger is silent wrongness.

---

## 7. How did people invent this?

Activity selection and Huffman coding are textbook origins. Dijkstra/Prim feel greedy. Kruskal sorts edges by weight. Interview culture added jump game farthest, gas station, candy, task scheduler-style problems.

Invention lesson: **sort the decisions, pick in a clever order, prove exchange**.

---

## 8. Computer intuition

```text
TYPICAL MACHINE FLOW

1) Sort by key (end time / density / deadline)
2) Scan left→right
3) If candidate compatible with last choice → take
4) Never revisit

MEMORY: often O(1) extra after sort
(or a heap for "best so far online")
```

Heap-greedy: repeatedly extract-min/max (Huffman, connecting ropes, scheduling with weights).

---

## 9. Mathematical intuition

To trust greedy, show:

1. **Greedy choice:** some optimal solution includes the greedy first pick (exchange).  
2. **Optimal substructure:** after that pick, the remaining problem’s optimal completes it.

If either fails, find a counterexample and switch to DP/backtracking.

Fractional knapsack: density order proven. 0/1 knapsack: density order **not** proven — counterexamples exist.

---

## 10. Step-by-step working

1. State the optimization goal clearly.  
2. Propose a greedy key (what do we pick next?).  
3. Try 2–3 examples including a mean case.  
4. Seek counterexample for 2 minutes.  
5. If no counterexample, sketch exchange argument.  
6. If proof fails → DP/search.  
7. Implement with sort/heap; analyze.

**Common greedy keys**

| Problem | Key |
|---|---|
| Max non-overlap intervals | earliest end |
| Fractional knapsack | value/weight |
| Jump game (reach) | farthest reachable |
| Gas station circle | tank + start reset |
| Min platforms / meetings room | sort events |
| Connect files / ropes | always merge two smallest |

---

## 11. Dry run

**Activity selection** ends sorted: `(1,4),(3,5),(0,6),(5,7),(5,9),(8,9)`  
Sort by end: `(1,4),(3,5),(0,6),(5,7),(5,9),(8,9)`  

- Take `(1,4)` last_end=4  
- skip 3-5, 0-6  
- take `(5,7)` last_end=7  
- skip 5-9  
- take `(8,9)`  

Answer 3.

**Jump game:** `a=[2,3,1,1,4]`  
`far` updates: 0→2→4… end reachable.

---

## 12. Visualization

```text
INTERVALS ON LINE

|--1--4|
  |--3--5|
|------0--------6|
      |5--7|
      |5------9|
            |8-9|

Greedy picks earliest finishing compatible:
[1--4] then [5--7] then [8-9]


WRONG GREEDY (0/1 knapsack density)
W=5 items (w,v): (4,5), (3,3), (3,3)
density picks (4,5) value 5
but (3,3)+(3,? no) wait both 3+3=6>5
Actually (3,3) only one fits? 3+3=6>5 → only one item
Better example: W=5; (3,6),(3,5),(2,3)
density 2, 1.66, 1.5 → take (3,6) leftover 2 → +3 =9
optimal same here — use classic counterexample from lesson knapsack:
W=5; (2,3),(3,4),(4,5) density 1.5,1.33,1.25 → greedy (2,3)+(3,4)=7 optimal
Fractional vs 0/1 distinction still mandatory.
```

---

## 13. Complexity

| Pattern | Time | Space |
|---|---|---|
| Sort + scan | O(n log n) | O(1)/O(n) |
| Heap greedy | O(n log n) | O(n) |
| Jump farthest | O(n) | O(1) |

---

## 14. Why this complexity?

Sorting dominates; each item examined once. Heap ops log n per insert/pop.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int activitySelection(vector<pair<int,int>> a) {
    sort(a.begin(), a.end(), [](auto& x, auto& y){
        return x.second < y.second; // by end
    });
    int count = 0, last = INT_MIN;
    for (auto [s, e] : a) {
        if (s >= last) {
            ++count;
            last = e;
        }
    }
    return count;
}

bool canJump(vector<int>& a) {
    int far = 0;
    for (int i = 0; i < (int)a.size(); ++i) {
        if (i > far) return false;
        far = max(far, i + a[i]);
    }
    return true;
}

int findMinArrowShots(vector<vector<int>>& points) {
    if (points.empty()) return 0;
    sort(points.begin(), points.end(), [](auto& x, auto& y){
        return x[1] < y[1];
    });
    int arrows = 1, end = points[0][1];
    for (auto& p : points) {
        if (p[0] > end) {
            ++arrows;
            end = p[1];
        }
    }
    return arrows;
}
```

---

## 16. STL usage

- `sort` with custom comparator  
- `priority_queue` for Huffman / ropes  
- `multiset` for online earliest deadlines  
- careful comparator strict weak ordering  

---

## 17. Brute Force

Try all subsets of intervals / all orders. Exponential; used only to validate tiny cases.

---

## 18. Better

DP when greedy fails (interval DP / knapsack). Or sorting + scan without proof? Still better than brute if correct — but proof needed.

---

## 19. Optimal

When greedy choice holds, sort+scan or heap is typically optimal asymptotically among comparison-based approaches.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Greedy means sort and take largest."
  Why it fails: key may be earliest end, not largest.
  Correct: invent the right key; verify.

Wrong: "If DP exists, greedy never works."
  Why it fails: many problems have both; greedy may be enough.
  Correct: try greedy justification first when structure smells local.

Wrong: "No counterexample in 10 seconds ⇒ correct."
  Why it fails: weak tests.
  Correct: seek adversarial cases; sketch exchange.

Wrong: "Dijkstra is DP, not greedy." / opposite fight
  Why it fails: pedantic; both views exist.
  Correct: explain extract-min settles distance (greedy property on nonneg weights).
```

---

## 21. Common mistakes

1. Wrong sort key.  
2. Using `<` vs `<=` on interval touching endpoints.  
3. Applying fractional logic to 0/1.  
4. Heap comparator bugs.  
5. Claiming O(n) but forgetting sort.  
6. No counterexample attempt → false confidence.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Prove activity selection earliest-end.”  
**Expected:**  
“Take an optimal solution. If its first activity isn’t the earliest-ending one, swap it for the earliest-ending; it finishes sooner so remaining stays feasible. Repeat. Thus greedy matches optimal.”

### Amazon-style

**Interviewer:** “Delivery slots — max jobs?”  
**Expected:**  
“Model as activity selection; sort by finish; greedily assign. Discuss ties and timezone/data issues briefly for production.”

### Microsoft-style

**Interviewer:** “Jump game — why farthest works?”  
**Expected:**  
“Maintain the farthest index reachable so far; if we ever stand beyond it, fail; otherwise success. Optimal substructure of reachability.”

### OpenAI-style

**Interviewer:** “How do you know to abandon greedy?”  
**Expected:**  
“I find a counterexample or fail the exchange argument. Then I define a DP state or backtracking with pruning.”

---

## 23. Company use cases

| Domain | Greedy |
|---|---|
| Cloud schedulers | earliest deadline / priority queues |
| Compression | Huffman |
| Networking | Kruskal/Prim MST |
| Games | greedy AI heuristics (approximate) |
| Ads | budget pacing heuristics (often approx) |

---

## 24. Related concepts + pattern recognition cues

```text
IF max count non-overlapping → earliest end
IF fractions allowed under weight → density greedy
IF "can reach" with jumps → farthest
IF always merge best pair → heap greedy
IF 0/1 exact under capacity → DP not density greedy
IF need all solutions / constraints complex → backtracking
```

Related: sorting, heaps, exchange proofs, DP fallback.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Greedy = local best + never undo
Needs proof / exchange / no counterexample
Right KEY matters more than the word greedy
0/1 knapsack ≠ fractional
```

### Checklist

- [ ] Activity selection dry run  
- [ ] Exchange argument in 4 sentences  
- [ ] Jump farthest code  
- [ ] One counterexample for bad knapsack greedy  
- [ ] Heap merge ropes outline  

### Practice plan

1. Activity selection / erase overlap intervals / balloons arrows  
2. Jump Game I/II  
3. Gas station  
4. Candy / task scheduler  
5. Huffman / connect ropes  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Activity proof + code |
| 3 | Jump + gas station |
| 7 | Two greedy mediums timed |
| 15 | Teach exchange argument |
| 30 | Retry a greedy miss |
| 90 | Google proof mock |

```text
Item: Greedy
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Cookie metaphor + danger |
| L2 | Dry-run activity selection |
| L3 | Code sort-scan + jump |
| L4 | Sketch exchange / find counterexamples |
| L5 | Choose greedy vs DP under pressure |
