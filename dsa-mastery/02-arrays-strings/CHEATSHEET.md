# Arrays & Strings — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Need contiguous segment?
  ├─ longest/shortest / at most K distinct / fixed k stats → Sliding Window
  ├─ sum = K (any ints) → Prefix + Hash
  └─ many static range sums → Prefix array

Need pair / rewrite / palindrome?
  ├─ sorted pair / water / 3Sum → Opposite pointers
  └─ in-place keep/filter → Slow / Fast

2D grid?
  ├─ rotate 90 → transpose + reverse rows
  ├─ borders → spiral layers
  ├─ sorted search → binsearch or staircase
  └─ subrectangle sums → 2D prefix

String letter counts / anagram → freq[26] or map
Need original indices + unsorted two-sum → Hash map
```

---

## Formulas

```text
// 1D prefix (size n+1, pref[0]=0)
pref[i+1] = pref[i] + a[i]
sum(l..r) = pref[r+1] - pref[l]

// Subarray sum == k
seen[0] = 1
sum += a[i]
ans += seen[sum - k]
seen[sum]++

// Difference range add [l,r] += v
diff[l] += v
if (r+1 < n) diff[r+1] -= v
// then prefix diff into final

// 2D prefix
pref[r+1][c+1] = pref[r][c+1] + pref[r+1][c] - pref[r][c] + g[r][c]
sum(r1..r2,c1..c2) =
  P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]

// Matrix index in flat buffer
idx = r * n + c
r = idx / n; c = idx % n
```

---

## Templates (C++)

### Opposite pointers (sorted two-sum)

```cpp
int l = 0, r = n - 1;
while (l < r) {
    long long s = 1LL * a[l] + a[r];
    if (s == target) { /* found */ break; }
    if (s < target) l++;
    else r--;
}
```

### Slow / fast (remove / compact)

```cpp
int slow = 0;
for (int fast = 0; fast < n; fast++)
    if (keep(a[fast])) a[slow++] = a[fast];
// new length = slow
```

### Fixed window

```cpp
int sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
int best = sum;
for (int i = k; i < n; i++) {
    sum += a[i] - a[i - k];
    best = max(best, sum);
}
```

### Variable window (longest valid)

```cpp
int left = 0;
for (int right = 0; right < n; right++) {
    add(a[right]);
    while (invalid()) { remove(a[left]); left++; }
    best = max(best, right - left + 1);
}
```

### Longest unique substring

```cpp
vector<int> last(256, -1);
int left = 0, best = 0;
for (int i = 0; i < (int)s.size(); i++) {
    unsigned char c = s[i];
    if (last[c] >= left) left = last[c] + 1;
    last[c] = i;
    best = max(best, i - left + 1);
}
```

### Rotate 90 clockwise

```cpp
// transpose
for (int i = 0; i < n; i++)
  for (int j = i+1; j < n; j++) swap(g[i][j], g[j][i]);
// reverse rows
for (int i = 0; i < n; i++) reverse(g[i].begin(), g[i].end());
```

---

## Complexity Table

| Pattern | Time | Extra space |
|---|---|---|
| Full scan | O(n) / O(mn) | O(1) |
| Sort + two pointers | O(n log n) | O(1)–O(n) |
| Hash two-sum | O(n) avg | O(n) |
| Sliding window | O(n) | O(1)–O(σ) |
| Prefix build + queries | O(n + q) | O(n) |
| Diff updates + build | O(u + n) | O(n) |
| Spiral / rotate | O(mn) / O(n²) | O(1) (+ output) |

---

## Company Ask Snippets

| Company | Classic ask | Expected core |
|---|---|---|
| Google | Why array O(1)? Window when? | Address math; monotonic contiguous |
| Amazon | Move zeroes / spiral / bookings | Slow-fast; layers; diff array |
| Microsoft | Reverse words / set zeroes / 3Sum | Strings + markers + sort+pointers |
| OpenAI | Stream / huge buffer / context window | Online one-pass; memory limits |

---

## Wrong → Right (Pocket)

```text
Window for every sum problem → No; negatives need prefix hash
Two pointers always need sorted → No; slow/fast does not
g[x][y] x is column → No; row then col here
pref[r]-pref[l] without convention → Pick n+1 empty start
substr every step → Prefer indices
```

---

## Spaced Repetition Hook

Revise this folder on days **1 / 3 / 7 / 15 / 30 / 90**.

- 30 sec → `REVISION-30-SECONDS.md`
- 2 min → `REVISION-2-MINUTES.md`
- 10 min → `REVISION-10-MINUTES.md`

---

## Lesson Index

| File | Topic |
|---|---|
| `arrays.md` | Core array thinking |
| `strings.md` | Char arrays + text patterns |
| `two-pointers.md` | Opposite / slow-fast |
| `sliding-window.md` | Fixed + variable windows |
| `prefix-sum-difference-array.md` | Range sums + range adds |
| `matrix-problems.md` | 2D grids, spiral, rotate, 2D prefix |
