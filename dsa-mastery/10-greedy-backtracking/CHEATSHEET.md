# Greedy & Backtracking Cheatsheet

---

## Greedy Triggers

```text
max non-overlapping intervals → sort by end, take compatible
can jump to end → farthest reach
fractional knapsack → density
merge files / Huffman → always two best (heap)
gas station → tank + restart index
```

```cpp
sort(a.begin(), a.end(), [](auto& x, auto& y){ return x.second < y.second; });
int cnt=0, last=INT_MIN;
for (auto [s,e]: a) if (s>=last){ ++cnt; last=e; }
```

**Kill greedy:** find counterexample → go DP/BT.

---

## Backtracking Template

```cpp
void dfs(...) {
    if (goal) { ans.push_back(path); return; } // or return true
    for (choice : choices) {
        if (!valid(choice)) continue;
        apply(choice);          // choose
        dfs(...);               // explore
        revert(choice);         // unchoose
    }
}
```

| Problem | State tip |
|---|---|
| N-Queens | row; col/diag marks |
| Sudoku | next empty cell |
| Word search | (i,j,k) + mark cell |

---

## Subset / Comb / Perm

| | Subset | Combination | Permutation |
|---|---|---|---|
| Order | no | no | yes |
| Tool | take/skip or bitmask | `for i=start..` | `used[]` |
| Next call | `i+1` | `i+1` | any unused |

```cpp
// reuse allowed (comb sum):  dfs(i, left-a[i])
// one use:                  dfs(i+1, left-a[i])

// dup skip (sorted):
// combs: if (i>start && a[i]==a[i-1]) continue;
// perms: if (i>0 && a[i]==a[i-1] && !used[i-1]) continue;
```

Bitmask subsets: `for (mask=0; mask<1<<n; ++mask)`.

---

## Complexity Gut

| | Time |
|---|---|
| Greedy sort-scan | O(n log n) |
| Subsets | O(2ⁿ·n) |
| Perms | O(n!·n) |
| N-Queens | ~n! pruned |

n≤20 subsets; n≤10–11 perms typical.

---

## Interview Lines

- “Greedy key is … Exchange idea is …”
- “Backtracking: choose, explore, unchoose; prune when …”
- “Order doesn’t matter so I use start index, not used[] .”
- “Unlimited reuse → recurse on `i`; one-shot → `i+1`.”
