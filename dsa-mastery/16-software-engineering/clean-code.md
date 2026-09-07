# Clean Code (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** writing working functions  
**Memory picture:** Clean code is a tidy kitchen. You can cook fast tomorrow because today’s chef labeled spices and didn’t leave knives in the sink.

---

## 1. What is it?

**Clean code** means code that humans can understand, change, and trust quickly. It is not “fancy.” It is **clarity, small pieces, good names, low surprise**.

Interview angle: write readable solutions on a whiteboard/IDE; explain tradeoffs; review a snippet.

New words:

- **Readability** — ease of understanding intent.  
- **Abstraction** — hiding detail behind a clear name/interface.  
- **Coupling** — how tangled two parts are.  
- **Cohesion** — how focused one module is.  
- **Smell** — symptom of design trouble (not always a bug).  
- **DRY** — Don’t Repeat Yourself (wisely).  
- **YAGNI** — You Aren’t Gonna Need It.  
- **Tech debt** — shortcuts that cost future interest.

---

## 2. Explain like I am 10

Two toy instruction manuals: one uses clear steps and names; one uses secret codes. Both build the toy; only one lets your friend finish without crying.

---

## 3. Why it exists

Code is read more than written. Teams change. Interviews simulate future teammates reading your code under time pressure.

Without clean code: every change risks breakage; onboarding takes months.

---

## 4. Names that teach

```cpp
// Bad
int d; // days? distance?
vector<int> t;

// Better
int daysUntilDeadline;
vector<int> timestampsMs;
```

Functions: verbs; booleans: `is/has/can`; avoid encodings like `iFlag1`.

**Length rule:** longer names for larger scopes; loop `i` is OK locally.

---

## 5. Functions: one job

```cpp
// Mixed responsibilities — hard to test/name
void process() {
    readFile();
    parse();
    talkToServer();
    render();
}

// Split by job
auto raw = readFile(path);
auto data = parse(raw);
auto view = toViewModel(data);
render(view);
```

**Heuristic:** if you need “and” in the name, maybe split.

---

## 6. Comments: why, not what

```cpp
// Bad: comments what code already says
i++; // increment i

// Good: explains non-obvious why
// Binary search upper_bound-1: we need last index with pred==true
```

Prefer clearer code over comments; keep comments for invariants, tradeoffs, external quirks.

---

## 7. Error handling clarity

Don’t silently swallow errors. Prefer explicit returns / exceptions policy consistent with codebase.

```cpp
// Surprising
int parse(const string& s) { return stoi(s); } // throws — document or wrap
```

In interviews: mention invalid input handling early.

---

## 8. DRY vs wrong abstraction

Duplication is cheaper than the wrong shared function that couples unrelated features.

```text
Rule of three (soft): wait before abstracting
YAGNI: don't build unused frameworks
```

---

## 9. Boy Scout rule

Leave the file a little cleaner than you found it — rename a confusing variable, extract a function — in the same PR when safe.

Don’t mix giant unrelated cleanups with feature work (review hell).

---

## 10. C++ readability habits for interviews

```cpp
#include <bits/stdc++.h> // contests OK; interviews: prefer normal includes if asked
using namespace std;      // contests OK; larger projects: avoid in headers

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> need; // value -> index
    for (int i = 0; i < (int)nums.size(); ++i) {
        int x = nums[i];
        if (need.count(target - x)) return {need[target - x], i};
        need[x] = i;
    }
    return {};
}
```

Speak intent while coding; use meaningful names even under timer.

---

## 11. Smells (recognize)

| Smell | Hint |
|---|---|
| Long function | extract steps |
| Long parameter list | bundle object / struct |
| Magic numbers | named constants |
| Deep nesting | early return / guard clauses |
| Feature envy | method uses other object more than self |
| God class | split responsibilities |

**Guard clause:**

```cpp
int score(const User* u) {
    if (!u) return 0;
    if (!u->active) return 0;
    // happy path less nested
    return u->points;
}
```

---

## 12. Common interview Q&A

**Q1. What is clean code?**  
A: Code optimized for human understanding and safe change; examples: names, small functions, clear errors.

**Q2. DRY always good?**  
A: No — premature abstraction can hurt; duplicate until pattern is clear.

**Q3. How balance speed vs cleanliness in interviews?**  
A: Correct first; keep names clear; short helpers if it reduces bugs; avoid architecture astronautics.

**Q4. What is tech debt?**  
A: Intentional/unintentional shortcuts that slow future delivery; manage explicitly.

**Q5. When are comments necessary?**  
A: Non-obvious rationale, invariants, workarounds with tickets/links.

**Q6. How review someone else’s code for cleanliness?**  
A: Clarity of intent, tests, edge handling, coupling, naming — not pure style nitpicks.

---

## 13. Visualization — nesting flatten

```text
Bad:                 Better:
if (a)               if (!a) return;
  if (b)             if (!b) return;
    if (c)           doWork();
      doWork();
```

---

## 14. Wrong Thinking → Correct Thinking

```text
"Clever one-liners = senior."
        ↓
Team can't modify them.
        ↓
"Clarity is seniority signal."
```

```text
"I'll clean everything later."
        ↓
Later never comes; debt compounds.
        ↓
"Boy scout small improvements continuously."
```

---

## 15. Common mistakes

- Renaming everything in a bugfix PR.  
- 8-layer inheritance “for cleanliness.”  
- Abbreviations only you understand.  
- Inconsistent style in one file.  

---

## 16. Company use cases

Code review culture, long-lived codebases, onboarding, incident readability at 3am.

---

## 17. Related concepts

Refactoring, design patterns (use sparingly), testing (testable code), debugging ease.

---

## 18. Mini rewrite exercise

Before:

```cpp
int f(vector<int> a, int k){
  int r=-1e9; for(int i=0;i<a.size();i++){int s=0; for(int j=i;j<a.size()&&j<i+k;j++)s+=a[j]; r=max(r,s);} return r;
}
```

After: named `maxSumOfWindowK`, extract window sum or sliding window — readable + often faster algorithmically.

---

## 19. Practice

1. Rename 10 bad variables in old code.  
2. Split a 60-line function into 3.  
3. Replace magic numbers.  
4. Practice explaining your interview code’s structure in 30s.

---

## 20. Revision checklist

- [ ] Names teach  
- [ ] One-job functions  
- [ ] Comments = why  
- [ ] DRY wisely + YAGNI  
- [ ] Guard clauses  
- [ ] Smells list  

**Spaced repetition:** Clean one function per day for a week.  
**Exit check:** Review a messy 20-line snippet; list 5 concrete improvements.
