# Arrays & Strings — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

Explain to a wall / rubber duck:

1. Array memory picture + why middle insert is O(n)
2. Two pointer shapes: opposite ends vs slow/fast
3. Sliding window amortized O(n) (enter once, leave once)
4. Prefix vs difference (integral vs derivative intuition)
5. Matrix rotate recipe + when staircase search applies

## Block B — Dry Runs (4 min)

Do on paper:

### 1) Reverse / remove duplicates style

`a = [0,0,1,1,1,2,2,3]` → slow/fast unique length and final prefix values.

### 2) Window

`s = "pwwkew"` → longest substring without repeat. Track `left` each step.

### 3) Prefix + hash

`a = [1,2,3]`, `k=3` → count subarrays (expect 2: `[1,2]` and `[3]`).

### 4) Diff

n=5, updates `(l,r,v)= (1,3,+2), (0,0,+1)` → final array after prefix of diff.

### 5) Matrix

3×3 rotate 90 once; spiral order of original before rotate.

## Block C — Code From Memory (3 min)

Pick **two** and type without looking:

```text
[ ] max sum of size k (fixed window)
[ ] longest unique substring
[ ] subarray sum equals k (prefix hash)
[ ] two sum on sorted array (pointers)
[ ] rotate matrix 90
[ ] spiral order
```

If stuck > 60s, peek the lesson, close it, rewrite immediately.

## Interview Spitfire (30s each)

Answer as if Google / Amazon / Microsoft / OpenAI:

1. When is sliding window wrong for subarray sum?
2. Why move the shorter line in Container With Most Water?
3. `sum(l..r)` with prefix — write formula
4. LC74 vs LC240 matrix search — difference?

## Reset Rule

Miss a dry run or code → mark topic **Needs Revision**, next due = Day 1 schedule.

## Link Back

- Lessons: `arrays.md`, `strings.md`, `two-pointers.md`, `sliding-window.md`, `prefix-sum-difference-array.md`, `matrix-problems.md`
- Pocket: `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
