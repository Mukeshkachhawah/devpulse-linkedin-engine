# DP on Trees and Graphs

**Module:** 09-dynamic-programming  
**Level target:** L5  
**Prerequisite:** trees, DFS, DP framework, graphs basics  
**Memory picture:** For trees — each node keeps a small report card made from its children’s report cards. For DAGs — process nodes in order so every arrow comes from already finished nodes.

---

## 1. What is it?

**Tree DP** computes answers for rooted trees by combining child subtrees: house robber on trees, diameter-related DP, max independent set, subtree sizes, rerooting DP.

**Graph DP** usually means DP on a **DAG** (or on shortest-path style recurrences): longest path in DAG, number of paths, DP on topo order. On general graphs with cycles, plain DP needs extra care (often shortest paths algorithms instead).

New words:

- **Rooted tree** — pick a root; edges go parent↔child.
- **Subtree state** — answer for the tree hanging at `u`.
- **Rerooting** — compute answer as if every node were root, in O(n).
- **Topo DP** — fill `dp[node]` after all prerequisites.

---

## 2. Explain like I am 10

A company org chart is a tree. Each manager asks every worker: “How many people under you?” Each worker answers using their team’s answers. That upward combining is tree DP.

If tasks have arrows “must finish A before B” and no loops, you solve tasks in order — DAG DP.

---

## 3. Real life story

**Tree house robber:** parties in an org — invite a person ⇒ cannot invite direct boss/reports. Max fun = tree DP with two states per node (take / skip).

**Course prerequisites:** longest chain of courses = longest path in DAG.

```text
      1
     / \
    2   3
   /
  4
subtree sizes: 4→1, 2→2, 3→1, 1→4
```

---

## 4. Why does this exist?

Trees have no cycles — perfect for induction from leaves to root. DAGs have topo order — perfect for one-pass DP. Many “hierarchy + choices” interview problems fit.

---

## 5. What problem existed before this?

Flatten everything to arrays and hope; or exponential DFS without merging structure. People needed a systematic “combine children” algebra.

---

## 6. What happens without it?

```text
Ignore tree structure
→ wrong neighbor constraints
→ exponential re-traversal of same subtree
```

On cyclic graphs, naive recursion without visited/distance semantics infinite-loops.

---

## 7. How did people invent this?

Subtree DP is natural with recursion on trees. Rerooting and “DP on DAG” became competitive programming standards; FAANG interviews often ask house-robber-III and diameter / path sums as gentle tree DP.

---

## 8. Computer intuition

```text
TREE POSTORDER

dfs(u):
  for child v:
    dfs(v)
    combine child's dp into u's dp

States example (robber):
  take[u] = value[u] + sum(skip[v] for v child)
  skip[u] = sum(max(take[v], skip[v]) for v child)


DAG

topo order: A B C D
dp[B] uses dp[A] if A→B
```

---

## 9. Mathematical intuition

Tree: O(n) states if constant states per node; transitions sum over edges → **O(n)** time.

If state includes `k`, maybe O(nk) or O(n·k²) for knapsack-on-tree.

DAG: O(V+E) to topo + O(E) transitions.

General graph longest path is NP-hard — do **not** claim linear DP on cyclic graphs for longest path.

---

## 10. Step-by-step working

### Tree DP recipe

1. Root the tree (often node 0/1).
2. Decide states at node `u` (often 2: take/skip, or include diameter pair).
3. DFS children first (postorder).
4. Write combine equations.
5. Answer at root (or max over nodes).

### Rerooting sketch

1. DFS1: compute subtree answers for root R.  
2. DFS2: pass “contribution from parent side” downward to compute answers for all roots.

### DAG recipe

1. Confirm acyclic (or build dependency DAG).  
2. Topo sort.  
3. `dp[v] = combine(dp[u] for u→v)`.  
4. Answer max/min/sum at sinks/sources.

---

## 11. Dry run

**House robber III**

```text
      3
     / \
    2   3
     \   \
      3   1

take(3root)=3 + skip(2)+skip(3right)=3+3+0? careful:
Node2: take=2+0=2, skip=max(take3,skip3)=3 → skip2=3, take2=2
Node3right: take=3, skip=1 → wait structure: right child 3 has child 1
  take(3r)=3+skip(1)=3+0=3
  skip(3r)=max(take1,skip1)=1
Root take=3+skip2+skip3r=3+3+1=7
Root skip=max(take2,skip2)+max(take3r,skip3r)=3+3=6
Answer max=7
```

Classic answer for this LeetCode sample is **7**.

---

## 12. Visualization

```text
TWO STATES PER NODE

        u
      / | \
    c1 c2 c3

take[u] = val[u] + skip[c1]+skip[c2]+skip[c3]
skip[u] = opt[c1]+opt[c2]+opt[c3]
opt[x] = max(take[x], skip[x])


DAG LONGEST PATH

A → B → D
↘ C ↗
dp[A]=0
dp[B]=dp[A]+w
dp[C]=dp[A]+w
dp[D]=max(from B, from C)
```

---

## 13. Complexity

| Pattern | Time | Space |
|---|---|---|
| Binary states tree DP | O(n) | O(n) recursion |
| Tree knapsack | O(n·W) class | O(nW) |
| Rerooting | O(n) or O(n·state) | O(n) |
| DAG DP | O(V+E) | O(V) |

Watch recursion depth on skewed trees — iterative stack if needed.

---

## 14. Why this complexity?

Each edge combines constant (or W) work once in postorder. Topo DP touches each edge once.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
};

pair<int,int> dfs(TreeNode* u) {
    // return {take, skip}
    if (!u) return {0, 0};
    auto L = dfs(u->left), R = dfs(u->right);
    int take = u->val + L.second + R.second;
    int skip = max(L.first, L.second) + max(R.first, R.second);
    return {take, skip};
}

int robTree(TreeNode* root) {
    auto p = dfs(root);
    return max(p.first, p.second);
}

// DAG: number of paths from S to T (0-index nodes)
int countPaths(int n, vector<vector<int>>& g, int S, int T) {
    vector<int> indeg(n), dp(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : g[u]) indeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; ++i) if (indeg[i] == 0) q.push(i);
    dp[S] = 1;
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    for (int u : order)
        for (int v : g[u]) dp[v] += dp[u];
    return dp[T];
}
```

---

## 16. STL usage

- adjacency `vector<vector<int>>`
- `pair` / struct for multiple states
- `queue` for Kahn topo
- recursion vs explicit stack

---

## 17. Brute Force

Try all independent sets; try all paths. Exponential.

---

## 18. Better

Memo DFS with state `(node, tookParent)`.

---

## 19. Optimal

Postorder tree DP O(n); DAG topo DP O(V+E). For diameter, two-BFS on trees or DP returning best downward heights.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Tree robber same as array robber code."
  Why it fails: neighbors are parent/children, not index±1.
  Correct: two states at node from children.

Wrong: "Longest path DP on graph with cycles."
  Why it fails: NP-hard / infinite without constraints.
  Correct: need DAG, or different problem.

Wrong: "Forgot skip vs take on children."
  Why it fails: adjacent invites both.
  Correct: take[u] only adds skip[child].

Wrong: "Rerooting needs n DFS from each root."
  Why it fails: O(n²).
  Correct: two-pass reroot O(n).
```

---

## 21. Common mistakes

1. Missing null child bases.  
2. Using global visited incorrectly on trees (parent param needed).  
3. Mixing undirected edge twice without parent skip.  
4. Topo on graph that has a cycle.  
5. Integer overflow on path counts.  
6. Returning only `take[root]` forgetting `skip`.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “States for house robber on binary tree?”  
**Expected:** “For each node, max if we rob it (then cannot rob children) and max if we skip it (children free to opt). Combine in postorder; answer max of root’s two states.”

### Amazon-style

**Interviewer:** “Org chart bonus with adjacency constraint — scale?”  
**Expected:** “Tree DP O(n) fits millions if thin states. Recursion depth risk on skewed org → iterate or increase care.”

### Microsoft-style

**Interviewer:** “Longest course chain?”  
**Expected:** “Build prereq DAG; dp[v]=1+max(dp[u]) over edges u→v in topo order.”

### OpenAI-style

**Interviewer:** “When is graph DP actually shortest path?”  
**Expected:** “When recurrence is min-plus along edges with no ‘subset of nodes’ constraint, Dijkstra/Bellman-Ford is the right tool; calling it DP is OK historically (Bellman), but use the graph algorithm toolkit.”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Org / IAM trees | aggregate quotas with constraints |
| Build systems | DAG of targets; longest compile chain |
| Games | skill trees |
| Networks | DP on trees for some network designs |

---

## 24. Related concepts + pattern recognition cues

```text
IF binary tree + choose nodes with parent-child ban → tree DP 2 states
IF subtree size / sum / max → simple tree DP
IF answers for every root → rerooting
IF prerequisites / only forward edges → DAG DP
IF cyclic + min cost reach → shortest path algorithms
IF n tiny + visit sets → bitmask on graph
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Tree DP = postorder combine children
Often take/skip pair
DAG DP = topo then relax edges
No naive longest-path DP on cyclic graphs
```

### Checklist

- [ ] Robber III dry run  
- [ ] Code take/skip DFS  
- [ ] Topo DP path count  
- [ ] Explain cycle trap  
- [ ] Diameter approach outline  

### Practice plan

1. House Robber III  
2. Binary tree diameter / path sum variants  
3. Longest increasing path in matrix (DAG on cells)  
4. Course schedule + longest chain  
5. Optional: rerooting introductory problem  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Robber III code + dry run |
| 3 | DAG longest / count paths |
| 7 | One tree DP medium timed |
| 15 | Teach take/skip with drawing |
| 30 | Retry failed tree/graph DP |
| 90 | Google state question mock |

```text
Item: DP on Trees & Graphs
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Org-chart metaphor |
| L2 | Dry-run take/skip |
| L3 | Code tree robber + DAG dp |
| L4 | Detect cycle vs DAG correctly |
| L5 | Design multi-state tree DP on new prompts |
