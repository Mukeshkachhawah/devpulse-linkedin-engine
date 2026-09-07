# Advanced Topics — 30-Second Revision

Close the lessons. Answer out loud.

## Bits

- AND test, OR set, XOR toggle/cancel; `n&(n-1)` clears lowest 1.
- XOR pairs cancel → single unique.
- Power of two: `n>0 && !(n&(n-1))`.
- Use `1LL<<i`; masks for n≤20.

## Fenwick / Segment Tree

- Dynamic range aggregates in O(log n).
- Fenwick: 1-index, `i±(i&-i)`, prefix → range sum.
- SegTree: pyramid merge; better for min/max + lazy range updates.
- Prefix sums die when updates arrive.

## Strings

- KMP: `pi` borders; O(n+m).
- Trie: shared prefixes; `end` mark.
- Rolling hash: O(1) substring; watch collisions.
- LCS/edit live in DP module — different job.

## Geometry & Misc

- Cross sign = turn (prefer `long long`).
- Hull O(n log n); don’t overkill.
- n≈40 subset → **meet-in-the-middle** 2^{n/2}.
- Sparse table: static min/max O(1); not for sums/updates.

## Pass rule

Hesitate → reopen that lesson’s Wrong Thinking + Complexity today.
