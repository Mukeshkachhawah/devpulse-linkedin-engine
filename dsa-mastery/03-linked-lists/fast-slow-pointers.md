# Fast–Slow Pointers on Linked Lists — Core Lesson

> Previous: Singly & Doubly Linked Lists. Next module: Stacks & Queues.

---

## 1. What is it?

**Fast–slow pointers** (Floyd’s idea family) means two pointers walk the same linked list at **different speeds**.

Classic speeds:

- **Slow** moves 1 step  
- **Fast** moves 2 steps  

Used for:

1. Find the **middle**  
2. Detect a **cycle**  
3. Find **cycle start**  
4. Check **palindrome** (middle + reverse half)  
5. Remove **Nth from end** (gap of n between two pointers)

```text
slow:  * → * → *
fast:  * → → * → → *
```

---

## 2. Explain like I am 10

Two friends run on a path of stepping stones.

One friend takes **one** stone per beat. The other takes **two**.

If the path is a straight line, the fast friend hits the end first — and when they do, the slow friend is near the **middle**.

If the path secretly loops like a race track, the fast friend will **lap** the slow friend and they meet again inside the loop.

**Memory picture:** tortoise and hare on a circular track.

---

## 3. Real life story

Security guard checks if a one-way trail has a loop back to an old sign.

Walking twice as fast, if you meet your partner again, the trail loops. If you reach a dead end, no loop.

Same idea finds the middle of a playlist without counting songs first: when the “skip two tracks” finger finishes, the “one track” finger is halfway.

---

## 4. Why does this exist?

Counting length needs one full pass, then another pass to middle → two passes / extra storage.

Fast–slow finds middle or cycle in **one pass**, O(1) extra memory — important for interviews and huge lists.

Cycle detection without rewriting nodes or using a hash set of addresses is the classic win.

---

## 5. What problem existed before this?

People detected cycles by:

- Marking visited nodes (needs writable flag or hash set)  
- Or trusting that lists never cycle  

In graph/list algorithms, accidental cycles cause infinite loops. Floyd (1960s) gave a constant-space detection method for sequences.

---

## 6. What happens without it?

- Middle-of-list problems become clumsy two-pass length code  
- Cycle bugs hang your program  
- Palindrome-on-list and “remove Nth from end” use more space or more passes than interviewers like  
- You miss a standard FAANG pattern question

---

## 7. How did people invent this?

**Floyd’s cycle-finding algorithm** (Robert Floyd): tortoise and hare in a sequence `x, f(x), f(f(x)), ...`.

If a cycle exists, the hare eventually meets the tortoise inside the cycle. Math uses modular arithmetic on cycle length.

Teaching later specialized it to linked lists and interview variants (entry point, middle, happy number as functional graph).

---

## 8. Computer intuition

```text
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) { /* cycle meet */ }
}
```

**Null checks:** fast moves two — must ensure `fast` and `fast->next` exist.

**Middle:** when fast cannot move, slow is middle (for even length, convention matters: first or second middle — know which LeetCode wants).

**Nth from end:** `fast` starts n steps ahead; move both until fast ends; slow is at target’s previous/target depending on setup.

---

## 9. Mathematical intuition

### Middle

If length = n, after ~n/2 loop iterations, slow advanced ~n/2 → middle. Fast advanced ~n → end. Time O(n).

### Cycle meeting

Let:

- μ = steps before cycle starts  
- λ = cycle length  

When tortoise has walked k, hare walked 2k. Meeting when `k ≡ 2k (mod λ)` after both are in cycle → `k` multiple of λ. They meet after O(μ + λ) steps.

### Cycle entrance

After meeting, put one pointer to head; both walk 1 step. They meet at entrance. Proof sketch: distances align so both reach start of cycle after equal remaining steps.

---

## 10. Step-by-step working

### A) Middle of list

1. `slow = fast = head`  
2. While `fast && fast->next`: move slow 1, fast 2  
3. Return slow  

Odd: `1-2-3-4-5` → slow at 3.  
Even: `1-2-3-4` → often slow at 3 (second middle) with this template.

### B) Has cycle

1. Same moves  
2. If `slow == fast` before fast null → true  
3. If fast hits null → false  

### C) Cycle start

1. Detect meet node  
2. `p = head`, `q = meet`  
3. While `p != q`: both `= next`  
4. Return p  

### D) Remove Nth from end

1. Dummy → head  
2. `fast = dummy`, advance n+1 steps (or n then careful)  
3. `slow = dummy`  
4. Move both until fast null  
5. `slow->next = slow->next->next`  

---

## 11. Dry run

### Cycle detect

```text
1 → 2 → 3 → 4 → 5
         ↑         ↓
         ←←←←←←←←←

slow/fast start at 1
move: s=2,f=3
move: s=3,f=5
move: s=4,f=4  MEET → cycle exists
```

### Cycle entrance (continue)

```text
meet at 4
p=head(1), q=4
p=2,q=5
p=3,q=3  MEET → entrance = 3
```

### Middle

```text
1→2→3→4→5→∅
s=1,f=1
s=2,f=3
s=3,f=5
fast->next null → stop, middle=3
```

---

## 12. Visualization

```text
TORTOISE & HARE

Straight list:
H ----→----→----→ END
T --→--→ middle when H done

Cycle:
      ┌──────────────┐
      ↓              │
 * → * → * → * → * ─┘
     μ    └── λ ──┘

Meet somewhere in λ ring
Then head + meet walk → entrance
```

### Palindrome pattern

```text
1 → 2 → 2 → 1

Find mid, reverse second half:
1 → 2    1 → 2 → ∅  (reversed second)
Compare first half vs reversed second
Restore list if required (nice interview touch)
```

---

## 13. Complexity

| Task | Time | Extra space |
|---|---|---|
| Middle | O(n) | O(1) |
| Has cycle | O(n) | O(1) |
| Cycle start | O(n) | O(1) |
| Palindrome (rev half) | O(n) | O(1) |
| Hash-set cycle | O(n) | O(n) |

---

## 14. Why this complexity?

Each pointer visits each node at most a constant number of times before meeting or ending. No nested full scans. Space stays O(1) because we store only two (or three) pointers, not a visited set.

Meeting is guaranteed if a cycle exists because relative speed is 1 node/step inside the ring.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    bool found = false;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) { found = true; break; }
    }
    if (!found) return nullptr;
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow;
}

ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode* fast = &dummy;
    ListNode* slow = &dummy;
    for (int i = 0; i < n + 1; i++) {
        if (!fast) return head; // invalid n
        fast = fast->next;
    }
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    ListNode* doomed = slow->next;
    slow->next = doomed->next;
    delete doomed; // omit on LeetCode judges that don't free
    return dummy.next;
}

bool isPalindrome(ListNode* head) {
    if (!head || !head->next) return true;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    // reverse second half starting at slow->next
    ListNode* prev = nullptr;
    ListNode* cur = slow->next;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    ListNode* p1 = head;
    ListNode* p2 = prev;
    bool ok = true;
    while (p2) {
        if (p1->val != p2->val) { ok = false; break; }
        p1 = p1->next;
        p2 = p2->next;
    }
    // optional: reverse back to restore
    return ok;
}
```

---

## 16. STL usage

No STL container replaces this pattern on `ListNode*`. Related:

- `unordered_set<ListNode*>` for O(n) space cycle detect (brute/better teaching step)  
- For arrays, “fast/slow” often means read/write indices (different chapter)

Happy Number uses the same tortoise–hare on the sum-of-squares function — not a list, same math.

---

## 17. Brute Force

```cpp
bool hasCycleBrute(ListNode* head) {
    unordered_set<ListNode*> seen;
    for (auto* p = head; p; p = p->next) {
        if (seen.count(p)) return true;
        seen.insert(p);
    }
    return false;
}
// O(n) time, O(n) space
```

Middle brute: count length, walk length/2.

---

## 18. Better

One pass length + second pass is fine for middle (still O(n)) but two logical passes. Fast–slow is cleaner.

For cycle, marking nodes (if allowed) is O(1) extra but **mutates** data — often forbidden.

---

## 19. Optimal

Floyd: O(n) time, O(1) space for detect + entrance.  
Middle / Nth-from-end / palindrome-with-reverse: O(n)/O(1).

Know even-length middle convention and whether to restore the list after palindrome check.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "If I only check fast->next, I'm safe."
  ↓
Fails: fast->next->next can still crash if fast->next is null
  ↓
Correct: while (fast && fast->next)

Wrong: "Meeting point IS the cycle start."
  ↓
Fails: They meet anywhere in the ring
  ↓
Correct: Second phase: one pointer to head, both speed 1

Wrong: "For even length, middle is unique."
  ↓
Fails: Two middles — problem statement picks one
  ↓
Correct: Confirm with example before coding

Wrong: "Remove Nth: advance fast by n, not n+1, with dummy."
  ↓
Fails: Off-by-one deletes wrong node or null deref
  ↓
Correct: Dry-run n=1 (delete last) and n=length (delete head)
```

---

## 21. Common mistakes

1. Null dereference on `fast->next->next`  
2. Starting slow/fast wrong for “first middle” vs “second middle”  
3. Forgetting dummy on remove-Nth when deleting head  
4. Infinite loop if you check equality before moving (depends on init)  
5. Comparing values instead of pointer identity for cycle  
6. Breaking the list when reversing half and not linking carefully  
7. Claiming O(1) space while using recursion for reverse of whole list

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Prove or explain why the entrance algorithm works.”  
**Expected:** Sketch μ, λ; after meet, distances congruent; head and meet meet at start. Need not full formal proof — clear modular intuition.

### Amazon
**Ask:** “Remove Nth node from end in one pass.”  
**Expected:** Dual pointers with gap; dummy; test delete head and delete tail.

### Microsoft
**Ask:** “Palindrome linked list in O(1) space.”  
**Expected:** Middle, reverse second half, compare; mention restore; discuss odd/even.

### OpenAI
**Ask:** “Hash set vs Floyd — when prefer hash?”  
**Expected:** Hash simpler, O(n) memory; Floyd when memory tight or mutation forbidden and constant space required; parallel/functional settings may prefer immutable + set.

**Interview phrase:**

```text
"I'll use tortoise and hare: slow one step, fast two.
If they meet, there is a cycle; then reset one pointer to head
to find the entrance. For middle, stop when fast cannot move."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Detect infinite retries / loops in state machines | Functional Floyd |
| Find median in one-pass stream of unknown length (list form) | Middle |
| Memory corruption / pointer loops in low-level debug | Cycle ideas |
| Playlist / UI carousel edge cases | Circular lists careful handling |
| Happy Number / repeated function iteration | Same algorithm |

---

## 24. Related concepts + pattern recognition cues

**Related:** two pointers on arrays, cycle sort (different), graph cycle DFS colors, Brent’s cycle algorithm (variant).

| Cue | Pattern |
|---|---|
| Cycle in list / functional graph | Fast–slow |
| Middle without length | Fast–slow |
| Nth from end one pass | Lead pointer gap |
| Palindrome list O(1) space | Mid + reverse |
| Need visited nodes anyway for graph | DFS/BFS colors, not Floyd |

**Decision snack:**

```text
List + cycle? → Floyd
List + middle / half? → fast–slow
List + from end? → gap pointers (+ dummy)
Need path nodes stored? → stack / reverse / vector
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Tortoise 1, Hare 2
Meet ⇒ cycle
Head + meet ⇒ entrance
Fast done ⇒ slow at middle
Gap of n ⇒ Nth from end
```

### Checklist

- [ ] Write `while (fast && fast->next)` without peeking  
- [ ] Dry-run cycle entrance  
- [ ] Code remove Nth with dummy  
- [ ] Explain even middle convention  
- [ ] Palindrome half-reverse steps  

### Practice roadmap

1. Easy: Middle of Linked List, Linked List Cycle, Palindrome Linked List  
2. Medium: Linked List Cycle II, Remove Nth From End, Reorder List, Happy Number  
3. Harder combo: Reverse Nodes in k-Group (uses list skills + segments)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Tortoise/hare picture + cycle dry-run |
| 3 | Code hasCycle + detectCycle blind |
| 7 | Palindrome + remove Nth timed |
| 15 | Explain entrance math in 2 minutes |
| 30 | Mixed list mock (cycle + reverse) |
| 90 | Full list mock set |

```text
Item: Fast–Slow Pointers (Linked List)
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
