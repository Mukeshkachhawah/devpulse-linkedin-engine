# Graphs — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. Adj list vs matrix — when each?
2. Why BFS gives fewest edges?
3. Kahn: what proves a cycle?
4. Why Dijkstra needs non-negative weights?
5. MST vs shortest-path tree — one sentence each.
6. DSU: what do find + path compression do?
7. What belongs in a “state” for a keys maze?

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Unweighted shortest              → BFS
0/1 weights                      → deque BFS
w ≥ 0 single source              → Dijkstra
Negatives / neg cycle            → Bellman-Ford
All-pairs small n                → Floyd
Prerequisites order              → Topo (Kahn/DFS)
Min cable connect all            → MST
Same component merges            → DSU
Keys / fuel / K stops            → State or layered graph
Odd cycle / two teams            → Bipartite 2-color
```

Traps to name:

```text
Mark BFS visited on push
Gray vs Black for directed cycles
Floyd loop order k,i,j
Kruskal skip same-component edges
Don't use Dijkstra for MST goal
```

## Quick Dry-Run (optional if time)

Edges `0→1:4, 0→2:1, 2→1:2` — Dijkstra dist to 1 from 0.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 defs + cues | Solid — do a problem |
| Missed 1–2 | Skim that lesson section 20 |
| Missed 3+ | Re-read flash pictures; schedule Day 1 reset |

## Next

Open `REVISION-10-MINUTES.md` on Day 7/15 style deep recall days.
