# Software Engineering Cheatsheet

---

## Git

```bash
git status / diff / add / commit / log --oneline --graph
git switch -c feature/x
git pull / push
git revert <sha>          # safe shared undo
# reset --hard = dangerous if shared
```

Merge = join histories. Rebase = replay (private branches).  
Conflict markers: `<<<<<<< ======= >>>>>>>`.  
`.gitignore` secrets/build artifacts.

---

## Debugging

```text
repro → hypothesize → experiment → root fix → regression test
```

Tools: debugger, logs, ASan/UBSan/TSan, `git bisect`, brute oracle.

---

## Profiling

```text
correct → better Big-O → less work → locality → parallel → micro
Measure hotspots; Amdahl limits gains; check p99.
```

`chrono` timers; flame graphs; avoid microbench lies.

---

## Testing

```text
Unit (many) → Integration → E2E (few)
Arrange → Act → Assert
```

Edges: empty, one, dupes, negatives, max, invalid.  
Coverage helpful ≠ proof. Kill flaky causes.

---

## Clean Code

- Names teach intent  
- Functions do one job  
- Comments explain why  
- Guard clauses  
- YAGNI; DRY carefully  

---

## Patterns (when)

| Smell / need | Pattern |
|---|---|
| Swap algorithms | Strategy |
| Event fans-out | Observer |
| Complex creation | Factory |
| Legacy interface | Adapter |
| Stack behaviors | Decorator |
| True one instance | Singleton (rare) |

Composition over deep inheritance.

---

## Refactoring

```text
tests → one smell → one change → tests → commit
```

Extract / rename / constants / split responsibilities.  
Characterization tests for legacy.  
Strangler for big replacements.  
Refactor ≠ feature ≠ rewrite.

---

## Interview One-Liners

- “I’d clarify behavior, list tests, then code cleanly.”  
- “Optimize after measuring the hot path.”  
- “I’d revert the bad deploy commit and add a regression test.”  
- “Strategy beats a growing switch here because…”
