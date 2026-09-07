# Foundations Cheatsheet

Quick lookup while solving. Not a substitute for the full lessons.

---

## Big-O Growth Order

```text
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
```


| Pattern            | Typical time |
| ------------------ | ------------ |
| Index / arithmetic | O(1)         |
| Halve each step    | O(log n)     |
| One pass           | O(n)         |
| Sort               | O(n log n)   |
| All pairs          | O(n²)        |
| Subsets            | O(2ⁿ)        |
| Permutations       | O(n!)        |


**Space:** count extra arrays **and** recursion depth.

**Constraint gut check**


| n     | Aim                 |
| ----- | ------------------- |
| ≤ 20  | `2ⁿ` / `n!` maybe   |
| ≤ 100 | `n³` maybe          |
| ≤ 1e5 | `n log n` or better |
| ≤ 1e7 | near linear         |


---



## Recursion Template

```cpp
// Meaning of f(...): ________________

T f(...) {
    // 1) base case first
    if (/* smallest input */) return /* answer */;

    // 2) make progress (smaller n / next index / half range)
    T part = f(/* smaller */);

    // 3) combine
    return /* combine local work with part */;
}
```

**Must check:** every path hits base; input shrinks; depth OK for `n`.


| Shape         | Time        | Stack              |
| ------------- | ----------- | ------------------ |
| `f(n)→f(n-1)` | O(n)        | O(n)               |
| halve range   | O(log n)    | O(log n) recursive |
| naive fib     | exponential | O(n)               |
| tree DFS      | O(n)        | O(height)          |


**C++ note:** do not rely on tail-call optimization.

---



## Math Toolkit



### GCD / LCM

```cpp
long long gcdll(long long a, long long b) {
    while (b) a % b; a = b; b = t; }
    return a < 0 ? -a : a;{ long long t = 
}
// lcm = a / gcd * b   (divide first; use long long)
```



### Primality (single n)

```cpp
bool isPrime(long long n) {
    if (n <= 1) return false;
    for (long long i = 2; i * i <= n; ++i)
        if (n % i == 0) return false;
    return true;
}
```



### Sieve 1..n

```text
is[0]=is[1]=false
for p=2..sqrt(n):
  if is[p]: mark multiples from p*p step p
```

Time ~ O(n log log n), space O(n).

### Modular power

```cpp
long long modPow(long long base, long long exp, long long mod) {
    long long res = 1 % mod;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) res = (__int128)res * base % mod;
        base = (__int128)base * base % mod;
        exp >>= 1;
    }
    return res;
}
```



### Modulo hygiene

```text
(a + b) % m
(a * b) % m
((a % m) - (b % m) + m) % m
((a % m) + m) % m   // non-negative residue
```



### Overflow guards

```cpp
int mid = lo + (hi - lo) / 2;
long long ceilDiv(long long a, long long b) { // a>=0,b>0
    return (a + b - 1) / b;
}
```

---



## STL Complexity (interview)


| API                       | Cost                 |
| ------------------------- | -------------------- |
| `vector[]`, `push_back`   | O(1), amortized O(1) |
| `sort`                    | O(n log n)           |
| `lower_bound` sorted      | O(log n)             |
| `unordered_map/set`       | avg O(1), worst O(n) |
| `map` / `set`             | O(log n)             |
| `priority_queue` push/pop | O(log n)             |
| `std::gcd` / `std::lcm`   | C++17                |


---



## Wrong → Right (keep these scars)


| Wrong                          | Right                         |
| ------------------------------ | ----------------------------- |
| Two loops ⇒ always O(n²)       | Count real iterations         |
| Recursion ⇒ O(1) space         | Include stack depth           |
| Hash always best / always O(1) | Avg vs worst; memory tradeoff |
| `O(2n)` ≠ `O(n)`               | Same Big-O class              |
| Trial prime to n/2             | Stop at √n                    |
| `(lo+hi)/2` always fine        | Use `lo+(hi-lo)/2`            |


---



## Memory Pictures

```text
Big-O: factory — count boxes opened as shipment size grows

Recursion: plates — each call adds a plate; return removes it

Math: toolbox — gcd wrench, prime gauge, mod clock, power ladder
```

---



## Company one-liners

- **Google:** prove bound; state assumptions (avg vs worst).  
- **Amazon:** scale to millions; reliability (stack overflow risk).  
- **Microsoft:** convert recursion ↔ iteration; overflow bugs.  
- **OpenAI:** explain tradeoffs clearly to a teammate.

---



## Lesson map


| File                          | Use when                              |
| ----------------------------- | ------------------------------------- |
| `complexity-big-o.md`         | comparing solutions / constraints     |
| `recursion-and-call-stack.md` | trees, DFS, backtracking, DP top-down |
| `math-for-dsa.md`             | primes, gcd, mod, powers, overflow    |
| `REVISION-30-SECONDS.md`      | daily warm-up                         |
| `REVISION-2-MINUTES.md`       | quick quiz                            |
| `REVISION-10-MINUTES.md`      | pre-mock deep revise                  |


Next module after L3+ here: `02-arrays-strings/`.