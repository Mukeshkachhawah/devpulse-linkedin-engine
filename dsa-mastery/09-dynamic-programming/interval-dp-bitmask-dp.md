# Interval DP and Bitmask DP

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** DP framework, recursion, bit basics, knapsack mindset  
**Memory picture:** Interval DP = solve a sticker from the middle outward on a line segment. Bitmask DP = each subset of a tiny set (n≤20) is a checkbox pattern of bits you already solved.

---

## 1. What is it?

**Interval DP** solves problems on a contiguous segment `arr[l..r]`, building answers from shorter intervals to longer ones. Examples: matrix chain multiplication, burst balloons, palindrome partitioning min cuts, removing boxes variants, stone merging.

**Bitmask DP** indexes states by an integer mask whose bits mean “which items/cities/people are already chosen/visited.” Examples: TSP-style shortest cycle, assignment problems, subset DP on skills, “min cost to visit all.”

New words:

- **Interval length** — `len = r-l+1`; iterate by increasing length.
- **Split point `k`** — cut interval at `k`.
- **Bitmask** — int as set; bit `i` on means element `i` included.
- **`mask | (1<<i)`** — add element `i`.
- **`mask & (1<<i)`** — test membership.

---

## 2. Explain like I am 10

**Interval:** You have a row of balloons. To know the best score for balloons from L to R, you try “which balloon bursts last,” and use answers for the left piece and right piece.

**Bitmask:** You have 10 light switches. Each pattern of on/off is a saved game. You never recompute a pattern you already finished.

---

## 3. Real life story

**Matrix chain:** multiply many matrices. Order changes cost. Interval DP tries every split of a chain.

**Delivery TSP tiny:** visit each warehouse once, return. For n=15 cities, 2^n·n states work; for n=50 they do not.

```text
Interval merge stones [1,2,3,4]
merge neighbors repeatedly; cost depends on order
```

---

## 4. Why does this exist?

Some problems’ natural subproblems are **segments** or **subsets**. Brute orders are factorial/catalan-like; DP reduces to O(n³) (interval) or O(2ⁿ·poly(n)) (bitmask).

---

## 5. What problem existed before this?

People tried all parenthesizations / all permutations. Matrix chain enumeration is Catalan-many. TSP permutations are n!. They needed structured reuse.

---

## 6. What happens without it?

```text
All multiply orders → Catalan explosion
All tours → n!
n=20 permutations ~ 2e18 — impossible
n=20 bitmask DP ~ 20·2^20 ~ 20M — possible
```

---

## 7. How did people invent this?

Matrix-chain DP is a classic CLRS teaching problem. Bitmask DP grew from competitive programming and exact exponential algorithms for NP-hard problems on tiny n. Interviews use burst balloons / TSP-lite / “min cost to connect all under mask.”

---

## 8. Computer intuition

```text
INTERVAL FILL ORDER (by length)

len=1:  [a][b][c][d]
len=2:  [a b][b c][c d]
len=3:  [a b c][b c d]
len=4:  [a b c d]

For dp[l][r], try split k in [l, r):
  combine dp[l][k] and dp[k][r] + cost(l,k,r)


BITMASK

mask bits:  cities 3 2 1 0
            e.g.  1 0 1 1  = cities {0,1,3}

dp[mask][v] = best cost to visit exactly set mask, ending at v
```

---

## 9. Mathematical intuition

Interval: number of states O(n²); each tries O(n) splits → **O(n³)** typical.

Bitmask: states O(2ⁿ·n) for “subset + ending city”; transition O(n) → **O(2ⁿ·n²)** TSP-style.

Both are exact exponential/poly hybrids — know constraints:

| n | Bitmask? |
|---|---|
| ≤ 20 | often OK |
| ≤ 22 | tight |
| ≥ 25 | usually no |

---

## 10. Step-by-step working

### Interval recipe

1. Define `dp[l][r]` meaning on segment `l..r`.
2. Iterate `len` from small to large.
3. For each `l`, `r=l+len-1`, try split `k` or “last action” position.
4. Base: len 0/1 trivial.
5. Answer `dp[0][n-1]` (watch padding tricks in burst balloons).

### Bitmask recipe

1. Confirm `n≤20` roughly.
2. Map elements to bits 0..n-1.
3. Define `dp[mask]` or `dp[mask][v]`.
4. Transition: try add an unused bit.
5. Base: `dp[1<<start][start]=0` or `dp[0]=0`.
6. Answer over masks with all bits set.

---

## 11. Dry run

**Matrix chain** dims `[10,20,30,40]` (3 matrices A10×20, B20×30, C30×40)

Split after 1 matrix vs after 2:

- (AB)C cost = 10·20·30 + 10·30·40 = 6000+12000=18000  
- A(BC) cost = 20·30·40 + 10·20·40 = 24000+8000=32000  

Best 18000 — interval DP finds min over splits systematically.

**Bitmask assignment toy:** 2 tasks, costs  
`[[1,2],[3,1]]`  
masks assign people to tasks — optimal cost 1+1=2.

---

## 12. Visualization

```text
BURST BALLOONS intuition (padded)

balloons: [1 , 3 , 1 , 5 , 1]
           L               R
Suppose last burst in (L,R) is k=5's index
score += left_border * 5 * right_border
     + dp[L][k] + dp[k][R]


BIT OPS CHEAT

set i:    mask | (1<<i)
clear i:  mask & ~(1<<i)
test i:   mask & (1<<i)
count:    __builtin_popcount(mask)
iterate submasks: for (int s=mask; s; s=(s-1)&mask)
```

---

## 13. Complexity

| Family | Typical time | Space |
|---|---|---|
| Interval | O(n³) | O(n²) |
| Bitmask TSP-like | O(2ⁿ n²) | O(2ⁿ n) |
| Bitmask subset sum-ish | O(2ⁿ n) or better SOS DP | O(2ⁿ) |

---

## 14. Why this complexity?

Interval: O(n²) segments × O(n) cuts. Bitmask: every subset once; moving to each next node costs another n factor.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// Matrix chain min multiplications
int matrixChain(vector<int>& p) {
    // p has n+1 dimensions for n matrices
    int n = (int)p.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; ++len) {
        for (int i = 0; i + len - 1 < n; ++i) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; ++k) {
                long long cost = dp[i][k] + dp[k+1][j]
                    + 1LL * p[i] * p[k+1] * p[j+1];
                dp[i][j] = min(dp[i][j], (int)cost);
            }
        }
    }
    return dp[0][n-1];
}

// TSP-style: min cost visit all, start at 0, return optional
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int N = 1 << n;
    const int INF = 1e9;
    vector<vector<int>> dp(N, vector<int>(n, INF));
    dp[1 << 0][0] = 0;
    for (int mask = 0; mask < N; ++mask)
        for (int v = 0; v < n; ++v) if (mask & (1 << v)) {
            if (dp[mask][v] >= INF) continue;
            for (int u = 0; u < n; ++u) if (!(mask & (1 << u))) {
                int nmask = mask | (1 << u);
                dp[nmask][u] = min(dp[nmask][u], dp[mask][v] + dist[v][u]);
            }
        }
    int full = N - 1, ans = INF;
    for (int v = 0; v < n; ++v)
        ans = min(ans, dp[full][v] + dist[v][0]); // return to 0
    return ans;
}
```

---

## 16. STL usage

- `vector<vector<int>> dp(n, vector<int>(n, INF))`
- for bitmask: `vector<vector<int>> dp(1<<n, vector<int>(n, INF))`
- `__builtin_popcount` / `popcount` (C++20)
- careful `INT_MAX + cost` overflow → use `INF=1e9` or `long long`

---

## 17. Brute Force

All parenthesizations; all permutations of cities. Correct, factorial/Catalan blow-up.

---

## 18. Better

Memo recursion on `(l,r)` or `(mask,v)`.

---

## 19. Optimal

Bottom-up by length for interval; iterative masks for bitmask. Still exponential for bitmask — “optimal” among exact methods for tiny n.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Interval DP is O(n²) because table is n×n."
  Why it fails: splits add a factor.
  Correct: usually O(n³) = states × split loop.

Wrong: "Bitmask works for n=50 if I optimize constants."
  Why it fails: 2^50 impossible.
  Correct: hard cap on n; change problem model.

Wrong: "Iterate len wrong order."
  Why it fails: longer intervals read empty shorter ones.
  Correct: increasing length (or memo top-down).

Wrong: "Forgot start bit in TSP base."
  Why it fails: all distances stay INF.
  Correct: dp[1<<start][start]=0.
```

---

## 21. Common mistakes

1. Off-by-one in interval bounds / padding.
2. Using `INT_MAX` then adding.
3. Iterating masks without ensuring `v ∈ mask`.
4. Confusing Hamiltonian path vs cycle.
5. n too large for bitmask — silent TLE plan.
6. Wrong cost function for merge (include borders!).

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Why increasing length?”  
**Expected:** “A longer interval’s transition depends on strictly shorter intervals. Processing by length guarantees dependencies are ready.”

### Amazon-style

**Interviewer:** “Routing 12 warehouses exactly once — approach?”  
**Expected:** “Bitmask DP TSP O(2ⁿ n²) fits n=12. For n=100, use heuristics (Christofides-ish / OR tools), not exact DP.”

### Microsoft-style

**Interviewer:** “Burst balloons state?”  
**Expected:** “`dp[l][r]` max coins bursting open balloons strictly between l and r; last burst k; coins = nums[l]*nums[k]*nums[r] + dp[l][k]+dp[k][r].”

### OpenAI-style

**Interviewer:** “When prefer bitmask over knapsack?”  
**Expected:** “When constraint is ‘which subset of distinct items/people/cities’ and n is tiny; knapsack fits numeric capacity dimensions better.”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Compilers | matrix/parenthesis-like opt (teaching) |
| Logistics | tiny exact TSP / assignment |
| Games | puzzle state as bitmask |
| ML infra scheduling (tiny) | assign jobs to few machines exactly |

---

## 24. Related concepts + pattern recognition cues

```text
IF "merge / burst / matrix chain / palindrome cut on segment"
→ interval DP O(n³)

IF n≤20 AND "visit all / assign each / subset of people"
→ bitmask DP

IF capacity number large, items many
→ knapsack, not bitmask

IF graph shortest without "must visit all"
→ Dijkstra / BFS, not TSP DP
```

Related: digit DP (separate advanced), SOS DP, plug DP (CP-heavy).

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Interval: dp[l][r], grow length, try k
Bitmask: dp[mask](+v), n≤20
O(n³) vs O(2ⁿ n²) — know which world
Padding borders common in burst
```

### Checklist

- [ ] Matrix chain dry run  
- [ ] Write interval loops by length  
- [ ] Code small TSP bitmask  
- [ ] Explain n limit for masks  
- [ ] Burst balloons state sentence  

### Practice plan

1. Matrix chain / min score triangulation  
2. Burst balloons  
3. Palindrome partitioning II  
4. TSP / assignment bitmask  
5. “Shortest path visiting all nodes” style  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Interval length loops + dry run |
| 3 | Bitmask TSP code |
| 7 | One interval + one mask medium |
| 15 | Teach O(n³) vs 2ⁿ |
| 30 | Retry hardest failed |
| 90 | Amazon routing scale mock |

```text
Item: Interval DP + Bitmask DP
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Segment + checkbox metaphors |
| L2 | Fill small interval table |
| L3 | Code matrix chain + TSP dp |
| L4 | Pick constraints correctly |
| L5 | Invent split/mask states on new prompts |
