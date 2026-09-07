# Subsets, Permutations, and Combinations

**Module:** 10-greedy-backtracking  
**Level target:** L5  
**Prerequisite:** backtracking template, recursion, sorting for duplicates  
**Memory picture:** Three different vending-machine modes — Subsets: each snack yes/no. Combinations: pick a team where order does not matter. Permutations: line people up where order matters.

---

## 1. What is it?

Three classic enumeration patterns:

| Pattern | Meaning | Count (distinct elems) |
|---|---|---|
| **Subsets** | all yes/no selections | 2ⁿ |
| **Combinations** | choose k items, order irrelevant | C(n,k) |
| **Permutations** | all orderings | n! |

In code, all use backtracking with different choice rules and index policies.

New words:

- **Start index** — for combinations/subsets-by-index: next loop begins at `start` to keep nondecreasing order.  
- **Used array** — for permutations: mark elements already in the path.  
- **Duplicate skipping** — sort; skip same value at same depth if previous identical unused/skipped.  
- **Combination sum** — combinations with target sum; may reuse numbers (unbounded style) or not.

---

## 2. Explain like I am 10

**Subsets:** For each toy, put in box or not. List every possible box.

**Combinations:** Pick 3 friends for a team. Alice-Bob-Cara is same team as Cara-Bob-Alice.

**Permutations:** Line 3 friends for a photo. Order changes the photo.

---

## 3. Real life story

Feature flags: all subsets of features for testing (2ⁿ).

Interview panels: choose k interviewers from n (combinations).

Password of distinct digits: permutations.

```text
nums [1,2,3]

Subsets: [],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]
Combs k=2: [1,2],[1,3],[2,3]
Perms: [1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]
```

---

## 4. Why does this exist?

These are the skeleton of almost every backtracking interview. If you master the three templates + duplicate rules, new prompts become “which skeleton?”

---

## 5. What problem existed before this?

Hand-written nested loops for fixed k; exploding code for variable k. Recursion unified them.

---

## 6. What happens without it?

```text
Wrong template:
  combinations generated as permutations → duplicates × k!
  reuse when not allowed → wrong multisets
No sort+skip:
  duplicate inputs create duplicate outputs
```

---

## 7. How did people invent this?

Combinatorics is ancient. CS encoding via recursion trees is standard. LeetCode culture named patterns: Subsets II, Permutations II, Combination Sum I/II/III.

---

## 8. Computer intuition

```text
SUBSETS (index DFS)

dfs(i):
  if i==n: record path; return
  // skip
  dfs(i+1)
  // take
  path.push(a[i]); dfs(i+1); path.pop()

Or loop style recording at every node.


COMBINATIONS

dfs(start):
  if path.size()==k: record; return
  for i=start..n-1:
    choose a[i]; dfs(i+1); undo


PERMUTATIONS

dfs():
  if path.size()==n: record; return
  for i=0..n-1:
    if used[i] continue
    used[i]=1; choose; dfs; undo; used[i]=0
```

---

## 9. Mathematical intuition

- Subsets: product of binary choices ⇒ 2ⁿ nodes of interest.  
- Combinations: each k-set once via sorted build.  
- Permutations: n choices × (n-1) × …  

Duplicates: if input multiset, number of distinct outputs shrinks; skipping restores uniqueness without set-hashing every path.

---

## 10. Step-by-step working

1. Ask: does **order** matter in the answer?  
   - No + any size → subsets  
   - No + size k / target → combinations  
   - Yes → permutations  
2. Ask: may we **reuse** the same index/value?  
3. Ask: does input have **duplicates**? Sort + skip.  
4. Pick template; implement undo.  
5. Analyze with output length.

**Decision table**

| Order matters? | Fixed size / target? | Reuse same element index? | Pattern |
|---|---|---|---|
| No | No | No | subsets |
| No | Yes | No | combinations |
| No | Yes | Yes (unlimited) | combination sum unbounded |
| Yes | usually all n | No | permutations |

---

## 11. Dry run

**Combinations** n=4,k=2 → `[1,2][1,3][1,4][2,3][2,4][3,4]`

**Permutations II** `a=[1,1,2]` distinct perms:  
`[1,1,2],[1,2,1],[2,1,1]` only three.

Skip rule at depth: after sorting, if `a[i]==a[i-1]` and `!used[i-1]`, skip.

**Subsets II** `a=[1,2,2]`:  
`[] [1] [1,2] [1,2,2] [2] [2,2]` — no duplicate `[1,2]` pairs wrongfully doubled.

---

## 12. Visualization

```text
COMBINATION tree n=3 k=2 (values 1,2,3)

start→ pick 1 → pick 2 ✓
              → pick 3 ✓
       pick 2 → pick 3 ✓
       pick 3 → (no)

Never pick 2 then 1 — start index prevents.


DUPLICATE SKIP (sorted [1,1,2] perms)

At a depth, first 1 OK
Second 1 only if previous 1 already used in path
(otherwise would mirror a sibling branch)
```

---

## 13. Complexity

| Pattern | Time (distinct elems) | Space |
|---|---|---|
| Subsets | O(2ⁿ · n) | O(n) |
| Combos C(n,k) | O(C(n,k)·k) | O(k) |
| Perms | O(n! · n) | O(n) |

Constraints: n≤20 subsets; n≤10–11 perms often; combos depend on C(n,k).

---

## 14. Why this complexity?

Must touch each output; each output copy costs linear in its size. Branching builds the combinatorial count.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> subsets(vector<int>& a) {
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int)> dfs = [&](int i) {
        if (i == (int)a.size()) { ans.push_back(path); return; }
        dfs(i + 1);
        path.push_back(a[i]);
        dfs(i + 1);
        path.pop_back();
    };
    dfs(0);
    return ans;
}

vector<vector<int>> permuteUnique(vector<int>& a) {
    sort(a.begin(), a.end());
    vector<vector<int>> ans;
    vector<int> path;
    vector<char> used(a.size(), 0);
    function<void()> dfs = [&]() {
        if (path.size() == a.size()) { ans.push_back(path); return; }
        for (int i = 0; i < (int)a.size(); ++i) {
            if (used[i]) continue;
            if (i > 0 && a[i] == a[i-1] && !used[i-1]) continue;
            used[i] = 1;
            path.push_back(a[i]);
            dfs();
            path.pop_back();
            used[i] = 0;
        }
    };
    dfs();
    return ans;
}

vector<vector<int>> combinationSum(vector<int>& a, int target) {
    sort(a.begin(), a.end());
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int,int)> dfs = [&](int start, int left) {
        if (left == 0) { ans.push_back(path); return; }
        for (int i = start; i < (int)a.size(); ++i) {
            if (a[i] > left) break;
            path.push_back(a[i]);
            dfs(i, left - a[i]); // reuse same index allowed
            path.pop_back();
        }
    };
    dfs(0, target);
    return ans;
}

vector<vector<int>> combinationSum2(vector<int>& a, int target) {
    sort(a.begin(), a.end());
    vector<vector<int>> ans;
    vector<int> path;
    function<void(int,int)> dfs = [&](int start, int left) {
        if (left == 0) { ans.push_back(path); return; }
        for (int i = start; i < (int)a.size(); ++i) {
            if (i > start && a[i] == a[i-1]) continue; // skip dups
            if (a[i] > left) break;
            path.push_back(a[i]);
            dfs(i + 1, left - a[i]); // no reuse index
            path.pop_back();
        }
    };
    dfs(0, target);
    return ans;
}
```

---

## 16. STL usage

- `sort` before duplicate skipping  
- `vector` path + `pop_back`  
- `function` lambdas or member DFS  
- sometimes `unordered_set` for dedupe — prefer skip logic  

---

## 17. Brute Force

Generate all perms then unique via set; generate all subsets via bitmasks `0..(1<<n)-1`.

```cpp
// bitmask subsets
for (int mask = 0; mask < (1 << n); ++mask) {
    vector<int> cur;
    for (int i = 0; i < n; ++i)
        if (mask & (1 << i)) cur.push_back(a[i]);
    ans.push_back(cur);
}
```

Great for n≤20; less flexible for pruning on sums mid-way sometimes.

---

## 18. Better

Backtracking with prune (`left < 0` / `a[i] > left` after sort) and duplicate skips.

---

## 19. Optimal

Optimal enumeration still lists all answers — cannot beat output size. Prefer:

- bitmask for simple subsets n≤20  
- BT for pruning targets  
- correct reuse (`i` vs `i+1`)

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Combinations use used[] like perms."
  Why it fails: order duplicates.
  Correct: start index forces increasing positions.

Wrong: "Combination sum always dfs(i+1)."
  Why it fails: may need reuse of same value/index.
  Correct: dfs(i) if unlimited; dfs(i+1) if one-use.

Wrong: "Hash set at the end to fix duplicates."
  Why it fails: wastes time; interviewers want skip rules.
  Correct: sort + skip identical siblings.

Wrong: "Subsets need k parameter."
  Why it fails: subsets = all lengths.
  Correct: record every node / both take&skip at end.
```

---

## 21. Common mistakes

1. `dfs(i)` vs `dfs(i+1)` confusion.  
2. Forgetting sort before skip.  
3. Wrong skip condition (`used[i-1]` vs `i>start`).  
4. Pushing to `ans` without copying `path`.  
5. Mutating input order unexpectedly.  
6. TLE on n=10 perms with heavy copying — still ok usually; n=12+ danger.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Generate combinations, not permutations — how?”  
**Expected:**  
“I build with a start index so each subset is produced in increasing index order; that way each k-set appears once.”

### Amazon-style

**Interviewer:** “Feature flag subsets n=25?”  
**Expected:**  
“2^25 is 33M — maybe heavy for latency; sample, constrain, or test differently. For n≤20 bitmask/BT fine.”

### Microsoft-style

**Interviewer:** “Permutations II skip rule?”  
**Expected:**  
“Sort; if `a[i]==a[i-1]` and previous not used, skip so only the first available identical value starts that branch.”

### OpenAI-style

**Interviewer:** “Bitmask or BT for subsets?”  
**Expected:**  
“Bitmask is simple for full power set. BT is better when pruning mid-build (sum targets) or building combinations with constraints.”

---

## 23. Company use cases

| Domain | Pattern |
|---|---|
| QA / experiments | subsets of flags |
| HR tooling | combinations of panels |
| Games | permutations of moves/items |
| Security | password space (ethical teaching only) |
| Compilers / optimizers | enumerate small option sets |

---

## 24. Related concepts + pattern recognition cues

```text
IF "all subsets / power set" → subsets BT or bitmask
IF "all unique combinations size k" → start-index BT
IF "all orderings" → perm BT + used
IF duplicates in input → sort + skip
IF target sum + unlimited → combinationSum dfs(i)
IF target sum + each once → combinationSum2 dfs(i+1)
IF optimize count only → maybe DP knapsack ways instead of listing
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Order matter? → perm : subset/combo
Reuse index? → dfs(i) : dfs(i+1)
Duplicates? → sort + skip
Output size rules complexity
```

### Checklist

- [ ] Three templates from memory  
- [ ] Dry-run combos n=4 k=2  
- [ ] Permute unique skip  
- [ ] CombSum vs CombSum2 difference  
- [ ] Bitmask subsets  

### Practice plan

1. Subsets I/II  
2. Combinations / Combination Sum I/II/III  
3. Permutations I/II  
4. Letter combinations of phone number  
5. Next: palindrome partition as combo-like BT  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Code subsets + combos |
| 3 | Perm unique + comb sum |
| 7 | Mixed identification drill (10 prompts) |
| 15 | Teach decision table |
| 30 | Retry duplicate-heavy miss |
| 90 | Amazon n=25 scale mock |

```text
Item: Subset / Perm / Comb
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Vending-machine metaphor |
| L2 | List outputs for n=3 by hand |
| L3 | Code all three + duplicate variants |
| L4 | Explain skip conditions precisely |
| L5 | Map new prompts to the right skeleton in <60s |
