# Two Pointers — Core Lesson

> Previous: Arrays, Strings. Next: Sliding Window (a cousin of two pointers).

---

## 1. What is it?

**Two pointers** means you keep two indices (or iterators) and move them according to a rule, instead of using nested loops.

Common shapes:

1. **Opposite ends** — left starts at 0, right at n-1, move toward center  
2. **Same direction** — slow and fast both start near 0; fast explores, slow writes/keeps  
3. **Two sequences** — one pointer per array (merge sorted arrays)

```text
Opposite ends:   L --------→ ←-------- R
Slow/fast:       S →   F →→→
```

---

## 2. Explain like I am 10

You and a friend stand on two ends of a row of numbered tiles.

You look at both tiles. If the sum is too small, the left friend steps right (bigger number if sorted). If too big, the right friend steps left.

You do not check every pair by walking the whole row for each tile. You cooperate and meet in the middle.

**Memory picture:** two flashlights scanning a hallway from both ends — or one flashlight chasing another.

---

## 3. Real life story

Sorting books by height on a shelf (already sorted short to tall). Find two books whose heights add to 50 cm.

Blind way: pick every pair.  
Smart way: shortest + tallest. Adjust one side based on sum. Same idea as two-sum on a sorted array.

---

## 4. Why does this exist?

Nested loops are often O(n²). Many problems have **order** or **monotonic** structure so one decision lets you throw away many pairs at once.

Two pointers turn "check all pairs" into "one smart pass" — often O(n) after sort, or O(n) on already-ordered input.

---

## 5. What problem existed before this?

People wrote:

```cpp
for i in 0..n-1:
  for j in i+1..n-1:
    check(a[i], a[j])
```

Works, but too slow for n = 10^5 (about 10^10 operations — timeout).

---

## 6. What happens without it?

You stay at O(n²) for pair problems. Interviews expect you to see the sorted two-pointer or slow/fast rewrite. Sliding window and in-place array edits become harder to invent cleanly.

---

## 7. How did people invent this?

From merging sorted lists and from two-sum after sorting. Also from in-place filtering (read pointer / write pointer) in early systems programming — compact arrays without extra buffers when memory was tiny.

The pattern was named later in teaching; the idea is old: advance the side that can fix the invariant.

---

## 8. Computer intuition

Each pointer is an integer index. Moving a pointer is O(1). The art is the **invariant**:

```text
Opposite ends on sorted array for two-sum:
  If sum < target, any pair with this left and a smaller right is worse → move left up
  If sum > target, move right down
```

```text
Slow/fast for remove element:
  Fast reads every item
  Slow writes only keepers
  After loop, length = slow
```

You prove each element is processed a constant number of times → O(n).

---

## 9. Mathematical intuition

Number of pairs is O(n²). Two pointers visit O(n) candidate pairs that matter.

After sorting O(n log n), two-sum decision is O(n). Total O(n log n).

Slow/fast: each index visited once by fast → O(n) time, O(1) extra space.

For 3Sum: fix one index, two-pointer the rest → O(n²), which is the usual target.

---

## 10. Step-by-step working

**Sorted two-sum (yes/no):**

1. Sort if needed
2. l = 0, r = n-1
3. While l < r: compare sum to target; move l or r
4. Stop on equal or pointers cross

**Container With Most Water:**

1. l = 0, r = n-1
2. Area = min(h[l], h[r]) * (r-l)
3. Move the shorter line inward (only that move can improve)
4. Track max area

**Remove duplicates / compact array:**

1. slow at write position
2. fast scans
3. When condition says "keep", write at slow, slow++

---

## 11. Dry run

Sorted two-sum: `a = [1, 2, 4, 7, 11]`, target = 9.

```text
l=0 r=4: 1+11=12 > 9 → r=3
l=0 r=3: 1+7=8  < 9 → l=1
l=1 r=3: 2+7=9  == 9 → found
```

Remove zeros move-to-end (stable keepers): `a = [0,1,0,3,12]`

```text
fast reads, slow writes non-zeros:
Write 1 at 0 → [1,1,0,3,12], slow=1
Write 3 at 1 → [1,3,0,3,12], slow=2
Write 12 at 2 → [1,3,12,3,12], slow=3
Fill rest with 0 → [1,3,12,0,0]
```

---

## 12. Visualization

```text
Two Sum sorted
[1, 2, 4, 7, 11]  target 9
 L              R     sum 12 → move R
 L          R         sum 8  → move L
    L       R         sum 9  → done
```

```text
Slow / Fast
idx:  0 1 2 3 4
val:  0 1 0 3 12
      F
      S
...
val:  1 3 12 0 0
            S  (new length 3)
```

```text
Water container
|     |
| |   | |
| | | | |
L         R
Move shorter wall inward
```

---

## 13. Complexity

| Pattern | Time | Extra space |
|---|---|---|
| Opposite ends (sorted) | O(n) after sort | O(1) |
| Slow/fast in-place | O(n) | O(1) |
| 3Sum style | O(n²) | O(1) or O(log n) sort |
| Two arrays merge | O(n+m) | O(1) if writing into buffer |

---

## 14. Why this complexity?

Pointers only move one way (or meet once). They never reset to re-scan everything. So total moves ≤ n (or n+m). That kills the hidden O(n²) factor when the invariant is valid.

If you move a pointer the wrong way, correctness breaks — complexity proofs assume the monotonic reason for each move.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

bool twoSumSorted(vector<int> a, int target) {
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

int maxArea(const vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, best = 0;
    while (l < r) {
        int height = min(h[l], h[r]);
        best = max(best, height * (r - l));
        if (h[l] < h[r]) l++;
        else r--;
    }
    return best;
}

int removeElement(vector<int>& a, int val) {
    int slow = 0;
    for (int fast = 0; fast < (int)a.size(); fast++) {
        if (a[fast] != val) a[slow++] = a[fast];
    }
    return slow;
}
```

---

## 16. STL usage

Two pointers are index logic; STL helps around them:

- `sort` before opposite-ends on unsorted data (if indices not required)
- `swap` for partition
- `reverse` is itself two pointers inside
- For linked lists, "two pointers" means node pointers (fast/slow cycle detect) — later chapter

Prefer raw indices in interviews for clarity unless iterators make the code cleaner.

---

## 17. Brute Force

```cpp
int maxAreaBrute(const vector<int>& h) {
    int n = h.size(), best = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            best = max(best, min(h[i], h[j]) * (j - i));
    return best;
}
// O(n^2)
```

---

## 18. Better

Sometimes prune with sparse tables / precomputed max — usually overkill. Sorting destroys index distance for water container, so sorting is the wrong "better." True better is the two-pointer optimal below.

For 3Sum, better than O(n³) nested three loops is: sort + fix one + two pointers → O(n²).

---

## 19. Optimal

Water container two pointers: O(n) time, O(1) space — see `maxArea` above.

Why moving shorter line is safe: width shrinks by 1; if you keep the shorter height, area cannot increase; only raising the limiting height can help.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Two pointers always needs sorted input."
  ↓
Fails: slow/fast compaction works on unsorted arrays
  ↓
Correct: Opposite-ends sum logic needs sorted order; slow/fast does not

Wrong: "Always move both pointers every step."
  ↓
Fails: You may skip the answer pair
  ↓
Correct: Move the pointer that restores the invariant

Wrong: "For water container, move the taller wall."
  ↓
Fails: Taller is not the limit; you throw away possible best width wrongly
  ↓
Correct: Move the shorter wall
```

---

## 21. Common mistakes

1. Using two pointers on unsorted data for two-sum without sorting or hashing
2. Infinite loop: forgetting `l++` or `r--`
3. `l <= r` vs `l < r` confusion for palindrome/pair
4. Overflow on `a[l] + a[r]` — use `long long`
5. Losing original indices after sort
6. Duplicate handling wrong in 3Sum (must skip same values carefully)

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "Why can two pointers find two-sum after sort?"  
**Expected:** Monotonicity of sum when moving ends; each move discards impossible pairs.

### Amazon
**Ask:** "Move zeros / remove element in-place."  
**Expected:** Slow/fast; talk about stability if required; test `[0,0,1]`.

### Microsoft
**Ask:** "3Sum — design and complexity."  
**Expected:** Sort, fix i, two-pointer left/right, skip duplicates; O(n²).

### OpenAI
**Ask:** "When would you refuse two pointers and use a hash map?"  
**Expected:** Need original indices without O(n log n) sort side effects; or no sort allowed; online stream.

**Interview phrase:**

```text
"Brute force is O(n²) pairs. Because the array can be sorted /
the height array is monotonic in width, I can maintain two pointers
and finish in O(n)."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Merge sorted logs | Two pointers on two arrays |
| Photo crop / UI ranges | Interval ends as pointers |
| Deduplicate streams | Slow/fast compaction |
| Game collision on sorted axes | Sweep with pointers |
| NLP token window prep | Often becomes sliding window |

---

## 24. Related concepts + pattern recognition cues

**Related:** sliding window, binary search, sorting, Dutch national flag (3 pointers), linked list fast/slow.

| Cue | Use two pointers? |
|---|---|
| Sorted array + pair/triplet | Yes |
| Palindrome check | Yes |
| In-place filter / partition | Yes |
| Max water / trapped ideas | Often yes |
| Contiguous subarray with sum constraint | Maybe sliding window instead |
| Need all pairs explicitly | No — output size may be O(n²) |

**Decision snack:**

```text
Need pair in sorted list? → opposite ends
Need rewrite array? → slow/fast
Need best window length? → sliding window
Need indices + unsorted? → hash map
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Two flashlights, one rule
Opposite ends for sorted pairs
Slow writes, fast reads for in-place
Move the pointer that fixes the invariant
```

### Checklist

- [ ] Draw opposite ends vs slow/fast
- [ ] Dry-run two-sum sorted + max area
- [ ] Code remove element from memory
- [ ] Explain why move shorter wall
- [ ] Know when hash beats two pointers

### Practice roadmap

1. Easy: Valid Palindrome, Remove Element, Move Zeroes, Two Sum II
2. Medium: 3Sum, Container With Most Water, Sort Colors, Trapping Rain Water (harder), Numbers with square sum style
3. Link: merge two sorted arrays, intersection of two arrays follow-ups

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recall 3 shapes + picture |
| 3 | Dry-run 3Sum duplicate skipping on paper |
| 7 | Code max area + remove element blind |
| 15 | Timed Medium two-pointer problem |
| 30 | Teach the invariant out loud |
| 90 | Mock: 3Sum + one other |

```text
Item: Two Pointers
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
