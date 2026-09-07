# Stacks & Queues — 10-Minute Revision

Use on Day 7 / Day 15 / before mocks. No notes first. Then verify.

## Block A — Teach (3 min)

1. Stack vs queue vs deque mental pictures  
2. Min stack O(1) approach  
3. Monotonic stack invariant for NGE  
4. Monotonic deque for window max  
5. Why RPN needs fewer precedence rules  

## Block B — Dry Runs (4 min)

### 1) Parentheses

`{[(])}` — show stack each step; declare invalid reason.

### 2) BFS levels

Small tree 1 / 2 3 / 4 — queue contents per step.

### 3) NGE

`[3,1,4,2]` → next greater right answers.

### 4) Window max k=3

`[1,3,-1,-3,5]` — deque indices each i.

### 5) RPN

`["4","13","5","/","+"]` → result.

## Block C — Code From Memory (3 min)

Pick **two**:

```text
[ ] isValid parentheses
[ ] levelOrder
[ ] nextGreater / dailyTemperatures
[ ] maxSlidingWindow
[ ] evalRPN
[ ] largestRectangleArea (bonus)
```

Stuck > 60s → peek → close → rewrite.

## Interview Spitfire (30s each)

1. Queue using two stacks — amortized O(1)?  
2. `<` vs `<=` in mono stack?  
3. Calculator II how `*` updates stack?  
4. When prefer heap over mono deque?

## Reset Rule

Miss dry-run/code → **Needs Revision**, Day 1 schedule.

## Link Back

- `stack.md`, `queue-deque.md`, `monotonic-stack-queue.md`, `expression-and-next-greater.md`
- `CHEATSHEET.md`, `REVISION-30-SECONDS.md`
