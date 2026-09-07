# Tree DP and Tree Views — Core Lesson

**Module:** 06-trees  
**Level target:** L4–L5  
**Prerequisite:** binary tree traversals, recursion, basic DP idea  
**Memory picture:** Postorder = finish both children’s homework, then do the parent’s summary. Views = what a camera sees from one side of the tree.

> Previous: Trie. Next module: Graphs.

---

## 1. What is it?

**Tree DP** means computing answers for a tree by combining answers from **subtrees** (usually bottom-up / postorder). Classic: diameter, max path sum, house robber on tree, rooted DP with rerooting.

**Tree views** mean listing nodes visible from a direction:

- **Right / left view** — first node you see per depth from that side
- **Top / bottom view** — horizontal distance map (column), keep first or last by depth rules
- **Boundary** — left boundary + leaves + right boundary

New words:

- **Horizontal distance (HD)** — column index: root 0, left child HD-1, right HD+1.
- **Rerooting** — compute DP for every possible root efficiently by reusing neighbor answers.
- **Two best children** — diameter often needs best + second-best downward paths.

---

## 2. Explain like I am 10

Your school is a tree of classrooms. Each room asks its left and right wings for a report, then writes its own report using those. That is tree DP.

If you stand on the right side of a sculpture made of balls and sticks, you only see the rightmost ball on each height — right view.

**Memory picture:**

```text
Tree DP: kids finish first → parent combines

Views: camera on one side
        1          Right view: 1, 3, 7
       / \
      2   3
     / \   \
    4   5   7
```

---

## 3. Real life story

Company org chart: compute total headcount under each manager (subtree sizes) — postorder DP. Security cameras on a building facade: only outer rooms visible — views. Network diameter: longest cable path between any two machines — tree diameter DP.

---

## 4. Why does this exist?

Linear DP on arrays assumes a line. Trees branch. The right order is: **solve children, then parent** (or DFS returning multiple values). Views convert geometric intuition into BFS/DFS with depth or HD bookkeeping.

---

## 5. What problem existed before this?

People tried nested loops over all pairs for diameter → O(n²). Or flattened trees incorrectly into arrays and lost structure. Naming “tree DP” and standard view patterns made interviews teachable.

---

## 6. What happens without it?

1. Diameter becomes “DFS from every node” without understanding the two-path combine — slow or buggy.
2. Max path sum mishandles negative branches.
3. Views become ad-hoc prints that fail on missing left/right children.
4. You confuse binary tree diameter with graph diameter algorithms.

```text
Max path through node = leftGain + node + rightGain
but return upward only node + max(leftGain, rightGain, 0)
Mixing these two → WA
```

---

## 7. How did people invent this?

Subtree aggregation is as old as tree algorithms in compilers and network design. LeetCode-style “Binary Tree Maximum Path Sum” and “House Robber III” popularized interview tree DP. Views come from classic GATE/interview question banks (top view especially in Indian interview circuits).

---

## 8. Computer intuition

**Return multiple values from DFS:**

```text
dfs(node) returns:
  height
  or (include_node_best, exclude_node_best)
  or downward_gain
```

Parent combines children’s structs.

**Right view BFS:**

```text
each level, the last node popped in left-to-right order is right view
(or first if you push right child first — pick one scheme and stick to it)
```

**Top view:**

```text
BFS with HD; first time you see an HD, record that node
```

```text
HD labels

      1 (0)
     / \
  2(-1) 3(+1)
   / \
4(-2) 5(0)   ← HD 0 already taken by 1 for top view
```

---

## 9. Mathematical intuition

Tree with n nodes: one DFS visits each edge twice (down/up) → O(n).

Diameter in a tree: max over nodes of (down_left + down_right) (for binary) or sum of two longest child depths (for general trees). Proof idea: the longest path’s highest node is the “peak”; combining two downward chains covers it.

Rerooting: after one DFS computes subtree DP for a rooted tree, a second DFS shifts the root to a neighbor in O(1) or O(degree) using formulas — total O(n).

---

## 10. Step-by-step working

**Binary tree diameter (edges or nodes — read problem):**

1. DFS returns height of subtree.
2. At node: `diameter = max(diameter, leftH + rightH)`.
3. Return `1 + max(leftH, rightH)` upward.

**Max path sum (any node to any node):**

1. `gain(child) = max(0, dfs(child))` — drop negative.
2. Update global with `gainL + node + gainR`.
3. Return `node + max(gainL, gainR)` to parent.

**House Robber III:**

1. Return pair `(rob_this, skip_this)`.
2. `rob_this = node + skipL + skipR`.
3. `skip_this = max(robL, skipL) + max(robR, skipR)`.

**Right side view:**

1. BFS levels; push last value of each level.  
   Or DFS preorder prioritizing right; first visit at each depth wins.

---

## 11. Dry run

Diameter (edges) on:

```text
      1
     / \
    2   3
   / \
  4   5

At 2: leftH=1, rightH=1 → candidate 2
At 1: leftH=2, rightH=1 → candidate 3
Diameter edges = 3  (4-2-1-3 or 5-2-1-3)
```

Max path sum tree `[-10,9,20,null,null,15,7]`:

```text
Best through 20: 15+20+7 = 42
Negatives dropped when returning upward from -10
```

Right view of earlier sculpture: `[1,3,7]`.

---

## 12. Visualization

```text
TREE DP FLOW (postorder)

dfs(4)→h=1   dfs(5)→h=1
     \       /
      dfs(2) combines → h=2, diam cand=2
             \
              dfs(1) combines with dfs(3)
```

```text
RIGHT VIEW (BFS)

Level 0: [1]      → take 1
Level 1: [2,3]    → take 3
Level 2: [4,5,7]  → take 7
```

```text
TOP VIEW by HD

HD: -2  -1  0  1
     4   2  1  3
(5 at HD0 ignored for top if 1 seen first)
```

---

## 13. Complexity

| Problem | Time | Space |
|---|---|---|
| Diameter / max path / robber | O(n) | O(h) |
| Left/right view | O(n) | O(w) or O(h) |
| Top/bottom view | O(n) | O(n) map |
| Reroot all answers | O(n) | O(n) |

---

## 14. Why this complexity?

Each node processed constant times with O(1) or O(degree) work. Maps for HD add log factors if `map`, average O(1) with hash of HD → node. No pair enumeration needed when DP is correct.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int diameter = 0;
int height(TreeNode* n) {
    if (!n) return 0;
    int L = height(n->left), R = height(n->right);
    diameter = max(diameter, L + R); // edges
    return 1 + max(L, R);
}

int bestPath = INT_MIN;
int gain(TreeNode* n) {
    if (!n) return 0;
    int L = max(0, gain(n->left));
    int R = max(0, gain(n->right));
    bestPath = max(bestPath, L + n->val + R);
    return n->val + max(L, R);
}

pair<int,int> robber(TreeNode* n) {
    if (!n) return {0, 0};
    auto L = robber(n->left), R = robber(n->right);
    int rob = n->val + L.second + R.second;
    int skip = max(L.first, L.second) + max(R.first, R.second);
    return {rob, skip};
}

vector<int> rightSideView(TreeNode* root) {
    vector<int> ans;
    if (!root) return ans;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode* cur = q.front(); q.pop();
            if (i == sz - 1) ans.push_back(cur->val);
            if (cur->left) q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }
    }
    return ans;
}

vector<int> topView(TreeNode* root) {
    vector<int> ans;
    if (!root) return ans;
    map<int,int> hdVal; // ordered by HD
    queue<pair<TreeNode*,int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [n, hd] = q.front(); q.pop();
        if (!hdVal.count(hd)) hdVal[hd] = n->val;
        if (n->left) q.push({n->left, hd - 1});
        if (n->right) q.push({n->right, hd + 1});
    }
    for (auto& [hd, v] : hdVal) ans.push_back(v);
    return ans;
}
```

---

## 16. STL usage

| Need | STL |
|---|---|
| Level views | `queue` |
| Top/bottom by HD | `map<int,int>` (sorted columns) or `unordered_map` + track min/max HD |
| Rerooting adj | `vector<vector<int>>` tree as graph |
| Multi-value DP | `pair` / `struct` returns |

Prefer `map` for top view output in order of HD without extra sort.

---

## 17. Brute Force

Diameter: for every node, BFS farthest (as graph) twice from endpoints — O(n²) if repeated naively; the classic tree method “two BFS” is O(n) for unweighted trees as graphs. Pairwise all paths — worse.

Views: from each depth collect all nodes then pick — still O(n) if done in one BFS; brute would rebuild lists repeatedly.

---

## 18. Better

Single DFS returning height for diameter. Single BFS for views. Better than all-pairs.

For general trees as adjacency lists: two-BFS diameter method is clean O(n).

---

## 19. Optimal

O(n) time tree DP / views is optimal (must read all nodes). Rerooting all-roots answers in O(n) is the advanced optimal pattern vs O(n²) re-DFS from each root.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Diameter is always through the root."
  ↓
Fails: long path can sit entirely in one subtree
  ↓
Correct: update global at every node with left+right heights

Wrong: "Return the full left+right path upward."
  ↓
Fails: parent cannot use a path that already bent
  ↓
Correct: return only a straight downward gain

Wrong: "Right view = all right children along right spine."
  ↓
Fails: a left subtree can stick out at a deeper level
  ↓
Correct: first/last node per depth from that side

Wrong: "Top view = inorder."
  ↓
Fails: wrong columns
  ↓
Correct: horizontal distance + first seen (usually BFS)
```

---

## 21. Common mistakes

1. Mixing node-count vs edge-count diameter.
2. Not using `max(0, childGain)` in max path sum.
3. Integer overflow on path sums — use long carefully if needed.
4. Right view DFS visiting left first without depth-first-seen logic.
5. Top view using DFS without depth checks — wrong node wins a column.
6. House robber: double-counting or allowing parent+child both robbed.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Binary tree maximum path sum.”  
**Expected:** Global vs return value distinction; drop negatives; O(n).

### Amazon
**Ask:** “Right side view of binary tree.”  
**Expected:** BFS last per level; edge cases empty / skewed.

### Microsoft
**Ask:** “Diameter of binary tree.”  
**Expected:** Height DFS + global; clarify nodes vs edges.

### OpenAI
**Ask:** “How would you compute an answer for every possible root?”  
**Expected:** Rerooting DP sketch; two DFS; reuse neighbor contributions.

**Interview phrase:**

```text
"This is tree DP: each node returns what the parent needs,
and we update a global answer for paths that bend at the node.
For views, I'll key by depth or horizontal distance."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Org metrics / rollups | Subtree DP |
| Network longest latency in tree backbone | Diameter |
| UI tree outline / org visual | Views |
| Game skill trees | Robber-like include/exclude |
| Distributed systems tree topologies | Rerooting aggregates |

---

## 24. Related concepts + pattern recognition cues

**Related:** postorder traversal, graph tree diameter (two BFS), DP on graphs, LCA, centroid decomposition (advanced).

| Cue | Pattern |
|---|---|
| Combine left/right subtree numbers | Tree DP |
| Path bending at a node | Global + limited return |
| Visible from side | View by depth |
| Visible from above | HD + first/last |
| Answer changes if root changes | Rerooting |
| Include node excludes children | House robber tree |

**Decision snack:**

```text
Need subtree combine? → postorder DP
Need camera side list? → BFS/DFS view
Need all-roots? → reroot
Need any-node path max? → global bend + upward gain
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Kids first, parent combines (tree DP)
Bent path = global; upward = straight gain
Right view = last in each BFS level
Top view = first node per horizontal distance
```

### Checklist

- [ ] Diameter dry-run
- [ ] Max path sum return vs global
- [ ] Robber pair DP
- [ ] Right view code
- [ ] Top view HD map

### Practice roadmap

1. Easy/Med: Diameter, Max Depth, Right Side View, Top View (GFG style)
2. Medium: Maximum Path Sum, House Robber III, Binary Tree Cameras (harder greedy/DP)
3. Harder: Sum of distances in tree (reroot), Tree diameter on graph, Boundary traversal

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite global vs return |
| 3 | Dry-run diameter + right view |
| 7 | Code max path sum blind |
| 15 | Top view + robber timed |
| 30 | Explain rerooting verbally |
| 90 | Mock: path sum + views |

```text
Item: Tree DP and Views
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
