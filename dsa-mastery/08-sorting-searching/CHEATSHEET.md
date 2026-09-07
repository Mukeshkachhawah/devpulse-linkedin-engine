# Sorting & Searching — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Need data ordered?
├─ Full sort
│   ├─ ties must keep order → stable_sort / merge
│   └─ default speed → std::sort (introsort)
├─ Only Kth / partition threshold → quickselect / nth_element
├─ Top-K stream / small k → heap size k
├─ Find in sorted array → binary search / lower_bound
└─ Min/max numeric answer with monotone feasibility → BS on answer
```

---

## Sort Pocket

| Algo | Time | Stable | Extra |
|---|---|---|---|
| Merge | n log n | Yes | O(n) |
| Quick | n log n avg | No | O(log n) |
| Heap | n log n | No | O(1) |
| Counting | n+k | Yes* | O(n+k) |

```cpp
sort(v.begin(), v.end());
stable_sort(v.begin(), v.end());
nth_element(v.begin(), v.begin()+k, v.end());
```

Comparator: strict weak ordering; prefer `<` not `<=`.

---

## Binary Search Templates

### lower_bound (first ≥ x), hi exclusive

```cpp
int lo = 0, hi = n;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
}
return lo;
```

### Minimize answer with ok(x)

```cpp
int lo = MIN, hi = MAX; // hi inclusive range end
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;
```

### Maximize answer with ok(x) (inclusive)

```cpp
int lo = MIN, hi = MAX;
while (lo < hi) {
    int mid = lo + (hi - lo + 1) / 2; // bias up
    if (ok(mid)) lo = mid;
    else hi = mid - 1;
}
return lo;
```

Ceil div: `(p + speed - 1LL) / speed`.

---

## Quickselect / Partition

```cpp
// Lomuto returns final pivot index
// if p==k found; k<p → left; else right
// Kth largest (1-based k): target index = n-k
```

```cpp
nth_element(a.begin(), a.begin() + (n - k), a.end());
int kthLargest = a[n - k];
```

### Dutch flag (0,1,2)

```cpp
int lo=0, mid=0, hi=n-1;
while (mid <= hi) {
    if (a[mid]==0) swap(a[lo++], a[mid++]);
    else if (a[mid]==1) mid++;
    else swap(a[mid], a[hi--]);
}
```

---

## Classic On-Answer Checks

| Problem | lo | hi | ok(x) |
|---|---|---|---|
| Ship packages | max(w) | sum(w) | days needed ≤ D |
| Koko bananas | 1 | max(pile) | hours ≤ h |
| Split array largest sum | max(a) | sum(a) | pieces ≤ m |

---

## Complexity Pocket

```text
sort                     O(n log n)
binary search            O(log n)
on answer                O(n log R) typical
quickselect avg          O(n)
heap Kth                 O(n log k)
```

---

## Interview Phrases

```text
"I'll clarify stability and constraints, then choose sort vs select."
"For min/max under limits, I'll prove ok(x) is monotone and binary search the answer."
"Partition places the pivot; quickselect only recurses into one side."
```

---

## Spaced Repetition Hook

```text
Items: Sorting | BS / On-Answer | Quickselect-Partition
Cadence: +1 +3 +7 +15 +30 +90
```
