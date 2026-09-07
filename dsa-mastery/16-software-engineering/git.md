# Git (Interview & Daily Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** editing code files; basic command line  
**Memory picture:** Git is a time machine + group notebook. Commits are snapshots with messages. Branches are alternate timelines you can merge.

---

## 1. What is it?

**Git** is a distributed version control system. It tracks changes, enables branching/merging, and is the backbone of GitHub/GitLab workflows.

Interview Git ≠ memorize every flag. It is: **commit, branch, merge, rebase (concept), PR, conflict, reset vs revert**.

New words:

- **Repository (repo)** — project tracked by Git.  
- **Commit** — snapshot + metadata (author, message, parent).  
- **Branch** — movable pointer to a commit (a line of work).  
- **Remote** — hosted copy (`origin`).  
- **Staging area (index)** — what goes into the next commit.  
- **PR / MR** — review request to merge a branch.  
- **Conflict** — overlapping edits Git can’t auto-merge.

---

## 2. Explain like I am 10

You write a story. Each “Save Version” is a commit. You can try a crazy ending on a separate notebook copy (branch). If friends edit the same sentence differently, you must pick a final sentence (resolve conflict).

---

## 3. Why it exists

Without VCS: `project_final_FINAL2.zip` chaos, lost work, impossible collaboration. Git makes history searchable and collaboration reviewable.

---

## 4. Mental model

```text
Working directory  --git add-->  Staging  --git commit-->  Local history
                                                      --git push--> Remote
Remote --git pull/fetch--> Local
```

Commits form a DAG (directed acyclic graph) of snapshots.

```text
A---B---C     main
     \
      D---E   feature
```

---

## 5. Daily command kit

```bash
git status
git diff
git diff --staged
git add file.cpp
git commit -m "Explain why this change exists"
git log --oneline --graph -n 15
```

**Good messages:** why, not only what.  
Bad: `fix`. Better: `Fix off-by-one in binary search upper bound`.

---

## 6. Branch workflow

```bash
git switch -c feature/login   # or git checkout -b
# ... work, commit ...
git push -u origin feature/login
# open PR, review, merge
git switch main
git pull
```

**Trunk ideas:** keep branches short-lived; merge often; avoid mega-branches.

---

## 7. Merge vs rebase (interview-level)

**Merge:** creates a merge commit joining histories; preserves true branching history.

```text
A---B---C-------M
     \         /
      D---E---
```

**Rebase:** replay your commits on top of another tip; linear history; rewrites commit hashes (don’t rebase public shared commits casually).

```text
A---B---C---D'---E'
```

**Say in interview:** “I merge via PR usually; rebase to update a private feature branch onto main; I don’t rewrite shared history.”

---

## 8. Undo toolkit (critical)

| Goal | Tool |
|---|---|
| Unstage file | `git restore --staged file` |
| Discard working changes (careful) | `git restore file` |
| New commit that undoes an old one | `git revert <sha>` (safe for shared) |
| Move branch pointer (dangerous if shared) | `git reset` |

**reset flavors:**

- `--soft` move pointer, keep staging/work  
- `--mixed` (default) move pointer, keep work, clear stage  
- `--hard` move pointer, destroy work (danger)

**Rule:** If it’s already on remote and others use it → prefer **revert**, not hard reset.

---

## 9. Conflicts

```text
<<<<<<< HEAD
your version
=======
their version
>>>>>>> feature
```

Edit to correct final code → `git add` → continue merge/rebase.

**Strategy:** understand both sides; run tests; don’t blindly pick “ours.”

---

## 10. `.gitignore` and secrets

```text
build/
*.o
.env
```

Never commit secrets. If leaked: rotate keys; history cleanup is hard — prevention first.

---

## 11. PR hygiene

- Small PRs > giant dumps  
- Description: why + how to test  
- Respond to review without ego  
- CI green before merge when required  

---

## 12. Common interview Q&A

**Q1. What is a commit?**  
A: Snapshot of staged changes with metadata pointing to parent(s).

**Q2. Merge vs rebase?**  
A: Merge joins with merge commit; rebase replays for linearity; rewriting shared history is risky.

**Q3. Difference `pull` vs `fetch`?**  
A: Fetch updates remote-tracking refs; pull ≈ fetch + merge/rebase into current branch.

**Q4. How to undo a commit already pushed?**  
A: `git revert` creating a new undoing commit.

**Q5. What is HEAD?**  
A: Pointer to current checkout commit/branch tip.

**Q6. What causes conflicts?**  
A: Two branches change overlapping regions differently.

**Q7. What is staged?**  
A: Index content prepared for next commit.

**Q8. Squash merge meaning?**  
A: PR’s commits combined into one commit on target branch (common platform option).

**Q9. Detached HEAD?**  
A: HEAD points to commit not a branch; new commits orphan-risk unless branch created.

**Q10. Why feature branches?**  
A: Isolate work, enable review, protect main.

---

## 13. C++ project tip

Build artifacts (`*.o`, `a.out`, `cmake-build*`) belong in `.gitignore`. Commit source + build scripts, not binaries.

---

## 14. Visualization — PR flow

```text
main:    A---B------------C
feature:      \--D--E--/  (merged)
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Commit only when feature 100% done."
        ↓
Huge risky diffs; hard to revert.
        ↓
"Small commits with clear why."
```

```text
"git reset --hard is standard undo."
        ↓
Loses work; dangerous if pushed.
        ↓
"Choose restore/revert/reset knowingly."
```

---

## 16. Common mistakes

- Committing on `main` directly in team repos.  
- Vague messages.  
- Force-push to shared branches without coordination.  
- Ignoring `.gitignore` until secrets leak.  
- Resolving conflicts without compiling/testing.  

---

## 17. Company use cases

All modern software teams; incident bisect (`git bisect`); blame (`git blame`) for archaeology; release tags.

```bash
git bisect start
git bisect bad
git bisect good <oldsha>
# test each; git bisect good/bad → find breaking commit
```

---

## 18. Related concepts

Code review, CI testing, refactoring in small steps, debugging regressions.

---

## 19. Practice plan

1. Init toy repo; 5 meaningful commits.  
2. Branch + intentional conflict + resolve.  
3. Practice `revert` vs `reset` on a throwaway repo.  
4. Open a PR description template and fill it.

---

## 20. Revision checklist

- [ ] add/commit/status/diff/log  
- [ ] branch + PR idea  
- [ ] merge vs rebase one-liners  
- [ ] revert vs reset  
- [ ] conflict markers  
- [ ] never commit secrets  

**Spaced repetition:** Draw snapshot model weekly.  
**Exit check:** Explain how you’d undo a bad pushed commit safely.
