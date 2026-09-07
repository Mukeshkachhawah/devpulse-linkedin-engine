# Hashing — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

1. Mailbox hashing + collision  
2. Chaining vs open addressing (+ tombstone)  
3. Frequency patterns toolkit  
4. Prefix-hash derivation for sum = k  
5. RandomizedSet memory picture  

## Block B — Dry Runs (4 min)

### 1) Two Sum

`[3,2,4]`, target 6 — show map.

### 2) Anagram counts

`"rat"` vs `"car"` — fail point.

### 3) Prefix hash

`[1,2,3]`, k=3 — map after each i; ans.

### 4) Window distinct

`s = "eceba"`, at most 2 distinct — left/right moves (fruit-style).

### 5) GetRandom delete

vals `[10,20,30]`, delete 20 — final vector + map.

## Block C — Code From Memory (3 min)

Pick **two**:

```text
[ ] twoSum
[ ] isAnagram (cnt[26])
[ ] subarraySum
[ ] topKFrequent (buckets)
[ ] MyHashMap put/get/remove
[ ] RandomizedSet insert/remove/getRandom
```

Stuck > 60s → peek → rewrite.

## Interview Spitfire (30s each)

1. map vs unordered_map — pick when?  
2. Why window fails for sum k with negatives?  
3. Load factor / rehash purpose?  
4. Adversarial collisions — what do you say?

## Reset Rule

Miss dry-run/code → **Needs Revision**, Day 1.

## Link Back

- `hashmap-hashset.md`, `frequency-counting-patterns.md`, `collision-and-design.md`
- `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
