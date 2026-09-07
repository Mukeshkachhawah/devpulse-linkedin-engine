# Linked Lists — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

Explain to a wall / rubber duck:

1. Singly vs doubly + when doubly’s `prev` pays for itself  
2. Why arrays beat lists for most C++ app code (locality, index)  
3. Iterative reverse invariant  
4. Floyd detect + entrance (μ, λ sketch is enough)  
5. Palindrome list O(1) space pipeline  

## Block B — Dry Runs (4 min)

Do on paper:

### 1) Reverse

`1→2→3→4→∅` — show pointers after each iteration; final head.

### 2) Merge

`1→3→5` and `2→4→6` — dummy walk; final order.

### 3) Cycle entrance

Nodes `1→2→3→4→5→3...` — simulate meet, then entrance phase.

### 4) Remove Nth

List `1→2→3→4→5`, n=2 → expect `1→2→3→5`. Also n=5 (delete head).

### 5) Middle + palindrome

`1→2→2→1` — mark mid, reverse second half, compare.

## Block C — Code From Memory (3 min)

Pick **two** and type without looking:

```text
[ ] reverseList
[ ] mergeTwoLists
[ ] hasCycle / detectCycle
[ ] removeNthFromEnd
[ ] middleNode
[ ] isPalindrome (O(1) space)
```

If stuck > 60s, peek the lesson, close it, rewrite immediately.

## Interview Spitfire (30s each)

Answer as if Google / Amazon / Microsoft / OpenAI:

1. Recursive vs iterative reverse — trade-offs?  
2. Why meeting point is not always the entrance?  
3. Design LRU at high level (why doubly + hash)?  
4. When refuse linked lists in production C++?

## Reset Rule

Miss a dry run or code → mark topic **Needs Revision**, next due = Day 1 schedule.

## Link Back

- Lessons: `singly-doubly-linked-list.md`, `fast-slow-pointers.md`
- Pocket: `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
