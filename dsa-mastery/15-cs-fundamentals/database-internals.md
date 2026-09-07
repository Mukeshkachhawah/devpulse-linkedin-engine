# Database Internals (Interview Core)

**Module:** 15-cs-fundamentals  
**Level target:** L4–L5  
**Prerequisite:** SQL basics (SELECT/JOIN), Big-O, trees/hashing intuition  
**Memory picture:** A database is a librarian with a card catalog (indexes), a desk cache (buffer pool), and strict checkout rules (transactions) so two people don’t overwrite the same book page.

---

## 1. What is it?

**Database internals** means how a DB stores data, finds it fast, and keeps it correct when many clients write at once.

Interview focus: **indexes (B+Tree)**, **transactions/ACID**, **isolation levels**, **locks vs MVCC**, **query plans**, **normalization vs denorm**, **replication/sharding** at a conceptual level.

New words:

- **Index** — side structure to find rows faster.  
- **Clustered index** — rows stored in index order (common primary key idea in InnoDB).  
- **Heap storage** — rows not in key order (varies by engine).  
- **Transaction** — group of reads/writes that form one logical unit.  
- **WAL** — write-ahead log for durability/crash recovery.  
- **Cardinality** — how unique column values are.  
- **Selectivity** — how well a predicate filters.

---

## 2. Explain like I am 10

A giant notebook of students. Without an index, you flip every page to find “Zara.” With an index (like a sorted name list pointing to page numbers), you jump near Zara fast. If two teachers edit the same page, rules decide who wins and how we don’t lose grades when power cuts.

---

## 3. Why it exists

Files + custom code don’t scale for concurrent correct updates. Databases give **durable**, **shared**, **queryable** storage with safety.

Without internals knowledge: you sprinkle indexes randomly, cause deadlocks, and can’t explain slow queries.

---

## 4. Storage engine big picture

```text
SQL query
  → parser/planner/optimizer
    → executor
      → buffer pool (pages in RAM)
        → disk pages / SSTables / etc
      → WAL / redo-undo logs
```

Most OLTP systems move **pages** (e.g. 8KB/16KB), not single rows, between disk and memory.

---

## 5. Indexes — B+Tree star of interviews

**B+Tree:** balanced tree; keys sorted; leaf level linked; great for range scans and point lookups.

```text
            [50 | 90]
           /    |    \
      [10|30] [50|70] [90|120]
       / | \   ...      ...
    leaves contain keys → row pointers / row data
```

**Why B+Tree over binary tree on disk?** High fanout → fewer disk I/Os (height small).

**Hash index:** great equality, weak ranges.  
**Secondary index:** extra tree on other columns; points to PK/row.

**Cost:** faster reads (sometimes); slower writes; space; wrong index can be ignored by optimizer.

---

## 6. How a query uses indexes (intuition)

```sql
SELECT * FROM users WHERE email = 'a@b.com';
```

If index on `email`: seek leaf → fetch row.  
If no index: **sequential scan** whole table.

```sql
WHERE age > 30 AND age < 40
```

Sorted index helps range. Hash index doesn’t.

**Composite index** `(a,b)`:

- Helps `a = ?`, `a = ? AND b = ?`, `a = ? AND b > ?`  
- Usually weak for `b = ?` alone (leftmost prefix rule — know as rule of thumb).

---

## 7. Transactions & ACID

- **Atomicity:** all or nothing.  
- **Consistency:** integrity rules preserved (app + DB constraints).  
- **Isolation:** concurrent transactions don’t step on each other incorrectly.  
- **Durability:** after commit, data survives crash (WAL + fsync strategies).

**Kid analogy:** Group homework submit — either whole project in, or none; teachers’ rules hold; classmates don’t silently overwrite; after “submitted,” fire doesn’t erase (backup/log).

---

## 8. Isolation anomalies

| Anomaly | Meaning |
|---|---|
| Dirty read | Read uncommitted data of another txn |
| Non-repeatable read | Re-read row, value changed |
| Phantom read | Re-run range query, new rows appear |

**Levels (conceptual):** Read Uncommitted → Read Committed → Repeatable Read → Serializable (stricter left to right).

Real engines differ (Postgres MVCC details vs MySQL). Interview: know anomalies + that higher isolation can mean more locking/aborts.

---

## 9. Locks vs MVCC

**Locking:** writers/readers coordinate with locks; can block.  
**MVCC:** readers see a snapshot; writers create new versions; reduces read/write blocking.

```text
Txn A reads snapshot at t0
Txn B commits update at t1
A still sees old row version (depending on isolation)
```

**Deadlocks:** cycle in lock waits → DB detects and aborts one txn. App should retry.

---

## 10. WAL & durability (simple)

```text
Change memory page
Write log record first (WAL)
Commit → ensure log durable
Later flush dirty pages to data files
Crash → replay WAL
```

**Interview line:** “We log intent before relying on in-place page writes so recovery can redo/undo.”

---

## 11. Query planning

Optimizer estimates costs using stats (row counts, selectivity).

Explain plans show: Seq Scan vs Index Scan vs Index Only Scan, join types (nested loop, hash join, merge join).

**You should say:** “Slow query → EXPLAIN, check scans, missing indexes, bad joins, SELECT * overfetch.”

---

## 12. Normalization vs denormalization

- **Normalize:** reduce redundancy; update anomalies down; more joins.  
- **Denormalize:** duplicate for read speed; write complexity up.

Interviews want tradeoffs, not religion.

---

## 13. Scaling ideas

```text
Vertical: bigger machine
Replica: read scaling + failover (replication lag!)
Shard/partition: split data by key (harder queries/joins)
Cache (Redis): before DB for hot keys — mind consistency
```

**Primary-replica:**

```text
Writes → Primary → stream → Replicas → Reads
                 (async lag possible)
```

---

## 14. Common interview Q&A

**Q1. What is an index? Pros/cons?**  
A: Extra structure for faster lookups/ranges; costs writes/space; must match query patterns.

**Q2. Why B+Tree?**  
A: Balanced, high fanout, disk-friendly, range-friendly via ordered leaves.

**Q3. Explain ACID briefly.**  
A: All-or-nothing; valid state; controlled concurrency; survives crash after commit.

**Q4. Dirty read vs phantom?**  
A: Uncommitted value vs new rows in repeated range.

**Q5. What is MVCC?**  
A: Multiple versions so readers don’t block writers as much; snapshots.

**Q6. How does a DB recover after power loss?**  
A: Replay WAL / recover using logs; undo uncommitted, redo committed.

**Q7. When is a hash index useful?**  
A: Equality heavy workloads; not ranges.

**Q8. What is covering index?**  
A: Index contains all columns needed — avoid table lookup.

**Q9. Primary vs secondary index?**  
A: PK identity/cluster often; secondary alternative access path.

**Q10. Why is SELECT * bad on wide rows?**  
A: Extra I/O/network; prevents some index-only optimizations.

---

## 15. Mini C++ analogy — in-memory index toy

```cpp
#include <map>
#include <string>
#include <iostream>
using namespace std;

// map ≈ ordered index (tree); unordered_map ≈ hash index
int main() {
    map<string, int> emailToId;
    emailToId["ada@ex.com"] = 1;
    emailToId["bob@ex.com"] = 2;
    cout << emailToId.lower_bound("b")->second << "\n"; // range-capable
}
```

Real DB adds pages, WAL, concurrency — but API intuition helps.

---

## 16. Wrong Thinking → Correct Thinking

```text
"Index everything."
        ↓
Writes die; optimizer confused; space explodes.
        ↓
"Index for measured hot queries."
```

```text
"Replica lag never matters."
        ↓
Read-your-writes fails; stale features.
        ↓
"Know consistency needs; read primary when required."
```

---

## 17. Common mistakes

- Thinking index always speeds every query.  
- Ignoring cardinality (indexing boolean alone often weak).  
- Forgetting transactions around multi-step invariants.  
- Confusing partition key with “magic infinite scale.”  

---

## 18. Company use cases

Order systems, feeds, payments, inventory — any multi-user state. On-call: slow queries, deadlocks, replication lag.

---

## 19. Related concepts

OS pages/cache, networks (DB protocol), concurrency, memory hierarchy, clean schema design.

---

## 20. Revision checklist

- [ ] B+Tree why + picture  
- [ ] ACID one-liners  
- [ ] Isolation anomalies  
- [ ] MVCC vs locks  
- [ ] WAL purpose  
- [ ] EXPLAIN mindset  
- [ ] Replica lag awareness  

**Spaced repetition:** Redraw B+Tree + WAL flow day 1/3/7.  
**Practice:** Take a slow SQL example; propose 1 index and justify.  
**Exit check:** 5-minute talk: “How Postgres/MySQL-ish engines make UPDATE durable and concurrent.”
