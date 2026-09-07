# Sorting & Searching — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

Explain to a wall / rubber duck:

1. Merge sort flow + stability + complexity
2. Quicksort partition + worst case + introsort mention
3. Binary search on answer monotonicity proof sketch
4. Ship packages / Koko checker idea
5. Quickselect vs heap for Kth
6. Dutch national flag pointers

## Block B — Dry Runs (4 min)

### 1) Merge

Sort `[3,1,4,2]` showing splits and merges.

### 2) Partition

Lomuto on `[7,2,9,4,3]` pivot last.

### 3) On answer

Piles `[3,6,7,11]`, h=8 — argue why speed 4 works / 3 fails (Koko).

### 4) Lower bound

First index of 5 in `[1,2,4,5,5,7]`.

### 5) Select

`[3,2,1,5,6,4]` 2nd largest — target index and answer.

## Block C — Code From Memory (3 min)

Pick **two**:

```text
[ ] merge sort (or merge function)
[ ] lower_bound loop
[ ] shipWithinDays / koko style ok + while
[ ] quickselect iterative
[ ] dutchFlag
```

If stuck > 60s, peek, close, rewrite immediately.

## Interview Spitfire (30s each)

Google / Amazon / Microsoft / OpenAI style:

1. When `stable_sort` over `sort`?
2. Prove ship-packages monotonicity in one breath.
3. Quickselect worst case — mitigations?
4. Why `mid = lo + (hi-lo)/2`?

## Reset Rule

Miss a dry run or code → mark topic **Needs Revision**, next due = Day 1 schedule.

## Link Back

- Lessons: `sorting-algorithms.md`, `binary-search-on-answer.md`, `quickselect-and-partition.md`
- Pocket: `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
