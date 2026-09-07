# Trees — 2-Minute Revision

Timer: 2 minutes. Speak or write. Then check.

## Minute 1 — Definitions + Why

1. Preorder vs inorder vs postorder vs BFS — one phrase each.
2. Why BST search is O(h), not always O(log n)?
3. Heap vs BST — what order guarantee does each give?
4. What does a trie share between words?
5. In max path sum, what do you return upward vs update globally?
6. How do you get the right side view with BFS?
7. Index of left child in a 0-based heap array?

## Minute 2 — Patterns + Traps

Say the cue → tool:

```text
Need levels / zigzag / width          → BFS
Need sorted walk in BST               → Inorder
Need K largest in stream              → Min-heap size K
Need autocomplete prefix              → Trie
Need diameter / robber / path sum     → Tree DP postorder
Need top view                         → HD + first seen (BFS)
Need validate BST                     → Ranges or inorder strict ↑
```

Traps to name:

```text
Skewed BST → linear
Heap not searchable like BST
Trie search requires isEnd
Right spine ≠ right view
INT_MIN/MAX for validate → use long long sentinels
```

## Quick Dry-Run (optional if time)

Tree `1 / 2 \ 3` with `2` having kids `4,5` — say preorder and BFS order.

## Self-Score

| Score | Meaning |
|---|---|
| 7/7 defs + cues | Solid — do a problem |
| Missed 1–2 | Skim that lesson section 20 |
| Missed 3+ | Re-read flash pictures; schedule Day 1 reset |

## Next

Open `REVISION-10-MINUTES.md` on Day 7/15 style deep recall days.
