# Trees — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Hierarchy / binary tree problem?
  ├─ Visit order / serialize / levels → Traversals (DFS timing or BFS)
  ├─ Ordered keys, inorder sorted → BST / std::set
  ├─ Repeated min/max / top-K / Dijkstra → Heap PQ
  ├─ Prefix / autocomplete / XOR bits → Trie / bit trie
  └─ Subtree combine / diameter / views → Tree DP / HD-depth views

Need sorted dynamic set with erase by value? → set/multiset
Need only extreme priority? → priority_queue
Exact word membership only? → hash set
```

---

## Traversal Templates

```cpp
// Preorder: root, left, right
// Inorder:  left, root, right
// Postorder: left, right, root

void dfs(TreeNode* n) {
    if (!n) return;
    // pre
    dfs(n->left);
    // in
    dfs(n->right);
    // post
}

// BFS by levels
queue<TreeNode*> q; q.push(root);
while (!q.empty()) {
    int sz = q.size();
    for (int i = 0; i < sz; i++) {
        auto* cur = q.front(); q.pop();
        if (cur->left) q.push(cur->left);
        if (cur->right) q.push(cur->right);
    }
}
```

---

## BST Essentials

```text
All in left subtree < node < all in right
Validate: ok(n, lo, hi) with long long bounds
LCA: walk until split
Kth: inorder count
Delete 2 kids: copy successor, delete successor
```

```cpp
bool ok(TreeNode* n, long long lo, long long hi) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return ok(n->left, lo, n->val) && ok(n->right, n->val, hi);
}
```

---

## Heap / PQ

```text
parent=(i-1)/2  left=2i+1  right=2i+2
K largest → min-heap size K
K smallest → max-heap size K
C++ default priority_queue = max-heap
Min-heap: priority_queue<T, vector<T>, greater<T>>
Dijkstra: min-heap + skip stale dist
```

```cpp
priority_queue<int, vector<int>, greater<int>> minH;
```

---

## Trie

```cpp
struct Node { Node* next[26]{}; bool end=false; };

void insert(Node* r, const string& s) {
    for (char ch : s) {
        int i = ch - 'a';
        if (!r->next[i]) r->next[i] = new Node();
        r = r->next[i];
    }
    r->end = true;
}
// search: walk + require end
// startsWith: walk only
```

Bit trie: from bit 31→0; for max XOR prefer opposite bit child.

---

## Tree DP Nuggets

```text
Diameter: at node cand = Lh + Rh; return 1+max(Lh,Rh)
Max path: global = L+val+R; return val+max(L,R) with L,R = max(0, child)
Robber: (rob, skip) pairs
Right view: last in each BFS level
Top view: map HD → first BFS node
```

```cpp
int dfs(TreeNode* n, int& best) {
    if (!n) return 0;
    int L = max(0, dfs(n->left, best));
    int R = max(0, dfs(n->right, best));
    best = max(best, L + n->val + R);
    return n->val + max(L, R);
}
```

---

## Complexity Pocket

| Structure | Typical |
|---|---|
| Traverse | O(n) time, O(h)/O(w) space |
| BST op | O(h) |
| Heap push/pop | O(log n) |
| Trie op | O(L) |
| Tree DP | O(n) |

---

## Interview Phrases

```text
"I'll clarify node vs edge counting / duplicate policy first."
"Time O(n) to touch each node; space is height or width."
"Heap gives extremes, BST gives order, trie gives prefixes."
```

---

## Spaced Repetition Hook

```text
Items: Traversals | BST | Heap | Trie | TreeDP/Views
Cadence: +1 +3 +7 +15 +30 +90
```
