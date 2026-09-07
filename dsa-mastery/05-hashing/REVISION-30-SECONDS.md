# Hashing — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Hash = magic mailbox number
Set = seen?; Map = key→value
Expected O(1); worst O(n) collisions
count/find — not [] — for existence
Freq = tallies; a–z → cnt[26]
Sum = k (any ints) → prefix + hash
Collision → chain or probe; resize load
GetRandom → vector + index map + swap-delete
```

## One-Liners

| Topic | One line |
|---|---|
| Two Sum | map value→index while scanning |
| Anagram | same counts |
| Subarray sum k | seen[pref-k] |
| Distinct in window | freq map; erase at 0 |
| Design map | chaining buckets |
| map vs unordered_map | order+O(log n) vs avg O(1) |

## Complexity Snap

```text
unordered_* ops     expected O(1)
tree map/set        O(log n)
Two Sum hash        O(n) time / O(n) space
prefix+hash sums    O(n)
brute pair scan     O(n²)
```

## Trap of the Day

```text
mp[key] inserts default
window ≠ subarray sum with negatives
GetRandom ≠ random unordered iterator
```

## Pass / Fail

Fail flash → reopen weak hashing lesson 5 minutes, retry.
