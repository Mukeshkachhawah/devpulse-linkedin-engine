# Problem-Solving Framework

> **Clarify → Brute → Optimize → Code → Test**  
> This is the spine of every strong coding interview.

---

## 1. Why a Framework?

Without a process, smart people:

- jump into code too early  
- miss constraints  
- freeze when the first idea fails  

Top candidates narrate a **repeatable path**. Interviewers grade the path as much as the final code.

---

## 2. The Five Phases (Overview)

```text
1. CLARIFY   → What exactly is asked? Constraints? Examples?
2. BRUTE     → Correct slow solution you can explain
3. OPTIMIZE  → Pattern + better complexity + tradeoffs
4. CODE      → Clean C++ with invariants
5. TEST      → Edge cases + dry run + complexity restated
```

Time budget for a ~45-minute coding round (one medium/hard):

| Phase | Minutes (guide) |
|---|---|
| Clarify | 3–5 |
| Brute | 3–5 |
| Optimize | 5–8 |
| Code | 15–20 |
| Test | 5–7 |

---

## 3. Phase 1 — Clarify

### Ask / state

1. **Input/output types** and sizes (`n` up to?)  
2. **Duplicates?** negatives? empty?  
3. **In-place** required? mutate OK?  
4. **Multiple answers** — any OK or lexicographically smallest?  
5. **Time/memory** expectations if not stated  

### Restate in one sentence

> "Given ___, I need to return ___."

### Work an example

Use their example, then invent a tiny custom one.  
Write expected output **before** coding.

### Kid check

Explain the problem like you are teaching a 10-year-old. If you can't, you don't understand it yet.

---

## 4. Phase 2 — Brute Force

Always have a correct baseline.

1. Describe the most direct approach.  
2. State complexity honestly (even if O(n³)).  
3. Confirm it matches the examples.  

**Interview gold:**

> "Brute force would try every pair in O(n²). That works for n ≤ 10³ maybe, but here n is 10⁵, so we need better."

Do **not** skip brute if you jump to optimal — at least name it.

---

## 5. Phase 3 — Optimize

### Pattern recognition ritual (30s)

1. Contiguous? sorted? graph? tree?  
2. Optimal / ways / kth / shortest?  
3. Name pattern from Pattern Book.  

### Compare options aloud

```text
Brute:     O(?)
Better:    O(?)  using ___
Optimal:   O(?)  using ___
```

### Trade space for time when useful

Hash maps, prefix arrays, memo tables — say the tradeoff.

### Prove or sketch correctness

- Invariant (two pointers / window)  
- Monotonicity (binary search)  
- Induction / optimal substructure (DP)  
- Exchange argument (greedy)

If you cannot sketch why, keep thinking — don't code hope.

---

## 6. Phase 4 — Code

### Before typing

Write on board/editor:

- function signature  
- main data structures  
- loop invariants in a comment  

### Coding rules (C++)

1. Prefer clear names (`left`, `need`, `dist`).  
2. Handle empty input early.  
3. Use `long long` for sums/products.  
4. Avoid clever one-liners that hide bugs.  
5. Keep helper functions if logic is big.  

### Narrate lightly

> "I'm scanning with R, and shrinking L when the window breaks the distinct-count rule."

Not every line — every **idea**.

### Skeleton habit

```cpp
class Solution {
public:
    // Return type and params from problem
    int solve(...) {
        // 1) edge cases
        // 2) setup structures
        // 3) main loop with invariant
        // 4) return answer
    }
};
```

---

## 7. Phase 5 — Test

### Dry run

Pick one normal case. Trace variables for 5–10 steps out loud.

### Edge checklist (pick what applies)

- empty / single element  
- all equal  
- already sorted / reverse sorted  
- negatives / zeros  
- max constraints stress  
- no answer / impossible → return value  
- duplicates  
- disconnected graph / null tree root  

### Complexity recap

End with:

> "Time is O(___) because ___. Extra space is O(___)."

---

## 8. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| Code in first 60 seconds | Miss constraints | Clarify + example first |
| Silent optimization jump | Interviewer lost | Name brute then improve |
| "It should work" without dry run | Hidden bugs | Trace one case |
| Panic rewrite from scratch | Time death | Fix invariant / small bug |
| Ignore n = 1e5 | TLE algorithm | Match complexity to limits |

---

## 9. Communication Scripts

**Stuck (2 minutes):**

> "I'm considering window vs prefix-hash. Window fits because the segment is contiguous. I'll try that."

**Bug found while testing:**

> "The invariant broke when L moved past a duplicate. I'll erase zero counts from the map."

**Almost out of time:**

> "I have the full approach and complexity. I'll write the core loop cleanly and note the edge case handling."

---

## 10. Mini Example Walkthrough

**Problem:** Longest substring without repeating characters.

1. **Clarify:** string of length n ≤ 1e5; return length.  
2. **Brute:** every i..j check unique O(n²)–O(n³).  
3. **Optimize:** sliding window + last-seen index / freq map O(n).  
4. **Code:** expand R; while duplicate, advance L.  
5. **Test:** `""`, `"a"`, `"au"`, `"pwwkew"` → 3.

---

## 11. Linked Checklist (Print This)

```text
[ ] Restated problem
[ ] Constraints noted
[ ] Example + expected
[ ] Brute named + complexity
[ ] Pattern named
[ ] Optimal explained + complexity
[ ] Edge cases listed
[ ] Code compiles mentally
[ ] Dry run done
[ ] Final complexity spoken
```

---

## Revision Checklist

- [ ] I can run all 5 phases without looking  
- [ ] I always restate + example before code  
- [ ] I name brute even when I know optimal  
- [ ] I dry-run every solution  

**Spaced:** Practice the framework on 3 problems/week with a timer, narrating aloud.
