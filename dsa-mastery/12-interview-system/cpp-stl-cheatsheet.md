# C++ STL Cheatsheet for Interviews

> Fast, practical STL you actually use in coding rounds. Prefer clarity over obscure tricks.

---

## 1. Includes You Often Need

```cpp
#include <bits/stdc++.h> // OK on many interview platforms; else include specifically
using namespace std;
```

Specific includes: `<vector>`, `<string>`, `<queue>`, `<stack>`, `<deque>`, `<set>`, `<map>`,
`<unordered_map>`, `<unordered_set>`, `<algorithm>`, `<numeric>`, `<climits>`, `<cmath>`.

---

## 2. Vector

```cpp
vector<int> a;           // empty
vector<int> b(n, 0);     // n zeros
vector<int> c = {1,2,3};
a.push_back(x);
a.pop_back();
a.size(); a.empty();
a.front(); a.back();
sort(a.begin(), a.end());
sort(a.begin(), a.end(), greater<int>());
reverse(a.begin(), a.end());
```

2D:

```cpp
vector<vector<int>> g(n, vector<int>(m, 0));
```

---

## 3. String

```cpp
string s = "abc";
s.push_back('d');
s.pop_back();
s.substr(pos, len);
s.find("ab");            // npos if missing
stoi(s); to_string(42);
```

---

## 4. Unordered Map / Set (Hash)

```cpp
unordered_map<int,int> freq;
freq[x]++;               // default 0
if (freq.count(x)) ...
freq.erase(x);

unordered_set<int> seen;
seen.insert(x);
seen.count(x);
```

**Custom pair hash** rarely needed; prefer encode `i * n + j` for grids.

`map` / `set` are **ordered** (tree): O(log n). Use when you need order / lower_bound.

---

## 5. Ordered Map / Set + lower_bound

```cpp
set<int> st;
st.insert(x);
st.erase(x);
auto it = st.lower_bound(x); // first >= x
auto it2 = st.upper_bound(x); // first > x
```

`multiset` allows duplicates; erase carefully:

```cpp
ms.erase(ms.find(x)); // erase one
// ms.erase(x);       // erases ALL x
```

---

## 6. Stack / Queue / Deque

```cpp
stack<int> st;
st.push(x); st.top(); st.pop(); st.empty();

queue<int> q;
q.push(x); q.front(); q.pop();

deque<int> dq;
dq.push_back(x); dq.push_front(x);
dq.pop_back(); dq.pop_front();
dq.front(); dq.back();
```

Deque = 0-1 BFS / sliding window extremes with monotonic deque.

---

## 7. Priority Queue (Heap)

```cpp
// Max-heap (default)
priority_queue<int> maxH;
maxH.push(x); maxH.top(); maxH.pop();

// Min-heap
priority_queue<int, vector<int>, greater<int>> minH;

// Min-heap of pairs {dist, node}
using P = pair<long long,int>;
priority_queue<P, vector<P>, greater<P>> pq;
```

Custom comparator:

```cpp
struct Cmp {
    bool operator()(const int& a, const int& b) const {
        return a > b; // min-heap behavior
    }
};
priority_queue<int, vector<int>, Cmp> pq;
```

---

## 8. Algorithms Header Hits

```cpp
min(a,b); max(a,b); swap(a,b);
minmax({a,b,c}); // C++11+ careful
accumulate(v.begin(), v.end(), 0LL);
count(v.begin(), v.end(), x);
find(v.begin(), v.end(), x);

lower_bound(v.begin(), v.end(), x); // needs sorted
upper_bound(v.begin(), v.end(), x);
binary_search(v.begin(), v.end(), x);

next_permutation(v.begin(), v.end());
__gcd(a,b);           // or gcd in C++17 <numeric>
lcm(a,b);             // C++17
```

Binary search helpers return **iterators**; subtract `v.begin()` for index.

---

## 9. Useful Patterns with STL

### Frequency map

```cpp
unordered_map<int,int> freq;
for (int x : a) ++freq[x];
```

### Index map

```cpp
unordered_map<int,int> idx;
for (int i = 0; i < n; ++i) idx[a[i]] = i;
```

### Sort with indices

```cpp
vector<int> ord(n);
iota(ord.begin(), ord.end(), 0);
sort(ord.begin(), ord.end(), [&](int i, int j){ return a[i] < a[j]; });
```

### Prefix sums

```cpp
vector<long long> pref(n+1);
for (int i = 0; i < n; ++i) pref[i+1] = pref[i] + a[i];
// sum[L..R] = pref[R+1] - pref[L]
```

---

## 10. Graph Containers

```cpp
vector<vector<int>> g(n);
g[u].push_back(v);

vector<vector<pair<int,int>>> gw(n); // {to, weight}
gw[u].push_back({v, w});
```

---

## 11. Constants & Overflow

```cpp
INT_MAX; INT_MIN; LLONG_MAX;
const long long INF = 4e18;
long long s = 1LL * a * b;
```

Prefer `lo + (hi - lo) / 2` for mid.

---

## 12. Lambda DFS (Common in Interviews)

```cpp
function<void(int)> dfs = [&](int u) {
    // ...
    for (int v : g[u]) dfs(v);
};
dfs(0);
```

Needs `#include <functional>`.

---

## 13. Traps

1. `priority_queue` default is **max**-heap.  
2. `queue::pop` returns void — use `front` then `pop`.  
3. `unordered_map` iteration order random.  
4. `string::npos` checks for failed `find`.  
5. `vector` boolean specialization quirks — use `vector<char>` for visited.  
6. Don't use `bits/stdc++.h` if platform forbids — know specific includes.  
7. `erase` on `unordered_map` while iterating — careful with iterators.  
8. Signed overflow UB — use `long long`.

---

## 14. Wrong Thinking vs Correct

| Wrong | Correct |
|---|---|
| Always `map` | Prefer `unordered_map` unless order needed |
| Sort every time for kth | Heap / nth_element |
| Nested vector as "matrix graph" without care | Fine for grids; for sparse use adj list |
| Memorize all STL | Master the 20% above |

---

## 15. 2-Minute Cold Drill

Write from memory:

1. Min-heap of `pair<int,int>`  
2. `lower_bound` index  
3. BFS with `queue`  
4. Frequency `unordered_map`  
5. Sort vector descending  

---

## Revision Checklist

- [ ] Vector/string/map/set/queue/stack/pq fluent  
- [ ] Min-heap syntax memorized  
- [ ] lower_bound meaning clear  
- [ ] Overflow habits automatic  

**Pair with:** Pattern Book templates (all use this STL).
