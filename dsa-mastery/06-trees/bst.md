# Binary Search Tree (BST) — Core Lesson

**Module:** 06-trees  
**Level target:** L4–L5  
**Prerequisite:** binary tree traversals, binary search idea  
**Memory picture:** A library sorted left-to-right — everything left of a book is smaller; everything right is larger.

> Previous: Binary Tree Traversals. Next: Heap / Priority Queue.

---

## 1. What is it?

A **Binary Search Tree (BST)** is a binary tree with an ordering rule:

For every node with value `x`:

- all values in the **left** subtree are **&lt; x** (or ≤ if duplicates allowed — define policy)
- all values in the **right** subtree are **&gt; x**

Search, insert, and delete can follow comparisons like binary search on a line — but the “line” is shaped as a tree.

New words:

- **BST property** — the left/right ordering invariant.
- **Successor** — next larger value (leftmost node in right subtree, or ancestor climb).
- **Predecessor** — next smaller value.
- **Balanced BST** — height stays O(log n) (AVL, Red-Black) — interviews often assume or ask you to discuss imbalance.

---

## 2. Explain like I am 10

You guess a number from 1 to 100. Friend says “higher” or “lower.” You always cut the range.

A BST stores numbers so each question “is it less than this node?” sends you left or right — same cutting idea, stored as a living tree.

**Memory picture:**

```text
          8
        /   \
       3     10
      / \      \
     1   6      14
        / \    /
       4   7  13

Left of 8: all < 8
Right of 8: all > 8
Inorder walk: 1,3,4,6,7,8,10,13,14  ← sorted!
```

---

## 3. Real life story

A phone contact list that stays sorted as you insert names. Each new name walks “before/after” comparisons until an empty child slot.

Databases historically used balanced BST variants (and B-trees) for indexes. In interviews, BST problems test whether you protect the invariant while mutating the tree.

---

## 4. Why does this exist?

Arrays give O(1) index but insert-in-middle is O(n). Hash maps give average O(1) but no ordered walk. BST aims for:

- ordered data
- logarithmic search/insert/delete when balanced
- inorder = sorted sequence without an extra sort

---

## 5. What problem existed before this?

Sorted arrays: search O(log n), insert O(n). Unsorted lists: search O(n). People wanted both “keep sorted” and “update often.” Trees with the BST rule were the answer (later balanced to stop worst-case sticks).

---

## 6. What happens without it?

1. You sort after every insert — too slow.
2. You use a hash set and cannot answer “next larger,” range queries, or kth smallest cleanly.
3. You build a “BST” that violates the property → binary search logic lies.
4. You ignore skew: sorted inserts create a linked list → O(n) operations.

```text
Insert 1,2,3,4,5 always right
1
 \
  2
   \
    3 ...
Height = n  → search becomes linear
```

---

## 7. How did people invent this?

Binary search on arrays is ancient. Mapping that decision tree into an explicit node structure created BSTs. Later AVL (1962) and Red-Black trees fixed height. Interview culture kept classic BST insert/delete/validate/kth because they test invariants + pointer care.

---

## 8. Computer intuition

Search for `t`:

```text
cur = root
while cur:
  if t == cur.val: found
  else if t < cur.val: cur = cur.left
  else: cur = cur.right
```

Same as binary search, but child pointers replace mid indices.

Insert: search until null link; hang new node there.

Delete cases:

1. Leaf — unlink.
2. One child — replace node by that child.
3. Two children — replace value by inorder successor (or predecessor), then delete that successor node (which has ≤1 child).

```text
DELETE 8 (two children)

      8                 10
     / \               /  \
    3  10     →       3    14
         \           / \   /
         14         1   6 13
         /             / \
       13             4   7

Successor of 8 is 10 (leftmost of right). Copy 10 up, delete old 10.
```

---

## 9. Mathematical intuition

Ideal height ≈ log₂(n+1) for a complete shape. Each comparison halves the remaining candidate set **only if** the tree is reasonably balanced.

Worst-case height Θ(n). Average for random inserts is O(log n) with high probability, but adversarial order breaks it — hence balanced BST / `std::set`.

Inorder of BST produces non-decreasing sequence — proof by induction on BST property.

Validate BST: not enough to check only parent–child. Must check full range `(low, high)` per subtree.

---

## 10. Step-by-step working

**Validate BST (range method):**

1. Call `ok(node, low, high)`.
2. Null → true.
3. If `node.val <= low` or `>= high` (policy) → false.
4. Left must be in `(low, node.val)`; right in `(node.val, high)`.

**Kth smallest:**

1. Inorder walk; count; stop at k.  
   Or maintain subtree sizes for O(h) with augmentation.

**Lowest Common Ancestor in BST:**

1. If both values &lt; node → go left.
2. If both &gt; node → go right.
3. Else current splits them → LCA.

---

## 11. Dry run

Insert sequence: `5, 2, 7, 1, 3`

```text
5
→ 2 left of 5
→ 7 right of 5
→ 1 left of 2
→ 3 right of 2

      5
     / \
    2   7
   / \
  1   3
```

Search 3: 5→2→3 found. Comparisons: 3.

Validate ranges for node 2: must be in (-∞, 5); children 1 in (-∞,2), 3 in (2,5).

Kth smallest k=3: inorder 1,2,3 → answer 3.

---

## 12. Visualization

```text
BST SEARCH like binary search

target 6

        8
      /   \
     3     10     6 < 8 → left
    / \      \
   1   6      14  6 > 3 → right
      / \         6 == 6 found
     4   7
```

```text
WRONG local-only "validation"

    5
   / \
  1   6
     / \
    4   7

5's right child 6 > 5 OK, 6's left 4 < 6 OK,
BUT 4 is in right subtree of 5 and 4 < 5 → INVALID BST
Range check catches this; parent-only check misses it.
```

---

## 13. Complexity

| Op (unbalanced BST) | Average | Worst |
|---|---|---|
| Search / Insert / Delete | O(log n) | O(n) |
| Inorder walk | O(n) | O(n) |
| Validate | O(n) | O(n) |
| LCA (BST) | O(h) | O(n) |

Balanced BST (`std::set`): all basic ops O(log n) worst-case.

---

## 14. Why this complexity?

Each step moves to one child → at most h comparisons. h is log n when bushy, n when a stick. Inorder touches every node once → Θ(n).

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

TreeNode* searchBST(TreeNode* root, int t) {
    while (root && root->val != t)
        root = (t < root->val) ? root->left : root->right;
    return root;
}

TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val); // policy: >= go right
    return root;
}

bool validate(TreeNode* n, long long lo, long long hi) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return validate(n->left, lo, n->val) && validate(n->right, n->val, hi);
}
bool isValidBST(TreeNode* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}

TreeNode* minNode(TreeNode* n) {
    while (n->left) n = n->left;
    return n;
}

TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) {
            TreeNode* r = root->right;
            delete root;
            return r;
        }
        if (!root->right) {
            TreeNode* l = root->left;
            delete root;
            return l;
        }
        TreeNode* succ = minNode(root->right);
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}

int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        if (--k == 0) return cur->val;
        cur = cur->right;
    }
    return -1;
}

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    }
    return nullptr;
}
```

---

## 16. STL usage

| Need | STL |
|---|---|
| Ordered unique keys | `std::set` / `std::map` (usually Red-Black) |
| Ordered multiset | `std::multiset` |
| Policy-based order stats (GCC) | `__gnu_pbds` indexed_set (contests) |
| Hash without order | `unordered_set` — not a BST |

In interviews, implement tree nodes when asked “BST.” Use `set` when the problem is really “maintain sorted stream.”

```cpp
set<int> s;
s.insert(3);
auto it = s.lower_bound(3); // first >= 3
```

---

## 17. Brute Force

Keep a vector; sort for every query → O(n log n) per update pattern. Or scan entire tree for every search → O(n). Works for tiny n; fails interviews at n = 1e5.

---

## 18. Better

Use unsorted list + occasional sort, or heap if you only need min/max — but lose arbitrary search. Better for BST problems: correct O(h) insert/search with clear invariant checks.

---

## 19. Optimal

- Classic BST ops: O(h); state balance if needed.
- Validate: O(n) one DFS with ranges — optimal.
- Kth smallest: O(h + k) inorder or O(h) with size annotations.
- Many “design a set” problems: `std::set` is optimal enough for interviews.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Check only each parent vs its two children."
  ↓
Fails: 4 can hide under 6 under 5 while 4 < 5
  ↓
Correct: Pass allowed (low, high) ranges down

Wrong: "BST search is always O(log n)."
  ↓
Fails: skewed tree is O(n)
  ↓
Correct: O(h); say "log n if balanced"

Wrong: "Inorder of any binary tree is sorted."
  ↓
Fails: only BST
  ↓
Correct: Use sorted inorder as a BST test (strict increasing)

Wrong: "Delete two-child node by removing it and leaving a hole."
  ↓
Fails: breaks structure
  ↓
Correct: Replace with successor/predecessor, then delete that node
```

---

## 21. Common mistakes

1. Duplicate policy unclear (`<` vs `<=`).
2. Using `INT_MIN/MAX` without long long — fail on INT_MIN node values.
3. Returning bool from validate but short-circuiting wrong.
4. Deleting nodes without fixing parent links.
5. Confusing BST LCA with binary-tree LCA (parent pointers / paths).
6. Building BST from sorted array by sequential insert → skew; use mid as root recursively for balance.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Validate BST.”  
**Expected:** Range DFS or inorder previous pointer; mention the classic counterexample with 4 under 6 under 5.

### Amazon
**Ask:** “Kth smallest in BST.”  
**Expected:** Inorder count; follow-up: frequent queries → store subtree sizes.

### Microsoft
**Ask:** “Delete a node in BST — all cases.”  
**Expected:** 0/1/2 children; successor; code carefully.

### OpenAI
**Ask:** “BST vs hash set vs sorted vector — when?”  
**Expected:** Hash: average O(1) membership, no order. Sorted vector: great static search, slow insert. BST/set: ordered dynamic updates.

**Interview phrase:**

```text
"I'll preserve the BST invariant: left < node < right for whole subtrees.
Operations follow comparisons down a path — O(height)."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Database indexes (conceptual) | Ordered keys |
| Symbol tables / maps | `map` / tree map |
| Autocomplete predecessor structures | Ordered sets (tries often better for prefixes) |
| Game leaderboards (dynamic) | Order-statistic trees / policy sets |
| Range counts of keys | Augmented BST |

---

## 24. Related concepts + pattern recognition cues

**Related:** binary search, heap (different shape invariant), trie (prefix), segment tree (range), balanced trees.

| Cue | Use BST thinking? |
|---|---|
| Inorder yields sorted | Yes |
| “Next greater in stream” with deletes | `set` / BST |
| Prefix of strings | Trie, not BST |
| Always need min in O(1)/O(log) | Heap may be simpler |
| Recover swapped nodes in BST | Inorder find 1–2 inversions |

**Decision snack:**

```text
Need sorted dynamic set? → BST / std::set
Need O(1) avg lookup only? → hash
Need prefix search? → trie
Need min/max priority? → heap
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Left all smaller, right all larger (whole subtree)
Inorder = sorted
Search walks one path
Validate with ranges, not local checks
Skew kills log n — say O(height)
```

### Checklist

- [ ] Insert + search dry run
- [ ] Validate with the 5-6-4 counterexample
- [ ] Delete all three cases
- [ ] Kth smallest iterative inorder
- [ ] BST LCA in a loop

### Practice roadmap

1. Easy: Search in BST, Insert, Min distance cousins-style warmups
2. Medium: Validate BST, Kth Smallest, LCA of BST, Convert Sorted Array to BST, Delete Node
3. Harder: Recover BST, BST Iterator, Count range sums with augmented trees / ordered multiset tricks

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Draw BST + recite property |
| 3 | Dry-run delete with two children |
| 7 | Code validate + insert blind |
| 15 | Timed kth smallest + LCA |
| 30 | Compare BST vs set vs hash out loud |
| 90 | Mock: delete + recover BST |

```text
Item: BST
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
