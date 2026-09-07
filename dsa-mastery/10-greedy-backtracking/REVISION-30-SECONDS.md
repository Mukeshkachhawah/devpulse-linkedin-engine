# Greedy & Backtracking — 30-Second Revision

Close the lessons. Answer out loud.

## Greedy

- Local best, never undo — only when **greedy choice + optimal substructure** hold.
- Prove with **exchange** or kill with **counterexample**.
- Activity: sort by **earliest end**.
- Jump reachability: track **farthest**.
- Fractional knapsack density OK; **0/1 density greedy NOT always OK**.

## Backtracking

- Template: **choose → explore → unchoose**.
- DFS on decision tree + **prune**.
- Worst case exponential — say it; pruning helps practice.
- `push_back` / `pop_back` (or mark/unmark).

## Subsets / Perms / Combs

- Order matters? → **perms** else subsets/combs.
- Combinations: **start index** (increasing).
- Perms: **used[]**.
- Reuse same index? `dfs(i)` vs `dfs(i+1)`.
- Duplicates: **sort + skip** sibling equals.

## Pass rule

Hesitate on any bullet → reopen that lesson’s Wrong Thinking today.
