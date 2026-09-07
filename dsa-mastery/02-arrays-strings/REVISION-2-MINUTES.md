# Arrays & Strings — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. What is an array? Why O(1) index access?
2. Substring vs subsequence — one example each.
3. Why do two pointers beat O(n²) pairs?
4. Fixed vs variable sliding window — one sentence each.
5. Prefix sum formula for inclusive `l..r`.
6. Difference array: how to add `v` on `[l,r]`.
7. Rotate square matrix 90° clockwise in two steps.

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Contiguous longest/shortest with property  → sliding window
Sorted pair / palindrome / in-place filter → two pointers
Subarray sum = K (any signs)               → prefix + hash
Many range adds, then final array          → diff array
Many static range sums                     → prefix
g[r][c] walk onion / borders               → spiral
Globally row-major sorted matrix search    → binary on 1D index
```

Traps to name:

```text
Window + negatives for sum targets
pref off-by-one (size n+1, pref[0]=0)
pass vector by value by accident
spiral single row double-count
first index is ROW not column
```

## Quick Dry-Run (optional if time)

`[1,2,4,7,11]` target 9 with opposite pointers — say each move.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 defs + cues | Solid — do a problem |
| Missed 1–2 | Skim that lesson section 20 |
| Missed 3+ | Re-read flash pictures; schedule Day 1 reset |

## Next

Open `REVISION-10-MINUTES.md` on Day 7/15 style deep recall days.
