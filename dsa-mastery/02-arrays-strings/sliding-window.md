# Sliding Window — Core Lesson

> Previous: Arrays, Strings, Two Pointers. Cousin of two pointers for contiguous segments.

---

## 1. What is it?

A **sliding window** is a contiguous segment `[left, right]` that moves across an array or string. You grow or shrink the window while maintaining a condition (sum, unique chars, max, etc.).

Two flavors:

1. **Fixed size** — window length is always `k`
2. **Variable size** — length changes; find longest/shortest that satisfies a rule

```text
Array:  [2, 1, 5, 1, 3, 2]   k=3 fixed
Windows:[2,1,5] → [1,5,1] → [5,1,3] → [1,3,2]
```

---

## 2. Explain like I am 10

Imagine looking at a comic strip with a cardboard frame that covers a few panels.

You read those panels, then slide the frame one step to the right. You do not restart from the first panel every time — you reuse what you already know (maybe subtract the panel that left, add the new one).

**Memory picture:** a moving picture frame on a long mural.

```text
|###|......   then  .|###|.....  then  ..|###|....
```

---

## 3. Real life story

Phone battery usage for the last 7 days. Every new day, drop the oldest day and add today. That is a fixed window of size 7.

Or: longest stretch of days you exercised without a rest day — window grows while condition holds, shrinks when broken. Variable window.

---

## 4. Why does this exist?

Many problems ask about a **contiguous** part. Brute force checks every `left` and `right` → O(n²) windows, often O(n³) work if each window is rescanned.

Sliding window reuses work: each element enters once and leaves once → about O(n).

---

## 5. What problem existed before this?

People nested loops:

```text
for left:
  for right:
    scan left..right to test condition
```

Correct, slow, common timeout at n ≥ 10^4 or 10^5.

---

## 6. What happens without it?

You miss the standard path for:

- Max sum of size k
- Longest substring without repeat
- Minimum window containing all needed chars
- Longest subarray with sum ≤ K (non-negative)

These are interview favorites. Without the pattern, you invent fragile O(n²) code under pressure.

---

## 7. How did people invent this?

From running averages and from two pointers on sequences where the condition is **monotonic**: once a window becomes invalid, moving `left` forward is the way to fix it; you never need to pull `left` backward.

That monotonic structure is the invention insight. When the property is not monotonic, pure sliding window may not apply (then use other tools).

---

## 8. Computer intuition

Maintain state of the current window:

```text
sum, count of distinct chars, frequency map, max deque, etc.
```

Template (variable — longest):

```text
left = 0
for right in 0..n-1:
  add a[right] into window state
  while window is invalid:
    remove a[left] from state
    left++
  update answer with window [left, right]
```

Fixed size:

```text
build first k
answer = state
for right = k..n-1:
  add a[right]
  remove a[right-k]
  update answer
```

---

## 9. Mathematical intuition

Each index is added at most once and removed at most once → O(n) additions/removals.

If each add/remove is O(1) or O(log n), total is O(n) or O(n log n).

Number of contiguous subarrays is n(n+1)/2. Sliding window does not list them all; it only visits the useful frontier of windows.

**Caution:** For variable windows with **negative numbers** and sum targets, classic shrink-while logic can break. Then prefer prefix sum + hash map.

---

## 10. Step-by-step working

**Max sum subarray of size k:**

1. Sum first k elements → best
2. For each new end: add new, subtract left-out, update best

**Longest substring without repeating chars:**

1. Expand right, record last seen / counts
2. While duplicate exists, advance left past the conflict
3. Track max length

**Minimum window substring (hard):**

1. Need map of required counts
2. Expand right until window covers need
3. Shrink left while still valid; track minimum length window
4. Continue

---

## 11. Dry run

Max sum, k=3, `a = [2,1,5,1,3,2]`

```text
sum=2+1+5=8  best=8
+1 -2 → sum=7  best=8
+3 -1 → sum=9  best=9
+2 -5 → sum=6  best=9
Answer 9
```

Longest unique: `s = "abcba"`

```text
r on a: window "a" len1
r on b: "ab" len2
r on c: "abc" len3
r on b: duplicate → move left to index of old b + 1 → "cb" then add logic...
Careful dry-run with last[]:
Better practice on "abba" and "pwwkew" from memory after coding.
```

Dry-run `"pwwkew"`:

```text
p → "p"
pw → "pw"
pww → shrink to "w"
wke → "wke"
kew → "kew" length 3 best
```

---

## 12. Visualization

```text
Fixed k=3
[2|1|5|1|3|2]
 ***
  ***
   ***
    ***
```

```text
Variable unique chars
a b c a b c b b
L     R          valid "abca"? no — shrink
  L   R          ...
```

```text
State machine
ADD right → while bad: DROP left → RECORD answer
```

---

## 13. Complexity

- Fixed window sum: **O(n)** time, **O(1)** space  
- Variable with map of alphabet: **O(n)** time, **O(σ)** space (σ = alphabet)  
- Min window with hash maps: **O(n)** over alphabet operations if careful  

Avoid rescanning the whole window each step — that reintroduces O(n²).

---

## 14. Why this complexity?

Amortized analysis: `left` and `right` only increase. Total while-loop iterations across the whole run ≤ n.

If you do `for (i=left; i<=right; i++)` inside, you destroy the complexity. Maintain incremental state instead.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int maxSumFixedK(const vector<int>& a, int k) {
    int n = a.size();
    if (k > n || k <= 0) return 0;
    int sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];
    int best = sum;
    for (int i = k; i < n; i++) {
        sum += a[i] - a[i - k];
        best = max(best, sum);
    }
    return best;
}

int longestUnique(const string& s) {
    vector<int> last(256, -1);
    int best = 0, left = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        unsigned char c = s[right];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        best = max(best, right - left + 1);
    }
    return best;
}

// Longest subarray with sum <= goal (non-negative nums)
int longestSumAtMost(const vector<int>& a, int goal) {
    int left = 0, sum = 0, best = 0;
    for (int right = 0; right < (int)a.size(); right++) {
        sum += a[right];
        while (left <= right && sum > goal) {
            sum -= a[left];
            left++;
        }
        best = max(best, right - left + 1);
    }
    return best;
}
```

---

## 16. STL usage

| Tool | Role in windows |
|---|---|
| `unordered_map` / `array<int,256>` | Char frequencies |
| `deque` | Monotonic queue for max in window |
| `set` / `multiset` | Ordered window stats (O(log n) updates) |
| `string` indices | Prefer indices over `substr` copies |

Monotonic deque for "max of every window of size k" is an advanced sliding-window twin — learn after the basic template is solid.

---

## 17. Brute Force

```cpp
int maxSumBrute(const vector<int>& a, int k) {
    int n = a.size(), best = INT_MIN;
    for (int i = 0; i + k - 1 < n; i++) {
        int sum = 0;
        for (int j = i; j < i + k; j++) sum += a[j];
        best = max(best, sum);
    }
    return best;
}
// O(n*k)
```

---

## 18. Better

Prefix sums: any window sum in O(1) after O(n) preprocess → O(n) to find max of fixed k (still O(n) windows). Good bridge to the prefix-sum chapter.

```text
sum(l..r) = pref[r+1] - pref[l]
```

---

## 19. Optimal

Incremental fixed window: O(n) time, O(1) space — `maxSumFixedK`.

For longest unique substring: O(n) with last-seen index — `longestUnique`.

For minimum window substring: O(n) two maps / counters with `have`/`need` integers — code carefully in practice; state it as expand until valid, shrink to minimize.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Sliding window works for every subarray sum problem."
  ↓
Fails: negatives break shrink-while-sum>X logic
  ↓
Correct: Non-negative → window; negatives → prefix + hash (or other)

Wrong: "I must restart left at 0 for every right."
  ↓
Fails: That is O(n²) and misses reuse
  ↓
Correct: left only moves forward

Wrong: "Fixed and variable are totally different skills."
  ↓
Fails: You memorize two unrelated codes
  ↓
Correct: Same frame idea; only shrink rules change
```

---

## 21. Common mistakes

1. Updating answer in the wrong place (before vs after shrink)
2. Off-by-one length: `right - left + 1`
3. Forgetting to remove the leaving element’s frequency
4. Using window on negative sums incorrectly
5. Shrinking with `if` instead of `while` when multiple removes needed
6. Copying substrings each step → TLE + mess

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "When does sliding window apply?"  
**Expected:** Contiguous segment; monotonic validity as left moves; each element enter/leave once.

### Amazon
**Ask:** "Maximum average subarray of size k."  
**Expected:** Fixed window; watch integer vs double; edge k==n.

### Microsoft
**Ask:** "Longest substring with at most K distinct characters."  
**Expected:** Variable window + frequency map; shrink while distinct > K.

### OpenAI
**Ask:** "Stream of tokens — longest window with property X under memory cap."  
**Expected:** Online sliding window; clarify alphabet; discuss map growth; maybe approximate structures if huge.

**Speak this structure:**

```text
I'll use a sliding window.
Maintain ___ as window state.
Expand right; while invalid, advance left.
Answer is max/min of valid windows.
Time O(n) because left and right only increase.
```

---

## 23. Company use cases

| System | Window idea |
|---|---|
| Rate limiting | Requests in last 60 seconds |
| Analytics | Rolling DAU / revenue |
| Video / audio | Frames in a time window |
| Fraud detection | Transactions in last N minutes |
| LLM serving | Context window of tokens (conceptual cousin) |

---

## 24. Related concepts + pattern recognition cues

**Related:** two pointers, prefix sum, deque/monotonic queue, hash maps.

| Cue | Pattern |
|---|---|
| "longest/shortest contiguous" | Sliding window |
| "exactly/at most K distinct" | Window + counts |
| "subarray sum equals K" with negatives | Prefix + hash (not basic window) |
| "every window of size k max" | Deque sliding window |
| Non-contiguous | Not a window — maybe DP/subset |

```text
Hear "contiguous" + "longest/shortest/max sum of size k"
        ↓
Try sliding window first
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Cardboard frame on a mural
Add right, drop left when invalid
Fixed k vs grow/shrink variable
No negatives for classic sum windows
```

### Checklist

- [ ] Write fixed-k template from memory
- [ ] Write variable longest template from memory
- [ ] Dry-run longest unique on `"pwwkew"`
- [ ] Explain enter-once leave-once O(n)
- [ ] Know when to switch to prefix+hash

### Practice roadmap

1. Easy: Max Sum / Max Average of size K
2. Medium: Longest Substring Without Repeating, Longest with K distinct, Fruits into Baskets
3. Hard: Minimum Window Substring, Sliding Window Maximum (deque)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recall templates + picture |
| 3 | Dry-run min-window idea with counts on paper |
| 7 | Code fixed k + longest unique blind |
| 15 | Timed Medium window problem |
| 30 | Teach enter/leave amortized proof |
| 90 | Mock: one fixed + one variable |

```text
Item: Sliding Window
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
