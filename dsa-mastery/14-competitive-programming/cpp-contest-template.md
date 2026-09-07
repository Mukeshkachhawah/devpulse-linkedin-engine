# C++ Contest Template

**Module:** 14-competitive-programming  
**Level target:** L4 (type and customize a reliable template)  
**Prerequisite:** C++ basics, STL containers, functions  
**Memory picture:** A template is a pre-packed school bag. You still must study — but you never forget pens, water, and ID at the gate.

---

## 1. What is it?

A **contest template** is starter C++ code you bring into every round: fast I/O, typedefs, debug macros, and a few battle-tested snippets.

Goal: reduce setup friction and silly bugs — not hide algorithms you don’t understand.

New words:

- **Macro** — compile-time text substitution (`#define`). Use sparingly.  
- **Typedef / using** — short names for long types.  
- **LOCAL** — compile flag for debug-only code.  
- **Snippet** — small reusable algorithm block (DSU, etc.).

---

## 2. Explain like I am 10

Before a race, tie your shoes the same way every time. Template = tying shoes + filling water bottle so race time is only for running.

---

## 3. Real life story

Two students equally smart. One spends first 5 minutes writing I/O and forgetting `long long`. Other pastes a known template, starts thinking at minute 1. Over a year, that’s many free problems.

---

## 4. Why does this exist?

Contests share logistics: multiple tests, big I/O, 64-bit needs, debugging. Templates standardize logistics.

---

## 5. What problem existed before templates?

People retyped scaffolding, mismatched braces, lost minutes, submitted with debug prints left in.

---

## 6. What happens without a good template?

```text
Slow cin/cout on big I/O → TLE
int overflow → WA
debug prints in submission → WA
no dbg tools in practice → slow bug hunts
```

---

## 7. How templates evolved

ICPC notebooks → personal headers → `#ifdef LOCAL` culture → short modern templates (C++17/20). Short > 2000-line monster packs for most Div. 2.

---

## 8. Computer intuition

```text
Compiler
  ├─ your template macros/types
  ├─ solve() logic
  └─ stripped debug when not LOCAL
Judge runs optimized binary on hidden tests
```

---

## 9. Mathematical intuition

Template doesn’t change Big-O of your algorithm. It changes **constant factors** (I/O) and **error rate** (types). Both move AC/TLE/WA outcomes.

---

## 10. Step-by-step — build your kit

1. Minimal driver + fast I/O  
2. `using ll = long long;`  
3. Debug macro  
4. `solve()` pattern for multi-test  
5. Add snippets only when you’ve coded them from memory once  

---

## 11. Dry run — first 60 seconds of contest

```text
Open IDE → load template → compile sample → wait for PDF/problems
At start: fill solve() for A, keep dbg ready if LOCAL
```

---

## 12. Visualization — layers

```text
+---------------------------+
|  macros / typedefs        |
+---------------------------+
|  snippets (DSU, etc.)     |
+---------------------------+
|  solve() per test         |
+---------------------------+
|  main: T tests / single   |
+---------------------------+
```

---

## 13–14. Complexity note

Fast I/O matters when printing/reading ~1e5–1e6 lines. Algorithm still dominates. Don’t micro-optimize I/O while living in O(n^2).

---

## 15. C++ implementation — recommended base template

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using ull = unsigned long long;
using ld = long double;

#define all(x) begin(x), end(x)
#define sz(x) (int)(x).size()

#ifdef LOCAL
#define dbg(x) cerr << "LINE:" << __LINE__ << " " << #x << " = " << (x) << '\n'
#else
#define dbg(x) ((void)0)
#endif

const int MOD = 1'000'000'007;
const ll INF = 4e18;

ll mod_pow(ll a, ll e, ll m = MOD) {
    ll r = 1 % m;
    a %= m;
    while (e > 0) {
        if (e & 1) r = r * a % m;
        a = a * a % m;
        e >>= 1;
    }
    return r;
}

struct DSU {
    vector<int> p, r;
    DSU(int n = 0) { init(n); }
    void init(int n) {
        p.resize(n);
        r.assign(n, 0);
        iota(all(p), 0);
    }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (r[a] < r[b]) swap(a, b);
        p[b] = a;
        if (r[a] == r[b]) ++r[a];
        return true;
    }
};

void solve() {
    int n;
    if (!(cin >> n)) return;
    vector<ll> a(n);
    for (auto &x : a) cin >> x;
    // solution here
    dbg(n);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int T = 1;
    cin >> T;              // comment out if single test
    for (int tc = 1; tc <= T; ++tc) {
        // cout << "Case #" << tc << ": "; // Kick Start / Cup style
        solve();
    }
    return 0;
}
```

Compile locally with debug:

```text
g++ -std=c++17 -O2 -DLOCAL -Wall -Wextra -o main main.cpp
```

Judge-style:

```text
g++ -std=c++17 -O2 -Wall -Wextra -o main main.cpp
```

---

## 16. STL usage — keep these muscles warm

```cpp
sort(all(v));
auto it = lower_bound(all(v), x);
priority_queue<ll> mx;
priority_queue<ll, vector<ll>, greater<ll>> mn;
map<ll, int> freq;
set<int> s;
deque<int> dq;
```

Binary search on answer skeleton:

```cpp
ll lo = 0, hi = 1e18;
while (lo < hi) {
    ll mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
}
// lo is minimum feasible
```

---

## 17. Brute Force template mistakes

- 500-line macro hell you can’t read under stress.  
- Competing with `#define int long long` without understanding side effects.  
- Shipping `bits/stdc++.h` to environments that disallow it (some company screens) — know normal includes too.

---

## 18. Better template

Short base + 3–5 snippets you’ve mastered.

---

## 19. Optimal template

```text
Base driver
+ dbg
+ DSU / BS / mod_pow as needed
+ personal notes file for rare algorithms
+ identical muscle memory every contest
```

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
"Bigger template = higher rating."
        ↓
You can't find anything; bugs in unused code confuse you.
        ↓
"Small trusted template + understand every line."
```

```text
"#define int long long always."
        ↓
Breaks some APIs / memory / future you.
        ↓
"Use ll explicitly where needed."
```

---

## 21. Common mistakes

1. Leaving `dbg` output active without `LOCAL`.  
2. Forgetting to reset global arrays across tests.  
3. Using `endl` → flush forever. Prefer `'\n'`.  
4. Mixing `iostream` and `printf` carelessly with sync off.  
5. Recursion without raising stack (prefer iterative).  
6. Copying template with wrong `T` default (1 vs multi).

**Globals reset pattern:**

```cpp
int n, m;
vector<int> g[200005];
bool vis[200005];

void clear_case(int n) {
    for (int i = 1; i <= n; ++i) {
        g[i].clear();
        vis[i] = false;
    }
}
```

Or better: keep locals inside `solve()`.

---

## 22. Interview tricks + simulation

In interviews, **don’t paste contest macros**. Write clear C++:

- meaningful names  
- no `#define` spam  
- talk while coding  

Template practice still helps typing speed for `vector`, loops, binary search.

**Interviewer:** “Why `ios::sync_with_stdio(false)`?”  
**Answer:** “Disconnects C++ streams from C stdio for faster I/O; fine in contests when we only use cin/cout.”

---

## 23. Company use cases

- Contests and OA platforms.  
- Local stress testing harnesses.  
- Personal snippet library (also useful for interview warmups).

---

## 24. Related concepts + cues

| Cue | Add to kit |
|---|---|
| Components / offline unions | DSU |
| Min feasible value | binary search skeleton |
| Modular answers | mod_pow / mod int |
| Kick Start style | Case # printing |

Related: contest strategy, advanced snippets (Fenwick/SegTree) when earned.

---

## 25. Revision notes + practice roadmap + spaced repetition

**Must memorize:**

- Fast I/O + `ll`  
- `solve()` + multi-test  
- `LOCAL` dbg  
- DSU + binary search skeleton  

**Practice:**

1. Type template from memory daily for 5 days.  
2. Solve 3 ABC problems using only your template.  
3. Add one snippet only after coding it blind.

**Spaced repetition:** Type full template from memory on day 1/3/7/15.

**Exit check:** Blind-type base template in <3 minutes with zero compile errors.
