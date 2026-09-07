# Binary Search Patterns

> **Goal:** Spot monotonic answers and code the correct `lo/hi` / `lower_bound` form without off-by-one panic.

---

## 1. When to Use

Use binary search when:

1. The search space is **sorted** or the **answer** is monotonic (false…false…true…true).  
2. You can write a function `ok(x)` that is eventually always true (or always false).  
3. You need first/last occurrence, insert position, or minimize/maximize a capacity.

**Kid idea:** Guess a number 1..100. Each "too high / too low" cuts the range in half.

**Answer-space search:** Even if the array is unsorted, if "can we finish with speed m?" becomes true and stays true for larger m → binary search on m.

---

## 2. Recognition Cues

| Cue | Pattern |
|---|---|
| Sorted array find target | classic BS |
| First / last / leftmost true | lower_bound style |
| "Minimum maximum" / "maximum minimum" | binary search on answer |
| Koko eating / ship packages / split array | capacity BS + greedy check |
| Peak element / bitonic | BS on slope |
| Rotated sorted array | half is sorted |
| Matrix sorted rows | treat as virtual array or row BS |
| Median of two sorted | partition BS |
| `lower_bound` / `upper_bound` STL | insert positions |

**Smell test:** Brute tries 1..n checking feasibility → binary search the candidate.

---

## 3. Template Skeletons (C++)

### A. Classic Find

```cpp
int binarySearch(vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

### B. Lower Bound (first >= target)

```cpp
int lowerBoundIdx(vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size(); // hi exclusive
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo; // in [0, n]
}
```

### C. Binary Search on Answer

```cpp
// Minimize capacity such that ok(cap) is true
bool ok(long long cap /* + problem inputs */);

long long minCapacity(long long lo, long long hi) {
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;      // try smaller
        else lo = mid + 1;          // need larger
    }
    return lo;
}
```

### D. Koko-style Check

```cpp
bool canEat(vector<int>& piles, int h, int speed) {
    long long hours = 0;
    for (int p : piles) {
        hours += (p + speed - 1LL) / speed; // ceil
        if (hours > h) return false;
    }
    return hours <= h;
}
int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canEat(piles, h, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

### E. Rotated Sorted Array Search

```cpp
int searchRotated(vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[lo] <= a[mid]) { // left sorted
            if (a[lo] <= target && target < a[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else { // right sorted
            if (a[mid] < target && target <= a[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}
```

### F. Peak Element

```cpp
int findPeakElement(vector<int>& a) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) lo = mid + 1; // climb up
        else hi = mid;
    }
    return lo;
}
```

---

## 4. Common Variants

| Variant | Predicate / move |
|---|---|
| First true | `ok(mid) ? hi=mid : lo=mid+1` |
| Last true | `ok(mid) ? lo=mid : hi=mid-1` (careful loop) |
| Count < x | lower_bound |
| Search 2D | row then col, or virtual index |
| Duplicate rotated | shrink ends when equal |
| Float answers | loop fixed iterations / eps |

---

## 5. Traps

1. **`mid = (lo+hi)/2` overflow** — use `lo + (hi-lo)/2`.  
2. **Infinite loop** when `lo = mid` without progress — use exclusive hi or `+1`.  
3. **Wrong monotonicity** — verify `ok` is monotonic on paper.  
4. **Inclusive vs exclusive hi** mixing.  
5. **Rotated with duplicates** — O(n) worst if equals.  
6. **Off-by-one in ceil division** `(x + d - 1) / d`.  
7. **Returning mid when not found** — clarify API.  
8. **Using BS on non-monotonic** landscapes (except special peak problems).

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Array unsorted ⇒ no BS" | Answer space may be mono | Search on capacity/time |
| "`while (lo <= hi)` always" | Can infinite with lo=mid | Pick one proven template |
| "Check mid only neighbors once" | Peak needs slope | Compare mid vs mid+1 |
| "Greedy for min-max load" | Hard to prove | BS answer + greedy check |
| "STL lower_bound is magic" | Need to know meaning | first iterator with val >= x |

---

## 7. Decision Mini-Tree

```text
Need fast find / optimize threshold?
├─ Sorted array value → classic / lower_bound
├─ Rotated sorted → identify sorted half
├─ Peak / bitonic → move to greater neighbor
└─ Min X such that condition holds
   └─ Binary search X + O(n) check (ok)
```

---

## 8. Example Problems

1. Binary Search  
2. Search Insert Position  
3. Find First and Last Position of Element  
4. Search in Rotated Sorted Array  
5. Find Minimum in Rotated Sorted Array  
6. Find Peak Element  
7. Koko Eating Bananas  
8. Capacity To Ship Packages Within D Days  
9. Split Array Largest Sum  
10. Median of Two Sorted Arrays  
11. Search a 2D Matrix  
12. Time Based Key-Value Store  
13. Find K Closest Elements  
14. Aggressive Cows / Magnetic Force Between Two Balls  
15. Minimize Max Distance to Gas Station  

---

## 9. Complexity

`O(log N)` iterations × cost of `ok`.  
If `ok` is O(n), total `O(n log RANGE)`.

---

## 10. Interview Script

> "The feasibility function is monotonic: if speed m works, m+1 also works. So I binary search the minimum m and check in O(n)."

---

## Revision Checklist

- [ ] lower_bound exclusive-hi template  
- [ ] BS-on-answer + ok()  
- [ ] Rotated array half logic  
- [ ] No infinite-loop patterns  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 1 classic + 1 answer-space + 1 rotated weekly.
