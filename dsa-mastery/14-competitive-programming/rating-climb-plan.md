# Rating Climb Plan

**Module:** 14-competitive-programming  
**Level target:** L4–L5 (structured improvement to ~1600–2000 CF / ABC comfort)  
**Prerequisite:** contest strategy, platforms overview  
**Memory picture:** Rating is a thermometer, not a trophy. Climb floors one staircase at a time; skipping floors drops you into the basement.

---

## 1. What is it?

A **rating climb plan** is a training system that raises contest rating by fixing skill gaps in order — not by randomly solving “harder” problems.

Focus platforms: **Codeforces** (rating numbers) and **AtCoder** (ABC/ARC ladder). Same ideas transfer to USACO divisions.

New words:

- **Upsolve** — solve after contest.  
- **Topic weak-list** — list of patterns you fail.  
- **Difficulty delta** — problem rating minus your rating.  
- **Stability** — can you repeatedly solve at a band?  
- **Tilt** — emotional spiral after WA/loss.

---

## 2. Explain like I am 10

If you can lift a small backpack, don’t start with a fridge. Lift slightly heavier bags every week. Rating climbs the same way: problems a bit harder than comfortable, many times, with rest and review.

---

## 3. Real life story

Neha is 1200 CF. She only opens 2000-rated problems “to learn.” She fails for hours, feels stupid, quits 2 weeks. Friend at 1200 solves 800–1400 practice mixed with Div. 3 contests + upsolves. In 4 months friend is 1500; Neha is still 1200 and bitter.

Climb = **right difficulty + feedback loops**.

---

## 4. Why does this exist?

Raw talent myths hide the real mechanism: deliberate practice near the edge of ability. Rating plans make that mechanism concrete.

---

## 5. What problem existed before plans?

Endless problem lists, no order, no review. People confuse exposure with mastery.

---

## 6. What happens without a plan?

```text
Random hard problems → burnout
Only live contests     → slow learning
Only practice, no clock → contest panic
No weak-list           → repeat same WA themes
```

---

## 7. Invention of ladders

AtCoder ABC, USACO divisions, CF problem ratings, and ladders (e.g. topic lists) emerged because communities noticed ordered progression works. This plan compresses that wisdom.

---

## 8. Computer intuition — training as optimization

```text
Skill = model
Contest = test set
Upsolve + editorial re-code = gradient update
Sleep = regularization
Ego = overfitting to one lucky contest
```

---

## 9. Mathematical intuition — bands

Think in bands, not exact numbers:

| CF-ish band | Focus |
|---|---|
| <1200 | Implementation, brute, basic greedy, math school |
| 1200–1400 | Binary search, two pointers, basic graphs/DFS/BFS |
| 1400–1600 | Shortest paths, DSU, basic DP, constructive |
| 1600–1900 | Harder DP, trees, segment ideas, combinatorics |
| 1900+ | Advanced topics + speed |

AtCoder ABC: finishing D/E consistently maps to solid interview + mid CF skill.

---

## 10. Step-by-step climb system

### Step A — Measure baseline (1 week)

- 1 CF Div. 3 virtual  
- 1 AtCoder ABC virtual  
- Note: what failed — reading, implementation, algorithm gap?

### Step B — Weekly template (10–14 hours)

| Block | Hours | Work |
|---|---|---|
| Live/virtual contest | 2–3 | 1 contest |
| Upsolve | 2–3 | next 1–2 problems |
| Topic drill | 3–4 | weak pattern × 5–8 problems |
| Mixed practice | 2 | rating ≈ you+100 to you+300 |
| Review notes | 1 | error journal |

### Step C — Practice difficulty rule

```text
50% problems in [rating-200, rating+100]   // confidence
40% problems in [rating+100, rating+300]   // growth
10% harder glimpses                        // inspiration, not ego
```

### Step D — Topic weak-list

Keep a file:

```text
- binary search on answer: failed CF ###
- graph bipartite: WA on odd cycle
- knapsack DP: index off-by-one
```

Each week retire 1 weakness with 5 targeted solves + 1 re-code from memory.

### Step E — Promotion rule

Move target band only when:

- You solve expected easy/medium in contests **3 times in a row**, and  
- Upsolve of next problem no longer feels alien.

---

## 11. Dry run — 1200 → 1500 in ~4–6 months

**Month 1 (1200):** Div. 3/4, ABC A–C, topics: implementation, greedy, math.  
**Month 2:** Add binary search, prefix sums, BFS/DFS. Virtual weekly.  
**Month 3:** DSU, Dijkstra, basic DP (1D/knapsack). Aim CF 1350 practice.  
**Month 4+:** Constructive + DP on grids/strings; contest consistency → 1500.

Adjust speed to life; consistency > heroic weeks.

---

## 12. Visualization — climb staircase

```text
1900 ------ advanced / speed
1600 ---- harder DP / trees
1400 -- graphs / BS / DP intro
1200  implementation / greedy
1000 basics
```

Stand on a stair until it feels boring-easy, then step up.

---

## 13. Complexity of improvement

| Activity | Skill gain |
|---|---|
| Contest + no upsolve | Low |
| Editorial read only | Medium-low |
| Editorial + re-code + variant | High |
| Teach solution in notes | Highest retention |

---

## 14. Why ratings move slowly

Noise: form of the day, problemset fit, unlucky WA. Judge progress over **5–10 contests**, not one.

---

## 15. C++ training habits that raise rating

- Bug less: use `long long`, clear between tests.  
- Speed: type template blindly.  
- Verify: write brute for small n during practice.  

```cpp
// Practice habit: stress against brute
// gen small n, compare solve() vs brute()
```

---

## 16. STL mastery targets by band

| Band | Must be automatic |
|---|---|
| <1200 | vector, sort, map/set basics |
| 1400 | lower_bound, pq, deque, DSU code |
| 1600 | graph templates, DP patterns |
| 1800+ | rarer structures as needed |

---

## 17. Brute climb

Only mash contests every day with no study → plateau + tilt.

---

## 18. Better

Topic lists without contests → weak timer skills.

---

## 19. Optimal

```text
Contests for pressure
Upsolve for learning
Topic drills for gaps
Mixed rated practice for transfer
Rest to avoid tilt
```

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
"I need to solve 3000 problems."
        ↓
Volume without reflection stalls.
        ↓
"I need fewer problems with deeper upsolves."
```

```text
"My rating dropped 80; I'm worse."
        ↓
Noise + one bad day.
        ↓
"Check 5-contest average and weak-list progress."
```

```text
"I'll learn segment trees at 1200."
        ↓
Skips foundations; can't use tool.
        ↓
"Earn the stair; then learn the tool."
```

---

## 21. Common mistakes

1. Changing plan every week.  
2. Ignoring health/sleep before contests.  
3. Copy-pasting editorials without re-coding.  
4. Never practicing constructive problems.  
5. Using `unordered_map` blindly → TLE hacks.  
6. Comparing yourself to prodigies’ timelines.

---

## 22. Interview tricks + simulation

**Interviewer:** “What’s your CF rating?”  
**Answer:** Give honest number + what it means: “I consistently solve implementation/greedy/graph basics under time; I still upsolve DP-heavy problems.”

**Interviewer:** “How do you improve?”  
**Answer:** Explain weak-list + upsolve + virtuals — shows engineering maturity.

---

## 23. Company use cases

Climbing proves deliberate practice. Useful for internship apps, ICPC teams, and personal confidence in timed screens.

---

## 24. Related concepts + cues

| Cue | Action |
|---|---|
| Same bug type 3× | Topic week |
| Contest anxiety | More virtuals |
| Know theory, WA always | Stress testing practice |
| Rating stuck 2 months | Audit difficulty mix |

Related: contest strategy, pattern book, advanced module topics when earned.

---

## 25. Revision notes + practice roadmap + spaced repetition

**Plan in one breath:**  
Contest → upsolve → weak-list drill → mix problems near rating+200 → promote when stable.

**30-day challenge:**

- 4 contests (live/virtual)  
- 8 upsolved problems re-coded  
- 1 retired weakness  
- Error journal with ≥10 entries  

**Spaced repetition:** Weekly review of error journal tags; monthly band reassessment.

**Exit check:** Write your current band + next 3 topics without looking.
