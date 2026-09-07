# Dynamic Programming Cheatsheet

Quick lookup while solving. Not a substitute for full lessons.

---

## Universal Checklist

1. English goal (max / min / count / bool)  
2. `dp[state] = ...` one sentence  
3. Transition + bases  
4. Time = S × T; space = stored states  
5. Top-down vs bottom-up  
6. Space-optimize only after correct  

```text
IF overlapping + optimal substructure → DP
IF n≤20 subsets → bitmask
IF segment merge/split → interval
IF tree hierarchy choices → tree DP
IF capacity number → knapsack family
```

---

## 1D Templates

```cpp
// House robber
int prev2 = a[0], prev1 = max(a[0], a[1]);
for (int i = 2; i < n; ++i) {
    int cur = max(prev1, prev2 + a[i]);
    prev2 = prev1; prev1 = cur;
}

// Coin change (min coins, unbounded)
vector<int> dp(amount+1, INF); dp[0]=0;
for (int x=1; x<=amount; ++x)
  for (int c: coins) if (c<=x)
    dp[x]=min(dp[x], dp[x-c]+1);
```

---

## Knapsack

```cpp
// 0/1 — descending
for (item) for (w=W; w>=wi; --w)
  dp[w]=max(dp[w], dp[w-wi]+vi);

// Unbounded — ascending
for (item) for (w=wi; w<=W; ++w)
  dp[w]=max(dp[w], dp[w-wi]+vi);

// Subset sum bool — descending
dp[0]=true;
for (x:a) for (s=target; s>=x; --s)
  dp[s]=dp[s]||dp[s-x];
```

| Variant | Capacity loop |
|---|---|
| 0/1 | ↓ descending |
| Unbounded | ↑ ascending |

---

## Grid / String

```cpp
// Min path (right/down)
dp[i][j]=g[i][j]+min(dp[i-1][j], dp[i][j-1]);

// LCS
if (s[i-1]==t[j-1]) dp[i][j]=dp[i-1][j-1]+1;
else dp[i][j]=max(dp[i-1][j], dp[i][j-1]);

// Edit
if equal: diag
else: 1+min(insert, delete, replace)
// bases: dp[i][0]=i, dp[0][j]=j
```

**LPS** = LCS(s, reverse(s)).

---

## Interval / Bitmask

```cpp
for (int len=2; len<=n; ++len)
  for (int l=0; l+len-1<n; ++l) {
    int r=l+len-1;
    for (int k=l; k<r; ++k)
      dp[l][r]=min(dp[l][r], dp[l][k]+dp[k+1][r]+cost);
  }

// TSP-like
dp[1<<0][0]=0;
for (mask) for (v in mask) for (u not in mask)
  dp[mask|(1<<u)][u]=min(..., dp[mask][v]+dist[v][u]);
```

Bits: `| (1<<i)` add, `& (1<<i)` test, `n≤20`.

---

## Tree / DAG

```cpp
// take / skip
take = val + skipL + skipR;
skip = max(takeL,skipL) + max(takeR,skipR);

// DAG: topo then
dp[v] = combine(dp[u] for u→v);
```

---

## Init Cheats

| Goal | Init |
|---|---|
| Max value | 0 or `-INF` if negatives |
| Min cost | `+INF`, `dp[0]=0` |
| Ways | 0, `dp[base]=1` |
| Bool | false, `dp[0]=true` |

---

## Complexity Gut

| Pattern | Time |
|---|---|
| 1D linear | O(n) |
| Knapsack | O(nW) |
| LCS/Edit/Grid | O(nm)/O(rc) |
| Interval | O(n³) |
| Bitmask TSP | O(2ⁿ n²) |
| Tree 2-state | O(n) |

---

## Interview Lines

- “State is … Transition is … Bases are … Complexity S×T=…”
- “0/1 descends so we do not reuse the same item.”
- “n=40 → not bitmask; consider meet-in-middle / heuristics.”
- “Four-direction weighted grid → Dijkstra, not up/left DP.”
