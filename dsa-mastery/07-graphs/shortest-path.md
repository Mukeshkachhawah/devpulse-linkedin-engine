# Shortest Path Algorithms — Core Lesson

**Module:** 07-graphs  
**Level target:** L5  
**Prerequisite:** BFS, heaps, graph weights, topo (for DAG paths)  
**Memory picture:** GPS choosing roads — sometimes all roads cost 1 minute (BFS), sometimes different lengths (Dijkstra), sometimes a road pays you (negative) and you need Bellman-Ford, sometimes you need every city pair (Floyd-Warshall).

> Previous: Topo/Cycles. Next: MST / Union-Find.

---

## 1. What is it?

A **shortest path** from `s` to `t` is a path whose **total edge weight** is minimum.

Core algorithms:

| Algorithm | Typical use |
|---|---|
| BFS | Unweighted (or all weights equal) — fewest edges |
| 0-1 BFS | Weights only 0 or 1 |
| Dijkstra | Non-negative weights, single source |
| Bellman-Ford | Negative weights allowed; detect negative cycle |
| SPFA | Queue BF variant — know it; worst case bad |
| Floyd-Warshall | All-pairs; small n; negatives OK if no neg cycle |
| DAG relaxation | Shortest/longest on DAG in topo order |

New words:

- **Relaxation** — if `dist[v] > dist[u] + w(u,v)`, improve `dist[v]`.
- **Negative cycle** — cycle with total weight &lt; 0; shortest paths may be undefined (can loop for −∞).
- **Stale entry** — Dijkstra PQ may hold old larger distances; skip when popped.

---

## 2. Explain like I am 10

You want the cheapest way to a friend’s house.

- If every street takes the same time → walk layer by layer (BFS).
- If streets have different positive times → always expand the currently closest place first (Dijkstra).
- If some streets give you magic coins (negative cost) → you must be careful; Dijkstra can lie; Bellman-Ford double-checks many times.
- If a magic loop prints infinite coins → there is no real “shortest” (negative cycle).

**Memory picture:**

```text
DECISION TREE (memorize this)

Start: shortest path problem?
│
├─ Unweighted / all weights equal? ──→ BFS
│
├─ Weights only 0 or 1? ──→ 0-1 BFS (deque)
│
├─ Graph is a DAG? ──→ Topo order + relax (also longest path)
│
├─ Any negative edge weight?
│     ├─ YES ──→ Bellman-Ford (or Floyd if all-pairs, n small)
│     │           After n-1 rounds, one more relax improves? → neg cycle
│     └─ NO ──→ Dijkstra (binary heap PQ)   [NEVER Dijkstra with negatives]
│
├─ All-pairs and n ≤ ~400? ──→ Floyd-Warshall
│
└─ Grid specials / obstacles / states ──→ BFS/Dijkstra on state graph
```

---

## 3. Real life story

Maps apps: road lengths non-negative → Dijkstra / A*. Currency arbitrage: negative log-rates → Bellman-Ford negative cycle means profit loop. Games: moving with different terrain costs → weighted grid Dijkstra. Network routing historically used Bellman-Ford ideas (distance vector).

---

## 4. Why does this exist?

Reachability is not enough — cost matters. Different weight constraints need different algorithms. Using the wrong one is a classic interview fail (Dijkstra + negative edges).

---

## 5. What problem existed before this?

People enumerated paths or used BFS always. Dijkstra (1959), Bellman-Ford (1950s), Floyd-Warshall (1962) became the standard toolkit. Heaps made Dijkstra practical.

---

## 6. What happens without it?

1. Wrong algorithm → wrong answers or TLE.
2. Negatives break Dijkstra silently.
3. Neg cycles ignored → “shortest” is fake.
4. All-pairs with n Dijkstra from each node when Floyd is simpler for tiny n — or opposite: Floyd on n=5000.

```text
Dijkstra with a negative edge
  ↓
settles a node too early
  ↓
never reconsiders → WA
```

---

## 7. How did people invent this?

Relaxation is the unifying idea: improve distances until stable. Dijkstra’s clever order (always closest unsettled) needs non-negative weights for correctness. Bellman-Ford relaxes all edges |V|-1 times. Floyd tries every midpoint k.

---

## 8. Computer intuition

**Relax:**

```text
if dist[u] + w < dist[v]:
    dist[v] = dist[u] + w
    parent[v] = u
```

**Dijkstra:** min-PQ of `(dist, node)`; pop smallest; skip if stale; relax neighbors; push improvements.

**Bellman-Ford:** repeat `n-1` times: relax every edge. Then try once more — if any improve, negative cycle reachable.

**Floyd:**

```text
for k in 0..n-1
  for i in 0..n-1
    for j in 0..n-1
      dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])
```

```text
DIJKSTRA SNAPSHOT

dist:  A=0  B=∞  C=∞  D=∞
pop A; relax B=4, C=2
PQ: (2,C), (4,B)
pop C; relax D=C+w ...
never increase a settled dist when weights ≥ 0
```

---

## 9. Mathematical intuition

Triangle inequality for distances when no neg cycle: `dist(s,v) ≤ dist(s,u) + w(u,v)`.

Dijkstra correctness: with non-negative weights, when a node is popped the first time with its best dist (binary heap may pop multiples — use first finalized / stale skip carefully), that dist is optimal.

Bellman-Ford: a simple shortest path has ≤ n-1 edges, so n-1 rounds suffice if finite.

Floyd: after considering midpoints `{0..k}`, `dist[i][j]` is best path using only those mids.

Complexities (typical):

- BFS: O(n+m)
- Dijkstra + binary heap: O((n+m) log n)
- Bellman-Ford: O(n·m)
- Floyd: O(n³)

---

## 10. Step-by-step working

**Pick algorithm using the decision tree in §2.**

**Reconstruct path:** store `parent[v]`; walk back from t to s; reverse.

**Detect negative cycle affecting s:** Bellman-Ford from s; extra round; optionally BFS/DFS from improved nodes to mark −∞ reachable.

**State graph:** node = `(position, leftover_keys)`; edges = moves — run BFS/Dijkstra on states.

---

## 11. Dry run

Edges (weights): `0→1:4`, `0→2:1`, `2→1:2`, `1→3:1`, `2→3:5`. Non-negative. Source 0.

Dijkstra:

```text
dist[0]=0
pop 0 → dist[2]=1, dist[1]=4
pop 2 → dist[1]=min(4,1+2)=3; dist[3]=1+5=6
pop 1 → dist[3]=min(6,3+1)=4
pop 3
Answer to 3: 4  path 0-2-1-3
```

Add edge `3→1: -10` → negative; Dijkstra unsafe; Bellman-Ford finds better / cycle issues if loops.

---

## 12. Visualization

```text
          4
     0 --------→ 1
     |           | 1
    1|           ↓
     ↓     5     3
     2 --------→ 3
      \__2→1__/
```

```text
NEGATIVE EDGE TRAP

A --2--> B --(-3)--> C
Dijkstra may finalize wrongly depending on structure.
Rule: if any w < 0 → do not use Dijkstra.
```

```text
0-1 BFS DEQUE

weight 0: push_front (same distance layer feel)
weight 1: push_back
```

---

## 13. Complexity

| Algo | Time | Space | Neg edges? | Neg cycle detect? |
|---|---|---|---|---|
| BFS | O(n+m) | O(n) | No (unweighted) | N/A |
| 0-1 BFS | O(n+m) | O(n) | only 0/1 | N/A |
| Dijkstra PQ | O((n+m) log n) | O(n+m) | **No** | No |
| Bellman-Ford | O(nm) | O(n) | Yes | Yes |
| Floyd | O(n³) | O(n²) | Yes | Yes (diag &lt; 0) |
| DAG relax | O(n+m) | O(n) | Yes if no neg cycle needed | If cycle, not DAG |

---

## 14. Why this complexity?

BFS/Deque visit each edge once. Dijkstra pays log for PQ ops. Bellman-Ford tries up to n-1 edges on path × m edges. Floyd tries all midpoints. Match algorithm to constraints: `n=1e5,m=2e5` → Dijkstra/BFS; `n=400` all-pairs → Floyd; `n=1e3,m=1e4` with negatives → Bellman-Ford.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

const long long INF = 4e18;

vector<long long> dijkstra(int n, int src,
    const vector<vector<pair<int,int>>>& g) {
    vector<long long> dist(n, INF);
    dist[src] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>,
                   greater<pair<long long,int>>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue; // stale
        for (auto [v, w] : g[u]) {
            if (dist[v] > d + w) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

// returns {dist, hasNegativeCycleReachableFromSrc}
pair<vector<long long>, bool> bellmanFord(int n, int src,
    const vector<tuple<int,int,int>>& edges) {
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {
        bool changed = false;
        for (auto [u, v, w] : edges) {
            if (dist[u] == INF) continue;
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                changed = true;
            }
        }
        if (!changed) break;
    }
    bool neg = false;
    for (auto [u, v, w] : edges) {
        if (dist[u] != INF && dist[v] > dist[u] + w) { neg = true; break; }
    }
    return {dist, neg};
}

vector<vector<long long>> floyd(int n, vector<vector<long long>> d) {
    // d[i][j] = w or INF; d[i][i]=0
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] < INF && d[k][j] < INF)
                    d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
    return d;
}

vector<long long> zeroOneBFS(int n, int src,
    const vector<vector<pair<int,int>>>& g) { // w is 0 or 1
    vector<long long> dist(n, INF);
    deque<int> dq;
    dist[src] = 0;
    dq.push_back(src);
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto [v, w] : g[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }
    return dist;
}
```

---

## 16. STL usage

| Algo | STL |
|---|---|
| Dijkstra | `priority_queue` with `greater<>` |
| 0-1 BFS | `deque` |
| Bellman-Ford | `vector` of edges |
| Floyd | `vector<vector<long long>>` |
| Path rebuild | `vector<int> parent` |

Use `long long` for distances — sum of weights can overflow `int`.

---

## 17. Brute Force

DFS/BFS enumerate all simple paths — exponential. Or matrix power tricks — overkill. Brute is only for tiny n teaching.

---

## 18. Better

BFS instead of Dijkstra when unweighted. Dijkstra from each source instead of Floyd when sparse + few queries + large n. A* with heuristic when coordinates exist (bonus).

---

## 19. Optimal

Match the decision tree. Typical interview optimal:

- Grid fewest steps → BFS  
- Weighted non-neg → Dijkstra  
- Negatives → Bellman-Ford  
- All-pairs small n → Floyd  
- 0/1 weights → deque BFS  

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Dijkstra works with negative edges if I'm careful."
  ↓
Fails: correctness theorem needs w ≥ 0
  ↓
Correct: use Bellman-Ford / Johnson / Floyd

Wrong: "BFS always wrong for weighted graphs."
  ↓
Fails: if all weights equal, BFS is fine
  ↓
Correct: BFS minimizes hops; equal weights ⇒ minimize cost too

Wrong: "If there's a negative edge, there's a negative cycle."
  ↓
Fails: single negative edge can be OK
  ↓
Correct: cycle total < 0 is the problem

Wrong: "Floyd cannot detect neg cycles."
  ↓
Fails: you can check d[i][i] < 0
  ↓
Correct: negative diagonal ⇒ neg cycle
```

---

## 21. Common mistakes

1. Dijkstra + negatives.
2. Forgetting stale PQ check → logic still OK if you only finalize first pop with `visited`, but with decrease via re-push you must skip worse pops.
3. `INF + w` overflow — guard or use big INF carefully.
4. Bellman-Ford not running enough iterations.
5. Floyd with `k` innermost (wrong loop order).
6. Reconstructing path without parents.
7. Using `int` for large distance sums.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Network delay time (weighted, non-negative).”  
**Expected:** Dijkstra; return max dist or -1 if unreachable.

### Amazon
**Ask:** “Cheapest flights within K stops.”  
**Expected:** Bellman-Ford limited iterations / BFS on states; not plain Dijkstra without care for stop limits.

### Microsoft
**Ask:** “Decision: negatives present or not?”  
**Expected:** Speak the decision tree; pick Bellman-Ford vs Dijkstra.

### OpenAI
**Ask:** “Why does Dijkstra fail with negatives? Give a tiny counterexample.”  
**Expected:** Draw 3–4 node graph; show early finalization error.

**Interview phrase:**

```text
"I'll classify weights first. Non-negative → Dijkstra.
Any negative → Bellman-Ford. Unweighted → BFS.
I'll also check for negative cycles if required."
```

---

## 23. Company use cases

| Context | Algo |
|---|---|
| Road maps | Dijkstra / A* |
| Arbitrage | Bellman-Ford neg cycle |
| Game maps terrain | Dijkstra / 0-1 BFS |
| Tiny dense AS topology | Floyd |
| Build latency on DAG | Topo relax |

---

## 24. Related concepts + pattern recognition cues

**Related:** heaps, BFS, topo DP, MST (different goal!), potentials / Johnson (advanced).

| Cue | Algo |
|---|---|
| Fewest edges | BFS |
| 0/1 weights | 0-1 BFS |
| w ≥ 0 | Dijkstra |
| w can be &lt; 0 | Bellman-Ford |
| All pairs, n small | Floyd |
| DAG | Topo relax |
| K stops / state | BF iterations or state Dijkstra/BFS |

**Full decision tree:** see §2 — this is the pattern recognition spine for the chapter.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Classify weights FIRST
Unweighted → BFS | 0/1 → deque | w≥0 → Dijkstra | negatives → BF
All-pairs small n → Floyd | DAG → topo relax
Neg cycle → shortest may be -∞
Relaxation is the shared engine
```

### Checklist

- [ ] Draw decision tree from memory
- [ ] Dijkstra with stale skip
- [ ] Bellman-Ford + extra round
- [ ] Floyd loop order k,i,j
- [ ] Tiny negative counterexample for Dijkstra

### Practice roadmap

1. Easy/Med: Binary matrix shortest (BFS), Network Delay Time (Dijkstra)
2. Medium: Cheapest Flights Within K Stops, Path With Minimum Effort (Dijkstra/binsearch)
3. Harder: Bellman-Ford practice, Floyd problems, 0-1 BFS classics

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite decision tree aloud |
| 3 | Dry-run Dijkstra + BF |
| 7 | Code Dijkstra blind |
| 15 | Timed K-stops variant |
| 30 | Teach negative counterexample |
| 90 | Mock: pick algo + implement |

```text
Item: Shortest Path
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
