# Testing (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** writing functions; debugging basics  
**Memory picture:** Tests are robot interns that click your app’s buttons every night and scream if something breaks. They don’t replace thinking — they protect it.

---

## 1. What is it?

**Software testing** checks that code behaves as intended. Interviews care about: unit vs integration, edge cases, test design, TDD idea, mocks (lightly), coverage limits, and how you’d test *your* solution.

New words:

- **Unit test** — small piece in isolation.  
- **Integration test** — components together (DB, network).  
- **E2E / system** — full user path.  
- **Assertion** — expected vs actual check.  
- **Fixture** — setup data/environment.  
- **Mock / stub** — fake dependency.  
- **Flaky test** — sometimes fails without code change.  
- **Regression test** — locks a fixed bug out forever.

---

## 2. Explain like I am 10

Before a school play, you rehearse scenes (unit), then the whole play with lights (integration), then a dress rehearsal (E2E). Missing rehearsal → surprises on stage.

---

## 3. Why it exists

Humans break things when changing code. Tests give fast feedback and courage to refactor. Without tests: fear, manual clicking, regressions in production.

---

## 4. Test pyramid

```text
      /\        E2E (few, slow, brittle)
     /  \       Integration (some)
    /____\      Unit (many, fast)
```

Prefer many fast unit tests; fewer broad tests. All layers matter.

---

## 5. What makes a good unit test

**FIRST-ish ideas:**

- Fast  
- Isolated  
- Repeatable  
- Self-checking (pass/fail automatic)  
- Timely (written close to code)

**Structure: Arrange–Act–Assert**

```cpp
#include <cassert>
#include <vector>
using namespace std;

int sum(const vector<int>& a) {
    int s = 0; for (int x : a) s += x; return s;
}

void test_sum_basic() {
    // Arrange
    vector<int> a{1, 2, 3};
    // Act
    int got = sum(a);
    // Assert
    assert(got == 6);
}

void test_sum_empty() {
    assert(sum({}) == 0);
}

int main() {
    test_sum_basic();
    test_sum_empty();
}
```

Real projects use GoogleTest/Catch2/doctest — same ideas.

---

## 6. Cases you must invent in interviews

For any function, list:

1. Happy path  
2. Empty / zero / null  
3. Single element  
4. Duplicates  
5. Negatives / zeros (if numeric)  
6. Maximum constraints  
7. Invalid input (if specified)  

Say them aloud before coding — interview gold.

---

## 7. Table-driven tests

```cpp
struct Case { vector<int> in; int want; };
vector<Case> cases = {
    {{}, 0},
    {{5}, 5},
    {{1,2,3}, 6},
};
for (auto& c : cases) assert(sum(c.in) == c.want);
```

Easy to extend; clear failures if you print case index.

---

## 8. TDD (understand, don’t dogma)

```text
Red: write failing test
Green: minimal code to pass
Refactor: clean up
```

Useful for clear specs. Not mandatory every time — know the loop.

---

## 9. Doubles: stub vs mock (light)

- **Stub:** provides canned answers.  
- **Mock:** also verifies interactions (called once…).  

Over-mocking = brittle tests tied to internals. Prefer testing observable behavior.

---

## 10. Coverage — useful but limited

100% line coverage ≠ correctness (missed paths/logic).  
0% coverage on critical money code = scary.

Aim meaningful tests on core logic + edges; don’t chase vanity %.

---

## 11. Property / randomized testing (algo friends)

```text
for many random inputs:
  assert(fast(input) == slow(input))
```

Great for algorithms; pair with shrinking to minimal counterexample.

---

## 12. Flaky tests

Causes: time/sleep, real network, race, unordered iteration, shared temp files.

Fix: fake clock, mock network, isolate state, retry only as last resort with investigation.

---

## 13. Common interview Q&A

**Q1. How would you test this function?**  
A: List cases (happy/edge/error), choose unit vs integration, mention automation in CI.

**Q2. Unit vs integration?**  
A: Isolation/speed vs real wiring confidence.

**Q3. What is a regression test?**  
A: Captures a bug once fixed so it can’t return silently.

**Q4. Pros/cons of mocks?**  
A: Speed/isolation vs brittleness/false confidence.

**Q5. How test a concurrent queue?**  
A: Multi-thread stress + invariants; TSan; deterministic schedules if possible.

**Q6. What makes tests maintainable?**  
A: Clear names, behavior focus, little duplication, stable fixtures.

**Q7. Can tests prove correctness?**  
A: No — increase confidence; proofs/types/model checks are stronger but rare.

**Q8. CI role?**  
A: Run suite on every change; block broken merges.

---

## 14. Visualization — feedback loop

```text
change code → run tests → green → refactor safely
                 └ red → debug → fix
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Tests slow me down."
        ↓
Short-term true; long-term speed via less fear.
        ↓
"Test the risky logic; ship with confidence."
```

```text
"One giant E2E is enough."
        ↓
Slow, flaky, weak diagnosis.
        ↓
"Pyramid: many unit + some broader."
```

---

## 16. Common mistakes

- Testing implementation details (private layout).  
- Asserting nothing (test never fails).  
- Giant fixtures nobody understands.  
- Ignoring nondeterminism.  
- No tests for bugfixes.  

---

## 17. Company use cases

CI gates, microservice contracts, mobile device matrices, algorithm correctness harnesses.

---

## 18. Related concepts

Debugging, clean code (testable design), refactoring safety net, Git hooks/CI.

---

## 19. Practice

1. Write 5 tests for binary search edges.  
2. Break code intentionally; ensure test fails.  
3. Add a regression test for an off-by-one you made.  
4. Build slow-vs-fast random tester for a problem.

---

## 20. Revision checklist

- [ ] Pyramid  
- [ ] AAA pattern  
- [ ] Edge case list  
- [ ] Regression idea  
- [ ] Coverage humility  
- [ ] Flaky causes  

**Spaced repetition:** For each new problem, write case list before code (habit).  
**Exit check:** Given `atoi`-like function, recite 8 tests in 60 seconds.
