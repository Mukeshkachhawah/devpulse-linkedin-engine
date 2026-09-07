# Compiler Basics (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L3–L4  
**Prerequisite:** writing/running C++ programs  
**Memory picture:** A compiler is a translator + strict teacher. It turns your C++ essay into machine instructions the CPU can run, catching many grammar mistakes early.

---

## 1. What is it?

A **compiler** translates high-level code (C++) into machine code (or intermediate forms). Interviews ask: phases of compilation, headers/linking, undefined behavior, optimization `-O2`, and difference from interpreters.

New words:

- **Source code** — what you write.  
- **Object file** — compiled machine code for one translation unit, not fully linked.  
- **Linker** — combines object files/libraries into an executable.  
- **AST** — abstract syntax tree (structured program representation).  
- **IR** — intermediate representation (e.g. LLVM IR).  
- **Undefined behavior (UB)** — C++ says “no guarantees”; optimizer assumes it never happens.  
- **Translation unit** — roughly one `.cpp` after preprocessing.

---

## 2. Explain like I am 10

You write a recipe in kid language. A helper (compiler) rewrites it into tiny kitchen robot steps. If you wrote nonsense (“boil the song”), the helper complains before the robot explodes.

---

## 3. Why it exists

CPUs only run machine instructions. Compilers let humans write portable, abstract code. Optimizing compilers make naive-looking loops fast (within language rules).

Without this knowledge: mysterious “link errors,” fear of `-O2`, and UB landmines.

---

## 4. Pipeline phases

```text
Source (.cpp)
  → Preprocessor   (#include, #define) → pure C++ text
  → Lexer/Tokenizer  (words/tokens)
  → Parser           (grammar → AST)
  → Semantic analysis (types, names)
  → IR generation
  → Optimizer        (-O0/-O2/-O3)
  → Code generation  (assembly/machine)
  → Assembler        (.o object)
  → Linker           (exe/lib)
```

**Kid analogy:** Spell-check words → check sentence grammar → understand meaning → shorten recipe → write robot code → pack all recipe cards into one cookbook (link).

---

## 5. Preprocessor vs compiler vs linker errors

| Stage | Example pain |
|---|---|
| Preprocessor | missing header path |
| Compile | type errors, syntax |
| Link | `undefined reference to foo()` — declared but not defined / not linked |

```text
declare in .h  →  define in .cpp  →  link that .o
```

---

## 6. Headers and ODR (practical)

```cpp
// util.h
#pragma once
int add(int a, int b); // declaration

// util.cpp
#include "util.h"
int add(int a, int b) { return a + b; } // definition
```

**One Definition Rule (ODR):** you shouldn’t define the same non-inline function in multiple translation units. Use headers for declarations; put bodies in `.cpp` (or `inline`/`template` rules carefully).

---

## 7. Interpreted vs compiled vs JIT

- **Compiled (C++):** ahead-of-time to machine code → fast runtime.  
- **Interpreted:** execute via interpreter (classically slower).  
- **Bytecode + VM / JIT (Java, JS engines):** middle paths; JIT compiles hot code at runtime.

Interview: be accurate — many “interpreted” languages have JIT hot paths.

---

## 8. Optimizations you should know exist

Under `-O2`, compilers may:

- inline small functions  
- eliminate dead code  
- register-allocate hot variables  
- vectorize simple loops (SIMD)  
- reorder memory ops **within as-if rule** (not across sync)

**As-if rule:** optimizer may transform code if you can’t tell from a valid observable behavior standpoint (UB breaks the contract).

```cpp
// Unoptimized mental code vs optimized:
for (int i = 0; i < n; ++i) sum += a[i];
// may become pointer walks / SIMD / unrolled loops
```

---

## 9. Undefined behavior — interview landmine

Examples:

- out-of-bounds array access  
- signed integer overflow  
- use after free  
- data races  
- null dereference  

```cpp
int a[10];
a[10] = 1; // UB — "works on my machine" is not proof
```

**Interview line:** “UB means the standard gives no requirements; compilers optimize assuming it never occurs, so bugs can look impossible.”

---

## 10. Debug vs release builds

| | `-O0 -g` | `-O2` |
|---|---|---|
| Speed | slower | faster |
| Debug | easier | harder (vars optimized away) |
| Bugs | some UB “hidden” | some UB “explodes” |

Contest tip: test with `-O2` because judges use it.

---

## 11. Static vs dynamic linking (short)

- **Static:** library code copied into binary — bigger, fewer runtime deps.  
- **Dynamic:** resolve at load/runtime — smaller binaries, shared libs, version pain possible.

---

## 12. Common interview Q&A

**Q1. Steps to turn C++ into an executable?**  
A: preprocess → compile → assemble → link (can merge wording; show understanding).

**Q2. What does the linker do?**  
A: Resolves symbols across object files/libraries; builds final executable/shared lib.

**Q3. Difference declaration vs definition?**  
A: Declaration introduces name; definition provides entity (storage/body).

**Q4. What is undefined behavior?**  
A: Operation outside language rules; no guaranteed result; dangerous with optimizations.

**Q5. Why can `-O2` “break” buggy code?**  
A: It didn’t break valid code; it exposed reliance on UB or race assumptions.

**Q6. What is inlining?**  
A: Replace call with body to remove call overhead / enable more opts; grows code if overused.

**Q7. Header guards / `#pragma once` purpose?**  
A: Prevent double inclusion of declarations.

**Q8. Compiler vs interpreter?**  
A: AOT translation vs runtime execution engine; hybrids exist.

**Q9. What is an object file?**  
A: Compiled machine code + symbols/relocations, not yet fully linked.

**Q10. Why templates live in headers often?**  
A: Compiler needs definition at instantiation point (common practical answer).

---

## 13. C++ tiny multi-file mental model

```cpp
// main.cpp
#include <iostream>
int add(int, int); // or #include "util.h"
int main() {
    std::cout << add(2, 3) << "\n";
}
```

Build:

```text
g++ -std=c++17 -O2 -c util.cpp
g++ -std=c++17 -O2 -c main.cpp
g++ -std=c++17 -O2 main.o util.o -o app
```

---

## 14. Visualization

```text
main.cpp   util.cpp
   ↓          ↓
 main.o     util.o
        \   /
        linker
          ↓
         app
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"If it runs once, it's defined behavior."
        ↓
UB can appear stable until compiler/machine changes.
        ↓
"Follow the language rules; tools (ASan/UBSan) help."
```

```text
"Optimizer is optional magic."
        ↓
Production and judges rely on it.
        ↓
"Understand as-if + test optimized builds."
```

---

## 16. Common mistakes

- Fixing link errors by random `#include` spam.  
- Defining globals in headers.  
- Ignoring warnings (`-Wall -Wextra`).  
- Assuming evaluation order is always left-to-right for all expressions (it’s subtle in C++).  

---

## 17. Company use cases

Build systems, CI flags, performance, sanitizer usage, understanding crashes that “only happen in release.”

---

## 18. Related concepts

OS loader, memory bugs, profiling optimized code, C++ contest flags.

---

## 19. Revision checklist

- [ ] Phase pipeline  
- [ ] Compile vs link errors  
- [ ] Declaration vs definition  
- [ ] UB examples  
- [ ] `-O0` vs `-O2`  
- [ ] As-if rule one-liner  

**Spaced repetition:** Draw compile pipeline from memory day 1/3/7.  
**Practice:** Intentionally cause a link error; fix it properly.  
**Exit check:** Explain UB + optimizer to a non-compiler friend in plain English.
