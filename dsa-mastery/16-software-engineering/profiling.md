# Profiling (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L3–L4  
**Prerequisite:** Big-O, memory hierarchy intuition, running C++ programs  
**Memory picture:** Profiling is a fitness watch for code. Feelings lie (“this loop looks slow”); the watch shows which exercise burned the minutes.

---

## 1. What is it?

**Profiling** measures where a program spends time, memory, or other resources **while running**. It guides optimization so you don’t polish the wrong doorknob.

New words:

- **Hot path / hot spot** — where most time goes.  
- **Sample profiler** — periodically samples call stack (low overhead).  
- **Instrumentation** — insert timing probes (more overhead, precise).  
- **Flame graph** — visualization of stack samples (wide = hot).  
- **Microbenchmark** — tiny timed test; easy to fool yourself.  
- **Amdahl’s law** — speedup limited by the fraction you optimize.

---

## 2. Explain like I am 10

You’re late for school. You guess “shoe tying is slow,” but a timer shows you spent 20 minutes looking for the backpack. Fix backpack finding first.

---

## 3. Why it exists

Premature optimization wastes time and complicates code. Profiling finds the real bottleneck. Interviews love: “How would you make this faster?” → measure, then algorithmic + locality fixes.

Without profiling: random `-O3` superstition and micro-tweaks that don’t move latency percentiles.

---

## 4. Optimization order of operations

```text
1 Correctness first
2 Better algorithm / data structure (Big-O)
3 Reduce work (caching, avoid copies)
4 Locality / constants
5 Parallelism
6 Micro-arch tricks last
Always: measure before/after
```

---

## 5. Amdahl’s law (intuition)

If 10% of time is module X, even infinite speedup of X → at most ~10% total gain.

```text
Total time = hot + cold
Speedup limited by cold remainder
```

Focus on dominant slices.

---

## 6. What to measure

| Metric | When |
|---|---|
| CPU time | compute-bound |
| Wall time | includes waits |
| Latency percentiles (p50/p95/p99) | servers |
| Allocations / bytes | memory churn |
| Cache misses | advanced perf |
| I/O wait | disks/network |

Interview servers care about **p99** more than average sometimes.

---

## 7. C++ practical starter

```bash
# Build with symbols, optimizations like prod
g++ -std=c++17 -O2 -g -o app app.cpp

# Linux sample: perf (if available)
# perf record -g ./app
# perf report

# macOS: Instruments; Windows: VTune / VS profiler / Very Sleepy etc.
```

Even without fancy tools:

```cpp
#include <chrono>
#include <iostream>
using namespace std;
using clk = chrono::high_resolution_clock;

int main() {
    auto t0 = clk::now();
    // work...
    auto t1 = clk::now();
    auto ms = chrono::duration_cast<chrono::milliseconds>(t1 - t0).count();
    cerr << "work took " << ms << " ms\n";
}
```

Use steady clocks for intervals; beware optimizing away work — consume results.

---

## 8. Flame graphs (read them)

```text
         [main                    ]
      [compute          ][io]
   [sort     ][hash]
████████████
 wide plateau = hot function
```

Read bottom-up or top-down depending on tool; learn which stacks dominate.

---

## 9. Microbenchmark traps

- Compiler deletes unused work.  
- CPU frequency scaling / cold start.  
- Tiny N not representative.  
- Measuring debug `-O0` builds.  
- Ignoring variance — run many iterations.

Prefer realistic inputs + statistical runs (Google Benchmark style mindset).

---

## 10. Algorithmic vs micro wins (examples)

```cpp
// Algorithmic: n^2 → n log n sort+scan
// Data structure: list → vector for scans
// Work avoidance: recompute → memo / prefix
// Copies: pass const& ; move when owning
// Reserve: vector.reserve(n) to cut allocs
```

```cpp
vector<int> v;
v.reserve(n);
for (int i = 0; i < n; ++i) v.push_back(i);
```

---

## 11. Memory profiling intuition

Allocation churn shows up as time in `malloc`/`new`. Fix with reserves, arenas, object pools (careful), fewer temporaries.

Leak ≠ slowness always, but growth kills long-running services.

---

## 12. Common interview Q&A

**Q1. How do you optimize?**  
A: Measure hotspots → fix biggest algorithmic issue → re-measure → iterate.

**Q2. What is a flame graph?**  
A: Visualization of sampled stacks; width shows relative time.

**Q3. Why not optimize everything?**  
A: Amdahl + complexity cost; maintainability.

**Q4. Wall vs CPU time?**  
A: Wall includes blocking; CPU is compute on core(s).

**Q5. When is micro-opt OK?**  
A: After algo is good; hotspot proven; clarity preserved or justified.

**Q6. How verify improvement?**  
A: Before/after metrics on same workload; watch variance; keep regression benches.

**Q7. p99 latency?**  
A: 99% of requests faster than this; captures tail pain.

**Q8. Common C++ perf bugs?**  
A: Accidental copies, `endl` flush, wrong complexity, poor locality, contention.

---

## 13. Mini case study

Symptom: API p99 800ms. Guess: JSON library. Profile: 70% time in O(n^2) string concat building response. Fix: reserve / rope / stream builder → p99 120ms. Moral: measure.

---

## 14. Visualization — before guessing

```text
Feeling map:  "parser is slow"
Actual map:   ████████ serialize
              ██ parse
              █  other
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Faster language will save us."
        ↓
O(n^2) in any language hurts.
        ↓
"Algorithm and data layout first."
```

```text
"I optimized a cold function a lot."
        ↓
No user-visible change.
        ↓
"Profile; Amdahl guides attention."
```

---

## 16. Common mistakes

- Profiling debug builds as truth.  
- Shipping timing logs that dominate runtime.  
- Optimizing without correctness tests.  
- Celebrating mean when p99 worse.  

---

## 17. Company use cases

Backend latency, game frame budgets, data pipelines, battery/CPU on mobile, cost control in cloud (CPU-hours).

---

## 18. Related concepts

Memory-cache-CPU, debugging, testing (perf regression tests), clean code (readable until proven hot).

---

## 19. Practice

1. Time two matrix traversal orders.  
2. Compare `push_back` with/without `reserve`.  
3. Intentionally write O(n^2); profile vs O(n log n).  
4. Read one flame graph screenshot from docs/blog.

---

## 20. Revision checklist

- [ ] Measure before optimize  
- [ ] Amdahl one-liner  
- [ ] Hot spot / flame graph idea  
- [ ] Wall vs CPU  
- [ ] Microbench traps  
- [ ] Algo before micro  

**Spaced repetition:** Retell the API case study monthly.  
**Exit check:** Given a slow program story, list your first 5 measurement steps.
