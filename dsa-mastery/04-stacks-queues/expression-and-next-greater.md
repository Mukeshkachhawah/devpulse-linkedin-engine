# Expressions & Next Greater — Core Lesson

> Previous: Monotonic Stack/Queue. Ties together stack parsing + NGE drills for interviews.

---

## 1. What is it?

This lesson has two tightly related interview skills:

1. **Expression evaluation / parsing** with stacks (infix, calculator, reverse Polish)  
2. **Next Greater Element (NGE)** family — apply monotonic stack until it is muscle memory  

```text
Expression:  3 + (2 * 2)  → need precedence + parentheses
RPN:         3 2 2 * +    → natural stack eval
NGE:         [2,1,2,4]    → [4,2,4,-1]
```

---

## 2. Explain like I am 10

**Calculator:** You read a math homework line. Numbers wait on one plate stack. Signs wait on another. When a stronger sign comes, you finish the older weaker work first.

**Next greater:** For each number, find the first bigger number on its right — like looking down a street of house numbers until you see a taller house.

**Memory picture:** two stacks of homework (numbers & signs) + laser to the right for taller houses.

---

## 3. Real life story

Cashiers’ old RPN calculators (HP): type numbers, then operator — stack based, few parentheses needed.

Spreadsheet formulas and compilers parse expressions with shunting-yard (operators on a stack).

Weather app “days until warmer” = Daily Temperatures = NGE distances.

---

## 4. Why does this exist?

Humans write **infix** (`2+3*4`). Machines like **postfix/RPN** for simple stack eval. Interviews test whether you can manage state with stacks under precedence rules.

NGE is the gateway drug to monotonic stacks — appears everywhere.

---

## 5. What problem existed before this?

Left-to-right naive eval ignores precedence: `2+3*4` wrongly becomes 20.

Without NGE pattern, people write O(n²) nested loops and fail large tests.

---

## 6. What happens without it?

- Calculator problems feel “ad hoc” and bug-ridden  
- You cannot explain shunting-yard / RPN  
- Miss Daily Temperatures, Next Greater Node, circular NGE  
- Histogram and contribution problems stay out of reach  

---

## 7. How did people invent this?

**Dijkstra’s shunting-yard algorithm** (1960s) converts infix → postfix with an operator stack.

RPN / stack machines are older still. NGE as named drill is modern CP/interview packaging of monotonic stacks.

---

## 8. Computer intuition

### RPN evaluation

```text
for token:
  if number → push
  if op → pop b, pop a, push a op b
answer = top
```

### Basic Calculator II ( + - * / , no parens )

Scan; keep `lastSign` and current number; on each new sign, apply previous sign to stack (for * / modify top).

### Basic Calculator ( + - and parens )

Stack of signs/results when seeing `(`.

### NGE

Monotonic decreasing stack of indices (previous lesson) — drill until automatic.

---

## 9. Mathematical intuition

Operator precedence: `*` `/` bind tighter than `+` `-`. Parentheses override.

Stack depth tracks nesting. Each token processed once → O(n).

NGE amortized O(n): each index pushed/popped ≤ once.

---

## 10. Step-by-step working

### Eval RPN

1. Stack of longs  
2. On operator, pop rhs then lhs (order matters for `-` `/`)  
3. Push result  
4. Final single value  

### Infix to RPN (shunting-yard sketch)

1. If number → output  
2. If `(` → push op stack  
3. If `)` → pop until `(`  
4. If op → pop while top has ≥ precedence (with associativity rules), then push  
5. Flush op stack to output  

### NGE to the right

As in monotonic lesson — implement from scratch here as drill.

### Next Greater Node in Linked List

Convert to array or use stack of indices while traversing list values.

---

## 11. Dry run

RPN: `["2","1","+","3","*"]` → ((2+1)*3)=9

```text
push 2
push 1
+ → pop 1,2 → push 3
push 3
* → pop 3,3 → push 9
```

Infix Calculator II: `3+2*2`

```text
num builds: 3, sign+, then 2, sign*, then 2
On *: stack has 3; push 2; then * 2 → top becomes 4
End +: result 3+4=7
```

NGE: `[2,1,2,4]` → `[4,2,4,-1]` (dry-run like mono lesson).

---

## 12. Visualization

```text
INFIX:  3 + 2 * 2

Shunting / precedence:
  multiply first
  3 + (4) = 7

RPN stack movie:
  [2] [2,1] [3] [3,3] [9]

NGE lasers:
  2 ──→──────→ 4
  1 → 2
  2 ──→ 4
  4 → none
```

---

## 13. Complexity

| Task | Time | Space |
|---|---|---|
| Eval RPN | O(n) | O(n) |
| Calculator I/II | O(n) | O(n) |
| Infix → RPN | O(n) | O(n) |
| NGE / circular NGE | O(n) | O(n) |

---

## 14. Why this complexity?

Single scan; each operator applied once; stack size ≤ tokens. NGE amortized pops.

---

## 15. C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

int evalRPN(vector<string>& tokens) {
    stack<long long> st;
    for (auto& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            long long b = st.top(); st.pop();
            long long a = st.top(); st.pop();
            if (t == "+") st.push(a + b);
            else if (t == "-") st.push(a - b);
            else if (t == "*") st.push(a * b);
            else st.push(a / b); // trunc toward 0 in C++ for positive; beware negatives per problem
        } else st.push(stoll(t));
    }
    return (int)st.top();
}

int calculateII(string s) {
    stack<int> st;
    long long num = 0;
    char sign = '+';
    auto apply = [&](char sgn, long long v) {
        if (sgn == '+') st.push((int)v);
        else if (sgn == '-') st.push((int)-v);
        else if (sgn == '*') { int t = st.top(); st.pop(); st.push((int)(t * v)); }
        else { int t = st.top(); st.pop(); st.push((int)(t / v)); }
    };
    for (int i = 0; i <= (int)s.size(); i++) {
        char c = (i == (int)s.size() ? '+' : s[i]);
        if (c == ' ') continue;
        if (isdigit(c)) num = num * 10 + (c - '0');
        else {
            apply(sign, num);
            sign = c;
            num = 0;
        }
    }
    long long sum = 0;
    while (!st.empty()) { sum += st.top(); st.pop(); }
    return (int)sum;
}

vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nge;
    stack<int> st;
    for (int x : nums2) {
        while (!st.empty() && st.top() < x) {
            nge[st.top()] = x;
            st.pop();
        }
        st.push(x);
    }
    vector<int> ans;
    for (int x : nums1) ans.push_back(nge.count(x) ? nge[x] : -1);
    return ans;
}

// Daily Temperatures
vector<int> dailyTemperatures(vector<int>& t) {
    int n = t.size();
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && t[st.top()] < t[i]) {
            int j = st.top(); st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}
```

---

## 16. STL usage

```cpp
stack<long long> vals;
stack<char> ops;
unordered_map<int,int> ngeMap; // NGE I mapping
```

For calculators, sometimes `string` stream / index pointer parsing is cleaner than `stringstream` in interviews.

---

## 17. Brute Force

Eval infix by recursively finding deepest parentheses — slow to implement, easy to get wrong, still often O(n²) with naive string copies.

NGE brute: O(n²) nested search.

---

## 18. Better

Convert to RPN then eval — clear phases. Or one-pass calculator with stack.

NGE: monotonic stack O(n).

---

## 19. Optimal

One-pass stack calculators O(n).  
NGE O(n).  
Know integer division rules for the platform (C++ toward 0 for `/` with positives as in LC).

---

## 20. Wrong Thinking → Why it fails → Correct Thinking

```text
Wrong: "Pop order for binary ops is first lhs then rhs."
  ↓
Fails: You popped rhs first if it was on top — then confuse a/b
  ↓
Correct: pop b then a; compute a op b

Wrong: "Spaces and multi-digit numbers can be ignored carefully later."
  ↓
Fails: Off-by-one parsing bugs dominate calculator problems
  ↓
Correct: Build num while isdigit; treat end of string as flush

Wrong: "NGE I needs binary search on nums2."
  ↓
Fails: Unsorted; need next to the right not global
  ↓
Correct: Mono stack on nums2 + hash answers for nums1 queries
```

---

## 21. Common mistakes

1. Division/negatives truncation  
2. Forgetting to flush last number  
3. Precedence wrong between + and *  
4. Parentheses sign stack errors in Calculator I  
5. NGE map missing → should be -1  
6. Daily temperatures: answer days distance not the hotter value  

---

## 22. Interview tricks + company interviewer simulation

### Google
**Ask:** “Basic Calculator with parentheses and + −.”  
**Expected:** Sign stack / result stack; explain `(` pushing state; O(n).

### Amazon
**Ask:** “Evaluate Reverse Polish Notation + Daily Temperatures.”  
**Expected:** Clean stack eval; monotonic stack distances; edge empty ops.

### Microsoft
**Ask:** “Next Greater Element I/II (circular).”  
**Expected:** Mono stack; circular via 2n; map for queries.

### OpenAI
**Ask:** “Why RPN simplifies evaluation?”  
**Expected:** Precedence already resolved; only stack of values; fewer states than infix.

**Interview phrase:**

```text
"I'll parse numbers explicitly, keep an operator/result stack for precedence,
and for next greater I'll use a monotonic decreasing stack of indices."
```

---

## 23. Company use cases

| Context | Use |
|---|---|
| Formula engines | Expression stacks |
| Compilers / interpreters | Shunting-yard, AST (stack builds) |
| Config DSLs | Tiny calculators |
| Alerting “time until threshold” | NGE-like scans |
| UI gesture “next peak” | NGE |

---

## 24. Related concepts + pattern recognition cues

**Related:** monotonic stack, recursion descent parsing, AST, stack module basics.

| Cue | Approach |
|---|---|
| Tokens + operators, no parens | Calc II stack |
| Nested `( )` + + − | Calc I sign stack |
| Postfix tokens | RPN eval |
| First greater right | Mono stack |
| Circular array greater | 2n mono stack |
| Warmer day distances | Mono stack indices |

**Decision snack:**

```text
See operators? → parsing stack
See "next greater/warmer/higher"? → monotonic stack
See window max? → monotonic deque (other lesson)
```

---

## 25. Revision notes + practice roadmap + spaced repetition

### Sticky summary

```text
RPN: push numbers, pop two for ops (b then a)
Infix: respect precedence with stacks
NGE: decreasing index stack, amortized O(n)
Daily temps: same but store distance i-j
Flush the last number in calculators
```

### Checklist

- [ ] Eval one RPN by hand  
- [ ] Code Daily Temperatures blind  
- [ ] Explain Calc II * / handling  
- [ ] Circular NGE 2n pattern  
- [ ] List pop order a op b  

### Practice roadmap

1. Easy/Med: Eval RPN, Next Greater I, Daily Temperatures  
2. Medium: Next Greater II, Calculator II, Remove K Digits  
3. Harder: Basic Calculator, Score of Parentheses, Maximum Frequency Stack (design)

### Spaced repetition

| Day | Action |
|---|---|
| 1 | RPN dry-run + NGE dry-run |
| 3 | Code evalRPN + dailyTemperatures |
| 7 | Calculator II from memory |
| 15 | Circular NGE + Calc I sketch |
| 30 | Teach shunting-yard in 3 min |
| 90 | Mock: RPN + temperatures + calc |

```text
Item: Expressions & Next Greater
Learned: YYYY-MM-DD
Next: +1, +3, +7, +15, +30, +90
Status: Needs Revision / Solid / Mastered
```
