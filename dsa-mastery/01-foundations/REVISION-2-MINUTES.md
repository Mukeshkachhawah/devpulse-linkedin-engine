# Foundations — 2-Minute Revision

Timer: 2 minutes. No notes first. Then check.

## Minute 1 — Explain

**Big-O (20s)**  
“If input size grows, how do work and memory grow? We name the dominant shape: linear, log, quadratic…”

**Recursion (20s)**  
“Solve by calling yourself on a smaller input until a base case. The call stack stores unfinished frames. Space includes depth.”

**Math (20s)**  
“GCD via Euclid remainders. Primes via √n or sieve. Fast power under mod. Watch overflow on mid and products.”

## Minute 2 — Rapid fire

Answer yes/no + one line why:

1. Is `O(2n)` worse than `O(n)` in Big-O? → No, both O(n).
2. Does recursive sum of n elements use O(1) space? → No, O(n) stack.
3. Is 1 prime? → No.
4. Is `(lo+hi)/2` always safe for `int`? → No, can overflow.
5. Is `unordered_map` O(1) worst-case? → No, average O(1), worst O(n).
6. Does sieve need O(n) memory? → Yes, typically.
7. Can C++ guarantee tail-call optimization? → No.
8. For n=1e5, is O(n²) usually OK? → No.

## Mini dry-runs (say them)

**GCD(48,18):** 48,18 → 18,12 → 12,6 → 6,0 → 6  

**Max of [4,1,7,3]:** best walks 4→4→7→7  

**fact stack idea:** fact(3) waits for fact(2) waits for fact(1)/fact(0), then multiplies back.

## If you failed ≥2 rapid-fire

Reset this topic to Day-1 spaced repetition. Re-read Wrong Thinking sections in the three lessons.
