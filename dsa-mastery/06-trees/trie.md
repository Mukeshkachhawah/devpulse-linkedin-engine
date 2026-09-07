# Trie (Prefix Tree) — Core Lesson

**Module:** 06-trees  
**Level target:** L4  
**Prerequisite:** trees, hashing, strings  
**Memory picture:** An airport destination board that splits letter by letter — all cities sharing a prefix hang under the same branch.

> Previous: Heap. Next: Tree DP and Views.

---

## 1. What is it?

A **trie** (prefix tree) stores strings by sharing common **prefixes**. Each edge is labeled with a character; each path from the root spells a string. Nodes often mark “word ends here.”

New words:

- **Prefix** — leading piece of a string (`"app"` is a prefix of `"apple"`).
- **End marker** — boolean (or count) saying a complete word ends at this node.
- **Alphabet size** — for lowercase English, 26 children array; for general chars, a map.

```text
Words: app, apple, apt, bat

        root
       /    \
      a      b
      |      |
      p      a
     / \     |
    p   t    t
   /|
 end t
    |
    e
    |
    end  (apple)
```

---

## 2. Explain like I am 10

You and friends save words in a tree of letters. If two words start the same, they walk the same hallway until they differ, then take different doors. Finding “all words that start with `ap`” means walk `a`→`p`, then list everything below.

**Memory picture:** shared hallways for shared beginnings.

---

## 3. Real life story

Phone keyboard autocomplete: type `uni` → university, unicorn, unique. The keyboard walks a trie of the dictionary. Routers historically used trie-like structures for IP prefixes. Search engines and spell-checkers use the same skeleton.

---

## 4. Why does this exist?

Hash sets answer “is this exact word present?” in average O(L), but they do not group by prefix. Scanning all words for a prefix is O(total characters). A trie answers:

- insert / search word: O(L)
- prefix exists?: O(L)
- list by prefix: O(output size) after O(L) walk

where L = length of the query string.

---

## 5. What problem existed before this?

Dictionaries were flat lists or hash sets. Autocomplete needed either huge precomputed maps or linear scans. Tries (de la Briandais / Fredkin “reTRIEval”) made prefix operations natural.

---

## 6. What happens without it?

1. Autocomplete becomes “loop all words” → too slow for large dictionaries.
2. You misuse sorting + binary search for prefixes when inserts are frequent.
3. XOR / bit tries for maximum XOR pair problems feel mysterious without the prefix idea.
4. Word Search II (board + dictionary) becomes exponential without a trie prune.

---

## 7. How did people invent this?

From dictionary retrieval research. Later: compressed tries (radix trees), suffix trees/arrays for substrings, and binary tries for integers/XOR. Interview favorites: implement Trie, Word Search II, replace words, max XOR.

---

## 8. Computer intuition

Node structure:

```text
children[26] or map<char, Node*>
isEnd / count
optional: frequency, fail links (Aho-Corasick — advanced)
```

Insert `"apple"`: start at root; for each char, create child if missing; move down; mark end.

Search: walk; if missing edge → false; at end check `isEnd`.

Prefix: walk; success if path exists (end marker optional).

```text
INSERT "app" then "apple"

root -a-> -p-> -p(end) -l-> -e(end)
```

---

## 9. Mathematical intuition

Time per op Θ(L), independent of number of words **n** (unlike scanning). Space can be O(Σ lengths) in worst case when prefixes barely share; with heavy sharing, much less.

For lowercase-only arrays: each node costs ~26 pointers — memory heavy. Map children saves memory when sparse; slower constants.

Bit trie for 32-bit ints: depth 32; max XOR greedily prefers opposite bits.

---

## 10. Step-by-step working

**Implement Trie class:**

1. `insert(word)` — walk/create, mark end.
2. `search(word)` — walk, require end.
3. `startsWith(prefix)` — walk only.

**Replace Words (root → shortest stem):**

1. Build trie of dictionary.
2. For each sentence word, walk until first `isEnd` or mismatch; replace by stem.

**Word Search II sketch:**

1. Trie of words.
2. DFS on board; follow trie edges; mark visited; when `isEnd`, record word; prune dead branches.

---

## 11. Dry run

Operations:

```text
insert "tea"
insert "ted"
insert "ten"
startsWith "te" → true
search "tea" → true
search "te" → false (no end at that node)
```

```text
        root
         |
         t
         |
         e
       / | \
      a  d  n
     end end end
```

---

## 12. Visualization

```text
HASH SET vs TRIE for prefix "ca"

Hash: cat, car, dog, cap → check every key's front
Trie:
      c
      |
      a
    / | \
   t  r  p
 walk "ca" once, explore subtree
```

```text
BIT TRIE idea (max XOR)

Numbers as bit paths from MSB
At each bit, prefer child with opposite bit if it exists
```

---

## 13. Complexity

| Op | Time | Extra notes |
|---|---|---|
| Insert word length L | O(L) | |
| Search / prefix | O(L) | |
| Build from n words | O(total chars) | |
| Space | O(total nodes) | ≤ O(Σ \|words\| · alphabet) worst |

---

## 14. Why this complexity?

One step per character; no scanning of unrelated words. Space pays for nodes/edges created. Alphabet arrays trade space for O(1) child indexing.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* next[26]{};
    bool end = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}

    void insert(const string& s) {
        TrieNode* cur = root;
        for (char ch : s) {
            int i = ch - 'a';
            if (!cur->next[i]) cur->next[i] = new TrieNode();
            cur = cur->next[i];
        }
        cur->end = true;
    }

    bool search(const string& s) const {
        TrieNode* cur = root;
        for (char ch : s) {
            int i = ch - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return cur->end;
    }

    bool startsWith(const string& p) const {
        TrieNode* cur = root;
        for (char ch : p) {
            int i = ch - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return true;
    }
};

// Map-based node for general characters
struct MapTrieNode {
    unordered_map<char, MapTrieNode*> next;
    bool end = false;
};

// Max XOR of two numbers in array (bit trie)
int findMaximumXOR(vector<int>& nums) {
    struct BNode { BNode* ch[2]{}; };
    BNode* root = new BNode();
    auto insert = [&](int x) {
        BNode* cur = root;
        for (int b = 31; b >= 0; --b) {
            int bit = (x >> b) & 1;
            if (!cur->ch[bit]) cur->ch[bit] = new BNode();
            cur = cur->ch[bit];
        }
    };
    auto best = [&](int x) {
        BNode* cur = root;
        int ans = 0;
        for (int b = 31; b >= 0; --b) {
            int bit = (x >> b) & 1;
            int want = bit ^ 1;
            if (cur->ch[want]) {
                ans |= (1 << b);
                cur = cur->ch[want];
            } else cur = cur->ch[bit];
        }
        return ans;
    };
    int res = 0;
    for (int x : nums) {
        if (root->ch[0] || root->ch[1]) res = max(res, best(x));
        insert(x);
    }
    return res;
}
```

---

## 16. STL usage

Tries are usually hand-rolled. Helpers:

- `string_view` for non-owning slices (C++17) when matching stems.
- `unordered_map<char, Node*>` when alphabet is large/sparse.
- `vector<int> children(26, -1)` + arena `vector<Node>` to avoid raw `new` in contests.

Prefer arena allocation in timed contests to reduce allocator overhead.

---

## 17. Brute Force

Store all words in a vector. For each query prefix, scan all words and `compare` — O(n · L). Fine for n ≤ 100; fails large dictionaries + many queries.

---

## 18. Better

Sort words; binary search lower_bound on prefix — good for static dictionaries. Inserts require resort or balanced tree of strings. Still weaker than trie for character-by-character pruning on a grid (Word Search II).

---

## 19. Optimal

For dynamic prefix workloads: trie O(L) per op. For static substring problems, suffix array/automaton may beat tries — advanced track. Interview optimal for “Implement Trie” / autocomplete: clean array children + end flag.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Trie search is O(1) like hash."
  ↓
Fails: depends on string length L
  ↓
Correct: O(L), but independent of how many other words exist

Wrong: "startsWith needs end marker true."
  ↓
Fails: prefix can end mid-word
  ↓
Correct: path existence only for startsWith

Wrong: "Always use map for children."
  ↓
Fails: slower; interviews often expect [26]
  ↓
Correct: array for a–z; map for open alphabets

Wrong: "HashSet can do prefix easily."
  ↓
Fails: no shared structure
  ↓
Correct: hash is exact match; trie is prefix-native
```

---

## 21. Common mistakes

1. Forgetting to mark `isEnd`.
2. Using `search` logic for `startsWith`.
3. Memory leaks with `new` (mention ownership; use arena).
4. Index `ch - 'a'` on non-lowercase → UB.
5. Not pruning Word Search II after finding word (duplicate answers).
6. Huge stack DFS with deep tries — rare but watch recursion depth on long strings.

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Implement Trie with insert/search/startsWith.”  
**Expected:** Clear node struct; O(L); discuss memory.

### Amazon
**Ask:** “Replace words with dictionary roots.”  
**Expected:** Trie; take shortest stem while walking.

### Microsoft
**Ask:** “Autocomplete system design lite.”  
**Expected:** Trie + top frequency stored in nodes / hot lists; talk about limits.

### OpenAI
**Ask:** “When is a hash set enough?”  
**Expected:** Exact membership only, no prefix, no character pruning. Trie when prefixes or character DFS matter. Bit trie for XOR optimization problems.

**Interview phrase:**

```text
"I'll store the dictionary in a trie so shared prefixes share paths.
Each operation walks at most the string length."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Search autocomplete | Prefix trie + ranking |
| Spell check / T9 | Trie / DAWG |
| IP routing tables | Prefix matching |
| Competitive XOR problems | Binary bit trie |
| Board word games | Trie-pruned DFS |

---

## 24. Related concepts + pattern recognition cues

**Related:** hashing, sorting strings, Aho-Corasick, suffix structures, segment trees (different), BST of strings.

| Cue | Tool |
|---|---|
| Exact word set | Hash |
| Prefix queries / autocomplete | Trie |
| Many pattern match in text | Aho-Corasick |
| Max XOR pair | Bit trie |
| Grid + dictionary words | Trie + DFS |
| Static suffix queries | Suffix array (advanced) |

**Decision snack:**

```text
Prefix? → trie
Exact? → hash
XOR bits? → bit trie
Substring in one text many times? → advanced string algs
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Shared prefixes = shared paths
insert/search/prefix = walk letters O(L)
isEnd marks full words
Bit trie: prefer opposite bits for max XOR
```

### Checklist

- [ ] Draw trie for 4 words
- [ ] Code class Trie from memory
- [ ] Explain search vs startsWith
- [ ] Sketch Word Search II prune
- [ ] Bit trie max XOR idea

### Practice roadmap

1. Easy/Med: Implement Trie, Replace Words, Longest Word in Dictionary
2. Medium: Word Search II, Design Add and Search Words (`.` wildcards)
3. Harder: Max XOR of Two Numbers, Stream of Characters, Palindrome pairs (trie variants)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite picture + isEnd rule |
| 3 | Dry-run insert/search |
| 7 | Code Trie blind |
| 15 | Word Search II outline timed |
| 30 | Bit trie dry-run |
| 90 | Mock: Implement Trie + Replace Words |

```text
Item: Trie
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
