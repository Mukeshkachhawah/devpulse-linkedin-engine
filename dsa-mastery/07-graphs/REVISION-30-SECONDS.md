# Graphs — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Graph = cities + roads (list default, matrix if small n)
BFS = ripples / fewest edges | DFS = deep maze
Topo = peel indegree 0 on DAG | Gray edge = directed cycle
Shortest: unweighted BFS → 0/1 deque → w≥0 Dijkstra → neg Bellman-Ford → all-pairs Floyd
MST = cheap cables no loop (Kruskal+DSU / Prim) ≠ shortest path tree
Advanced = model STATE then reuse BFS/Dijkstra
```

## One-Liners

| Topic | One line |
|---|---|
| Representation | Sparse → adj list; undirected store both ways |
| BFS/DFS | O(n+m); mark visited |
| Topo / cycle | Kahn size==n; directed cycle to GRAY |
| Shortest | Classify weights first (decision tree) |
| MST / DSU | Sort edges + unite if different parents |
| Advanced | Node may be (pos, mask, …) |

## Complexity Snap

```text
Traverse / topo / bipartite / SCC     O(n+m)
Dijkstra (bin heap)                   O((n+m) log n)
Bellman-Ford                          O(nm)
Floyd                                 O(n³)
Kruskal                               O(m log m)
```

## Trap of the Day

```text
Dijkstra + negative edge → WA
BFS ≠ shortest when weights differ
MST path ≠ shortest path
Visited cell alone fails key/fuel problems
Topo is for directed DAGs only
```

## Pass / Fail

If you cannot say the flash card without peeking → reopen the weak lesson for 5 minutes, then retry.
