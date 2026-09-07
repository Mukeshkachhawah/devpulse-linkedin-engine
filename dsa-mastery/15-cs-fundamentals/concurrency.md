# Concurrency (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L4–L5  
**Prerequisite:** OS process/thread basics, C++ classes/functions  
**Memory picture:** Concurrency is many cooks in one kitchen. Without rules, two cooks grab the same knife (data race). Locks are “one at a time” signs. Sometimes you use separate cutting boards (sharding) to avoid fighting.

---

## 1. What is it?

**Concurrency** means dealing with many tasks in progress overlapping in time. **Parallelism** means they truly run at the same time on multiple cores. Interviews mix both.

Core toolkit: threads, mutexes, atomics, condition variables, deadlocks, thread pools, async patterns, memory ordering at a high level.

New words:

- **Data race** — unsynchronized conflicting accesses (UB in C++).  
- **Mutex** — mutual exclusion lock.  
- **Critical section** — code under exclusion.  
- **Atomic** — indivisible operation on a location (with memory rules).  
- **Condition variable** — wait until a condition may be true.  
- **Thread pool** — reuse workers for tasks.  
- **Async / future** — promise of a result later.  
- **Contention** — many threads fighting one lock.

---

## 2. Explain like I am 10

Class project: four kids paint one poster. If all paint the same corner, mess. Rules: take turns on shared paint (lock), or each paints their own quarter (split work), then combine.

---

## 3. Why it exists

CPUs have many cores; servers handle many requests; UIs must stay responsive. Concurrency uses hardware and hides latency (I/O waits).

Without sync: Heisenbugs. With too much sync: slow serial soup.

---

## 4. Thread basics in C++

```cpp
#include <thread>
#include <iostream>
using namespace std;

void work(int id) {
    cout << "hello from " << id << "\n"; // cout also needs care if heavily concurrent
}

int main() {
    thread t1(work, 1), t2(work, 2);
    t1.join(); // wait
    t2.join();
}
```

- **join:** wait for finish.  
- **detach:** rare in interviews; lifetime harder.  
- Always define ownership: who joins?

---

## 5. The race

```cpp
int counter = 0; // shared

void bump() {
    for (int i = 0; i < 100000; ++i)
        ++counter; // READ-MODIFY-WRITE not atomic as a whole
}
```

Two threads → lost updates. Final not always 200000.

```text
T1 reads 41
T2 reads 41
T1 writes 42
T2 writes 42   // lost an increment
```

---

## 6. Mutex

```cpp
#include <mutex>
mutex m;
int counter = 0;

void bump() {
    for (int i = 0; i < 100000; ++i) {
        lock_guard<mutex> g(m);
        ++counter;
    }
}
```

`lock_guard` = RAII lock; unlocks on scope exit (exception-safe).

**Granularity:** lock only what you must. Giant locks kill parallelism.

---

## 7. Atomics (when they fit)

```cpp
#include <atomic>
atomic<int> counter{0};

void bump() {
    for (int i = 0; i < 100000; ++i)
        counter.fetch_add(1); // or ++counter
}
```

Good for counters/flags. Not automatic solution for multi-field invariants (“transfer money” needs stronger critical sections / transactions).

---

## 8. Deadlock (again, with code shape)

```cpp
mutex a, b;

void f() {
    lock_guard<mutex> ga(a);
    lock_guard<mutex> gb(b);
}
void g() {
    lock_guard<mutex> gb(b);
    lock_guard<mutex> ga(a); // opposite order → deadlock risk
}
```

**Fix:** global lock order; or `std::scoped_lock(a,b)` (C++17) locks deadlock-avoidingly.

---

## 9. Condition variables — wait for state

Pattern: wait until queue non-empty.

```cpp
#include <condition_variable>
#include <queue>
mutex m;
condition_variable cv;
queue<int> q;

void producer(int x) {
    {
        lock_guard<mutex> g(m);
        q.push(x);
    }
    cv.notify_one();
}

int consumer() {
    unique_lock<mutex> lk(m);
    cv.wait(lk, [] { return !q.empty(); }); // handles spurious wakeups
    int x = q.front(); q.pop();
    return x;
}
```

**Always wait with a predicate** (spurious wakeups / race on check).

---

## 10. Thread pools & async mental model

Creating a thread per tiny task is expensive. Pools keep N workers pulling tasks.

```text
Tasks → [queue] → worker threads
```

`std::async` may run async or deferred depending on policy — know to check docs; in interviews discuss thread pool design more than obscure `async` pitfalls.

---

## 11. Happens-before (lightweight)

Synchronization creates ordering:

```text
T1 unlock mutex  happens-before  T2 lock same mutex
→ T2 sees writes T1 did before unlock
```

Without sync, “I assigned the pointer then published it” can break under optimization/hardware reordering — use mutex/atomic publish carefully.

Interview depth: mention **memory order** exists (`relaxed` vs `acquire/release`) without pretending to be an expert unless you are.

---

## 12. Design patterns that reduce pain

| Pattern | Idea |
|---|---|
| Immutable data | Share read-only |
| Shard / partition | Less sharing |
| Message passing | Own data in actor/queue |
| Copy then publish | Build privately, publish with sync |
| Read-write lock | Many readers OR one writer |

---

## 13. Common interview Q&A

**Q1. Concurrency vs parallelism?**  
A: Overlap in time vs simultaneous execution; parallel needs multiple cores (or HW lanes).

**Q2. What is a data race?**  
A: Conflicting unsynchronized access; UB in C++.

**Q3. Mutex vs atomic?**  
A: Mutex protects critical sections of any logic; atomics for single-location lock-free ops with memory rules.

**Q4. How to avoid deadlock?**  
A: Lock ordering, timeouts/try_lock strategies, reduce locks, prefer higher-level concurrency tools.

**Q5. What is RAII locking?**  
A: Lock ownership tied to object lifetime → exception safe unlock.

**Q6. Producer-consumer how?**  
A: Queue + mutex + condition_variable; wait on predicate.

**Q7. Why thread pool?**  
A: Amortize thread creation; bound concurrency; manage load.

**Q8. What is contention?**  
A: Threads serialize on one lock/resource; scaling dies.

**Q9. Can you use `volatile` for sync in C++?**  
A: No — `volatile` is not for threading; use `std::atomic` / mutexes.

**Q10. How would you make a thread-safe counter?**  
A: `atomic<int>` or mutex; discuss throughput needs.

**Bonus Q. Design a thread-safe LRU cache?**  
A: Mutex around structure; or sharding; discuss complexity and lock scope; watch deadlocks if callbacks reenter.

---

## 14. Visualization — lock timeline

```text
T1: |--lock--| crit |--unlock--|
T2:               wait........|--lock--| crit |unlock|
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"Add mutex everywhere blindly."
        ↓
Deadlocks + no speedup.
        ↓
"Identify shared mutable state; minimize it; lock small."
```

```text
"It passed stress once ⇒ correct."
        ↓
Races are probabilistic.
        ↓
"Design for correctness; use TSan; reason about ownership."
```

---

## 16. Common mistakes

- Sharing `std::cout` heavily without sync (interleaved output).  
- Forgetting `join`.  
- Waiting on CV without holding mutex / without predicate.  
- Nested locks in unknown order.  
- Returning references to unlocked shared data.  

---

## 17. Company use cases

Web servers, game loops, browsers, databases, parallel algorithms, UI + background workers.

---

## 18. Related concepts

OS scheduling, false sharing (memory-cache lesson), databases transactions, debugging races with TSan.

---

## 19. Mini practice set

1. Fix the racy counter two ways (mutex, atomic).  
2. Create a deadlock; fix with `scoped_lock`.  
3. Implement bounded blocking queue.  
4. Explain how you’d parallelize array sum safely.

---

## 20. Revision checklist

- [ ] Race diagram  
- [ ] mutex + lock_guard  
- [ ] atomic counter  
- [ ] deadlock + ordering  
- [ ] CV + predicate  
- [ ] pool purpose  
- [ ] volatile myth  

**Spaced repetition:** Code counter+queue from memory day 1/3/7.  
**Exit check:** 5-minute design talk: thread-safe producer-consumer pipeline.
