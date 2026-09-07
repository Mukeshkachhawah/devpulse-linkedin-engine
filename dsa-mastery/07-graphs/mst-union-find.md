# MST and Union-Find (DSU) — Core Lesson

**Module:** 07-graphs  
**Level target:** L4–L5  
**Prerequisite:** graphs, sorting, greedy idea  
**Memory picture:** Connecting cities with the cheapest cables so everyone is linked but you never build a useless loop — that cable plan is a Minimum Spanning Tree. Union-Find is the “are these two cities already in the same phone network?” checker.

> Previous: Shortest Path. Next: Advanced Graph Patterns.

---

## 1. What is it?

A **spanning tree** of a connected undirected weighted graph is a subset of edges that connects all vertices and has **no cycles** (exactly n-1 edges).

A **Minimum Spanning Tree (MST)** is a spanning tree with **minimum total edge weight**.

Main algorithms:

- **Kruskal** — sort edges cheap→expensive; add if it does not create a cycle (Union-Find).
- **Prim** — grow a tree from a start node; always add the cheapest edge out of the tree (PQ, like Dijkstra-shaped).

**Union-Find / DSU (Disjoint Set Union)** maintains a partition of elements into groups with:

- `find(x)` — which group leader?
- `union(x,y)` — merge groups  

With **path compression** + **union by rank/size**, almost O(1) per op (inverse Ackermann α(n)).

New words:

- **Spanning** — touches all vertices.
- **Cut** — partition of vertices; MST edges are lightest across some cuts (cut property).
- **Component** — a DSU group / connected piece.

---

## 2. Explain like I am 10

You want to connect island houses with bridges. Each bridge has a price. You want everyone connected, spending as little as possible, and you never build a bridge between houses that are already linked through other bridges.

Kruskal: look at cheapest leftover bridge; build it only if it links new groups.

Union-Find: each house wears a team captain’s hat; when two teams merge, everyone follows one captain.

**Memory picture:**

```text
Edges sorted by weight:
1: A-B
2: B-C
2: A-C   ← skip (A and C already connected via B)
3: C-D

MST: A-B, B-C, C-D
```

---

## 3. Real life story

Laying fiber between offices, clustering approx algorithms, image segmentation history, and network design use MST ideas. DSU appears in Kruskal, dynamic connectivity (“add friendship, same friend circle?”), and some grid problems (number of islands online).

---

## 4. Why does this exist?

Connecting everything with minimum cable is not the same as shortest paths from one source. Dijkstra gives distances from one node; MST minimizes the **sum of chosen links** for global connectivity. DSU makes cycle checks in Kruskal fast.

---

## 5. What problem existed before this?

People used expensive connectivity DFS after each edge trial. Kruskal + DSU and Prim + heap became the practical pair. Cut property proofs justified greed.

---

## 6. What happens without it?

1. You confuse MST with shortest path tree — different goals.
2. Kruskal without DSU becomes slow / messy.
3. You add edges that form cycles → not a tree.
4. You run Prim on disconnected graphs without handling components.

```text
Shortest path tree from A ≠ MST always
MST minimizes total cable, not travel from A
```

---

## 7. How did people invent this?

Borůvka (1926), Kruskal (1956), Prim (1957). DSU with path compression analyzed later (Tarjan et al.). Interviews love Kruskal+DSU and “number of provinces” style DSU.

---

## 8. Computer intuition

**DSU:**

```text
parent[x], size[x] or rank[x]

find(x):
  if parent[x] != x: parent[x] = find(parent[x])  // compress
  return parent[x]

unite(a,b):
  ra=find(a); rb=find(b)
  if ra==rb: return false // already same — edge would cycle
  attach smaller to larger; update size
  return true
```

**Kruskal:**

```text
sort edges by weight
ans = 0; taken = 0
for (u,v,w) in edges:
  if unite(u,v): ans += w; taken++
  if taken == n-1: break
```

**Prim:** push (0, start); pop min edge to new node; add neighbors to PQ — similar code shape to Dijkstra but meaning differs (edge weight to tree, not path dist).

---

## 9. Mathematical intuition

**Cut property:** for any cut, a lightest edge crossing the cut is safe for some MST. Kruskal/Prim greedily pick safe edges.

MST total weight unique; tree shape may not be (multiple edges same weight).

DSU with both optimizations: α(n) ≤ 4 for practical n — treat as nearly O(1).

Kruskal time: O(m log m) sort dominates. Prim + binary heap: O((n+m) log n).

---

## 10. Step-by-step working

**Min cost to connect all points:**

1. Build complete graph edges (distance between points) or generate edges carefully.
2. Kruskal or Prim.

**Accounts merge / redundant connection:**

1. DSU unite; count successful unions; leftover edges may be redundant.

**Detect undirected cycle while adding:**

1. If `find(u)==find(v)` before unite → cycle edge.

---

## 11. Dry run

Nodes 0,1,2,3. Edges `(0,1,1),(1,2,2),(0,2,2),(2,3,3)`.

```text
DSU parents initially: 0 1 2 3

Add 0-1 w=1: unite OK, cost=1
Add 1-2 w=2: unite OK, cost=3
Add 0-2 w=2: find same → skip
Add 2-3 w=3: unite OK, cost=6
MST weight 6
```

---

## 12. Visualization

```text
KRUSKAL GROWTH (components merge)

{0}{1}{2}{3}
 +0-1 → {0,1}{2}{3}
 +1-2 → {0,1,2}{3}
 skip 0-2
 +2-3 → {0,1,2,3}
```

```text
DSU TREE (after unions)

 size-based:
   0
  / \
 1   2
      \
       3
find(3) → compress toward 0
```

```text
MST vs DIJKSTRA TREE

Different questions:
MST: cheapest cables to connect all
Dijkstra: cheapest travel FROM one source
```

---

## 13. Complexity

| Algo | Time | Space |
|---|---|---|
| DSU ops | ≈ O(α(n)) | O(n) |
| Kruskal | O(m log m) | O(n+m) |
| Prim heap | O((n+m) log n) | O(n+m) |

---

## 14. Why this complexity?

Sorting edges is the Kruskal bottleneck. Each edge one DSU find/union. Prim mirrors Dijkstra’s PQ cost. Path compression flattens trees so finds stay tiny.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> p, sz;
    DSU(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int find(int x) {
        if (p[x] != x) p[x] = find(p[x]);
        return p[x];
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        p[b] = a;
        sz[a] += sz[b];
        return true;
    }
};

long long kruskal(int n, vector<array<int,3>>& edges) {
    sort(edges.begin(), edges.end(),
         [](auto& x, auto& y) { return x[2] < y[2]; }); // w at [2]
    DSU dsu(n);
    long long cost = 0;
    int taken = 0;
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dsu.unite(u, v)) {
            cost += w;
            if (++taken == n - 1) break;
        }
    }
    if (taken != n - 1) return -1; // disconnected
    return cost;
}

long long prim(int n, const vector<vector<pair<int,int>>>& g, int src = 0) {
    vector<char> in(n);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, src});
    long long cost = 0;
    int taken = 0;
    while (!pq.empty() && taken < n) {
        auto [w, u] = pq.top(); pq.pop();
        if (in[u]) continue;
        in[u] = 1;
        cost += w;
        taken++;
        for (auto [v, ew] : g[u]) if (!in[v]) pq.push({ew, v});
    }
    if (taken != n) return -1;
    return cost;
}
```

---

## 16. STL usage

| Need | STL |
|---|---|
| Sort edges | `sort` on `vector<array<int,3>>` |
| Prim PQ | `priority_queue` min-heap |
| DSU | hand-rolled struct (standard) |
| iota init parents | `<numeric> iota` |

Do not use `std::set` as a slow substitute for DSU when you need merge components by id — DSU is the tool.

---

## 17. Brute Force

Try all subsets of n-1 edges — `\binom{m}{n-1}` — impossible. Or for each edge run DFS connectivity without DSU — slower Kruskal.

---

## 18. Better

Kruskal with DSU; Prim with heap. For dense graphs, Prim with O(n²) array (no heap) can win — rare in interviews.

---

## 19. Optimal

O(m log m) Kruskal or O((n+m) log n) Prim are standard optimal interview answers. Mention Borůvka for completeness only.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "MST path between A and B is a shortest path."
  ↓
Fails: MST optimizes global sum, not pairwise distance
  ↓
Correct: Use Dijkstra for shortest A→B

Wrong: "Always add the cheapest edge."
  ↓
Fails: may form a cycle / not connect new nodes usefully
  ↓
Correct: add cheapest edge that merges different components

Wrong: "DSU find without compression is fine always."
  ↓
Fails: can degenerate to a linked list
  ↓
Correct: path compression + union by size/rank

Wrong: "Prim = Dijkstra."
  ↓
Fails: keys mean different things
  ↓
Correct: similar PQ code shape; different invariant
```

---

## 21. Common mistakes

1. Forgetting disconnected check (`taken == n-1`).
2. Directed edges fed into MST (MST is undirected).
3. Sorting wrong key (node id instead of weight).
4. Union without return value → counting cycles wrong.
5. 1-index vs 0-index in DSU size.
6. Overflow on cost sum — use `long long`.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Min cost to connect all points.”  
**Expected:** Kruskal or Prim on complete distance graph; complexity.

### Amazon
**Ask:** “Number of provinces / friend circles.”  
**Expected:** DSU or DFS; DSU if merges online.

### Microsoft
**Ask:** “Implement Union-Find with path compression.”  
**Expected:** Clean `find`/`unite`; explain nearly O(1).

### OpenAI
**Ask:** “MST vs shortest path — when which?”  
**Expected:** Global connect min cable vs single-source distances; examples.

**Interview phrase:**

```text
"I'll sort edges and use Union-Find — Kruskal.
Add an edge only when it merges two components. Total O(m log m)."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Network cabling / clustering | MST |
| Dynamic connectivity | DSU |
| Kruskal online builds | DSU |
| Image / grid merges | DSU |
| Redundant connection problems | DSU cycle edge |

---

## 24. Related concepts + pattern recognition cues

**Related:** greedy, sorting, Prim↔Dijkstra shape, components, bottleneck paths (max edge on path related to MST).

| Cue | Tool |
|---|---|
| Min total to connect all | MST |
| Same component queries + merges | DSU |
| Undirected cycle while adding edges | DSU |
| Shortest travel from source | Dijkstra, not MST |
| Bottleneck min-max path | often MST / binary search + DSU |

**Decision snack:**

```text
Connect all cheaply → MST (Kruskal+DSU or Prim)
Merge/check groups → DSU
A to B distance → shortest path algorithms
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
MST = connect all, no cycle, min total weight
Kruskal = sort + DSU
Prim = grow tree with PQ
DSU = find + union, compress paths
MST ≠ shortest path tree
```

### Checklist

- [ ] DSU code from memory
- [ ] Kruskal dry-run
- [ ] Disconnected detection
- [ ] Prim vs Dijkstra sentence
- [ ] Path compression explanation

### Practice roadmap

1. Easy: Number of Provinces (DSU), Redundant Connection
2. Medium: Min Cost to Connect All Points, Connecting Cities With Minimum Cost
3. Classic: Kruskal/Prim implementation practice; Optimize Water Distribution

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite cut/cable picture |
| 3 | Dry-run Kruskal + DSU |
| 7 | Code DSU + Kruskal blind |
| 15 | Prim sketch timed |
| 30 | Oral MST vs Dijkstra |
| 90 | Mock: connect all points |

```text
Item: MST / Union-Find
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
