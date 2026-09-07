# Advanced Topics — 10-Minute Revision

## 0:00–2:00 — Closed-book summary

1. Bit ops table + XOR proof line  
2. Fenwick vs SegTree selection rules  
3. KMP `pi` definition + trie role  
4. Cross orientation + MITM + sparse table use cases  

Check `REVISION-30-SECONDS.md`.

## 2:00–5:00 — Dry runs

### A) Bits

Kernighan steps on 13 → 3; pow2 check on 8 and 12.

### B) Fenwick

Mentally add array `[2,3,-1,5]`; prefix(3); range(2,4).

### C) KMP

`pi` for `"abab"`; one match index in a short text.

### D) MITM

Say why 2^20 + 2^20 beats 2^40; sparse vs segtree one sentence.

## 5:00–8:00 — Code from memory

1. Fenwick `add` + `sumPrefix` **or** XOR single number + popcount  
2. KMP `buildPi` **or** Trie insert/search  
3. `orient` + cross **or** MITM subset boolean  
4. Optional: SegTree query skeleton  

## 8:00–10:00 — Interview voice

**Google:** KMP `pi` + why O(n+m); OR cross orientation.  
**Amazon:** autocomplete trie; OR metrics Fenwick.  
**Microsoft:** implement mutable range sum (BIT).  
**OpenAI:** sparse vs segment tree vs prefix.

| Score | Meaning |
|---|---|
| 4/4 | Advanced module L4 day |
| 2–3 | Revise weak tool Wrong Thinking |
| 0–1 | Re-study that full lesson before mocks |

## Exit checklist

- [ ] Said 1-index for Fenwick  
- [ ] Mentioned hash collisions  
- [ ] Said MITM for n≈40  
- [ ] Avoided claiming sparse for dynamic sum  

## Spaced repetition bump

Pass → keep +1/+3/+7/+15/+30/+90.  
Fail → next = tomorrow for failed tool.
