# Linked Lists — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. What is a singly vs doubly linked list?
2. Why insert-at-head is O(1) but access-by-index is O(n)?
3. Why use a dummy node?
4. State the three pointers for iterative reverse.
5. Tortoise–hare: what does a meeting prove?
6. How do you find the cycle entrance after a meeting?
7. How do two pointers remove the Nth node from end?

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Rewire / reverse / merge sorted lists     → pointer surgery + dummy
Find middle without counting length       → fast–slow
Detect cycle / cycle start                → Floyd
Palindrome in O(1) space                  → mid + reverse half
Nth from end one pass                     → lead gap + dummy
Need random access / cache locality       → prefer vector
LRU O(1) move-to-front                    → hashmap + doubly list
```

Traps to name:

```text
Lost head after delete/insert
Null deref on fast->next->next
Off-by-one on remove Nth
Meeting point mistaken for entrance
Recursive reverse hidden O(n) stack
```

## Quick Dry-Run (optional if time)

Reverse `1→2→3` saying prev/cur/nxt each step.  
Or: cycle entrance sketch on a 5-node ring starting at node 3.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 defs + cues | Solid — do a problem |
| Missed 1–2 | Skim that lesson section 20 |
| Missed 3+ | Re-read flash pictures; Day 1 reset |

## Next

Open `REVISION-10-MINUTES.md` on Day 7/15 style deep recall days.
