# Trees — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

Explain to a wall / rubber duck:

1. Four traversals + when to pick each
2. BST property, validate counterexample (4 under 6 under 5), delete with 2 kids
3. Heap array indexing + why top-K uses opposite heap
4. Trie insert/search/startsWith difference
5. Tree DP: diameter + max path sum “global vs return”

## Block B — Dry Runs (4 min)

Do on paper:

### 1) Traversals

```text
      1
     / \
    2   3
   / \
  4   5
```

Write pre, in, post, level-order.

### 2) BST

Insert `5,2,7,1,3` — draw. Find kth smallest k=4.

### 3) Heap top-K

`[3,1,5,12,2,11]`, K=3 — show min-heap states.

### 4) Trie

Insert `app`, `apple`, `apt`. Result of `search("app")`, `startsWith("ap")`, `search("ap")`.

### 5) Views / DP

Right view of tree in (1). Diameter in edges.

## Block C — Code From Memory (3 min)

Pick **two** and type without looking:

```text
[ ] BFS level order by levels
[ ] Validate BST (range DFS)
[ ] Iterative inorder
[ ] Trie class (insert/search/startsWith)
[ ] Right side view
[ ] Diameter height DFS
```

If stuck > 60s, peek the lesson, close it, rewrite immediately.

## Interview Spitfire (30s each)

Answer as if Google / Amazon / Microsoft / OpenAI:

1. When is a heap better than `std::set`?
2. Why parent-only BST checks fail?
3. Word Search II — why a trie?
4. Max path sum — why `max(0, child)`?

## Reset Rule

Miss a dry run or code → mark topic **Needs Revision**, next due = Day 1 schedule.

## Link Back

- Lessons: `binary-tree-traversals.md`, `bst.md`, `heap-priority-queue.md`, `trie.md`, `tree-dp-and-views.md`
- Pocket: `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
