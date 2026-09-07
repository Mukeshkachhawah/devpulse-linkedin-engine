# Graphs — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

Explain to a wall / rubber duck:

1. Build undirected weighted adj list; memory for n=1e5
2. BFS vs DFS roles; multi-source BFS
3. Kahn topo + directed 3-color cycle
4. **Shortest-path decision tree** (unweighted / 0-1 / neg / Dijkstra / Floyd / DAG)
5. Kruskal + DSU; why MST ≠ Dijkstra tree
6. State-graph modeling sentence

## Block B — Dry Runs (4 min)

### 1) BFS distances

Small undirected graph from memory — list dist from 0.

### 2) Kahn

Edges `0→1,0→2,1→3,2→3` then add `3→1` — show cycle detection.

### 3) Dijkstra

`0→1:4, 0→2:1, 2→1:2, 1→3:1` — dist[3] and path.

### 4) Kruskal / DSU

Edges weights 1,2,2,3 on 4 nodes — which edge skipped?

### 5) State

Explain why `(r,c)` visited alone fails when keys exist.

## Block C — Code From Memory (3 min)

Pick **two**:

```text
[ ] BFS dist template
[ ] Kahn topo
[ ] Dijkstra with stale skip
[ ] DSU find/unite
[ ] Bipartite 2-color
[ ] Bellman-Ford extra round check
```

If stuck > 60s, peek, close, rewrite immediately.

## Interview Spitfire (30s each)

Google / Amazon / Microsoft / OpenAI style:

1. Give a negative-edge Dijkstra counterexample idea.
2. When Floyd over n× Dijkstra?
3. Lex smallest topo — how?
4. Bridges: say the `low[v] > tin[u]` rule.

## Reset Rule

Miss a dry run or code → mark topic **Needs Revision**, next due = Day 1 schedule.

## Link Back

- Lessons: `graph-basics-representations.md`, `bfs-dfs.md`, `topo-sort-cycle-detection.md`, `shortest-path.md`, `mst-union-find.md`, `advanced-graph-patterns.md`
- Pocket: `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
