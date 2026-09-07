# Foundations — 30-Second Revision

Close the lessons. Answer out loud.

## Big-O

- Big-O = growth sticker for large `n` (time and space).
- Order: `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`.
- Drop constants and smaller terms.
- Always say **time + space**. Stack counts as space.

## Recursion

- Base case + smaller same problem.
- Call stack = plates; depth ≈ extra space.
- No base case / no progress → overflow.
- Naive fib = exponential; memo/iterate to fix.

## Math for DSA

- Euclid GCD: `(a,b) → (b, a%b)` until `b=0`.
- Prime trial up to `√n`; many primes → sieve.
- `modPow` = square-and-multiply, `O(log exp)`.
- Safe mid: `lo + (hi-lo)/2`. LCM: divide before multiply.

## Pass rule

If you hesitate on any bullet, open the matching lesson section today — do not mark Solid.
