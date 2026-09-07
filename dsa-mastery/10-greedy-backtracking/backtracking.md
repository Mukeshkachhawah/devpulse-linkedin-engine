# Backtracking

**Module:** 10-greedy-backtracking  
**Level target:** L5  
**Prerequisite:** recursion, call stack, sets/arrays, complexity of 2ⁿ/n!  
**Memory picture:** A maze with a ball of yarn — walk forward choosing a path; if stuck, wind the yarn back (undo) and try the next door.

---

## 1. What is it?

**Backtracking** is systematic search that builds a solution **piece by piece**, and **undoes** the last choice when it hits a dead end, trying the next option.

It is DFS through the tree of decisions, with pruning.

New words:

- **Partial solution** — choices made so far (path in the decision tree).
- **Undo / revert** — remove the last choice before trying another.
- **Pruning** — stop exploring a branch early when it cannot win/be valid.
- **State space tree** — all possible choice sequences as a tree.
- **Feasible** — respects constraints so far.

Related family: N-Queens, sudoku, word search, combination sum, subsets/permutations (next lesson deep dive).

---

## 2. Explain like I am 10

You fill a crossword. Pencil a letter. If later squares break, erase that letter and try another.

Backtracking = try → check → erase → try next.

---

## 3. Real life story

**N-Queens:** place queens so none attack. Put a queen in row 0, try columns; if row 3 fails, remove row 2’s queen and move it.

```text
Place → deeper place → stuck
                ↓ undo
           try next column
```

Companies use backtracking for constraint solvers, test generation, puzzle features, and compilers’ searchy passes (conceptually).

---

## 4. Why does this exist?

Many problems need **all solutions** or **any valid configuration** under constraints where greedy fails and DP state would be enormous. Backtracking explores only what constraints allow, with undo for clean state.

---

## 5. What problem existed before this?

Generate-all-then-filter (wasteful), or messy nested loops for fixed n. Recursion with undo became the clean pattern.

---

## 6. What happens without it?

```text
No undo:
  shared board stays dirty
  false "no solution"

No prune:
  full n! / 2^n
  TLE
```

---

## 7. How did people invent this?

Depth-first search with failure-driven retreat is old AI/constraint literature. N-Queens is the cultural mascot. Interview prep standardized the template: `choose → explore → unchoose`.

---

## 8. Computer intuition

```text
CALL STACK = yarn path

dfs(row):
  if row==n: record solution; return
  for col in 0..n-1:
    if safe(row,col):
      place(row,col)      // choose
      dfs(row+1)          // explore
      remove(row,col)     // unchoose
```

Memory: recursion depth = number of decisions placed; also the board/path arrays.

---

## 9. Mathematical intuition

Worst-case exponential: O(n!) permutations, O(2ⁿ) subsets, O(9^{empty}) sudoku-ish.

Pruning changes practical time a lot but rarely changes worst-case class — say both in interviews.

Correctness: exhaustive search of feasible branches ⇒ finds all/any solutions if they exist.

---

## 10. Step-by-step working

### Universal template

1. **Define a partial state** (path, board, remaining target…).  
2. **Goal check** — if complete, record/return success.  
3. **Iterate choices** for the next decision.  
4. **Constraint check** — skip illegal.  
5. **Choose** mutate state.  
6. **Explore** recurse.  
7. **Unchoose** mutate back.  
8. Optional: prune with bounds (best so far).

### Design questions

- What is one decision unit (index, cell, row)?  
- What do I store in `path`?  
- What makes a choice illegal?  
- Do I need all solutions or one?  
- Index start parameter to avoid duplicate combos?

---

## 11. Dry run

**N-Queens n=4** (one solution sketch):

```text
Row0: try col1
Row1: cannot some; place col3
Row2: place col0
Row3: place col2 → solution
Board queens at (0,1),(1,3),(2,0),(3,2)
```

If row3 fails for a branch, undo row2, try next, etc.

**Combination sum** candidates `[2,3,6,7]` target 7:

```text
2→2→3 success
2→2→2→... fail / prune
3→...
7→ success
```

---

## 12. Visualization

```text
STATE SPACE (subsets of [1,2,3]) — preview

            []
     /      |      \
   [1]     [2]     [3]
   / \      |
[1,2][1,3] [2,3]
  |
[1,2,3]

At each node: choose include/exclude or loop with index


UNDO PICTURE

board before: . Q .
place:        . Q Q  (illegal)
undo:         . Q .
try next
```

---

## 13. Complexity

| Problem | Worst time | Space |
|---|---|---|
| Subsets | O(2ⁿ · n) copy | O(n) |
| Permutations | O(n! · n) | O(n) |
| N-Queens | ~n! pruned | O(n) |
| Sudoku | high exponential | O(1)/O(board) |
| Word search | O(m·n·4^{L}) | O(L) |

Always mention output size can dominate (must write all solutions).

---

## 14. Why this complexity?

Branching factor × depth; each solution may cost O(n) to copy into answer list. Pruning removes branches but asymptotics stay exponential unless structure collapses.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

class NQueens {
    int n;
    vector<vector<string>> ans;
    vector<string> board;
    vector<char> col, diag1, diag2;

    void dfs(int r) {
        if (r == n) { ans.push_back(board); return; }
        for (int c = 0; c < n; ++c) {
            if (col[c] || diag1[r-c+n] || diag2[r+c]) continue;
            board[r][c] = 'Q';
            col[c]=diag1[r-c+n]=diag2[r+c]=1;
            dfs(r + 1);
            board[r][c] = '.';
            col[c]=diag1[r-c+n]=diag2[r+c]=0;
        }
    }
public:
    vector<vector<string>> solveNQueens(int n_) {
        n = n_;
        board.assign(n, string(n, '.'));
        col.assign(n, 0);
        diag1.assign(2*n, 0);
        diag2.assign(2*n, 0);
        dfs(0);
        return ans;
    }
};

bool existWord(vector<vector<char>>& g, string word) {
    int R=g.size(), C=g[0].size();
    function<bool(int,int,int)> dfs = [&](int i, int j, int k) -> bool {
        if (k == (int)word.size()) return true;
        if (i<0||j<0||i>=R||j>=C||g[i][j]!=word[k]) return false;
        char tmp = g[i][j];
        g[i][j] = '#'; // choose
        bool ok = dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);
        g[i][j] = tmp;  // undo
        return ok;
    };
    for (int i=0;i<R;++i)
        for (int j=0;j<C;++j)
            if (dfs(i,j,0)) return true;
    return false;
}
```

---

## 16. STL usage

- `vector` path + `push_back`/`pop_back` (best undo)  
- `string` boards  
- `function<>` lambda DFS (or private methods)  
- avoid copying whole path every call — pass by ref + pop  

---

## 17. Brute Force

Generate every tuple in nested loops / recursion without pruning. Same family, worse constants.

---

## 18. Better

Add constraint checks before recurse; use arrays for O(1) attack tests (queens); bitmask for columns; start index to kill duplicates.

---

## 19. Optimal

“Optimal” here means: correct exhaustive search with strong pruning + careful duplicate control + pass-by-reference undo. Still exponential — be honest.

Sometimes rewrite as BFS/IDDFS or dancing-links for exact cover — advanced.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "I recurse but forget to undo."
  Why it fails: polluted state; missed solutions.
  Correct: every choose has matching unchoose.

Wrong: "Backtracking is always slower than DP."
  Why it fails: different goals; DP needs numeric state structure.
  Correct: use DP when overlapping optima; backtracking for configurations.

Wrong: "Found one solution but still explore all."
  Why it fails: TLE when only existence needed.
  Correct: return bool early when one enough.

Wrong: "Copy path by value every call instead of undo."
  Why it fails: heavy time/memory.
  Correct: reference + pop_back.
```

---

## 21. Common mistakes

1. Missing undo.  
2. Modifying loop index incorrectly.  
3. Duplicate solutions (combinations vs permutations).  
4. Not marking visited in grid search.  
5. Returning after first push without continuing when all solutions needed.  
6. Huge output without reserving / efficient building.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Complexity of N-Queens?”  
**Expected:**  
“Worst-case explores like n! placements with pruning; space O(n) for recursion and queen positions. I mention pruning via columns/diagonals sets.”

### Amazon-style

**Interviewer:** “Sudoku solver in production for millions of boards?”  
**Expected:**  
“Backtracking is fine for 9×9; for massive constraint systems use specialized solvers. Discuss average pruning, not only worst-case.”

### Microsoft-style

**Interviewer:** “Show choose-explore-unchoose on word search.”  
**Expected:**  
“Mark cell visited, recurse 4 dirs, unmark. Fail paths restore grid.”

### OpenAI-style

**Interviewer:** “When convert backtracking to DP?”  
**Expected:**  
“When we optimize a count/max over overlapping subproblems with compact state — e.g. count ways becomes DP; listing all subsets stays backtracking.”

---

## 23. Company use cases

| Domain | Backtracking |
|---|---|
| Productivity apps | calendar constraint fit (small) |
| Games | puzzle generation/solving |
| IDEs | refactor search / template completion (simplified) |
| Security tooling | path exploration under rules |
| Compilers | pattern matching search |

---

## 24. Related concepts + pattern recognition cues

```text
IF build configuration with constraints + undo → backtracking
IF n≤20 and all subsets/perms → backtracking (or bitmask DP if opt value)
IF overlapping numeric opt → prefer DP
IF local choice proven → greedy
IF grid path word → DFS backtracking
```

Related: recursion, DFS, constraint satisfaction, next lesson subsets/perms/combs.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
choose → explore → unchoose
Prune early; undo always
Exponential worst case — say it
push_back/pop_back is the friend
```

### Checklist

- [ ] Template from memory  
- [ ] N-Queens with diag arrays  
- [ ] Word search mark/unmark  
- [ ] Early exit vs collect all  
- [ ] Complexity with output factor  

### Practice plan

1. N-Queens I/II  
2. Sudoku solver  
3. Word search  
4. Combination sum I/II  
5. Palindrome partition  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Template + N-Queens |
| 3 | Word search + sudoku |
| 7 | Two mediums timed |
| 15 | Teach undo with drawing |
| 30 | Retry failed BT |
| 90 | Google complexity mock |

```text
Item: Backtracking
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Yarn/maze metaphor |
| L2 | Dry-run small N-Queens |
| L3 | Code queens + word search |
| L4 | Prune + duplicate control |
| L5 | Choose BT vs DP vs greedy cleanly |
