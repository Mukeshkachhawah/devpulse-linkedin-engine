# Sorting & Searching — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Merge = pizza split + zipper (stable, O(n) mem, always n log n)
Quick = pivot partition (fast avg; worst n²)
std::sort default; stable_sort for ties
Binary search = half sorted array
On answer = half answer space with monotone ok(x)
Quickselect = partition + only one side → Kth avg O(n)
Dutch flag = 0/1/2 three pointers
```

## One-Liners

| Topic | One line |
|---|---|
| Sorting | Comparison lower bound Ω(n log n); pick stable vs speed |
| BS array | lower_bound style: if a[mid] &lt; t lo=mid+1 else hi=mid |
| BS answer | Minimize: ok → hi=mid else lo=mid+1 |
| Quickselect | Pivot final index decides left/right |
| Kth largest | Target index `n-k` (0-based) |

## Complexity Snap

```text
Merge / heap sort                 O(n log n)
Quicksort / select average        O(n log n) / O(n)
Quick worst                       O(n²)
Binary search                     O(log n)
On answer                         O(check · log R)
Heap Kth                          O(n log k)
```

## Trap of the Day

```text
std::sort is NOT stable
Binary search on non-monotone ok → wrong
lo=mid without biased mid → infinite loop risk
Dutch flag: after swap with hi, do NOT blind mid++
Quickselect ≠ full sort after one partition
```

## Pass / Fail

If you cannot say the flash card without peeking → reopen the weak lesson for 5 minutes, then retry.
