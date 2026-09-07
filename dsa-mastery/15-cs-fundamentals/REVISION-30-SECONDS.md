# CS Fundamentals — 30-Second Revision

Close notes. Speak aloud.

## OS

- Process = own address space; threads share it.
- Virtual memory + page faults; thrashing = working set > RAM.
- Deadlock: 4 Coffman conditions; fix with lock order.

## Networks

- App → TCP/UDP → IP → link.
- TCP reliable byte stream; UDP datagrams.
- URL path: DNS → TCP(+TLS) → HTTP.

## Databases

- B+Tree indexes; ACID; WAL durability.
- Isolation anomalies; MVCC vs locks.
- EXPLAIN slow queries; replicas lag.

## Memory/CPU

- Hierarchy; cache lines; locality beats pointer chasing.
- False sharing = same line, different cores.

## Compiler

- Preprocess → compile → link.
- UB + `-O2` assumptions; declare vs define.

## Linux

- Pipes/redirects; permissions; SIGTERM then SIGKILL; `ss`/`curl`.

## Concurrency

- Data race = UB; mutex/atomic; CV waits with predicate; pools.

## Pass rule

Blank on any block → reopen that lesson’s Q&A today.
