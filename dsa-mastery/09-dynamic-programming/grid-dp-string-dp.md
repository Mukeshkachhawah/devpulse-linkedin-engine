# Grid DP and String DP

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** DP framework, 1D DP, 2D arrays, strings  
**Memory picture:** A chessboard of sticky notes — cell `(i,j)` is filled from neighbors above/left (grids) or from shorter prefixes of two strings.

---

## 1. What is it?

**Grid DP** solves problems on a matrix where a cell’s answer depends on nearby cells (often up/left), such as unique paths, min path sum, dungeon game, cherry pickup variants.

**String DP** solves problems on one or two strings using indices `(i)` or `(i,j)`: LCS, edit distance, longest palindromic subsequence, regex / wildcard matching, interleaving strings.

Shared idea: **2D state on coordinates or string positions**.

New words:

- **LCS** — longest common subsequence (not necessarily contiguous).
- **Substring** — contiguous; **subsequence** — maybe with gaps.
- **Edit distance** — min inserts/deletes/replaces to turn A into B.
- **In-place rolling** — keep previous row only.

---

## 2. Explain like I am 10

Grid: you walk only right and down on a city map of blocks. Each block has a cost. You want cheapest path. You write the cheapest way to reach every block, using the block above and the block to the left.

Strings: you compare two words letter by letter. For every pair of prefixes, you store “how well they match so far.”

---

## 3. Real life story

**GPS blocks:** streets form a grid. Toll on each cell. Min path sum = DP.

**Document diff:** two file versions. Edit distance / LCS ideas power “diff” tools and plagiarism-ish similarity (simplified).

```text
Grid min path
1 3 1
1 5 1
4 2 1

Best path 1→3→1→1→1 = 7
```

---

## 4. Why does this exist?

Number of paths in a grid is huge (binomial). Number of alignments between strings is huge. DP reuses prefix answers so we pay roughly O(rows·cols) or O(|s|·|t|).

---

## 5. What problem existed before this?

Enumerate all paths / all alignments. Impossible past tiny sizes. Mathematicians used recurrence for combinations; CS made tables for paths and sequence alignment (Needleman–Wunsch is edit/LCS cousin).

---

## 6. What happens without it?

```text
Grid paths without DP: recurse right/down → exponential
LCS without DP: try all subsequences → exponential
```

Editors could not compute diffs; games could not score grid routes quickly.

---

## 7. How did people invent this?

Path counting on grids is old combinatorics. Sequence alignment in bioinformatics forced practical DP tables. Interview culture distilled Unique Paths, Min Path Sum, LCS, Edit Distance into must-know patterns.

---

## 8. Computer intuition

```text
GRID

dp[i][j] = answer for cell (i,j)
often:
  dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])


STRING LCS

  ""  b  a  b
"" 0  0  0  0
a  0  0  1  1
b  0  1  1  2
c  0  1  1  2

If s[i]==t[j]: dp[i][j] = dp[i-1][j-1]+1
else max(dp[i-1][j], dp[i][j-1])
```

CPU fills row by row; cache-friendly nested loops.

---

## 9. Mathematical intuition

Grid with only right/down: DAG of cells; DP = shortest/longest path on DAG in topo order.

LCS recurrence is optimal substructure on prefixes. Time O(nm); space O(nm) or O(min(n,m)) with rolling + careful reconstruction tradeoffs.

---

## 10. Step-by-step working

### Grid recipe

1. Define `dp[i][j]` (ways / min cost / max gold…).
2. Base: first row, first column (only one way to fill).
3. Obstacles: force `dp=0` or skip.
4. Transition from legal parents.
5. Answer at destination cell.

### String recipe

1. Decide one string or two.
2. State on prefix ends `(i,j)` meaning “using `s[0..i)` and `t[0..j)`”.
3. If characters equal → diagonal take.
4. Else → insert/delete/replace or skip options.
5. Base: empty prefixes.

---

## 11. Dry run

**Unique paths** 3×3 (2 right, 2 down needed from start for 3x3 grid — m=3,n=3 → 6 paths):

```text
1 1 1
1 2 3
1 3 6
```

**Edit distance** `"horse"` → `"ros"`:

Classic answer **3** (replace h→r, remove r, remove e — one standard path). Dry-run last cells mentally: DP table bottom-right = 3.

**LCS** `"abcde"` vs `"ace"` → `"ace"` length **3**.

---

## 12. Visualization

```text
GRID DEPENDENCY

(i-1,j)
   ↓
(i,j-1) → (i,j)


EDIT DISTANCE CHOICES when s[i]!=t[j]

replace: dp[i-1][j-1] + 1
delete:  dp[i-1][j] + 1
insert:  dp[i][j-1] + 1
take min


PALINDROMIC SUBSEQUENCE
LPS(s) = LCS(s, reverse(s))
```

---

## 13. Complexity

| Problem | Time | Space |
|---|---|---|
| Unique paths / min path | O(rc) | O(rc) → O(c) |
| LCS | O(nm) | O(nm) → O(min) |
| Edit distance | O(nm) | O(nm) → O(min) |
| Regex DP | O(nm) | O(nm) |
| Longest palindromic substring | O(n²) expand/DP | O(1)/O(n²) |

---

## 14. Why this complexity?

Each of O(rc) or O(nm) states does O(1) work (regex sometimes looks at pattern j with `*` rule still O(1) amortized per state).

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; ++i)
        for (int j = 1; j < n; ++j)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}

int minPathSum(vector<vector<int>>& g) {
    int r = g.size(), c = g[0].size();
    vector<vector<int>> dp(r, vector<int>(c));
    dp[0][0] = g[0][0];
    for (int j = 1; j < c; ++j) dp[0][j] = dp[0][j-1] + g[0][j];
    for (int i = 1; i < r; ++i) dp[i][0] = dp[i-1][0] + g[i][0];
    for (int i = 1; i < r; ++i)
        for (int j = 1; j < c; ++j)
            dp[i][j] = g[i][j] + min(dp[i-1][j], dp[i][j-1]);
    return dp[r-1][c-1];
}

int longestCommonSubsequence(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n+1, vector<int>(m+1, 0));
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return dp[n][m];
}

int minDistance(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n+1, vector<int>(m+1));
    for (int i = 0; i <= n; ++i) dp[i][0] = i;
    for (int j = 0; j <= m; ++j) dp[0][j] = j;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[n][m];
}
```

---

## 16. STL usage

- `vector<vector<int>>`
- rolling `vector<int> prev, cur`
- `min({a,b,c})` needs initializer list
- for huge grids, watch memory (`r*c` ints)

---

## 17. Brute Force

Recurse all grid paths; recurse all string alignments. Exponential.

---

## 18. Better

Memo on `(i,j)`.

---

## 19. Optimal

Bottom-up O(rc)/O(nm) with rolling rows when reconstruction not needed. Combinatorial formula for obstacle-free unique paths: C(m+n-2, m-1) — faster mathematically when no obstacles.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "LCS is longest common substring."
  Why it fails: substring requires contiguous.
  Correct: subsequence allows gaps; substring is different DP/sliding.

Wrong: "First row base is all zeros for min path."
  Why it fails: must accumulate the only path along the border.
  Correct: prefix sums on borders.

Wrong: "Edit distance only replace."
  Why it fails: need insert/delete too.
  Correct: three operations (+ equal case).

Wrong: "Indices off-by-one on empty prefix."
  Why it fails: classic bug in string DP.
  Correct: use dp sized (n+1)×(m+1) for empty prefixes.
```

---

## 21. Common mistakes

1. Forgetting obstacles.
2. Confusing subsequence vs substring.
3. Wrong base for edit distance.
4. Modulo on path counts.
5. Rolling row overwriting values still needed.
6. 1-index vs 0-index confusion in strings.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Unique paths with obstacles — complexity?”  
**Expected:** “O(rc) time/space (or O(c) space). Each cell once; blocked cells contribute 0 ways.”

### Amazon-style

**Interviewer:** “Warehouse grid distance with costs?”  
**Expected:** “Min path sum DP if only right/down. If four directions with weights, that becomes shortest path (Dijkstra), not simple grid DP.”

### Microsoft-style

**Interviewer:** “How does diff relate?”  
**Expected:** “LCS/edit distance style alignment; tools use optimized variants, but the interview core is the DP table on prefixes.”

### OpenAI-style

**Interviewer:** “Space-optimize LCS and still recover string?”  
**Expected:** “Rolling saves space but loses easy reconstruction; keep parent pointers or second pass / Hirschberg for linear space reconstruction (advanced mention).”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Maps / games | grid path costs |
| IDEs / docs | diff, merge |
| Bioinformatics cousin | alignment |
| NLP tooling | edit distance fuzzy match |
| OCR / spellcheck | edit distance |

---

## 24. Related concepts + pattern recognition cues

```text
IF matrix + only right/down (or limited dirs) + opt/count → grid DP
IF two strings + common / transform → LCS / edit
IF palindrome subsequence → LCS with reverse OR interval DP
IF pattern with * ? → regex-style DP
IF 4-way free movement with weights → graph shortest path
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Grid: cell from up/left (usually)
String: prefixes (i,j)
LCS ≠ substring
Edit: insert/delete/replace
Border bases matter
```

### Checklist

- [ ] Unique paths dry run
- [ ] Min path sum code
- [ ] LCS table dry run
- [ ] Edit distance code
- [ ] Explain Amazon 4-direction trap

### Practice plan

1. Unique Paths I/II, Min Path Sum  
2. LCS, Edit Distance  
3. Longest palindromic subsequence  
4. Interleaving string  
5. Wildcard / regex matching

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Grid dry runs + code paths |
| 3 | LCS + edit from memory |
| 7 | Timed medium string DP |
| 15 | Teach border bases |
| 30 | Retry failed grid/string DP |
| 90 | Microsoft diff explanation mock |

```text
Item: Grid DP + String DP
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Sticky-note board metaphor |
| L2 | Fill small LCS/grid tables |
| L3 | Code paths + LCS + edit |
| L4 | Rolling space + obstacle cases |
| L5 | Choose grid DP vs Dijkstra correctly |
