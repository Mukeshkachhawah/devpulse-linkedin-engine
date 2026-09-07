# Dynamic Programming — 30-Second Revision

Close the lessons. Answer out loud.

## Framework

- DP = define **state** + **reuse** overlapping answers.
- Time ≈ (#states) × (work per transition).
- Say English: `dp[...] = ...` before coding.
- Top-down memo ≡ bottom-up table (same math).

## 1D

- Robber: `dp[i]=max(dp[i-1], dp[i-2]+a[i])`, often O(1) space.
- Ways / stairs: Fibonacci-like.
- Coin amount: `dp[x]=min(dp[x-c]+1)`; watch loop order for counting.

## Knapsack

- 0/1: capacity loop **descending**.
- Unbounded: capacity **ascending**.
- Subset sum / partition = 0/1 bool (or bitset).
- O(nW) is **pseudo-polynomial** — huge W fails.

## Grid / String

- Grid: cell from up/left (usually); fix border bases.
- LCS: equal → diagonal+1; else max(up,left).
- Edit: insert / delete / replace; empty-prefix bases.
- LCS ≠ longest common **substring**.

## Interval / Bitmask

- Interval: `dp[l][r]`, grow by length, try split `k` → often O(n³).
- Bitmask: `n≤20`, `dp[mask]` / `dp[mask][v]`.
- 2^50 is not “optimizable.”

## Trees / Graphs

- Tree: postorder combine children; take/skip common.
- DAG: topo then DP on edges.
- Longest path on cyclic graphs ≠ simple linear DP.

## Pass rule

If you hesitate on any bullet, open that lesson’s Wrong Thinking + Complexity today — do not mark Solid.
