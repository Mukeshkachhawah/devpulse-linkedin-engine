# Advanced Topics — 2-Minute Revision

Timer: 2 minutes. No notes first. Then check.

## Minute 1 — Explain

**Bits (15s)**  
“Word of switches; XOR cancels pairs; Kernighan counts bits by clearing lowest ones.”

**Trees (15s)**  
“Fenwick for dynamic prefix sums; segment tree for general range ops / lazy.”

**Strings (15s)**  
“KMP failure function slides smartly; trie for prefixes; hash for fast substring compares.”

**Geo/Misc (15s)**  
“Cross product for turns; MITM halves exponential; sparse table for static RMQ.”

## Minute 2 — Rapid fire

1. Does `1<<31` as signed `int` always safe? → No.  
2. Is Fenwick naturally great for range **min** via prefix subtract? → No.  
3. After KMP finds a match, what happens to `j`? → `j = pi[j-1]`.  
4. Hash equal ⇒ strings always equal? → No, collisions.  
5. Sparse table for range sum with two overlapping blocks? → Wrong (overlap).  
6. n=40 bitmask DP OK? → No; use MITM.  
7. Segment tree query time? → O(log n).  
8. Trie needs end mark for exact word search? → Yes.

## Mini dry-runs

**XOR** `[4,1,2,1,2]` → 4.  
**pi** `"abab"` → `[0,0,1,2]`.  
**orient** A(0,0),B(2,0),C(1,1) → left / +cross.

## If failed ≥2

Day-1 reset on that advanced subtopic only.
