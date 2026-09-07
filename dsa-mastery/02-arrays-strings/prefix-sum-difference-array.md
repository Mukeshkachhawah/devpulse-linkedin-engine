# Prefix Sum & Difference Array — Core Lesson

> Previous: Arrays. Pairs with Sliding Window. Next: Matrix (2D prefix sums).

---

## 1. What is it?

A **prefix sum** array stores running totals so any range sum answers in O(1) after O(n) prep.

```text
a     = [2, 1, 3, 4]
pref  = [0, 2, 3, 6, 10]   // pref[0]=0, pref[i] = a[0]+...+a[i-1]
sum(l..r) = pref[r+1] - pref[l]
```

A **difference array** is the reverse idea for range updates: store differences so you can add a value to a whole range in O(1), then rebuild the final array with a prefix pass.

```text
Add +5 to range [1, 3] on zero array of size 5:
diff[1] += 5
diff[4] -= 5
Then prefix of diff → final values
```

---

## 2. Explain like I am 10

Prefix sum: you walk along a path of coin piles. At each step you write how many coins you have collected so far. Later, if someone asks "how many coins from pile 2 to pile 4?", you subtract two notebook numbers — no need to recount piles.

Difference array: instead of painting every fence board when a range should get +1 color, you mark "start +1" and "after end −1". At the end, one walk applies all paint.

**Memory picture:**

```text
Prefix: notebook of "coins so far"
Diff:   sticky notes "start here / stop after here"
```

---

## 3. Real life story

Bank balance: daily transactions. Prefix of transactions → balance after day i. Money spent from day L to R = balance_after_R − balance_before_L.

Stadium seat reservations: many bookings "seats 10–50 reserved." Difference marks make applying thousands of bookings fast.

---

## 4. Why does this exist?

Range sum queries without prep cost O(n) each. With q queries → O(nq). Too slow.

Prefix sum trades O(n) memory and prep for O(1) per query.

Range updates without diff cost O(n) each. With u updates → O(un). Difference array makes each update O(1), final build O(n).

---

## 5. What problem existed before this?

Every query looped:

```cpp
int sum = 0;
for (int i = l; i <= r; i++) sum += a[i];
```

Fine for tiny n. Fails interviews when n,q ≈ 1e5.

People also mutated every index in a range for each update — same pain.

---

## 6. What happens without it?

You cannot efficiently solve:

- Subarray sum equals K (with hash on prefix)
- Range sum queries
- Car pooling / meeting rooms style capacity (diff)
- 2D region sums (matrix chapter)

Many "optimal" array answers secretly start with prefix thinking.

---

## 7. How did people invent this?

From cumulative sums in statistics and from discrete calculus:

```text
diff is like derivative
prefix is like integral
```

Applying diff updates then prefix rebuild is the discrete version of "mark edges, integrate." Segment trees generalize this further (later advanced chapter). For interviews, prefix + diff + hash covers a huge slice.

---

## 8. Computer intuition

```text
pref[0] = 0
for i = 0..n-1:
  pref[i+1] = pref[i] + a[i]

sum l..r inclusive = pref[r+1] - pref[l]
```

Watch overflow: use `long long` for pref when values are large.

Subarray sum = K:

```text
If pref[r+1] - pref[l] = K
→ pref[l] = pref[r+1] - K
```

As you scan, store how many times each prefix appeared in a hash map.

Difference:

```text
diff[l] += val
diff[r+1] -= val   // if r+1 in range
// final[i] = final[i-1] + diff[i]
```

---

## 9. Mathematical intuition

Telescoping sum:

```text
(a0+...+ar) - (a0+...+a[l-1]) = al + ... + ar
```

That is exactly `pref[r+1] - pref[l]`.

For difference array D where `D[0]=A[0]` and `D[i]=A[i]-A[i-1]`, recovering A is prefix of D.

Range add `[l,r]+=v` becomes two point updates on D — linearity of differences.

Complexity:

| Technique | Prep | Query sum | Range add |
|---|---|---|---|
| Naive | 0 | O(n) | O(n) |
| Prefix | O(n) | O(1) | O(n) rebuild if mutate often |
| Diff + final prefix | O(n) | after build O(1) with prefix | O(1) per update |

---

## 10. Step-by-step working

**Build prefix:**

1. Create `pref` of size n+1
2. `pref[0]=0`
3. Fill forward
4. Answer queries with subtraction

**Subarray sum equals K:**

1. `map[0] = 1` (empty prefix)
2. `sum=0`, walk array
3. `sum += a[i]`
4. Answer += map[sum-K]
5. map[sum]++

**Difference range adds:**

1. Start `diff` zeros size n
2. For each update (l,r,v): diff[l]+=v; if r+1<n: diff[r+1]-=v
3. Prefix into result array

---

## 11. Dry run

`a = [1, 2, 3, 4]`, query sum 1..2 (2+3=5)

```text
pref = [0,1,3,6,10]
pref[3]-pref[1] = 6-1 = 5  OK
```

Subarray sum = 3:

```text
i=0: sum=1, need 1-3=-2 → 0; map {0:1,1:1}
i=1: sum=3, need 0 → +1 (subarray [1,2] values 1,2? wait a0+a1=3) yes [0..1]
     map {0:1,1:1,3:1}
i=2: sum=6, need 3 → +1 (subarray [2..2] = 3)
...
```

Diff: n=5, add +2 on [1,3]:

```text
diff: [0,2,0,0,-2]
prefix: 0,2,2,2,0
```

---

## 12. Visualization

```text
Index:     0   1   2   3
a:         1   2   3   4
pref:  0   1   3   6  10
           |-------|
         sum(0..2)=6 = pref[3]-pref[0]
```

```text
Difference paint
seats:  . . . . .
update [1,3] +1
marks:  0 +1 0 0 -1
walk:   0  1 1 1  0
```

```text
Prefix + Hash
running sum line
horizontal look for sum-K seen before
```

---

## 13. Complexity

- Build prefix: **O(n)** time/space  
- Each range sum: **O(1)**  
- Subarray sum K: **O(n)** average with hash  
- u range updates via diff: **O(u + n)** to apply and materialize  

---

## 14. Why this complexity?

Each element contributes once to the running total. Hash map operations are average O(1). Diff touches two ends per update, not the whole range — that is the whole point.

Worst-case hash is ugly; interviews usually accept `unordered_map` with that note, or use sorted methods when forced.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<long long> buildPrefix(const vector<int>& a) {
    int n = a.size();
    vector<long long> pref(n + 1, 0);
    for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + a[i];
    return pref;
}

long long rangeSum(const vector<long long>& pref, int l, int r) {
    // inclusive l..r, 0-based
    return pref[r + 1] - pref[l];
}

int subarraySumEqualsK(const vector<int>& a, int k) {
    unordered_map<long long, int> seen;
    seen[0] = 1;
    long long sum = 0;
    int ans = 0;
    for (int x : a) {
        sum += x;
        ans += seen[sum - k];
        seen[sum]++;
    }
    return ans;
}

vector<int> applyRangeAdds(int n, const vector<tuple<int,int,int>>& updates) {
    vector<int> diff(n, 0);
    for (auto [l, r, v] : updates) {
        diff[l] += v;
        if (r + 1 < n) diff[r + 1] -= v;
    }
    for (int i = 1; i < n; i++) diff[i] += diff[i - 1];
    return diff; // final array
}
```

---

## 16. STL usage

| Tool | Use |
|---|---|
| `vector<long long>` | Prefix storage |
| `unordered_map<long long,int>` | Prefix frequencies |
| `partial_sum` | Can build prefix (`<numeric>`) |
| `adjacent_difference` | Related to diff idea |

In contests, manual loops are clearer for interviews than `partial_sum`.

---

## 17. Brute Force

```cpp
int subarraySumBrute(const vector<int>& a, int k) {
    int n = a.size(), ans = 0;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += a[j];
            if (sum == k) ans++;
        }
    }
    return ans;
}
// O(n^2)
```

---

## 18. Better

Prefix array without hash: for each r, scan all l checking `pref[r+1]-pref[l]==k` → still O(n²) but each sum O(1). Good teaching step; not final.

---

## 19. Optimal

Hash map on prefixes: O(n) average — `subarraySumEqualsK`.

For static range sum queries: prefix O(1) per query.

For many range adds then read final: difference array O(u+n).

If updates and queries mix online, you may need Fenwick/Segment Tree (advanced).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "pref[i] includes a[i] with size n array always."
  ↓
Fails: Off-by-one between inclusive/exclusive conventions
  ↓
Correct: Pick one convention (pref size n+1, pref[0]=0) and stick to it

Wrong: "Sliding window always beats prefix for sum = K."
  ↓
Fails: Negatives / zeros break window shrink rules
  ↓
Correct: Prefix + hash is the general subarray sum = K tool

Wrong: "Diff array answers mid-update queries instantly."
  ↓
Fails: Until you prefix-rebuild, values are not materialized
  ↓
Correct: Diff shines for batch updates then one rebuild (or use trees for online)
```

---

## 21. Common mistakes

1. `int` overflow on prefix — use `long long`
2. Forgetting `seen[0]=1`
3. Inclusive/exclusive index bugs
4. `diff[r]-=v` instead of `diff[r+1]-=v`
5. Using window for sums with negatives
6. Mutating original array when you still need it

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "How do you answer many range sum queries on a static array?"  
**Expected:** Prefix sums; complexity; mention Fenwick if updates appear.

**Ask:** "Subarray sum equals K with negatives?"  
**Expected:** Prefix + hash; not sliding window; explain formula.

### Amazon
**Ask:** "Car pooling: trips add passengers on [from, to)."  
**Expected:** Difference array on timeline; scan capacity; O(n log n) if coordinate compress / sort.

### Microsoft
**Ask:** "Corporate flight bookings — range seat adds."  
**Expected:** Diff array classic; return final seats array.

### OpenAI
**Ask:** "Huge log of token count deltas — compute range totals?"  
**Expected:** Prefix; discuss streaming prefix; memory for huge timelines; possible compaction.

**Phrase:**

```text
"I'll precompute prefix sums so each range sum is O(1).
For subarray sum K, I store prefix frequencies in a hash map."
```

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Ads / metrics | Cumulative impressions |
| Cloud billing | Usage between timestamps |
| Games | Damage over time zones on a map (1D) |
| Logistics | Capacity on a route timeline |
| ML feature eng | Running totals / cumulative histograms |

---

## 24. Related concepts + pattern recognition cues

**Related:** sliding window, hashing, 2D prefix (matrix), Fenwick, segment tree.

| Cue | Tool |
|---|---|
| Many static range sums | Prefix |
| Subarray sum = K | Prefix + hash |
| Many range increments, then read | Diff array |
| Contiguous + non-negative constraint | Maybe window |
| Mix update + query online | Fenwick / segtree |

```text
Hear "range" + "sum" → prefix
Hear "range" + "add update" batch → diff
Hear "sum equals K" → prefix hash
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Prefix = coins collected so far
sum(l..r) = pref[r+1] - pref[l]
Diff = mark start/end, then walk
Negatives ⇒ prefix hash, not basic window
```

### Checklist

- [ ] Build pref size n+1 from memory
- [ ] Dry-run sum K with map
- [ ] Dry-run one diff update
- [ ] Explain window vs prefix for sums
- [ ] Use long long safely

### Practice roadmap

1. Easy: Running Sum, Range Sum Query Immutable
2. Medium: Subarray Sum Equals K, Continuous Subarray Sum, Product of Array Except Self (prefix/suffix twin), Corporate Flight Bookings
3. Harder: Count nice subarrays variants, 2D after matrix lesson

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recall formulas + pictures |
| 3 | Dry-run subarray sum K fully |
| 7 | Code prefix + diff + sum K blind |
| 15 | Timed Medium prefix/diff problem |
| 30 | Teach telescoping + diff dual |
| 90 | Mock: sum K + flight bookings style |

```text
Item: Prefix Sum & Difference Array
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
