# Advanced Graph Patterns — Core Lesson

**Module:** 07-graphs  
**Level target:** L5  
**Prerequisite:** BFS/DFS, topo, shortest paths, DSU  
**Memory picture:** Same engines (BFS/DFS/PQ/DSU), but the “node” becomes a richer state — like standing in a room holding keys, or two people walking, or a graph that flips over time.

> Previous: MST / Union-Find. Next module: Sorting & Searching.

---

## 1. What is it?

**Advanced graph patterns** reuse core algorithms on **transformed graphs**:

| Pattern | Idea |
|---|---|
| State-space search | Node = `(position, extra state)` |
| Multi-source BFS | Many starts distance 0 |
| 0-1 BFS | Deque for weights 0/1 |
| Bidirectional BFS | Search from both ends |
| Shortest path with k constraints | Layered graph / limited BF |
| SCC (Kosaraju/Tarjan) | Condensation DAG |
| Bridges / articulation points | Tarjan DFS times |
| Euler path | Hierholzer |
| Bipartite check | 2-color BFS/DFS |
| Flow (intro) | Max flow ≈ min cut (overview) |
| Rerooting / tree-as-graph | Already in trees; appears again |

You are not learning 20 new “magic algos” — you are learning **how to model**.

---

## 2. Explain like I am 10

A video game level: you need a key to open a door. Plain map BFS is not enough — “I am in the hall **without** the key” is different from “I am in the hall **with** the key.” So you pretend those are two different rooms. That is a state graph.

**Memory picture:**

```text
Real cell (r,c) + keys bitmask
        ↓
Virtual node id = f(r, c, mask)
        ↓
BFS / Dijkstra on virtual nodes
```

---

## 3. Real life story

Escape rooms, subway with limited transfers, package delivery with capacity, compiler strongly connected modules, network single points of failure (articulation), and road “must visit k types” puzzles all become state graphs or special DFS numbering.

---

## 4. Why does this exist?

Interview hard problems rarely need brand-new theory. They need **modeling**: expand nodes, add layers, run BFS. Advanced named algorithms (SCC, bridges) appear in stronger rounds and contest tracks.

---

## 5. What problem existed before this?

People tried nested BFS hacks or exponential DFS without state hashing. Formalizing product graphs / layered graphs made solutions clean and provably O(states · degree).

---

## 6. What happens without it?

1. You say “impossible” when a state BFS works.
2. You BFS only on position and get wrong answers with keys/fuel.
3. You miss that SCC condensation turns cyclic digraphs into DAGs for DP.
4. You confuse bridge edges with any edge on a cycle.

```text
Keys problem without mask in state
  ↓
visit cell once
  ↓
cannot re-enter with new keys → WA
```

---

## 7. How did people invent this?

AI search (state spaces), Tarjan’s DFS discoveries (1970s), Hierholzer’s Euler tours (19th century), Ford-Fulkerson flow — absorbed into interview “patterns” gradually via LeetCode Hard and CP.

---

## 8. Computer intuition

**State BFS template:**

```text
struct State { int r, c, mask; };
encode to int or use visited[r][c][mask]
queue + dist
transitions: moves; pickup key → new mask
```

**Kosaraju SCC (sketch):**

```text
1) DFS order on G — finish stack
2) Transpose graph G^T
3) DFS on G^T in reverse finish order — each tree a SCC
```

**Bridge (Tarjan idea):**

```text
tin[u], low[u]
edge u-v is bridge if low[v] > tin[u]
```

**Bipartite:**

```text
color nodes 0/1; neighbor conflict → not bipartite
```

---

## 9. Mathematical intuition

State count = |positions| × |configurations|. Time ≈ O(|S| · branching). Keep |S| ≤ ~1e7 carefully.

SCC: condensation is a DAG — unique sink ideas, 2-SAT structure (advanced).

Euler path undirected: exactly 0 or 2 odd-degree vertices; directed: in/out degree conditions.

Flow: max flow = min cut; Dinic etc. for contests — interview rarely codes Dinic unless role-specific.

---

## 10. Step-by-step working

**Shortest path to collect keys:**

1. Define state `(i, j, mask)`.
2. BFS; when mask full bits, return dist.

**Cheapest flights within k stops:**

1. Bellman-Ford `k+1` rounds, or BFS state `(city, stops)`.

**Critical connections (bridges):**

1. Tarjan DFS; collect edges with `low[v] > tin[u]`.

**Is graph bipartite / odd cycle:**

1. 2-color each component.

---

## 11. Dry run

Grid 1×3: `start . key`; door needs key at end (toy):

```text
States: (0,0,0) → (0,1,0) → (0,1,1) after key → (0,2,1) unlock
Visited must allow (0,1,0) and (0,1,1) separately
```

Bipartite:

```text
0—1
| /
2   triangle → color conflict → not bipartite
```

---

## 12. Visualization

```text
LAYERED GRAPH (k stops)

Copy nodes into layers 0..k
edge u→v becomes u_layer_i → v_layer_{i+1}
shortest path ≡ limited stops
```

```text
SCC CONDENSATION

[A↔B] → [C] → [D↔E]
  components become DAG nodes
```

```text
BRIDGE

A—B—C
  |
  D

If only one edge B-C connects C's side, B-C may be a bridge
```

---

## 13. Complexity

| Pattern | Typical time |
|---|---|
| State BFS | O(\|S\| + transitions) |
| Bidirectional BFS | often ~O(b^{d/2}) practical |
| Kosaraju / Tarjan SCC | O(n+m) |
| Bridges / articulation | O(n+m) |
| Euler Hierholzer | O(n+m) |
| Bipartite check | O(n+m) |

---

## 14. Why this complexity?

Still linear (or linear in state space) because each state/edge processed constant times. Blow-up only when you model too many bits (2^k with large k).

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

// Bipartite check
bool isBipartite(int n, const vector<vector<int>>& g) {
    vector<int> col(n, -1);
    queue<int> q;
    for (int s = 0; s < n; s++) if (col[s] == -1) {
        col[s] = 0; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (col[v] == -1) { col[v] = col[u] ^ 1; q.push(v); }
                else if (col[v] == col[u]) return false;
            }
        }
    }
    return true;
}

// Bridges
vector<vector<int>> g;
vector<int> tin, low;
vector<char> vis;
vector<pair<int,int>> bridges;
int timer;

void dfsBridge(int u, int p) {
    vis[u] = 1;
    tin[u] = low[u] = ++timer;
    for (int v : g[u]) {
        if (v == p) continue;
        if (vis[v]) low[u] = min(low[u], tin[v]);
        else {
            dfsBridge(v, u);
            low[u] = min(low[u], low[v]);
            if (low[v] > tin[u]) bridges.push_back({u, v});
        }
    }
}

// State BFS sketch: shortest path to get all keys (LeetCode style)
int shortestPathAllKeys(vector<string>& grid) {
    int R = grid.size(), C = grid[0].size(), keys = 0;
    int sr = 0, sc = 0;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (grid[i][j] == '@') { sr = i; sc = j; }
            if ('a' <= grid[i][j] && grid[i][j] <= 'f') keys++;
        }
    int need = (1 << keys) - 1;
    queue<array<int,3>> q; // r,c,mask
    vector<vector<vector<char>>> seen(R, vector<vector<char>>(C, vector<char>(1 << keys)));
    q.push({sr, sc, 0});
    seen[sr][sc][0] = 1;
    int dist = 0;
    const int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            auto [r,c,mask] = q.front(); q.pop();
            if (mask == need) return dist;
            for (int k = 0; k < 4; k++) {
                int nr=r+dr[k], nc=c+dc[k], nmask=mask;
                if (nr<0||nc<0||nr>=R||nc>=C) continue;
                char ch = grid[nr][nc];
                if (ch == '#') continue;
                if ('A' <= ch && ch <= 'F') {
                    int bit = ch - 'A';
                    if (((mask >> bit) & 1) == 0) continue;
                }
                if ('a' <= ch && ch <= 'f') nmask |= (1 << (ch - 'a'));
                if (!seen[nr][nc][nmask]) {
                    seen[nr][nc][nmask] = 1;
                    q.push({nr,nc,nmask});
                }
            }
        }
        dist++;
    }
    return -1;
}
```

---

## 16. STL usage

| Pattern | STL |
|---|---|
| State queue | `queue<array<int,3>>` / struct |
| Visited multi-dim | `vector` nested or encode `id = ((r*C+c)<<K)|mask` + `unordered_set`/`vector<char>` |
| SCC stack | `stack<int>` / vector as stack |
| Multiset edges Euler | `multiset` / adjacency with erase iterators |

Encode states to 64-bit keys carefully when using hash sets.

---

## 17. Brute Force

Backtracking all paths with bitmasks but without BFS layering — exponential with poor pruning. Works only for tiny grids.

---

## 18. Better

Plain BFS on position when state unnecessary. Dijkstra when state transitions weighted. Bidirectional BFS when start and goal known and branching high (Word Ladder).

---

## 19. Optimal

Optimal means **tight state definition** + the lightest correct engine (usually BFS). Over-modeling (extra unused dimensions) wastes time. Under-modeling causes WA.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Visited on cell is enough for key mazes."
  ↓
Fails: need revisit with better mask
  ↓
Correct: visited[state]

Wrong: "Any edge not in a triangle is a bridge."
  ↓
Fails: need DFS low/tin definition
  ↓
Correct: low[v] > tin[u]

Wrong: "SCC is just weakly connected in directed graphs."
  ↓
Fails: direction matters
  ↓
Correct: mutually reachable sets

Wrong: "Advanced means new code from scratch every time."
  ↓
Fails: reinventing wheels
  ↓
Correct: model → BFS/DFS/DSU/Dijkstra you already know
```

---

## 21. Common mistakes

1. Bitmask off-by-one for keys.
2. Blocking doors incorrectly (`A` needs bit for `a`).
3. Forgetting multi-component bipartite starts.
4. Bridge DFS: not handling multiple edges / parent correctly.
5. State explosion — 2^10 OK, 2^20×n may die.
6. Using DFS recursion depth on huge state spaces.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Shortest path to get all keys.”  
**Expected:** State BFS; complexity with 2^k · R · C.

### Amazon
**Ask:** “Critical connections in a network.”  
**Expected:** Bridges via Tarjan; explain low/tin.

### Microsoft
**Ask:** “Is graph bipartite?”  
**Expected:** 2-color; odd cycle meaning.

### OpenAI
**Ask:** “How do you reduce a constrained shortest path to a known algorithm?”  
**Expected:** Layered / product graph; then BFS or Dijkstra.

**Interview phrase:**

```text
"I'll define the state explicitly, prove the transition rules,
then run BFS/Dijkstra on that state graph."
```

---

## 23. Company use cases

| Context | Pattern |
|---|---|
| Permissioned maps / keys | State BFS |
| Network reliability | Bridges / articulation |
| Module dependency cycles | SCC |
| Matching / conflict | Bipartite |
| Word morph ladders | Bidirectional BFS |
| Transport with transfers | Layered graph |

---

## 24. Related concepts + pattern recognition cues

**Related:** all earlier graph lessons, bitmasks DP, meet-in-the-middle, flow (optional).

| Cue | Pattern |
|---|---|
| Extra inventory / fuel / k | State or layered graph |
| Many simultaneous starts | Multi-source BFS |
| Only 0/1 costs | 0-1 BFS |
| Mutually reachable groups | SCC |
| Single point/edge failure | Articulation / bridge |
| Odd cycle coloring | Bipartite |
| Traverse every edge once | Euler |

**Decision snack:**

```text
Stuck on Hard graph?
1) What is a node really?
2) What must be in the state?
3) Which engine: BFS / Dijkstra / DSU / Tarjan?
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Advanced = modeling + old engines
State = position + extras
SCC → DAG condensation
Bridges via tin/low
Bipartite = 2-color
Speak the state before coding
```

### Checklist

- [ ] State BFS template
- [ ] Bipartite code
- [ ] Bridge condition sentence
- [ ] Kosaraju 3 steps
- [ ] Layered graph for K stops

### Practice roadmap

1. Medium: Is Graph Bipartite, Word Ladder, Cheapest Flights K Stops
2. Hard: Shortest Path to Get All Keys, Critical Connections, Bus Routes
3. Contest track: SCC, Euler path, intro max flow (optional)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite “model the state” |
| 3 | Dry-run keys BFS |
| 7 | Code bipartite + outline bridges |
| 15 | Timed state-graph problem |
| 30 | Teach SCC verbally |
| 90 | Hard mock: keys or bridges |

```text
Item: Advanced Graph Patterns
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
