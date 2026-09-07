# Arrays — Core Lesson

> Previous: Foundations (Big-O, memory, loops). Next: Strings, Two Pointers, Prefix Sum.

---

## 1. What is it?

An **array** is a row of boxes in memory. Each box holds one value. Boxes sit next to each other. You reach any box by its **index** (position number).

In C++, you mostly use `vector<int>` for interview work. A `vector` is a growable array.

```text
Index:  0   1   2   3   4
Value: 10  20  30  40  50
```

Key words:

- **Index** — the position (usually starts at 0)
- **Element** — the value inside a box
- **Contiguous** — boxes are side by side in memory
- **Random access** — jump to any index in O(1) time

---

## 2. Explain like I am 10

Imagine lockers in a school hallway, numbered 0, 1, 2, 3...

If someone says "open locker 3," you walk straight to locker 3. You do not open 0, then 1, then 2 first.

That is an array: numbered boxes in a straight line. Fast to open any number. Slow if you must insert a new locker in the middle (everyone else must shift).

**Memory picture:**

```text
Hallway of lockers
[10][20][30][40][50]
 0   1   2   3   4
```

---

## 3. Real life story

A teacher takes attendance with seats in a row.

- Seat 0: Asha
- Seat 1: Ben
- Seat 2: Chen

Need Chen? Go to seat 2. Instant.

Need to seat a new student between Asha and Ben? Everyone from Ben onward must move one seat. That is costly. Same cost idea as inserting into the middle of an array.

---

## 4. Why does this exist?

Programs need a simple way to store many values of the same type and reach them fast by position.

Arrays exist because:

1. Computers already store data in numbered memory cells
2. Many problems are "look at item i" or "scan left to right"
3. Contiguous storage is cache-friendly (CPU reads nearby data faster)

---

## 5. What problem existed before this?

Without arrays, you would name every variable:

```cpp
int a0 = 10, a1 = 20, a2 = 30; // nightmare for 1,000,000 items
```

You could not loop cleanly. You could not pass "the whole list" easily. You could not grow storage in a controlled way.

---

## 6. What happens without it?

Without arrays (or array-like structures):

- No clean loops over sequences
- No index-based algorithms (binary search, prefix sums, two pointers)
- Almost every interview problem collapses

Arrays are the base. Linked lists, heaps, and hash maps still use arrays under the hood in many implementations.

---

## 7. How did people invent this?

Early computers had linear memory. Engineers mapped "slot number → memory address."

```text
base_address + index * size_of_one_element
```

That formula is why index access is O(1). People later built dynamic arrays (`vector`) that grow when full — usually double capacity, copy once, then keep inserting amortized O(1).

---

## 8. Computer intuition

```text
vector<int> a = {10, 20, 30, 40, 50};

Memory (simplified):
Address: 1000 1004 1008 1012 1016
Value:     10   20   30   40   50
Index:      0    1    2    3    4

a[2] → start at 1000, skip 2 * 4 bytes → 1008 → read 30
```

The CPU does math, not a search. That is random access.

`push_back` may reallocate when capacity is full:

```text
capacity 4, size 4, push 5th item
  → new bigger block (often 8)
  → copy old 4
  → add new item
  → free old block
```

---

## 9. Mathematical intuition

For `n` elements:

| Operation | Typical cost |
|---|---|
| Read / write by index | O(1) |
| Scan all | O(n) |
| Insert / delete at end (`vector`) | Amortized O(1) |
| Insert / delete at middle | O(n) |
| Search unsorted | O(n) |
| Search sorted | O(log n) with binary search |

Why middle insert is O(n): up to `n` elements may move one step.

Amortized `push_back`: occasional O(n) copy, but rare enough that average per push is O(1).

---

## 10. Step-by-step working

Classic pattern: **find maximum**.

1. Assume first element is the best so far
2. Walk index `i` from 1 to n-1
3. If `a[i]` is bigger, update best
4. Return best

Classic pattern: **reverse in place**.

1. Left = 0, Right = n-1
2. Swap a[left] and a[right]
3. Move left++, right--
4. Stop when left >= right

Classic pattern: **rotate left by k** (interview favorite).

1. Normalize `k %= n`
2. Reverse whole array
3. Reverse first `n-k`
4. Reverse last `k`  
   (or reverse parts in another order — same idea)

---

## 11. Dry run

Array: `[3, 1, 4, 1, 5]`, find max.

```text
best = 3
i=1: 1 < 3  → best stays 3
i=2: 4 > 3  → best = 4
i=3: 1 < 4  → best stays 4
i=4: 5 > 4  → best = 5
Answer: 5
```

Reverse `[3, 1, 4, 1, 5]`:

```text
Start:  [3, 1, 4, 1, 5]
Swap 0,4 → [5, 1, 4, 1, 3]
Swap 1,3 → [5, 1, 4, 1, 3]
left=2, right=2 → stop
Done:   [5, 1, 4, 1, 3]
```

---

## 12. Visualization

```text
BEFORE reverse
+---+---+---+---+---+
| 3 | 1 | 4 | 1 | 5 |
+---+---+---+---+---+
  ^               ^
 left            right

AFTER one swap
+---+---+---+---+---+
| 5 | 1 | 4 | 1 | 3 |
+---+---+---+---+---+
      ^       ^
     left   right
```

Capacity vs size:

```text
size=3, capacity=4
[10][20][30][  ]
             ^ unused slot
```

---

## 13. Complexity

For common array scans and in-place transforms:

- **Time:** O(n) for one pass; O(n²) if nested loops over pairs
- **Space:** O(1) extra if in-place; O(n) if you build a new array

Interview target for many array Mediums: O(n) time, O(1) or O(n) space depending on need.

---

## 14. Why this complexity?

One loop visits each element a constant number of times → O(n).

Nested loops that compare every pair → O(n²).

Extra array of size n → O(n) space.

In-place two pointers reuse the same memory → O(1) extra space.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int findMax(const vector<int>& a) {
    // Assumes a is not empty
    int best = a[0];
    for (int i = 1; i < (int)a.size(); i++) {
        if (a[i] > best) best = a[i];
    }
    return best;
}

void reverseInPlace(vector<int>& a) {
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        swap(a[l], a[r]);
        l++;
        r--;
    }
}

// Remove duplicates from sorted array (LeetCode 26 style)
int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < (int)a.size(); fast++) {
        if (a[fast] != a[slow]) {
            slow++;
            a[slow] = a[fast];
        }
    }
    return slow + 1; // new logical length
}
```

---

## 16. STL usage

| Tool | Use |
|---|---|
| `vector<T>` | Main dynamic array |
| `a.size()`, `a.empty()` | Length checks |
| `a.push_back(x)` | Append |
| `a.pop_back()` | Remove last |
| `a[i]` | Index access (no bounds check) |
| `a.at(i)` | Bounds-checked access |
| `sort(a.begin(), a.end())` | Sort ascending |
| `reverse(a.begin(), a.end())` | Reverse |
| `accumulate` | Sum (need `<numeric>`) |
| `lower_bound` / `upper_bound` | Binary search on sorted vector |

Interview tip: prefer `vector` over raw C arrays unless the problem forces fixed size.

---

## 17. Brute Force

Problem: check if any two numbers sum to target (unsorted).

```cpp
bool twoSumBrute(const vector<int>& a, int target) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == target) return true;
        }
    }
    return false;
}
// Time O(n^2), Space O(1)
```

Honest starting point. Say this first in interviews, then improve.

---

## 18. Better

Sort, then two pointers (if only yes/no, not original indices).

```cpp
bool twoSumBetter(vector<int> a, int target) {
    sort(a.begin(), a.end());
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        long long sum = 1LL * a[l] + a[r];
        if (sum == target) return true;
        if (sum < target) l++;
        else r--;
    }
    return false;
}
// Time O(n log n), Space O(1) or O(n) depending on sort
```

---

## 19. Optimal

Hash map for original Two Sum with indices:

```cpp
vector<int> twoSumOptimal(const vector<int>& a, int target) {
    unordered_map<int, int> seen; // value -> index
    for (int i = 0; i < (int)a.size(); i++) {
        int need = target - a[i];
        if (seen.count(need)) return {seen[need], i};
        seen[a[i]] = i;
    }
    return {};
}
// Time O(n) average, Space O(n)
```

"Optimal" depends on constraints. Always state trade-offs.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Arrays are always O(1) for everything."
  ↓
Fails: insert/delete in middle is O(n); unsorted search is O(n)
  ↓
Correct: Index read/write is O(1). Other ops depend on what you do.

Wrong: "I can always use a[n] safely."
  ↓
Fails: valid indices are 0 .. n-1; a[n] is out of bounds
  ↓
Correct: Loop with i < n, never i <= n for 0-based arrays

Wrong: "vector copy in function is free."
  ↓
Fails: pass-by-value copies O(n) data
  ↓
Correct: pass const vector& for read-only; vector& if you mutate
```

---

## 21. Common mistakes

1. Off-by-one: `i <= n` instead of `i < n`
2. Empty array not handled
3. Integer overflow on sums (`int` → use `long long`)
4. Modifying while iterating without care
5. Confusing size and capacity
6. Returning pointer/reference to local temporary array
7. Sorting when problem needs original indices, then losing them

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "Why is array access O(1)?"  
**Expected:** Address = base + index * element_size; constant arithmetic, no scan.

**Ask:** "When is vector push_back not O(1)?"  
**Expected:** When reallocation happens; amortized O(1) over many pushes.

### Amazon
**Ask:** "Leadership + coding: remove duplicates from sorted array in-place."  
**Expected:** Slow/fast pointers, O(n) time, O(1) extra space; explain clearly, test edge cases (empty, all same).

### Microsoft
**Ask:** "Rotate array by k without extra O(n) if possible."  
**Expected:** Reverse trick or cyclic replacement; discuss `k %= n`.

### OpenAI
**Ask:** "How would you stream a huge array you cannot fully store?"  
**Expected:** Process online with one pass / window / reservoir ideas; clarify memory limits; arrays alone may not fit — pick the right abstraction.

**Speaking template:**

```text
1. Restate constraints (n size, value range, mutability)
2. Brute force + complexity
3. Bottleneck
4. Better idea
5. Code
6. Dry run + edges
```

---

## 23. Company use cases

| Company-style system | Array role |
|---|---|
| Google Search ranking features | Feature vectors, buffers |
| Amazon order line items | Lists of SKUs, prices |
| Microsoft Excel / Sheets | Cell rows as arrays |
| OpenAI token batches | Contiguous token id buffers |
| Games / graphics | Vertex buffers, frame data |

In backend work (NestJS etc.), JSON arrays become vectors/lists in processing pipelines. Same mental model.

---

## 24. Related concepts + pattern recognition cues

**Related:** strings (char arrays), two pointers, sliding window, prefix sum, matrix (2D array), hashing, binary search.

**Cues → think arrays patterns:**

| Cue in problem | Likely pattern |
|---|---|
| Contiguous subarray sum / length | Prefix sum or sliding window |
| Sorted + pair / remove dup | Two pointers |
| Need count / seen before | Hash map + array |
| In-place rearrange | Two pointers / partition |
| Submatrix / grid | 2D array / matrix |
| "Return indices" | Careful with sorting; maybe hash |

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Array = numbered lockers in a line
Fast jump by index (O(1))
Middle insert costs shifts (O(n))
Master: scan, reverse, partition, two pointers, prefix
```

### Checklist

- [ ] Explain array to a 10-year-old
- [ ] Draw memory: index → address
- [ ] Dry-run reverse and remove duplicates
- [ ] Code `vector` patterns without notes
- [ ] State brute → better → optimal for Two Sum
- [ ] List 5 common mistakes

### Practice roadmap

1. Easy: Max/Min, Reverse, Running Sum, Remove Element
2. Medium: Product except self, Rotate, Next Permutation, Jump Game
3. Mix: Two Sum variants, Sort Colors (Dutch flag), Merge Intervals (after sorting)

Target: 40–60 solid array problems before calling yourself L4.

### Spaced repetition

| Day | What to do |
|---|---|
| 1 | Recall: what/why + memory picture |
| 3 | Dry-run reverse + remove duplicates on paper |
| 7 | Re-code Two Sum (hash) + reverse from memory |
| 15 | Solve 1 new Medium array problem timed |
| 30 | Teach arrays out loud for 5 minutes |
| 90 | Mixed mock: 2 array problems under time |

Log:

```text
Item: Arrays core
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
