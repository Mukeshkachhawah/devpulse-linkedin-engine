# Dynamic Programming — 2-Minute Revision

Timer: 2 minutes. No notes first. Then check.

## Minute 1 — Explain

**Framework (15s)**  
“Store answers to overlapping subproblems. Invent state, transition, base; time is states times work.”

**1D + Knapsack (20s)**  
“Along an index: robber/ways/coins. Items + capacity: 0/1 descends, unbounded ascends.”

**Grid/String (15s)**  
“Matrix cells from neighbors; string prefixes (i,j) for LCS/edit.”

**Hard families (10s)**  
“Segments → interval O(n³). Tiny n subsets → bitmask. Trees → child combine; DAGs → topo.”

## Minute 2 — Rapid fire

Answer yes/no + one line why:

1. Is greedy by value/weight always correct for 0/1 knapsack? → No.
2. Does ascending `w` loop make 0/1 become unbounded-style reuse? → Yes.
3. Is LCS the same as longest common substring? → No.
4. Is interval DP usually O(n²) time because the table is n×n? → No, often O(n³).
5. Can bitmask TSP handle n=40? → No.
6. Does tree robber use array-robber index formula? → No, take/skip on children.
7. Is memoization “not real DP”? → No, it is top-down DP.
8. For unique paths without obstacles, is combinatorics sometimes enough? → Yes, C(m+n-2, m-1).

## Mini dry-runs (say them)

**Robber [2,7,9,3,1]:** best ends at 12.

**Subset sum to 5 with [1,2,3]:** reachable.

**LCS "abc","ace":** length 2? Wait — "ac"/"ace" → **"ace" vs "abc"** LCS length **2** (`ac`). (If you said 3, you mixed the pair `"abcde"`/`"ace"`.)

**Climb n=4 ways:** 5.

## If you failed ≥2 rapid-fire

Reset weak family to Day-1 spaced repetition. Re-read Wrong Thinking in that lesson.
