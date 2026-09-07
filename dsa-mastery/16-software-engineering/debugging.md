# Debugging (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** reading C++ errors; basic Git  
**Memory picture:** Debugging is detective work. Don’t rebuild the whole city — find the broken streetlight with clues, experiments, and a flashlight (debugger).

---

## 1. What is it?

**Debugging** is the systematic process of finding and fixing defects. Pros don’t randomly change code; they form hypotheses and test them.

New words:

- **Repro** — steps that reliably cause the bug.  
- **Regression** — something that used to work broke.  
- **Heisenbug** — changes when observed (often races/UB).  
- **Oracle** — known-correct source (brute force, older version, spec).  
- **Bisect** — binary search history for breaking change.  
- **Sanitizer** — tool that detects UB/leaks/races at runtime.

---

## 2. Explain like I am 10

Your toy car won’t roll. You don’t melt and rebuild the whole car first. You check: wheels stuck? Battery? Carpet bump? One check at a time.

---

## 3. Why it exists

All non-trivial software has bugs. Debugging skill often separates “can code” from “can ship.” Interviews watch how you debug live.

Without method: thrashing, new bugs, lost confidence.

---

## 4. The scientific loop

```text
1 Observe failure (exact symptoms)
2 Make smallest repro
3 Form hypothesis
4 Run an experiment that could falsify it
5 Fix the root cause (not only symptom)
6 Add a regression test
```

---

## 5. First questions checklist

1. What did I expect?  
2. What happened instead?  
3. When did it last work?  
4. What’s the smallest input that fails?  
5. Is it deterministic?  

**Minimize:** shrink code/input until bug still appears — fewer suspects.

---

## 6. Print debugging vs debugger

**Print / logging:** quick, works remotely, good for distributed systems.  
**Debugger (gdb/lldb/IDE):** breakpoints, step, inspect locals, watchpoints.

```bash
g++ -std=c++17 -g -O0 -o app app.cpp
gdb ./app
# break main; run; next; print x
```

Use both. Logging without levels becomes noise.

---

## 7. Contest / algorithm debugging kit

```text
WA → check types/overflow/reset/edges
TLE → complexity / bad constant / cin sync
RE → OOB / recursion / assert
```

**Brute force oracle:**

```cpp
// Teaching pattern
bool slow(const vector<int>& a); // correct but O(n^2)
bool fast(const vector<int>& a); // candidate

// random small tests compare slow vs fast
```

This is gold for CP and interview follow-ups.

---

## 8. Sanitizers (C++)

```bash
g++ -std=c++17 -O1 -g -fsanitize=address,undefined -o app app.cpp
g++ -std=c++17 -O1 -g -fsanitize=thread -o app app.cpp   # races; can't mix freely with ASan all setups
```

- **ASan:** out-of-bounds, use-after-free  
- **UBSan:** many UB kinds  
- **TSan:** data races  

Run on tests before blaming “compiler bugs.”

---

## 9. Read the stack

Crash → backtrace. Find **your** top frame; don’t drown in library frames first.

```text
segfault in foo() line 42
  called by bar()
  called by main()
→ inspect args/indices at foo
```

---

## 10. Binary search the bug

- **In code:** comment half / feature flag.  
- **In time:** `git bisect`.  
- **In input:** delete half the JSON/array until minimal fail case.

---

## 11. Concurrency bugs

Symptoms: rare, timing-dependent, disappears under debugger.

Tactics: TSan, deterministic stress, reduce threads, add logging with thread ids carefully (logging can change timing), reason about ownership.

---

## 12. Common interview Q&A

**Q1. How do you debug?**  
A: Repro → hypothesize → experiment → root fix → regression test. Be concrete with an example.

**Q2. Debugger vs logs?**  
A: Debugger for local state inspection; logs for prod/historical paths; both.

**Q3. What is a regression test?**  
A: Test that fails on the bug and stays in suite to prevent return.

**Q4. How find which commit broke?**  
A: `git bisect` with automated test if possible.

**Q5. Segfault common causes in C++?**  
A: Null/dangling pointers, OOB, bad casts, stack overflow.

**Q6. What if bug isn’t reproducible?**  
A: Gather more telemetry; consider races/UB; increase logging carefully; stress under load; sanitizers.

**Q7. Fix symptom vs root?**  
A: Prefer root; temporary guards only with clear follow-up.

**Q8. How debug wrong answer in algo interview?**  
A: Trace example by hand; check invariants; edges n=0/1; compare brute.

---

## 13. C++ example — invariant assert

```cpp
#include <cassert>
#include <vector>
using namespace std;

int maxSubarray(const vector<int>& a) {
    assert(!a.empty());
    int best = a[0], cur = a[0];
    for (size_t i = 1; i < a.size(); ++i) {
        cur = max(a[(int)i], cur + a[(int)i]);
        best = max(best, cur);
        // invariant: best is max over prefixes processed
    }
    return best;
}
```

Assertions document beliefs; disable carefully in hot prod paths if needed, but keep tests.

---

## 14. Visualization — narrow the search

```text
Big system failure
   → one service
      → one request
         → one function
            → one line / invariant
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Change stuff until it works."
        ↓
No learning; shadow bugs remain.
        ↓
"One hypothesis at a time."
```

```text
"I'll rewrite the module."
        ↓
May rewrite without understanding; new bugs.
        ↓
"Understand failure first; rewrite only if design is wrong."
```

---

## 16. Common mistakes

- Fixing without repro.  
- Changing multiple variables per experiment.  
- Ignoring compiler warnings.  
- Not checking the simple case (wrong file deployed, wrong env).  
- Leaving debug prints forever.  

---

## 17. Company use cases

On-call incidents, flaky tests, customer reports, performance cliffs mislabeled as “bugs.”

---

## 18. Related concepts

Testing, profiling (sometimes “bug” is slowness), Git bisect, sanitizers/compiler UB, concurrency.

---

## 19. Practice

1. Break a binary search on purpose; find with traces.  
2. Run ASan on a dangling pointer demo.  
3. Use `git bisect` on a toy repo.  
4. Write a slow-vs-fast checker for a greedy.

---

## 20. Revision checklist

- [ ] Scientific loop  
- [ ] Minimal repro  
- [ ] Debugger basics  
- [ ] Sanitizers  
- [ ] Bisect idea  
- [ ] Fix + regression test  

**Spaced repetition:** Narrate debugging story of a past bug weekly.  
**Exit check:** Debug a live WA with oracle method while speaking aloud.
