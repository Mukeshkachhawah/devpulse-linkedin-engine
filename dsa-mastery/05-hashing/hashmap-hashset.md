# HashMap & HashSet — Core Lesson

> Previous: Stacks & Queues. Next: Frequency Counting Patterns. Related: Collision & Design.

---

## 1. What is it?

A **HashSet** stores unique keys for fast “have I seen this?”  
A **HashMap** (hash table) stores **key → value** pairs for fast lookup/update.

Average goal: **O(1)** insert, erase, find (amortized / expected).

```text
HashSet:  {3, 1, 7}           // membership
HashMap:  {"apple" → 4}       // key to value
```

In C++: `unordered_set`, `unordered_map` (hash-based).  
Sorted cousins: `set`, `map` (trees) — O(log n), ordered.

---

## 2. Explain like I am 10

Imagine a huge wall of labeled mailboxes.

You take a name, run a magic number machine (**hash function**), and it tells you which mailbox number. You put the toy in that box.

Later, same name → same number → you open that box and find the toy fast. You do not search every mailbox.

**HashSet** = only care if the box is non-empty for that name.  
**HashMap** = box holds a note (the value).

**Memory picture:** name → magic number → mailbox.

---

## 3. Real life story

Dictionary: word → definition. You do not skim every page in order if you somehow jump near the right page — hashing jumps even more directly (in computer form).

Phone contacts: name → number.

Login systems: user id → profile record (with care for security — not plain teaching hashes for passwords).

---

## 4. Why does this exist?

Arrays give O(1) only for integer indices in a tight range.  
Scanning a list for a key is O(n).

Hash tables give near O(1) for arbitrary keys (strings, ints, pairs) when the hash spreads well.

Many interview problems become easy once you trade O(n) space for O(1) lookups (Two Sum).

---

## 5. What problem existed before this?

People used:

- Sorted arrays + binary search O(log n)  
- Balanced trees O(log n)  
- Huge direct-address arrays when keys were small integers  

Need: average constant time without requiring tiny integer keys.

---

## 6. What happens without it?

- Two Sum stays O(n²) or needs sort+two pointers (loses indices unless careful)  
- Frequency problems need slow scans  
- Graph adjacency by string ids is painful  
- Dedup streams become O(n²)  

---

## 7. How did people invent this?

Hashing ideas mid-20th century; open addressing and chaining evolved in systems and databases.

C++ `unordered_map` standardized later (TR1 / C++11). Interviews expect the ADT more than your own hash table — unless they ask you to design one (next collision lesson).

---

## 8. Computer intuition

```text
index = hash(key) % bucket_count
store (key, value) in that bucket (chain or probe)
```

**Collision:** two keys → same bucket. Handled by chaining (list/vector per bucket) or open addressing (probe next slot).

**Load factor:** n / buckets. When high, rehash to more buckets.

**Correctness requirement:** must store full key and compare — hash only suggests where to look. Different keys may share a hash.

---

## 9. Mathematical intuition

If hash distributes uniformly and load factor α is bounded, expected chain length O(1+α) → expected O(1) ops.

Worst case O(n) if all keys collide (adversarial). C++ `unordered_map` average O(1), worst O(n). For strict worst-case O(log n), use `map`.

Universe of keys huge; table size m small — pigeonhole ⇒ collisions inevitable; design handles them.

---

## 10. Step-by-step working

### Two Sum

1. Empty map `value → index`  
2. For each i: need = target - a[i]; if need in map → answer  
3. Else map[a[i]] = i  

### Dedup / unique

Insert into set; size or iterate.

### Count frequency

`map[x]++` for each x.

### Group anagrams

Key = sorted string or count signature → list of words.

---

## 11. Dry run

Two Sum `a=[2,7,11,15], target=9`

```text
i=0, 2: need 7 — miss; map{2:0}
i=1, 7: need 2 — hit at 0 → [0,1]
```

Set insert `3,1,3,2`:

```text
{3} → {3,1} → {3,1} → {3,1,2}
```

---

## 12. Visualization

```text
key "cat" → hash → 42 → 42 % 8 = 2

buckets:
0: →
1: →
2: → ("cat",3) → ("dog",1)   ← chain collision example
3: →
...
```

Sticky picture: magic mailbox wall.

---

## 13. Complexity

| Structure | Find/Insert/Erase average | Worst | Ordered? |
|---|---|---|---|
| unordered_map/set | O(1) | O(n) | No |
| map/set | O(log n) | O(log n) | Yes |
| vector scan | O(n) | O(n) | By index |

Space: O(n) stored keys.

---

## 14. Why this complexity?

Expected short chains under uniform hashing + resizing. Tree map height O(log n). Worst-case hash pile-up is why interviews may ask “what if adversary?”

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& a, int target) {
    unordered_map<int,int> pos;
    for (int i = 0; i < (int)a.size(); i++) {
        int need = target - a[i];
        if (pos.count(need)) return {pos[need], i};
        pos[a[i]] = i;
    }
    return {};
}

bool containsDuplicate(vector<int>& a) {
    unordered_set<int> s;
    for (int x : a) {
        if (s.count(x)) return true;
        s.insert(x);
    }
    return false;
}

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (auto& w : strs) {
        string key = w;
        sort(key.begin(), key.end());
        groups[key].push_back(w);
    }
    vector<vector<string>> ans;
    for (auto& [k, v] : groups) ans.push_back(move(v));
    return ans;
}

// Custom pair hash example
struct PairHash {
    size_t operator()(const pair<int,int>& p) const {
        return hash<long long>()(((long long)p.first << 32) ^ (unsigned)p.second);
    }
};
unordered_map<pair<int,int>, int, PairHash> pointCount;
```

---

## 16. STL usage

```cpp
unordered_map<string,int> mp;
mp["a"] = 1;
mp.count("a");           // 0 or 1
if (auto it = mp.find("a"); it != mp.end()) ...
mp.erase("a");

unordered_set<int> st;
st.insert(3);
st.count(3);

map<int,int> ordered;    // sorted keys
set<int> os;

// Iterate unordered: NO sorted order guarantee
```

**Traps:**

- `mp[key]` **creates** default value if missing — use `find`/`count` when probing  
- `unordered_map` iteration order is meaningless  
- Floating keys as hash keys — equality pain; avoid  
- Need hash for `pair`, `vector` — define custom  

---

## 17. Brute Force

```cpp
// Two Sum brute
for (int i = 0; i < n; i++)
  for (int j = i+1; j < n; j++)
    if (a[i]+a[j]==target) return {i,j};
// O(n²) time, O(1) space
```

---

## 18. Better

Sort + two pointers O(n log n) for values — but recovering original indices needs pairs. Hash map is usually the clean O(n) time / O(n) space better/optimal for Two Sum.

Tree map O(n log n) if you need order.

---

## 19. Optimal

Two Sum: O(n) time, O(n) space with hash map — standard optimal for unrestricted arrays.

Membership / dedup: O(n) expected with set.

When keys are 0..U small, **array frequency** beats hash (faster constant).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "HashMap is always O(1), even worst case."
  ↓
Fails: Adversarial collisions → O(n)
  ↓
Correct: Expected/amortized O(1); mention worst case; use map if need guarantees

Wrong: "if (mp[key]) checks existence."
  ↓
Fails: Inserts 0; also fails when stored value is 0
  ↓
Correct: mp.count(key) / find

Wrong: "Set and map are the same as unordered_*."
  ↓
Fails: Ordered trees vs hash; complexity and order differ
  ↓
Correct: Pick by need for order vs average speed
```

---

## 21. Common mistakes

1. Using `operator[]` for existence checks  
2. Forgetting custom hash for pair keys  
3. Assuming iteration is sorted  
4. Integer overflow in `target - a[i]` — use careful types  
5. Putting mutable objects as keys and then mutating  
6. Rehash invalidating assumptions about pointer stability (rare interview)  
7. Using hash set when frequency map needed  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Two Sum — follow-up: what if array is sorted? What if streamed?”  
**Expected:** Sorted → two pointers; stream → hash of seen; discuss memory.

### Amazon
**Ask:** “Contains duplicate / First unique character.”  
**Expected:** Set or frequency map; clear complexity; edge empty.

### Microsoft
**Ask:** “Group anagrams — design the key.”  
**Expected:** Sorted string or 26-count tuple; hash map to groups; O(n * k log k) or O(n*k).

### OpenAI
**Ask:** “When choose `map` over `unordered_map`?”  
**Expected:** Need sorted order / lower_bound; worst-case guarantees; small n where log fine; hashing overhead / bad hash.

**Interview phrase:**

```text
"I'll trade O(n) space for expected O(1) lookups with an unordered_map,
and I'll use find/count so I don't accidentally insert keys."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Caches (idea) | key → value |
| Indexes / dictionaries | Hash maps |
| Deduping events | Sets |
| Routing tables (simplified) | Hash |
| Counting analytics | Freq maps |
| Graph node id → adjacency | Map |

---

## 24. Related concepts + pattern recognition cues

**Related:** frequency patterns, prefix+hash, collision design, tree maps, bloom filters (advanced).

| Cue | Tool |
|---|---|
| Need index of value fast | Hash map |
| Seen before? | Hash set |
| Count occurrences | Freq map |
| Ordered keys / kth | `set`/`map` / heap |
| Tiny int range | Array |

**Decision snack:**

```text
Lookup by key? → hash map/set
Need sorted traversal? → tree map/set
Keys 0..10^6 tight + freq? → array
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Mailbox = hash table
Set = membership; Map = key→value
Expected O(1); worst O(n)
count/find not [] for existence
Custom hash for pairs
```

### Checklist

- [ ] Two Sum dry-run  
- [ ] Explain collision in one sentence  
- [ ] Code with `unordered_map` without `[]` bug  
- [ ] Contrast map vs unordered_map  
- [ ] Group anagrams key choice  

### Practice roadmap

1. Easy: Two Sum, Contains Duplicate, First Unique Char, Intersection of Arrays  
2. Medium: Group Anagrams, Top K Frequent (heap+hash), Subarray Sum Equals K  
3. Design: Insert Delete GetRandom O(1)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Mailbox picture + Two Sum dry-run |
| 3 | Code Two Sum + containsDuplicate blind |
| 7 | Group anagrams + [] trap quiz |
| 15 | Timed Medium hash problem |
| 30 | Teach expected vs worst case |
| 90 | Mock: Two Sum + anagrams + design |

```text
Item: HashMap & HashSet
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
