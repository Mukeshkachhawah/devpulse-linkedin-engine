# Quickselect and Partition — Core Lesson

**Module:** 08-sorting-searching  
**Level target:** L4–L5  
**Prerequisite:** quicksort partition, heaps (for alternative Kth)  
**Memory picture:** You only need the Kth tallest kid — you do not line up everyone. Pick a captain height, split shorter/taller, then only recurse into the side that still contains the Kth.

> Previous: Binary Search on Answer. Next module: Dynamic Programming.

---

## 1. What is it?

**Partition** rearranges an array around a **pivot** so that:

- left side ≤ pivot (or &lt; depending on scheme)
- right side ≥ pivot
- pivot lands in its **final sorted index**

**Quickselect** uses partition to find the **Kth smallest** (or largest) element in **average O(n)** time without fully sorting.

Related:

- **Dutch National Flag** — 3-way partition for 3 colors / many duplicates
- **`nth_element`** — C++ STL quickselect-like
- **Hoare vs Lomuto** — two partition styles

New words:

- **Order statistic** — the Kth smallest element.
- **3-way partition** — `&lt; pivot | == pivot | &gt; pivot`.

---

## 2. Explain like I am 10

Class of 31 kids. Who is 10th shortest?

Pick one kid as captain. Everyone shorter stands left, taller right. Suppose 12 kids are on the left. Then the 10th shortest is inside the left group — ignore the right. Repeat with a smaller group.

You avoid sorting the whole school.

**Memory picture:**

```text
[ 7 2 9 4 3 8 ]  k=3rd smallest (1-based) → want 4?

pivot 3 → [2 3 9 4 7 8]  pivot at index 1
3rd smallest is to the right of index 1 → search right with adjusted k
```

---

## 3. Real life story

Top-K analytics sometimes only need the threshold element (Kth) then partition around it. Introselect / `nth_element` used in real libraries. Interview twin: “Kth Largest Element in an Array.”

---

## 4. Why does this exist?

Full sort is O(n log n). If you only need one order statistic, average O(n) quickselect wins. Partition is also the engine inside quicksort and many in-place rearrangements (move zeros, odds/evens, pivot for Dutch flag).

---

## 5. What problem existed before this?

People sorted then indexed `a[k-1]` — correct but slower class. Blum et al. worst-case O(n) median-of-medians is theoretical insurance; interviews usually accept average O(n) + heap O(n log k) alternatives.

---

## 6. What happens without it?

1. You always sort for Kth — interviewer asks for faster expected time.
2. You confuse Kth smallest vs Kth largest indexing.
3. Partition bugs → wrong pivot index → wrong side recurse → WA / infinite.
4. Many duplicates → naive 2-way partition degrades badly.

```text
Bad pivot always + sorted input
  ↓
quickselect ~ O(n²) like quicksort worst
```

---

## 7. How did people invent this?

Hoare’s quicksort (1960) birthed partition; quickselect is the select cousin. Dijkstra’s Dutch National Flag solved 3-way coloring. C++ `nth_element` popularized the tool for contests.

---

## 8. Computer intuition

After partition at index `p`:

```text
if p == k: found
if k < p: select in left
else: select in right (k unchanged if 0-based target index)
```

Use **0-based target index** `k` = K-1 for Kth smallest.

```text
LOMUTO PARTITION

pivot = a[r]
i = l
for j = l .. r-1:
  if a[j] <= pivot: swap a[i], a[j]; i++
swap a[i], a[r]
return i   // pivot final index
```

**Randomize pivot** (swap random with `r`) to avoid worst cases in practice.

---

## 9. Mathematical intuition

Average quickselect: T(n) ≈ T(n/2) + O(n) → O(n).

Worst: T(n)=T(n-1)+O(n) → O(n²).

Heap method for Kth largest: O(n log k) time, O(k) space — better worst-case control for small k.

Median-of-medians: worst-case O(n) — heavy to code in interviews.

---

## 10. Step-by-step working

**Kth largest:**

1. Convert to Kth smallest index: `target = n - k`.
2. Quickselect until pivot index == target.
3. Or maintain min-heap of size k.

**3-way partition (sort colors):**

```text
lo, mid, hi pointers
0-region | 1-region | unknown | 2-region
```

**Move zeros / pivot rearrange:** same partition idea with predicate.

---

## 11. Dry run

Array `[3,2,1,5,6,4]`, 2nd largest → target index `n-2=4` for 0-based Kth smallest among… wait:

2nd largest = 5. As Kth smallest: 5 is 5th smallest in sorted `[1,2,3,4,5,6]` → index 4.

```text
Quickselect aiming index 4
One possible partition path lands pivot 5 at index 4 → done
```

Dutch flag `[2,0,2,1,1,0]`:

```text
→ [0,0,1,1,2,2]
```

---

## 12. Visualization

```text
PARTITION

before:  [ 7 2 9 4 3 ] pivot 4
after:   [ 2 3 4 9 7 ]
               ^
             final place of 4
```

```text
QUICKSELECT ONLY ONE SIDE

        [..........]
         L    p    R
k < p → go L
k > p → go R
k = p → answer a[p]
```

```text
DUTCH FLAG

low      mid           high
[0 0 0 | 1 1 | ? ? ? | 2 2]
```

---

## 13. Complexity

| Method | Avg time | Worst | Extra space |
|---|---|---|---|
| Quickselect | O(n) | O(n²) | O(1) / O(log n) stack |
| Sort then index | O(n log n) | O(n log n) | depends |
| Heap size k | O(n log k) | O(n log k) | O(k) |
| Median of medians | O(n) | O(n) | O(log n) |

---

## 14. Why this complexity?

Each successful partition scan is O(n); expected discarded fraction yields geometric series summing to O(n). Worst case discards only one element each time. Heap pays log k per element.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int partitionLomuto(vector<int>& a, int l, int r) {
    int pivot = a[r];
    int i = l;
    for (int j = l; j < r; j++)
        if (a[j] <= pivot) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}

// k is 0-based index for Kth smallest
int quickselect(vector<int>& a, int l, int r, int k) {
    while (l <= r) {
        // random pivot
        int pivotIdx = l + rand() % (r - l + 1);
        swap(a[pivotIdx], a[r]);
        int p = partitionLomuto(a, l, r);
        if (p == k) return a[p];
        if (k < p) r = p - 1;
        else l = p + 1;
    }
    return -1;
}

int findKthLargest(vector<int> a, int k) {
    int n = (int)a.size();
    return quickselect(a, 0, n - 1, n - k);
}

void dutchFlag(vector<int>& a) { // 0,1,2
    int lo = 0, mid = 0, hi = (int)a.size() - 1;
    while (mid <= hi) {
        if (a[mid] == 0) swap(a[lo++], a[mid++]);
        else if (a[mid] == 1) mid++;
        else swap(a[mid], a[hi--]); // don't mid++ ; new value must be inspected
    }
}

// STL
int kthSTL(vector<int> a, int kthSmallest1Based) {
    nth_element(a.begin(), a.begin() + kthSmallest1Based - 1, a.end());
    return a[kthSmallest1Based - 1];
}
```

---

## 16. STL usage

```cpp
nth_element(v.begin(), v.begin()+k, v.end());
// Afterward: v[k] is what would be at k after sort
// left of k: <= v[k] (not fully sorted)
// right: >= v[k]

partial_sort(v.begin(), v.begin()+k, v.end()); // sorts first k ascending
```

Prefer `nth_element` in contests for Kth; be ready to hand-write partition in interviews.

---

## 17. Brute Force

Sort O(n log n) and return `a[k]`. Correct baseline — always mention then improve.

---

## 18. Better

Min-heap of size k for Kth largest — simple and predictable O(n log k). Good when k is small and worst-case matters.

---

## 19. Optimal

Average O(n) quickselect / `nth_element` is the usual “optimal expected” interview answer. Mention worst-case O(n) median-of-medians if grilled; rarely implement fully.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "After partition the whole array is sorted."
  ↓
Fails: only pivot is in final place
  ↓
Correct: sides are unordered except vs pivot

Wrong: "Kth largest = quickselect index k."
  ↓
Fails: off-by-one / wrong direction
  ↓
Correct: index n-k for 0-based Kth largest

Wrong: "Dutch flag: after swap with hi, always mid++."
  ↓
Fails: swapped-in value unknown
  ↓
Correct: only advance mid for 0/1 cases as template says

Wrong: "Quickselect always beats heap."
  ↓
Fails: worst O(n²); constants; k tiny
  ↓
Correct: discuss tradeoffs
```

---

## 21. Common mistakes

1. Inclusive vs exclusive bounds in recursive select.
2. Forgetting to randomize pivot.
3. Using `rand()` without care in online judges — OK for interviews; or swap with middle.
4. Confusing Lomuto return index.
5. Modifying array when problem forbids — copy first.
6. Stable expectations — partition is unstable.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Kth largest element — compare sort, heap, quickselect.”  
**Expected:** Complexities; average vs worst; code one.

### Amazon
**Ask:** “Sort colors (Dutch flag).”  
**Expected:** One-pass 3 pointers; explain why not mid++ on 2.

### Microsoft
**Ask:** “Implement partition and explain quicksort relation.”  
**Expected:** Pivot final index; recurse both sides for sort, one side for select.

### OpenAI
**Ask:** “When prefer `nth_element` vs heap for streaming top-k?”  
**Expected:** `nth_element` needs full array in memory; heap works online with size k.

**Interview phrase:**

```text
"I'll partition around a pivot; the pivot's index tells me which side
contains the Kth element. Average O(n), worst O(n²) unless we harden pivots."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Analytics percentile / median | Quickselect |
| Top-K threshold then filter | Partition around Kth |
| UI 3-state buckets | Dutch flag |
| Language runtimes | nth_element / introspective select |
| Quicksort engines | Partition |

---

## 24. Related concepts + pattern recognition cues

**Related:** quicksort, heaps top-K, BFPRT median of medians, 3-way quicksort, two pointers.

| Cue | Tool |
|---|---|
| Kth element, full array in RAM | Quickselect / nth_element |
| Stream / tiny k | Heap size k |
| Exactly 3 categories in-place | Dutch flag |
| Need fully sorted | Sort / quicksort both sides |
| Need K smallest sorted | partial_sort |

**Decision snack:**

```text
Need full order? → sort
Need only Kth? → quickselect (avg O(n)) or heap
Need K extremes online? → heap
Three values? → Dutch flag
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Partition puts pivot in final index
Quickselect = partition + one-side recurse
Kth largest index = n-k (0-based)
Average O(n), worst O(n²)
Dutch flag = 3-way pointers
nth_element = STL select
```

### Checklist

- [ ] Lomuto dry-run
- [ ] Quickselect side decision
- [ ] Kth largest index math
- [ ] Dutch flag code
- [ ] Compare heap vs quickselect

### Practice roadmap

1. Easy/Med: Kth Largest Element, Sort Colors
2. Medium: Wiggle Sort notes, K closest (heap/select hybrids)
3. Implement quickselect until bug-free; try Hoare partition optional

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite captain / side picture |
| 3 | Dry-run partition + select |
| 7 | Code quickselect + dutch flag |
| 15 | Timed Kth largest |
| 30 | Oral avg vs worst vs heap |
| 90 | Mock: select + colors |

```text
Item: Quickselect / Partition
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
