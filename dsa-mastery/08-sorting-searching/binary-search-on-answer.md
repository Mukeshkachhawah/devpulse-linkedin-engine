# Binary Search and Binary Search on Answer — Core Lesson

**Module:** 08-sorting-searching  
**Level target:** L5  
**Prerequisite:** sorting idea, arrays, monotonic functions  
**Memory picture:** Guessing a number with “too low / too high” — but sometimes the “number” is the answer itself (minimum capacity, minimum max load), and each guess you run a yes/no checker.

> Previous: Sorting Algorithms. Next: Quickselect and Partition.

---

## 1. What is it?

**Binary search** finds a target in a **sorted** array by repeatedly cutting the search range in half.

**Binary search on answer (parametric search)** binary-searches the **value of the answer** when:

1. The answer lies in a numeric range `[lo, hi]`
2. There is a monotonic predicate `ok(x)` — like “can we finish with limit x?”
3. You want the **minimum** x with `ok(x)` true, or **maximum** with `ok(x)` true

New words:

- **Monotonic** — once `ok` becomes true (for min problems), larger x stays true (or the reverse pattern for max).
- **Predicate / checker** — function that tests a candidate answer in O(work).
- **Lower bound** — first position where value ≥ target.
- **Upper bound** — first position where value &gt; target.

---

## 2. Explain like I am 10

Classic: pages of a dictionary — open middle, go left or right.

On answer: you must ship packages within D days. You guess a truck capacity. If that capacity works, try smaller; if not, try bigger. Capacities that work look like:

```text
capacity: 1 2 3 4 5 6 7 8 ...
ok?       N N N N Y Y Y Y ...
               ^ first Y = answer
```

**Memory picture:** a light switch row that stays ON forever after the first ON — find the first ON.

---

## 3. Real life story

Allocate minimum Wi-Fi power so all houses connect; minimum exam pass mark such that at least K students pass (if scores sorted); cut wood / koko bananas / split array largest sum — all industry-flavored “smallest budget that still works.”

---

## 4. Why does this exist?

Linear scan of candidates is too slow when the range is large (1..1e9) but each check is O(n). Binary search needs ~30–60 checks. The trick is **seeing monotonicity**.

---

## 5. What problem existed before this?

People did DP O(n²) or greedy without proof when binary search on answer + greedy check was enough. Teaching “search the answer” unlocked a whole LeetCode family.

---

## 6. What happens without it?

1. You only know “binary search = find index of x.”
2. You miss Split Array Largest Sum / Koko / Ship Packages patterns.
3. Infinite loops from `mid` bugs (`lo + (hi-lo)/2`, `lo=mid+1` rules).
4. You binary-search a non-monotonic predicate → random WA.

```text
ok not monotonic
  ↓
halving throws away the real answer
  ↓
wrong
```

---

## 7. How did people invent this?

Binary search is ancient (sorted tables). Parametric search appears in optimization: binary search a threshold when feasibility is monotone. CP and interviews standardized the template.

---

## 8. Computer intuition

**Classic lower_bound style:**

```text
lo, hi  // hi exclusive or inclusive — pick one convention
while lo < hi:
  mid = lo + (hi - lo) / 2
  if a[mid] < target: lo = mid + 1
  else: hi = mid
// lo is answer position
```

**On answer (minimize x with ok(x)):**

```text
lo = min_possible, hi = max_possible  // hi inclusive answer space
while lo < hi:
  mid = lo + (hi - lo) / 2
  if ok(mid): hi = mid
  else: lo = mid + 1
return lo
```

```text
SAFE MID

mid = lo + (hi - lo) / 2
// avoids lo+hi overflow (still good habit in C++)
```

---

## 9. Mathematical intuition

Each step halves the search space → O(log(range)) iterations.

Total time ≈ O(check · log(range)).

Monotonicity proof sketch for ship packages: if capacity C works, C+1 also works (you can always pretend to use less). Therefore yes-region is a suffix — binary search valid.

For maximize x with ok(x): yes-region is a prefix; adjust template (`if ok: lo=mid`, careful with infinite loops — often `hi = mid-1` inclusive forms or add `+1` mid for upper).

---

## 10. Step-by-step working

**Pattern recognition checklist:**

1. Asked for min/max integer value under constraint?
2. Can I write `ok(x)` boolean?
3. Is `ok` monotone?
4. Bound the range (sum of array, max element, 1..1e18)?
5. Binary search + implement check (often greedy).

**Classic array binary search variants:**

- Exact find
- First/last occurrence
- Insert position
- Search rotated sorted array (special — still binary on structure)

---

## 11. Dry run

Koko eating bananas: piles `[3,6,7,11]`, H=8 hours. Min speed.

```text
ok(speed)= hours needed <= 8
speed 1..11

mid 6: hours = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)=1+1+2+2=6 ≤8 → ok → try smaller
...
converges to 4
```

Lower bound of 5 in `[1,2,4,5,5,7]`:

```text
lo=0 hi=6
mid=3 a[3]=5 ≥5 → hi=3
mid=1 a[1]=2 <5 → lo=2
mid=2 a[2]=4 <5 → lo=3
lo=hi=3 → first 5
```

---

## 12. Visualization

```text
SORTED ARRAY SEARCH

[1, 3, 4, 7, 9, 12] target 7
 L        M           R
          L  M        R
          L M R
            ^ found
```

```text
ANSWER SPACE

x:   lo ---------------- mid -------- hi
ok:  N N N N N N Y  Y Y Y Y Y Y Y Y Y
                    ^ minimize → land here
```

```text
TEMPLATE PICK

Minimize x with ok(x):
  if ok(mid) hi=mid else lo=mid+1

Maximize x with ok(x):
  if ok(mid) lo=mid else hi=mid-1
  (use careful mid = lo + (hi-lo+1)/2 in inclusive form)
```

---

## 13. Complexity

| Problem type | Time | Space |
|---|---|---|
| Array binary search | O(log n) | O(1) |
| On answer | O(check · log(range)) | O(1) extra besides check |
| Check often | O(n) greedy | |

---

## 14. Why this complexity?

Range halves each time independently of how heavy `ok` is — you only multiply by check cost. That turns “try all capacities 1..sum” O(sum·n) into O(n log sum).

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// first index i with a[i] >= target (lower_bound)
int lowerBoundIdx(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size(); // hi exclusive
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

bool canShip(const vector<int>& w, int days, int cap) {
    int used = 1, cur = 0;
    for (int x : w) {
        if (x > cap) return false;
        if (cur + x > cap) { used++; cur = 0; }
        cur += x;
    }
    return used <= days;
}

int shipWithinDays(vector<int>& weights, int days) {
    int lo = *max_element(weights.begin(), weights.end());
    int hi = accumulate(weights.begin(), weights.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

int minEatingSpeed(vector<int>& piles, int h) {
    auto ok = [&](int speed) {
        long long hours = 0;
        for (int p : piles) hours += (p + speed - 1LL) / speed;
        return hours <= h;
    };
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// Split Array Largest Sum — minimize largest piece sum with m subarrays
bool canSplit(const vector<int>& a, int m, long long lim) {
    int parts = 1;
    long long cur = 0;
    for (int x : a) {
        if (x > lim) return false;
        if (cur + x > lim) { parts++; cur = 0; }
        cur += x;
    }
    return parts <= m;
}
```

---

## 16. STL usage

```cpp
lower_bound(a.begin(), a.end(), x); // first >= x
upper_bound(a.begin(), a.end(), x); // first > x
binary_search(a.begin(), a.end(), x); // bool
equal_range(...); // pair of lower/upper
```

Prefer writing the loop yourself in interviews for “on answer”; STL bounds are great for array indices.

---

## 17. Brute Force

Try every candidate answer from lo..hi with linear check → O((hi-lo)·check). Works when range tiny.

---

## 18. Better

Jump / exponential search for unbounded ranges; ternary search for unimodal continuous functions (different tool). For discrete monotone feasibility, binary search is the standard better.

---

## 19. Optimal

O(check · log(range)) is optimal among monotone feasibility searches that only use yes/no checks. Sometimes DP gives exact answers with different complexity tradeoffs — compare constraints.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Binary search only finds an element in an array."
  ↓
Fails: misses half of interview problems
  ↓
Correct: also search the answer if ok(x) is monotone

Wrong: "mid = (lo+hi)/2 is always fine; any loop update works."
  ↓
Fails: infinite loops when lo=mid on maximize templates
  ↓
Correct: stick to a known template; use biased mid when needed

Wrong: "If the problem asks min max, I must DP."
  ↓
Fails: many are binary search + greedy check
  ↓
Correct: test monotonicity first

Wrong: "Floating answers — keep comparing with =="
  ↓
Fails: precision
  ↓
Correct: fixed iterations or epsilon; prefer integer reformulation
```

---

## 21. Common mistakes

1. Infinite loop (`lo = mid` without progress).
2. Wrong bounds (capacity lo must be ≥ max package).
3. `ok` off-by-one with days/hours ceil division.
4. Overflow in `lo+hi` or in check sums — use `long long`.
5. Binary searching a non-monotone landscape.
6. Rotated array: applying plain lower_bound blindly.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Split array largest sum.”  
**Expected:** Binary search on max sum limit; greedy count pieces; justify monotone.

### Amazon
**Ask:** “Capacity to ship packages within D days.”  
**Expected:** Same pattern; careful lo/hi.

### Microsoft
**Ask:** “Implement lower_bound.”  
**Expected:** Inclusive/exclusive clarity; dry-run duplicates.

### OpenAI
**Ask:** “How do you prove you can binary search the answer?”  
**Expected:** Show that feasibility is monotone; give counterexample if not.

**Interview phrase:**

```text
"I'll binary search the answer. ok(x) checks feasibility in O(n).
Because ok is monotone, the first x that works is optimal. Total O(n log R)."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Resource allocation min size | On-answer |
| Search indexes / sorted keys | Classic BS |
| Game damage thresholds | On-answer |
| Autoscaling min instances | Feasibility search |
| Time-series first true event | Lower bound |

---

## 24. Related concepts + pattern recognition cues

**Related:** sorting, greedy, ternary search, slide/two pointers, DP alternatives.

| Cue | Tool |
|---|---|
| Sorted array find / bound | Binary search |
| Min capacity / min speed / min max load | Binary search on answer |
| Max min-distance (aggressive cows) | On-answer maximize |
| Unimodal peak continuous | Ternary / golden (rare) |
| Rotated sorted | Modified binary search |

**Decision snack:**

```text
See min/max + "can you achieve with X"?
→ prove monotone → binary search X → code ok(X)
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Classic BS: half a sorted array
On answer: half the answer space with ok(x)
Minimize: if ok hi=mid else lo=mid+1
Monotone or don't
Time = check × log(range)
```

### Checklist

- [ ] Write lower_bound loop
- [ ] Ship packages dry-run
- [ ] Koko ceil division
- [ ] Prove monotone in one sentence
- [ ] Avoid infinite loop template

### Practice roadmap

1. Easy: Binary Search, First Bad Version, Search Insert Position
2. Medium: Ship Packages, Koko, Split Array Largest Sum, Aggressive Cows style, Minimum Number of Days to Make m Bouquets
3. Harder: rotated search variants, median of two sorted arrays (advanced BS)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite first-ON picture |
| 3 | Dry-run ship packages |
| 7 | Code lower_bound + koko blind |
| 15 | Timed split array |
| 30 | Teach monotonicity proof |
| 90 | Mock: on-answer problem |

```text
Item: Binary Search / On Answer
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
