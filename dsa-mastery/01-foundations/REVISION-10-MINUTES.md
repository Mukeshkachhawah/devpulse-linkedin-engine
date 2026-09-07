# Foundations — 10-Minute Revision

Use this before mocks or after a gap of several days.

## 0:00–2:00 — Closed-book summary

Write (or speak) without looking:

1. Definition of Big-O + growth order list  
2. Base case vs recursive case + why stack space matters  
3. Euclid steps + why prime trial stops at √n + modPow idea  

Check against `REVISION-30-SECONDS.md`. Fix gaps immediately.

## 2:00–5:00 — Dry runs on paper

### A) Complexity count

```text
for i in 0..n-1:
    for j in i..n-1:
        work
```

Sum lengths: `n + (n-1) + ... + 1 = n(n+1)/2` → **O(n²)**.

### B) Recursion unwind

`sum([5,2,9])` with index recursion — write stack then return values → **16**.

### C) Euclid + mid

- GCD(84, 30) by hand  
- Rewrite bad mid `(lo+hi)/2` → `lo+(hi-lo)/2` and say why

## 5:00–8:00 — Code from memory (C++)

Type in an empty file (no autocomplete if you can):

1. `findMax` — O(n) time, O(1) space  
2. `gcd` iterative  
3. `modPow(base, exp, mod)`  
4. Recursive `binSearch` **or** iterative — both ideal  

Compile if possible. If stuck >90s on one function, peek only that section, then rewrite closed-book.

## 8:00–10:00 — Interview voice

Answer each in 3–5 sentences:

**Google:** “Prove your hash two-sum is O(n) average and state space.”  
**Amazon:** “n=5e6 — why reject O(n²)? What tradeoff if memory is tight?”  
**Microsoft:** “Convert recursive binary search to iterative.”  
**OpenAI:** “When prefer recursion vs bottom-up iteration?”

Score yourself:

| Score | Meaning |
|---|---|
| 4/4 clear | L4 for foundations today |
| 2–3 clear | Revise weak lesson Wrong Thinking + Complexity |
| 0–1 clear | Re-study full lessons; do not jump to arrays yet |

## Exit checklist

- [ ] Said time **and** space for every approach  
- [ ] Mentioned stack in recursion space  
- [ ] Mentioned overflow once unprompted  
- [ ] Knew average vs worst for hashing  

## Spaced repetition bump

If all boxes pass, keep your +1/+3/+7/+15/+30/+90 schedule.  
If not, set **Next = tomorrow** for the failed topic only.
