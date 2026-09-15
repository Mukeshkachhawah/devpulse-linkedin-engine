# Build vs. Buy — Sahi Decision Kaise Karein

> *"'Build vs. buy' sirf technical question nahi hai — yeh strategic decision hai. Maine dekha hai teams ne 6 months waste kiye ek model train karke jab existing API se 80% problem solve ho jata. Maine yeh bhi dekha hai teams ne API par depend kiya phir discover kiya ki yeh use case ke liye API too expensive at scale hai. Dono mistakes expensive hain. Framework chahiye — guesswork nahi."*

---

## Opening Hook — Two Companies, Two Mistakes

**Company A:**
Need: Sentiment analysis for 10,000 customer reviews/day.
Decision: Build custom sentiment model. 3 ML engineers. 4 months.
Result: 91% accuracy. Cost: $300K engineering + $20K infra/year.
Alternative: Existing API. 89% accuracy. $5K/year. Could have deployed in 1 week.
**Mistake: Built when they should have bought.**

**Company B:**
Need: Proprietary financial data analysis for trading signals.
Decision: Use generic LLM API. Sent sensitive financial data to vendor.
Result: Compliance violation. Proprietary data risk. Model didn't understand domain.
Alternative: Fine-tune open source model on their data. Run on-premise.
**Mistake: Bought when they should have built.**

**Same category of decision. Completely different right answers. Context matters everything.**

---

## The Decision Framework

**Five dimensions to evaluate:**

### Dimension 1 — Performance Requirements

**Question: Does existing solution meet your performance bar?**

**Test it first (before deciding):**
Spend 1-2 weeks testing:
Best available API model (GPT-4, Claude-3, etc.)
Best available open source model
Simple prompt engineering
Result: Does it meet your requirements?

**If yes (meets requirements with minimal prompt engineering):**
→ Strong signal to buy.
You don't need custom.

**If close but not quite (85% of the way there):**
→ Fine-tuning may be sufficient.
Try fine-tuning existing model on your data.
Much cheaper than training from scratch.

**If significantly below requirements:**
→ May need custom approach.
But first: Define requirements precisely.
Sometimes "close but not quite" perception is about unclear requirements, not actual gap.

### Dimension 2 — Data Privacy and Security

**Question: Can you send your data to a third-party API?**

**High-sensitivity data:**
Patient health information (PHI/HIPAA).
Financial records subject to regulations.
Proprietary trade secrets.
Classified or government data.
Customer PII with strict data residency requirements.

**If yes (high sensitivity, can't use API):**
→ Build or use on-premise open source.
Options: Fine-tuned open source model (LLaMA, Mistral).
Private cloud deployment.

**If no (data is not highly sensitive):**
→ API is viable.
Most business data: Falls in this category.
Standard business questions, public information queries: API fine.

**Middle ground:**
Many APIs offer: Private deployments. Data doesn't train public model. VPC (Virtual Private Cloud) deployment.
Azure OpenAI, AWS Bedrock, Google Vertex AI: Enterprise options with data isolation.
Check: Do these meet your compliance requirements?

### Dimension 3 — Cost at Scale

**Question: What does this cost at your scale? Break-even analysis.**

**API cost calculation:**
Daily requests × tokens per request × $/token × 365 = annual API cost.
Include: Both input and output tokens.
Include: Retry costs (some % of requests will retry).

**Own model cost calculation:**
Infrastructure: GPU rental or purchase.
Engineering: Maintain, update, monitor.
Operations: Uptime, scaling.
One-time: Training cost (if custom training).

**Break-even:**
API cost per year vs. Own model cost per year.
Include: Engineering time for own model (often underestimated).

**Typical break-even:**
For common tasks: API often wins up to high volume.
At very high volume (millions of requests/day): Own model may be cheaper.
For fine-tuned smaller model serving specific task: Can be much cheaper than frontier API.

**Example calculation:**
Scenario: 1M queries/day, avg 1000 tokens each.
API (GPT-4o-mini at $0.00015/1K input): $0.15/1K requests.
1M requests: $150/day = $54,750/year.
Own model (Mistral-7B fine-tuned):
GPU server: $3,000/month ($36,000/year).
Engineering: $50,000/year.
Total: $86,000/year.
Break-even: ~1.5x. At this volume, API is cheaper.

At 10M queries/day: Own model ($86K) vs API ($547K): Own model much cheaper.

### Dimension 4 — Differentiation

**Question: Is AI capability a core competitive differentiator?**

**If AI IS your product:**
Your product's value = AI quality.
Competitors can use same API you use.
Building proprietary capability: Creates moat.
Example: A company whose core value proposition is AI analysis of financial markets.

**If AI ENABLES your product:**
Your product's value = something else (domain expertise, workflow, distribution).
AI is a feature, not the product.
Using same API as competitors: Fine. Your moat is elsewhere.
Example: A legal SaaS where AI is one feature. Legal workflow and client management is the core.

**The key question:**
"If a competitor used the same AI model as us, would they be as good as us?"
If yes → Your moat is NOT the AI model. → Buy.
If no → Your moat IS the AI model. → Consider build.

### Dimension 5 — Organizational Capability

**Question: Do you have the capability to build and maintain this?**

**Building requires:**
ML engineers who can train/fine-tune models.
Data infrastructure.
MLOps infrastructure.
Ongoing maintenance (model monitoring, retraining).
Significant time investment.

**If you have the capability:**
→ Consider build when other dimensions point to it.

**If you don't have the capability:**
→ Buy first.
Build capability while using bought solution.
Only build once you have a team that can do it well.

**Warning:**
Underestimating ongoing cost is common.
Building a model: ~30% of total cost.
Maintaining it in production: ~70% of total cost over model lifetime.

---

## The Decision Matrix

**Putting it together:**

| Situation | Recommendation |
|---|---|
| API meets requirements + data not sensitive + low-medium volume | Buy (API) |
| API meets requirements + data not sensitive + very high volume | Buy API, then evaluate migration |
| API doesn't meet requirements + have training data | Fine-tune existing model |
| Data too sensitive for API + standard task | Open source model, on-premise |
| Data too sensitive + very specific domain + have data | Train custom model |
| AI is core competitive differentiator | Build (after validating with API) |
| Small team, limited ML expertise | Buy (always) |
| High volume + fine-tuned = cheaper + domain specific | Build (after validation) |

---

## The Staged Approach (Recommended)

**Most teams should follow this sequence:**

**Stage 1 — Prompt engineering only (Week 1-2):**
Test with best available API using only prompting.
No fine-tuning. No custom model.
Evaluate: Can this work?
Cost: $0-$100 in API calls.
If good enough: STOP HERE.

**Stage 2 — RAG + better prompting (Week 2-4):**
Add retrieval augmented generation.
Better system prompts. Few-shot examples.
Evaluate: Improved enough?
Cost: Low (API + some data infrastructure).
If good enough: STOP HERE.

**Stage 3 — Fine-tuning (Month 1-2):**
Fine-tune a model (could be the API provider's model, or open source).
Using your specific domain data.
Evaluate: Performance + cost.
If meets requirements AND cost is acceptable: STOP HERE.

**Stage 4 — Custom training (Only if necessary):**
Train from scratch or continue pretraining.
Only if: Fine-tuning insufficient AND you have enough data AND you have the team.
Very expensive. Rarely necessary.

**Why staged:**
Each stage: Cheaper and faster than next.
Most use cases: Solved in Stage 1 or 2.
Only escalate when you have clear evidence the current stage isn't sufficient.
Don't skip stages to go straight to Stage 4 because "we want maximum performance."

---

## Fine-Tuning vs. Training From Scratch

**Often confused. Very different.**

**Fine-tuning:**
Start with existing pre-trained model (LLaMA, Mistral, GPT-3.5).
Train additional epochs on your specific task data.
Adjust weights slightly for your use case.
Cost: Much less than training.
Data needed: 100-10,000 examples typically.
Time: Hours to days.

**Continued pre-training:**
Start with existing model.
Train further on large domain-specific corpus.
Goal: Model knows your domain better.
Example: Medical LLM (BioMedLM) trained on medical text.
Cost: Significant. Less than full training.
Data needed: Millions of domain-specific tokens.

**Training from scratch:**
Random initialization.
Train from zero.
Needs: Trillions of tokens.
Compute: Hundreds of GPU-months.
Cost: $millions.
Rarely justified unless: Very unique architecture needed, specific language/domain with no existing models.

**For most teams:**
Fine-tuning: The realistic option.
Open source base models: LLaMA-3, Mistral, Phi-3.
Fine-tune on your task data.
Deploy yourself or use fine-tuning APIs (OpenAI, Together AI, etc.).

---

## When Open Source Beats Proprietary API

**Open source: Meta LLaMA, Mistral, DeepSeek, Phi-3.**

**Open source wins when:**
Data privacy: Can't send data externally.
Cost at scale: Own model cheaper at your volume.
Customization: Need to fine-tune with proprietary data.
Latency: Need low latency on-device or on-premise.
No vendor lock-in: Want to switch without API dependency.
Regulated industry: Must know exactly what model you're using.

**Open source challenges:**
Infrastructure: Must run and maintain.
Inference optimization: Not as optimized as proprietary serving.
Model quality: Proprietary frontier still ahead (though gap closing).
No automatic updates: Must actively track new versions.

**Practical guidance:**
LLaMA-3-70B: Strong general purpose. Comparable to many tasks as GPT-4.
Mistral-7B fine-tuned: Great for specific tasks. Low cost.
DeepSeek-R1: Strong reasoning. Open weights. Game-changer for cost.
Phi-3-mini: On-device. Surprisingly capable for small size.

---

## Vendor Lock-in Risks

**A critical consideration often missed.**

**API vendor lock-in:**
Your entire product depends on one vendor's API.
Vendor raises prices: You must pay or rebuild.
Vendor changes model: Your prompts may break.
Vendor shuts down feature: Your product breaks.
Vendor gets acquired: Policies may change.

**Mitigation strategies:**

**Abstraction layer:**
Write your own wrapper around API.
If switching providers: Change wrapper, not entire codebase.
LangChain does this partially.

**Multi-provider strategy:**
Use 2+ providers for critical capabilities.
Primary + fallback.
Costs a bit more but reduces single-point-of-failure.

**Evaluate alternatives periodically:**
Every 6 months: Test if current vendor still best for your use case.
AI is moving fast: Yesterday's best is often not today's best.

**Data portability:**
Keep your fine-tuning data and evaluation sets.
If you switch providers: Can fine-tune the new model.
Don't let training data live only in vendor's system.

---

## Anthropic Insider Angle

From both the vendor side (Anthropic) and engineering side, here's what I see about build vs. buy:

**Why customers choose Claude even when cheaper alternatives exist:** Reliability and consistency matter enormously in production. Claude is designed to behave consistently. Enterprise customers: Don't want surprises. If a model behaves differently on Tuesday than Monday, the product breaks. Consistency > raw capability for production AI.

**The real cost of building custom models:** When teams say "we'll train our own model," they often don't account for: Ongoing inference infrastructure (you're now running a model service), model monitoring (when does it degrade?), retraining (model drift), security (you're now responsible for model security). The fully-loaded cost of running your own model is 3-5x what teams initially estimate. The API handles all of this.

**When I recommend open source even for API-capable teams:** If you're doing a very specific narrow task (e.g., extracting a specific field from a specific document type), a fine-tuned 7B open source model will: Be faster (smaller model), be cheaper (100x less per call), often outperform a large generalist model on the specific task, run on-device or on-premise. Fine-tuning for narrow tasks: Often the best of both worlds.

---

## Common Misconceptions

**Misconception 1: "Build = better performance"**
Not always. A well-prompted GPT-4 often beats a poorly trained custom model. API models are trained on more data with more compute than any single team can match. Custom model only wins when: You have unique domain data, specific enough task, enough data to fine-tune effectively.

**Misconception 2: "Buy = no engineering needed"**
API integration still requires engineering. Prompt engineering, evaluation, monitoring, RAG infrastructure, caching, error handling — all require engineering. "Buy" reduces ML engineering. Doesn't eliminate software engineering.

**Misconception 3: "Fine-tuning fixes everything"**
Fine-tuning improves performance on specific task distributions. It doesn't add new knowledge. It doesn't fix fundamental limitations. If base model can't do X at all: Fine-tuning unlikely to fix that. Use fine-tuning to: Improve format compliance, domain-specific style, task-specific accuracy.

**Misconception 4: "Open source is always cheaper"**
Open source model: Free. Running it: Not free. Compute, storage, engineering, ops. At low to medium scale: Often more expensive than API. At high scale: Can be much cheaper. The math depends on your specific scale.

---

## Interview Questions

**Q1: Build vs. buy decision kaise karein? Framework explain karo.**

**Answer:** Framework — five dimensions: (1) Performance: Does existing API/solution meet requirements? Test first with prompt engineering before building anything. Most tasks: Solved by API with good prompting. (2) Data privacy: Can you send data to third-party API? PHI, proprietary trade secrets, regulated data: May require on-premise. Options: Private API deployments (Azure OpenAI, AWS Bedrock) or open source on-premise. (3) Cost at scale: Calculate break-even: API annual cost vs. own model annual cost (compute + engineering). Include: Ongoing maintenance, not just build cost. At typical scales: API often wins. At very high scale: Own model may win. (4) Differentiation: Is AI your competitive moat? If yes: Building proprietary capability makes sense. If no: Use same API as competitors, differentiate on other dimensions. (5) Organizational capability: Do you have ML engineers to build and maintain? If no: Buy first. Build capability alongside. Staged approach: Stage 1: Prompt engineering only. Stage 2: RAG + better prompting. Stage 3: Fine-tuning. Stage 4: Custom training. Escalate only when clear evidence current stage insufficient. Most teams: Stages 1-2 solve their problem.

**Q2: Fine-tuning vs. API aur kab training from scratch? Differences explain karo.**

**Answer:** Three approaches: (1) API (no training): Use existing model as-is. Just prompting. Cost: Pay per call. When: Standard task, good base model performance, not cost-sensitive. (2) Fine-tuning: Take pre-trained model, train additional epochs on your data. Cost: Much less than training from scratch. Compute: Hours to days on a few GPUs. Data: 100-10,000 labeled examples. When to fine-tune: API nearly meets requirements but not quite. Need specific format/style. Domain-specific vocabulary. Cost at scale: Fine-tuned smaller model cheaper than large API. Options: OpenAI fine-tuning API. Together AI, Replicate fine-tune open source models. DIY with LLaMA, Mistral. (3) Custom training from scratch: Random initialization, train from zero. Cost: Millions. Compute: Hundreds of GPU-months. Data: Billions of tokens. When: Almost never for most teams. Very unique architecture need. Specific language not covered by existing models. You ARE a frontier AI lab. Practical guidance: 90% of teams: API or fine-tuned open source. Only frontier labs: Train from scratch. The decision: Test API. Insufficient? Fine-tune. Still insufficient AND have enormous data AND have the team? Then consider custom.

**Q3: Open source models kab choose karein proprietary API ke upar?**

**Answer:** Choose open source when: (1) Data privacy: Can't send data to external API. PHI, classified, proprietary trade secrets. Open source on-premise: Data never leaves your environment. (2) Cost at very high scale: Calculate break-even. At 10M+ requests/day: Often cheaper to run own model. LLaMA-3-70B inference server vs. frontier API: At scale, own is cheaper. (3) Customization freedom: Need to fine-tune with proprietary data. Need to modify model architecture. Need to run multiple fine-tuned variants. API providers: Don't always offer fine-tuning. When they do: Your fine-tuned weights may stay with them. (4) Latency requirements: On-device or ultra-low latency. Phi-3-mini on device: Sub-100ms. API: 200-500ms+. (5) No vendor dependency: Want to own your capability. Not dependent on vendor pricing, availability, policy changes. Open source challenges: Infrastructure cost and complexity. Inference optimization (less optimized than proprietary serving). Staying current with model updates. Security responsibility. Good options right now: LLaMA-3-70B: Strong general purpose. Mistral-7B/8x7B: Good balance. DeepSeek-R1: Strong reasoning, open weights. Phi-3-mini/small: On-device. For most enterprise: Azure OpenAI (private deployment of GPT-4) or AWS Bedrock often a middle ground — API economics with better data isolation.

**Q4: Vendor lock-in AI mein kaise avoid karein?**

**Answer:** Vendor lock-in risks: API price increases. Model behavior changes breaking your prompts. Model deprecation. Vendor policy changes. Single point of failure. Mitigation: (1) Abstraction layer: Never call API directly everywhere. Write: AIClient class that wraps API. Switching vendors: Change wrapper, not all code. LangChain, LlamaIndex: Do this partially. (2) Multi-provider: Critical paths: Two providers. Primary + fallback. More cost. Less lock-in. Less risk. (3) Standard formats: Prompts: Store in version control. Evaluations: In your own storage. Fine-tuning data: In your data store, not only with vendor. If you switch: Can fine-tune the new model on your data. (4) Regular competitive evaluation: Every 6 months: Evaluate alternatives. New models emerge constantly. Your current best may not be best in 6 months. (5) Contract negotiation: For enterprise contracts: Negotiate data portability. No training on your data. Export clause. (6) Model fingerprinting: Track: Which model version are you using? When vendors update model: Know it changed. Build regression test to catch behavior changes on update. Reality: Some lock-in is acceptable. The question: If vendor X disappeared tomorrow, how quickly could you migrate? Build for: Answer is "1-2 weeks," not "6+ months."

**Q5: AI project mein "make vs. buy" decision kaise document karein?**

**Answer:** Decision documentation structure: (1) Problem statement: What are we trying to solve? What are the requirements? What does "good enough" look like? (2) Options evaluated: List: All viable options considered. For each: Brief description. Estimated cost. Estimated performance. Estimated time to deploy. (3) Evaluation criteria: Performance: Does it meet requirements? Cost: Total cost of ownership. Privacy: Data privacy compliance. Timeline: Time to market. Team capability: Can we execute? (4) Testing results: What did you actually test? Baseline prompt engineering results. Fine-tuning results (if tested). Metrics: Accuracy, latency, cost per request. (5) Recommendation with rationale: Which option you recommend. Why it best meets criteria. What the main tradeoffs are. (6) Risk acknowledgment: What could go wrong with this decision? How would you detect it? What's the mitigation? (7) Revisit criteria: Under what conditions would you revisit this decision? "If volume exceeds 5M requests/day: Revisit build option." "If API cost exceeds $50K/month: Revisit open source." Why document: Team alignment. New engineers understand why. If decision wrong: Can analyze what assumption was wrong. Revisit appropriately.

**Q6: AI cost at scale kaise estimate karein? Common mistakes kya hain?**

**Answer:** Cost estimation framework: API costs: (Daily requests × avg tokens per request × $/token × 30) = monthly. Input and output tokens: Price separately. Spike handling: 2-3x average during peaks. Retry costs: 5-10% retry rate typical. Caching savings: Repeated prompts cached: 30-50% reduction in cost. Own model costs: Compute: GPU type × # of GPUs × hours/day × $rate × 30. H100 on cloud: ~$3-4/hour. A100: ~$2-3/hour. Storage: Model weights (50GB-500GB). Monitoring: Minimal but real. Engineering: Ongoing. (1-0.5 FTE minimum to maintain in production.) Training (one-time): GPU hours × rate. Amortize over model lifetime. Common mistakes: (1) Not including engineering time: 1 FTE = $150K-$250K/year. This dominates cost for small-scale deployments. (2) Not including ongoing maintenance: Model drift. Retraining. Monitoring. This is 70% of lifetime cost. (3) Using average load, not peak: Serving infrastructure must handle peak. (4) Forgetting data costs: Storage. Processing. Labeling. (5) Not including failure modes: Retry costs. Fallback costs. (6) Ignoring latency cost: Higher performance GPU = higher cost. Don't over-provision. Rule of thumb: API vs own model break-even: Often around 1-5M requests/day depending on model size and task. Below that: API usually cheaper when you include engineering. Above that: Own model may win.

---

## Key Takeaways

- **Default: Buy (API)** — only build when you have a specific strong reason
- **Staged approach**: Prompt engineering → RAG → Fine-tuning → Custom training
- **Five decision dimensions**: Performance, data privacy, cost at scale, differentiation, team capability
- **Fine-tuning ≠ training from scratch** — fine-tuning: hours/days, 100-10K examples; from scratch: months, billions of tokens
- **Open source wins** when: data privacy, high volume, need fine-tuning with proprietary data, on-device
- **Vendor lock-in**: Mitigate with abstraction layers, multi-provider, data portability, regular evaluation
- **Real cost of building**: 3-5x what teams initially estimate when you include ongoing maintenance
- **Break-even**: API often wins up to 1-5M requests/day; own model may win at very high volume

---

*Agli file: `05_AI_Project_Management.md` — AI projects kaise manage karein*
