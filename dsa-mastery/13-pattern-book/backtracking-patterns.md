# Backtracking Patterns

> **Goal:** Recognize "generate all / search configurations with constraints" and write a clean choose → explore → unchoose template.

---

## 1. When to Use

Use backtracking when:

1. You must **enumerate** combinations, permutations, subsets, or paths.  
2. Constraints prune the search tree early.  
3. Exact cover / placement puzzles (N-Queens, Sudoku).  
4. DP is not natural because you need the **actual configurations**, not just a count/optimal value (sometimes both exist).

**Kid idea:** Trying outfits. Put on a hat, see if the rest works; if not, take the hat off and try another.

---

## 2. Recognition Cues

| Cue | Pattern |
|---|---|
| "all subsets / combinations" | subset DFS with index |
| "all permutations" | swap or used[] |
| "palindrome partition" | slice + check |
| "word search in grid" | DFS mark/unmark |
| "N-Queens / Sudoku" | place + validity |
| "generate parentheses" | count open/close |
| "restore IP / split string" | limited cuts |
| "combination sum" | reuse or not reuse |
| "letter combinations phone" | digit map DFS |

**Smell test:** Exponential search space but n ≤ ~15–20 with pruning → backtracking.

---

## 3. Core Template

```text
void dfs(state):
    if goal reached: record answer; return
    for choice in options:
        if choice invalid: continue
        apply choice
        dfs(new state)
        undo choice   // unchoose
```

---

## 4. Template Skeletons (C++)

### A. Subsets

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int)> dfs = [&](int start) {
        ans.push_back(path);
        for (int i = start; i < (int)nums.size(); ++i) {
            path.push_back(nums[i]);
            dfs(i + 1);
            path.pop_back();
        }
    };
    dfs(0);
    return ans;
}
```

### B. Combinations (size k)

```cpp
vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int)> dfs = [&](int start) {
        if ((int)path.size() == k) { ans.push_back(path); return; }
        for (int i = start; i <= n; ++i) {
            path.push_back(i);
            dfs(i + 1);
            path.pop_back();
        }
    };
    dfs(1);
    return ans;
}
```

### C. Permutations

```cpp
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> path;
    vector<char> used(nums.size(), 0);
    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) { ans.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = 1; path.push_back(nums[i]);
            dfs();
            path.pop_back(); used[i] = 0;
        }
    };
    dfs();
    return ans;
}
```

### D. Combination Sum (reuse allowed)

```cpp
vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int,int)> dfs = [&](int start, int remain) {
        if (remain == 0) { ans.push_back(path); return; }
        for (int i = start; i < (int)candidates.size(); ++i) {
            if (candidates[i] > remain) break;
            path.push_back(candidates[i]);
            dfs(i, remain - candidates[i]); // i not i+1 → reuse
            path.pop_back();
        }
    };
    dfs(0, target);
    return ans;
}
```

### E. Grid Word Search

```cpp
bool exist(vector<vector<char>>& board, string word) {
    int m = board.size(), n = board[0].size();
    function<bool(int,int,int)> dfs = [&](int r, int c, int k) {
        if (k == (int)word.size()) return true;
        if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] != word[k]) return false;
        char tmp = board[r][c];
        board[r][c] = '#';
        bool ok = dfs(r+1,c,k+1) || dfs(r-1,c,k+1) || dfs(r,c+1,k+1) || dfs(r,c-1,k+1);
        board[r][c] = tmp;
        return ok;
    };
    for (int i = 0; i < m; ++i)
        for (int j = 0; j < n; ++j)
            if (dfs(i, j, 0)) return true;
    return false;
}
```

### F. Generate Parentheses

```cpp
vector<string> generateParenthesis(int n) {
    vector<string> ans;
    string path;
    function<void(int,int)> dfs = [&](int open, int close) {
        if ((int)path.size() == 2 * n) { ans.push_back(path); return; }
        if (open < n) { path.push_back('('); dfs(open + 1, close); path.pop_back(); }
        if (close < open) { path.push_back(')'); dfs(open, close + 1); path.pop_back(); }
    };
    dfs(0, 0);
    return ans;
}
```

### G. Skip Duplicates (Combination Sum II / Subsets II)

```cpp
// sort first; inside loop:
// if (i > start && nums[i] == nums[i-1]) continue;
```

---

## 5. Common Variants

| Variant | Index rule | Dedup rule |
|---|---|---|
| Subsets | start → i+1 | sort + skip equals |
| Combinations | start → i+1 | n/a |
| Permutations | used[] | skip used equals carefully |
| Comb sum reuse | dfs(i, ...) | sort + break |
| Comb sum once | dfs(i+1, ...) | sort + skip |
| Partition string | cut at i | palindrome check |
| N-Queens | row by row | cols/diags sets |

---

## 6. Traps

1. **Forgetting to unchoose** (`pop_back` / unmark).  
2. **Reuse vs not:** `dfs(i)` vs `dfs(i+1)`.  
3. **Duplicates without sorting/skip**.  
4. **Passing path by value** every time — slow; mutate + undo.  
5. **Pruning late** — prune before recurse.  
6. **Modifying board without restore**.  
7. **n too large** — need bitmask DP / meet in middle instead.  
8. **Infinite recursion** when start index doesn't advance.

---

## 7. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Nested loops for all subsets" | Only fixed depth | Recursion depth = n |
| "DP because count exists" | They ask for lists | Backtracking to build |
| "Don't undo; copy always" | Memory/time blowup | Undo in place |
| "Permutations = combinations" | Order matters vs not | used[] vs start index |
| "Try all without prune" | TLE | Constraint checks early |

---

## 8. Decision Mini-Tree

```text
Generate / place / search configs?
├─ Subsets / combos → start index DFS
├─ Order matters → permutations + used
├─ Can reuse numbers → dfs(i) not i+1
├─ Duplicates in input → sort + skip
├─ Grid path word → mark / unmark DFS
└─ Placement puzzle → place row/cell + validity sets
```

---

## 9. Example Problems

1. Subsets / Subsets II  
2. Permutations / Permutations II  
3. Combinations  
4. Combination Sum / II / III  
5. Letter Combinations of a Phone Number  
6. Generate Parentheses  
7. Word Search  
8. Palindrome Partitioning  
9. N-Queens  
10. Sudoku Solver  
11. Restore IP Addresses  
12. Beautiful Arrangement  
13. Expression Add Operators  
14. Partition to K Equal Sum Subsets  
15. Matchsticks to Square  

---

## 10. Complexity

Worst case exponential (e.g. O(2^n) subsets, O(n!) permutations).  
State pruning + early cuts make interviews pass.

---

## 11. Interview Script

> "I'll explore choices recursively. After choosing a candidate I recurse; then I undo that choice so the next sibling sees a clean state. I'll prune when the remaining budget is negative."

---

## Revision Checklist

- [ ] Choose / explore / undo reflex  
- [ ] Subsets vs permute vs comb sum templates  
- [ ] Dedup with sort + skip  
- [ ] Grid mark/unmark  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 1 subsets + 1 permute + 1 puzzle weekly.
