# Global Teaching Rules

These rules apply to every lesson in this curriculum.

## Core Rules

1. Assume the reader has **never seen the topic before**.
2. Never skip reasoning.
3. Never say "this is obvious."
4. Explain every new word before using it.
5. Never jump directly to code.
6. Always compare **Brute Force → Better → Optimal**.
7. Always include ASCII / memory / pointer visuals when they help.
8. Always connect the lesson to previous lessons.
9. Always end with summary, revision checklist, spaced repetition, and practice plan.
10. Keep language **simple English**. Keep correctness interview-level.

## Five-Layer Teaching Order

Every concept must be taught in this order:

1. **Real life analogy** — something from daily life
2. **Kid explanation** — as if explaining to a 10-year-old
3. **Computer explanation** — what the machine is doing
4. **Mathematical explanation** — why the numbers / bounds work
5. **Interview explanation** — how to say it in a top-company interview

## Lesson Structure (Required)

Every core lesson uses the 25-section template:

1. What is it?
2. Explain like I am 10
3. Real life story
4. Why does this exist?
5. What problem existed before this?
6. What happens without it?
7. How did people solve this before? / How humans invented this
8. Computer intuition
9. Mathematical intuition
10. Step-by-step working
11. Dry run
12. Visualization
13. Complexity
14. Why this complexity?
15. C++ implementation
16. STL usage
17. Brute Force
18. Better
19. Optimal
20. Wrong Thinking → Why it fails → Correct Thinking
21. Common mistakes
22. Interview tricks + company interviewer simulation
23. Company use cases
24. Related concepts + pattern recognition cues
25. Revision notes + practice roadmap + spaced repetition

## Memory Picture Rule

Every lesson must include one sticky mental image.

Example for Merge Sort:

```text
Big Pizza
   ↓ cut
Smaller pizzas
   ↓ cut
Tiny slices
   ↓ combine in order
Sorted pizza
```

## Visual Learning Rule

Use ASCII diagrams for:

- flowcharts
- memory layouts
- stacks and queues
- trees, graphs, heaps
- pointers and links
- before / after states

## Wrong Thinking Rule

Every chapter must show:

```text
Common Beginner Thinking
        ↓
Why it fails
        ↓
Correct Thinking
```

## Language Rule

- Content language: Simple English only
- Coding language: **C++** (primary)
- Java: only as emergency backup if a company forces it

## Final Goal Reminder

A lesson is successful only if the student can:

- explain the idea to a child
- explain why it exists
- dry-run an example
- code the pattern in C++
- recognize when to use it in an interview
