# Trie (Prefix Tree) Patterns

> **Goal:** Spot prefix / dictionary / autocomplete problems and implement a clean Trie with DFS/BFS extras when needed.

---

## 1. When to Use

Use a Trie when:

1. Many strings share **prefixes**.  
2. You need **prefix search**, autocomplete, or "starts with".  
3. Word Break / search board with a **dictionary** of many words.  
4. XOR problems on bit prefixes (Binary Trie).  
5. Counting words with a given prefix.

**Kid idea:** A tree of letters. "CAT" and "CAR" share `C → A`, then split into `T` and `R`.

**When not:** Single exact lookup of few strings → `unordered_set` is enough.

---

## 2. Recognition Cues

| Cue | Pattern |
|---|---|
| "implement Trie / insert / search / startsWith" | classic Trie |
| "replace words with shortest root" | Trie of dictionary roots |
| "word search II (many words in grid)" | Trie + DFS board |
| "autocomplete system" | Trie + DFS collect / hot ranking |
| "longest word with all prefixes" | Trie + BFS/DFS |
| "maximum XOR of two numbers" | binary bit Trie |
| "count distinct substrings" | suffix insertions into Trie |
| "stream of characters / suffix query" | Trie of reversed words or Aho-Corasick |

---

## 3. Template Skeletons (C++)

### A. Classic Trie

```cpp
struct TrieNode {
    TrieNode* next[26]{};
    bool end = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}
    void insert(const string& w) {
        TrieNode* cur = root;
        for (char ch : w) {
            int i = ch - 'a';
            if (!cur->next[i]) cur->next[i] = new TrieNode();
            cur = cur->next[i];
        }
        cur->end = true;
    }
    bool search(const string& w) {
        TrieNode* cur = root;
        for (char ch : w) {
            int i = ch - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return cur->end;
    }
    bool startsWith(const string& p) {
        TrieNode* cur = root;
        for (char ch : p) {
            int i = ch - 'a';
            if (!cur->next[i]) return false;
            cur = cur->next[i];
        }
        return true;
    }
};
```

### B. Map-based Node (unicode / sparse)

```cpp
struct Node {
    unordered_map<char, Node*> next;
    bool end = false;
};
```

### C. Replace Words (shortest root)

```cpp
string replaceWords(vector<string>& dictionary, string sentence) {
    Trie trie;
    for (auto& w : dictionary) trie.insert(w);
    auto rootOf = [&](const string& w) {
        TrieNode* cur = trie /* expose root carefully in real code */;
        // walk until end flag: return prefix so far
        string pref;
        TrieNode* node = /* root */;
        for (char ch : w) {
            int i = ch - 'a';
            if (!node->next[i]) return w;
            node = node->next[i];
            pref.push_back(ch);
            if (node->end) return pref;
        }
        return w;
    };
    // split sentence by space, map rootOf, join
    // (full join omitted for brevity — implement in practice)
    return sentence;
}
```

### D. Word Search II — Trie + Board DFS

```cpp
struct TNode {
    TNode* next[26]{};
    string word; // store full word at terminal
};

void insert(TNode* root, const string& w) {
    TNode* cur = root;
    for (char ch : w) {
        int i = ch - 'a';
        if (!cur->next[i]) cur->next[i] = new TNode();
        cur = cur->next[i];
    }
    cur->word = w;
}

void dfs(vector<vector<char>>& board, int r, int c, TNode* node, vector<string>& ans) {
    char ch = board[r][c];
    if (ch == '#' || !node->next[ch - 'a']) return;
    node = node->next[ch - 'a'];
    if (!node->word.empty()) {
        ans.push_back(node->word);
        node->word.clear(); // avoid duplicates
    }
    board[r][c] = '#';
    static int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
    for (int k = 0; k < 4; ++k) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr >= 0 && nc >= 0 && nr < (int)board.size() && nc < (int)board[0].size())
            dfs(board, nr, nc, node, ans);
    }
    board[r][c] = ch;
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    TNode* root = new TNode();
    for (auto& w : words) insert(root, w);
    vector<string> ans;
    for (int i = 0; i < (int)board.size(); ++i)
        for (int j = 0; j < (int)board[0].size(); ++j)
            dfs(board, i, j, root, ans);
    return ans;
}
```

### E. Binary Trie for Max XOR

```cpp
struct BitNode { BitNode* next[2]{}; };

void bitInsert(BitNode* root, int x) {
    BitNode* cur = root;
    for (int b = 31; b >= 0; --b) {
        int bit = (x >> b) & 1;
        if (!cur->next[bit]) cur->next[bit] = new BitNode();
        cur = cur->next[bit];
    }
}

int maxXor(BitNode* root, int x) {
    BitNode* cur = root;
    int ans = 0;
    for (int b = 31; b >= 0; --b) {
        int bit = (x >> b) & 1;
        int want = bit ^ 1;
        if (cur->next[want]) {
            ans |= (1 << b);
            cur = cur->next[want];
        } else {
            cur = cur->next[bit];
        }
    }
    return ans;
}
```

---

## 4. Common Variants

| Variant | Extra field on node |
|---|---|
| Count prefix | `cnt` of passes |
| Delete words | `cnt` / refcount |
| Autocomplete top-k | store hot sentences at node |
| Word Search II | store word string; erase after found |
| XOR | 2 children only (0/1) |
| Compressed Trie | edge stores substring |

---

## 5. Traps

1. **Using set of words + board DFS without Trie** — TLE on Word Search II.  
2. **Not marking end** — `startsWith` vs `search` confusion.  
3. **Memory leaks** in interviews — usually OK; mention ownership.  
4. **Index `ch - 'a'`** assuming lowercase only.  
5. **Failing to restore board** in DFS.  
6. **Duplicate answers** — clear `node->word` after push.  
7. **Binary Trie bit order** — MSB first for max XOR.  
8. **Huge alphabet** — use map instead of array[26].

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "HashSet is always enough" | Prefix queries O(L) each rebuild | Trie shares prefixes |
| "Sort dictionary for prefixes" | Awkward for many queries | Trie |
| "Run Word Search I per word" | Too slow | One Trie + one board walk |
| "XOR = try all pairs" | O(n²) | Bit Trie O(n * 32) |
| "Trie replaces all string DP" | Word Break may still need DP | Combine tools |

---

## 7. Decision Mini-Tree

```text
Many strings + prefix / dictionary?
├─ Insert/search/startsWith API → Classic Trie
├─ Shortest root / replace → Trie walk until end
├─ Many words in grid → Trie + DFS mark
├─ Max XOR → Binary bit Trie
└─ Few exact lookups only → Hash set
```

---

## 8. Example Problems

1. Implement Trie (Prefix Tree)  
2. Design Add and Search Words Data Structure  
3. Word Search II  
4. Replace Words  
5. Longest Word in Dictionary  
6. Map Sum Pairs  
7. Maximum XOR of Two Numbers in an Array  
8. Maximum XOR With an Element From Array  
9. Search Suggestions System  
10. Palindrome Pairs (Trie advanced)  
11. Concatenated Words  
12. Stream of Characters  
13. Implement Magic Dictionary  
14. Word Break II (Trie optional)  
15. Count Prefix and Suffix Pairs  

---

## 9. Complexity

| Op | Time |
|---|---|
| Insert / search word length L | O(L) |
| Space | O(total characters across words) |
| Max XOR insert/query | O(32) or O(bit width) |

---

## 10. Interview Script

> "I'll store the dictionary in a Trie so shared prefixes collapse. On the board I'll DFS only along Trie edges; when I hit a terminal word I record it and clear the marker to avoid duplicates."

---

## Revision Checklist

- [ ] Classic Trie insert/search/startsWith  
- [ ] Word Search II combo  
- [ ] Binary Trie XOR idea  
- [ ] When hash set is enough vs Trie  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** Implement Trie once cold, then Word Search II, then XOR.
