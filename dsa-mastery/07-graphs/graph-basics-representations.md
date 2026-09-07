# Graph Basics and Representations — Core Lesson

**Module:** 07-graphs  
**Level target:** L4  
**Prerequisite:** trees, queues/stacks, hashing  
**Memory picture:** Cities (nodes) and roads (edges). A notebook of “from this city, where can I go?” is the adjacency list.

> Previous: Trees. Next: BFS / DFS.

---

## 1. What is it?

A **graph** is a set of **vertices** (nodes) plus **edges** (links between nodes).

Common flavors:

| Term | Meaning |
|---|---|
| Undirected | Road works both ways |
| Directed (digraph) | One-way street |
| Weighted | Edge has a cost/length |
| Unweighted | Every edge cost = 1 (or just “exists”) |
| Cyclic / acyclic | Has a loop of edges or not |
| Connected / components | Can you walk between every pair? |
| Tree | Connected acyclic undirected graph |
| DAG | Directed Acyclic Graph |

**Representation** = how you store the graph in memory:

1. **Adjacency list** — for each node, list of neighbors  
2. **Adjacency matrix** — `mat[u][v] = 1` or weight / INF  
3. **Edge list** — list of `(u,v,w)` triples  

New words:

- **Degree** — number of edges touching a node (out-degree / in-degree if directed).
- **Neighbor** — a node sharing an edge.
- **Path** — walk without repeating vertices (definitions vary; say yours).
- **Component** — maximal connected piece.

---

## 2. Explain like I am 10

Dots and lines on paper. A friendship graph: if A is friends with B, draw a line. To store it in a computer, each kid keeps a list of friend names — that is an adjacency list. A giant checkbox table “are these two friends?” is a matrix.

**Memory picture:**

```text
Cities: 0,1,2,3
Roads: 0-1, 0-2, 1-2, 2-3

List notebook:
0: 1,2
1: 0,2
2: 0,1,3
3: 2

Matrix (undirected):
    0 1 2 3
0   0 1 1 0
1   1 0 1 0
2   1 1 0 1
3   0 0 1 0
```

---

## 3. Real life story

Social networks, maps, dependency of software packages, web links, circuit nets, and knowledge graphs are all graphs. Companies store “who follows whom,” “which service calls which,” or “which package needs which.” Choosing list vs matrix decides whether your service scales.

---

## 4. Why does this exist?

Arrays and trees are special shapes. Real systems have arbitrary connections, multiple parents, cycles, and directions. Graphs are the general model. Clean representations make BFS/DFS/shortest paths possible.

---

## 5. What problem existed before this?

People hard-coded special cases (“only trees,” “only grids”) or scanned huge edge piles without indexing by node. Without adjacency lists, “neighbors of u” was slow. Graph theory + CS libraries standardized list/matrix/edge-list tradeoffs.

---

## 6. What happens without it?

1. You pick a matrix for sparse graphs and blow memory (`n=1e5` → impossible).
2. You forget undirected edges need both directions in the list.
3. You treat a grid as mysterious instead of a graph with 4-neighbors.
4. Algorithms later in this module have nowhere solid to stand.

```text
n = 1e5, m = 1e5 sparse
matrix n×n → ~10^10 cells → death
list → O(n+m) memory → fine
```

---

## 7. How did people invent this?

Euler’s Königsberg bridges (1736) started graph theory. Computers forced storage choices: matrix for dense math, lists for sparse networks. Interview culture stresses building graphs from edge lists and seeing grids as graphs.

---

## 8. Computer intuition

**Adjacency list (C++):**

```text
vector<vector<int>> g(n);
g[u].push_back(v);
// undirected also: g[v].push_back(u);
```

Weighted:

```text
vector<vector<pair<int,int>>> g; // {neighbor, weight}
```

**Matrix:**

```text
vector<vector<int>> mat(n, vector<int>(n, 0));
mat[u][v] = w;
```

**Edge list:** good for Kruskal (sort edges) — `vector<tuple<int,int,int>>`.

```text
MEMORY rough costs

List:  O(n + m)
Matrix: O(n²)
Edge list: O(m)
```

---

## 9. Mathematical intuition

Simple undirected graph: at most `\binom{n}{2}` edges. Dense means m ~ n²; sparse means m ~ n or n log n.

Time to iterate all neighbors of all nodes = O(n + m) with lists (sum of degrees = 2m undirected). Matrix scan of a row is O(n) even if degree is 1.

Connectivity: undirected component count via DFS/BFS. Directed: weakly vs strongly connected components (later patterns).

---

## 10. Step-by-step working

**Build from edge list:**

1. Read `n, m`.
2. Create `g` sized `n` (decide 0-index vs 1-index).
3. For each edge, push ends per directed/undirected rules.
4. Optional: dedupe edges with set if inputs may repeat.

**Grid as graph:**

1. Node id = `r * cols + c` or stay as coordinates.
2. Neighbors: up/down/left/right if inside and walkable.

**Degree / validate:**

1. Count `g[u].size()` (out-degree for directed).
2. For undirected, sum sizes = 2m.

---

## 11. Dry run

`n=4`, edges undirected `(0,1),(0,2),(1,2),(2,3)`:

After build:

```text
g[0] = {1,2}
g[1] = {0,2}
g[2] = {0,1,3}
g[3] = {2}
```

Iterate all edges via lists: each undirected edge appears twice when scanning — careful when counting unique edges.

Matrix: `mat[2][3]=mat[3][2]=1`.

---

## 12. Visualization

```text
GRAPH DRAWING          LIST

  0——1                 0: 1,2
  | /                  1: 0,2
  |/                   2: 0,1,3
  2——3                 3: 2
```

```text
DIRECTED

0 → 1 → 2
↑       │
└───────┘   cycle

List:
0: 1
1: 2
2: 0
```

```text
WHEN TO USE WHAT

Need "is edge u→v?" often + n small (≤ ~2e3): matrix
Sparse + algorithms walk neighbors: list (default interview)
Sort all edges (Kruskal): edge list
```

---

## 13. Complexity

| Structure | Build | Neighbor iterate | Edge query u→v | Memory |
|---|---|---|---|---|
| Adj list | O(m) | O(deg) | O(deg) or hash | O(n+m) |
| Matrix | O(n²) init | O(n) | O(1) | O(n²) |
| Edge list | O(m) | O(m) scan | O(m) | O(m) |

---

## 14. Why this complexity?

Lists store only existing edges. Matrix allocates every pair slot. Query speed is a tradeoff against memory. Interview default: **adjacency list**.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> buildUndirected(int n, const vector<pair<int,int>>& edges) {
    vector<vector<int>> g(n);
    for (auto [u, v] : edges) {
        g[u].push_back(v);
        g[v].push_back(u);
    }
    return g;
}

vector<vector<pair<int,int>>> buildDirectedWeighted(
    int n, const vector<tuple<int,int,int>>& edges) {
    vector<vector<pair<int,int>>> g(n);
    for (auto [u, v, w] : edges) g[u].push_back({v, w});
    return g;
}

vector<vector<int>> buildMatrix(int n, const vector<pair<int,int>>& edges, bool directed) {
    vector<vector<int>> mat(n, vector<int>(n, 0));
    for (auto [u, v] : edges) {
        mat[u][v] = 1;
        if (!directed) mat[v][u] = 1;
    }
    return mat;
}

// Grid → explore neighbors
const int DR[4] = {-1, 1, 0, 0};
const int DC[4] = {0, 0, -1, 1};

void forEachNeighbor(int r, int c, int R, int C, auto&& fn) {
    for (int k = 0; k < 4; k++) {
        int nr = r + DR[k], nc = c + DC[k];
        if (0 <= nr && nr < R && 0 <= nc && nc < C) fn(nr, nc);
    }
}
```

---

## 16. STL usage

| Piece | STL |
|---|---|
| Adj list | `vector<vector<int>>` |
| Weighted | `vector<vector<pair<int,int>>>` |
| Edge list | `vector<array<int,3>>` or `tuple` |
| Fast edge membership sparse | `unordered_set` of encoded pairs / nested unordered_map |
| Node names not ints | `unordered_map<string,int>` compress to ids |

Compress string node names to `0..n-1` before algorithms — standard interview move.

---

## 17. Brute Force

Store only edge list; to find neighbors of `u`, scan all m edges every time → algorithms become O(m²) easily. Works for tiny m only.

---

## 18. Better

Adjacency matrix when n ≤ 400–2000 and you need O(1) edge checks (Floyd-Warshall lives here). Still better than repeated full scans if dense.

---

## 19. Optimal

For typical interview constraints (`n,m ≤ 1e5`–`2e5`): **adjacency list** is the optimal default. Pick matrix only with clear density + small n.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Always use a matrix; edge checks are O(1)."
  ↓
Fails: n=1e5 memory/time death
  ↓
Correct: Default list; matrix only for small n

Wrong: "Undirected: push edge once in one list."
  ↓
Fails: cannot walk back
  ↓
Correct: add both directions (unless using special undirected tricks)

Wrong: "Trees and graphs are unrelated."
  ↓
Fails: tree ⊂ graph
  ↓
Correct: tree = connected acyclic undirected

Wrong: "Grid problems are not graph problems."
  ↓
Fails: multi-source BFS etc. are graph algorithms
  ↓
Correct: cells = nodes; moves = edges
```

---

## 21. Common mistakes

1. 0-index vs 1-index off-by-one.
2. Forgetting reverse edge in undirected.
3. Using `int` matrix with 0 both as “no edge” and weight 0 — use INF sentinel for weighted matrices.
4. Self-loops / parallel edges ignored when problem forbids them.
5. Recursion DFS on deep graphs → stack overflow; prefer iterative or carefully raise limits (contests).
6. Building graph each query from scratch unnecessarily.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “How do you store a social graph with 1e7 edges?”  
**Expected:** Adj lists / sharded storage; matrix impossible; discuss sparsity.

### Amazon
**Ask:** “Model warehouse aisles as a graph.”  
**Expected:** Grid graph; obstacles; BFS later.

### Microsoft
**Ask:** “Course prerequisites representation.”  
**Expected:** Directed graph; edge list → adj list; leads to topo sort.

### OpenAI
**Ask:** “When would you pick edge list over adj list?”  
**Expected:** Kruskal MST sort-by-weight; algorithms that need all edges globally, not neighbor walks.

**Interview phrase:**

```text
"I'll build an adjacency list — O(n+m) memory — unless n is small
and I need O(1) edge queries, then a matrix."
```

---

## 23. Company use cases

| Context | Graph |
|---|---|
| Social follow systems | Directed |
| Maps / logistics | Weighted undirected/directed |
| Build systems / packages | DAG |
| Web crawl | Directed, huge sparse |
| Chip / network topology | Mixed |

---

## 24. Related concepts + pattern recognition cues

**Related:** BFS/DFS, Union-Find (components), trees, heaps for weighted algos.

| Cue | Representation |
|---|---|
| n large, m ~ n | Adj list |
| Floyd all-pairs, n ≤ 400 | Matrix |
| Kruskal | Edge list |
| Grid | Implicit graph (no build) |
| Named nodes | Map compress + list |

**Decision snack:**

```text
Sparse default → list
Dense small n → matrix
Sort edges → edge list
Grid → don't store all edges; compute neighbors
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Nodes + edges
List = notebook of neighbors (default)
Matrix = full table (small n)
Tree ⊂ graph; grid = graph
Undirected = store both ways
```

### Checklist

- [ ] Build undirected + directed weighted lists
- [ ] Convert edge list → adj
- [ ] Explain memory for n=1e5
- [ ] Walk 4-neighbors on a grid
- [ ] Define DAG / tree / component

### Practice roadmap

1. Easy: Find Center of Star Graph, Find the Town Judge (degrees), Build adj from edges
2. Medium: Number of Provinces (components), Clone Graph, Course Schedule (setup)
3. Warmup grids: Number of Islands (representation mindset)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite list vs matrix |
| 3 | Build graph from edges on paper |
| 7 | Code weighted digraph build |
| 15 | Grid neighbor helper blind |
| 30 | Teach sparsity tradeoff |
| 90 | Quick oral quiz before graph mock |

```text
Item: Graph Basics / Representations
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
