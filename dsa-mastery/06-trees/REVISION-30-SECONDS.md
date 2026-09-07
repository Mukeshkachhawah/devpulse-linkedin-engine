# Trees — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Binary tree = parent with ≤ 2 kids
Pre = me first | In = me middle | Post = me last
BFS = elevator floors (queue)
BST = left all smaller, right all larger (whole subtree)
Heap = pyramid extreme at tip (array complete tree)
Trie = shared hallways for shared prefixes
Tree DP = kids report first, parent combines
Views = camera by depth or horizontal distance
```

## One-Liners

| Topic | One line |
|---|---|
| Traversals | Visit timing + BFS levels; space = height or width |
| BST | Inorder sorted; ops O(h); validate with ranges |
| Heap / PQ | Push/pop O(log n); K largest → min-heap size K |
| Trie | O(L) insert/search/prefix; mark isEnd |
| Tree DP | Global bent path vs upward straight gain |
| Views | Right = last per level; Top = first per HD |

## Complexity Snap

```text
Traverse all nodes                 O(n)
BST / heap op                      O(h) or O(log n)
Trie op                            O(L)
Build heap                         O(n)
Top-K stream                       O(n log K)
```

## Trap of the Day

```text
Inorder sorted ONLY for BST — not every binary tree
Validate BST needs ranges — parent-child checks lie
C++ priority_queue default = MAX-heap
startsWith ≠ search (end marker)
Diameter ≠ always through root
```

## Pass / Fail

If you cannot say the flash card without peeking → reopen the weak lesson for 5 minutes, then retry.
