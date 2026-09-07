# Hashing — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Need fast key lookup?
  ├─ Membership only → unordered_set
  ├─ Key→value / index → unordered_map
  ├─ Sorted / order stats → set/map
  └─ Tiny int / letters → array freq

Problem shape?
  ├─ Two Sum / complement → map value→i
  ├─ Anagram / counts → freq[26] or map
  ├─ Subarray sum k (any int) → prefix + hash
  ├─ Window distinct / at most K → freq + two pointers
  ├─ Top K frequent → freq + bucket/heap
  ├─ Design map → chaining
  └─ GetRandom O(1) → vector + pos map
```

---

## Formulas

```text
// Prefix + hash subarray count
seen[0] = 1
pref += a[i]
ans += seen[pref - k]
seen[pref]++

// Load factor
α = n / m_buckets
resize when α > threshold (~0.7)

// Anagram
same length && identical counts
```

---

## Templates (C++)

### Two Sum

```cpp
unordered_map<int,int> pos;
for (int i = 0; i < n; i++) {
    int need = target - a[i];
    if (pos.count(need)) return {pos[need], i};
    pos[a[i]] = i;
}
```

### Freq / anagram

```cpp
int cnt[26] = {};
for (char c : s) cnt[c - 'a']++;
```

### Subarray sum k

```cpp
unordered_map<int,int> seen{{0,1}};
int pref = 0, ans = 0;
for (int x : a) {
    pref += x;
    ans += seen[pref - k];
    seen[pref]++;
}
```

### Erase-zero distinct

```cpp
if (--freq[x] == 0) freq.erase(x);
```

### Chaining put sketch

```cpp
auto& chain = buckets[key % MOD];
for (auto& p : chain) if (p.first == key) { p.second = val; return; }
chain.push_back({key, val});
```

### RandomizedSet delete

```cpp
int i = pos[val];
int last = vals.back();
vals[i] = last; pos[last] = i;
vals.pop_back(); pos.erase(val);
```

---

## STL Traps

```text
mp[key]      → inserts if missing
mp.count     → existence
iteration    → not sorted
pair keys    → need custom hash
reserve(n)   → fewer rehashes
```

---

## Complexity

| Tool | Avg | Worst |
|---|---|---|
| unordered_map/set | O(1) | O(n) |
| map/set | O(log n) | O(log n) |
| Design chaining (bounded α) | O(1) | O(n) |

---

## Interview Lines

```text
"Expected O(1) lookups; I'll mention O(n) collision worst case."
"For sum K with negatives: prefix sums + hash, not a basic window."
"GetRandom needs a compact vector; map alone cannot jump to k-th."
```

---

## Company Cue Map

| Flavor | Likely |
|---|---|
| Google | Prefix-hash rationale; collision theory lite |
| Amazon | Two Sum, design HashMap, top K |
| Microsoft | Anagrams, substring window, GetRandom |
| OpenAI | map vs unordered; adversary / API design |

---

## Spaced Repetition Hook

Days **1 / 3 / 7 / 15 / 30 / 90** — lesson §25 + `../00-SPACED-REPETITION.md`.
