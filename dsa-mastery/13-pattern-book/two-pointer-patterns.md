# Two-Pointer Patterns

> **Goal:** See a sorted array / string / linked list and instantly know *which* two-pointer move to make.

---

## 1. When to Use

Use two pointers when:

1. The input is **sorted** (or you can sort without changing the answer).
2. You need a **pair / triple** that satisfies a condition (sum, difference, product).
3. You must compare from **both ends** (palindrome, reverse, container with water).
4. You remove duplicates **in place** while scanning once.
5. A linked list needs middle / cycle / nth-from-end (slow + fast).

**Kid idea:** Two fingers on a ruler. Move the left finger right, or the right finger left, until they meet the rule.

---

## 2. Recognition Cues (Interview Triggers)

| Cue in the problem | Likely pattern |
|---|---|
| "sorted array", "non-decreasing" | opposite ends or same-direction |
| "pair with sum = target" | opposite ends |
| "remove duplicates in-place" | slow / fast write |
| "palindrome" | opposite ends on string |
| "container / max area" | opposite ends, move the shorter |
| "cycle in linked list" | slow + fast (Floyd) |
| "middle of linked list" | slow + fast |
| "nth node from end" | gap of n between pointers |
| "3Sum / 4Sum" | fix one + two-pointer on rest |
| "partition / Dutch flag" | low / mid / high |

**Smell test:** If nested loops check every pair → ask: *Can I move one pointer smartly instead of restarting?*

---

## 3. Template Skeletons (C++)

### A. Opposite Ends (sorted pair / area / palindrome)

```cpp
// Sorted array: find if two numbers sum to target
bool twoSumSorted(vector<int>& a, int target) {
    int L = 0, R = (int)a.size() - 1;
    while (L < R) {
        long long sum = 1LL * a[L] + a[R];
        if (sum == target) return true;
        if (sum < target) ++L;   // need bigger sum
        else --R;                // need smaller sum
    }
    return false;
}
```

### B. Same Direction — Slow / Fast Write (in-place filter)

```cpp
// Remove duplicates from sorted array; return new length
int removeDuplicates(vector<int>& a) {
    if (a.empty()) return 0;
    int slow = 0; // last kept index
    for (int fast = 1; fast < (int)a.size(); ++fast) {
        if (a[fast] != a[slow]) {
            ++slow;
            a[slow] = a[fast];
        }
    }
    return slow + 1;
}
```

### C. Slow + Fast on Linked List

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Middle node (second middle if even)
ListNode* middle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

// Cycle detection
bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
```

### D. Three Pointers — Dutch National Flag

```cpp
void sortColors(vector<int>& a) {
    int lo = 0, mid = 0, hi = (int)a.size() - 1;
    while (mid <= hi) {
        if (a[mid] == 0) swap(a[lo++], a[mid++]);
        else if (a[mid] == 1) ++mid;
        else swap(a[mid], a[hi--]); // do NOT mid++
    }
}
```

---

## 4. Common Variants

| Variant | Move rule | Classic problem |
|---|---|---|
| Opposite ends sum | sum small → L++, sum big → R-- | Two Sum II |
| Opposite ends area | move shorter height | Container With Most Water |
| Trapping rain | two ends + maxL/maxR | Trapping Rain Water |
| Slow write | keep unique / valid | Remove Duplicates |
| Partition | swap around pivot | Sort Colors, Move Zeroes |
| Gap pointers | front leads by k | Remove Nth From End |
| Expand center | L--, R++ while equal | Longest Palindromic Substring |
| 3Sum | sort + fix i + two pointers | 3Sum |

---

## 5. Traps

1. **Forgetting sort** when order is not given (Two Sum hash vs Two Sum II).
2. **Moving both pointers** on equal sum when you still need all unique pairs → skip duplicates carefully.
3. **Off-by-one** on `L < R` vs `L <= R`.
4. **Dutch flag:** after swapping with `hi`, do **not** advance `mid` yet.
5. **Linked list:** check `fast && fast->next` before `fast->next->next`.
6. **Overflow:** use `long long` for sums.
7. **Modifying while iterating** without a clear invariant.

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Always O(n²) nested loops for pairs" | Misses sorted structure | Opposite ends O(n) after sort |
| "Move both pointers every time" | Skips valid pairs | Move only the side that can improve |
| "Two pointers works on unsorted for sum" | Order broken | Use hash map, or sort first |
| "Fast pointer starts at head for nth from end" | Wrong gap | Advance fast by n first |
| "3Sum: three nested loops is fine" | TLE | Sort + fix one + two pointers |

---

## 7. Decision Mini-Tree

```text
Need pair/region with condition?
├─ Sorted (or can sort)?
│  ├─ Pair from ends → Opposite Ends
│  ├─ In-place unique/filter → Slow Write
│  └─ 3 values → Fix i + Opposite Ends
├─ Linked list middle/cycle/nth?
│  └─ Slow + Fast
└─ Partition into categories?
   └─ Dutch Flag / partition swap
```

---

## 8. Example Problems (Practice Set)

1. Two Sum II — Input Array Is Sorted  
2. 3Sum  
3. 4Sum  
4. Container With Most Water  
5. Trapping Rain Water  
6. Valid Palindrome  
7. Remove Duplicates from Sorted Array  
8. Move Zeroes  
9. Sort Colors  
10. Remove Nth Node From End of List  
11. Linked List Cycle  
12. Middle of the Linked List  
13. Squares of a Sorted Array  
14. Boats to Save People  
15. Next Permutation (adjacent swap thinking)

---

## 9. Complexity Cheat

| Pattern | Time | Extra space |
|---|---|---|
| Opposite ends | O(n) after sort O(n log n) | O(1) |
| Slow write | O(n) | O(1) |
| Slow/fast list | O(n) | O(1) |
| 3Sum | O(n²) | O(1) / O(log n) sort |

---

## 10. How to Say It in Interview

> "Because the array is sorted, I can place pointers at both ends. If the sum is too small I must move left forward; if too large I move right backward. Each step discards one impossible candidate, so we get O(n)."

---

## Revision Checklist

- [ ] I can name 4 two-pointer families  
- [ ] I know when to sort first  
- [ ] I can code slow/fast linked list without null bugs  
- [ ] I skip duplicates correctly in 3Sum  

**Spaced:** Day 0 → Day 1 → Day 3 → Day 7 → Day 14  
**Practice:** 2 opposite-end + 1 linked-list + 1 partition per week until fluent.
