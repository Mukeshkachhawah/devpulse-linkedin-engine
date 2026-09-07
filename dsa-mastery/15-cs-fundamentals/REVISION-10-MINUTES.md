# CS Fundamentals — 10-Minute Revision

## 0:00–2:00 — Closed-book map

List one sticky picture per file:

OS airport · network postal · DB librarian · chef hierarchy · compiler teacher · Linux city · kitchen cooks

## 2:00–5:00 — Dry explain

1. Page fault happy path vs segfault  
2. Type a URL end-to-end  
3. UPDATE durable via WAL (words only)  
4. Why matrix column-scan hurts  
5. Deadlock with two mutexes + fix  

## 5:00–8:00 — Code from memory (C++)

1. Thread + mutex counter **or** atomic counter  
2. Producer-consumer CV sketch  
3. Optional: `map` as ordered index analogy  

## 8:00–10:00 — Interview voice

Pick 3:

- Process vs thread  
- TCP vs UDP  
- Index tradeoffs  
- False sharing  
- Compile vs link error  
- SIGTERM vs SIGKILL  

| Score | Meaning |
|---|---|
| Strong on 5+ topics | Ready for mixed CS rounds |
| Holes in 2–3 | Targeted lesson rerun |
| Holes everywhere | Schedule fundamentals week |

## Exit checklist

- [ ] Said threads share address space  
- [ ] Said TCP is byte stream (framing needed)  
- [ ] Said indexes cost writes  
- [ ] Said UB ≠ “works on my machine”  
- [ ] Said wait on CV with predicate  

## Spaced repetition

Pass → +3/+7/+15 day rotate topics.  
Fail → tomorrow single-topic deep dive.
