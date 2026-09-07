# Stacks & Queues — 30-Second Revision

Close the lessons. Answer out loud.

## Flash Card

```text
Stack = plates (LIFO)
Queue = ice-cream line (FIFO)
Deque = two doors
Mono stack = wait for next greater/smaller (indices!)
Mono deque = window max/min at front
RPN = push nums; op pops b then a
pop() is void — top/front first
```

## One-Liners

| Topic | One line |
|---|---|
| Brackets | Stack of openers; end empty |
| BFS | Queue + freeze level size |
| NGE | Decreasing index stack; amortized O(n) |
| Window max | Decreasing deque; expire front |
| Histogram | Increasing stack + width formula |
| Calc II | Stack + lastSign for * / |

## Complexity Snap

```text
push/pop ends (deque)     O(1)
valid parentheses         O(n)
BFS tree                  O(n)
NGE / window max          O(n) amortized
vector erase begin        O(n) — avoid as queue
```

## Trap of the Day

```text
Counter ≠ multi-type brackets
Stack for BFS → wrong algorithm
Store indices for mono patterns
< vs <= changes equals behavior
```

## Pass / Fail

Flash card fail → reopen weak lesson 5 minutes, retry.
