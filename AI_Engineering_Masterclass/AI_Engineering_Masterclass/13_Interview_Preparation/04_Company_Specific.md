# Company-Specific Preparation — Har Company Ko Target Karo

> *"Generic preparation = generic results. Agar tum Anthropic mein apply kar rahe ho, wahan safety aur alignment ke baare mein baat karo. Google mein? Scale aur infrastructure. Startup mein? Agility aur product sense. Har company ka culture alag hai, focus alag hai, interview style alag hai. Jo engineer sab jagah same answers deta hai — woh kam pehle reject hota hai. Research karo. Customize karo."*

---

## Why Company-Specific Preparation Matters

**Interviewers at every company secretly want:**
"Does this person actually understand what we do?"
"Would they fit with how we work?"
"Do they care about the specific problems we're solving?"

**Generic candidate:** "I want to work at a top AI company."
**Well-prepared candidate:** "I want to work at Anthropic specifically because I've been following your Constitutional AI research, and the problem of scalable oversight for frontier AI is exactly what I want to work on."

Second candidate: Gets more genuine conversation. Makes stronger impression.

---

## Anthropic

**Who they are:**
Founded 2021 by ex-OpenAI researchers (Dario Amodei, Daniela Amodei, others).
Mission: "AI safety company building AI systems that are safe, beneficial, and understandable."
Key product: Claude.
Core research: Alignment, interpretability, Constitutional AI.
Culture: Research-focused. Intellectual rigor. Mission-driven.

**What Anthropic looks for:**
Deep technical understanding: Not just using tools. Understanding why.
Safety awareness: Understanding why alignment matters. Not just performance metrics.
Intellectual honesty: Acknowledge what you don't know. Anthropic values epistemic humility.
Research mindset: Even for engineering roles. Curious, experimental, rigorous.

**Topics to know well for Anthropic:**
Constitutional AI: How it works, why it's better than pure RLHF, its limitations.
Mechanistic interpretability: What it is, why it matters, Anthropic's specific contributions (SAEs, circuits, features).
RLHF limitations: Reward hacking, sycophancy, specification gaming.
Alignment problem: Outer/inner alignment, corrigibility, instrumental convergence.
Claude's design principles: Safety guidelines, principal hierarchy (Anthropic > operator > user).
Responsible Scaling Policy (RSP): What it is, why it matters.

**Sample Anthropic interview questions:**
"Why does Constitutional AI scale better than pure RLHF?"
"What is the superposition hypothesis and why does it make interpretability hard?"
"How would you design an evaluation for whether a model is sycophantic?"
"What does it mean for a model to be calibrated? How would you measure it?"
"How does Claude balance operator instructions vs. user instructions when they conflict?"

**What to research:**
Read: All Anthropic research papers (Constitutional AI, Toy Models of Superposition, Scaling Monosemanticity).
Read: Anthropic's model cards and safety documentation.
Use: Claude for at least 2 weeks before interview. Know it well.
Understand: Anthropic's mission and why it differs from other labs.

**What to say about "why Anthropic":**
Specific research you follow.
Why safety matters to you personally.
What specifically about Claude's design you find interesting.

---

## OpenAI

**Who they are:**
Founded 2015. "Research lab" origin. Now product company.
Core products: ChatGPT (consumer), GPT API, Sora, Operator.
Microsoft partnership: $13B+ investment.
Culture: Fast-moving. Product-focused more than pure research.

**What OpenAI looks for:**
Scaling expertise: OpenAI is about scaling. Know scaling laws deeply.
Product sense: Products matter here. How does this affect users?
Execution speed: Fast iteration.
LLM systems experience: APIs, fine-tuning, evaluation at scale.

**Topics to know:**
Scaling laws: Chinchilla paper. How compute, data, model size relate.
GPT architecture evolution: GPT → GPT-2 → GPT-3 → GPT-4 → o1. What changed at each step.
InstructGPT: The RLHF paper that defined the field.
Fine-tuning: OpenAI's fine-tuning API. Best practices.
Safety team dynamics: OpenAI has had internal debate about safety vs. speed. Know the context.
Codex/GitHub Copilot: Coding AI story at OpenAI.

**Sample OpenAI questions:**
"How do scaling laws help predict model capabilities before training?"
"What is the difference between GPT-3.5 and GPT-4 in terms of architecture and training?"
"Design a system to evaluate LLM quality at scale."
"How would you approach fine-tuning for a specific domain?"

---

## Google DeepMind

**Who they are:**
Merged 2023: Google Brain + DeepMind.
Massive research output: AlphaFold, AlphaGo, AlphaStar, Gemini.
Culture: Academic research. Papers. Rigor.
Products: Gemini (frontier model), Google products (Search, Workspace, etc.).

**What Google DeepMind looks for:**
Research depth: Probably the most research-focused of the large labs.
Papers: Have you read important papers? Can you discuss them?
Math background: Strong ML theory expected.
Scale: Google has unique compute scale. Think big.
Product integration: How does AI work at Google's scale (billions of users)?

**Topics to know:**
AlphaFold: Structure prediction. What it demonstrates about AI for science.
Gemini architecture: What makes it different. Multimodal from the start.
TPU architecture: Google's custom AI hardware. How it differs from GPU.
Reinforcement learning: DeepMind's heritage. RL fundamentals important.
Mixture of Experts (MoE): Used in Gemini. How it works.
PaLM, Gemini: Google's LLM evolution.

**What DeepMind specifically values:**
Safety research: DeepMind has significant safety team.
Responsible AI: Google's principles, EU AI Act compliance.
International research culture: Diverse team. Global scale.

---

## Meta AI

**Who they are:**
Research org: FAIR (Fundamental AI Research).
Products: AI features in Facebook, Instagram, WhatsApp, Quest.
Open source: LLaMA strategy. Most open approach of major labs.
Culture: Move fast. Ship to billions of users.

**What Meta looks for:**
Open source enthusiasm: They open-source a lot. Appreciate those who contribute to ecosystem.
Scale: Facebook/Instagram/WhatsApp = billions of users. Think at that scale.
Research + product integration: FAIR publishes, product teams deploy.
Content moderation: Meta has huge investments in content safety.

**Topics to know:**
LLaMA models: Why Meta open-sources. Business strategy.
PyTorch: Meta created. Know it well (vs. TensorFlow/JAX).
Recommendation systems: Meta's AI heritage. Ads ranking, feed ranking.
Content moderation at scale: Real-time. Multilingual. Massive volume.
Multimodal: Meta heavily invested (AudioCraft, ImageBind, etc.).
AR/VR AI: Quest 3, Ray-Ban glasses. Embodied AI.

---

## Microsoft (Azure AI / Copilot)

**Who they are:**
Not a model lab. An AI deployer.
Products: Azure OpenAI, Copilot in Office 365, GitHub Copilot, Bing AI.
Partnership: Deep OpenAI integration.
Culture: Enterprise-focused. Responsible AI strongly emphasized.

**What Microsoft looks for:**
Enterprise product thinking: How does AI work for enterprise customers?
Responsible AI: Microsoft's published principles. Know them.
Integration: How does AI fit into existing Microsoft ecosystem?
Scale: Azure scale. Global enterprise.

**Topics to know:**
Azure OpenAI Service: How it works, enterprise features.
Microsoft Copilot products: GitHub Copilot, M365 Copilot. Architecture.
Responsible AI principles: Microsoft has 6 principles. Know them.
Power Platform AI: Low-code AI for non-developers.
Large enterprise deployment patterns.

---

## Startup AI Companies

**Types of AI startups:**

**Model-based startups (API businesses):**
Cohere: Enterprise NLP API. Focus: Enterprise customers.
Mistral: European frontier open source.
AI21 Labs: Language models for enterprise.

**Application layer startups:**
Cursor: AI coding. Harvey: Legal AI. Glean: Enterprise search.

**Infrastructure startups:**
Weights & Biases: Experiment tracking. Scale AI: Data labeling. Modal: Serverless ML.

**What startups look for (generally):**
Ownership: Can you own entire features end-to-end?
Breadth: ML + engineering + product thinking.
Speed: Ship fast. Iterate. Don't over-engineer.
Business sense: Understand why this feature matters for revenue.
No ego: Startups need people who do what needs doing.

**Startup-specific preparation:**
Use their product extensively before the interview.
Read their engineering blog.
Understand their business model.
Have concrete opinions about their product.
Think about: What would you work on there? What problems excite you?

---

## Research Labs vs. Product Companies

**Research lab (Anthropic research team, DeepMind, Meta FAIR):**
What matters: Papers. Ideas. Technical depth. Publication track record.
Interview style: Often: Research seminar. Present your work. Deep technical discussion.
What to prepare: Know your research deeply. Be prepared to defend design choices.
Typical profiles: PhD or very strong self-taught with visible work.

**Product-focused AI companies (most roles at OpenAI, Meta products, Microsoft):**
What matters: Execution. Product impact. Scale. Reliability.
Interview style: System design. Coding. Behavioral. Product sense.
What to prepare: Production experience. Scale. User impact.
Typical profiles: Strong software engineers who know ML.

**Which path:**
Research: If you love research, have ideas, want to publish.
Product: If you want to ship products users use, iterate fast.
Neither is better. Both need excellent people. Choose based on what excites you more.

---

## General Interview Preparation Checklist

**4 weeks before:**
Read the company's research papers (especially recent ones).
Use their product extensively.
Study their publicly available safety/responsible AI content.
Read their engineering blog.
Research recent news about them (funding, products, team changes).

**2 weeks before:**
Review foundational concepts relevant to their focus.
Practice answering "why this company" with specific examples.
Prepare 2-3 questions to ask them.
Study common interview question types for AI roles.

**1 week before:**
Mock interviews with time pressure.
Write out answers to common behavioral questions.
Review your own projects — be ready to discuss in depth.

**Day of:**
Good sleep. This matters.
Review company one-pager: Their mission, key products, key people.

---

## Questions to Ask Your Interviewer

**Good questions show: You're serious. You've done research. You're thinking about the role.**

For research roles:
"What are the most interesting open research problems your team is working on?"
"How does research translate to production here?"
"What does a typical week look like for a researcher on this team?"

For engineering roles:
"What does the AI/ML infrastructure stack look like here?"
"What are the biggest technical challenges the team is facing?"
"How do you balance shipping products with maintaining model quality?"
"What does success look like in the first 6 months?"

For Anthropic specifically:
"How does safety research inform what features go into Claude?"
"What interpretability findings have most changed how you think about model behavior?"
"How do you think about the alignment tax in practice?"

For startups:
"What's the biggest technical challenge you expect the company to face in the next year?"
"How does the team balance research/exploration vs. shipping to customers?"
"What would make the next hire on this team the most impactful?"

---

## Interview Questions (About Your Preparation)

**Q1: "Why do you want to work at Anthropic specifically?"**

**Answer (template):**
Be specific. Not: "I want to work on AI safety."
Do: "I've been following Anthropic's interpretability research, particularly the sparse autoencoder work on Claude Sonnet's internal features. The approach of understanding model internals as a path to verifiable alignment is genuinely exciting to me. I think interpretability is where a lot of important work needs to happen, and Anthropic is at the frontier of it. I also care deeply about the Constitutional AI approach — using model self-critique against written principles seems like a more principled and scalable alignment approach than pure RLHF. I want to be working on these problems."

Structure: What specific thing you know about → Why that specific thing matters to you → Why Anthropic is the right place for that.

**Q2: "What do you know about our recent work?"**

**Answer approach:**
Read papers in the past 3 months.
If it's Anthropic: "I read the recent paper on long-context RAG evaluation and found the finding about lost-in-the-middle interesting — that models focus on start and end of context. I've thought about how this would affect RAG system design..."
If it's Google: "I followed the Gemini 1.5 release closely. The 1M context window is remarkable — I was curious about how they handle attention complexity at that scale with MoE..."
The point: Show you're actually following their work. Not just that you know they exist.

**Q3: "What would you work on in your first 6 months here?"**

**Answer approach:**
Research the team's current priorities (blog posts, papers, job postings give hints).
"Based on what I understand about [team], the highest-leverage things might be: [X and Y]. I'd want to start by understanding the existing systems deeply — I think the first 1-2 months should be learning, shipping small improvements, and building context. By month 3-4, I'd want to be proposing and leading a larger project. What are the priorities you'd suggest for someone starting in this role?"

---

## Key Takeaways

- **Company research matters**: Specific knowledge > generic enthusiasm; shows you actually care
- **Anthropic**: Safety + interpretability + Constitutional AI; know their specific research papers
- **OpenAI**: Scaling + product + InstructGPT; fast iteration culture
- **Google DeepMind**: Research rigor + scale + math; know their landmark papers
- **Meta AI**: Open source + LLaMA + products at billion-user scale; PyTorch expertise
- **Microsoft**: Enterprise + Responsible AI + Azure + integration with existing products
- **Research vs. product**: Choose based on what genuinely excites you, not prestige
- **Questions to ask**: Shows seriousness; research-specific questions make strong impression
- **"Why this company"**: Must be specific — what exact work they do that you want to be part of

---

*Agli file: `05_Self_Introduction.md` — Apna introduction professionally present karo*
