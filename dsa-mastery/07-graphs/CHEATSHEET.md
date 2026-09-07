# Graphs — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Shortest Path Decision Tree

```text
Shortest path?
├─ unweighted / equal weights → BFS
├─ weights ∈ {0,1} → 0-1 BFS (deque)
├─ DAG → topo + relax (also longest path)
├─ any negative edge?
│   ├─ yes → Bellman-Ford (+ extra round for neg cycle)
│   │         all-pairs & n small → Floyd
│   └─ no  → Dijkstra (min-heap PQ, skip stale)
├─ all-pairs, n ≤ ~400 → Floyd-Warshall
└─ extras (keys, fuel, K stops) → state / layered graph + BFS/Dijkstra
```

**Never** run Dijkstra with negative weights.

---

## Representation

```cpp
vector<vector<int>> g(n);                 // unweighted
vector<vector<pair<int,int>>> gw(n);      // {to, w}
// undirected: push both ways
```

| | List | Matrix |
|---|---|---|
| Memory | O(n+m) | O(n²) |
| Use | default | small n, O(1) edge query, Floyd |

---

## BFS / DFS

```cpp
// BFS dist
vector<int> d(n, -1); queue<int> q; d[s]=0; q.push(s);
while (!q.empty()) {
    int u=q.front(); q.pop();
    for (int v: g[u]) if (d[v]==-1) { d[v]=d[u]+1; q.push(v); }
}
```

Multi-source: push all sources first with dist 0.

---

## Topo / Cycles

```text
Kahn: indegree0 queue; size==n else cycle
Directed cycle: edge to GRAY
Undirected cycle: visited non-parent | DSU same component
```

```cpp
// Kahn core: if order.size()!=n → cycle
```

---

## Dijkstra / Bellman-Ford / Floyd

```cpp
// Dijkstra: priority_queue min-heap of {dist,u}; if (d!=dist[u]) continue;

// Bellman-Ford: for n-1 rounds relax all edges; one more improve → neg cycle

// Floyd: for k for i for j  d[i][j]=min(d[i][j], d[i][k]+d[k][j]);
// neg cycle if d[i][i] < 0
```

Distances: use `long long`, `INF = 4e18`.

---

## MST / DSU

```cpp
struct DSU {
    vector<int> p, sz;
    DSU(int n): p(n), sz(n,1) { iota(p.begin(), p.end(), 0); }
    int find(int x){ return p[x]==x?x:p[x]=find(p[x]); }
    bool unite(int a,int b){
        a=find(a); b=find(b); if(a==b) return false;
        if(sz[a]<sz[b]) swap(a,b);
        p[b]=a; sz[a]+=sz[b]; return true;
    }
};
// Kruskal: sort edges by w; unite → add cost until n-1 edges
```

MST ≠ shortest path tree.

---

## Advanced Snacks

```text
State BFS: visited[pos][mask...]
Bipartite: color ^ 1, conflict → false
Bridge: low[v] > tin[u]
SCC: Kosaraju (order, transpose, DFS) or Tarjan
0-1 BFS: w==0 push_front else push_back
```

---

## Complexity Pocket

| Algo | Time |
|---|---|
| BFS/DFS/Topo/SCC | O(n+m) |
| Dijkstra | O((n+m) log n) |
| BF | O(nm) |
| Floyd | O(n³) |
| Kruskal | O(m log m) |

---

## Interview Phrases

```text
"First I'll classify edge weights and constraints."
"I'll build an adjacency list, then choose BFS/Dijkstra/BF/Floyd."
"For Hard problems I'll define the state, then reuse a known engine."
```

---

## Spaced Repetition Hook

```text
Items: Reps | BFS-DFS | Topo | Shortest | MST-DSU | Advanced
Cadence: +1 +3 +7 +15 +30 +90
```
