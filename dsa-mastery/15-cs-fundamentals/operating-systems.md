# Operating Systems (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L4 (explain OS ideas clearly in interviews)  
**Prerequisite:** programs, processes as “running programs,” basic C++ memory (stack/heap intuition)  
**Memory picture:** The OS is the airport manager. Apps are airlines. CPU gates, memory hangars, and disk warehouses must be shared fairly without crashes.

---

## 1. What is it?

An **Operating System (OS)** is system software that manages hardware and gives programs a safe, useful environment: process scheduling, memory, files, devices, security.

Interview OS is not “install Linux from scratch.” It is: **process vs thread, scheduling, memory, virtual memory, concurrency basics, deadlocks, caches interplay**.

New words:

- **Process** — running program with its own address space.  
- **Thread** — unit of scheduling inside a process; shares memory with sibling threads.  
- **Context switch** — CPU stops one task, loads another’s state.  
- **Kernel** — privileged OS core.  
- **System call** — controlled door from user program into kernel (read, write, mmap…).  
- **Virtual memory** — illusion each process has its own large private memory.  
- **Page fault** — needed page not in RAM; OS must fetch/handle.  
- **Deadlock** — circle of waiting forever.

---

## 2. Explain like I am 10

You and your siblings share one toy room (CPU + memory). Mom (OS) decides who plays, puts toys in labeled boxes so nobody ruins another’s Lego city, and sends overflow toys to the garage (disk) when the room is full.

---

## 3. Real life story / why it exists

Without an OS, every app would talk to raw hardware, crash each other, and monopolize the CPU. OS exists so many programs can **share** one machine safely and efficiently.

**Before OS abstractions:** single program machines, manual setup.  
**Without OS ideas in interviews:** you can’t explain latency spikes, thrashing, or why threads deadlock.

---

## 4. Process vs Thread

```text
Process A                 Process B
┌──────────────┐         ┌──────────────┐
│ code/data    │         │ code/data    │
│ heap         │         │ heap         │
│ threads: t1  │         │ thread: t1   │
│          t2  │         └──────────────┘
└──────────────┘
   t1 & t2 share A's memory
   A does NOT share with B
```

| | Process | Thread |
|---|---|---|
| Address space | Own | Shared within process |
| Create cost | Higher | Lower |
| Crash isolation | Better | One bad thread can corrupt process |
| Communication | IPC (pipes, sockets…) | Shared memory + sync |

**Kid line:** Processes = separate houses. Threads = roommates in one house.

**Interview line:** “Threads share address space so communication is easy but races require locks; processes isolate memory.”

---

## 5. Scheduling (CPU time sharing)

The CPU runs one thread at a time per core (simplified). Scheduler picks what’s next.

Common ideas:

- **Ready queue** — runnable tasks waiting.  
- **Time slice / quantum** — how long before preemption.  
- **Preemptive** — OS can interrupt.  
- **I/O bound vs CPU bound** — waiting for disk/net vs crunching.

```text
Running --block I/O--> Waiting
   ^                     |
   |                     v
   +------ wake -------- Ready <--> (scheduler picks)
```

**Metrics:** throughput, turnaround, response time, fairness.

**Interview classic:** Explain why fair scheduling matters for interactive apps vs batch jobs.

---

## 6. System calls & user vs kernel mode

```text
User mode: your app (restricted)
    |  syscall (trap)
    v
Kernel mode: OS privileged operations
    |  return
    v
User mode continues
```

Examples: `read`, `write`, `open`, `fork`/`clone`, `mmap`, `exit`.

Syscalls are slower than normal function calls (mode switch). Batching/buffering exists partly for this.

---

## 7. Memory management & virtual memory

Each process sees **virtual addresses**. OS + MMU map them to **physical frames**.

```text
Virtual pages          Physical RAM
[0][1][2][3]...   -->  frames scattered
         \               /
          page table + TLB
```

**Benefits:** isolation, convenient contiguous virtual layout, use disk as backing (**swap**).

**Thrashing:** too many active pages for RAM → constant page faults → system crawls.

**Interview line:** “Virtual memory gives isolation and lets us overcommit carefully; thrashing happens when working sets don’t fit.”

---

## 8. Paging vs segmentation (interview depth)

- **Paging:** fixed-size pages; no external fragmentation; used everywhere modern.  
- **Segmentation:** variable-size logical segments (code/stack/heap historically).  
Modern systems: mostly paging (+ OS concepts of regions).

**Page replacement ideas:** FIFO, LRU approximations, clock algorithm. Exact LRU is expensive; hardware/OS approximates.

---

## 9. Concurrency inside the OS view

Threads need **synchronization**:

- **Mutex / lock** — mutual exclusion critical section.  
- **Semaphore** — counter for signaling/resources.  
- **Condition variable** — wait for a predicate with a mutex.  
- **Atomic** — hardware-supported indivisible ops.

**Race:** outcome depends on timing.  
**Critical section:** code touching shared data safely.

---

## 10. Deadlocks

Four Coffman conditions (all needed):

1. Mutual exclusion  
2. Hold and wait  
3. No preemption of locks  
4. Circular wait  

```text
T1 holds A waits B
T2 holds B waits A
      DEADLOCK
```

**Prevention ideas:** lock ordering, avoid hold-and-wait, timeouts, deadlock detection (wait-for graph).

**Interview favorite:** dining philosophers → lock ordering / resource hierarchy.

---

## 11. Common interview questions (with answers)

**Q1. Process vs thread?**  
A: Process = isolated address space; thread = schedulable entity sharing process memory. Threads cheaper to create/switch generally; need sync.

**Q2. What is a context switch?**  
A: Save CPU registers/thread state, load another; involves kernel; too many hurt performance (cache cold).

**Q3. What happens on `malloc` / `new`?**  
A: User allocator manages heap; may request more memory from OS via `brk`/`mmap`. Freeing often returns to allocator, not always immediately to OS.

**Q4. Stack vs heap?**  
A: Stack = automatic per-thread frames, fast, limited; heap = dynamic, flexible, fragmentation/allocator overhead.

**Q5. What is virtual memory?**  
A: Per-process virtual address space mapped to RAM/disk; isolation + convenience + swapping.

**Q6. Page fault steps (high level)?**  
A: Access missing page → trap → OS finds page (disk/zero/map) or SIGSEGV → update tables → resume.

**Q7. How to avoid deadlock?**  
A: Global lock order; try-lock with backoff; reduce lock scope; sometimes lock-free structures.

**Q8. User mode vs kernel mode?**  
A: Privilege levels; syscalls enter kernel safely.

**Q9. Multilevel queue / nice values?**  
A: Priority scheduling flavors; know concept of priority + fairness / starvation risk.

**Q10. What is thrashing?**  
A: Working set > RAM; paging dominates CPU time; fix by more RAM / fewer active processes / better locality.

---

## 12. Mini C++ connection

```cpp
#include <thread>
#include <mutex>
#include <iostream>
using namespace std;

mutex m;
int counter = 0;

void worker() {
    for (int i = 0; i < 100000; ++i) {
        lock_guard<mutex> g(m); // critical section
        ++counter;
    }
}

int main() {
    thread a(worker), b(worker);
    a.join(); b.join();
    cout << counter << "\n"; // expect 200000
}
```

Without mutex: data race (undefined behavior in C++).

---

## 13. Visualization — process lifecycle

```text
New → Ready → Running → Terminated
              ↓    ↑
           Waiting (I/O)
```

---

## 14. Wrong Thinking → Correct Thinking

```text
"Threads are always faster than processes."
        ↓
Not if heavy locking/contention or need isolation.
        ↓
"Choose based on isolation needs and sync cost."
```

```text
"Virtual memory means infinite RAM."
        ↓
Disk is slow; thrashing kills you.
        ↓
"VM is an abstraction; RAM still matters."
```

---

## 15. Common mistakes in interviews

- Mixing process/thread definitions.  
- Saying mutex “prevents deadlock” (it prevents races; can *cause* deadlock if misordered).  
- Ignoring multi-core: locks still needed.  
- Claiming pages are always 4KB everywhere without humility (common but not sacred).  

---

## 16. Company use cases

- Backend latency (context switches, syscalls).  
- Game engines / browsers (threads, memory).  
- Infra/SRE: thrashing, fd limits, scheduling.  
- Any concurrent service.

---

## 17. Related concepts

Links to: concurrency lesson, memory-cache-CPU, Linux essentials, databases (buffer pool ≈ cache of pages).

---

## 18. Revision checklist

- [ ] Process vs thread + diagram  
- [ ] Syscall / user vs kernel  
- [ ] Virtual memory + page fault + thrashing  
- [ ] Mutex vs deadlock story  
- [ ] Four deadlock conditions  
- [ ] Stack vs heap  

**Spaced repetition:** Explain process vs thread to a rubber duck day 1/3/7.

**Practice:** Implement mutex counter; write deadlock with two mutexes then fix with lock order.

**Exit check:** 5-minute OS monologue covering process/thread, VM, deadlock without notes.
