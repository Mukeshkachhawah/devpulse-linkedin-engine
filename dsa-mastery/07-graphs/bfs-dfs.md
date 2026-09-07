# BFS and DFS — Core Lesson

**Module:** 07-graphs  
**Level target:** L4–L5  
**Prerequisite:** graph representations, queue, stack/recursion  
**Memory picture:** BFS = ripples in a pond (layer by layer). DFS = exploring a maze by going deep down one corridor before backtracking.

> Previous: Graph Basics. Next: Topo Sort / Cycle Detection.

---

## 1. What is it?

**BFS (Breadth-First Search)** explores nodes in order of **distance from the start** (fewest edges first) using a **queue**.

**DFS (Depth-First Search)** explores as **deep** as possible along a path, then **backtracks**, using a **stack** (explicit or call stack).

Both mark nodes **visited** so cycles do not loop forever.

New words:

- **Frontier** — nodes waiting to be explored.
- **Level / distance** — BFS layers; for unweighted graphs, BFS distance = shortest path in edges.
- **Backtracking** — undo a choice when DFS returns.
- **Connected component** — nodes reachable from each other (undirected).

---

## 2. Explain like I am 10

**BFS:** You shout your name. First your neighbors hear you, then their neighbors — like ripples. You meet nearby friends before far ones.

**DFS:** You walk down a hallway to the end, then back up and try another hallway. You might go very far before seeing a nearby unexplored door.

**Memory picture:**

```text
Start at 0

BFS order example:  0, then 1 2, then 3 4 ...
DFS order example:  0, 1, 3, ... backtrack ..., 2, ...
```

---

## 3. Real life story

Fire department spreading trucks to nearest intersections first — BFS thinking. A robot vacuum exploring a corridor fully — DFS-like. Web crawlers mix both. Multiplayer games flood-fill fog of war with BFS.

---

## 4. Why does this exist?

You need systematic exploration that:

- does not miss nodes
- does not infinite-loop on cycles
- answers reachability, components, shortest unweighted paths, cycle checks, topological ideas, flood fill

BFS/DFS are the two primitive engines under almost every graph pattern.

---

## 5. What problem existed before this?

People wandered graphs with ad-hoc recursion and forgot visited marks → infinite loops. Or used Dijkstra for every “fewest hops” problem — heavier than needed. Naming BFS/DFS clarified queue vs stack exploration.

---

## 6. What happens without it?

1. Unweighted shortest path coded with expensive algorithms.
2. Flood fill / islands wrong because diagonal rules or visited bugs.
3. Stack overflow from deep DFS on large graphs.
4. “I traversed somehow” fails interview rigor.

```text
No visited[]
  ↓
revisit forever on a cycle
  ↓
TLE / crash
```

---

## 7. How did people invent this?

Graph traversal is classical (19th–20th century algorithms books). AI search formalized BFS/DFS/IDS. Interviews keep them because grids + social graphs + dependency warmups all start here.

---

## 8. Computer intuition

**BFS:**

```text
queue ← start; dist[start]=0; visited[start]=true
while queue:
  u = pop front
  for v in neighbors(u):
    if not visited[v]:
      visited[v]=true
      dist[v]=dist[u]+1
      push v
```

**DFS recursive:**

```text
dfs(u):
  visited[u]=true
  for v in neighbors(u):
    if not visited[v]: dfs(v)
```

**DFS iterative:** same with explicit `stack`.

```text
VISITED TIMING (directed cycle detection uses colors — next lesson)

undirected component DFS: mark on enter
```

---

## 9. Mathematical intuition

Time O(n + m): each node enters queue/stack once; each edge examined constant times.

BFS distance δ(s,t) = minimum number of edges on any s–t path in an **unweighted** graph (or all weights equal).

DFS discovery produces a forest; parent edges form trees; extra edges are back/forward/cross (directed analysis).

Space: BFS O(w) frontier; DFS O(h) recursion depth — worst O(n).

---

## 10. Step-by-step working

**Number of islands / components:**

1. Scan all cells/nodes.
2. On unvisited land, run BFS/DFS flood; count++.

**Unweighted shortest path:**

1. BFS from source; store `dist` and optional `parent` to reconstruct.

**Multi-source BFS:**

1. Push **all** sources in queue at distance 0 (rotting oranges, nearest exit).

**0-1 BFS (preview):**

1. Deque; weight 0 edge push_front, weight 1 push_back.

---

## 11. Dry run

Graph:

```text
0 - 1 - 3
|   |
2 - 4
```

BFS from 0:

```text
q: [0]
visit 0 → push 1,2
q: [1,2]
visit 1 → push 3,4
q: [2,3,4]
visit 2 → (4 seen)
...
order: 0,1,2,3,4
dist:  0,1,1,2,2
```

DFS from 0 (neighbors ordered small→large):

```text
0 → 1 → 3 (end) back → 4 (via 1) back → 2 via 0
order depends on neighbor order — say it!
```

---

## 12. Visualization

```text
BFS RIPPLES

Level 0: 0
Level 1: 1, 2
Level 2: 3, 4
```

```text
DFS MAZE

0
└─1
  ├─3
  └─4
└─2   (when returned)
```

```text
GRID FLOOD

1 1 0
1 0 0
0 0 1

DFS/BFS on first 1-block → island #1
later bottom-right → island #2
```

---

## 13. Complexity

| Algo | Time | Extra space |
|---|---|---|
| BFS / DFS full traverse | O(n + m) | O(n) visited + frontier |
| Grid | O(R·C) | O(R·C) |
| Unweighted shortest | O(n + m) | O(n) |

---

## 14. Why this complexity?

Each vertex enqueued/marked once; each adjacency entry scanned once. That is linear in input size — optimal for reachability.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> bfsDist(int n, const vector<vector<int>>& g, int src) {
    vector<int> dist(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
    return dist;
}

void dfs(int u, const vector<vector<int>>& g, vector<char>& vis) {
    vis[u] = 1;
    for (int v : g[u]) if (!vis[v]) dfs(v, g, vis);
}

int components(int n, const vector<vector<int>>& g) {
    vector<char> vis(n);
    int comps = 0;
    for (int i = 0; i < n; i++) if (!vis[i]) {
        dfs(i, g, vis);
        comps++;
    }
    return comps;
}

int numIslands(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size(), ans = 0;
    auto dfsG = [&](auto&& self, int r, int c) -> void {
        if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] != '1') return;
        grid[r][c] = '0';
        self(self, r+1,c); self(self, r-1,c); self(self, r,c+1); self(self, r,c-1);
    };
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (grid[i][j] == '1') { ans++; dfsG(dfsG, i, j); }
    return ans;
}

// Multi-source BFS template (rotting oranges style)
int multiSourceHint(vector<vector<int>>& dist, queue<pair<int,int>>& q) {
    int R = dist.size(), C = dist[0].size();
    const int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    int last = 0;
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        last = dist[r][c];
        for (int k = 0; k < 4; k++) {
            int nr=r+dr[k], nc=c+dc[k];
            if (nr<0||nc<0||nr>=R||nc>=C) continue;
            if (dist[nr][nc] != -1) continue; // or other "blocked" checks
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr,nc});
        }
    }
    return last;
}
```

---

## 16. STL usage

| Need | STL |
|---|---|
| BFS | `queue` |
| Iterative DFS | `stack` |
| Visited | `vector<char>` / `vector<bool>` careful bit-proxy |
| Distances | `vector<int>` init -1 or INF |
| Grid BFS | `queue<pair<int,int>>` |

Prefer `vector<char>` over `vector<bool>` for visited when you need clear reference semantics.

---

## 17. Brute Force

Recursive exploration without visited; or for shortest path, enumerate all paths exponential. Dijkstra on unweighted also “works” but worse constants and more code.

---

## 18. Better

Mark visited; BFS for unweighted shortest; DFS/BFS for components. Bidirectional BFS when single target in huge unweighted graphs (advanced interview bonus).

---

## 19. Optimal

O(n+m) BFS/DFS is optimal for reachability and unweighted shortest paths. For weighted, do **not** claim BFS — use Dijkstra/Bellman-Ford (next lessons).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "BFS always finds shortest path."
  ↓
Fails: when edge weights differ
  ↓
Correct: BFS shortest only for unweighted / equal weights

Wrong: "DFS finds shortest path."
  ↓
Fails: deep path can be longer in edges
  ↓
Correct: DFS is for reachability/topology/search space, not fewest edges

Wrong: "Mark visited when popping, not when pushing (BFS)."
  ↓
Fails: multiple queue copies of same node → memory blowup
  ↓
Correct: mark on enqueue (usual unweighted BFS)

Wrong: "Recursion DFS is always fine."
  ↓
Fails: deep path → stack overflow
  ↓
Correct: iterative DFS or ensure depth OK
```

---

## 21. Common mistakes

1. Forgetting visited.
2. Not counting components from every unvisited start.
3. 4-vs-8 neighbors confusion on grids.
4. Using DFS for shortest path on unweighted by accident.
5. Modifying grid in-place without restoring when reuse needed.
6. Off-by-one distances.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Shortest path in a binary matrix.”  
**Expected:** BFS on grid; clarify 8-directions; obstacles.

### Amazon
**Ask:** “Number of islands / rotting oranges.”  
**Expected:** DFS/BFS flood; multi-source BFS for oranges.

### Microsoft
**Ask:** “Clone graph.”  
**Expected:** BFS/DFS + hash map old→new nodes.

### OpenAI
**Ask:** “BFS vs DFS — pick for this maze with equal step costs.”  
**Expected:** BFS for shortest; DFS if only existence / memory patterns / topo-related.

**Interview phrase:**

```text
"I'll BFS for fewest edges / layers, DFS for components or search-with-backtrack.
Time O(n+m), with a visited array."
```

---

## 23. Company use cases

| Context | Algo |
|---|---|
| Social distance (hops) | BFS |
| Cycle / component labeling | DFS/BFS |
| Image flood fill | DFS/BFS |
| Build system explore | DFS |
| Game fog / infection spread | Multi-source BFS |

---

## 24. Related concepts + pattern recognition cues

**Related:** Dijkstra, 0-1 BFS, topo sort, Union-Find components, backtracking.

| Cue | Tool |
|---|---|
| Fewest edges / levels | BFS |
| Multi targets same time | Multi-source BFS |
| Components / islands | DFS or BFS |
| Path existence only | Either |
| Weighted costs | Not plain BFS |
| Explicit backtrack paths | DFS |

**Decision snack:**

```text
Unweighted shortest → BFS
Flood / components → DFS or BFS
Weighted → Dijkstra / others
0/1 weights → deque BFS
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
BFS = queue = ripples = fewest edges
DFS = stack = deep corridors
Always mark visited
Grid = graph with 4/8 neighbors
Multi-source = many starts in queue
```

### Checklist

- [ ] BFS distances dry-run
- [ ] Components count
- [ ] Islands DFS
- [ ] Multi-source sketch
- [ ] Say when BFS ≠ shortest

### Practice roadmap

1. Easy: BFS of graph, Flood Fill, Number of Islands
2. Medium: Rotting Oranges, 01 Matrix, Clone Graph, Word Ladder (BFS)
3. Harder: Shortest Path in Grid with Obstacles Eliminating, Bidirectional BFS practice

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite ripple vs maze |
| 3 | Dry-run BFS distances |
| 7 | Code islands + BFS dist blind |
| 15 | Timed rotting oranges |
| 30 | Teach multi-source |
| 90 | Mock: Word Ladder style |

```text
Item: BFS / DFS
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
