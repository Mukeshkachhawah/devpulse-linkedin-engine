# Binary Tree Traversals — Core Lesson

**Module:** 06-trees  
**Level target:** L4  
**Prerequisite:** recursion, call stack, arrays/vectors  
**Memory picture:** A family tree — parent in the middle, kids below. Traversal = the order you visit each person.

> Previous: Hashing. Next: BST.

---

## 1. What is it?

A **binary tree** is a structure where each node has at most **two children**: left and right.

**Traversal** means visiting every node in a defined order and doing work (print, collect, check).

Main orders:

| Name | Order rule |
|---|---|
| Preorder | Root → Left → Right |
| Inorder | Left → Root → Right |
| Postorder | Left → Right → Root |
| Level-order (BFS) | Top to bottom, left to right by levels |

New words:

- **Node** — one box with a value and child links.
- **Root** — the top node (no parent).
- **Leaf** — a node with no children.
- **Subtree** — a node plus everything below it.
- **Height / depth** — how many edges from root to deepest leaf (definitions vary by ±1; pick one and stay consistent).

---

## 2. Explain like I am 10

Imagine a tournament bracket drawn as a tree.

- **Preorder:** announce the winner first, then talk about the left half, then the right half.
- **Inorder:** finish the left half story, say the middle name, then the right half. (On a BST this gives sorted order — later lesson.)
- **Postorder:** finish both kids’ stories, then say the parent. Like packing boxes: pack children first, then the big box.
- **Level-order:** walk floor by floor in a building — everyone on floor 1, then floor 2.

**Memory picture:**

```text
        Root
       /    \
     Left   Right

Pre:  Root, then Left tree, then Right tree
In:   Left tree, then Root, then Right tree
Post: Left tree, then Right tree, then Root
BFS:  level 0, level 1, level 2, ...
```

---

## 3. Real life story

A company org chart:

```text
           CEO
         /     \
      Eng      Sales
     /   \       |
   FE    BE     AE
```

- Preorder: announce bosses before teams (emit structure top-down).
- Postorder: compute salary totals bottom-up (need kids’ sums before parent).
- Level-order: send an email level by level (broadcast by seniority band).

File systems, HTML DOM, and AI decision trees all use the same idea.

---

## 4. Why does this exist?

Trees store hierarchical data. Flat arrays do not show “parent of” clearly. Algorithms need a **systematic visit order** so you never miss a node and you know when a node’s children are ready (postorder) or when you first see a node (preorder).

Without a shared language for orders, interview code becomes “I walked somehow” — not acceptable at top companies.

---

## 5. What problem existed before this?

People stored hierarchical data in nested arrays or ad-hoc parent pointers and wrote one-off loops. Bugs were common: missed leaves, infinite loops on cycles (when data was secretly a graph), wrong order for deletion (must delete children before parent in some systems).

Naming preorder / inorder / postorder / BFS gave a shared toolbox.

---

## 6. What happens without it?

1. You cannot solve “serialize / deserialize tree,” “flatten tree,” “compute diameter,” “right side view.”
2. You confuse DFS stack with BFS queue and get wrong answers.
3. You claim O(1) space but recursion uses O(height) stack.
4. You fail follow-ups: “do it iteratively,” “Morris traversal,” “zigzag level order.”

```text
No clear traversal
      ↓
miss nodes OR visit twice
      ↓
wrong aggregates / wrong views
```

---

## 7. How did people invent this?

Tree walks come from compiler design (expression trees: inorder prints infix; postorder evaluates RPN) and from graph DFS/BFS research. Binary trees are the interview-friendly special case of general trees.

Classic inventions that stuck in interviews:

- Recursive DFS templates (pre/in/post)
- Queue-based level order (BFS)
- Iterative stack versions for recursion-averse environments
- Morris traversal (threaded trees) for O(1) extra space inorder

---

## 8. Computer intuition

Each node is a struct in memory:

```text
Node { val, left*, right* }
```

**Recursive DFS:** call stack remembers the path from root to current node.

**Iterative DFS:** you push nodes on an explicit `stack`.

**BFS:** you push nodes on a `queue`; pop front = next to visit.

```text
MEMORY — level order of tree:

        1
       / \
      2   3
     / \
    4   5

queue: [1]
visit 1, push 2,3 → [2,3]
visit 2, push 4,5 → [3,4,5]
visit 3 → [4,5]
visit 4 → [5]
visit 5 → []
order: 1,2,3,4,5
```

---

## 9. Mathematical intuition

A binary tree with `n` nodes has `n-1` edges (if connected as a tree). Visiting each node once → **Θ(n)** time for any full traversal.

Space:

- Recursion / stack DFS: O(h) where h = height. Worst h = n (skewed). Best h ≈ log n (balanced).
- BFS queue: O(w) where w = max width. Worst ≈ n/2 on last level of a perfect tree → O(n).

Number of binary tree shapes is Catalan-related; interviews rarely need the formula, but knowing “skewed vs balanced changes space” is required.

---

## 10. Step-by-step working

**Recursive template (all three DFS):**

1. If `node == nullptr`, return (base).
2. Preorder work: process `node` **before** children.
3. Recurse left.
4. Inorder work: process `node` **between** left and right.
5. Recurse right.
6. Postorder work: process `node` **after** children.

**BFS template:**

1. If root null, done.
2. Queue ← root.
3. While queue not empty: pop front, process, push left then right if exist.
4. Optional: process by levels using `sz = queue.size()` at start of each round.

---

## 11. Dry run

Tree:

```text
        1
       / \
      2   3
     / \
    4   5
```

| Order | Result |
|---|---|
| Preorder | 1, 2, 4, 5, 3 |
| Inorder | 4, 2, 5, 1, 3 |
| Postorder | 4, 5, 2, 3, 1 |
| Level-order | 1, 2, 3, 4, 5 |

Call stack snapshot for **inorder** when visiting 5:

```text
| inorder(5) |  ← processing leaf
| inorder(2) |  ← left done, root 2 done, in right
| inorder(1) |  ← still in left subtree of 1
```

---

## 12. Visualization

```text
PREORDER walk (root first)
1 → go left → 2 → go left → 4 (leaf)
                → go right → 5 (leaf)
     → go right → 3

POSTORDER (root last) — think "delete safely"
finish 4, finish 5, finish 2, finish 3, finish 1

BFS floors:
Level 0: 1
Level 1: 2 3
Level 2: 4 5
```

```text
SKEWED vs BALANCED (space)

Skewed:          Balanced:
1                  2
 \                / \
  2              1   3
   \
    3
h=n stack        h=log n stack
```

---

## 13. Complexity

| Algorithm | Time | Extra space |
|---|---|---|
| Recursive pre/in/post | O(n) | O(h) stack |
| Iterative stack DFS | O(n) | O(h) |
| BFS level-order | O(n) | O(w) ≤ O(n) |
| Morris inorder | O(n) | O(1) (modifies links temporarily) |

---

## 14. Why this complexity?

Each node is pushed/popped a constant number of times. Edges are followed a constant number of times. No nested “for each node, scan all nodes” — so linear time.

Space is the **frontier** of unfinished nodes (stack path or queue width), not “I used no vector so O(1).”

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

void preorder(TreeNode* n, vector<int>& out) {
    if (!n) return;
    out.push_back(n->val);
    preorder(n->left, out);
    preorder(n->right, out);
}

void inorder(TreeNode* n, vector<int>& out) {
    if (!n) return;
    inorder(n->left, out);
    out.push_back(n->val);
    inorder(n->right, out);
}

void postorder(TreeNode* n, vector<int>& out) {
    if (!n) return;
    postorder(n->left, out);
    postorder(n->right, out);
    out.push_back(n->val);
}

vector<int> levelOrder(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* cur = q.front(); q.pop();
        out.push_back(cur->val);
        if (cur->left) q.push(cur->left);
        if (cur->right) q.push(cur->right);
    }
    return out;
}

vector<vector<int>> levelOrderByLevels(TreeNode* root) {
    vector<vector<int>> ans;
    if (!root) return ans;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* cur = q.front(); q.pop();
            level.push_back(cur->val);
            if (cur->left) q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }
        ans.push_back(level);
    }
    return ans;
}

// Iterative inorder
vector<int> inorderIter(TreeNode* root) {
    vector<int> out;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) {
            st.push(cur);
            cur = cur->left;
        }
        cur = st.top(); st.pop();
        out.push_back(cur->val);
        cur = cur->right;
    }
    return out;
}
```

---

## 16. STL usage

| Need | STL |
|---|---|
| BFS | `queue<TreeNode*>` |
| Iterative DFS | `stack<TreeNode*>` |
| Collect answers | `vector<int>` / `vector<vector<int>>` |
| Zigzag levels | `deque` or reverse every other level vector |

Do **not** use `priority_queue` for normal tree traversal — that is heap thinking.

Prefer raw pointers in interviews unless the problem gives `unique_ptr` / shared ownership (rare).

---

## 17. Brute Force

“Brute” for traversal is still O(n) — you must visit all nodes. The weak version is:

- Wrong order that forces re-scanning
- Building a full parent map + scanning all nodes repeatedly for views
- Converting tree to array of all paths without need → extra O(n²) memory on skewed cases

Example of a weak approach for “max depth”: for every node, walk to root counting — O(n²) if done naively with parent links.

---

## 18. Better

Single DFS or BFS that computes what you need in one pass:

- Max depth: `1 + max(left, right)` postorder style
- Level averages: BFS with level sizes
- Serialize: preorder with null markers

Better = correct order + one pass + O(h) or O(w) space.

---

## 19. Optimal

For standard traversal problems, **O(n) time, O(h) or O(w) space** is optimal in the comparison model (must read every node).

Space-optimal inorder: Morris O(1) extra — mention if interviewer asks “can you do O(1) space?” Know the idea: temporarily thread `right` of predecessor to current, then undo.

Interview default optimal: clean recursive or iterative templates above.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Inorder always prints sorted values."
  ↓
Fails: only true for BST, not arbitrary binary trees
  ↓
Correct: Inorder = left, root, right. Sorted only if BST property holds

Wrong: "BFS uses recursion."
  ↓
Fails: recursion is DFS-shaped (call stack)
  ↓
Correct: BFS uses an explicit queue

Wrong: "I used no array so space is O(1)."
  ↓
Fails: recursion depth / queue can be O(n)
  ↓
Correct: Always report stack or queue space

Wrong: "Preorder and DFS are different things."
  ↓
Fails: Preorder is one DFS visit-timing
  ↓
Correct: DFS family = pre/in/post; BFS = level-order
```

---

## 21. Common mistakes

1. Forgetting null base case → crash.
2. Pushing null children into queue without checks → null deref.
3. Mixing visit timing (processing root in wrong place).
4. Off-by-one height: empty tree height 0 vs -1 — agree with problem statement.
5. Modifying tree during traversal accidentally.
6. Using `==` on floating data in average problems without care.
7. Zigzag: reversing the vector but still pushing children left-to-right inconsistently (push order can stay L→R if you reverse output).

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Implement inorder iterative. Why does the inner while go left?”  
**Expected:** Simulate recursion: go to leftmost, process, then move to right subtree.

### Amazon
**Ask:** “Level-order; return list of levels. Edge cases?”  
**Expected:** Empty tree; single node; skewed tree; use `sz = q.size()`.

### Microsoft
**Ask:** “Serialize and deserialize a binary tree.”  
**Expected:** Preorder + null markers, or BFS with nulls; explain round-trip.

### OpenAI
**Ask:** “When prefer BFS vs DFS?”  
**Expected:** BFS for shortest path in unweighted tree/graph levels / views by depth; DFS for path aggregates, LCA structure, subtree DP.

**Interview phrase:**

```text
"I'll do a DFS with clear visit timing — pre/in/post —
or BFS with a queue if I need levels. Time O(n), space O(height) or O(width)."
```

---

## 23. Company use cases

| Company-style system | Traversal |
|---|---|
| Google File System metadata | DFS for subtree ops |
| Amazon category trees | BFS for “show next level” UI |
| Microsoft Excel dependency / DOM-like trees | Postorder evaluate |
| OpenAI tokenizer / AST tools | Preorder/postorder on expression trees |
| Org charts / permissions | DFS inheritance, BFS notifications |

---

## 24. Related concepts + pattern recognition cues

**Related:** BST inorder sorted, tree DP (postorder), LCA, heap (shape + array index), graphs (trees are acyclic connected graphs).

| Cue | Tool |
|---|---|
| Need values left-to-right sorted in BST | Inorder |
| Copy / serialize structure top-down | Preorder |
| Delete / compute from children | Postorder |
| Level, view, zigzag, width | BFS |
| Path root→leaf conditions | DFS + backtrack |
| Diameter / max path sum | Tree DP postorder |

**Decision snack:**

```text
Need floors? → BFS
Need subtree answer before parent? → Postorder
Need BST sorted walk? → Inorder
Need reconstruct from traversal? → often Preorder + Inorder (or Post + In)
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Tree = parent with ≤2 kids
Pre = me first | In = me middle | Post = me last
BFS = elevator floors (queue)
Space = height or width — never "free"
```

### Checklist

- [ ] Draw pre/in/post/BFS on a 5-node tree from memory
- [ ] Code recursive all three + BFS levels
- [ ] Code iterative inorder
- [ ] Explain space for skewed vs balanced
- [ ] Know when Morris is asked

### Practice roadmap

1. Easy: Binary Tree Inorder/Preorder/Postorder Traversal, Max Depth, Same Tree, Symmetric Tree
2. Medium: Level Order, Zigzag, Validate BST (uses inorder), Construct from Pre+In, Flatten Binary Tree
3. Harder: Serialize/Deserialize, Morris follow-up, Boundary Traversal variants

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite 4 orders + picture |
| 3 | Dry-run iterative inorder on paper |
| 7 | Code BFS by levels blind |
| 15 | Timed: construct tree from traversals |
| 30 | Teach postorder vs BFS to a friend |
| 90 | Mock: serialize + zigzag |

```text
Item: Binary Tree Traversals
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
