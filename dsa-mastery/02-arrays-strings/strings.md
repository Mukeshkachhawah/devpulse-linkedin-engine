# Strings — Core Lesson

> Previous: Arrays. Next: Two Pointers, Sliding Window. A string is an array of characters with extra rules.

---

## 1. What is it?

A **string** is a sequence of characters. In C++, `string` behaves like a dynamic array of `char`.

```text
s = "hello"
Index: 0 1 2 3 4
Char:  h e l l o
```

Key words:

- **Character** — one letter/symbol (`'a'`, `'1'`, `' '`)
- **Substring** — contiguous piece (`"ell"` inside `"hello"`)
- **Subsequence** — letters in order, not necessarily contiguous (`"hlo"`)
- **Palindrome** — reads same forward and backward (`"level"`)
- **Immutable in spirit (interview talk)** — often treat string content carefully; in C++ `string` is mutable, but many APIs return new strings

---

## 2. Explain like I am 10

A string is a word made of beads on a string.

```text
h - e - l - l - o
```

You can look at bead 0, bead 1, and so on.  
A **substring** is a straight piece of the necklace without skipping.  
A **subsequence** can skip beads but keep order.

**Memory picture:** beads on one thread = string.

---

## 3. Real life story

Your name on a form: `R A V I`.

- Change letter 2 → still a name string
- Check if the name is a palindrome → compare ends toward center
- Search if `"VI"` appears → slide a small window across the name

Chat apps, search boxes, and compilers all chew on strings all day.

---

## 4. Why does this exist?

Humans communicate with text. Computers store text as numbers (encodings like ASCII/UTF-8). Strings package those character sequences so we can compare, search, split, and transform them.

Almost every product has string work: URLs, usernames, logs, prompts, JSON keys.

---

## 5. What problem existed before this?

People used raw character arrays with a special end marker (`'\0'` in C). Easy to overflow. Easy to forget the null. Harder to pass around safely.

`std::string` exists to manage length and memory more safely while keeping array-like access.

---

## 6. What happens without it?

Without a string type:

- Manual buffers everywhere
- Off-by-one length bugs
- Painful concatenation
- Interview problems become messy C buffer surgery

You still must understand that underneath, it is still an array of characters.

---

## 7. How did people invent this?

Early systems stored text as byte sequences. ASCII mapped letters to numbers (`'A' = 65`). Later Unicode / UTF-8 handled world languages.

Algorithms grew on top: string matching (KMP, Rabin-Karp), tries, rolling hash, suffix arrays. Interviews usually start with two pointers, frequency maps, and sliding windows — advanced string algos come later in `11-advanced`.

---

## 8. Computer intuition

```text
string s = "cat";

Logical:
[ c | a | t ]
  0   1   2

s.size() == 3
s[0] == 'c'
s += 's' → "cats"  (may reallocate like vector)
```

Comparison is lexicographic (dictionary order): compare first differing character.

```text
"apple" < "apricot"  because 'p' < 'r' at first diff
```

Case matters: `'A'` and `'a'` are different values.

---

## 9. Mathematical intuition

For length `n`:

| Operation | Cost |
|---|---|
| Access `s[i]` | O(1) |
| Scan all chars | O(n) |
| Concatenate `a+b` | O(|a|+|b|) typically |
| Compare two strings | O(min length until diff) |
| Build reverse copy | O(n) |
| All substrings count | O(n²) substrings (not the same as listing all in O(n²) time always — listing can be more) |

Anagram check: same character frequencies → compare count arrays of size alphabet (often 26 or 128/256).

Palindrome check: about `n/2` comparisons → O(n).

---

## 10. Step-by-step working

**Is palindrome?**

1. Left = 0, Right = n-1
2. While left < right: if s[left] != s[right] → false; else move inward
3. True if all matched

**Valid anagram?**

1. If lengths differ → false
2. Count letters of s
3. Decrease counts using t
4. All counts zero → true

**Reverse words in a sentence** (common Medium):

1. Trim spaces
2. Split into words (or reverse whole string, then reverse each word)
3. Join with single spaces

---

## 11. Dry run

Palindrome `"abba"`:

```text
l=0 r=3: s[0]=a, s[3]=a OK → l=1 r=2
l=1 r=2: s[1]=b, s[2]=b OK → l=2 r=1 stop
True
```

Anagram `"listen"` vs `"silent"`:

```text
counts after listen: e1 i1 l1 n1 s1 t1
apply silent: each goes to 0
True
```

Not anagram `"hello"` vs `"world"`: counts will not clear.

---

## 12. Visualization

```text
Palindrome pointers
a b c b a
^       ^
l       r
  ^   ^
  l   r
    ^
   meet → success
```

Frequency map (lowercase):

```text
char:  a b c ... z
count: 2 1 0 ... 0
```

Substring vs subsequence:

```text
String:     a c b d
Substring:  c b     (contiguous)
Subsequence:a b d   (order kept, gaps OK)
```

---

## 13. Complexity

Typical interview string scans: **O(n)** time, **O(1)** or **O(k)** space where k is alphabet size (26) or distinct chars.

Building all permutations is factorial — not for normal interview scans.

Sliding window on strings: often O(n) with a map/set.

---

## 14. Why this complexity?

Each character is visited a constant number of times in a clean one-pass design.

Frequency arrays of size 26 are O(1) space relative to n (alphabet fixed).

If you copy large strings inside a loop, accidental O(n²) appears — avoid `s = s + c` in a hot loop; use `push_back` or `+=` carefully / reserve.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(const string& s) {
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++;
        r--;
    }
    return true;
}

bool isAnagram(const string& s, const string& t) {
    if (s.size() != t.size()) return false;
    array<int, 26> cnt{};
    for (char c : s) cnt[c - 'a']++;
    for (char c : t) {
        cnt[c - 'a']--;
        if (cnt[c - 'a'] < 0) return false;
    }
    return true;
}

string reverseWords(string s) {
    // Simplified: assumes single spaces, no leading/trailing space
    reverse(s.begin(), s.end());
    int n = s.size(), i = 0;
    while (i < n) {
        int j = i;
        while (j < n && s[j] != ' ') j++;
        reverse(s.begin() + i, s.begin() + j);
        i = j + 1;
    }
    return s;
}
```

---

## 16. STL usage

| Tool | Use |
|---|---|
| `string` | Main type |
| `s.size()`, `s.empty()` | Length |
| `s.push_back(c)` / `s += c` | Append char |
| `s.substr(pos, len)` | Copy substring (O(len)) |
| `s.find(sub)` | Search (return `npos` if missing) |
| `getline(cin, s)` | Read full line |
| `stoi`, `to_string` | Parse / build numbers |
| `stringstream` | Split by spaces |

Careful: `substr` copies. In hot code, prefer index ranges `(l, r)` over making many copies.

---

## 17. Brute Force

Longest substring without repeating characters — try every pair (i, j):

```cpp
int lengthOfLongestSubstringBrute(const string& s) {
    int n = s.size(), best = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            array<int, 256> seen{};
            bool ok = true;
            for (int k = i; k <= j; k++) {
                if (seen[(unsigned char)s[k]]++) { ok = false; break; }
            }
            if (ok) best = max(best, j - i + 1);
        }
    }
    return best;
}
// O(n^3) or O(n^2) with smarter inner check — still too slow for large n
```

---

## 18. Better

For each start `i`, extend `j` until repeat, use a set:

Still often O(n²), but clearer. Mentally: check all windows smarter.

---

## 19. Optimal

Sliding window + last seen index / frequency:

```cpp
int lengthOfLongestSubstring(const string& s) {
    vector<int> last(256, -1);
    int best = 0, start = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        unsigned char c = s[i];
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        best = max(best, i - start + 1);
    }
    return best;
}
// O(n) time, O(alphabet) space
```

Full sliding window chapter expands this pattern.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Substring and subsequence are the same."
  ↓
Fails: "ace" is subsequence of "abcde" but not a substring
  ↓
Correct: substring = contiguous; subsequence = order only

Wrong: "I can compare strings for anagram with sorting only idea forever."
  ↓
Fails: sorting is O(n log n); counting is O(n) for fixed alphabet
  ↓
Correct: Prefer frequency count when alphabet is small

Wrong: "s[i] = toupper in loop without unsigned char care"
  ↓
Fails: undefined behavior if char is signed and negative
  ↓
Correct: cast to unsigned char for ctype functions
```

---

## 21. Common mistakes

1. Forgetting empty string edge cases
2. Off-by-one in windows `[l, r]`
3. Mutating string while iterating indices carelessly
4. Using `==` on huge strings repeatedly inside nested loops
5. Assuming only lowercase a-z when input has digits/spaces/Unicode
6. Confusing `char` with `string` (`'a'` vs `"a"`)
7. Building strings with repeated full copies → accidental quadratic time

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** "Difference between substring and subsequence?"  
**Expected:** Contiguous vs not; give examples; maybe mention DP for subsequence problems.

**Ask:** "How check anagram in O(n)?"  
**Expected:** Frequency array / map; length check first.

### Amazon
**Ask:** "Validate palindrome ignoring non-alphanumeric and case."  
**Expected:** Two pointers with skip logic; speak edge cases; O(n) time O(1) space.

### Microsoft
**Ask:** "Reverse words in a string; clean spaces."  
**Expected:** Trim, reverse whole + reverse words, or stringstream; discuss in-place vs extra space.

### OpenAI
**Ask:** "Token strings are huge — how find longest unique-char window?"  
**Expected:** Sliding window; streaming mindset; clarify encoding/alphabet; complexity with large alphabets.

**Phrase to use:**

```text
"I'll treat the string as a char array. Constraints on alphabet decide
whether I use int[26], int[128], or a hash map."
```

---

## 23. Company use cases

| Area | String work |
|---|---|
| Google | Query normalization, autocomplete |
| Amazon | Product titles, search keywords |
| Microsoft | Editors, compilers, Office text |
| OpenAI | Prompts, tokenization boundaries, chat text |
| Web backends | Validation, routing, parsing JSON fields |

As a NestJS/React developer: input validation, slugify, search — same patterns as DSA string drills.

---

## 24. Related concepts + pattern recognition cues

**Related:** arrays, two pointers, sliding window, hashing, trie (later), KMP/Z-algo (advanced).

| Cue | Pattern |
|---|---|
| Palindrome / compare ends | Two pointers |
| Longest/shortest substring with property | Sliding window |
| Anagram / same letters | Frequency count |
| Pattern search | KMP / rolling hash (later) / `find` for easy |
| Word breaks / splits | DP + set of words |
| Parentheses in string | Stack |

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
String = beads on a thread (char array)
Substring = contiguous piece
Subsequence = keep order, can skip
Tools: two pointers, counts[26], sliding window
```

### Checklist

- [ ] Define substring vs subsequence with examples
- [ ] Dry-run palindrome + anagram
- [ ] Code both in C++ from memory
- [ ] Explain O(n) longest unique substring idea
- [ ] List alphabet-size space choices

### Practice roadmap

1. Easy: Valid Palindrome, Reverse String, Anagram, First Unique Char
2. Medium: Longest Substring Without Repeat, Longest Palindromic Substring (expand centers), String to Integer (atoi), Group Anagrams
3. Hard later: Minimum Window Substring, Edit Distance (DP chapter)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recall definitions + memory picture |
| 3 | Dry-run palindrome with skip-non-alnum variant |
| 7 | Code anagram + reverse words from memory |
| 15 | Timed Medium string problem |
| 30 | Teach strings for 5 minutes |
| 90 | Mixed mock: 2 string problems |

```text
Item: Strings core
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
