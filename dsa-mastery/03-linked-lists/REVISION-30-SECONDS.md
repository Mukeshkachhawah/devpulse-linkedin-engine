# Linked Lists — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
List = conga line (pointers = hands)
Singly = forward only
Doubly = both ways
Dummy head = edge-case shield
Reverse = prev / cur / nxt
Fast–slow = tortoise 1, hare 2
Meet ⇒ cycle; head+meet ⇒ entrance
Fast done ⇒ slow ≈ middle
```

## One-Liners

| Topic | One line |
|---|---|
| Access index i | O(n) walk |
| Insert after known node | O(1) rewire |
| Reverse | Three pointers, iterative O(1) space |
| Merge two sorted | Dummy + compare heads |
| Cycle | Floyd meet |
| Cycle start | Reset one to head, speed 1 |
| Nth from end | Gap + dummy |

## Complexity Snap

```text
Traverse / reverse / middle     O(n) time, O(1) extra
Cycle detect (Floyd)            O(n) time, O(1) extra
Cycle detect (hash)             O(n) time, O(n) space
Array random access             O(1) — lists lose here
```

## Trap of the Day

```text
Save next BEFORE overwrite
while (fast && fast->next) — both checks
Meeting ≠ entrance
Delete head → use dummy
```

## Pass / Fail

If flash card fails → reopen `singly-doubly-linked-list.md` or `fast-slow-pointers.md` for 5 minutes, retry.
