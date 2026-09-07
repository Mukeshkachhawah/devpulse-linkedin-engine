# Tree Patterns

> **Goal:** See a binary tree / BST / N-ary tree and pick the right traversal or recursion shape in seconds.

---

## 1. When to Use

Use tree patterns when:

1. Input is a **tree** (binary, BST, trie-like hierarchy).  
2. You need depth, path sum, LCA, diameter, serialize, views, or BST order.  
3. Recursion on left/right (or children) naturally matches the structure.

**Kid idea:** A family tree. Questions about a person often need info from kids, then combine at the parent.

---

## 2. Recognition Cues

| Cue | Pattern |
|---|---|
| Level by level / zigzag / right side | BFS levels |
| Root-to-leaf paths / path sum | DFS backtracking |
| Height / balanced / diameter | postorder return height |
| Lowest common ancestor | recurse both sides |
| Validate BST | bounds (low, high) |
| kth smallest in BST | inorder |
| Build tree from traversals | divide & conquer indices |
| Flatten / mirror / invert | rewrite pointers |
| Max path sum any node | postorder gain |
| Serialize / deserialize | preorder + null markers |
| Next right pointers | BFS or clever links |

---

## 3. Template Skeletons (C++)

### A. DFS Recursion Shell

```cpp
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Height
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}
```

### B. BFS Level Order

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    if (!root) return ans;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* u = q.front(); q.pop();
            level.push_back(u->val);
            if (u->left) q.push(u->left);
            if (u->right) q.push(u->right);
        }
        ans.push_back(level);
    }
    return ans;
}
```

### C. Path Sum (root to leaf) Backtracking

```cpp
bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    if (!root->left && !root->right) return root->val == target;
    return hasPathSum(root->left, target - root->val)
        || hasPathSum(root->right, target - root->val);
}
```

### D. Diameter (postorder)

```cpp
int diameter = 0;
int depth(TreeNode* node) {
    if (!node) return 0;
    int L = depth(node->left), R = depth(node->right);
    diameter = max(diameter, L + R); // edges through node
    return 1 + max(L, R);
}
int diameterOfBinaryTree(TreeNode* root) {
    depth(root);
    return diameter;
}
```

### E. Validate BST with Bounds

```cpp
bool valid(TreeNode* node, long long lo, long long hi) {
    if (!node) return true;
    if (node->val <= lo || node->val >= hi) return false;
    return valid(node->left, lo, node->val)
        && valid(node->right, node->val, hi);
}
bool isValidBST(TreeNode* root) {
    return valid(root, LLONG_MIN, LLONG_MAX);
}
```

### F. LCA Binary Tree

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* L = lowestCommonAncestor(root->left, p, q);
    TreeNode* R = lowestCommonAncestor(root->right, p, q);
    if (L && R) return root;
    return L ? L : R;
}
```

### G. BST Inorder kth

```cpp
int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    while (true) {
        while (root) { st.push(root); root = root->left; }
        root = st.top(); st.pop();
        if (--k == 0) return root->val;
        root = root->right;
    }
}
```

### H. Max Path Sum (any to any)

```cpp
int best = INT_MIN;
int gain(TreeNode* node) {
    if (!node) return 0;
    int L = max(0, gain(node->left));
    int R = max(0, gain(node->right));
    best = max(best, node->val + L + R);
    return node->val + max(L, R); // continue upward one side
}
int maxPathSum(TreeNode* root) {
    gain(root);
    return best;
}
```

---

## 4. Common Variants

| Variant | What to return from recursion |
|---|---|
| Height / balanced | height; flag imbalance |
| Diameter | height; update L+R |
| Path sum count | prefix map + DFS |
| BST insert/delete | standard BST rules |
| Build from pre+in | root + split ranges |
| Morris traversal | O(1) space threading |
| Vertical / boundary | BFS with col index |
| N-ary | loop children |

---

## 5. Traps

1. **BST validate by only checking parent-child** — misses deeper violations. Use bounds.  
2. **Null children** forgotten in serialize/deserialize.  
3. **Diameter nodes vs edges** — clarify definition.  
4. **Max path sum:** clamping negative child gains with `max(0, ...)`.  
5. **Modifying tree** without saving pointers.  
6. **Recursion depth** on skewed trees — iterative alternative.  
7. **Inorder assumes BST** — not for general binary trees when searching order.  
8. **LCA when nodes may not exist** — problem constraints matter.

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Preorder always" | Wrong combine order | Postorder when need kids first |
| "Check left < root < right only" | Invalid deeper BST | Bounds propagate |
| "BFS for every path problem" | Awkward | DFS/backtrack for paths |
| "Diameter = 2 * height" | Not always | Track L+R at every node |
| "Global answer without return" | Messy transitions | Return upward info; update global |

---

## 7. Decision Mini-Tree

```text
Tree problem?
├─ Level / view / zigzag → BFS by size
├─ Need kids before parent → Postorder DFS
├─ Root-to-leaf / collect path → DFS + path list
├─ BST order / kth → Inorder
├─ Validate BST → Bounds DFS
├─ LCA → Split left/right search
├─ Diameter / max path → Postorder + global
└─ Rebuild → Divide & conquer on arrays
```

---

## 8. Example Problems

1. Binary Tree Level Order Traversal  
2. Maximum Depth of Binary Tree  
3. Diameter of Binary Tree  
4. Binary Tree Maximum Path Sum  
5. Validate Binary Search Tree  
6. Lowest Common Ancestor of a Binary Tree  
7. Path Sum / Path Sum II / III  
8. Serialize and Deserialize Binary Tree  
9. Construct Binary Tree from Preorder and Inorder  
10. Kth Smallest Element in a BST  
11. Binary Tree Right Side View  
12. Flatten Binary Tree to Linked List  
13. Invert Binary Tree  
14. Count Complete Tree Nodes  
15. Binary Tree Zigzag Level Order Traversal  

---

## 9. Complexity

Most DFS/BFS tree problems: **O(n)** time, **O(h)** stack / **O(w)** queue space (h height, w width).

---

## 10. Interview Script

> "I'll do a postorder DFS. Each node returns the best gain I can still take upward. While doing that I update a global best that can bend through both children."

---

## Revision Checklist

- [ ] Preorder / inorder / postorder purposes clear  
- [ ] BFS level template cold  
- [ ] BST bounds + LCA + diameter templates  
- [ ] Max path sum gain pattern  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 2 DFS + 1 BFS + 1 BST weekly.
