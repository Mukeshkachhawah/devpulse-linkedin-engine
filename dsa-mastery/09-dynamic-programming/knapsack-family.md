# Knapsack Family

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** DP framework, 1D DP  
**Memory picture:** A backpack with a weight limit — for each item you decide pack or skip, and you remember the best value for every remaining capacity.

---

## 1. What is it?

The **knapsack family** is a set of DP problems where you choose items under a **capacity / budget / constraint**, usually maximizing value, minimizing cost, or testing possibility.

Main variants:

| Variant | Rule |
|---|---|
| 0/1 knapsack | each item at most once |
| Unbounded | each item unlimited times |
| Bounded | each item up to `cnt` times |
| Subset sum | can we hit exact sum? |
| Partition equal subset | special subset sum |
| Group knapsack | choose among groups |
| Count subsets | number of ways |

New words:

- **Capacity `W`** — max weight/budget.
- **Value** — score you maximize.
- **0/1** — binary choice per item.
- **True/false knapsack** — possibility DP (`bool` / bitset).

---

## 2. Explain like I am 10

You have a school bag that can hold only `W` kilograms. Each toy has weight and fun points. You want max fun without breaking the bag.

For every toy: take it (if it fits) or leave it. Remember best fun for every possible leftover space.

---

## 3. Real life story

Airline baggage: weight limit. You choose which gifts to pack for max “happiness.”

Or cloud budget: pick servers/features under cost cap.

```text
Items: (w,v) = (2,3), (3,4), (4,5), W=5
Best: take first+second = weight 5, value 7
```

---

## 4. Why does this exist?

Choosing subsets under a limit is everywhere. Trying all subsets is O(2ⁿ). If weights are moderate, DP in O(nW) wins.

---

## 5. What problem existed before this?

Brute subset enumeration; greedy by density (value/weight) — **greedy is wrong for 0/1** in general. People needed exact methods for moderate `W`.

---

## 6. What happens without it?

```text
All subsets
n=40 → ~1 trillion subsets
cannot ship exact optimizer
```

Wrong greedy: high density item blocks a better combo.

---

## 7. How did people invent this?

Classic operations research problem (pack a knapsack). DP recurrence became a teaching pillar because the state `dp[i][w]` is easy to draw and generalizes to many interview problems (subset sum, target sum, last stone, etc.).

---

## 8. Computer intuition

```text
TABLE THINKING (0/1)

dp[i][w] = best value using first i items with capacity w

Item i (1-indexed): weight wi, value vi

dp[i][w] = max(
  dp[i-1][w],                 // skip
  dp[i-1][w-wi] + vi         // take, if w>=wi
)

MEMORY rolling 1D:
process items one by one
for w from W down to wi:
  dp[w] = max(dp[w], dp[w-wi] + vi)
(downward loop stops reusing same item)
```

---

## 9. Mathematical intuition

Optimal substructure: best packing with `i` items and capacity `w` considers whether item `i` is in an optimal packing.

Pseudo-polynomial time: O(nW) — polynomial in numeric value `W`, not in bit-length of `W`. If `W` is huge (1e12), this DP is not feasible.

---

## 10. Step-by-step working

1. Identify: 0/1 vs unbounded.
2. State: `dp[w]` best value / bool / ways with capacity `w`.
3. Transition: skip vs take.
4. Loop order:
   - **0/1:** items outer, capacity **descending**
   - **Unbounded:** items outer, capacity **ascending** (or coins inner carefully)
5. Answer at `dp[W]` (or any `dp[w]==true` target).

**Subset sum:** same as 0/1 with value=weight or pure bool.

**Partition:** if total sum odd → false; else subset sum to `sum/2`.

---

## 11. Dry run

Items `(w,v): (1,1), (2,3), (3,4)`, `W=3` (0/1)

```text
Start dp[0..3] = 0

Item (1,1):
 w=3: dp[3]=max(0, dp[2]+1)=1
 w=2: dp[2]=1
 w=1: dp[1]=1

Item (2,3):
 w=3: dp[3]=max(1, dp[1]+3)=4
 w=2: dp[2]=max(1, dp[0]+3)=3

Item (3,4):
 w=3: dp[3]=max(4, dp[0]+4)=4

Answer 4  (items 1+2 or item 3 alone)
```

---

## 12. Visualization

```text
0/1 vs UNBOUNDED loop

0/1 (each once) — walk LEFT ← so same item not reused
w:  0 1 2 3 4 5
    ......←←←←←

Unbounded — walk RIGHT → item can be reused
w:  0 1 2 3 4 5
    →→→→→→......


SUBSET SUM BOOL

target 5, nums [1,2,3]
reach: {0} → {0,1} → {0,1,2,3} → {0..6} includes 5 ✓
```

---

## 13. Complexity

| Variant | Time | Space |
|---|---|---|
| 0/1 | O(nW) | O(W) rolling |
| Unbounded | O(nW) | O(W) |
| Subset sum bool | O(n·sum) | O(sum) or bitset |
| Meet-in-middle backup | O(2^{n/2}) | exponential but for small n |

---

## 14. Why this complexity?

`n` items × `W+1` capacities; O(1) transition. Space O(W) because only previous item layer needed.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int knapsack01(vector<int>& w, vector<int>& v, int W) {
    vector<int> dp(W + 1, 0);
    int n = (int)w.size();
    for (int i = 0; i < n; ++i)
        for (int cap = W; cap >= w[i]; --cap)
            dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
    return dp[W];
}

int unbounded(vector<int>& w, vector<int>& v, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)w.size(); ++i)
        for (int cap = w[i]; cap <= W; ++cap)
            dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
    return dp[W];
}

bool subsetSum(vector<int>& a, int target) {
    vector<char> dp(target + 1, false);
    dp[0] = true;
    for (int x : a)
        for (int s = target; s >= x; --s)
            dp[s] = dp[s] || dp[s - x];
    return dp[target];
}

// Faster subset sum with bitset (weights up to SUM)
bool subsetSumBitset(vector<int>& a, int target) {
    bitset<20001> bs; // set size for constraint
    bs[0] = 1;
    for (int x : a) bs |= (bs << x);
    return bs[target];
}
```

---

## 16. STL usage

- `vector<int> dp(W+1)`
- `vector<char>` for bool (smaller / safer than `vector<bool>`)
- `bitset<N>` for subset sum speed
- `long long` for large values

---

## 17. Brute Force

```cpp
int brute(int i, int cap, vector<int>& w, vector<int>& v) {
    if (i == (int)w.size()) return 0;
    int skip = brute(i + 1, cap, w, v);
    int take = 0;
    if (w[i] <= cap) take = v[i] + brute(i + 1, cap - w[i], w, v);
    return max(skip, take);
}
```

O(2ⁿ).

---

## 18. Better

Memo on `(i, cap)` → O(nW) states top-down.

---

## 19. Optimal

Rolling 1D bottom-up O(nW) time, O(W) space. Bitset for pure possibility when fits.

If `n≤40` and `W` huge → meet-in-the-middle, not classic DP.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Sort by value/weight and pack greedily for 0/1."
  Why it fails: famous counterexamples.
  Correct: DP for exact 0/1; greedy density for fractional knapsack only.

Wrong: "Ascending capacity loop for 0/1."
  Why it fails: reuses same item like unbounded.
  Correct: descending for 0/1.

Wrong: "W=1e9, I'll still allocate dp[W]."
  Why it fails: memory/time death.
  Correct: check constraints; change algorithm.

Wrong: "Subset sum same as unbounded."
  Why it fails: each number once in classic subset sum.
  Correct: 0/1 style loops.
```

---

## 21. Common mistakes

1. Wrong loop direction.
2. Using `int` when values overflow.
3. Forgetting `dp[0]=true` in subset sum.
4. Partition without checking odd sum.
5. Mixing 0/1 code into coin combinations.
6. Off-by-one on `W+1` sizing.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Why descending capacity?”  
**Expected:**  
“In 1D, `dp[w-wi]` must be from the previous item layer. Descending ensures we read not-yet-updated values for this item; ascending would allow reusing the item.”

### Amazon-style

**Interviewer:** “Warehouse packing under weight — production scale?”  
**Expected:**  
“Exact DP needs moderate W. At scale we may use heuristics, OR solvers, or approximate. In interview I still give exact DP first, then discuss scale limits.”

### Microsoft-style

**Interviewer:** “Reduce partition equal subset to knapsack.”  
**Expected:**  
“Total sum S; if S odd false; else 0/1 subset sum to S/2.”

### OpenAI-style

**Interviewer:** “Count subsets with sum K vs boolean?”  
**Expected:**  
“Change `bool` to integer ways; transition `ways[s]+=ways[s-x]` with descending loop for 0/1; watch MOD.”

---

## 23. Company use cases

| Setting | Knapsack cousin |
|---|---|
| Cloud cost caps | pick features under budget |
| Game inventories | weight-limited loot |
| Ads | budgeted campaign selection (simplified) |
| Shipping | pack under weight/volume (multi-constraint → harder) |

---

## 24. Related concepts + pattern recognition cues

```text
IF items + capacity + max value → 0/1 or unbounded knapsack
IF "can you reach sum" → subset sum
IF split array equal → partition
IF coins unlimited → unbounded / coin change
IF n≤40, W huge → meet in middle
IF fractional allowed → greedy by density (not DP)
```

Related: coin change, target sum, last stone weight II, progressive square sum problems.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
0/1: each once → capacity loop descending
Unbounded: reuse → ascending
Time O(nW), pseudo-polynomial
Greedy density ≠ 0/1 exact
```

### Checklist

- [ ] Code 0/1 rolling DP
- [ ] Code unbounded
- [ ] Subset sum + partition
- [ ] Explain loop direction in interview voice
- [ ] Know when W too large

### Practice plan

1. 0/1 knapsack classic  
2. Subset sum / partition  
3. Target sum  
4. Coin change II (combinations)  
5. One “identify variant” drill on 10 prompts

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Dry run 0/1 + code |
| 3 | Subset sum bitset or bool |
| 7 | Mixed variant quiz |
| 15 | Teach loop direction with diagram |
| 30 | Retry failed knapsack problem |
| 90 | Amazon scale discussion mock |

```text
Item: Knapsack Family
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Bag metaphor |
| L2 | Dry-run small 0/1 |
| L3 | Code 0/1 + unbounded + subset sum |
| L4 | Explain pseudo-polynomial + loop order |
| L5 | Map new problems into the family fast |
