# Pattern Book Cheatsheet

## Instant Map

| Pattern | One-liner | Core complexity |
|---|---|---|
| Two Pointers | Move ends / slow-fast by rule | O(n) |
| Sliding Window | Expand R, shrink L | O(n) |
| Binary Search | Halve mono space | O(log n) / O(n log R) |
| BFS | Unweighted shortest / levels | O(V+E) |
| DFS | Explore / components / tree | O(V+E) |
| Topo | Kahn indegree queue | O(V+E) |
| Union-Find | Merge + find | ~O(α n) |
| Dijkstra | Weighted shortest ≥0 | O((V+E) log V) |
| DP | State + transition | #states × work |
| Heap | Repeated min/max / top-k | O(log n) ops |
| Backtracking | Choose / undo | Exponential pruned |
| Trie | Prefix tree | O(L) per word |
| Greedy | Sort + local best | Usually O(n log n) |
| Monotonic Stack | Next greater/smaller | O(n) |

## Code Micro-Templates

```cpp
// Window maximize
for (int R = 0; R < n; ++R) {
    add(a[R]);
    while (!ok()) remove(a[L++]);
    ans = max(ans, R - L + 1);
}

// Two pointers sum
while (L < R) {
    long long s = a[L] + a[R];
    if (s == t) ...;
    else if (s < t) ++L; else --R;
}

// BS on answer
while (lo < hi) {
    auto mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid; else lo = mid + 1;
}

// BFS
q.push(src); dist[src] = 0;
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) if (dist[v] < 0) {
        dist[v] = dist[u] + 1; q.push(v);
    }
}

// Heap kth largest
priority_queue<int, vector<int>, greater<int>> h;
for (int x : a) { h.push(x); if ((int)h.size() > k) h.pop(); }

// Backtrack
path.push_back(x); dfs(next); path.pop_back();
```

## Contiguous vs Not

- Contiguous → Window / Kadane / Prefix  
- Subsequence → DP  
- Subset sum → Knapsack DP  

## Shortest Path Pick

- Unit weight → BFS  
- ≥0 weights → Dijkstra  
- Negative → Bellman-Ford  

## Top Interview Traps

1. Wrong pattern for contiguous vs subsequence  
2. DFS used as shortest hops  
3. Infinite binary search loop  
4. Forget undo in backtracking  
5. Max-heap vs min-heap mixup  
6. 0/1 vs unbounded knapsack loop direction  

## File Index

- `two-pointer-patterns.md`  
- `sliding-window-patterns.md`  
- `dp-patterns.md`  
- `graph-patterns.md`  
- `tree-patterns.md`  
- `binary-search-patterns.md`  
- `heap-patterns.md`  
- `backtracking-patterns.md`  
- `trie-patterns.md`  
- `pattern-recognition-guide.md`  
- `algorithm-decision-trees.md`  

## Pre-Interview

30s: `REVISION-30-SECONDS.md`  
2m: `REVISION-2-MINUTES.md`  
10m: `REVISION-10-MINUTES.md`
