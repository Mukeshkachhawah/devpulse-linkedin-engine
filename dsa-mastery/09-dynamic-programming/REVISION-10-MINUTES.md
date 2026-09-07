# Dynamic Programming — 10-Minute Revision

Use before mocks or after a multi-day gap.

## 0:00–2:00 — Closed-book summary

Write without looking:

1. DP 8-step checklist (state → transition → base → S×T…)  
2. 0/1 vs unbounded loop direction  
3. LCS transition + edit three ops  
4. Interval length order + bitmask n limit  
5. Tree take/skip equations  

Check `REVISION-30-SECONDS.md`. Fix gaps now.

## 2:00–5:00 — Dry runs on paper

### A) Robber

`[2,7,9,3,1]` → show `prev2/prev1` updates → **12**.

### B) 0/1 knapsack

Items `(1,1),(2,3),(3,4)`, W=3 → answer **4**; note descending updates.

### C) LCS table

`s="ab"`, `t="bab"` — fill (n+1)×(m+1) → LCS length **2**.

### D) Bitmask sense-check

n=3, how many masks? **8**. Why TSP dp size ~ `8×3`.

## 5:00–8:00 — Code from memory (C++)

1. House robber O(1) space  
2. 0/1 knapsack rolling  
3. LCS length  
4. Tree robber `{take,skip}` DFS **or** climb stairs BU  

If stuck >90s, peek one section, then rewrite closed-book.

## 8:00–10:00 — Interview voice

**Google:** “How do you know DP applies? Define state for robber.”  
**Amazon:** “Knapsack W=1e9 — what do you say?”  
**Microsoft:** “Convert LCS memo to bottom-up.”  
**OpenAI:** “Interval vs bitmask — how do you choose?”

| Score | Meaning |
|---|---|
| 4/4 clear | L4–L5 day for DP module |
| 2–3 clear | Revise weak lesson Wrong Thinking + Complexity |
| 0–1 clear | Re-study framework + that family; no skipping ahead |

## Exit checklist

- [ ] Said S×T for every approach  
- [ ] Mentioned loop direction for knapsack unprompted  
- [ ] Distinguished LCS vs substring  
- [ ] Stated bitmask n limit  

## Spaced repetition bump

All pass → keep +1/+3/+7/+15/+30/+90.  
Else → **Next = tomorrow** for failed family only.
