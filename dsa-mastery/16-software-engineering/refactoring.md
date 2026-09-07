# Refactoring (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** testing basics, clean code, Git  
**Memory picture:** Refactoring is renovating a house while living in it. You improve the wiring without changing the house’s address (behavior). Tests are the smoke alarms.

---

## 1. What is it?

**Refactoring** means changing the structure of code **without changing its external behavior**, to make it easier to understand and modify.

Not refactoring: rewriting features, “while I’m here” random behavior changes, or big-bang rewrites with no safety net.

New words:

- **Behavior-preserving** — same outputs for same inputs (observable).  
- **Smell** — clue that structure hurts change.  
- **Extract function/class** — move code into named unit.  
- **Inline** — opposite when abstraction hurts.  
- **Seam** — place you can alter behavior without editing hard code (tests/mocks).  
- **Strangler fig** — gradually replace old system around the edges.

---

## 2. Explain like I am 10

Your backpack is messy. You reorganize pockets so snacks and books are easier to find. You still carry the same stuff to school — that’s refactoring. Buying a new backpack and leaving half your books at home is a rewrite with behavior change.

---

## 3. Why it exists

Requirements change. Structure that fit yesterday fights today. Refactoring is continuous design. Interviews ask: “How would you clean this up?” and watch if you keep behavior safe.

Without refactoring: entropy → rewrite fantasies → risk.

---

## 4. Golden rule

```text
No tests / no oracle  →  high-risk refactor
Small steps + tests   →  professional refactor
```

Prefer many tiny commits over one monster “cleanup.”

---

## 5. Classic moves (with C++ flavor)

### Extract function

```cpp
// Before
void report(const vector<int>& a) {
    int s = 0; for (int x : a) s += x;
    cout << "sum=" << s << "\n";
}

// After
int sumOf(const vector<int>& a) {
    int s = 0; for (int x : a) s += x; return s;
}
void report(const vector<int>& a) {
    cout << "sum=" << sumOf(a) << "\n";
}
```

### Rename

Cheap high-value. Use IDE rename when possible.

### Replace magic number with constant

```cpp
constexpr int kMaxRetries = 3;
```

### Introduce parameter object / struct

When 5 related args travel together.

### Guard clauses to reduce nesting

### Replace conditional with polymorphism / Strategy

When `switch(type)` grows stably.

### Move function closer to data

Improve cohesion.

---

## 6. Workflow

```text
1 Ensure characterization tests (pin current behavior)
2 Identify one smell
3 Apply one refactoring
4 Run tests
5 Commit
6 Repeat
```

If red: undo/fix before continuing.

---

## 7. Characterization tests (legacy)

When code has no tests and unclear intent:

1. Write tests that lock **current** behavior (even quirks).  
2. Refactor under that safety net.  
3. Later change behavior deliberately with test updates.

---

## 8. Refactor vs rewrite vs fix

| Action | Behavior | Structure |
|---|---|---|
| Bugfix | changes (corrects) | maybe |
| Refactor | same | improves |
| Feature | adds | maybe |
| Rewrite | often changes | rebuilds |

Don’t mix unlabeled. In PR: separate commits or PRs when possible.

---

## 9. When to refactor

- Before adding a feature in a messy area (“make the change easy, then make the easy change”).  
- After a bugfix once green (clean the cause site).  
- When a smell blocks understanding.  

**When not:** night before deadline in untested core; drive-by reformat of 10k lines unrelated to task.

---

## 10. Strangler pattern for big legacy

```text
New system handles some traffic
   ↓ more routes over time
Old system shrinks
   ↓
Remove old
```

Safer than big-bang cutover.

---

## 11. Interview demonstration tips

If given messy code:

1. Restate behavior.  
2. Propose tests/edges.  
3. Extract names/helpers.  
4. Mention complexity improvements if structure reveals algorithm upgrade — label that as separate from pure refactor.

---

## 12. Common interview Q&A

**Q1. What is refactoring?**  
A: Improve structure without changing observable behavior, usually in small tested steps.

**Q2. How keep refactors safe?**  
A: Tests, tiny steps, version control, pair/review.

**Q3. Extract method benefits?**  
A: Naming intent, reuse, testing smaller units, reducing nesting.

**Q4. When rewrite?**  
A: When architecture fundamentally wrong *and* you can migrate safely; still prefer incremental strangler often.

**Q5. Is changing O(n^2) to O(n) refactoring?**  
A: If outputs identical, it’s behavior-preserving performance change — still validate thoroughly; some call only structural changes “refactor.” Be precise: say “behavior-preserving optimization.”

**Q6. How handle huge class?**  
A: Identify responsibilities; extract collaborators gradually with tests.

**Q7. What is a seam?**  
A: Place to alter behavior for tests (virtual interface, function pointer, DI) without editing all consumers.

---

## 13. Mini before/after

Before: nested parse + validate + save in one function.  
After: `parse` → `validate` → `save` with tests each; main orchestrates.

Behavior same; debugging faster.

---

## 14. Visualization — steps

```text
[messy] --extract-- [clearer] --rename-- [clear] --split-- [modular]
   | tests green at each hop
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Big rewrite this weekend."
        ↓
Unknown behavior, long dark tunnel.
        ↓
"Incremental refactors under tests / strangler."
```

```text
"Refactor and add features same commit unlabeled."
        ↓
Reviewers can't see cause of bugs.
        ↓
"Separate structural commits from behavior commits."
```

---

## 16. Common mistakes

- Refactoring without running anything.  
- Drive-by renames across unrelated modules in urgent hotfix.  
- Gold-plating patterns mid-refactor.  
- Breaking public APIs silently.  

---

## 17. Company use cases

Continuous delivery on legacy systems, post-incident hardenings, prep for features, performance structure prep (then profile).

---

## 18. Related concepts

Testing, clean code, design patterns as *targets* of refactor, Git bisect-friendly small commits, debugging.

---

## 19. Practice

1. Take a 40-line messy function; extract 2 helpers with asserts.  
2. Add characterization tests to a quirky snippet.  
3. Practice a PR with 3 commits: test → refactor → feature.  
4. Replace a growing switch with Strategy only after 3rd case.

---

## 20. Revision checklist

- [ ] Behavior-preserving definition  
- [ ] Tiny steps + tests  
- [ ] Extract / rename / guard  
- [ ] Characterization tests  
- [ ] Refactor ≠ rewrite ≠ feature  
- [ ] Strangler idea  

**Spaced repetition:** Each week refactor one old solution’s structure.  
**Exit check:** Explain how you’d safely clean a 500-line function with no tests.
