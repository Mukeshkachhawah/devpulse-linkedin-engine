# Sliding Window Patterns

> **Goal:** Turn "longest / shortest / count of subarrays or substrings" into a moving window with a clear add/remove rule.

---

## 1. When to Use

Use sliding window when:

1. You care about a **contiguous** segment (subarray / substring).
2. The question asks for **longest**, **shortest**, **maximum**, **minimum**, or **count** under a constraint.
3. Expanding right and shrinking left can maintain a valid window in amortized O(1) per step.

**Kid idea:** A train window that grows to the right. When the view breaks the rule, close from the left until it's valid again.

**Not window:** subsequences (non-contiguous), or when any subset matters — that is often DP / two pointers on sorted / backtracking.

---

## 2. Recognition Cues

| Cue | Pattern |
|---|---|
| "longest substring / subarray such that..." | variable window maximize |
| "shortest / minimum length that..." | variable window minimize |
| "exactly k distinct / at most k" | at-most-k trick |
| "all anagrams / permutation in string" | fixed window + freq match |
| "maximum sum of size k" | fixed window |
| "contains all characters of t" | variable + need-count (minimum window) |
| "replace at most k characters" | variable with bad-count |
| "fruits into baskets / at most 2 types" | at most k distinct |

**Smell test:** Nested loops `for L; for R` over contiguous ranges → try window.

---

## 3. Template Skeletons (C++)

### A. Fixed Size Window

```cpp
// Max sum of any subarray of size k
long long maxSumFixed(const vector<int>& a, int k) {
    long long sum = 0, best = LLONG_MIN;
    for (int i = 0; i < (int)a.size(); ++i) {
        sum += a[i];
        if (i >= k) sum -= a[i - k];
        if (i >= k - 1) best = max(best, sum);
    }
    return best;
}
```

### B. Variable Window — Maximize Length

```cpp
// Longest substring with at most k distinct characters
int longestAtMostK(const string& s, int k) {
    unordered_map<char, int> freq;
    int L = 0, best = 0;
    for (int R = 0; R < (int)s.size(); ++R) {
        ++freq[s[R]];
        while ((int)freq.size() > k) {
            if (--freq[s[L]] == 0) freq.erase(s[L]);
            ++L;
        }
        best = max(best, R - L + 1);
    }
    return best;
}
```

### C. Variable Window — Minimize Length

```cpp
// Minimum window substring covering all chars of t
string minWindow(string s, string t) {
    vector<int> need(128, 0);
    for (char c : t) ++need[c];
    int missing = (int)t.size();
    int L = 0, bestL = 0, bestLen = INT_MAX;
    for (int R = 0; R < (int)s.size(); ++R) {
        if (need[s[R]] > 0) --missing;
        --need[s[R]];
        while (missing == 0) {
            if (R - L + 1 < bestLen) {
                bestLen = R - L + 1;
                bestL = L;
            }
            ++need[s[L]];
            if (need[s[L]] > 0) ++missing;
            ++L;
        }
    }
    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}
```

### D. At-Most → Exactly Trick

```cpp
// Number of subarrays with exactly k distinct:
// atMost(k) - atMost(k - 1)
int atMost(const vector<int>& a, int k) {
    if (k < 0) return 0;
    unordered_map<int, int> freq;
    int L = 0, ans = 0;
    for (int R = 0; R < (int)a.size(); ++R) {
        ++freq[a[R]];
        while ((int)freq.size() > k) {
            if (--freq[a[L]] == 0) freq.erase(a[L]);
            ++L;
        }
        ans += R - L + 1; // all windows ending at R
    }
    return ans;
}
int exactlyK(const vector<int>& a, int k) {
    return atMost(a, k) - atMost(a, k - 1);
}
```

### E. Fixed Window Anagram / Permutation Check

```cpp
bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    vector<int> need(26, 0), win(26, 0);
    for (char c : s1) ++need[c - 'a'];
    int k = (int)s1.size();
    for (int i = 0; i < (int)s2.size(); ++i) {
        ++win[s2[i] - 'a'];
        if (i >= k) --win[s2[i - k] - 'a'];
        if (i >= k - 1 && win == need) return true;
    }
    return false;
}
```

---

## 4. Common Variants

| Variant | What you track | Update answer when |
|---|---|---|
| Fixed sum / avg | running sum | window full |
| Max length valid | freq / sum / zeros | after shrink to valid |
| Min length valid | need counts | while still valid, shrink |
| Count subarrays | `ans += R-L+1` | every R |
| At most k → exact | two atMost calls | difference |
| Monotonic deque | max/min in window | after push/pop |
| String covering | missing + need[] | missing == 0 |

---

## 5. Traps

1. **Using window for non-contiguous** problems.  
2. **Shrinking wrong side** or forgetting to update freq when leaving.  
3. **`freq.size()` with zeros left in map** — erase when count hits 0.  
4. **Exactly k** solved with one broken while — use atMost trick.  
5. **Negative numbers** with "max sum size k" is fine; for Kadane it's different (not fixed window).  
6. **Character set:** use array[128]/[26] when alphabet is small.  
7. **Off-by-one:** answer length is `R - L + 1`.  
8. **Moving L past R** — keep `while (invalid && L <= R)`.

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Reset window from scratch each time" | O(n²) | Slide: add R, remove L only |
| "Exactly k = one window loop with == k" | Misses nested counts | atMost(k) − atMost(k−1) |
| "Longest + shrink when valid" | Shrinks too early | For maximize: shrink only when invalid |
| "Minimum: keep expanding forever" | Never records min | Shrink while valid and track best |
| "Deque for every window" | Overkill if only sum | Deque only for range max/min |

---

## 7. Decision Mini-Tree

```text
Contiguous + constraint?
├─ Fixed length k?
│  ├─ Sum / avg / anagram → Fixed Window
│  └─ Max / min in window → Deque Window
└─ Variable length?
   ├─ Longest valid → Expand R, shrink while invalid, track max
   ├─ Shortest valid → Expand until valid, shrink while valid, track min
   └─ Count / exactly k → atMost trick or ans += R-L+1
```

---

## 8. Example Problems

1. Maximum Average Subarray I  
2. Longest Substring Without Repeating Characters  
3. Longest Substring with At Most K Distinct Characters  
4. Minimum Window Substring  
5. Find All Anagrams in a String  
6. Permutation in String  
7. Fruit Into Baskets  
8. Max Consecutive Ones III  
9. Subarrays with K Different Integers  
10. Longest Repeating Character Replacement  
11. Sliding Window Maximum  
12. Minimum Size Subarray Sum  
13. Number of Substrings Containing All Three Characters  
14. Max Sum of Distinct Subarrays With Length K  
15. Grumpy Bookstore Owner  

---

## 9. Complexity

Usually **O(n)** time: each index enters and leaves the window at most once.  
Extra space: O(alphabet) or O(k) for the map/deque.

---

## 10. Interview Script

> "I'll keep a window [L, R]. I expand R. When the window breaks the rule, I advance L until it's valid again. Because L and R only move forward, total time is O(n)."

---

## Revision Checklist

- [ ] Fixed vs variable vs count templates memorized  
- [ ] Know when to maximize vs minimize shrink rule  
- [ ] Can explain atMost → exactly  
- [ ] Can code min-window covering  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 1 fixed + 2 variable + 1 count weekly.
