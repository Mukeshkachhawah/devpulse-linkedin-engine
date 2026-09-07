# Stacks & Queues — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. LIFO vs FIFO — one real example each.  
2. Why bracket matching needs a stack, not only a counter?  
3. Why BFS uses a queue?  
4. Why store indices in a monotonic stack?  
5. Amortized O(n) for NGE — say why.  
6. RPN evaluation rule in one sentence.  
7. Why `vector.erase(begin)` is a bad queue?

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Nesting / matching / undo                 → stack
Level order / unweighted shortest ideas → queue
Next greater / warmer / stock span        → mono stack
Sliding window max/min                    → mono deque
Infix with * /                            → calc stack
Postfix tokens                           → RPN
Both-end ops                              → deque
```

Traps:

```text
STL pop void
Level loop without size snapshot
Circular NGE without 2n
Histogram width off-by-one
Division truncation
```

## Quick Dry-Run

`[2,1,2,4]` next greater right — say answers.  
Or RPN `2 1 + 3 *`.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 | Solid — solve a problem |
| Miss 1–2 | Skim §20 of that lesson |
| Miss 3+ | Day 1 reset on flash pictures |

## Next

`REVISION-10-MINUTES.md` on deep recall days.
