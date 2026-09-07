# Memory, Cache & CPU (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L4  
**Prerequisite:** arrays in memory, Big-O, basic OS virtual memory idea  
**Memory picture:** CPU is a chef. Registers are the cutting board. L1/L2/L3 caches are counter space. RAM is the fridge. Disk is the warehouse across town. Locality = keeping ingredients nearby.

---

## 1. What is it?

This lesson explains **why some O(n) loops are 10× faster than other O(n) loops**: the memory hierarchy, caches, locality, false sharing, and CPU basics useful in interviews and performance talks.

New words:

- **Register** — tiny fastest storage inside CPU core.  
- **Cache line** — fixed-size block moved between cache and RAM (often 64 bytes).  
- **Hit / miss** — data found in cache or not.  
- **Spatial locality** — nearby addresses used soon.  
- **Temporal locality** — same address reused soon.  
- **Prefetch** — hardware/software loading ahead.  
- **Branch prediction** — CPU guesses if/else direction.  
- **SIMD** — one instruction, many data lanes.

---

## 2. Explain like I am 10

Doing homework: pencils on desk (cache) beat walking to the closet (RAM) beat biking to school storage (disk). If your notes are in one binder (sequential array), you grab fast. If notes are scattered in 50 binders (pointer chasing), you walk forever.

---

## 3. Why it exists

Hardware can’t make a giant memory as fast as the CPU. Hierarchy is the engineering compromise. Algorithms that respect locality win in practice.

Without this: you worship Big-O only and lose real interviews that ask “why is this slow?”

---

## 4. The hierarchy (know cold)

```text
Registers          ~ cycles
L1 cache           ~ few cycles
L2 cache           ~ tens
L3 cache           ~ tens–hundreds
RAM                ~ hundreds+
SSD/NVMe           ~ microseconds+
HDD/network        ~ much worse
```

Numbers vary by machine — **order of magnitude thinking** matters more than memorizing exact ns.

---

## 5. Cache lines & arrays

CPU doesn’t fetch one `int`; it fetches a **cache line**.

```cpp
// Good spatial locality
for (int i = 0; i < n; ++i) sum += a[i];

// Worse: big strides
for (int i = 0; i < n; i += 16) sum += a[i];
```

**Row-major matrices in C/C++:**

```text
a[i][j] contiguous in j
Iterate rows innermost → friendly
Iterate columns innermost on big matrix → cache thrash
```

```cpp
// Friendlier
for (int i = 0; i < n; ++i)
  for (int j = 0; j < n; ++j)
    sum += a[i][j];
```

---

## 6. Linked lists vs vectors (interview classic)

```text
vector:  [1][2][3][4][5]  contiguous → prefetch works
list:    [1]→[2]→[3]      nodes scattered → pointer chasing misses
```

Big-O of scan both O(n), but vector usually much faster. Prefer `vector` for performance unless you need list’s splice properties (rare in interviews).

---

## 7. Temporal locality & working set

Hot loop variables stay in registers/L1. Huge working sets that don’t fit in cache → miss storms (related to OS thrashing, but here at cache level).

**Blocking / tiling** (matrix multiply idea): process sub-blocks that fit in cache.

---

## 8. False sharing (concurrency + cache)

Two threads write different variables that sit on the **same cache line** → line bounces between cores → slowdown.

```cpp
// Bad: counters adjacent
struct Counters { int a, b; } c;

// Better: align/pad separate cache lines
struct alignas(64) Padded { int v; };
```

---

## 9. CPU execution intuition

- **Pipeline:** overlapping stages of instructions.  
- **Branch misprediction:** wrong guess → pipeline flush → penalty.  
- **Out-of-order execution:** CPU reorders when safe to hide latency.  
- **ILP:** instruction-level parallelism.

**Data-dependent branches** in tight loops can hurt; branchless tricks sometimes help (don’t obsess early).

---

## 10. Virtual memory interaction

TLB caches virtual→physical translations. Huge random access over giant heaps → TLB misses too. Another reason contiguous structures win.

---

## 11. Measuring beats guessing

Use profilers (see profiling lesson). Still, interviews expect you to **predict** locality issues from code shape.

---

## 12. Common interview Q&A

**Q1. Why is iterating a vector faster than a linked list?**  
A: Contiguous memory → cache lines + prefetch; list chases pointers → misses.

**Q2. What is a cache line?**  
A: Block unit of transfer between cache and memory; typically 64 bytes.

**Q3. Spatial vs temporal locality?**  
A: Nearby addresses vs reuse of same data soon.

**Q4. What is false sharing?**  
A: Independent variables on one line cause coherence traffic between cores.

**Q5. Why column scans on row-major hurt?**  
A: Large stride between accesses → fewer useful elements per cache line.

**Q6. Does Big-O capture cache effects?**  
A: No; asymptotic ignores constants and hierarchy — still essential, but incomplete.

**Q7. What is RAM vs cache vs disk roles?**  
A: Working memory vs speed layer vs durable/slow store.

**Q8. How can you improve locality?**  
A: Contiguous layouts, AoS vs SoA choice, tiling, smaller hot data, avoid pointer soup.

**Q9. What is AoS vs SoA?**  
A: Array-of-structs vs struct-of-arrays; SoA often better for processing one field across many objects (SIMD-friendly).

**Q10. Why might `unordered_map` be slower than `vector` scans for small n?**  
A: Hash overhead + poor locality; constants dominate.

---

## 13. C++ demo — locality contrast (teaching)

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    const int N = 10'000'000;
    vector<int> a(N, 1);
    long long s = 0;
    for (int x : a) s += x; // sequential — cache friendly
    cout << s << "\n";

    // Linked structure would allocate nodes separately — harder here;
    // interview: explain without needing microbenchmark every time.
}
```

---

## 14. Visualization — fetch

```text
Need a[4]
CPU → L1 miss? → L2 → L3 → RAM
RAM returns cache line containing a[0..15] (example)
Next a[5] likely HIT
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Same Big-O ⇒ same speed."
        ↓
Memory hierarchy disagrees.
        ↓
"Big-O first, then locality/constants."
```

```text
"More threads always faster."
        ↓
False sharing / bandwidth saturation.
        ↓
"Measure; watch shared lines and memory traffic."
```

---

## 16. Common mistakes

- Premature SIMD talk without locality basics.  
- Ignoring alignment/padding when discussing false sharing.  
- Claiming exact cache sizes for all CPUs.  

---

## 17. Company use cases

HFT, game engines, databases, analytics scans, ML data loaders, any hot loop on large data.

---

## 18. Related concepts

OS virtual memory, profiling, concurrency, DB page cache, compiler optimizations (vectorization).

---

## 19. Revision checklist

- [ ] Hierarchy order  
- [ ] Cache line idea  
- [ ] Vector vs list locality  
- [ ] Row/column traversal  
- [ ] False sharing  
- [ ] Big-O vs reality  

**Spaced repetition:** Explain chef/fridge analogy + one code example weekly.  
**Practice:** Predict which matrix loop is faster; verify with a small benchmark later.  
**Exit check:** Whiteboard why linked-list DFS can lose to adjacency arrays.
