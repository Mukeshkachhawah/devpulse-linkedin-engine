# Greedy & Backtracking — 2-Minute Revision

Timer: 2 minutes. No notes first. Then check.

## Minute 1 — Explain

**Greedy (20s)**  
“Pick the best safe local choice when an exchange argument says some optimal solution agrees. Example: earliest-ending interval.”

**Backtracking (20s)**  
“Build partial answers, recurse, undo on failure. Prune illegal branches. N-Queens / sudoku / word search.”

**SPC (20s)**  
“Subsets yes/no; combinations start-index; permutations used-array. Sort+skip for duplicates; dfs(i) if reuse allowed.”

## Minute 2 — Rapid fire

1. Is sorting by longest interval best for max non-overlap count? → No, earliest end.  
2. Does 0/1 knapsack always work by value/weight greedy? → No.  
3. Must every choose have an unchoose? → Yes.  
4. Combinations of [1,2,3] k=2 include [2,1]? → No (as distinct from [1,2]).  
5. Permutations II needs sort+skip? → Yes typically.  
6. Combination Sum (unlimited) calls `dfs(i)` or `dfs(i+1)`? → `dfs(i)`.  
7. Is backtracking always better than DP? → No; different jobs.  
8. n=25 full subsets always fine in interviews/prod? → Often too big; discuss constraints.

## Mini dry-runs

**Activities:** take earliest ends → count.  
**Subsets [1,2]:** `[] [1] [2] [1,2]`.  
**CombSum [2,3,6,7] target 7:** `[2,2,3]`, `[7]`.

## If failed ≥2

Day-1 reset on that subtopic (greedy proof vs BT template vs SPC table).
