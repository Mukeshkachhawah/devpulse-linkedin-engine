# Math for DSA

**Module:** 01-foundations  
**Level target:** L4  
**Prerequisite:** Big-O, basic loops  
**Memory picture:** A toolbox — you do not need all of math class; you need a small set of sharp tools you will reuse every week.

---

## 1. What is it?

**Math for DSA** is the small collection of number ideas that show up again and again in algorithms:

- primes and factors
- GCD / LCM
- modular arithmetic
- fast powers
- counting (permutations, combinations, bits of combinatorics)
- logs, floors/ceils, and overflow-safe averages
- basic series sums (for complexity proofs)

You are not studying abstract theory for its own sake. You are learning **moves** that unlock problems and prevent bugs.

New words:

- **Divisor / factor** — a number that divides another with no remainder.
- **Prime** — integer > 1 with exactly two distinct positive divisors: 1 and itself.
- **GCD** — greatest common divisor (biggest number that divides both).
- **LCM** — least common multiple (smallest positive number that is a multiple of both).
- **Modulo `a % m`** — remainder after dividing `a` by `m`.
- **Overflow** — result does not fit in the type (wraps or crashes logic).

---

## 2. Explain like I am 10

Think of LEGO bricks.

- **Factors** are ways to split a number into equal brick groups.
- **Prime** means you cannot split it into a rectangle that is not a single line of bricks (except 1 × itself).
- **GCD** of two piles is the biggest brick size that can build both piles with no leftover.
- **Modulo** is “what is left after you make as many full groups of size `m` as you can.”
- **Fast power** is a trick to multiply a number by itself many times without doing every single multiply one-by-one in a slow way.

---

## 3. Real life story

You and a friend organize a parade.

- You have 12 marchers in one group, friend has 18.
- You want rows of equal length for both groups with no one left out.
- Biggest row size that works for both is **GCD(12, 18) = 6**.

Later you need event IDs that wrap every day in a 24-hour clock. That wrapping is **modulo**.

Later you need “2 to the power 100” for a bit-mask idea, but multiplying 100 times is slow and will overflow — you need **modular fast power** or BigInteger thinking.

These same stories appear in hashing, scheduling, cryptography-flavored interview questions, and competitive programming.

---

## 4. Why does this exist?

Algorithms are built on integers, indices, and counts. Without these tools:

- primality checks become guesswork
- fraction problems explode with floats
- large powers cannot be computed under a modulus
- combinatorics counting problems have no language

Math for DSA exists to keep integer problems **exact, fast, and interview-ready**.

---

## 5. What problem existed before this?

People tried:

- checking primes by testing every number up to `n` every time
- computing GCD by scanning down from `min(a,b)`
- using `double` for things that must be exact
- multiplying in a loop for huge exponents and waiting forever / overflowing

Those approaches fail on interview constraints (`n` up to 1e12, exponents up to 1e18, moduli like 1e9+7).

---

## 6. What happens without it?

```text
Use float for "exact" fractions
        ↓
rounding errors
        ↓
wrong answers on edge tests

Slow GCD / slow prime checks
        ↓
TLE (time limit exceeded)

Ignore overflow: (lo + hi) / 2
        ↓
bug in binary search on large indices

Forget mod rules
        ↓
negative mods / wrong hash / WA
```

---

## 7. How did people invent this?

- **Euclid (~ancient):** GCD by repeated remainders — still the modern algorithm.
- **Sieve of Eratosthenes:** mark multiples to find all primes up to `n`.
- **Modular arithmetic:** clocks and remainders formalized; critical in contests (`MOD = 1e9+7`).
- **Binary exponentiation:** use binary digits of the exponent to square-and-multiply in O(log exp).

Interview culture kept these because they are short to code and show clean reasoning.

---

## 8. Computer intuition

Computers love:

- addition, subtraction, multiplication, division, remainder on fixed-size integers
- bit shifts (`<<`, `>>`) which relate to powers of two

```text
MEMORY PICTURE — Euclid GCD(48, 18)

48 = 2*18 + 12
18 = 1*12 + 6
12 = 2*6  + 0   ← remainder 0 stops
GCD = 6

Each step replaces (a,b) with (b, a%b)
Numbers get smaller quickly → few steps
```

```text
FAST POWER idea for 3^13
13 in binary = 1101 = 8+4+1
3^13 = 3^8 * 3^4 * 3^1

Square along the way:
3^1 → 3^2 → 3^4 → 3^8
Multiply only when exponent bit is 1
```

---

## 9. Mathematical intuition

**Euclid correctness idea:** any common divisor of `a` and `b` also divides `a % b`. So the GCD is preserved while numbers shrink.

**LCM identity (careful with overflow):**

```text
lcm(a,b) = a / gcd(a,b) * b
```

Divide before multiply when possible.

**Modulo properties (for same modulus m):**

```text
(a + b) % m = ((a % m) + (b % m)) % m
(a * b) % m = ((a % m) * (b % m)) % m
(a - b) % m = ((a % m) - (b % m) + m) % m   // +m guards negatives
```

Division modulo m needs **modular inverse**, only when `gcd(b,m)=1` (or more generally using special methods). For interviews, know that inverse exists when m is prime and b not multiple of m (Fermat) or via extended Euclid.

**Prime check:** trial division up to `√n` is enough, because factors come in pairs.

**Log intuition for complexity:** if each step halves, steps ≈ log₂(n).

**Sum formulas you will use when proving complexity:**

```text
1 + 2 + ... + n = n(n+1)/2 → O(n²) when that is your loop count
1 + 2 + 4 + ... + 2^k = 2^(k+1) - 1
```

---

## 10. Step-by-step working

### A) GCD (Euclid)

1. While `b != 0`:
2. `t = a % b`
3. `a = b`
4. `b = t`
5. Return `a`

### B) Primality (trial)

1. If `n <= 1` → not prime
2. If `n <= 3` → prime
3. If divisible by 2 or 3 → not prime
4. Check divisors of form 6k±1 up to √n (optimization), or simply `i*i <= n`

### C) Binary exponentiation (mod)

1. `result = 1`, base `%= mod`
2. While `exp > 0`:
   - if `exp` odd: `result = result * base % mod`
   - `base = base * base % mod`
   - `exp >>= 1`
3. Return `result`

### D) Sieve up to n

1. Make `isPrime[0..n] = true`, set 0,1 false
2. For `p = 2..n`:
   - if prime, mark multiples `p*p, p*p+p, ...` false
3. Remaining true indices are primes

---

## 11. Dry run

**GCD(48, 18):**

| a | b | a % b |
|---|---|---|
| 48 | 18 | 12 |
| 18 | 12 | 6 |
| 12 | 6 | 0 |
| 6 | 0 | stop → gcd=6 |

**isPrime(29):**

```text
i=2: 29%2 != 0
i=3: 29%3 != 0
i=4: 4*4=16 <=29, 29%4 !=0
i=5: 5*5=25 <=29, 29%5 !=0
i=6: 6*6=36 >29 stop → prime
```

**modPow(3, 13, 1000)** sketch:

```text
exp bits of 13: 1101
accumulate squares of 3, multiply when bit=1
final 3^13 = 1594323 → 323 mod 1000
```

---

## 12. Visualization

```text
FACTOR PAIRS of 36

1 × 36
2 × 18
3 × 12
4 × 9
6 × 6   ← stop at sqrt(36)=6

So trial loop only needs i*i <= n
```

```text
SIEVE marking for n=20 (multiples of 2,3,5,...)

idx: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
start all prime-ish true (except 0,1)
mark 4,6,8,10,12,14,16,18,20 from 2
mark 9,12,15,18 from 3
mark 25>20 from 5 stop early multiples
left primes: 2,3,5,7,11,13,17,19
```

```text
OVERFLOW trap in binary search mid

BAD:  mid = (lo + hi) / 2
      if lo,hi near INT_MAX, lo+hi wraps

GOOD: mid = lo + (hi - lo) / 2
```

```text
MODULO as a clock (m=5)

0 1 2 3 4 0 1 2 ...
value 17 → walked 3 full circles of 5 (15) leftover 2
```

---

## 13. Complexity

| Tool | Time | Space |
|---|---|---|
| Euclid GCD(a,b) | O(log min(a,b)) | O(1) iterative |
| Trial isPrime(n) | O(√n) | O(1) |
| Sieve 1..n | O(n log log n) | O(n) |
| modPow(base, exp) | O(log exp) multiplications | O(1) |
| Count divisors by pairs | O(√n) | O(1) / O(#divs) |

---

## 14. Why this complexity?

- Euclid: remainders shrink fast (related to Fibonacci worst cases) → logarithmic steps.
- Trial prime: only need check up to √n factor pairs.
- Sieve: each number `k` is marked by its primes; harmonic-like sum gives ~ n log log n.
- Fast pow: exponent has `log2(exp)` bits; one square per bit.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

long long gcdll(long long a, long long b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    while (b != 0) {
        long long t = a % b;
        a = b;
        b = t;
    }
    return a;
}

long long lcmll(long long a, long long b) {
    if (a == 0 || b == 0) return 0;
    return a / gcdll(a, b) * b; // divide first
}

bool isPrime(long long n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

long long modPow(long long base, long long exp, long long mod) {
    long long result = 1 % mod;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (__int128)result * base % mod;
        base = (__int128)base * base % mod;
        exp >>= 1;
    }
    return result;
}

vector<int> sievePrimes(int n) {
    vector<bool> is(n + 1, true);
    is[0] = is[1] = false;
    for (int p = 2; 1LL * p * p <= n; ++p) {
        if (!is[p]) continue;
        for (int m = p * p; m <= n; m += p) is[m] = false;
    }
    vector<int> primes;
    for (int i = 2; i <= n; ++i) if (is[i]) primes.push_back(i);
    return primes;
}

// nCr for small n (n <= 20~30) via loops; watch overflow
long long nCr_small(int n, int r) {
    if (r < 0 || r > n) return 0;
    r = min(r, n - r);
    long long ans = 1;
    for (int i = 1; i <= r; ++i) {
        ans = ans * (n - r + i) / i;
    }
    return ans;
}

int safeMid(int lo, int hi) {
    return lo + (hi - lo) / 2;
}

int main() {
    cout << gcdll(48, 18) << "\n";          // 6
    cout << lcmll(12, 18) << "\n";          // 36
    cout << boolalpha << isPrime(29) << "\n"; // true
    const long long MOD = 1'000'000'007;
    cout << modPow(3, 13, 1000) << "\n";    // 323
    cout << modPow(2, 10, MOD) << "\n";     // 1024
    auto primes = sievePrimes(20);
    for (int p : primes) cout << p << " ";
    cout << "\n";
    cout << nCr_small(5, 2) << "\n";        // 10
}
```

---

## 16. STL usage

| Tool | Math use |
|---|---|
| `std::gcd` / `std::lcm` (C++17) | built-in Euclid helpers |
| `__int128` (GCC/Clang) | safe multiply before mod on 64-bit |
| `vector<bool>` / `vector<char>` | sieve flags |
| `long long` | default for contest integers |
| `<cmath>` `llround`, `floor`, `ceil` | careful with floats; prefer integer ceil |

Integer ceil tricks (non-negative):

```cpp
// ceil(a/b) for a>=0, b>0
long long ceilDiv(long long a, long long b) {
    return (a + b - 1) / b;
}
```

Prefer integer methods over `ceil((double)a/b)` in interviews.

---

## 17. Brute Force

- GCD: try every candidate from `min(a,b)` down to 1 → O(min(a,b))
- Primes up to n: for each i, trial divide → about O(n √n)
- Power: multiply `exp` times → O(exp) and overflows easily

Use these only to verify tiny cases.

---

## 18. Better

- Euclid GCD
- Trial prime to √n
- Sieve when you need **many** primes up to n
- Binary exponentiation for large exponents

---

## 19. Optimal

Depends on query shape:

| Need | Strong approach |
|---|---|
| One GCD | Euclid / `std::gcd` |
| All primes ≤ n once | Sieve |
| Many primality tests for large 64-bit | harder methods (Miller-Rabin) — advanced |
| `base^exp % mod` | binary exponentiation |
| Many nCr under prime mod | precompute factorials + inverse factorials |

For this foundations chapter, **master Euclid, sieve, modPow, overflow-safe mid, ceilDiv**. Advanced number theory can wait until `11-advanced`.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Check divisors up to n/2 for primality."
  Why it fails: too slow; pairs beyond √n already covered.
  Correct: loop while i*i <= n.

Wrong: "lcm = a*b / gcd" computed as (a*b)/gcd in 32-bit.
  Why it fails: a*b overflows before divide.
  Correct: a/gcd*b with long long (still watch extremes).

Wrong: "a % m is always non-negative in all languages."
  Why it fails: negative dividends are tricky in C++.
  Correct: normalize: ((a % m) + m) % m when needed.

Wrong: "double is fine for counting combinations."
  Why it fails: precision loss.
  Correct: integer multiply/divide carefully or modular methods.

Wrong: "mid = (lo+hi)/2 is always safe."
  Why it fails: overflow on large lo/hi.
  Correct: lo + (hi-lo)/2.
```

---

## 21. Common mistakes

1. Using `int` where `long long` is required.
2. Forgetting `% MOD` on intermediate multiplies.
3. Sieve marking from `2*p` instead of `p*p` (still correct but slower); bugs when using `int` for `p*p`.
4. Off-by-one in factorial / nCr loops.
5. Treating `1` as prime.
6. Division by zero when computing LCM with zeros.
7. Mixing 0-based and 1-based thinking in counting problems.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Compute gcd of two numbers. Complexity?”  
**Expected answer:**  
“Euclidean algorithm by remainder. Each step shrinks the numbers; time is O(log min(a,b)). Iterative implementation uses O(1) extra memory. I would also mention `std::gcd` in C++17, but I can write Euclid by hand.”

### Amazon-style

**Interviewer:** “We need `pow(a,b) % mod` for large b in a pricing service. Concerns?”  
**Expected answer:**  
“Use binary exponentiation O(log b). Multiply carefully under mod to avoid overflow — use 128-bit intermediate or modular mul. Validate mod > 0. Add tests for b=0, a=0, and very large b.”

### Microsoft-style

**Interviewer:** “Where have you seen overflow bugs?”  
**Expected answer:**  
“Binary search mid `(lo+hi)/2` on large indices; LCM multiply order; summing into `int` instead of `long long`. I fix mid with `lo+(hi-lo)/2` and widen types early.”

### OpenAI-style

**Interviewer:** “Why do contests use MOD 1e9+7?”  
**Expected answer:**  
“It is a prime near 1e9, so modular addition/multiplication stays in 32-bit-ish range after mod, and prime modulus allows inverses for division in modular arithmetic. It keeps answers bounded while preserving algebraic structure for counting problems.”

---

## 23. Company use cases

| Area | Math tool |
|---|---|
| Hashing / sharding | modulo buckets |
| Cryptography-adjacent interviews | modular pow, primes |
| Distributed IDs / clocks | wraparound modulo |
| Game engines / graphics interviews | gcd for grid lattice steps |
| Ads / ranking systems | combinatorics counting under constraints |
| Calendar / scheduling | LCM of cycle lengths (with care) |

---

## 24. Related concepts + pattern recognition cues

**Related:** bit tricks (powers of two), binary search boundaries, hashing, combinatorics DP, segment trees with modular ops (later).

**Cues:**

```text
IF "divisible by" / fractions of integers / ratios of counts
→ gcd / lcm thinking

IF huge exponent + mod
→ modPow

IF need all primes in a range
→ sieve

IF counting ways
→ nCr / factorial / DP; watch mod

IF (lo+hi)/2 or a*b/gcd
→ overflow alarm
```

Connects back to Big-O (sums, logs) and forward to binary search, hashing, bits.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
Euclid GCD = remainders until 0
Primes: test to √n; many primes → sieve
modPow = square and multiply in O(log exp)
Guard overflow: types, mid, lcm order
Modulo is a clock; normalize negatives
```

### Checklist

- [ ] Hand-run Euclid on (48,18)
- [ ] Code `gcd`, `isPrime`, `modPow`, sieve from memory
- [ ] Explain why trial stops at √n
- [ ] Fix a bad mid formula
- [ ] Compute lcm safely with divide-first

### Practice plan

1. Implement Euclid iterative + recursive; compare.
2. Print all primes ≤ 100 with sieve; verify with isPrime.
3. Stress `modPow` against slow multiply for small exp.
4. Solve 5 beginner number-theory problems (GCD on arrays, prime checks).
5. Add overflow notes into your personal bug log.

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Recite tool list + one-line use each |
| 3 | Dry-run Euclid + sieve marking on paper |
| 7 | Code all core helpers in one C++ file from memory |
| 15 | Teach MOD properties for 5 minutes |
| 30 | Re-solve 2 math-flavored tracker problems timed |
| 90 | Full mock using company prompts above |

```text
Item: Math for DSA
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90 days
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Explain GCD/modulo with parade/clock stories |
| L2 | Dry-run Euclid and trial prime |
| L3 | Code gcd, sieve, modPow, safe mid in C++ |
| L4 | Discuss overflow and MOD design in interviews |
| L5 | Choose sieve vs trial vs modPow under constraints without hesitation |

---

## Appendix — Quick formula card

```text
gcd(a,b) via Euclid
lcm(a,b) = a/gcd*b   (overflow-aware)
i*i <= n for factor loops
mid = lo + (hi-lo)/2
ceilDiv(a,b) = (a+b-1)/b  (a>=0,b>0)
(a%m + m)%m  for safe non-negative residue
```
