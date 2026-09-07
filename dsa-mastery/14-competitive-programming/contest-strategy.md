# Contest Strategy

**Module:** 14-competitive-programming  
**Level target:** L5 (calm execution under timer)  
**Prerequisite:** platforms overview, confident coding of basic DS/algo  
**Memory picture:** A contest is a treasure hunt with a clock. Open easy chests first, mark hard doors, return with better keys.

---

## 1. What is it?

**Contest strategy** is how you choose problems, manage time, debug, and decide when to move on — not just how you invent algorithms.

Skill without strategy = knowing recipes but burning dinner every night because you never check the clock.

New words:

- **First AC** — first accepted solution; often worth more psychologically than points alone.
- **Upsolve** — solve after contest what you missed.
- **Wrong answer spiral** — repeated WA without new information.
- **Reading speed vs solving speed** — both matter; reading carefully saves hours.
- **Cold start** — first 10 minutes when nerves are highest.

---

## 2. Explain like I am 10

You have 2 hours and 6 boxes. Some open with a simple key. Some need a puzzle. If you spend all time on the hardest box, you leave with nothing. Smart kids open easy boxes first, then medium, then hard.

---

## 3. Real life story

Aman opens problem F first “because it’s interesting.” 70 minutes later: no AC, stress high, A–C still unread. Friend opens A,B,C in 40 minutes, attempts D, finishes contest with 4 solves. Same skill band — different strategy — different rank.

---

## 4. Why does this exist?

Problems are unsorted by your personal strengths. The scoreboard rewards **points over elegance**. Strategy converts knowledge into rank.

---

## 5. What problem existed before strategy?

Students treated contests like homework: pick one hard problem, stare, maybe finish. Contests punish that. Parallel opportunity cost is real.

---

## 6. What happens without it?

```text
No triage        → stuck on one problem
No smoke tests   → WA spam
No time boxes    → zero ACs
Panic coding     → broken edge cases
Skip upsolve     → same mistake next week
```

---

## 7. How people invented contest craft

ICPC teams wrote playbooks: who reads, who codes, when to reset. Online contests adapted: personal triage, templates, stress control. Top contestants treat strategy as a skill equal to DP.

---

## 8. Computer intuition — your brain as scheduler

```text
Problems = jobs
Time = CPU budget
Context switch cost = real (don't thrash every 2 minutes)
Priority = expected points / expected time
```

You are an OS scheduler for your own attention.

---

## 9. Mathematical intuition — expected value

Suppose:

- A: 80% solve in 15 min → high EV  
- D: 20% solve in 60 min → lower EV early  

Early contest: maximize EV. Late contest with nothing left: gamble on hardest openable problem.

Rough rule:

```text
EV ≈ P(solve) * points / expected_minutes
```

You won’t compute numbers — feel them.

---

## 10. Step-by-step contest playbook

### Phase 0 — Setup (before start)

- Template compiles.  
- Snippets ready (DSU, binary search, mod int).  
- Water, keyboard comfort, notifications off.  
- Know contest length and penalty rules.

### Phase 1 — Opening (first 10–15 min)

1. Skim **all** problem titles + constraints.  
2. Mark: Easy / Medium / Hard / Skip-for-now.  
3. Start with easiest clear win.  
4. Do **not** deep-dive a scary problem yet.

### Phase 2 — Harvest easy points

- Implement carefully, not fancy.  
- Test samples + 2–3 edge cases before submit.  
- After AC, breathe 10 seconds, then next.

### Phase 3 — Medium hunt

For each candidate:

```text
1) Restate problem in 1 sentence
2) Constraints → complexity budget
3) Pattern guess (greedy/DP/graph/...)
4) Brute for n small? think better
5) Commit to approach or park it
```

Time box: if no approach in 15–25 minutes, park and look elsewhere.

### Phase 4 — Hard / endgame

- Re-read parked problems with fresh eyes.  
- Try smaller constraints version / brute + optimize.  
- If near end: choose ONE problem and go deep.  
- Don’t submit random guesses in last 30 seconds unless scoring system rewards it (usually doesn’t).

### Phase 5 — After contest (mandatory)

- Upsolve next unsolved.  
- Read editorial.  
- Re-code without copy-paste.  
- Note 1 mistake category (reading / bug / algo gap).

---

## 11. Dry run — 2-hour Div. 2 simulation

| Time | Action |
|---|---|
| 0:00–0:12 | Skim A–F; mark A,B easy; C medium; D unclear; E/F hard |
| 0:12–0:25 | Solve A; sample + edge n=1 |
| 0:25–0:45 | Solve B; careful with 64-bit |
| 0:45–1:15 | Attack C; WA once; fix off-by-one |
| 1:15–1:35 | Try D; no idea; switch to think on C leftover? already AC |
| 1:35–1:55 | New idea for D binary search; code |
| 1:55–2:00 | Stress small tests; submit |

Result mindset: 3–4 solves good; upsolve D/E next day.

---

## 12. Visualization — triage board

```text
[A] ####......  clear, do first
[B] ####......  clear, do second
[C] ##~~......  idea fuzzy, attempt after A/B
[D] ..........  park
[E] ..........  park
[F] ..........  park

Later:
[D] ##~~~~....  binary search on answer?
```

---

## 13. Complexity budgeting from constraints

| n | Typical safe complexity |
|---|---|
| n ≤ 20 | O(2^n * poly) / O(n!) careful |
| n ≤ 100 | O(n^3) maybe |
| n ≤ 1000 | O(n^2) |
| n ≤ 1e5 | O(n log n) |
| n ≤ 1e6 | O(n) / O(n log n) tight |
| n ≤ 1e7+ | O(n) careful constants |

Always read **t** test cases: total work is often `sum n`, not `n` alone.

---

## 14. Why this complexity skill matters

Wrong budget → beautiful O(n^2) that TLEs. Strategy includes **constraint reading as step zero of every problem**.

---

## 15. C++ contest execution habits

```cpp
// Fast I/O
ios::sync_with_stdio(false);
cin.tie(nullptr);

// Multi-test
int T; cin >> T;
while (T--) solve();

// Debug macro (disable offline)
#ifdef LOCAL
#define dbg(x) cerr << #x << " = " << (x) << "\n"
#else
#define dbg(x) ((void)0)
#endif
```

Prefer `long long` when values can exceed 2e9. Watch `int` overflow in `mid = (l+r)/2` on huge bounds — use `l + (r-l)/2`.

---

## 16. STL / template strategy

Bring a short notebook:

- DSU  
- Binary search predicates  
- Dijkstra  
- Segment tree / Fenwick (if in your range)  
- Mod arithmetic  

Don’t paste giant unused libraries — navigation cost rises.

---

## 17. Brute Force contest strategy

Open hardest → hero attempt → fail → panic.

---

## 18. Better

Easy first, but no upsolve — slow growth.

---

## 19. Optimal

```text
Triage → harvest → time-boxed medium → endgame focus
+ systematic upsolve + error journal
```

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
"I'll submit quickly; samples passed."
        ↓
Hidden cases WA; penalty; tilt.
        ↓
"Samples + edges + constraint extremes before submit."
```

```text
"I must finish this problem because I started it."
        ↓
Sunk cost eats the contest.
        ↓
"Park after time box; return later."
```

```text
"Contests are only about knowing algorithms."
        ↓
Equal knowledge, worse rank.
        ↓
"Algorithms + reading + triage + debugging = rank."
```

---

## 21. Common mistakes

1. Misreading **multiple test cases**.  
2. Using 32-bit ints when product needs 64-bit.  
3. Off-by-one on inclusive bounds.  
4. Forgetting to reset arrays between tests.  
5. Recursion stack overflow.  
6. Printing wrong format (spaces/newlines).  
7. Debugging by changing random lines.  
8. Ignoring memory limits on `vector` of vectors sized 1e5×1e5 thoughts.

**Debugging ladder:**

```text
Re-read statement
  → check types/overflow
  → check reset between tests
  → handmade tiny case
  → brute vs efficient for n≤10
  → then change algorithm
```

---

## 22. Interview tricks + simulation

Contests ≠ interviews, but reuse:

| Contest habit | Interview translation |
|---|---|
| Restate problem | Clarify requirements |
| Constraints → complexity | Discuss Big-O early |
| Edge cases before submit | Tests before “done” |
| Time box | Don’t silent-stuck 20 min — speak |

**Say in interview:** “I’d clarify constraints first — that sets O(n log n) vs O(n^2).”

---

## 23. Company use cases

Onsites sometimes feel like mini-contests (timed coding). Strategy reduces blank-screen panic. Internships with hackathons also reward triage.

---

## 24. Related concepts + cues

| Cue | Move |
|---|---|
| Many problems, short time | Hard triage |
| ICPC one PC | Strict role + queue coding |
| Interactive problem | Flush output; follow protocol |
| Partial scoring (IOI-like) | Grab subtasks first |

Related: rating climb plan, C++ template, pattern book.

---

## 25. Revision notes + practice roadmap + spaced repetition

**Sticky rules:**

1. Skim all → easy first.  
2. Constraints dictate algorithms.  
3. Time-box mediums.  
4. Test edges before submit.  
5. Upsolve always.

**Practice:**

- 1 virtual contest / week.  
- After each: write 5-line postmortem.  
- Monthly: re-virtual an old contest; compare composure.

**Spaced repetition cues:** Before every live contest, re-read Phase 1–4 (2 minutes).

**Exit check:** Narrate a full 2-hour plan aloud without notes.
