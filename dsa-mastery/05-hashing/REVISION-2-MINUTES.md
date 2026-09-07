# Hashing — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. HashSet vs HashMap in one line each.  
2. Why collisions must happen (pigeonhole).  
3. Expected vs worst-case for `unordered_map`.  
4. Why `mp[key]` is dangerous for existence checks.  
5. Subarray sum = K: formula with prefixes.  
6. When prefer `int cnt[26]` over map?  
7. How GetRandom set deletes in O(1)?

## Minute 2 — Patterns + Traps

```text
Need index of complementary value     → hash map (Two Sum)
Membership / dedup                    → hash set
Counts / anagram / top K              → freq map (+ buckets)
Subarray sum k (any signs)            → prefix + hash
At most K distinct window             → window + freq
Implement map                         → chaining + mod
Insert/delete/getRandom               → vector + pos map
Need sorted keys                      → map/set
```

Traps:

```text
[] inserts
negatives + sliding window for sum
forget seen[0]=1
swap-delete forget update last index
assume unordered iteration sorted
```

## Quick Dry-Run

Two Sum `[2,7,11,15]`, 9 — map state each step.  
Or subarray sum `[1,2,3]`, k=3.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 | Solid |
| Miss 1–2 | Skim §20 |
| Miss 3+ | Day 1 reset |

## Next

`REVISION-10-MINUTES.md` for deep days.
