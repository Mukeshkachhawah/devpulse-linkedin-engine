# Graph Patterns

> **Goal:** Translate words like "network", "courses", "islands", "word ladder" into BFS / DFS / Union-Find / topo / shortest-path instantly.

---

## 1. When to Use

Use graph thinking when:

1. Things connect to other things (nodes + edges).  
2. You need reachability, components, cycles, ordering, or shortest path.  
3. Grid cells are neighbors (implicit graph).  
4. Dependencies between tasks exist.

**Kid idea:** Cities and roads. Questions: Can I go A→B? How many islands? Shortest drive? Finish courses in order?

---

## 2. Recognition Cues

| Cue | Algorithm |
|---|---|
| Shortest path in **unweighted** graph | BFS |
| Shortest path **non-negative weights** | Dijkstra |
| Shortest path **negative weights** (no neg cycle) | Bellman-Ford |
| All pairs shortest | Floyd-Warshall (small n) |
| Connected components / islands | DFS / BFS / Union-Find |
| Cycle in undirected | DFS parent / Union-Find |
| Cycle in directed | DFS colors / Kahn leftover |
| Task order / prerequisites | Topological sort |
| Bipartite / 2-color | BFS/DFS coloring |
| Merge accounts / friends | Union-Find |
| Minimum spanning tree | Kruskal / Prim |
| Word ladder / lock open | BFS on implicit graph |
| Multi-source distance | Multi-source BFS |

---

## 3. Template Skeletons (C++)

### A. Adjacency Build + BFS Shortest (unweighted)

```cpp
vector<int> bfsDist(int n, vector<vector<int>>& edges, int src) {
    vector<vector<int>> g(n);
    for (auto& e : edges) {
        g[e[0]].push_back(e[1]);
        g[e[1]].push_back(e[0]); // omit if directed
    }
    vector<int> dist(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (dist[v] < 0) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
    return dist;
}
```

### B. DFS Grid Islands

```cpp
void dfs(vector<vector<char>>& grid, int r, int c) {
    int m = grid.size(), n = grid[0].size();
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c);
    dfs(grid, r, c+1); dfs(grid, r, c-1);
}
int numIslands(vector<vector<char>>& grid) {
    int ans = 0;
    for (int i = 0; i < (int)grid.size(); ++i)
        for (int j = 0; j < (int)grid[0].size(); ++j)
            if (grid[i][j] == '1') { ++ans; dfs(grid, i, j); }
    return ans;
}
```

### C. Topological Sort (Kahn)

```cpp
vector<int> topoSort(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    vector<int> indeg(n, 0);
    for (auto& e : edges) { // e: [a,b] means a → b
        g[e[0]].push_back(e[1]);
        ++indeg[e[1]];
    }
    queue<int> q;
    for (int i = 0; i < n; ++i) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    if ((int)order.size() != n) return {}; // cycle
    return order;
}
```

### D. Union-Find

```cpp
struct DSU {
    vector<int> p, r;
    DSU(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
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
```

### E. Dijkstra

```cpp
vector<long long> dijkstra(int n, vector<vector<pair<int,int>>>& g, int src) {
    const long long INF = 1e18;
    vector<long long> dist(n, INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : g[u]) {
            if (dist[v] > d + w) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

### F. Bipartite Check

```cpp
bool isBipartite(vector<vector<int>>& g) {
    int n = g.size();
    vector<int> color(n, -1);
    for (int s = 0; s < n; ++s) if (color[s] < 0) {
        queue<int> q; q.push(s); color[s] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (color[v] < 0) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}
```

---

## 4. Common Variants

| Variant | Key twist |
|---|---|
| Grid BFS | 4/8 directions + boundaries |
| Multi-source BFS | push all sources with dist 0 |
| 0-1 BFS | deque: 0-weight front, 1-weight back |
| State BFS | node = (position, mask/keys) |
| Detect cycle directed | 3-color DFS |
| Redundant connection | Union-Find first failing unite |
| Cheapest flights k stops | Bellman-like relax k+1 rounds |
| Clone graph | Hash map old→new + DFS/BFS |

---

## 5. Traps

1. **DFS for shortest unweighted** — wrong; use BFS.  
2. **Dijkstra with decrease-key skipped** — must ignore stale PQ entries (`if d != dist[u]`).  
3. **Directed vs undirected** adjacency mistakes.  
4. **1-index vs 0-index** nodes.  
5. **Topo:** empty order means cycle — handle.  
6. **Visited timing:** mark when enqueue (BFS) to avoid duplicates.  
7. **Stack overflow** on deep DFS grids — BFS or iterative.  
8. **Modifying graph while iterating** carelessly.

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "DFS finds shortest hops" | Depth first ≠ fewest edges | BFS for unweighted |
| "Always Dijkstra" | Overkill / wrong for neg | Match algorithm to weights |
| "Sort edges = topo" | Not enough | Kahn or DFS finish times |
| "Union-Find for directed cycle" | UF is undirected merge | DFS colors / Kahn |
| "Visited after pop" | Explodes queue | Mark on push for BFS |

---

## 7. Decision Mini-Tree

```text
Graph / grid / dependencies?
├─ Components / islands / flood → DFS/BFS/UF
├─ Shortest?
│  ├─ Unweighted / unit → BFS
│  ├─ Weights ≥ 0 → Dijkstra
│  └─ Neg weights → Bellman-Ford
├─ Order with prerequisites → Topo (Kahn)
├─ Cycle?
│  ├─ Undirected → DFS parent / UF
│  └─ Directed → DFS colors / Kahn
├─ Grouping / merge → Union-Find
└─ 2-color / odd cycle → Bipartite BFS
```

---

## 8. Example Problems

1. Number of Islands  
2. Clone Graph  
3. Course Schedule / Course Schedule II  
4. Pacific Atlantic Water Flow  
5. Word Ladder  
6. Network Delay Time  
7. Cheapest Flights Within K Stops  
8. Redundant Connection  
9. Graph Valid Tree  
10. Is Graph Bipartite?  
11. Rotting Oranges  
12. Shortest Path in Binary Matrix  
13. Accounts Merge  
14. Alien Dictionary  
15. Minimum Height Trees  

---

## 9. Complexity Snapshot

| Algo | Time (typical) | Space |
|---|---|---|
| BFS/DFS | O(V+E) | O(V) |
| Dijkstra | O((V+E) log V) | O(V) |
| Kahn topo | O(V+E) | O(V+E) |
| Union-Find | ~O(α(n)) / op | O(V) |

---

## 10. Interview Script

> "I'll model this as a graph. Edges mean X. Because every edge has equal cost, BFS from the start gives shortest distance in O(V+E)."

---

## Revision Checklist

- [ ] BFS vs DFS vs Dijkstra triggers  
- [ ] Kahn topo + cycle detection  
- [ ] DSU template by heart  
- [ ] Multi-source BFS pattern  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 1 BFS + 1 topo/UF + 1 weighted weekly.
