# Software Engineering — 2-Minute Revision

Timer: 2 minutes. No notes first.

## Minute 1 — Explain

**Git (10s)** commit/branch/PR + safe undo  
**Debug (10s)** scientific loop  
**Profile (10s)** measure then Amdahl  
**Test (10s)** pyramid + edges  
**Clean (10s)** names + one job  
**Patterns (10s)** Strategy + Singleton caveat  
**Refactor (10s)** behavior-preserving steps  

## Minute 2 — Rapid fire

1. Undo pushed bad commit? → `git revert`.  
2. ASan catches? → memory errors (OOB/UAF…).  
3. Optimize cold 5% first? → No (Amdahl).  
4. Unit vs E2E count? → many unit, few E2E.  
5. Comment should explain? → why / invariants.  
6. Adapter vs Decorator? → change interface vs extend same interface.  
7. Refactor changes output? → No (observable behavior same).  
8. Characterization test? → locks current behavior for legacy.  
9. Force-push shared main? → No.  
10. `volatile` for races? → No.

## If failed ≥2

Tonight: one failed topic file + cheatsheet section only.
