# Singly & Doubly Linked List — Core Lesson

> Previous: Arrays & Strings. Next: Fast–Slow Pointers (cycle / middle / palindrome on lists).

---

## 1. What is it?

A **linked list** is a chain of **nodes**. Each node holds:

- a **value** (the data)
- one or more **pointers** (addresses) to other nodes

**Singly linked list:** each node points only to the **next** node.  
**Doubly linked list:** each node points to **next** and **prev**.

```text
Singly:   [head] → [A|•] → [B|•] → [C|∅]
Doubly:   ∅ ← [•|A|•] ⇄ [•|B|•] ⇄ [•|C|•] → ∅
```

Unlike an array, nodes are **not** forced to sit in one contiguous memory block. Order lives in the pointers.

---

## 2. Explain like I am 10

Imagine treasure maps.

Each paper says: “Treasure = apple” and “Next map is under the oak tree.”  
You start at the first map (the **head**). To find the third treasure, you follow two arrows. You cannot jump to map #100 without walking.

A **doubly** list is like a map that also says “Previous map was under the rock,” so you can walk backward.

**Memory picture:** a conga line of kids holding the next kid’s hand (singly). Doubly = holding hands both ways.

---

## 3. Real life story

A playlist where each song card says “play this, then go to card X.”

- Insert a new song between two songs: rewrite two arrows. No need to shift every later song like a shelf of DVDs.
- Arrays are great for “song #47 instantly.” Lists are great for “splice here without moving the rest.”

Browsers’ back/forward history is closer to a doubly linked idea: current page, previous, next.

---

## 4. Why does this exist?

Arrays give O(1) index access but inserting/deleting in the middle costs O(n) shifts.

Linked lists trade random access for:

- O(1) insert/delete **once you already hold the node** (or its neighbor)
- flexible size without reallocating a big contiguous block
- building other structures (stacks, queues, adjacency lists, LRU caches with doubly lists)

---

## 5. What problem existed before this?

Early computers had small memory and messy dynamic sizes. People either:

1. Pre-allocated huge arrays (waste), or  
2. Copied entire arrays when they grew (slow)

They needed a structure that could grow one node at a time and splice without sliding thousands of elements.

---

## 6. What happens without it?

- You overuse arrays for every sequence and pay O(n) for middle edits.
- You cannot cleanly implement O(1) splice patterns (some interview list problems).
- Ideas like “reverse links,” “merge two sorted lists,” and “detect cycle” have no natural home.
- Hash map + doubly list (LRU) becomes awkward.

---

## 7. How did people invent this?

From early list processing (Lisp, 1950s): data as cons cells — value + pointer to rest.

Systems programmers used pointer chains for free lists, process lists, and file blocks. “Singly” vs “doubly” was an engineering choice: extra `prev` pointer costs memory but makes delete-from-middle O(1) without a search for the previous node.

---

## 8. Computer intuition

```text
struct Node {
    int val;
    Node* next;      // singly
    // Node* prev;   // doubly also
};
```

- `head` is a pointer to the first node (or `nullptr` if empty).
- Walking: `cur = cur->next` until `nullptr`.
- There is **no** `a[i]` — index `i` needs `i` steps → O(n).
- Creating a node: `new Node(...)` (heap). Forgetting `delete` (or smart pointers) leaks memory.

**Ownership rule in interviews:** usually raw `Node*` for clarity; say who frees what if asked.

---

## 9. Mathematical intuition

Let n = number of nodes.

| Operation | Singly (typical) | Doubly (typical) | Array |
|---|---|---|---|
| Access index i | O(n) | O(n) | O(1) |
| Search value | O(n) | O(n) | O(n) |
| Insert at head | O(1) | O(1) | O(n) shift |
| Insert after known node | O(1) | O(1) | O(n) |
| Delete known node | O(n)* | O(1)** | O(n) |
| Reverse | O(n) | O(n) | O(n) |

\*Singly delete needs previous pointer (or second pass).  
\*\*Doubly: rewire `prev` and `next` if you hold the node.

Space: O(n) nodes; singly ~1 pointer/node, doubly ~2.

---

## 10. Step-by-step working

### Insert at head (singly)

1. Create node `x` with value.  
2. `x->next = head`.  
3. `head = x`.

### Insert after node `p`

1. Create `x`.  
2. `x->next = p->next`.  
3. `p->next = x`.  
Order matters: if you set `p->next = x` first, you lose the rest of the list.

### Delete node after `p` (singly)

1. `t = p->next`.  
2. `p->next = t->next`.  
3. `delete t`.

### Reverse singly list

Three pointers: `prev`, `cur`, `nxt`.

```text
prev = null, cur = head
while cur:
  nxt = cur->next
  cur->next = prev
  prev = cur
  cur = nxt
head = prev
```

---

## 11. Dry run

Reverse `1 → 2 → 3 → ∅`

```text
Start: prev=∅  cur=1→2→3

Step1: nxt=2, 1→∅, prev=1, cur=2
       1→∅    2→3→∅

Step2: nxt=3, 2→1, prev=2, cur=3
       2→1→∅  3→∅

Step3: nxt=∅, 3→2, prev=3, cur=∅
       3→2→1→∅

head = 3
```

---

## 12. Visualization

### Memory (not contiguous)

```text
Heap addresses (example):

0x10: [val=1 | next=0x40]
0x40: [val=2 | next=0x28]
0x28: [val=3 | next=null]
head ──────────┘ points to 0x10

Logical order: 1 → 2 → 3
Physical order: scattered
```

### Dummy (sentinel) node trick

```text
dummy → head → ... → null
Always insert/delete relative to dummy.
Return dummy->next as new head.
Avoids special cases for empty / head change.
```

### Doubly delete

```text
... ⇄ A ⇄ B ⇄ C ⇄ ...
Delete B:
  A->next = C
  C->prev = A
  delete B
```

---

## 13. Complexity

Building a list of n inserts at head: O(n) time, O(n) space.  
Full traversal: O(n).  
Reverse in place: O(n) time, O(1) extra space.  
Recursive reverse: O(n) time, O(n) call stack.

---

## 14. Why this complexity?

Each node is touched a constant number of times. No random jumps — the chain length is n. Extra space is O(1) when you only keep a few pointers (`prev`, `cur`, `nxt`).

Recursive solutions hide O(n) stack — mention this in interviews.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};

struct DListNode {
    int val;
    DListNode* prev;
    DListNode* next;
    DListNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}

ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* t = &dummy;
    while (a && b) {
        if (a->val <= b->val) { t->next = a; a = a->next; }
        else { t->next = b; b = b->next; }
        t = t->next;
    }
    t->next = a ? a : b;
    return dummy.next;
}

// Insert at head
ListNode* pushFront(ListNode* head, int x) {
    return new ListNode(x, head);
}

// Delete first node with value key (singly). Returns new head.
ListNode* deleteValue(ListNode* head, int key) {
    ListNode dummy(0, head);
    ListNode* p = &dummy;
    while (p->next) {
        if (p->next->val == key) {
            ListNode* doomed = p->next;
            p->next = doomed->next;
            delete doomed;
            break; // delete one occurrence
        }
        p = p->next;
    }
    return dummy.next;
}

void freeList(ListNode* head) {
    while (head) {
        ListNode* n = head->next;
        delete head;
        head = n;
    }
}
```

---

## 16. STL usage

C++ STL:

- `std::list<T>` — doubly linked list  
- `std::forward_list<T>` — singly linked list  

```cpp
list<int> dq;           // doubly
dq.push_front(1);
dq.push_back(2);
dq.insert(next(dq.begin()), 99);

forward_list<int> fl;   // singly
fl.push_front(3);
```

In **coding interviews**, prefer hand-written `ListNode*` for LeetCode-style problems. Use STL `list` when the problem is about using a list as a container (e.g., simulation), not about rewiring pointers.

`std::vector` is still the default sequence in C++ unless you need splice semantics.

---

## 17. Brute Force

Many list problems can be “cheated” with an array:

```cpp
vector<int> toArray(ListNode* head) {
    vector<int> a;
    for (auto* p = head; p; p = p->next) a.push_back(p->val);
    return a;
}
// Then solve on vector, rebuild list — O(n) space, often accepted for correctness first
```

Brute reverse: copy to vector, reverse vector, rebuild. Works, wastes space, misses the pointer skill interviewers want.

---

## 18. Better

Use a **dummy node** + iterative pointer rewiring. Keep O(1) extra pointers instead of O(n) arrays when possible.

For “remove Nth from end”: better than two full passes with length is one pass with gap (see fast–slow lesson).

For merge k lists: better than pairwise merge repeatedly without heap is heap of heads — later heap chapter; two-list merge is the base.

---

## 19. Optimal

Classic optima (in-place, O(1) extra):

| Problem | Optimal idea |
|---|---|
| Reverse list | 3-pointer iterative |
| Merge two sorted | Dummy + compare heads |
| Remove duplicates sorted | One walk, skip equal next |
| Intersection of two lists | Two pointers switching heads (or length align) |
| Palindrome list | Slow/fast + reverse second half |

Optimal does **not** mean “shortest code.” It means correct asymptotics + clean edge cases (empty, one node, two nodes).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Lists are always faster than arrays."
  ↓
Fails: Index access and scans with good locality favor arrays
  ↓
Correct: Lists win at splice when you already have the node; arrays win at random access

Wrong: "newNode->next = p->next; p->next = newNode order does not matter."
  ↓
Fails: Setting p->next first loses the rest of the chain
  ↓
Correct: Always hold the old next before overwriting

Wrong: "I can delete a singly node if I only have that node, like doubly."
  ↓
Fails: You cannot rewire previous without prev pointer (unless hack: copy next's value)
  ↓
Correct: Keep prev, or use dummy walk; mention the LeetCode "delete node" hack as special

Wrong: "Recursive reverse is free."
  ↓
Fails: O(n) stack; large n may stack-overflow
  ↓
Correct: Prefer iterative O(1) extra in interviews unless recursion is requested
```

---

## 21. Common mistakes

1. Losing the head pointer after insert/delete  
2. Forgetting `nullptr` checks → segfault  
3. Off-by-one in “remove Nth”  
4. Infinite loop if you create a cycle by mistake  
5. Using freed node (`delete` then still reading)  
6. Comparing wrong fields in merge (`<=` vs `<` for stability)  
7. Returning `dummy` instead of `dummy.next`  
8. Not handling empty list / single node as separate mental cases

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Reverse a linked list. Now do it recursively. Trade-offs?”  
**Expected:** Iterative 3-pointer O(1) space; recursive elegant but O(n) stack; dry-run on 1–2–3; discuss null head.

### Amazon
**Ask:** “Merge two sorted lists. What about merge k?”  
**Expected:** Dummy node merge O(n+m). For k lists: heap O(N log k) or divide-and-conquer merge.

### Microsoft
**Ask:** “Detect if two lists intersect.”  
**Expected:** Length difference align, or two-pointer switch: when one hits null, continue at other head — meet at intersection or both null. Mention hash of addresses as O(n) space alternative.

### OpenAI
**Ask:** “When would you refuse a linked list in a real system?”  
**Expected:** Cache locality, vector growth amortization, index-heavy workloads; use list for true O(1) splice / LRU node move; otherwise `vector`/`deque`.

**Interview phrase:**

```text
"I'll use a dummy head to avoid edge cases, rewire pointers carefully
by saving next before overwrite, and keep O(1) extra space with iteration."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| LRU / LFU cache | Hash map + doubly linked list |
| Undo stacks of edits | List of operations |
| Memory allocators | Free lists of blocks |
| OS process / wait queues | Sometimes list-like chains |
| Text editors (idea) | Piece tables / ropes more common, but list intuition for splice |
| Adjacency “list” graphs | Vector of vectors today; classic was pointer lists |

---

## 24. Related concepts + pattern recognition cues

**Related:** fast–slow pointers, stacks (reverse polish with list), recursion on lists, XOR linked list (trivia), skip lists (advanced).

| Cue | Think linked list |
|---|---|
| “Rewire pointers / in-place reverse” | Yes |
| “O(1) insert given node” | Yes |
| “Random access by index” | Prefer array |
| “Cycle / middle / palindrome list” | List + fast–slow |
| “LRU cache” | Doubly list + hashmap |

**Decision snack:**

```text
Need index i often? → array/vector
Need splice / move node to front? → doubly list (+ hash for LRU)
LeetCode ListNode*? → dummy + careful next save
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Conga line of nodes
Order is in pointers, not addresses
Save next before you overwrite
Dummy head kills edge-case bugs
Singly = forward only; Doubly = both ways
```

### Checklist

- [ ] Draw singly vs doubly  
- [ ] Dry-run reverse on 3 nodes  
- [ ] Code merge two sorted from memory  
- [ ] Explain dummy node  
- [ ] State complexities vs array  

### Practice roadmap

1. Easy: Reverse List, Middle (preview), Merge Two Sorted, Remove Linked List Elements, Palindrome List  
2. Medium: Remove Nth From End, Rotate List, Partition List, Add Two Numbers, Intersection  
3. Design: LRU Cache (with doubly + hash)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Redraw conga + reverse dry-run |
| 3 | Code reverse + merge blind |
| 7 | Dummy: remove Nth + reverse; speak complexities |
| 15 | Timed Medium list problem |
| 30 | Teach dummy node + delete pitfalls out loud |
| 90 | Mock: reverse + merge + intersection |

```text
Item: Singly & Doubly Linked List
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
