# Sorting Algorithms — Core Lesson

**Module:** 08-sorting-searching  
**Level target:** L4  
**Prerequisite:** arrays, recursion, heaps (for heapsort), Big-O  
**Memory picture:** Sorting is putting flashcards in ABC order. Some methods split the deck (merge sort), some pick a pivot card and pile “smaller / larger” (quicksort), some grow a sorted left side (insertion).

> Previous: Graphs. Next: Binary Search on Answer.

---

## 1. What is it?

**Sorting** rearranges a sequence into non-decreasing (or non-increasing) order by a key.

Interview-critical algorithms:

| Algo | Idea | Stable? | Extra space | Typical time |
|---|---|---|---|---|
| Insertion | Grow sorted prefix | Yes | O(1) | O(n²) / O(n) nearly sorted |
| Merge | Split, sort, merge | Yes | O(n) | O(n log n) always |
| Quick | Partition around pivot | No* | O(log n) avg stack | O(n log n) avg / O(n²) worst |
| Heap | Build heap, extract | No | O(1) | O(n log n) |
| Counting/Radix | Keys as digits/buckets | Yes (usual impl) | O(n+k) | O(n+k) / O(d(n+k)) |

\*Quicksort can be made stable with extra care; classic in-place is unstable.

**Stable sort** = equal keys keep original relative order.

New words:

- **Pivot** — partition reference element in quicksort.
- **Inversion** — pair i&lt;j with a[i]&gt;a[j]; unsortedness measure.
- **Comparison sort** — only uses ≤ comparisons; lower bound Ω(n log n) worst-case in decision tree model.

---

## 2. Explain like I am 10

You have exam papers with scores.

- **Insertion:** keep a neat pile; slide each new paper into the right gap.
- **Merge:** split the stack in half, sort each half, then zipper-merge two sorted stacks.
- **Quick:** pick one score as captain; everyone shorter left, taller right; repeat in each group.
- **Heap:** repeatedly pull the current top score from a score pyramid.

**Memory picture:**

```text
MERGE SORT pizza

Big pizza
 ├─ left half pizza
 └─ right half pizza
     ↓ sort tiny slices
     ↓ merge in order
Sorted pizza
```

---

## 3. Real life story

Databases sort before merge joins. Rankings, leaderboards, and `ORDER BY` need sorts. C++ `std::sort` (introsort hybrid) and `std::stable_sort` (merge-ish) are what you use in production interviews unless asked to implement.

---

## 4. Why does this exist?

Unordered data blocks binary search, two pointers on sorted pairs, sweep lines, and many greedy proofs. Sorting is the preprocessing hammer. Knowing **which** sort matters for stability, memory, and worst-case guarantees.

---

## 5. What problem existed before this?

People used slow O(n²) always. Merge/Heap gave reliable n log n. Quicksort won average practical speed. Lower bound proofs explained why comparison sorts cannot beat n log n in the worst case (general).

---

## 6. What happens without it?

1. You call `sort` but cannot discuss stability / complexity follow-ups.
2. You invent O(n²) in interviews for n=1e5 → TLE story.
3. You break equal-key order when stability mattered (radix + multi-key).
4. You fear quicksort worst case and cannot mention random pivot / introsort.

```text
n = 1e5, O(n²) sort
  ↓
~10^10 ops
  ↓
timeout
```

---

## 7. How did people invent this?

Insertion/selection are ancient. von Neumann merge sort (1945), Hoare quicksort (1960), Williams heapsort (1964). Introsort (Musser) mixes quick + heap to kill worst cases — basis of many `std::sort` implementations.

---

## 8. Computer intuition

**Merge:**

```text
sort(L), sort(R)
two pointers merge into buffer
copy back
```

**Quick partition (Lomuto sketch):**

```text
pivot = a[hi]
store = lo
for i=lo..hi-1:
  if a[i] <= pivot: swap a[store], a[i]; store++
swap a[store], a[hi]
return store
```

**Heap sort:** `make_heap` then repeated pop to the end.

```text
QUICKSORT TREE (balanced)

[pivot]
 left all ≤      right all ≥
 recurse         recurse
```

---

## 9. Mathematical intuition

Comparison sorts: there are n! orders; binary decision tree height ≥ log2(n!) ≈ n log n − O(n) → Ω(n log n).

Merge recurrence: `T(n)=2T(n/2)+O(n)` → Θ(n log n).

Quick average: balanced enough → Θ(n log n); sorted + bad pivot → Θ(n²).

Counting sort: not comparison-based; needs small integer range k.

---

## 10. Step-by-step working

**When to use what (interview speech):**

1. Library default: `std::sort` — average fast, not stable.
2. Need stability: `std::stable_sort` or merge sort.
3. Teach / analyze: write merge + quick partition.
4. Integers in tiny range: counting sort.
5. Nearly sorted: insertion shines.

**Custom comparator:** sort by multiple keys — primary, then secondary; watch strict weak ordering.

---

## 11. Dry run

Merge sort `[3,1,4,2]`:

```text
[3,1,4,2]
 → [3,1] [4,2]
 → [3][1] [4][2]
 → [1,3] [2,4]
 → [1,2,3,4]
```

Quicksort pivot last Lomuto on `[3,1,4,2]` pivot 2:

```text
partition → [1,2,4,3] with pivot index 1
recurse left [1], right [4,3] → ...
```

---

## 12. Visualization

```text
INSERTION

sorted | unsorted
3 1 4 2
3 | 1 4 2
1 3 | 4 2
1 3 4 | 2
1 2 3 4 |
```

```text
STABLE vs UNSTABLE

(key,id): (2,a) (1,x) (2,b)
stable → (1,x) (2,a) (2,b)
unstable might → (1,x) (2,b) (2,a)
```

```text
HEAP SORT tip

pyramid max on top → swap with end → shrink heap → sift down
```

---

## 13. Complexity

| Algo | Best | Avg | Worst | Extra space |
|---|---|---|---|---|
| Insertion | O(n) | O(n²) | O(n²) | O(1) |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) avg |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(n+k) |

---

## 14. Why this complexity?

Merge always splits log n levels, each level O(n) merges. Quick’s cost tracks partition balance. Heap height log n per extract × n. Counting buckets each key once.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

void mergeRange(vector<int>& a, int l, int m, int r, vector<int>& buf) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r)
        buf[k++] = (a[i] <= a[j]) ? a[i++] : a[j++]; // <= keeps stability
    while (i <= m) buf[k++] = a[i++];
    while (j <= r) buf[k++] = a[j++];
    for (int t = l; t <= r; t++) a[t] = buf[t];
}

void mergeSort(vector<int>& a, int l, int r, vector<int>& buf) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m, buf);
    mergeSort(a, m + 1, r, buf);
    mergeRange(a, l, m, r, buf);
}

int partitionLomuto(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}

void quickSort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partitionLomuto(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

// Library first in real interviews unless asked
void librarySort(vector<int>& a) {
    sort(a.begin(), a.end());                 // not stable
    // stable_sort(a.begin(), a.end());
}
```

---

## 16. STL usage

```cpp
sort(v.begin(), v.end());
sort(v.begin(), v.end(), greater<int>());
stable_sort(v.begin(), v.end());
partial_sort(v.begin(), v.begin()+k, v.end()); // k smallest to front
nth_element(v.begin(), v.begin()+k, v.end());  // next lesson cousin
is_sorted(v.begin(), v.end());
```

Custom:

```cpp
sort(v.begin(), v.end(), [](const auto& A, const auto& B){
    if (A.score != B.score) return A.score > B.score;
    return A.name < B.name;
});
```

Comparator must be **strict weak ordering** — never use `<=` returning true for equals in a way that breaks asymmetry.

---

## 17. Brute Force

Bubble / selection sort always O(n²) — fine for n≤1000 teaching, not for large n.

---

## 18. Better

Heapsort O(n log n) in-place but worse constants. Quicksort average faster. Merge for guaranteed + stable.

---

## 19. Optimal

Comparison sorting: Θ(n log n) optimal worst-case class (merge/heap/intro). For integers with limits, radix/counting can beat that. In interviews: prefer explaining merge + quick + `std::sort` practice.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "std::sort is always stable."
  ↓
Fails: equal elements may reorder
  ↓
Correct: use stable_sort when order of ties matters

Wrong: "Quicksort is always O(n log n)."
  ↓
Fails: adversarial pivots → O(n²)
  ↓
Correct: average O(n log n); mention random/introsort

Wrong: "Merge sort uses O(1) extra memory."
  ↓
Fails: typical array merge needs O(n) buffer
  ↓
Correct: O(n) auxiliary (linked lists can merge O(1) extra)

Wrong: "Any O(n log n) sort is fine for all keys."
  ↓
Fails: huge objects / stability / cache
  ↓
Correct: pick based on constraints
```

---

## 21. Common mistakes

1. Comparator with `<=` causing equal-element issues.
2. Off-by-one in merge mid.
3. Quicksort not handling duplicates (many equals) — can degrade; use 3-way partition (Dutch flag).
4. Recursion depth on skewed quicksort.
5. Assuming counting sort for negative ints without shifting.
6. Sorting indices wrong when you need original positions — sort pairs `(value, index)`.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Implement merge sort; is it stable? Prove O(n log n).”  
**Expected:** Code merge; recurrence; stability via `<=`.

### Amazon
**Ask:** “Sort large file that doesn’t fit RAM.”  
**Expected:** External merge sort idea (mention).

### Microsoft
**Ask:** “Why might quicksort beat merge in practice?”  
**Expected:** Locality, less moving, in-place; worst-case caveat.

### OpenAI
**Ask:** “When is counting/radix better than comparison sorts?”  
**Expected:** Integers / fixed-length keys; range/digits allow O(n) class.

**Interview phrase:**

```text
"I'll use std::sort unless I need stability or must implement.
Merge is guaranteed O(n log n) and stable; quick is faster average but O(n²) worst."
```

---

## 23. Company use cases

| Context | Sort role |
|---|---|
| Search indexing | External / merge |
| Rank feeds | Fast unstable OK |
| Multi-key reports | Stable / careful comparator |
| Graphics / games | Often partial_sort top-K |
| Databases | Mix of algorithms |

---

## 24. Related concepts + pattern recognition cues

**Related:** binary search, two pointers, quickselect, heaps, sweeping.

| Cue | Choice |
|---|---|
| Need implement guaranteed n log n | Merge / heap |
| Need stability | Merge / stable_sort |
| Practice partition | Quick |
| Tiny integer range | Counting |
| Need only K extreme | partial_sort / heap / quickselect |

**Decision snack:**

```text
Just sort it? → std::sort
Ties must keep order? → stable_sort
Interview implement? → merge (+ discuss quick)
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Merge = split + zipper (stable, O(n) mem, always n log n)
Quick = pivot partition (fast avg, unstable classic)
Heap = pyramid extracts
std::sort default; stable_sort for ties
Ω(n log n) comparison lower bound
```

### Checklist

- [ ] Merge dry-run
- [ ] Lomuto partition dry-run
- [ ] Stability definition + example
- [ ] When counting sort
- [ ] Comparator rules

### Practice roadmap

1. Implement merge sort + quicksort on paper/code
2. Problems that need sorting prep: 3Sum, meeting rooms, sweep
3. Custom comparator sorts (intervals, points)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite pizza + pivot pictures |
| 3 | Dry-run merge + partition |
| 7 | Code merge sort blind |
| 15 | Explain introsort / stable_sort |
| 30 | Teach lower bound idea |
| 90 | Mock: implement + complexity grill |

```text
Item: Sorting Algorithms
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
