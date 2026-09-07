# CS Fundamentals Cheatsheet

---

## OS

| Concept | One-liner |
|---|---|
| Process | Isolated address space |
| Thread | Schedulable; shares process memory |
| Syscall | User → kernel controlled entry |
| VM | Virtual→physical via pages/TLB |
| Thrashing | Working set > RAM |
| Deadlock | ME + hold/wait + no preempt + cycle |

---

## Networks

```text
HTTP(S) → TCP → IP → Link
DNS name → IP
TCP: connect, reliable, ordered bytes
UDP: datagram, low overhead
```

URL: DNS → TCP(+TLS) → request → response.

| Code | Family |
|---|---|
| 2xx | OK |
| 4xx | client |
| 5xx | server |

---

## Databases

```text
B+Tree: seek + range
WAL: log before rely on pages
ACID: atomic, consistent, isolated, durable
```

Anomalies: dirty / non-repeatable / phantom.  
MVCC: snapshot versions.  
Slow SQL → EXPLAIN → indexes/joins.

Replica lag is real.

---

## Memory / CPU

```text
regs → L1 → L2 → L3 → RAM → disk
cache line ≈ 64B often
spatial + temporal locality
vector >> list for scans
false sharing: pad/align per core hot fields
```

---

## Compiler

```text
preprocess → compile → link
declare ≠ define
UB + optimizer assumes no UB
-O2 for prod/judges; -g for debug
```

---

## Linux

```bash
ls/cd/pwd/cat/less/tail -f
grep | pipes ; > >> 2>&1
chmod 644/755 ; ps ; kill ; kill -9
ss -lptn ; curl -v ; df -h
```

SIGTERM then wait; SIGKILL last.

---

## Concurrency (C++)

```cpp
mutex m; lock_guard<mutex> g(m);
atomic<int> c{0}; c.fetch_add(1);
cv.wait(lk, pred);
scoped_lock lk(a, b); // ordered locking helper
```

Race = UB. Don’t use `volatile` for sync.  
Pools bound threads; shrink critical sections.

---

## Interview Openers

- “Threads share memory so we need synchronization…”  
- “I’d check constraints/RTT before blaming bandwidth…”  
- “Index helps this predicate; write cost is…”  
- “Same Big-O, but locality changes constants…”
