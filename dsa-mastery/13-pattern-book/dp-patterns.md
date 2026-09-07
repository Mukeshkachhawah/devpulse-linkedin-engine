# Dynamic Programming Patterns

> **Goal:** Hear "optimal / ways / min-max over choices with overlapping subproblems" and pick the right DP family fast.

---

## 1. When to Use

Use DP when:

1. The problem asks for **optimal value** (min/max) or **number of ways**.
2. The answer for a big problem is built from **smaller same-shaped** problems.
3. Brute force **recomputes** the same states (overlapping subproblems).
4. Choices have **optimal substructure** (best of parts → best of whole).

**Kid idea:** Instead of redoing homework for the same question, write the answer in a notebook and reuse it.

**Not DP (usually):** single-pass greedy that never needs past decisions; pure graph shortest path with Dijkstra when weights are non-negative (unless special state DP on graphs).

---

## 2. Recognition Cues

| Cue | DP family |
|---|---|
| "number of ways" | combinatorics DP / knapsack count |
| "minimum cost / maximum profit" | optimization DP |
| "can you reach / is it possible" | boolean DP / BFS sometimes |
| subsequences / strings match | LCS / edit / LIS |
| house robber / delete or take | 1D decide take/skip |
| capacity / weight / coins | knapsack / unbounded |
| grid path with obstacles | 2D path DP |
| partition / subset sum | 0/1 knapsack boolean |
| intervals / burst balloons | interval DP |
| stocks with cooldown / k transactions | state machine DP |
| digit constraints | digit DP |
| tree rooted answers | tree DP |

**Smell test:** Recursion with branching + same `(i, remaining)` appearing again → memoize / tabulate.

---

## 3. Universal DP Recipe

1. **Define state** in words: `dp[i] = ...`  
2. **Write transition** (how to fill from smaller).  
3. **Base cases.**  
4. **Answer location** (`dp[n]`, `dp[0][W]`, max over states).  
5. Choose **top-down (memo)** or **bottom-up**.  
6. Optimize space if only last row/state needed.

---

## 4. Template Skeletons (C++)

### A. 1D Take / Skip (House Robber style)

```cpp
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0; // dp[i-2], dp[i-1]
    for (int x : nums) {
        int cur = max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
```

### B. Unbounded Knapsack / Coin Change (min coins)

```cpp
int coinChange(vector<int>& coins, int amount) {
    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int a = 1; a <= amount; ++a)
        for (int c : coins)
            if (a >= c) dp[a] = min(dp[a], dp[a - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}
```

### C. 0/1 Knapsack (subset capacity)

```cpp
// max value with capacity W; weight w[i], value v[i]
int knapsack01(vector<int>& w, vector<int>& v, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)w.size(); ++i)
        for (int cap = W; cap >= w[i]; --cap) // reverse: 0/1
            dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
    return dp[W];
}
```

### D. Grid Path DP

```cpp
int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<long long> dp(n, 0);
    dp[0] = grid[0][0] == 0;
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            if (grid[i][j] == 1) { dp[j] = 0; continue; }
            if (j > 0) dp[j] += dp[j - 1];
        }
    }
    return (int)dp[n - 1];
}
```

### E. LCS (2-string DP)

```cpp
int longestCommonSubsequence(string a, string b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
}
```

### F. LIS O(n log n) patience

```cpp
int lengthOfLIS(vector<int>& a) {
    vector<int> tails; // tails[i] = min tail of LIS length i+1
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return (int)tails.size();
}
```

### G. Top-down Memo Template

```cpp
int n;
vector<int> a;
vector<int> memo;

int dfs(int i) { // state: index i
    if (i >= n) return 0;
    if (memo[i] != -1) return memo[i];
    // example: take/skip
    int skip = dfs(i + 1);
    int take = a[i] + dfs(i + 2);
    return memo[i] = max(skip, take);
}
```

### H. Interval DP Skeleton

```cpp
// dp[l][r] = best for range l..r inclusive
int intervalDP(vector<int>& a) {
    int n = a.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; ++len)
        for (int l = 0; l + len - 1 < n; ++l) {
            int r = l + len - 1;
            dp[l][r] = INT_MAX; // or INT_MIN for max
            for (int k = l; k < r; ++k)
                dp[l][r] = min(dp[l][r], dp[l][k] + dp[k+1][r] + /*cost(l,r,k)*/ 0);
        }
    return dp[0][n - 1];
}
```

---

## 5. Common Variants (Map)

| Family | State idea | Transition idea |
|---|---|---|
| Linear take/skip | index | take i + dp[i+2] vs skip |
| Knapsack 0/1 | (i, cap) | take or not; reverse loop |
| Unbounded | cap | for coin, update forward |
| Grid | (r,c) | from top + left |
| String match | (i,j) | equal diagonal else max/min |
| LIS | ends at i / tails | binary search tails |
| Stock | day + holding + tx | state machine |
| Bitmask | mask of used | TSP / assignment |
| Tree DP | node + take parent? | DFS postorder |
| Digit DP | pos, tight, flag | digit by digit |

---

## 6. Traps

1. **Wrong dimension direction** for 0/1 vs unbounded knapsack loops.  
2. **Forgetting base case** `dp[0] = 0` / empty string.  
3. **Modulo** on "number of ways" — apply every add.  
4. **Confusing subsequence vs substring** (substring is contiguous → often window or 2-pointer).  
5. **Using greedy** on coin systems that are non-canonical.  
6. **State explosion** — compress, or rethink (meet in middle).  
7. **Off-by-one** on index vs length arrays.  
8. **Reconstructing answer** without parent pointers when asked for the path.

---

## 7. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "DP = just memoize anything" | Need clear state | Define minimal state that answers question |
| "Always 2D table" | Wastes space / confuses | Many problems collapse to 1D |
| "Greedy always works for coins" | Counterexamples | DP for general coin change |
| "LIS is only O(n²)" | Misses patience sorting | O(n log n) with tails + lower_bound |
| "I can't explain transition" | Interview fail | Speak: 'to compute X I need Y and Z because...' |

---

## 8. Decision Mini-Tree

```text
Optimal / ways / can-reach with overlapping choices?
├─ Linear array decisions → 1D take/skip or kadane-like
├─ Capacity / coins / subset → knapsack family
├─ Two sequences → LCS / edit / string DP
├─ Grid paths → 2D DP
├─ Increasing subsequence → LIS
├─ Ranges / burst / matrix chain → interval DP
├─ Stocks / machines → state machine
└─ Digits / trees / subsets → digit / tree / bitmask DP
```

---

## 9. Example Problems

1. Climbing Stairs  
2. House Robber / House Robber II  
3. Coin Change / Coin Change II  
4. Partition Equal Subset Sum  
5. Unique Paths II  
6. Longest Common Subsequence  
7. Edit Distance  
8. Longest Increasing Subsequence  
9. Maximum Subarray (Kadane)  
10. Word Break  
11. Decode Ways  
12. Best Time to Buy and Sell Stock with Cooldown  
13. Target Sum  
14. Burst Balloons  
15. Longest Palindromic Subsequence  

---

## 10. Complexity Talking Points

- Time ≈ `#states × work per state`  
- Space ≈ `#states` (or rolling if only neighbors needed)  
- Always state the state count out loud in interviews.

---

## 11. Interview Script

> "I'll define `dp[i]` as the best answer using the first i items. The transition is take or skip. Base is empty. That gives O(n) states and O(1) work each."

---

## Revision Checklist

- [ ] Can write state + transition before coding  
- [ ] 0/1 vs unbounded loop direction  
- [ ] LCS / knapsack / LIS templates cold  
- [ ] Know when greedy is unsafe  

**Spaced:** Day 0 → 1 → 3 → 7 → 14 → 30  
**Practice:** 3 DP/week across different families until transitions feel automatic.
