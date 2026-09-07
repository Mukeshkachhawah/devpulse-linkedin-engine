# Frequency Counting Patterns — Core Lesson

> Previous: HashMap & HashSet. Next: Collision & Design. Cousin: Sliding Window with maps.

---

## 1. What is it?

**Frequency counting** means you count how often each key appears, then answer questions from those counts.

Patterns:

1. **Build freq map** then scan  
2. **Running freq** while iterating (anagrams, windows)  
3. **Prefix sum + hash** for subarray sums  
4. **Count array[26]** / `[101]` when alphabet/range tiny  
5. **Compare two freq signatures** (anagram, isomorphic ideas)

```text
"banana" → {b:1, a:3, n:2}
```

---

## 2. Explain like I am 10

You have a jar of colored candies. Before answering “do I have 3 red?”, you make a tally chart.

Many problems are candy tallies in disguise: letters, numbers, votes.

**Memory picture:** tally marks on a clipboard — or 26 pockets for letters A–Z.

---

## 3. Real life story

Election vote counting. Word games (anagrams): same letter tallies. Store inventory: SKU → quantity.

In interviews: “longest substring without repeating” mixes window + last-seen index/freq.

---

## 4. Why does this exist?

Scanning for each query “how many x?” is slow. Precompute counts in O(n), answer in O(1) per key.

Comparing multisets becomes comparing count maps / signatures.

---

## 5. What problem existed before this?

Nested loops: for each position, recount a range — O(n²) or worse. Sorting each string to compare anagrams works but can be slower than count vectors.

---

## 6. What happens without it?

- Anagram checks resort every time  
- Subarray sum equals K feels impossible in O(n)  
- Top-K frequent needs full sorts every time  
- Window “at most K distinct” lacks the counter tool  

---

## 7. How did people invent this?

Counting sort / bucket ideas are ancient. Prefix sums + hashmap for subarray sums is a standard modern interview mashup. Competitive programming crystallized “freq map + two pointers.”

---

## 8. Computer intuition

```cpp
unordered_map<int,int> freq;
for (int x : a) freq[x]++;

int freq26[26] = {};
for (char c : s) freq26[c - 'a']++;
```

**Invariant in windows:** maintain counts of current segment; expand right; shrink left while invalid; track answer.

**Prefix + hash:**

```text
pref = 0
map: sum → count of how many prefixes had that sum
for x in a:
  pref += x
  ans += map[pref - k]
  map[pref]++
```

---

## 9. Mathematical intuition

Anagram: two strings equal as multisets ⇔ same counts for every character.

Subarray sum: `sum[l..r] = pref[r+1]-pref[l] = k` ⇔ `pref[l] = pref[r+1]-k`. Counting prior prefixes gives O(1) expected lookups.

Distinct count in window: size of keys with positive freq — update carefully when counts hit 0 (erase key).

---

## 10. Step-by-step working

### Valid anagram

Count letters of s; decrement with t; all zero.

### Top K frequent

Freq map → bucket sort by frequency (array of lists) or heap.

### Subarray sum equals K

Prefix + unordered_map counts.

### Longest substring without repeat

Window + last index or count; shrink when duplicate.

### Isomorphic strings / word pattern

Two maps or map+set for bijection.

---

## 11. Dry run

Subarray sum = 3, `a=[1,2,3]`, k=3:

```text
start map{0:1}
i0: pref=1; need -2? 1-3=-2 miss; map{0:1,1:1}
i1: pref=3; need 0 → +1 (subarray [1,2]); map{...,3:1}
i2: pref=6; need 3 → +1 (subarray [3]); 
ans=2
```

Anagram `"anagram"` / `"nagaram"`: counts match all 26.

---

## 12. Visualization

```text
FREQ MAP BUILD

a = [1, 2, 1, 3, 1]
1: ███  3
2: █    1
3: █    1

PREFIX + HASH

index:   0  1  2  3
a:       1  2 -1  3
pref:    1  3  2  5
For k=3, when pref=5, look for pref=2 → found
```

Sticky: clipboard tallies + running coin pile (prefix).

---

## 13. Complexity

| Pattern | Time | Space |
|---|---|---|
| Freq build | O(n) | O(#distinct) |
| Anagram 26 | O(n) | O(1) |
| Subarray sum k | O(n) expected | O(n) |
| Top K + buckets | O(n) | O(n) |
| Top K + heap | O(n log k) | O(n) |

---

## 14. Why this complexity?

Each element updates a hash bucket O(1) expected. Alphabet fixed → array O(1) space. Prefix map stores ≤ n+1 sums.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int cnt[26] = {};
    for (char c : s) cnt[c - 'a']++;
    for (char c : t) if (--cnt[c - 'a'] < 0) return false;
    return true;
}

int subarraySum(vector<int>& a, int k) {
    unordered_map<int,int> seen;
    seen[0] = 1;
    int pref = 0, ans = 0;
    for (int x : a) {
        pref += x;
        ans += seen[pref - k]; // careful: [] inserts 0 — OK here for miss
        seen[pref]++;
    }
    return ans;
}

vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [val, f] : freq) buckets[f].push_back(val);
    vector<int> ans;
    for (int f = (int)buckets.size() - 1; f >= 0 && (int)ans.size() < k; f--)
        for (int v : buckets[f]) {
            ans.push_back(v);
            if ((int)ans.size() == k) return ans;
        }
    return ans;
}

int lengthOfLongestSubstring(string s) {
    vector<int> last(256, -1);
    int best = 0, left = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        unsigned char c = s[i];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = i;
        best = max(best, i - left + 1);
    }
    return best;
}
```

---

## 16. STL usage

```cpp
unordered_map<int,int> freq;
for (int x : a) freq[x]++;

// erase zero counts in window patterns:
if (--freq[x] == 0) freq.erase(x);

multiset / map for ordered freqs when needed
```

Prefer `int cnt[26]` when only lowercase letters — faster and simpler.

---

## 17. Brute Force

```cpp
// count subarrays with sum k
int ans = 0;
for (int i = 0; i < n; i++) {
    int s = 0;
    for (int j = i; j < n; j++) {
        s += a[j];
        if (s == k) ans++;
    }
}
// O(n²)
```

---

## 18. Better

Sorting + two pointers for some pair-count problems. For subarray sum with **only positives**, sliding window can work — **not** with negatives (use prefix+hash).

---

## 19. Optimal

Prefix + hash for general subarray sum k: O(n) expected.  
Anagram: O(n) with 26.  
Top K: bucket O(n) when freq ≤ n.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Sliding window solves every subarray sum equals K."
  ↓
Fails: Negatives break the "shrink when too big" rule
  ↓
Correct: Prefix + hash for any ints; window only for non-negative special cases

Wrong: "freq[x]-- to 0 can leave dead keys forever — fine always."
  ↓
Fails: "map.size() as distinct count" becomes wrong
  ↓
Correct: erase keys when count hits 0 if you use size as distinct

Wrong: "Anagram = sort both always best."
  ↓
Fails: OK but count array faster for lowercase
  ↓
Correct: Choose signature by alphabet size
```

---

## 21. Common mistakes

1. Forgetting `seen[0]=1` in subarray sum  
2. Using window for negative sums  
3. Distinct count without erasing zeros  
4. `char` signed `c-'a'` bugs — cast carefully  
5. Top K off-by-one in bucket size  
6. Mutating map while iterating wrongly  
7. Confusing index map vs frequency map  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Subarray sum equals K — why not window?”  
**Expected:** Negatives; prefix-hash derivation; O(n) space tradeoff.

### Amazon
**Ask:** “Top K frequent elements.”  
**Expected:** Freq map + bucket or heap; compare complexities; stable/order follow-ups.

### Microsoft
**Ask:** “Longest substring without repeating characters.”  
**Expected:** Window + last seen; O(n); dry-run `pwwkew`.

### OpenAI
**Ask:** “Design a frequency signature for Unicode vs a–z.”  
**Expected:** `unordered_map<char,int>` vs fixed array; memory/perf tradeoffs; normalization talk.

**Interview phrase:**

```text
"I'll build frequencies in one pass, or maintain them in a window.
For subarray sum K with any integers, I'll use prefix sums plus a hash map."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Analytics event counts | Freq maps |
| Spam / rate signals | Rolling counts |
| Search autocomplete stats | Freq |
| Inventory | SKU counts |
| NLP bag-of-words | Letter/word freq |
| Detect anagram puzzles | Signatures |

---

## 24. Related concepts + pattern recognition cues

**Related:** sliding window, prefix sums, hashing basics, heaps for top-K, counting sort.

| Cue | Pattern |
|---|---|
| Same letters different order | Anagram counts |
| Subarray sum k (any int) | Prefix + hash |
| At most K distinct | Window + freq map |
| Top K frequent | Freq + bucket/heap |
| First unique | Freq + order queue/list |

**Decision snack:**

```text
Counts of keys? → freq map/array
Range sum equals k + negatives? → prefix hash
Contiguous property + shrinkable? → window + freq
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Tally first, answer second
26 pockets for a–z
Prefix + hash for sum = k
Erase zero keys if size means distinct
Window ≠ universal subarray tool
```

### Checklist

- [ ] Dry-run subarray sum map  
- [ ] Code anagram with cnt[26]  
- [ ] Explain negatives vs window  
- [ ] Top K buckets sketch  
- [ ] Window distinct erase-0 rule  

### Practice roadmap

1. Easy: Valid Anagram, Ransom Note, First Unique Character  
2. Medium: Subarray Sum Equals K, Top K Frequent, Longest Substring Without Repeat, Fruit Into Baskets  
3. Harder: Minimum Window Substring, Subarrays with K Different Integers  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Tally picture + pref-hash dry-run |
| 3 | Code subarraySum + isAnagram |
| 7 | Top K + longest unique substring |
| 15 | Timed Minimum Window (if ready) |
| 30 | Teach when window fails for sums |
| 90 | Mock: sum k + top k + anagram |

```text
Item: Frequency Counting Patterns
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
