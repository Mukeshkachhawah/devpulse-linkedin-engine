# Geometry and Misc Advanced Toolkit

**Module:** 11-advanced  
**Level target:** L5  
**Prerequisite:** vectors math basics, sorting, binary search, sets, prior modules  
**Memory picture:** Geometry = arrows (vectors) and turns (cross product sign). Misc toolkit = a small Swiss army knife: meet-in-the-middle, sparse table, monotonic tricks reminders, randomization, and “when to refuse overkill.”

---

## 1. What is it?

A practical pack of **advanced-but-interview-useful** ideas that did not need their own full module yet:

**Geometry core**

- points / vectors
- dot & cross products
- orientation (left/right/collinear)
- segment intersection (basic)
- convex hull (Andrew’s monotone chain overview)
- closest pair of points (divide-and-conquer map)

**Misc toolkit**

- meet-in-the-middle
- sparse table (static RMQ)
- randomization / hashing defenses
- Mo’s algorithm (map only)
- policy: don’t force heavy tools on easy problems

New words:

- **Cross product** (2D) — `ax*by - ay*bx`; sign = turn direction.  
- **Dot product** — `ax*bx + ay*by`; related to angle.  
- **Convex hull** — smallest convex polygon containing all points.  
- **Meet-in-the-middle** — split n into n/2, enumerate both halves, combine.  
- **Sparse table** — O(1) idempotent range queries after O(n log n) build.

---

## 2. Explain like I am 10

Geometry: on paper, three points make a turn — left, right, or straight. Computers use a multiply trick (cross) to know the turn without drawing.

Misc: if a backpack problem has 40 items, you split into two groups of 20, list all packings for each half, then match halves — that is meet-in-the-middle.

---

## 3. Real life story

Maps: “does this road cross that road?” → segment intersection.  
Game physics: which side of a wall is the player on? → orientation.  
Security contests / interviews: knapsack n=40 → meet-in-the-middle.

```text
Points A,B,C
Cross (B-A) x (C-A) > 0 → C is left of AB (in standard math coords)
```

---

## 4. Why does this exist?

Some FAANG rounds and many CP contests sprinkle geometry and MITM. You need clean primitives and the wisdom to use `long double` carefully / integers when possible.

---

## 5. What problem existed before this?

Floating chaos, wrong EPS, O(n²) hulls, 2^40 impossible loops. Structured primitives and MITM fixed practice.

---

## 6. What happens without it?

```text
Wrong cross sign → inverted polygons
float EPS hell → WA on collinear
n=40 knapsack DP W huge → impossible without MITM
```

---

## 7. How did people invent this?

Vector geometry is classical. Convex hull algorithms: Graham, Andrew, Jarvis. MITM is a standard exact exponential technique. Sparse tables from RMQ literature.

---

## 8. Computer intuition

```text
VECTORS

Point = (x,y)
Vec AB = B - A = (xb-xa, yb-ya)

cross(u,v) = u.x*v.y - u.y*v.x
dot(u,v)   = u.x*v.x + u.y*v.y


SPARSE TABLE idea (min)

row k covers length 2^k
st[k][i] = min of a[i .. i+2^k - 1]
overlap mins OK because min is idempotent
```

---

## 9. Mathematical intuition

Orientation test uses signed area of parallelogram (cross). Collinear when cross ≈ 0 (prefer exact integer cross with care for overflow).

MITM: 2^{n/2} + 2^{n/2} beats 2^n. For n=40, 2^20 ≈ 1e6 fine.

Sparse table: any range length R covered by two overlapping blocks of size 2^{floor(log2 R)}.

---

## 10. Step-by-step working

### Geometry recipe

1. Prefer integer coordinates + `long long` cross.  
2. Write `orientation(a,b,c)`.  
3. Build intersection using orientations + on-segment checks.  
4. Hull: sort points; build lower/upper chains popping non-left turns.  
5. State EPS policy if floats unavoidable.

### MITM recipe

1. Split array into two halves.  
2. Enumerate all subset sums (or states) each side.  
3. Sort one side; binary search complements.  
4. Watch overflow / duplicate counts.

### Sparse table recipe

1. Build `st[k][i]`.  
2. Query with `k = log2(r-l+1)`.  
3. Only for idempotent ops (min/max/gcd) — not sum.

---

## 11. Dry run

**Orientation:** A(0,0), B(2,0), C(1,1) → cross=2>0 left. C(1,-1)→ cross<0 right.

**MITM subset sum** to target 10, nums `[2,4,5,9]` split `[2,4]` & `[5,9]`:  
left sums `{0,2,4,6}`, right `{0,5,9,14}`; need left+right=10 → 1+9? no; 5+5 no; **1?** 4+...? 4+...? right 6 missing; **0+...?;** actually 5+5 no; **1;** pairs: 1? **4+...? 4+6 no;** **1+9=10** no 1; **5+5**; **0+...?;** **2+...? 2+8**; **6+4** no; **1;** Wait: **1+9** left has no 1. **5+5** no. **9+1** no. **0+10** no. **4+...?=6** no. **2+8** no. **6+4** no. Check: 5+...?=5 → left 5? no. 9+1 no. Is 10 possible? 5+...? +4+1 no; 9+2- wait 9+2=11; 5+4+...?=9+need1; full set 2+4+5=11, 2+9=11, 4+5=9, 4+9=13, 5+9=14, 2+4+9=15, 2+5=7, 2+5+9=16, 4+5+9=18, all=20. **No subset sums to 10** — good MITM concludes none.

Better target **9**: left 4 + right 5 = 9 ✓.

---

## 12. Visualization

```text
CROSS SIGN TURN

A ------> B
         ^
        /
       C     cross > 0 (left turn A→B→C)


HULL LOWER CHAIN

sort by x
walk left→right keeping turns
pop while clockwise (for upper/lower convention)


MITM

n=40
2^40  → impossible
2^20 + 2^20 → OK
```

---

## 13. Complexity

| Tool | Time |
|---|---|
| Orientation | O(1) |
| Segment intersect | O(1) |
| Convex hull | O(n log n) |
| Closest pair DC | O(n log n) |
| MITM subset | O(2^{n/2} · n) or with sort O(2^{n/2} log) |
| Sparse table build/query | O(n log n) / O(1) |

---

## 14. Why this complexity?

Hull dominated by sort. MITM exponential in n/2. Sparse table stores log layers.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Pt {
    long long x, y;
    Pt operator-(Pt p) const { return {x-p.x, y-p.y}; }
};

long long cross(Pt a, Pt b) { return a.x*b.y - a.y*b.x; }
long long dot(Pt a, Pt b) { return a.x*b.x + a.y*b.y; }

int orient(Pt a, Pt b, Pt c) {
    long long v = cross(b-a, c-a);
    if (v > 0) return 1;   // CCW / left
    if (v < 0) return -1;  // CW / right
    return 0;              // collinear
}

vector<Pt> convexHull(vector<Pt> p) {
    sort(p.begin(), p.end(), [](Pt a, Pt b){
        return a.x<b.x || (a.x==b.x && a.y<b.y);
    });
    p.erase(unique(p.begin(), p.end(), [](Pt a, Pt b){
        return a.x==b.x && a.y==b.y;
    }), p.end());
    if (p.size() <= 1) return p;
    vector<Pt> lo, up;
    for (Pt x : p) {
        while (lo.size()>=2 && orient(lo[lo.size()-2], lo.back(), x) <= 0)
            lo.pop_back();
        lo.push_back(x);
    }
    for (int i=(int)p.size()-1; i>=0; --i) {
        Pt x = p[i];
        while (up.size()>=2 && orient(up[up.size()-2], up.back(), x) <= 0)
            up.pop_back();
        up.push_back(x);
    }
    lo.pop_back(); up.pop_back();
    lo.insert(lo.end(), up.begin(), up.end());
    return lo;
}

bool subsetSumMITM(vector<long long>& a, long long target) {
    int n = a.size(), n1 = n/2;
    vector<long long> A, B;
    for (int mask=0; mask<(1<<n1); ++mask) {
        long long s=0;
        for (int i=0;i<n1;++i) if (mask&(1<<i)) s+=a[i];
        A.push_back(s);
    }
    int n2 = n - n1;
    for (int mask=0; mask<(1<<n2); ++mask) {
        long long s=0;
        for (int i=0;i<n2;++i) if (mask&(1<<i)) s+=a[n1+i];
        B.push_back(s);
    }
    sort(B.begin(), B.end());
    for (long long s : A) {
        long long need = target - s;
        if (binary_search(B.begin(), B.end(), need)) return true;
    }
    return false;
}

struct SparseMin {
    int n; vector<int> lg;
    vector<vector<int>> st;
    SparseMin(vector<int>& a) {
        n = a.size();
        lg.assign(n+1,0);
        for (int i=2;i<=n;++i) lg[i]=lg[i/2]+1;
        int K = lg[n]+1;
        st.assign(K, vector<int>(n));
        st[0]=a;
        for (int k=1;k<K;++k)
            for (int i=0;i+(1<<k)<=n;++i)
                st[k][i]=min(st[k-1][i], st[k-1][i+(1<<(k-1))]);
    }
    int query(int l, int r) { // inclusive
        int k = lg[r-l+1];
        return min(st[k][l], st[k][r-(1<<k)+1]);
    }
};
```

---

## 16. STL usage

- `complex<long double>` sometimes for geometry — prefer own `Pt` for control  
- `sort` + `unique` for hull  
- `binary_search` / two pointers on MITM lists  
- `__lg` / precomputed `lg[]` for sparse table  

---

## 17. Brute Force

All pairs segments; all subsets 2^n; loop min each query O(n).

---

## 18. Better

Sweep-line ideas; BIT+compression; sparse table for static RMQ.

---

## 19. Optimal

Hull O(n log n); MITM O(2^{n/2}); sparse O(1) query. Closest pair O(n log n) better than O(n²).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Always use double for geometry."
  Why it fails: precision WA.
  Correct: integers + long long when coords allow.

Wrong: "Sparse table works for range sum updates."
  Why it fails: static + not for sum O(1) with two overlaps (overlap doubles).
  Correct: min/max/gcd; for sum use prefix/BIT.

Wrong: "n=40 ⇒ bitmask DP."
  Why it fails: 2^40 impossible.
  Correct: MITM 2^20.

Wrong: "Convex hull needed for every geometry question."
  Why it fails: overkill.
  Correct: start with orientation/intersection.
```

---

## 21. Common mistakes

1. Cross overflow — cast/`long long`.  
2. Inclusive/exclusive hull duplicates.  
3. MITM split off-by-one.  
4. Sparse table used after updates.  
5. Wrong turn inequality (`<` vs `<=`) removing collinear.  
6. EPS too tight/loose.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “How do you test whether C is left of AB?”  
**Expected:** “Compute cross of AB and AC; positive means counter-clockwise turn (left in standard coordinates). Use 64-bit integers to avoid overflow.”

### Amazon-style

**Interviewer:** “Geofencing: point in polygon?”  
**Expected:** “Ray casting or winding with careful boundary rules; mention integer geometry and edge cases; for interviews implement ray cast carefully.”

### Microsoft-style

**Interviewer:** “n=40 subset sum, W huge.”  
**Expected:** “Meet-in-the-middle: enumerate half sums, sort, binary search complement.”

### OpenAI-style

**Interviewer:** “When sparse table vs segment tree?”  
**Expected:** “Static idempotent RMQ → sparse O(1). Dynamic updates → segment/BIT. Range sum static → prefix sums.”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Maps / mobility | geofence, route geometry |
| Games | collision side tests |
| Ads / retail | territory polygons |
| Security / research | MITM cryptanalysis cousin (teaching) |
| Databases | RMQ / window mins |

---

## 24. Related concepts + pattern recognition cues

```text
IF turns / sides / intersect → cross orientation
IF rubber-band boundary → convex hull
IF n≈40 exact subset → MITM
IF static min on range many queries → sparse table
IF updates → not sparse; use seg/BIT
IF string heavy → previous lesson, not geometry
```

Related: sweep line, line sweep + BIT, rotating calipers (map).

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Cross sign = turn
Prefer integer geometry
MITM halves 2^{n/2}
Sparse = static min/max O(1)
Don't overkill easy problems
```

### Checklist

- [ ] orientation code  
- [ ] hull outline  
- [ ] MITM subset sum  
- [ ] sparse min query  
- [ ] choose tool vs segtree/prefix  

### Practice plan

1. Valid boomerang / orientation problems  
2. Convex hull template check  
3. MITM knapsack/subset  
4. Sparse table RMQ  
5. One closest-pair reading  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Cross + orient dry runs |
| 3 | MITM code |
| 7 | Sparse table + one geo problem |
| 15 | Teach turn sign |
| 30 | Retry precision bug |
| 90 | Microsoft MITM mock |

```text
Item: Geometry & Misc
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Turn + Swiss-knife metaphors |
| L2 | Dry-run cross signs |
| L3 | Code orient + MITM + sparse |
| L4 | Pick integers vs float; static vs dynamic |
| L5 | Combine geo primitives under interview pressure |
