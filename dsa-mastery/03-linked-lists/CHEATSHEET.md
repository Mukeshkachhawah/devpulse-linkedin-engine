# Linked Lists — Cheatsheet

Quick lookup. Simple English. C++ focused.

---

## Decision Tree

```text
Working with ListNode*?
  ├─ Reverse / rewire                 → prev/cur/nxt or dummy
  ├─ Merge sorted                     → dummy + compare
  ├─ Middle / half                    → slow 1, fast 2
  ├─ Cycle?                           → Floyd meet
  ├─ Cycle entrance?                  → meet, then head+meet
  ├─ Nth from end                     → dummy + gap
  ├─ Palindrome O(1) space            → mid + reverse half
  └─ Need index / locality            → copy to vector OR use array from start

Design LRU?
  └─ unordered_map<key, node*> + doubly linked list
```

---

## Formulas / Invariants

```text
// Reverse invariant
// prev = reversed head so far
// cur  = remaining to process
// each step: detach cur, push onto prev

// Floyd
// relative speed 1 inside cycle ⇒ eventually meet
// entrance: from head and from meet, speed 1

// Nth from end with dummy
// advance fast by (n+1), then move together
// slow->next is the node to delete
```

---

## Templates (C++)

### Node

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};
```

### Reverse

```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}
```

### Dummy merge

```cpp
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
```

### Floyd cycle

```cpp
bool hasCycle(ListNode* head) {
    ListNode *s = head, *f = head;
    while (f && f->next) {
        s = s->next; f = f->next->next;
        if (s == f) return true;
    }
    return false;
}
```

### Middle

```cpp
ListNode* middleNode(ListNode* head) {
    ListNode *s = head, *f = head;
    while (f && f->next) { s = s->next; f = f->next->next; }
    return s;
}
```

### Remove Nth from end

```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i < n + 1; i++) fast = fast->next;
    while (fast) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}
```

---

## Complexity Table

| Op | Singly | Notes |
|---|---|---|
| Walk all | O(n) | |
| Index i | O(n) | |
| Push front | O(1) | |
| Delete given only node* | hard | need prev or value-copy hack |
| Reverse | O(n)/O(1) | iterative |
| Cycle detect | O(n)/O(1) | Floyd |

\*Doubly: delete known node O(1) with prev/next.

---

## Interview Lines

```text
"Dummy head avoids special-casing empty/head updates."
"Save next before rewiring."
"Tortoise–hare: O(1) space cycle; then head reset for entrance."
"Lists lose to vector on random access and cache locality."
```

---

## Trap List

```text
[ ] fast && fast->next
[ ] return dummy.next not &dummy
[ ] even-length middle convention
[ ] meeting ≠ entrance
[ ] delete head covered by dummy
[ ] don't use freed pointers
```

---

## Company Cue Map

| Company flavor | Likely ask |
|---|---|
| Google | Reverse + prove cycle entrance intuition |
| Amazon | Remove Nth, merge, practical edge cases |
| Microsoft | Palindrome O(1), intersection |
| OpenAI | Trade-offs list vs vector; LRU design |

---

## Spaced Repetition Hook

Days **1 / 3 / 7 / 15 / 30 / 90** — see lesson §25 and `../00-SPACED-REPETITION.md`.
