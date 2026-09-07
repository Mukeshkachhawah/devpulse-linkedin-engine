# Collisions & Hash Table Design — Core Lesson

> Previous: Frequency Patterns. Caps the hashing module. Interview favorite: design a hash map / random set.

---

## 1. What is it?

A **collision** happens when two different keys get the same hash bucket index.

**Hash table design** means you choose:

1. Hash function  
2. Collision strategy (**chaining** vs **open addressing**)  
3. Resize / load factor policy  
4. API: `put`, `get`, `remove` (and sometimes getRandom)

```text
hash("apple") % 4 == 2
hash("lemon") % 4 == 2   ← collision — both want bucket 2
```

---

## 2. Explain like I am 10

Two kids compute the same mailbox number with the magic machine. The mailbox can hold a **small hanging list** of bags (chaining), or the second kid walks to the next empty mailbox (open addressing).

When too many bags pile up, you build a wall with more mailboxes and re-sort everyone (**rehash**).

**Memory picture:** crowded mailbox → hang a hook list, or walk to the next free box.

---

## 3. Real life story

Library using last two digits of phone numbers as shelf codes — many people share codes → each code has a small drawer list.

Or parking: assigned spot taken → next open spot (linear probe).

---

## 4. Why does this exist?

Perfect unique index for every possible key is impossible (too much memory). Collisions are certain; good design keeps buckets short and operations fast on average.

Interviews ask you to **build** Tiny HashMap to see if you understand the guts, not only `unordered_map`.

---

## 5. What problem existed before this?

Direct addressing: array size = universe — only works for tiny key ranges. Without collision plans, two keys smash one slot and lose data.

---

## 6. What happens without it?

- Silent overwrites (lost keys)  
- Degenerate O(n) chains → “hash map” becomes linked list  
- Security: hash flooding DoS if hash is weak and predictable  
- Failed design interviews  

---

## 7. How did people invent this?

Chaining (separate chaining) and open addressing (linear/quadratic probing, double hashing) developed with early assemblers and databases. Universal hashing theory (Carter–Wegman) explained expected performance. Modern languages mix strategies (some use trees in long chains).

---

## 8. Computer intuition

### Chaining

```text
vector<list<pair<Key,Val>>> buckets;
index = hash(key) % m
search / insert in buckets[index]
```

### Open addressing (linear probe)

```text
i = hash(key) % m
while slot[i] occupied by other key: i = (i+1) % m
```

Deletions need **tombstones** so probes do not stop early.

### Load factor

α = n/m. Resize when α > threshold (e.g. 0.75): allocate ~2m buckets, reinsert all.

---

## 9. Mathematical intuition

With uniform hashing and chaining, average chain length ≈ α.  
Expected unsuccessful search Θ(1+α).

Open addressing needs lower α (performance collapses as table fills). Primary clustering with linear probe.

Birthday paradox intuition: collisions appear much earlier than m keys.

---

## 10. Step-by-step working

### Design HashMap (chaining)

1. Pick m prime-ish or power of two (with good hash mix)  
2. `put`: find chain; update if key exists else append  
3. `get`: scan chain  
4. `remove`: erase from chain  
5. If n > α_max * m → rehash  

### Design Insert/Delete/GetRandom O(1)

1. `vector<int> vals` for random index  
2. `unordered_map<int,int> pos` value → index in vector  
3. Insert: append + map  
4. Delete: swap with last, pop, update map  
5. GetRandom: `vals[rand() % size]`

---

## 11. Dry run

Chaining m=3, put (1,a), (4,b) if hash(x)=x:

```text
1%3=1 → bucket1: (1,a)
4%3=1 → bucket1: (1,a)→(4,b)
get(4) scan chain find b
remove(1) leave (4,b)
```

GetRandom structure:

```text
insert 10: vals[10], pos{10:0}
insert 20: vals[10,20], pos{10:0,20:1}
delete 10: swap 20 into idx0; vals[20]; pos{20:0}
getRandom → only 20
```

---

## 12. Visualization

```text
CHAINING
[0] →
[1] → (1,a) → (4,b)
[2] → (2,c)

OPEN ADDRESSING
idx: 0    1    2    3
     empty (1,a)(4,b) empty
           ^probe→

GETRANDOM HYBRID
vector:  [10, 20, 30]
map:     10→0, 20→1, 30→2
delete 20: swap 30→idx1; pop
vector:  [10, 30]
```

Sticky: mailbox hooks + swap-with-last for random.

---

## 13. Complexity

| Op (good hash, bounded α) | Average | Worst |
|---|---|---|
| put/get/remove chaining | O(1) | O(n) |
| rehash | O(n) occasionally | amortized O(1) inserts |
| GetRandom design each op | O(1) | O(1) expected for map |

---

## 14. Why this complexity?

Short chains / few probes. Rehash costs O(n) but doubles capacity → amortized analysis like vector growth. GetRandom: vector index O(1); map O(1) expected.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

class MyHashMap {
    static constexpr int MOD = 10007;
    vector<list<pair<int,int>>> b;
public:
    MyHashMap() : b(MOD) {}
    void put(int key, int value) {
        auto& chain = b[key % MOD];
        for (auto& p : chain)
            if (p.first == key) { p.second = value; return; }
        chain.push_back({key, value});
    }
    int get(int key) {
        for (auto& p : b[key % MOD])
            if (p.first == key) return p.second;
        return -1;
    }
    void remove(int key) {
        auto& chain = b[key % MOD];
        for (auto it = chain.begin(); it != chain.end(); ++it)
            if (it->first == key) { chain.erase(it); return; }
    }
};

class RandomizedSet {
    vector<int> vals;
    unordered_map<int,int> pos;
public:
    bool insert(int val) {
        if (pos.count(val)) return false;
        pos[val] = (int)vals.size();
        vals.push_back(val);
        return true;
    }
    bool remove(int val) {
        if (!pos.count(val)) return false;
        int i = pos[val];
        int last = vals.back();
        vals[i] = last;
        pos[last] = i;
        vals.pop_back();
        pos.erase(val);
        return true;
    }
    int getRandom() {
        return vals[rand() % vals.size()];
    }
};

// Simple string hash (teaching — not crypto)
unsigned long long polyHash(const string& s) {
    const unsigned long long P = 131;
    unsigned long long h = 0;
    for (unsigned char c : s) h = h * P + c + 1;
    return h;
}
```

---

## 16. STL usage

```cpp
unordered_map<K,V> // typically chaining / implementation-defined
// max_load_factor, rehash, reserve
mp.reserve(n);           // reduce rehashes if you know n
mp.max_load_factor(0.7f);

// Custom hash + key equality
struct H { size_t operator()(const Key& k) const { ... } };
struct Eq { bool operator()(const Key& a, const Key& b) const { ... } };
unordered_map<Key, V, H, Eq> table;
```

For interviews, hand-rolled chaining with `vector<list<...>>` is enough unless they specify open addressing.

---

## 17. Brute Force

Store pairs in a `vector`; get scans all — O(n). Correct but not a hash table.

---

## 18. Better

Fixed small bucket count without resize — OK for toy constraints (LeetCode Design HashMap often accepts fixed MOD). Better: resize with load factor.

---

## 19. Optimal

Dynamic resizing + good hash → amortized expected O(1).  
RandomizedSet as above is the optimal classic design for those three ops.

Crypto-secure hashes are for security, not typical DSA interview speed tables.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Hash uniqueness means no collisions."
  ↓
Fails: Pigeonhole — m buckets, >m keys
  ↓
Correct: Collisions normal; strategy required

Wrong: "Delete in open addressing = mark empty."
  ↓
Fails: Breaks probe chains; later keys unreachable
  ↓
Correct: Tombstone deleted slots

Wrong: "GetRandom: pick random map iterator."
  ↓
Fails: unordered_map iterators not O(1) jump to k-th
  ↓
Correct: Compact vector + index map; swap-delete

Wrong: "key % MOD is a great hash for all keys."
  ↓
Fails: Patterned keys cluster
  ↓
Correct: Mix bits; for interview ints, % prime OK if constraints random-ish
```

---

## 21. Common mistakes

1. Update vs insert confusion in put  
2. Forgetting rehash → huge chains  
3. Using tombstones incorrectly  
4. GetRandom delete without remapping last element’s index  
5. `rand() % size` on empty  
6. Weak string hash only XOR chars (anagrams collide heavily)  
7. Assuming STL iteration order stable  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Compare chaining vs open addressing. When rehash?”  
**Expected:** Memory locality vs pointer chasing; load factor; clustering; tombstones.

### Amazon
**Ask:** “Design HashMap / HashSet.”  
**Expected:** Chaining code; handle update; discuss complexity.

### Microsoft
**Ask:** “Insert Delete GetRandom O(1).”  
**Expected:** Vector + map; swap with last; careful duplicate insert false.

### OpenAI
**Ask:** “How would an adversary slow your hash table? Mitigations?”  
**Expected:** Collision floods; randomized seed / universal hashing; fall back to tree map; rate limits.

**Interview phrase:**

```text
"I'll use separate chaining with a load-factor resize.
Collisions go into a bucket list; operations stay expected O(1)
while α is bounded."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Language runtimes | Dict/hash implementations |
| Databases | Hash indexes |
| Caches | Key→value + eviction (LRU adds list) |
| Compilers | Symbol tables |
| Networking | Flow tables (specialized) |
| Security | Beware hash DoS; use strong/keyed hashes |

---

## 24. Related concepts + pattern recognition cues

**Related:** hashmap basics, LRU (hash+list), bloom filter, perfect hashing (advanced), rolling hash (string algorithms).

| Cue | Think |
|---|---|
| Implement map from scratch | Chaining + MOD / resize |
| GetRandom + insert/delete O(1) | Vector + index map |
| Why slow unordered_map? | Collisions / bad hash / many rehashes |
| String matching rolling | Polynomial hash (separate topic) |
| Need worst-case O(log n) | Tree map |

**Decision snack:**

```text
Use STL unordered_* in problems
Design interview → chaining first
Need random element → vector + hash index
Need order → map/set
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Collisions are normal
Chaining = list per mailbox
Open address = walk to next free
Resize when crowded
GetRandom = vector + map + swap-delete
```

### Checklist

- [ ] Define collision  
- [ ] Sketch chaining put/get  
- [ ] Explain load factor + rehash  
- [ ] Dry-run RandomizedSet delete  
- [ ] Name tombstone purpose  

### Practice roadmap

1. Easy/Med: Design HashMap, Design HashSet  
2. Medium: Insert Delete GetRandom O(1), Encode Decode TinyURL  
3. Follow-ups: LRU Cache (hash + doubly list), All O(1) data structure variants  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Mailbox collision picture |
| 3 | Code MyHashMap chaining |
| 7 | RandomizedSet from memory |
| 15 | Explain chaining vs probing aloud |
| 30 | Adversarial collision discussion |
| 90 | Mock: design map + getRandom + LRU link |

```text
Item: Collisions & Hash Table Design
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
