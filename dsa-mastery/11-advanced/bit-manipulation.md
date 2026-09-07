# Bit Manipulation

**Module:** 11-advanced  
**Level target:** L5  
**Prerequisite:** binary numbers, integers in C++, basic loops  
**Memory picture:** An integer is a row of light switches (bits). Bit tricks flip, test, and count switches without visiting every array index.

---

## 1. What is it?

**Bit manipulation** means solving problems by operating on the binary representation of integers: AND, OR, XOR, shifts, masks.

Common interview jobs:

- test / set / clear / toggle a bit
- count set bits
- XOR tricks (single number, missing number)
- subset enumeration via masks
- power-of-two tests
- bit DP helpers

New words:

- **Bit** — one binary digit 0/1.  
- **Mask** — integer used as a pattern of bits.  
- **Set bit** — bit value 1 (also called “on”).  
- **LSB / MSB** — least / most significant bit.  
- **Two’s complement** — how C++ represents negative integers (know `~x` effects).  
- **`n & (n-1)`** — clears the lowest set bit.

---

## 2. Explain like I am 10

Think of a number as a row of light bulbs.  
AND = bulbs on only if both rows have them on.  
OR = on if either is on.  
XOR = on if they differ.  
Shift = slide the whole row left/right.

---

## 3. Real life story

Permissions: read/write/execute as bits in a flag.  
OR adds permissions; AND checks; clear removes.

```text
flags:  1 0 1 1
mask:   0 1 0 0
OR   →  1 1 1 1  (add)
AND  →  0 0 0 0  (check that bit → off)
```

CPUs do these in hardware — ultra fast.

---

## 4. Why does this exist?

Bits pack sets, flags, and states into machine words. Many O(n) hash/map solutions become O(1) word ops when the universe is tiny (≤32/64). Bitmask DP needs fluent bit ops.

---

## 5. What problem existed before this?

People used arrays of bools and loops even for 20 flags. Hardware already had bit ops; algorithms learned to speak that language.

---

## 6. What happens without it?

```text
Slow: loop 32 times with %2
Buggy: sign shifts, undefined huge shifts
Missed: XOR pair cancel tricks
```

---

## 7. How did people invent this?

Boolean algebra + CPU instruction sets. Hacker's Delight collected tricks. Interviews kept: single number (XOR), counting bits, power of two, bit subsets.

---

## 8. Computer intuition

```text
n = 13 = 1101
bit3 bit2 bit1 bit0
 1    1    0    1

test i:  n & (1<<i)
set i:   n | (1<<i)
clear i: n & ~(1<<i)
toggle:  n ^ (1<<i)

n & (n-1):
  1100 & 1011 = 1000  (cleared lowest 1)
```

Shifts: `<<` multiply by 2; `>>` divide by 2 (arithmetic right shift on signed in C++).

---

## 9. Mathematical intuition

XOR facts:

- `x^x=0`, `x^0=x`, associative/commutative  
- Pairing cancels → single unique number in pairs

`n & (n-1) == 0` and `n>0` ⇒ n is power of two.

Brian Kernighan count: loop clears lowest set bit → O(#set bits).

Mask iteration: `for (int s=mask; s; s=(s-1)&mask)` visits submasks.

---

## 10. Step-by-step working

1. Translate problem into bits/flags/XOR.  
2. Watch type width (`int` 32, `long long` 64).  
3. Prefer `1LL<<i` when i≥31.  
4. Avoid shifting ≥ width (undefined).  
5. For subsets of n≤20, use masks `0..(1<<n)-1`.  
6. State complexity vs `__builtin_popcount`.

---

## 11. Dry run

**Single number:** `[4,1,2,1,2]`  
XOR: 4^1^2^1^2 = 4.

**Count bits** of 13 (`1101`):  
13→12→8→0 : three steps → 3 bits.

**Power of two:** 8=`1000`, `8&(7)=0` → yes. 12=`1100`, `12&11≠0` → no.

---

## 12. Visualization

```text
XOR CANCEL

1 1 0 1
^ 1 1 0 1
---------
0 0 0 0


SUBMASK WALK mask=1011
1011
1010
1001
1000
0011
0010
0001
(then 0 stop)
```

---

## 13. Complexity

Most bit ops O(1).  
Kernighan popcount O(popcount).  
Enumerate masks O(2ⁿ).  
Enumerate all submasks of all masks O(3ⁿ).

---

## 14. Why this complexity?

Word operations are constant. Subset loops follow 2ⁿ patterns; submask DP identity Σ_mask 2^{popcount(mask)} = 3ⁿ.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

bool isPow2(unsigned x) { return x && !(x & (x - 1)); }

int singleNumber(vector<int>& a) {
    int x = 0;
    for (int v : a) x ^= v;
    return x;
}

int hammingWeight(uint32_t n) {
    int c = 0;
    while (n) { n &= n - 1; ++c; }
    return c;
}

int getSum(int a, int b) { // sum without +
    while (b) {
        unsigned carry = (unsigned)(a & b) << 1;
        a ^= b;
        b = (int)carry;
    }
    return a;
}

// iterate all submasks of mask
void allSubmasks(int mask) {
    for (int s = mask; ; s = (s - 1) & mask) {
        // use s
        if (s == 0) break;
    }
}
```

Builtins (GCC/Clang): `__builtin_popcount`, `__builtin_ctz`, `__builtin_clz`.

---

## 16. STL usage

- `bitset<N>` for big bit arrays / subset sum  
- `std::popcount` (C++20)  
- careful with `vector<bool>` — not a real bit container for references  

---

## 17. Brute Force

Loop bits 0..31 checking `(n>>i)&1`. Correct, slower/clunkier.

---

## 18. Better

Kernighan popcount; XOR aggregation; bitmask subsets instead of recursion when listing not needed.

---

## 19. Optimal

Constant-time word tricks + hardware popcount when available. For algorithmic problems, optimal means right XOR/mask insight, not micro-opts only.

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "1<<31 is fine as signed int."
  Why it fails: overflow / UB risk.
  Correct: 1U<<31 or 1LL<<i.

Wrong: ">> on negative is always logical zero-fill."
  Why it fails: arithmetic shift implementation-defined historically; be careful.
  Correct: use unsigned for bit patterns.

Wrong: "XOR finds two unique numbers the same way as one."
  Why it fails: need partition by a set bit.
  Correct: two-pass XOR bitmask trick.

Wrong: "Bits are only for CP, not interviews."
  Why it fails: common easy/medium rounds.
  Correct: know the standard kit.
```

---

## 21. Common mistakes

1. Shift amount ≥ 32/64.  
2. Using signed for pure masks.  
3. Forgetting `n>0` in power-of-two.  
4. Off-by-one in bit index.  
5. Infinite loop in submask iteration.  
6. Assuming `int` is 32 on every platform — still say 32/64 in interviews for CP/C++.

---

## 22. Interview tricks + company interviewer simulation

### Google-style

**Interviewer:** “Why does XOR find the single number?”  
**Expected:** “Pairs cancel to 0 because x^x=0; XOR is commutative/associative; leftover is the unique value. O(n) time O(1) space.”

### Amazon-style

**Interviewer:** “Feature flags in one int?”  
**Expected:** “Pack bits; OR to enable, AND with mask to test, AND with NOT to clear. Mention versioning when flags exceed 32/64.”

### Microsoft-style

**Interviewer:** “Count bits without library.”  
**Expected:** “Kernighan `n&=n-1` loop; O(number of 1s).”

### OpenAI-style

**Interviewer:** “When bitmask DP vs bitset knapsack?”  
**Expected:** “Bitmask DP indexes subsets of n≤20 items. Bitset accelerates numeric subset-sum reachability along a value axis.”

---

## 23. Company use cases

| Domain | Bits |
|---|---|
| OS / drivers | permission & interrupt flags |
| Games | entity component bitsets |
| Networking | protocol flag fields |
| Compilers | live/dead bitsets |
| Databases | bitmap indexes (concept) |

---

## 24. Related concepts + pattern recognition cues

```text
IF pairs cancel → XOR
IF power of two → n&(n-1)==0
IF n≤20 subsets → masks
IF need popcount fast → builtin / Kernighan
IF two uniques → XOR + lowest set bit partition
IF huge boolean array ops → bitset
```

Related: bitmask DP, bloom filters (advanced), gray codes.

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
AND test, OR set, XOR toggle/cancel
n&(n-1) clears lowest 1
1LL<<i for safety
Masks enumerate subsets
```

### Checklist

- [ ] XOR single number proof  
- [ ] Kernighan count  
- [ ] Power of two check  
- [ ] Set/clear/test macros mentally  
- [ ] Submask loop  

### Practice plan

1. Single Number I/II/III  
2. Number of 1 bits, power of two  
3. Subsets via bitmask  
4. Bitwise AND of range / sum without +  
5. Connect to bitmask DP lesson  

### Spaced repetition

| Day | Action |
|---|---|
| 1 | Ops table + XOR dry run |
| 3 | Code popcount + pow2 |
| 7 | Two bit mediums |
| 15 | Teach XOR cancel |
| 30 | Retry bit bug from tracker |
| 90 | Google XOR proof mock |

```text
Item: Bit Manipulation
Learned: (fill date)
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```

### Mastery self-score

| Level | Can you? |
|---|---|
| L1 | Light-switch metaphor |
| L2 | Dry-run XOR / popcount |
| L3 | Code standard tricks |
| L4 | Avoid shift UB; two-unique XOR |
| L5 | Combine bits with DP/masks fluently |
