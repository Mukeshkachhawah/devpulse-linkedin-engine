# 1D Dynamic Programming

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** DP thinking framework, arrays, recursion  
**Memory picture:** A single row of light bulbs — to decide bulb `i`, you only look at a few bulbs behind it.

---

## 1. What is it?

**1D DP** means your state is mainly indexed by **one changing position** (usually an index `i` in an array or a number `n`), maybe with a tiny extra flag.

Classic family:

- Climbing stairs / Fibonacci-like
- House robber
- Jump game (reachability / min jumps)
- Decode ways
- Max sum / min cost ending at `i`
- Coin change (amount as 1D, or coins×amount as 1.5D)

New words:

- **Ending at i** — “best answer for the prefix `0..i` with a rule about element `i`.”
- **Rolling variables** — keep only `prev1`, `prev2` instead of full array.
- **Reachability DP** — `dp[i] = true/false` can I reach index `i`?

---

## 2. Explain like I am 10

You walk along a path of stones. On each stone you ask: “Best score if I stop here?”

You do not restart from the beginning of the path every time. You use answers from earlier stones.

One line of stones → one line of answers → **1D DP**.

---

## 3. Real life story

**House robber story:** houses in a street. You cannot rob two neighbors. What is max money?

For house `i`, you choose:

- skip it → take best up to `i-1`
- rob it → take money[i] + best up to `i-2`

```text
Houses:  [2, 7, 9, 3, 1]
Best:     2  7 11 11 12
```

Companies use 1D DP for streak scoring, sessionization, and “best so far along a timeline.”

---

## 4. Why does this exist?

Many array problems look like “process left to right with local choices.” Brute force tries all subsets of choices (exponential). 1D DP stores the best for each prefix.

It is the warm-up gym for all DP: if you cannot invent `dp[i]`, harder tables will feel impossible.

---

## 5. What problem existed before this?

People used nested loops over all subsets, or recursion over index with take/skip. That works until `n≈40+`. They needed linear or near-linear reuse along the array.

---

## 6. What happens without it?

```text
Take/skip recursion without memo
f(i) → f(i+1) + f(i+2)
     → exponential leaves
```

Symptoms: TLE at n=100, cannot explain complexity, messy “I tried something with two variables” without a definition.

---

## 7. How did people invent this?

Fibonacci is the ancestor. Then “maximum subarray-ish with constraints,” then robber/jump/decode as interview staples. The invention is: **index as stage in a multi-stage decision**.

---

## 8. Computer intuition

```text
MEMORY — one array

i:    0   1   2   3   4
a:   [2,  7,  9,  3,  1]
dp:  [2,  7, 11, 11, 12]

To fill dp[i], CPU reads dp[i-1], dp[i-2], a[i]
```

The machine only needs constant neighbors for many 1D problems — that is why space optimization often works.

---

## 9. Mathematical intuition

Typical recurrence shapes:

```text
dp[i] = max(dp[i-1], dp[i-2] + a[i])          // house robber
dp[i] = dp[i-1] + dp[i-2]                     // ways
dp[i] = min over j reachable: dp[j] + 1       // min jumps (can be O(n²))
dp[x] = min over coin c: dp[x-c] + 1          // coin change
```

Time often O(n) or O(n·k). Prove by induction: assume all `dp[j]` for `j<i` correct → transition makes `dp[i]` correct.

---

## 10. Step-by-step working

1. Decide: is answer for **prefix ending at i**, or **using first i items**, or **amount i**?
2. Write `dp[i] = ...` in English.
3. List choices at stage `i`.
4. Base: `dp[0]` / `dp[1]`.
5. Loop `i = 2..n-1` (or `1..n`).
6. Answer is usually `dp[n-1]` or `dp[n]` — know which.
7. Optimize to variables if only last few matter.

**Decision guide**

| Feeling | State idea |
|---|---|
| Best with constraint on neighbors | `dp[i]` best for prefix ending decision on `i` |
| Count sequences | ways DP |
| Can I reach? | bool DP or BFS |
| Min coins for amount | `dp[amount]` |

---

## 11. Dry run

**House robber:** `a = [2,7,9,3,1]`

```text
dp[0] = 2
dp[1] = max(2,7) = 7
dp[2] = max(dp[1], dp[0]+9) = max(7,11) = 11
dp[3] = max(11, 7+3) = 11
dp[4] = max(11, 11+1) = 12
Answer 12 (2+9+1 or 7+3+1 etc. — optimal 2+9+1=12)
```

**Decode ways:** `s = "12"`  
`dp[0]=1` empty  
`dp[1]=1` ("1")  
`dp[2]=2` ("1,2" and "12")

---

## 12. Visualization

```text
HOUSE ROBBER CHOICE AT i

          ...  i-2   i-1   i
rob i:    [best] ----X---- [take a[i]]
skip i:   --------[best]-- [no take]

dp[i] = max( skip = dp[i-1],
             rob  = dp[i-2] + a[i] )


JUMP GAME REACHABILITY

index: 0 1 2 3 4
a:     2 3 1 1 4
reach: ✓ ✓ ✓ ✓ ✓
from 0 can go to 1,2; from 1 can go far → end reachable
```

---

## 13. Complexity

| Problem | Time | Space | Notes |
|---|---|---|---|
| Robber / stairs | O(n) | O(n) → O(1) | two prev vars |
| Decode ways | O(n) | O(n) → O(1) | careful zeros |
| Jump game I | O(n) | O(1) | greedy farthest often |
| Min jumps | O(n) greedy / O(n²) DP | O(1)/O(n) | prefer BFS layers |
| Coin change amount A, c coins | O(c·A) | O(A) | unbounded |

---

## 14. Why this complexity?

One pass over indices; each index does O(1) or O(coins) work. Space drops when transition uses a fixed window of previous answers.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int rob(vector<int>& a) {
    int n = (int)a.size();
    if (n == 0) return 0;
    if (n == 1) return a[0];
    int prev2 = a[0];
    int prev1 = max(a[0], a[1]);
    for (int i = 2; i < n; ++i) {
        int cur = max(prev1, prev2 + a[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

int coinChange(vector<int>& coins, int amount) {
    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; ++x)
        for (int c : coins)
            if (c <= x) dp[x] = min(dp[x], dp[x - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}

bool canJump(vector<int>& a) {
    int far = 0;
    for (int i = 0; i < (int)a.size(); ++i) {
        if (i > far) return false;
        far = max(far, i + a[i]);
    }
    return true;
}
```

---

## 16. STL usage

- `vector<int> dp(n)` for prefix answers
- `vector<long long>` for large way counts
- `min` / `max` algorithms
- Sometimes `deque` for 1D DP with range minimum optimization (advanced)

For ways problems: take modulo if required (`% MOD`).

---

## 17. Brute Force

Recurse on index: take/skip or try all jump lengths. O(2ⁿ) or worse.

```cpp
int robBrute(vector<int>& a, int i) {
    if (i < 0) return 0;
    return max(robBrute(a, i - 1), a[i] + robBrute(a, i - 2));
}
```

---

## 18. Better

Memo on index: O(n) states.

```cpp
int robMemo(vector<int>& a, int i, vector<int>& memo) {
    if (i < 0) return 0;
    if (memo[i] != -1) return memo[i];
    return memo[i] = max(robMemo(a, i - 1, memo),
                          a[i] + robMemo(a, i - 2, memo));
}
```

---

## 19. Optimal

Bottom-up O(n) time, O(1) space for robber/stairs-like. For coin change, O(amount) space is standard optimal for classic DP (unless bitset tricks for subset-sum style).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "dp[i] means best using exactly i houses robbed."
  Why it fails: wrong English → wrong transition.
  Correct: define clearly: best for prefix 0..i.

Wrong: "Coin change: loop coins outside vs inside does not matter."
  Why it fails: order changes combination vs permutation counting.
  Correct: know whether you count combinations or permutations; fix loop order.

Wrong: "Jump game needs DP always."
  Why it fails: farthest-reach greedy is O(n) and enough for can-reach.
  Correct: use simplest correct tool; know both.

Wrong: "Decode '10' same as '12'."
  Why it fails: zeros invalidate single-digit decode.
  Correct: validate one-digit and two-digit windows carefully.
```

---

## 21. Common mistakes

1. Forgetting `n==0/1` base.
2. Using `dp[i] = dp[i-1] + a[i]` when neighbor constraint exists.
3. Integer overflow on ways.
4. Off-by-one between `dp[n]` vs `dp[n-1]`.
5. Unbounded knapsack loop order mistakes.
6. Returning `dp.back()` when last state is not the answer (sometimes max of all).

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Prove house robber recurrence.”  
**Expected:**  
“Any optimal solution either skips house i, then equals OPT(i-1), or takes house i, then cannot take i-1, so equals a[i]+OPT(i-2). We take max. Base holds for 0/1 houses.”

### Amazon-style

**Interviewer:** “Coin change with huge amount?”  
**Expected:**  
“Classic DP is O(coins·amount). If amount is 1e9, DP table may be impossible; discuss constraints, alternative math, or whether complete knapsack assumptions change.”

### Microsoft-style

**Interviewer:** “Space-optimize robber.”  
**Expected:**  
“Only previous two answers matter → two integers, slide forward.”

### OpenAI-style

**Interviewer:** “When does 1D become 2D?”  
**Expected:**  
“When one index is not enough: remaining budget, last color, k transactions, second string index. Add a dimension only when the answer depends on it.”

---

## 23. Company use cases

| Domain | 1D DP use |
|---|---|
| Ads / feeds | best score along a timeline with spacing constraints |
| Payments | min coins / denom problems (teaching cousin of real cashiers) |
| Games | stage scores, jump/reach maps |
| Infra | retry/backoff planning with discrete stages |

---

## 24. Related concepts + pattern recognition cues

**Related:** greedy jump, sliding window, kadane (max subarray), knapsack when capacity appears.

```text
IF array + take/skip with neighbor rule → 1D robber-like
IF ways to build n with steps → fibonacci-like
IF amount + unlimited coins → dp[amount]
IF "can reach end" → greedy farthest or bool DP
IF need last choice memory → add thin second dimension
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
1D DP = best/ways along an index line
Write dp[i] English first
Many optimize to O(1) space
Coin DP: watch loop order for counting
```

### Checklist

- [ ] Dry-run robber on 5 houses
- [ ] Code O(1) space robber
- [ ] Code coin change min coins
- [ ] Explain decode ways zero cases
- [ ] Compare jump greedy vs DP

### Practice plan

1. Stairs, robber, max sum with no two adjacent  
2. Coin change I & II (min coins vs combinations)  
3. Decode ways  
4. Jump Game I & II  
5. Mix: delete-and-earn (robber reduction)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Robber dry run + code |
| 3 | Coin change from memory |
| 7 | Three 1D problems timed (45 min) |
| 15 | Teach fib/robber/coin differences |
| 30 | Re-solve a failed 1D from tracker |
| 90 | Mock with Google proof question |

```text
Item: 1D DP
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Explain light-bulb row |
| L2 | Dry-run robber + stairs |
| L3 | Code O(1) space + coin DP |
| L4 | Fix zeros in decode; discuss jump greedy |
| L5 | Reduce new prompts to 1D states quickly |
