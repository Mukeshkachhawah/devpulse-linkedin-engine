# Advanced Topics Cheatsheet

---

## Bit Kit

```cpp
test  i: n & (1LL<<i)
set   i: n | (1LL<<i)
clear i: n & ~(1LL<<i)
toggle:  n ^ (1LL<<i)
lowbit:  n & -n          // also i & -i
clear lowest 1: n & (n-1)
pow2: n && !(n & (n-1))
```

XOR: `x^x=0`, pairs cancel.  
Submasks: `for (int s=mask; s; s=(s-1)&mask)`.

---

## Fenwick (1-index)

```cpp
void add(int i, ll v){ for(; i<=n; i+=i&-i) bit[i]+=v; }
ll sum(int i){ ll s=0; for(; i>0; i-=i&-i) s+=bit[i]; return s; }
ll range(int l,int r){ return sum(r)-sum(l-1); }
```

**SegTree:** merge children; query disjoint covering nodes; lazy for range add.

| Need | Structure |
|---|---|
| point add + range sum | Fenwick |
| range min + update | SegTree |
| range add + range sum | SegTree + lazy |
| static min | Sparse table |
| static sum | Prefix |

---

## Strings

```cpp
// pi / KMP core
while (j>0 && p[i]!=p[j]) j=pi[j-1];
if (p[i]==p[j]) ++j; pi[i]=j;

// hash substring
get(l,r) = pref[r+1] - pref[l]*pw[r-l+1]
```

Trie: `next[26] + end`.  
KMP/Z guaranteed linear; hash verify if needed.

---

## Geometry / Misc

```cpp
cross(u,v)=u.x*v.y-u.y*v.x;
orient(a,b,c)=sign(cross(b-a,c-a)); // + left/CCW
```

Hull: sort + lower/upper chain.  
MITM: split → enum sums → sort → binary search.  
Sparse min: `k=lg[r-l+1]; min(st[k][l], st[k][r-(1<<k)+1])`.

---

## Complexity Gut

| Tool | Time |
|---|---|
| Bit ops | O(1) / O(2ⁿ) masks |
| Fenwick/Seg | O(log n) |
| KMP | O(n+m) |
| Trie | O(total length) |
| Hull | O(n log n) |
| MITM | O(2^{n/2}) |
| Sparse query | O(1) |

---

## Interview Lines

- “XOR cancels duplicates; leftover is unique.”
- “Fenwick is 1-indexed; range = pref[r]-pref[l-1].”
- “`pi[i]` = longest border of pattern prefix i.”
- “n=40 → meet-in-the-middle, not 2^40 DP.”
- “Sparse for static min; updates → segment/BIT.”
