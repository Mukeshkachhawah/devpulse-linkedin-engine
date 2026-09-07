# Heap (Priority Queue) Patterns

> **Goal:** Hear "k largest / k smallest / always grab next best / merge sorted" and reach for a heap with the right size and comparator.

---

## 1. When to Use

Use a heap when:

1. You repeatedly need the **current min or max**.  
2. You need **top-k** without full sort.  
3. You merge many sorted streams.  
4. Scheduling by time / urgency (next event).  
5. Dijkstra / Prim needing extract-min.

**Kid idea:** A magic box that always hands you the biggest (or smallest) ticket when you ask.

**STL note:** `priority_queue` in C++ is a **max-heap** by default.

---

## 2. Recognition Cues

| Cue | Heap pattern |
|---|---|
| "kth largest / smallest" | size-k heap |
| "top k frequent" | hash + heap (or bucket) |
| "merge k sorted lists" | min-heap of heads |
| "median from data stream" | two heaps |
| "meeting rooms / CPU / tasks" | min-heap of end times |
| "reorganize string / arrange" | max-heap by freq |
| "cheapest / next smallest edge" | Dijkstra / Prim |
| "ugly numbers / super ugly" | min-heap generation |
| "k closest points" | max-heap of size k |

---

## 3. Template Skeletons (C++)

### A. Kth Largest — Min-Heap of Size K

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minH; // keep k largest
    for (int x : nums) {
        minH.push(x);
        if ((int)minH.size() > k) minH.pop();
    }
    return minH.top();
}
```

### B. Top K Frequent

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) ++freq[x];
    // min-heap by frequency, size k
    using P = pair<int,int>; // {freq, val}
    priority_queue<P, vector<P>, greater<P>> h;
    for (auto& [val, f] : freq) {
        h.push({f, val});
        if ((int)h.size() > k) h.pop();
    }
    vector<int> ans;
    while (!h.empty()) { ans.push_back(h.top().second); h.pop(); }
    return ans;
}
```

### C. Merge K Sorted Lists

```cpp
struct Node { int val; ListNode* ptr; };
struct Cmp {
    bool operator()(const Node& a, const Node& b) const {
        return a.val > b.val; // min-heap
    }
};
ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<Node, vector<Node>, Cmp> pq;
    for (auto* head : lists) if (head) pq.push({head->val, head});
    ListNode dummy(0), *cur = &dummy;
    while (!pq.empty()) {
        auto [val, node] = pq.top(); pq.pop();
        cur->next = node; cur = cur->next;
        if (node->next) pq.push({node->next->val, node->next});
    }
    return dummy.next;
}
```

### D. Median Stream — Two Heaps

```cpp
class MedianFinder {
    priority_queue<int> lo; // max-heap
    priority_queue<int, vector<int>, greater<int>> hi; // min-heap
public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top()); hi.pop();
        }
    }
    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return (lo.top() + hi.top()) / 2.0;
    }
};
```

### E. Meeting Rooms / End-Time Heap

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end()); // by start
    priority_queue<int, vector<int>, greater<int>> ends; // earliest end
    for (auto& iv : intervals) {
        if (!ends.empty() && ends.top() <= iv[0]) ends.pop(); // reuse room
        ends.push(iv[1]);
    }
    return (int)ends.size();
}
```

### F. Reorganize by Frequency

```cpp
string reorganizeString(string s) {
    vector<int> freq(26, 0);
    for (char c : s) ++freq[c - 'a'];
    priority_queue<pair<int,char>> pq;
    for (int i = 0; i < 26; ++i) if (freq[i]) pq.push({freq[i], char('a'+i)});
    string ans;
    while (pq.size() >= 2) {
        auto [f1, c1] = pq.top(); pq.pop();
        auto [f2, c2] = pq.top(); pq.pop();
        ans.push_back(c1); ans.push_back(c2);
        if (--f1) pq.push({f1, c1});
        if (--f2) pq.push({f2, c2});
    }
    if (!pq.empty()) {
        if (pq.top().first > 1) return "";
        ans.push_back(pq.top().second);
    }
    return ans;
}
```

---

## 4. Common Variants

| Variant | Heap type | Size trick |
|---|---|---|
| K largest | min-heap | size k |
| K smallest | max-heap | size k |
| Streaming median | max + min | balance sizes |
| Merge k streams | min-heap | k entries |
| Lazy delete | heap + set/map | skip outdated tops |
| Custom objects | comparator | careful const |

---

## 5. Traps

1. **Default max-heap** when you needed min — flip with `greater<>`.  
2. **Keeping all n in heap** when size k is enough — worse complexity.  
3. **Comparator inverted** → wrong order.  
4. **Updating priority** not supported directly — push new + ignore stale.  
5. **Pairs:** compare first then second carefully.  
6. **Empty top()** crash — always check empty.  
7. **Meeting rooms:** sort by start; heap stores ends.  
8. **Thinking heap sorts fully for free** — extract-all is O(n log n), same as sort.

---

## 6. Wrong Thinking vs Correct

| Wrong | Why it fails | Correct |
|---|---|---|
| "Sort then take k" | Works but may be slower / not streaming | Size-k heap O(n log k) |
| "One heap for median" | Can't get both sides | Two heaps |
| "DFS for merge k lists" | Messy | Min-heap of heads |
| "Priority queue = O(1) get" | Get is O(1), push/pop O(log n) | State both |
| "Always heap for top-k freq" | Bucket sort O(n) possible | Mention both |

---

## 7. Decision Mini-Tree

```text
Need repeated min/max or top-k?
├─ Top-k in static array → size-k opposite heap
├─ Merge k sorted → min-heap of current heads
├─ Running median → two heaps
├─ Schedule by earliest free → min-heap of ends
├─ Greedy next best char/task → max-heap by freq
└─ Graph extract-min → Dijkstra heap
```

---

## 8. Example Problems

1. Kth Largest Element in an Array  
2. Top K Frequent Elements  
3. Merge k Sorted Lists  
4. Find Median from Data Stream  
5. Meeting Rooms II  
6. K Closest Points to Origin  
7. Reorganize String  
8. Task Scheduler  
9. Ugly Number II  
10. Smallest Range Covering Elements from K Lists  
11. IPO  
12. The Skyline Problem  
13. Sort Characters By Frequency  
14. Furthest Building You Can Reach  
15. Minimum Cost to Connect Sticks  

---

## 9. Complexity

| Operation | Time |
|---|---|
| push / pop | O(log n) |
| top | O(1) |
| build heap | O(n) |
| top-k via size k | O(n log k) |

---

## 10. Interview Script

> "I'll keep a min-heap of size k for the k largest seen so far. Anything smaller than the heap top cannot be in the answer, so I pop it. At the end the top is the kth largest."

---

## Revision Checklist

- [ ] Max vs min heap STL syntax  
- [ ] Size-k trick direction clear  
- [ ] Two-heap median  
- [ ] Merge-k and meeting-rooms templates  

**Spaced:** Day 0 → 1 → 3 → 7 → 14  
**Practice:** 1 top-k + 1 scheduling + 1 two-heap weekly.
