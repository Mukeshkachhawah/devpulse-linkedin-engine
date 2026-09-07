# Matrix Problems — Core Lesson

> Previous: Arrays, Prefix Sum. A matrix is a 2D array — rows of arrays.

---

## 1. What is it?

A **matrix** is a grid with `m` rows and `n` columns. In C++, use `vector<vector<int>>` or a flat `vector<int>` of size `m*n` with index `i*n + j`.

```text
Row 0 →  1  2  3
Row 1 →  4  5  6
Row 2 →  7  8  9

Cell (r,c) = row r, column c
```

Key words:

- **Row-major** — whole row stored then next row (usual in C++)
- **Diagonal** — r==c (main), or r+c==n-1 (anti)
- **In-place rotate/transpose** — rearrange without full extra matrix when asked
- **2D prefix** — prefix sums on a grid for subrectangle sums

---

## 2. Explain like I am 10

A matrix is a seating chart in a classroom.

```text
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
```

To name a seat, you say row then column — like "second row, third chair."

Spiral walk: walk the outer walls of the classroom, then step inside and walk again — like peeling an onion.

**Memory picture:** onion layers / seating chart.

---

## 3. Real life story

Excel sheet cells. Game maps. Phone camera pixels. Sudoku boards. All grids.

"Rotate the image 90 degrees" is literally rotating a photo buffer — a classic interview matrix problem.

---

## 4. Why does this exist?

Some data is naturally 2D: images, boards, maps, tables. 1D array patterns still apply, but you need 2D indexing, boundaries, and sometimes 2D prefix sums.

Interviews love matrices because they test indexing care, direction vectors, and layer thinking under pressure.

---

## 5. What problem existed before this?

People flattened everything to 1D mentally but wrote bugs on boundaries. Or they allocated new matrices for every transform when in-place was required.

Without grid vocabulary (visited, directions, layers), BFS/DFS on grids (graph chapter) becomes harder later.

---

## 6. What happens without it?

You struggle with:

- Rotate image / spiral order
- Set matrix zeroes
- Search in sorted matrix
- Island problems (later graphs)
- Submatrix sum queries

These appear constantly in Medium interviews.

---

## 7. How did people invent this?

From linear algebra matrices and from graphics framebuffers. Spiral and layer traversal come from processing borders. 2D prefix sums extend the 1D "integral image" used in computer vision (summed area tables) — same math interviews reinvent.

---

## 8. Computer intuition

```text
vector<vector<int>> g(m, vector<int>(n));
g[r][c]  // row first, then column
```

Directions array for walks:

```text
dr = {0, 1, 0, -1}
dc = {1, 0, -1, 0}  // right, down, left, up
```

Rotate 90° clockwise in-place (square):

```text
1) Transpose: g[i][j] ↔ g[j][i]
2) Reverse each row
```

2D prefix:

```text
pref[r+1][c+1] = pref[r][c+1] + pref[r+1][c] - pref[r][c] + g[r][c]
sum (r1..r2, c1..c2) =
  pref[r2+1][c2+1] - pref[r1][c2+1] - pref[r2+1][c1] + pref[r1][c1]
```

---

## 9. Mathematical intuition

Cells count: `m * n`. Scanning all is O(mn).

Rotate/transpose: each cell moves once → O(n²) for square n×n.

Search in matrix with sorted rows/cols can be O(m+n) with clever staircase, or O(log(mn)) if fully sorted in row-major and treated as virtual 1D binary search.

2D prefix prep O(mn), each subrectangle sum O(1).

---

## 10. Step-by-step working

**Spiral order:**

1. Maintain bounds: top, bottom, left, right
2. Walk top row left→right; top++
3. Walk right col top→bottom; right--
4. Walk bottom row right→left if needed; bottom--
5. Walk left col bottom→top if needed; left++
6. Repeat while bounds valid

**Set zeroes:**

1. Use first row/col as markers (or extra sets)
2. Mark which rows/cols must zero
3. Second pass set zeros
4. Handle first row/col carefully

**Rotate 90 clockwise:**

1. Transpose
2. Reverse each row

---

## 11. Dry run

Rotate:

```text
1 2 3     transpose  1 4 7     reverse rows  7 4 1
4 5 6   →           2 5 8   →              8 5 2
7 8 9               3 6 9                  9 6 3
```

Spiral on same start matrix:

```text
1 2 3 6 9 8 7 4 5
```

2D sum on:

```text
1 2
3 4
pref:
0 0 0
0 1 3
0 4 10
sum whole = 10 = pref[2][2]
sum [1..1,0..1] = 3+4=7 = 10 - 3 - 0 + 0
```

---

## 12. Visualization

```text
Indexing
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
(2,0) (2,1) (2,2)
```

```text
Spiral layers
+-----------+
| → → → → | |
| ↑       ↓ |
| ← ← ← ← ↓ |
+-----------+
inner layer next
```

```text
Staircase search (sorted rows & cols)
Start top-right:
if too big, go left
if too small, go down
```

---

## 13. Complexity

| Problem type | Typical time | Extra space |
|---|---|---|
| Scan / spiral | O(mn) | O(1) besides output |
| Rotate in-place | O(n²) | O(1) |
| Set zeroes clever | O(mn) | O(1) |
| Staircase search | O(m+n) | O(1) |
| 2D prefix prep | O(mn) | O(mn) |

---

## 14. Why this complexity?

You must touch each needed cell at least once to output or rotate it. Linear in number of cells is optimal for full scans.

Staircase search discards a row or column each move — at most m+n moves.

2D inclusion-exclusion uses four corners — O(1) after prep.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

void rotate90(vector<vector<int>>& g) {
    int n = g.size();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(g[i][j], g[j][i]);
    for (int i = 0; i < n; i++)
        reverse(g[i].begin(), g[i].end());
}

vector<int> spiralOrder(const vector<vector<int>>& g) {
    vector<int> ans;
    if (g.empty()) return ans;
    int top = 0, bottom = (int)g.size() - 1;
    int left = 0, right = (int)g[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) ans.push_back(g[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) ans.push_back(g[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) ans.push_back(g[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) ans.push_back(g[r][left]);
            left++;
        }
    }
    return ans;
}

bool searchMatrixSorted(const vector<vector<int>>& g, int target) {
    // each row sorted, first of row > last of previous (LeetCode 74 style)
    if (g.empty()) return false;
    int m = g.size(), n = g[0].size();
    int lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = g[mid / n][mid % n];
        if (val == target) return true;
        if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}
```

---

## 16. STL usage

| Tool | Use |
|---|---|
| `vector<vector<int>>` | Common grid |
| `g.assign(m, vector<int>(n))` | Allocate |
| `reverse` | Rotate helper |
| `queue` | Later grid BFS |
| Flat `vector<int>(m*n)` | Cache-friendly optional style |

Validate jagged rows: in interviews assume rectangular unless stated.

---

## 17. Brute Force

Search target: scan all cells O(mn).

Rotate: allocate new matrix `b[j][n-1-i] = a[i][j]` — clear but O(n²) space.

Set zeroes: copy matrix then zero — O(mn) space.

---

## 18. Better

Set zeroes: store rows/cols to clear in `vector<bool>` or unordered sets — O(m+n) space.

Search: binary search each row → O(m log n).

---

## 19. Optimal

Rotate: transpose + reverse rows — O(1) extra space.

Set zeroes: use first row/col as markers — O(1) extra space.

Search LC74: one binary search on virtual 1D — O(log(mn)).

Search LC240 (rows & cols sorted, not fully global): staircase from corner — O(m+n).

2D range sums: 2D prefix — O(1) per query.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "g[x][y] means x is column."
  ↓
Fails: In this curriculum (and C++ usual), first index is row
  ↓
Correct: g[row][col]; say it out loud in interviews

Wrong: "Spiral: four loops without bound checks."
  ↓
Fails: Single row or single column double-counts
  ↓
Correct: After top/right walks, check top<=bottom and left<=right

Wrong: "Any sorted matrix → binary search mid/n mid%n."
  ↓
Fails: Only if globally sorted in row-major (LC74), not LC240
  ↓
Correct: Identify which sorted property you have
```

---

## 21. Common mistakes

1. Swapping row/col in formulas
2. Off-by-one in spiral bounds
3. Forgetting empty matrix / 1×n / n×1
4. In-place zeroing while iterating destroys markers
5. Integer overflow in 2D pref (use `long long`)
6. Assuming square when problem is rectangular

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "Rotate matrix in-place — prove cells move correctly."  
**Expected:** Transpose then reverse; or cycle layers; complexity O(n²)/O(1).

### Amazon
**Ask:** "Spiral matrix output."  
**Expected:** Layer bounds; careful single row/col; clean code.

### Microsoft
**Ask:** "Set matrix zeroes in O(1) space."  
**Expected:** First row/col markers; talk order of clearing.

### OpenAI
**Ask:** "Image tensor batch — rotate / crop windows; how sum a subrectangle fast?"  
**Expected:** 2D prefix / integral image; memory layout row-major; cache thoughts welcome.

**Phrase:**

```text
"I'll treat this as m by n row-major grid.
Boundaries first, then pattern: spiral / rotate / staircase / 2D prefix."
```

---

## 23. Company use cases

| Area | Matrix work |
|---|---|
| Google Photos / Maps | Image buffers, tiles |
| Amazon warehouses | Grid routing (graph later) |
| Microsoft Office | Spreadsheet ranges |
| OpenAI / ML | Tensors as multi-D arrays |
| Games | Tile maps, collision grids |

---

## 24. Related concepts + pattern recognition cues

**Related:** arrays, prefix sum (2D), binary search, BFS/DFS on grid, DP on grid.

| Cue | Pattern |
|---|---|
| Walk borders / onion | Spiral / layers |
| 90° rotate | Transpose + reverse |
| Zero entire row/col | Markers |
| Sorted matrix search | Binary or staircase |
| Many subrectangle sums | 2D prefix |
| Islands / rooms | Grid DFS/BFS (graphs) |

```text
2D + rearrange → rotate/transpose
2D + ordered search → binsearch/staircase
2D + range sum → 2D prefix
2D + connectivity → graph on grid
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Matrix = classroom seats (row, col)
Spiral = peel onion layers
Rotate 90 = transpose + reverse rows
2D prefix = inclusion-exclusion corners
```

### Checklist

- [ ] Index g[r][c] correctly every time
- [ ] Dry-run rotate and spiral
- [ ] Code both from memory
- [ ] Explain LC74 vs LC240 search
- [ ] Write 2D prefix formula once without notes

### Practice roadmap

1. Easy: Matrix Diagonal Sum, Flood fill intro
2. Medium: Spiral, Rotate Image, Set Zeroes, Search 2D, Valid Sudoku
3. With prefix: Range Sum Query 2D Immutable  
4. Later: Number of Islands (graphs), DP unique paths

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recall pictures + rotate recipe |
| 3 | Dry-run spiral on 3×4 and 1×4 |
| 7 | Code rotate + spiral + search blind |
| 15 | Timed Medium matrix problem |
| 30 | Teach 2D prefix inclusion-exclusion |
| 90 | Mock: rotate + search + one spiral/zeroes |

```text
Item: Matrix Problems
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
