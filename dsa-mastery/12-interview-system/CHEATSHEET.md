# Interview System Cheatsheet

## Framework

```text
Clarify → Brute → Optimize → Code → Test
```

| Phase | Must produce |
|---|---|
| Clarify | Restate, constraints, example |
| Brute | Correct slow idea + O |
| Optimize | Pattern + better O + why |
| Code | Clean C++ + invariant |
| Test | Dry run + edges + final O |

## Time Budget (45m)

Clarify 3–5 · Brute 3–5 · Optimize 5–8 · Code 15–20 · Test 5–7

## Complexity Sentence

> Time is O(___) because ___. Extra space is O(___) because ___.

| n limit | aim |
|---|---|
| 1e5 | O(n log n) or better |
| 1000 | O(n²) OK |
| ≤20 | exponential maybe OK |

## STL Need-to-Know

```cpp
unordered_map<int,int> freq;
priority_queue<int, vector<int>, greater<int>> minH;
auto it = lower_bound(a.begin(), a.end(), x);
queue<int> q; // BFS
vector<vector<int>> g(n);
```

## Company Leans (ultra short)

| Co | Lean |
|---|---|
| Google | Graphs, trees, proofs, follow-ups |
| Amazon | Arrays/window/trees, OA, LPs |
| Microsoft | Clean mediums, trees/graphs |
| Apple | Edges, craft, practical DS |
| NVIDIA | Perf, bits/matrices, systems |
| Anthropic | Fundamentals + clear reasoning |
| OpenAI | Depth, hard reasoning, tradeoffs |

## Mock Minimum

- Timer on  
- Speak aloud  
- Grade 6 axes  
- Log one trap  

## Recovery Lines

- "Let me restate with a smaller example."  
- "Brute is X; property Y unlocks Z."  
- "Invariant broke at ...; fixing by ..."  

## File Index

- `problem-solving-framework.md`  
- `company-pattern-map.md`  
- `complexity-communication.md`  
- `mock-plan-and-final-checklist.md`  
- `cpp-stl-cheatsheet.md`  
- `interview-simulation-bank.md`  

## Pre-Interview

30s / 2m / 10m revision files in this folder + Pattern Book 30s.
