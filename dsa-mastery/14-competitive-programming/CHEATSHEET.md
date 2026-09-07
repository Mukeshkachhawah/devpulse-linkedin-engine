# Competitive Programming Cheatsheet

---

## Platform Picker

| Goal | Go here |
|---|---|
| Rating + volume | Codeforces |
| Clean ladder | AtCoder ABC |
| Structured topics | USACO |
| Team 5h | ICPC |
| Annual brand | Meta Hacker Cup |
| Old Google rounds | Kick Start archives |
| Olympiad depth | IOI tasks |

---

## Contest Phases

```text
Skim all → mark E/M/H
Harvest easy ACs
Time-box mediums (15–25m)
Endgame: one deep attempt
After: upsolve + re-code editorial
```

**EV mindset:** expected points / expected minutes.

---

## Constraint → Complexity

| n | Aim |
|---|---|
| ≤20 | 2^n / careful n! |
| ≤400 | n^3 maybe |
| ≤1e3 | n^2 |
| ≤1e5 | n log n |
| ≤1e6 | n / tight n log n |

Remember `sum n` over tests.

---

## Climb Rules

```text
50% [R-200, R+100]
40% [R+100, R+300]
10% harder peek
```

Weekly: 1 contest + upsolve + weak-list drills.  
Judge progress over 5–10 rounds.

---

## C++ Kit

```cpp
ios::sync_with_stdio(false);
cin.tie(nullptr);
using ll = long long;

#ifdef LOCAL
#define dbg(x) cerr << #x << " = " << (x) << '\n'
#else
#define dbg(x) ((void)0)
#endif

// BS on answer
while (lo < hi) {
    ll mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid; else lo = mid + 1;
}
```

Compile: `g++ -std=c++17 -O2 -DLOCAL -Wall -Wextra`

---

## Debug Ladder

```text
Re-read → types/overflow → reset between tests
→ handmade case → brute vs fast (n small) → new algorithm
```

---

## WA Hotspots

- 32-bit overflow  
- off-by-one bounds  
- forgot multi-test reset  
- wrong `Case #` format  
- `endl` flush TLE  
- recursion depth  

---

## Postmortem (5 lines)

1. Problem  
2. Mistake type (read/bug/algo)  
3. Root cause  
4. Fix  
5. Drill topic  

---

## Interview Translation

| Contest | Interview |
|---|---|
| Constraints first | Clarify + Big-O |
| Edge tests | Talk test cases |
| Time box | Don’t silent-stuck |
| Template speed | Clear code > macros |
