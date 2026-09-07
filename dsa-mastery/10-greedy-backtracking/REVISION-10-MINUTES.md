# Greedy & Backtracking — 10-Minute Revision

## 0:00–2:00 — Closed-book summary

1. Greedy choice property + exchange sketch for activity selection  
2. Backtracking template + N-Queens safety idea  
3. Decision table: subset / comb / perm + reuse + duplicates  

Check `REVISION-30-SECONDS.md`.

## 2:00–5:00 — Dry runs

### A) Activity selection

Six intervals from the greedy lesson — produce count **3**.

### B) Undo

Word search one failing path — say mark `#` then restore letter.

### C) Duplicate perms

`[1,1,2]` → exactly three unique perms; state skip rule.

### D) CombSum2 vs CombSum

One-use vs reuse — one sentence each.

## 5:00–8:00 — Code from memory

1. Activity selection (sort by end) **or** `canJump`  
2. Subsets DFS  
3. `permuteUnique` **or** `combinationSum`  
4. Optional: N-Queens `dfs(row)` skeleton  

## 8:00–10:00 — Interview voice

**Google:** Prove earliest-end activity selection.  
**Amazon:** n=25 feature subsets — what do you say?  
**Microsoft:** choose-explore-unchoose on word search.  
**OpenAI:** When BT vs DP vs greedy?

| Score | Meaning |
|---|---|
| 4/4 | Strong L4 day |
| 2–3 | Revise weak Wrong Thinking |
| 0–1 | Full lessons again before advanced module |

## Exit checklist

- [ ] Named the greedy **key**  
- [ ] Said undo explicitly  
- [ ] Distinguished `dfs(i)` / `dfs(i+1)`  
- [ ] Mentioned exponential honestly  

## Spaced repetition bump

Pass → keep schedule. Fail → next review tomorrow for that bullet family.
