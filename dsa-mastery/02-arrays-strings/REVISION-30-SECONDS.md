# Arrays & Strings — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Array = numbered lockers (O(1) index)
String = char array / beads on a thread
Two pointers = two flashlights + one rule
Sliding window = cardboard frame on a mural
Prefix sum = coins collected so far
Diff array = mark start/end, then walk
Matrix = classroom seats (row, col)
```

## One-Liners

| Topic | One line |
|---|---|
| Arrays | Contiguous slots; middle insert is O(n) |
| Strings | Substring contiguous; subsequence can skip |
| Two pointers | Move the side that fixes the invariant |
| Sliding window | Add right; while bad, drop left |
| Prefix | `sum(l..r) = pref[r+1]-pref[l]` |
| Diff | `diff[l]+=v; diff[r+1]-=v` |
| Matrix rotate 90 | Transpose, then reverse each row |

## Complexity Snap

```text
Scan array/string          O(n)
Two pointers pass          O(n)
Window enter/leave once    O(n)
Prefix build               O(n), query O(1)
Diff u updates + build     O(u+n)
Matrix full scan           O(mn)
```

## Trap of the Day

```text
Negatives + subarray sum  → prefix + hash, NOT basic window
Sorted two-sum needs sort or hash — unsorted opposite pointers lie
Spiral: check bounds before bottom/left walks
```

## Pass / Fail

If you cannot say the flash card without peeking → reopen the weak lesson for 5 minutes, then retry.
