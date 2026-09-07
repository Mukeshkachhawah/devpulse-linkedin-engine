# Segment Tree and Fenwick Tree (BIT)

**Module:** 11-advanced  
**Level target:** L5  
**Prerequisite:** arrays, recursion, prefix sums, binary representation  
**Memory picture:** Segment tree = a pyramid of range answers over the array. Fenwick = a clever checklist of partial sums indexed by bit jumps.

---

## 1. What is it?

Both structures answer **range queries** and support **point (or range) updates** faster than rebuilding prefix sums.

| Structure | Typical ops | Time |
|---|---|---|
| **Segment Tree** | range sum/min/max + point update; also lazy range update | O(log n) |
| **Fenwick Tree (BIT)** | prefix sum + point add; range sum via prefixes | O(log n) |

New words:

- **Point update** — change one index.  
- **Range query** — ask about `[l..r]`.  
- **Lazy propagation** — postpone range updates in segment tree.  
- **Responsible segment** — node covering a full piece of the query.  
- **`i & -i`** — isolates lowest set bit (Fenwick navigation).

Prefix sums alone: query O(1) sum, but update O(n). These trees fix updates.

---

## 2. Explain like I am 10

Class scores in a line.

**Segment tree:** Class captain knows the sum; each half has a captain; each quarter too. To get a range sum, ask a few captains that exactly cover your range.

**Fenwick:** A magic notebook where each page stores a small block sum; jumping by powers of two builds any prefix.

---

## 3. Real life story

Live leaderboard: scores update often; you need sum/max on segments of ranks. Rebuild O(n) each time is too slow; log n structures win.

```text
Array:  [2, 3, -1, 5]
Range sum 1..2 (0-index 1..2): 3 + (-1) = 2
Update index 1 to 10 → queries change
```

---

## 4. Why does this exist?

Many problems need **dynamic** range aggregates. Interviews (especially CP-flavored / harder rounds) test Fenwick/segment tree as “can you go beyond prefix sums?”

---

## 5. What problem existed before this?

Naive loops O(n) per query; sparse tables for static RMQ; prefix sums for static sums. Dynamic case needed log trees.

---

## 6. What happens without it?

```text
Q updates/queries on n=1e5
naive O(nQ) → TLE
prefix sums → updates break
```

---

## 7. How did people invent this?

Segment trees evolved for computational geometry/range queries. Fenwick (binary indexed tree) by Peter Fenwick 1994 for cumulative frequency tables. CP popularized both heavily.

---

## 8. Computer intuition

```text
SEGMENT TREE (sum) over 4 elems

            [0,3] sum
           /         \
      [0,1]           [2,3]
      /   \           /   \
   [0,0] [1,1]    [2,2] [3,3]

Query [1,2]: take [1,1] + [2,2]


FENWICK idea (1-index)

index i stores sum of a segment ending at i
length = i & -i

i:     1  2  3  4  5  6  7  8
len:   1  2  1  4  1  2  1  8
```

---

## 9. Mathematical intuition

Height O(log n) ⇒ each update/query touches O(log n) nodes.

Fenwick: every prefix decomposes into O(log n) BIT segments via stripping lowest set bits.

Associative operations work (sum, min, max, gcd…). Need care for non-invertible ops (min) — Fenwick is natural for sums; segment tree more general.

---

## 10. Step-by-step working

### When to pick which?

| Need | Pick |
|---|---|
| prefix/range sum + point add | Fenwick (shorter code) |
| range min/max / gcd + update | Segment tree |
| range add + range sum | Segment tree + lazy |
| static idempotent RMQ | Sparse table (not this lesson’s focus) |

### Build mental steps

1. Decide 0-index vs 1-index (Fenwick usually 1-index).  
2. Implement point update.  
3. Implement query.  
4. Verify with brute on n≤1000.  
5. Add lazy only when required.

---

## 11. Dry run

Array 1-index: `[0,2,3,-1,5]` (ignore index 0)

Fenwick after build (conceptual adds): query prefix(3)=2+3+(-1)=4  
range(2,4)=prefix(4)-prefix(1)= (2+3-1+5)-2=7.

Segment tree query [2,3] (0-index): combines two leaves −1 and 5 → 4.

---

## 12. Visualization

```text
QUERY COVER

Array indices: 0 1 2 3 4 5 6 7
Query [1..6]: might take nodes covering
[1,1]+[2,3]+[4,5]+[6,6]
(not unique shape; O(log n) nodes)


BIT i & -i

i=12 = 1100
-i (two's) → lowest bit 4 (0100)
12 & -12 = 4
```

---

## 13. Complexity

| Op | Segment tree | Fenwick |
|---|---|---|
| Build | O(n) | O(n log n) adds / O(n) careful |
| Point update | O(log n) | O(log n) |
| Range query | O(log n) | O(log n) |
| Memory | ~4n | n+1 |

Lazy range update: still O(log n) amortized per op with propagation.

---

## 14. Why this complexity?

Tree height log n; each level does O(1) work per op. Lazy pushes work down only along the visited path.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Fenwick {
    int n; vector<long long> bit;
    Fenwick(int n): n(n), bit(n+1,0) {}
    void add(int i, long long v) { // 1-index
        for (; i <= n; i += i & -i) bit[i] += v;
    }
    long long sumPrefix(int i) {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
    long long rangeSum(int l, int r) { // inclusive 1-index
        return sumPrefix(r) - sumPrefix(l-1);
    }
};

struct SegTree {
    int n; vector<long long> st;
    SegTree(int n): n(n), st(4*n,0) {}
    void build(vector<long long>& a, int p, int l, int r) {
        if (l == r) { st[p] = a[l]; return; }
        int m = (l+r)/2;
        build(a, 2*p, l, m);
        build(a, 2*p+1, m+1, r);
        st[p] = st[2*p] + st[2*p+1];
    }
    void update(int p, int l, int r, int idx, long long val) {
        if (l == r) { st[p] = val; return; }
        int m = (l+r)/2;
        if (idx <= m) update(2*p, l, m, idx, val);
        else update(2*p+1, m+1, r, idx, val);
        st[p] = st[2*p] + st[2*p+1];
    }
    long long query(int p, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return st[p];
        int m = (l+r)/2;
        return query(2*p,l,m,ql,qr) + query(2*p+1,m+1,r,ql,qr);
    }
};
```

---

## 16. STL usage

- `vector<long long>` for tree arrays  
- no STL Fenwick — you write it  
- `policy_based_data_structure` order statistics — alternative advanced path  
- coordinate compression often pairs with BIT for value ranks  

---

## 17. Brute Force

For each query, loop the range. O(n) per query.

---

## 18. Better

Prefix sums if **no updates** (or rare rebuilds). Sparse table for static min/max.

---

## 19. Optimal

Fenwick/segment tree O((n+q) log n). Choose Fenwick for sum brevity; segment for generality/lazy.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Prefix sums handle updates."
  Why it fails: must rebuild O(n).
  Correct: BIT/segTree for dynamic.

Wrong: "Fenwick is 0-indexed like arrays."
  Why it fails: i&-i logic assumes 1-index.
  Correct: convert +1/-1 at API boundary.

Wrong: "Segment tree always size 2n."
  Why it fails: iterative 2n works for some builds; recursive often 4n safe.
  Correct: know which style you coded.

Wrong: "Min range with Fenwick same as sum."
  Why it fails: min not invertible via prefix subtract.
  Correct: use segment tree (or specialized structures).
```

---

## 21. Common mistakes

1. Off-by-one `l-1` on empty prefix.  
2. Update adds delta vs sets absolute value (inconsistent API).  
3. Query while lazy not pushed.  
4. `int` overflow on sums — use `long long`.  
5. Building on wrong n after compression.  
6. Infinite loop if `i+=i&-i` with `i==0`.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Why log n for range sum with updates?”  
**Expected:** “Each update affects O(log n) canonical segments; each query aggregates O(log n) disjoint segments covering [l,r].”

### Amazon-style

**Interviewer:** “Metrics dashboard: many increments, many range sums?”  
**Expected:** “Fenwick/segment tree; discuss memory, concurrency, and pre-aggregation if Q is huge.”

### Microsoft-style

**Interviewer:** “Implement range sum mutable.”  
**Expected:** “I’ll use Fenwick: `add`, `sumPrefix`, `sum(l,r)=p(r)-p(l-1)`.”

### OpenAI-style

**Interviewer:** “Lazy propagation in one minute?”  
**Expected:** “Store pending range updates at a node; push to children only when we must go down; keeps range-add + range-query O(log n).”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Analytics | live range aggregates |
| Games | range buffs (lazy seg) |
| Ranking | frequency BIT + compression |
| Editors | rope-like ideas (heavier) |
| Infra metrics | windowed counters |

---

## 24. Related concepts + pattern recognition cues

```text
IF static range sum → prefix
IF static RMQ → sparse table
IF point update + range sum → Fenwick or segtree
IF range update → lazy segtree
IF range min + update → segtree
IF values huge → compress then BIT
```

Related: sqrt decomposition, policy PBDS, merge sort tree (advanced).

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Dynamic range ⇒ log trees
Fenwick: prefix via i&-i (1-index)
SegTree: pyramid merge, more general
Lazy for range updates
```

### Checklist

- [ ] Fenwick add + prefix from memory  
- [ ] SegTree update/query skeleton  
- [ ] When Fenwick fails for min  
- [ ] Dry-run small array  
- [ ] Explain Google log n reason  

### Practice plan

1. Range sum query mutable (BIT)  
2. Range min query with updates (segtree)  
3. Inversion count via BIT  
4. Lazy range add + sum  
5. Coordinate compression + frequencies  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Code Fenwick |
| 3 | Code SegTree sum |
| 7 | Inversions + one min tree |
| 15 | Teach i&-i with bits |
| 30 | Retry bug-prone impl |
| 90 | Microsoft live coding BIT |

```text
Item: Segment Tree & Fenwick
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Pyramid vs checklist metaphor |
| L2 | Dry-run prefix BIT |
| L3 | Code Fenwick + basic segtree |
| L4 | Choose structure; avoid off-by-ones |
| L5 | Lazy + compression in real problems |
