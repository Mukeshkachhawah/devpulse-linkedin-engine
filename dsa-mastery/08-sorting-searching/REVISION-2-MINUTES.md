# Sorting & Searching — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. Stable sort — meaning + one example.
2. Merge vs quick — one strength each.
3. Why comparison sorts are Ω(n log n) worst-case (intuition)?
4. Binary search on answer — what must be true about `ok(x)`?
5. Template for minimize x with `ok(x)`.
6. After partition, what is guaranteed?
7. Kth largest → which index for quickselect?

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Need ties keep order                 → stable_sort / merge
Just sort fast                       → std::sort
Min capacity / min max load          → BS on answer
Find first ≥ x in sorted             → lower_bound
Only need Kth element                → quickselect / nth_element
Stream top-k                         → heap size k
Array of only 0/1/2                  → Dutch flag
```

Traps to name:

```text
Comparator must be strict weak ordering
Ceil division: (p + speed - 1) / speed
Ship packages lo ≥ max weight
Randomize pivot for select/sort practice
```

## Quick Dry-Run (optional if time)

`ok` for capacities: N N N Y Y Y — which template lands on first Y?

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 defs + cues | Solid — do a problem |
| Missed 1–2 | Skim that lesson section 20 |
| Missed 3+ | Re-read flash pictures; schedule Day 1 reset |

## Next

Open `REVISION-10-MINUTES.md` on Day 7/15 style deep recall days.
