# Topological Sort and Cycle Detection — Core Lesson

**Module:** 07-graphs  
**Level target:** L4–L5  
**Prerequisite:** DFS/BFS, directed graphs  
**Memory picture:** Getting dressed — socks before shoes. Topo sort = a valid order to put on clothes. A cycle = “need A before B before A” — impossible.

> Previous: BFS/DFS. Next: Shortest Path.

---

## 1. What is it?

**Topological sort** of a **DAG** (Directed Acyclic Graph) is a linear order of nodes such that for every directed edge `u → v`, `u` appears before `v`.

**Cycle detection** asks whether such an order can exist (directed) or whether an undirected graph contains a loop.

Algorithms:

- **Kahn’s algorithm** — BFS with indegrees  
- **DFS finish-time order** — add node after exploring neighbors; reverse for topo  
- **DFS colors** — White/Gray/Black for directed cycles  

New words:

- **Indegree** — number of incoming edges.
- **DAG** — directed graph with no directed cycles.
- **Back edge** — edge to an ancestor in DFS tree (directed: to a Gray node).

---

## 2. Explain like I am 10

School subjects: you must finish “Arithmetic” before “Algebra,” and “Algebra” before “Calculus.” A topo order is a timetable that respects “before” rules. If a brochure says Calculus before Arithmetic and Arithmetic before Calculus, that is a cycle — no valid timetable.

**Memory picture:**

```text
A → B → D
↓   ↓
C → D

One topo: A, B, C, D
Also OK:  A, C, B, D
Never:    B before A
```

---

## 3. Real life story

Course prerequisites, build systems (compile libraries before apps), spreadsheet formula dependencies, task schedulers, and package managers all need topo order. Detecting cycles catches circular imports and impossible schedules.

---

## 4. Why does this exist?

Directed dependencies are everywhere. You need:

1. A safe processing order, or  
2. A clear “impossible / cycle” error  

Topo sort is the standard tool. It only exists for DAGs.

---

## 5. What problem existed before this?

People hard-coded layer orders or used full DFS without proving acyclicity — bugs when cycles appeared. Kahn (1962) and DFS finishing times became textbook methods.

---

## 6. What happens without it?

1. Course Schedule problems feel like random BFS.
2. You output an order that violates an edge.
3. You miss cycles → infinite build loops in real systems.
4. You apply topo to undirected graphs wrongly.

```text
Cycle in dependencies
  ↓
no topo order
  ↓
Kahn queue empties early; processed < n
```

---

## 7. How did people invent this?

Scheduling theory + compiler dependency analysis. Interview staples: Course Schedule I/II, Alien Dictionary, Parallel Courses.

---

## 8. Computer intuition

**Kahn:**

```text
compute indegree[]
queue all nodes with indegree 0
while queue:
  u = pop
  append u to order
  for v in g[u]:
    indegree[v]--
    if indegree[v]==0: push v
if order.size()!=n → cycle
```

**DFS cycle (directed):**

```text
WHITE=unseen, GRAY=in stack, BLACK=done
dfs(u):
  color[u]=GRAY
  for v:
    if color[v]==GRAY → cycle
    if color[v]==WHITE → dfs(v)
  color[u]=BLACK
  stack.push(u)  // finished
topo = reverse(stack)
```

**Undirected cycle:** DFS parent skip; visit already-visited non-parent → cycle. Or Union-Find: edge between same component → cycle.

---

## 9. Mathematical intuition

A DAG always has a node of indegree 0 (and outdegree 0). Kahn repeatedly peels such nodes — like induction removing sources.

Number of topo orders can be many; any valid one often suffices. Counting them is harder (#P-ish / DP on subsets for small n).

Time O(n + m): each edge reduces one indegree once.

---

## 10. Step-by-step working

**Course Schedule (can finish?):**

1. Build digraph + indegrees.
2. Kahn; return `count == n`.

**Course Schedule II (return order):**

1. Same; return order or empty if cycle.

**Alien Dictionary sketch:**

1. From sorted adjacent words, derive letter edges (`c1 → c2` means c1 before c2 — careful problem statement).
2. Topo letters; detect invalid prefix cases + cycles.

---

## 11. Dry run

Edges: `0→1, 0→2, 1→3, 2→3`

```text
indegree: 0:0, 1:1, 2:1, 3:2
queue: [0]
pop 0 → reduce 1,2 → queue [1,2]
pop 1 → reduce 3 → indegree3=1
pop 2 → reduce 3 → indegree3=0 → queue [3]
pop 3
order: 0,1,2,3 (or 0,2,1,3)
```

Add edge `3→1` → cycle; Kahn never frees both 1 and 3 properly; size &lt; n.

---

## 12. Visualization

```text
KAHN PEELING

indegree 0 nodes = ready tasks
remove them, unlock neighbors
```

```text
DFS COLORS

   A (GRAY)
   ↓
   B (GRAY)
   ↓
   A (GRAY)  ← back edge = cycle
```

```text
UNDIRECTED CYCLE

1 — 2
|   |
4 — 3

DFS from 1 to 2 to 3 to 4; edge 4-1 to visited non-parent → cycle
```

---

## 13. Complexity

| Algo | Time | Space |
|---|---|---|
| Kahn topo | O(n+m) | O(n+m) |
| DFS topo / cycle | O(n+m) | O(n+m) |
| Union-Find undirected cycle | α(n) per edge ≈ O(m) | O(n) |

---

## 14. Why this complexity?

Each node enters the queue at most once; each edge inspected once. DFS paints each node a constant number of times.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> kahn(int n, const vector<vector<int>>& g) {
    vector<int> indeg(n), order;
    for (int u = 0; u < n; u++)
        for (int v : g[u]) indeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    if ((int)order.size() != n) return {}; // cycle
    return order;
}

bool hasDirectedCycle(int n, const vector<vector<int>>& g) {
    vector<int> color(n, 0); // 0 W, 1 G, 2 B
    function<bool(int)> dfs = [&](int u) -> bool {
        color[u] = 1;
        for (int v : g[u]) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && dfs(v)) return true;
        }
        color[u] = 2;
        return false;
    };
    for (int i = 0; i < n; i++) if (color[i] == 0 && dfs(i)) return true;
    return false;
}

bool hasUndirectedCycle(int n, const vector<vector<int>>& g) {
    vector<char> vis(n);
    function<bool(int,int)> dfs = [&](int u, int p) -> bool {
        vis[u] = 1;
        for (int v : g[u]) {
            if (v == p) continue;
            if (vis[v] || dfs(v, u)) return true;
        }
        return false;
    };
    for (int i = 0; i < n; i++) if (!vis[i] && dfs(i, -1)) return true;
    return false;
}
```

---

## 16. STL usage

| Piece | STL |
|---|---|
| Kahn queue | `queue<int>` |
| Indegrees | `vector<int>` |
| Priority topo (lex smallest) | `priority_queue` min-heap instead of queue |
| DFS | recursion or explicit stack + color array |

Lexicographically smallest topo: put indegree-0 nodes in a **min-heap**, always pop smallest.

---

## 17. Brute Force

Try all permutations and test all edges — O(n! · m). Only for n ≤ 10 teaching demos.

---

## 18. Better

DFS-based cycle checks without producing order when you only need boolean. Still O(n+m).

---

## 19. Optimal

Kahn or DFS topo in O(n+m) is optimal. For “minimum semesters” (Parallel Courses): topo + longest path in DAG / level peeling counts.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Any BFS order is a topo order."
  ↓
Fails: BFS from one source ignores other indegree-0 nodes
  ↓
Correct: Kahn starts from ALL indegree-0 nodes

Wrong: "Edge to a visited node always means directed cycle."
  ↓
Fails: could be cross/forward to BLACK node
  ↓
Correct: cycle if edge to GRAY (in recursion stack)

Wrong: "Topo works on undirected graphs."
  ↓
Fails: undirected edge is both ways — always cycles in that sense
  ↓
Correct: topo is for directed DAGs

Wrong: "If Kahn outputs n nodes, order might still be wrong."
  ↓
Fails: algorithm maintains indegree invariant
  ↓
Correct: size==n iff DAG; order is valid
```

---

## 21. Common mistakes

1. Building undirected edges for course graphs.
2. Forgetting nodes with no edges (still must appear).
3. Using visited bool only (no Gray) for directed cycles.
4. Alien dictionary: not comparing only adjacent words; wrong edge direction.
5. Returning any leftover order when cycle exists.
6. 1-index courses vs 0-index arrays.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Course Schedule II — return any valid order.”  
**Expected:** Kahn or DFS; empty on cycle; complexity O(n+m).

### Amazon
**Ask:** “Detect cycle in directed graph.”  
**Expected:** 3-color DFS; explain Gray.

### Microsoft
**Ask:** “Alien Dictionary.”  
**Expected:** Build edges from adjacent words; topo; invalid cases.

### OpenAI
**Ask:** “How do you get the lexicographically smallest topo order?”  
**Expected:** Kahn with min-heap of ready nodes.

**Interview phrase:**

```text
"Dependencies form a digraph. I'll run Kahn's algorithm —
if I process fewer than n nodes, there's a cycle; otherwise the order is topological."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| CI build pipelines | Topo compile order |
| Package managers | Cycle = error |
| Course planners | Schedule feasibility |
| Spreadsheet calc | Eval order |
| Data pipelines / DAGs (Airflow-like) | Task order |

---

## 24. Related concepts + pattern recognition cues

**Related:** DFS, BFS, DP on DAG, shortest/longest path in DAG, Union-Find undirected cycles.

| Cue | Tool |
|---|---|
| Prerequisites / before-after | Topo |
| Can finish all courses? | Cycle detect / Kahn size |
| Order of tasks | Kahn / DFS topo |
| Undirected loop? | DFS parent or DSU |
| Longest chain of deps | DP on DAG after topo |

**Decision snack:**

```text
Directed deps → topo / directed cycle colors
Undirected cycle → parent DFS or Union-Find
Need order → Kahn or DFS finish times
Need lex smallest → Kahn + min-heap
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Topo = valid order on a DAG
Kahn = peel indegree 0
size < n → cycle
Directed cycle = edge to GRAY
Undirected = visited non-parent
```

### Checklist

- [ ] Kahn dry-run
- [ ] Explain Gray vs Black
- [ ] Undirected cycle DFS
- [ ] Course Schedule code
- [ ] Lex smallest variant

### Practice roadmap

1. Easy/Med: Course Schedule, Course Schedule II
2. Medium: Alien Dictionary, Minimum Height Trees (related peeling), Parallel Courses
3. Classic: Detect cycle directed/undirected GFG style

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite clothes/prereq picture |
| 3 | Kahn dry-run with cycle |
| 7 | Code Kahn + 3-color DFS |
| 15 | Alien dictionary outline |
| 30 | Teach Gray edge rule |
| 90 | Mock: Course Schedule II |

```text
Item: Topo Sort / Cycle Detection
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
