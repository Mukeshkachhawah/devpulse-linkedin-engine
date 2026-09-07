# String Algorithms

**Module:** 11-advanced  
**Level target:** L5  
**Prerequisite:** strings, arrays, KMP intuition from pattern matching, hashing basics optional  
**Memory picture:** KMP = a failure slide rule so the pattern never rewinds the text stupidly. Z-array = for every position, how long a mirror of the prefix matches. Trie = a tree of shared prefixes. Rolling hash = fingerprint a substring as a number.

---

## 1. What is it?

This lesson covers core **string algorithms** beyond basic two-pointers:

| Tool | Job |
|---|---|
| **KMP** | pattern search in O(n+m) via LPS/failure function |
| **Z-algorithm** | Z-box matches of prefix at each index |
| **Rabin–Karp** | rolling hash search / compare substrings |
| **Trie** | prefix insert/search dictionary |
| **Manacher** (intro) | longest palindromic substring in O(n) |
| **Suffix ideas** (map) | suffix array/automaton exist; know names |

New words:

- **LPS / pi** — longest proper prefix that is also suffix for pattern prefixes.  
- **Proper** — not the whole string.  
- **Rolling hash** — update hash when window moves by ± one char.  
- **Collision** — different strings, same hash (handle with double hash or verify).  
- **Trie node** — children map/array + optional end mark.

---

## 2. Explain like I am 10

Searching a word in a book: a naive kid restarts every time a letter fails.  
KMP kid remembers “if I failed here, I already know a smaller prefix matches,” so they slide smartly.

Trie: a family tree of words sharing beginnings — “app”, “apple”, “ape” share “ap”.

---

## 3. Real life story

Ctrl+F in an editor on huge logs — need linear search.  
Autocomplete — trie/prefix structures.  
Plagiarism / dedup — hashes of shingles.

```text
text:    a b a b c a b a b
pattern: a b a b
KMP finds at 0 and 5 (0-index) without dumb restarts
```

---

## 4. Why does this exist?

Naive find is O(nm). For competitive/interview hard strings, O(n+m) and prefix structures are expected. Tries answer prefix queries that hash maps alone do poorly.

---

## 5. What problem existed before this?

Brute matching; regex engines (heavy); simple `string::find` without understanding. People needed predictable linear algorithms and dictionary trees.

---

## 6. What happens without it?

```text
n,m ~ 1e5 naive → TLE
autocomplete with linear scan of all words → lag
single hash without care → rare WA on collisions
```

---

## 7. How did people invent this?

Knuth–Morris–Pratt 1977; Rabin–Karp hashing search; tries from information retrieval; Manacher for palindromes; suffix arrays later for heavy stringology. Interviews sample KMP/trie/hash most.

---

## 8. Computer intuition

```text
LPS for pattern "abab"

i: 0 1 2 3
p: a b a b
π: 0 0 1 2

When mismatch after matching 4 chars in theory,
jump using π.


Z for "aabxaayaab"

Z[i] = longest substring from i matching prefix


TRIE

    root
     a
     p
   /   \
  e     p
        l
        e
```

---

## 9. Mathematical intuition

KMP: automaton of pattern prefixes; each text char advances/fails; total fails amortized O(n).

Rolling hash: treat string as polynomial base-P modulo M:  
`h = s0*P^{L-1} + ... + s_{L-1}`. Shift: subtract left, *P, add right.

Double mod / 64-bit natural overflow reduces collision fear.

---

## 10. Step-by-step working

### KMP steps

1. Build `pi` on pattern.  
2. Scan text with `(i,j)` pointers; on mismatch `j=pi[j-1]`.  
3. When `j==m`, record hit; `j=pi[j-1]`.

### Trie steps

1. Nodes with next[26] or map.  
2. Insert: walk creating.  
3. Search / prefix: walk; fail on missing edge.

### Hash steps

1. Choose base & mod (or ull).  
2. Precompute powers / prefix hashes.  
3. Substring hash in O(1); verify on equal hashes if needed.

---

## 11. Dry run

Pattern `abab`, text `ababcabab`:

- Build pi `[0,0,1,2]`  
- Match through first `abab`, hit at 0  
- Continue; another hit later at 5  

Trie insert `app`, `apple`: shared `a-p-p`, then branch `l-e` vs end mark on third `p`.

---

## 12. Visualization

```text
KMP mismatch

text:    a b a x ...
pat:     a b a b
             ^ mismatch
pi[2]=1 → try pat[1]=b against x ...


ROLLING WINDOW HASH

[ a b c ] d e
  → drop a, add d → [ b c d ]
hash' = (hash - a*P^2)*P + d
```

---

## 13. Complexity

| Algo | Build | Query/Search |
|---|---|---|
| KMP | O(m) pi | O(n+m) |
| Z | O(n) | O(n) |
| Rabin–Karp | O(n) | O(n+m) expected |
| Trie | O(total chars) | O(len) |
| Manacher | O(n) | LPS substring |

---

## 14. Why this complexity?

Pointers only move forward amortized; trie pays per character once; hashing window updates O(1).

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> buildPi(const string& p) {
    int m = p.size();
    vector<int> pi(m);
    for (int i = 1, j = 0; i < m; ++i) {
        while (j > 0 && p[i] != p[j]) j = pi[j-1];
        if (p[i] == p[j]) ++j;
        pi[i] = j;
    }
    return pi;
}

vector<int> kmpSearch(const string& s, const string& p) {
    auto pi = buildPi(p);
    vector<int> pos;
    for (int i = 0, j = 0; i < (int)s.size(); ++i) {
        while (j > 0 && s[i] != p[j]) j = pi[j-1];
        if (s[i] == p[j]) ++j;
        if (j == (int)p.size()) {
            pos.push_back(i - j + 1);
            j = pi[j-1];
        }
    }
    return pos;
}

struct Trie {
    struct Node {
        int next[26];
        bool end;
        Node() { fill(begin(next), end(next), -1); end=false; }
    };
    vector<Node> t;
    Trie() { t.emplace_back(); }
    void insert(const string& s) {
        int u = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (t[u].next[c] == -1) {
                t[u].next[c] = (int)t.size();
                t.emplace_back();
            }
            u = t[u].next[c];
        }
        t[u].end = true;
    }
    bool search(const string& s) {
        int u = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (t[u].next[c] == -1) return false;
            u = t[u].next[c];
        }
        return t[u].end;
    }
};

struct RollingHash {
    static const uint64_t MOD = 1000000007ULL;
    static const uint64_t BASE = 911382323ULL;
    vector<uint64_t> pref, pw;
    RollingHash(const string& s) {
        int n = s.size();
        pref.assign(n+1, 0);
        pw.assign(n+1, 1);
        for (int i = 0; i < n; ++i) {
            pref[i+1] = (pref[i]*BASE + s[i]) % MOD;
            pw[i+1] = (pw[i]*BASE) % MOD;
        }
    }
    uint64_t get(int l, int r) { // inclusive
        uint64_t res = (pref[r+1] + MOD - (pref[l]*pw[r-l+1])%MOD) % MOD;
        return res;
    }
};
```

---

## 16. STL usage

- `string`, `string_view` (C++17) for windows  
- `unordered_map` children if alphabet huge  
- `array<int,26>` faster for lowercase  
- avoid heavy `std::regex` in contests  

---

## 17. Brute Force

For each text index, compare pattern O(nm). Trie brute = linear scan dictionary.

---

## 18. Better

`std::string::find` (implementation-dependent) or single rolling hash with verify.

---

## 19. Optimal

KMP/Z for guaranteed linear; Aho–Corasick for many patterns; suffix array/automaton for heavy offline stringology; trie for prefix dict.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "KMP pi[i] is longest prefix of whole pattern."
  Why it fails: it's for prefix p[0..i].
  Correct: LPS of each pattern prefix.

Wrong: "Hash equal ⇒ strings equal always."
  Why it fails: collisions.
  Correct: double hash or verify char-by-char.

Wrong: "Trie always beats hashmap."
  Why it fails: memory; exact full-string dict may use hash set.
  Correct: trie shines for prefixes / shared paths.

Wrong: "Manacher needed for all palindrome problems."
  Why it fails: expand-around-center O(n²) often enough.
  Correct: pick by constraints.
```

---

## 21. Common mistakes

1. Off-by-one in KMP hit index.  
2. Not resetting `j=pi[j-1]` after match.  
3. Hash mod bugs / negative.  
4. Trie forgetting `end` mark vs prefix-only.  
5. Alphabet assumptions (`'a'..'z'` only).  
6. Building pi on text instead of pattern.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Explain KMP failure function.”  
**Expected:**  
“`pi[i]` is the longest proper prefix of `p[0..i]` that is also a suffix. On mismatch we fall back to `pi[j-1]` so we reuse matched border information; total O(n+m).”

### Amazon-style

**Interviewer:** “Autocomplete for products?”  
**Expected:**  
“Trie or prefix indexes; discuss memory, unicode, ranking top-k (need extra heap/freq on nodes).”

### Microsoft-style

**Interviewer:** “Detect duplicate substrings of length L.”  
**Expected:**  
“Rolling hash set of windows; verify collisions; O(n) expected.”

### OpenAI-style

**Interviewer:** “KMP vs Rabin–Karp?”  
**Expected:**  
“KMP worst-case linear guaranteed; RK great for multiple compares / 2D generalizations / simplicity with hashing; handle collisions.”

---

## 23. Company use cases

| Domain | Use |
|---|---|
| Search / IDE | find, autocomplete |
| Security | signature matching (Aho–Corasick cousin) |
| Data platforms | dedup via fingerprints |
| Chat / NLP tooling | tokenization tries |
| Browsers | URL prefix structures |

---

## 24. Related concepts + pattern recognition cues

```text
IF single pattern search linear guarantee → KMP/Z
IF substring compare often → rolling hash
IF prefix queries / dictionary → trie
IF many patterns → Aho–Corasick
IF longest palindromic substring O(n) needed → Manacher
IF all suffixes analysis → suffix array (map only here)
```

Related: string DP (LCS) from module 09 — different job (opt alignment vs search structure).

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
KMP = pi borders + smart slide
Trie = shared prefixes
Rolling hash = O(1) substring fingerprint
Verify collisions when it matters
```

### Checklist

- [ ] Build pi dry run  
- [ ] KMP search code  
- [ ] Trie insert/search  
- [ ] Prefix hash get(l,r)  
- [ ] Explain Google pi definition  

### Practice plan

1. Implement strStr with KMP  
2. Trie prefix problems / replace words  
3. Repeated DNA / duplicate substrings hashing  
4. Z-function basic tasks  
5. Optional Manacher  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | pi + KMP code |
| 3 | Trie from memory |
| 7 | Hash window problem |
| 15 | Teach KMP with drawing |
| 30 | Retry WA collision case |
| 90 | Google KMP explanation mock |

```text
Item: String Algorithms
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Slide-rule + trie metaphors |
| L2 | Dry-run pi on short pattern |
| L3 | Code KMP + trie + hash |
| L4 | Discuss collisions & when O(n²) OK |
| L5 | Pick string tool under constraints fast |
