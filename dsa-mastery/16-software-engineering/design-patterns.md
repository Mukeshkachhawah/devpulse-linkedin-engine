# Design Patterns (Interview Core)

**Module:** 16-software-engineering  
**Level target:** L4  
**Prerequisite:** OOP basics (class/interface/inheritance), clean code  
**Memory picture:** Patterns are recipe cards for recurring design problems — not a religion. Use a recipe when you recognize the hunger; don’t cook every recipe every night.

---

## 1. What is it?

**Design patterns** are named, reusable solutions to common software design problems (popularized by the “Gang of Four” book). Interviews ask you to **recognize, explain tradeoffs, and maybe sketch** — not recite 50 diagrams.

Focus set for interviews:

- Singleton (and why it’s controversial)  
- Factory / simple factory  
- Strategy  
- Observer  
- Adapter  
- Decorator  
- Command (light)  
- MVC / layered idea (architectural)

New words:

- **Interface / abstract class** — contract for behavior.  
- **Composition** — has-a relationships (often better than deep inheritance).  
- **Dependency inversion** — depend on abstractions.  
- **Open/closed** — open to extension, closed to modification (ideal).

---

## 2. Explain like I am 10

You notice every game has a “pause menu.” Instead of inventing a new pause invention each game, you reuse a known menu pattern. Patterns are shared LEGO instructions for software.

---

## 3. Why it exists

Teams need a shared vocabulary: “Let’s use Strategy here” beats a 20-minute speech. Patterns capture experience about change points.

Without them: reinvent awkward structures; with cargo-cult: overengineer Hello World.

---

## 4. Guiding idea — encapsulate what varies

```text
Find what changes
Hide it behind an interface
Keep the stable parts boring
Prefer composition: "has a behavior" over "is a giant hierarchy"
```

---

## 5. Strategy — swap algorithms

**Problem:** many interchangeable behaviors (sort modes, pay methods, compression).

```cpp
#include <memory>
#include <iostream>
using namespace std;

struct Greeter {
    virtual ~Greeter() = default;
    virtual void greet() const = 0;
};

struct Hello : Greeter {
    void greet() const override { cout << "Hello\n"; }
};

struct Hey : Greeter {
    void greet() const override { cout << "Hey\n"; }
};

struct App {
    unique_ptr<Greeter> g;
    explicit App(unique_ptr<Greeter> greeter) : g(std::move(greeter)) {}
    void run() const { g->greet(); }
};

int main() {
    App a(make_unique<Hello>());
    a.run();
}
```

**Interview line:** “Strategy lets us pick an algorithm at runtime without switch-case explosion.”

---

## 6. Observer — publish/subscribe

**Problem:** many listeners react to an event (UI clicks, stock ticks).

```text
Subject (publisher)
   ├─ Observer A
   ├─ Observer B
   └─ Observer C
notify() → each update()
```

Careful: lifetime of observers; notify reentrancy; threading.

**Use:** event systems, MVC view updates.

---

## 7. Factory — centralize creation

**Problem:** creating objects is complex / type chosen from config.

```cpp
unique_ptr<Greeter> makeGreeter(const string& type) {
    if (type == "hello") return make_unique<Hello>();
    if (type == "hey") return make_unique<Hey>();
    throw invalid_argument("unknown");
}
```

Variants: factory method, abstract factory — know idea: **caller depends on interface, not concrete `new` everywhere**.

---

## 8. Adapter — make incompatible interfaces work

```text
OldSquarePeg  →  Adapter  →  RoundHole expects RoundPeg
```

Wrap old API to match new required interface. Common in integrations.

---

## 9. Decorator — add behavior without exploding subclasses

```text
Coffee
Coffee + Milk
Coffee + Milk + Sugar
```

Decorator wraps an interface and adds before/after behavior (C++ iostreams manipulators vibe; Java I/O streams classic).

Vs inheritance: mix features without combinatorial subclass blowup.

---

## 10. Singleton — one instance (use sparingly)

```cpp
class Config {
public:
    static Config& instance() {
        static Config cfg; // thread-safe init since C++11
        return cfg;
    }
    Config(const Config&) = delete;
    void operator=(const Config&) = delete;
private:
    Config() = default;
};
```

**Pros:** global access to true single resource.  
**Cons:** hidden dependencies, hard tests, lifetime/order issues. Prefer dependency injection.

**Interview maturity:** “I know Singleton; I avoid it unless justified; I’d inject interfaces for testability.”

---

## 11. Command — encapsulate a request

Turn an action into an object: undo/redo queues, task queues, macros.

```text
Button → Command::execute()
           ↓
         Receiver does work
```

---

## 12. MVC / layered (architecture pattern)

```text
View  ↔  Controller  ↔  Model
UI         glue         data/rules
```

Or: API layer → service → repository → DB. Separates concerns so UI doesn’t talk SQL directly.

---

## 13. Common interview Q&A

**Q1. What is a design pattern?**  
A: Named reusable design solution + vocabulary; example Strategy.

**Q2. Strategy vs inheritance overrides?**  
A: Strategy composes interchangeable behaviors; more flexible than deep hierarchies.

**Q3. When Observer?**  
A: One-to-many event notification with loose coupling.

**Q4. Singleton problems?**  
A: Global state, testing pain; prefer DI.

**Q5. Adapter vs Decorator?**  
A: Adapter changes interface to fit; Decorator keeps interface, extends behavior.

**Q6. Factory benefit?**  
A: Decouple creation; single place for construction rules.

**Q7. Is pattern overuse bad?**  
A: Yes — complexity without change pressure; YAGNI.

**Q8. Composition vs inheritance?**  
A: Composition usually more flexible; inheritance for true “is-a” with care.

---

## 14. Visualization — decide with change

```text
If you see growing switch(type)...
  → Strategy / Factory

If many objects need updates...
  → Observer

If old API must fit new...
  → Adapter

If feature stacking subclasses explode...
  → Decorator
```

---

## 15. Wrong Thinking → Correct Thinking

```text
"I'll design with 12 patterns first."
        ↓
Unreadable architecture for a simple problem.
        ↓
"Start simple; introduce pattern when a variation stabilizes."
```

```text
"Singleton for all shared stuff."
        ↓
Untestable spaghetti globals.
        ↓
"Inject dependencies; limit true singletons."
```

---

## 16. Common mistakes

- Pattern bingo in interviews without tradeoffs.  
- Inheritance for code reuse only (should be behavior contracts).  
- Observer memory leaks (not unsubscribing).  
- Factories that hide everything uselessly.  

---

## 17. Company use cases

Plugin systems (Strategy/Factory), GUIs (Observer/MVC), middleware (Decorator), enterprise integrations (Adapter), job queues (Command).

---

## 18. Related concepts

Clean code, refactoring toward patterns, concurrency (Observer threading), testing with interfaces.

---

## 19. Practice

1. Refactor a switch-pay method into Strategy.  
2. Sketch Observer for a stock price.  
3. Wrap a legacy API with Adapter.  
4. Explain why you would *not* use Singleton in a web handler.

---

## 20. Revision checklist

- [ ] Encapsulate what varies  
- [ ] Strategy / Observer / Factory  
- [ ] Adapter vs Decorator  
- [ ] Singleton caveats  
- [ ] Composition > deep inheritance  
- [ ] Anti cargo-cult  

**Spaced repetition:** Teach one pattern per day with a real example.  
**Exit check:** Given “payment methods will grow,” pick a pattern and defend.
