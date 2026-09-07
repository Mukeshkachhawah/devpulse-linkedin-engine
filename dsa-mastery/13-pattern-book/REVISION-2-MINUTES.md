# Pattern Book — 2-Minute Revision

## Triggers (60s)

| Trigger | Pattern |
|---|---|
| Longest/shortest substring under constraint | Window |
| 3Sum / container / palindrome ends | Two Pointers |
| Word ladder / rotting oranges | BFS |
| Course schedule | Topo |
| Accounts merge | UF |
| House robber / coins / LCS | DP |
| Koko / ship packages | BS on answer |
| Kth largest / meeting rooms II | Heap |
| Subsets / N-Queens | Backtracking |
| Word Search II | Trie + DFS |

## Templates to shadow-code (60s)

1. Window: expand R; while invalid L++  
2. Two pointers: sort; L/R move by sum  
3. BFS: queue + dist; mark on push  
4. DP: state → transition → base → answer  
5. BS answer: `while lo<hi: mid; ok? hi=mid: lo=mid+1`  
6. Heap k: min-heap size k for k largest  
7. Backtrack: choose → dfs → undo  
8. Trie: children[26] + end flag  

## One trap each

- Window: erase zero counts from map  
- DP: 0/1 knapsack reverse loop  
- BFS≠DFS for shortest hops  
- BS: avoid `lo=mid` infinite loop  
- Heap: C++ PQ is max-heap default  
- Backtrack: must unchoose  
- Trie: search needs `end`, startsWith doesn't  

**Done when:** You can name pattern + one trap + O(time) for a random LeetCode medium in ≤15s.
