# Bias in AI — Jab AI Unfair Hoti Hai

> *"AI bias sirf ek technical problem nahi hai — yeh ek social justice issue hai jo technical form mein manifest hota hai. Amazon ne ek hiring tool banaya jo women ko penalize karta tha. Facial recognition jo Black faces ko white faces se worse recognize karti hai. Healthcare AI jo Black patients ko less sick rate karta tha. Yaar, jab AI real decisions le rahi hai real lives ke baare mein — loan, job, medical treatment — tab bias real harm hai. Iss topic ko deep samajhna professional responsibility hai."*

---

## Opening Hook — The Healthcare Algorithm

2019. Researchers studied a widely-used healthcare algorithm.
The algorithm: Used by hospitals to identify high-risk patients for extra care.
Trained on: Historical healthcare spending as proxy for health needs.

Finding: Black patients with the SAME health conditions were consistently given lower risk scores than white patients.
They received less care as a result.

**The algorithm wasn't racist. But the proxy was.**
Historical healthcare spending: Lower for Black patients.
Why? Historical barriers to healthcare access.
The algorithm: Learned to use spending as proxy for need.
But spending encoded historical inequality.
Result: Inequality perpetuated by the algorithm.

This is the real face of AI bias.

---

## What Is AI Bias?

**Definition:**
AI bias refers to systematic errors or unfairness in AI systems that lead to discriminatory or unfair outcomes for certain groups.

**Not random errors:**
Bias is systematic. Same group consistently disadvantaged.
Different from noise (random errors) or bugs (code errors).

**Who is affected:**
Often: Groups that were already disadvantaged.
Race, gender, age, socioeconomic status, disability.
AI bias can perpetuate and amplify existing inequalities.

---

## Sources of Bias

### 1. Training Data Bias

**The most common source.**

**Historical bias:**
Training data reflects historical human decisions.
Historical decisions: Often biased.
AI: Learns those biased patterns.

Example: Amazon's hiring algorithm.
Trained on: 10 years of hiring decisions.
Historical hires: Mostly men (in tech).
Algorithm learned: Men preferred.
Result: Penalized resumes with "women's" indicators (women's college, women's sports).

**Representation bias:**
Certain groups underrepresented in training data.
AI performs worse on underrepresented groups.

Example: Facial recognition.
Training data: Majority white male faces.
Performance: Much worse on darker-skinned faces, women.
MIT study: IBM's facial recognition — 0.3% error on white males, 34.7% error on darker-skinned women.

**Measurement bias:**
Proxy measurement captures something other than what you want.
Healthcare: Spending as proxy for health. (Doesn't capture unmet need.)
Recidivism: Arrest rates as proxy for crime. (Captures policing patterns, not crime.)

### 2. Label Bias

**Training labels themselves are biased.**

**Annotator bias:**
Human annotators: Bring their own biases.
"Is this text offensive?" → Different annotators disagree.
Majority label: May reflect majority culture's view.

**Example:**
Toxic language classifiers: Often labeled by American annotators.
African American Vernacular English (AAVE) phrases: Labeled as "offensive" when they're not in context.
AI: Learns AAVE phrases are more offensive.

### 3. Aggregation Bias

**One model applied to diverse population.**

**Problem:**
Different groups: Different underlying patterns.
One-size-fits-all model: May work for majority, fail for minority.

**Medical example:**
HbA1c (diabetes marker): Different normal ranges for different ethnic groups.
Model trained on average: Systematically wrong for some groups.

### 4. Evaluation Bias

**Measuring performance on biased benchmarks.**

**Problem:**
Benchmark doesn't represent all deployment contexts.
Good on benchmark → deployed broadly → fails in unrepresented contexts.

**Example:**
Speech recognition: Benchmarks with clear, American-accented speech.
Model performs well on benchmark.
Deployed: Struggles with accents, dialects, speech impairments.

### 5. Deployment Bias

**Use case different from intended use.**

Model built for one context → deployed in another.
Risk assessment model built for one population → applied to different population.
Assumptions may not hold in new context.

---

## Types of Bias Outcomes

### Individual Fairness

**Similar individuals should be treated similarly.**

People with similar relevant attributes should receive similar outcomes.
Regardless of irrelevant attributes (race, gender).

**Violation:** Two equally qualified candidates. Different outcomes based on race.

### Group Fairness

**Outcomes equal across demographic groups.**

Multiple formal definitions (which create tension with each other):

**Demographic parity:**
Equal positive outcome rates across groups.
Same % of each group gets loan approved.
Problem: If groups actually have different risk profiles, demographic parity may require approving some bad loans for one group.

**Equal opportunity:**
Equal true positive rates across groups.
Among qualified applicants, same % approved from each group.

**Equalized odds:**
Both equal opportunity AND equal false positive rates.
Both qualified and unqualified applicants treated equally across groups.

**Calibration:**
Predicted probabilities accurate within each group.
"70% probability" means 70% across all groups.

**Key tension:**
Different fairness definitions are mathematically incompatible (COMPAS study, Kleinberg et al.).
Cannot simultaneously satisfy: Demographic parity + Equal opportunity + Calibration.
Must choose which fairness definition matters for your context.

---

## Detecting Bias

**You can't fix what you can't measure.**

**Slice-based evaluation:**
Evaluate model performance on demographic subgroups.
Accuracy for group A vs group B.
False positive rates. False negative rates.

**Fairness metrics:**
Compute formal fairness metrics (demographic parity difference, equal opportunity difference).
Flag: When disparity exceeds threshold.

**Counterfactual testing:**
Change only the sensitive attribute (race, gender).
Does outcome change?
"John Smith's resume" vs "Jamal Smith's resume" (identical except name).
If different outcome → bias detected.

**Tools:**
Fairlearn (Microsoft): Open source fairness assessment.
AI Fairness 360 (IBM): Comprehensive bias detection toolkit.
What-If Tool (Google): Interactive bias exploration.

---

## Mitigating Bias

### Pre-processing (Data Level)

**Fix the data before training.**

**Re-sampling:**
Oversample underrepresented groups.
Undersample overrepresented groups.
Balance representation.

**Re-weighting:**
Give higher weight to underrepresented group samples.
During training: Loss function weighted.

**Data augmentation:**
Synthetic data for underrepresented groups.
Translation: Create variants across groups.

### In-processing (Training Level)

**Modify training to account for fairness.**

**Adversarial training for fairness:**
Train model to be good at task.
Simultaneously: Train to NOT be predictable by protected attribute.
Adversary: "Can I predict race from this model's features?"
Model: Tries to make it hard. Features become less race-correlated.

**Fairness constraints:**
Add fairness constraint to training objective.
Optimize: Performance subject to demographic parity constraint.

### Post-processing (Output Level)

**Adjust model outputs for fairness.**

**Threshold adjustment:**
Different decision thresholds per group.
Lower threshold for group with higher false negative rate.
Goal: Equalize false positive/negative rates.

**Calibration:**
Calibrate probabilities separately for each group.
Ensure 70% confidence means 70% for all groups.

**Limitation:** Post-processing can only go so far. Root cause is in data/training.

---

## Fairness in LLMs

**LLMs have unique bias challenges.**

**Stereotype perpetuation:**
LLMs trained on internet text.
Internet text: Contains human biases.
LLMs: Can perpetuate and amplify stereotypes.

"A doctor and a nurse walked in. [pronoun] explained the diagnosis to [pronoun]."
If LLM uses "she" for nurse more than doctor: Perpetuating gender stereotypes.

**Toxic language generation:**
LLMs can generate toxic content toward certain groups.
Even without explicit prompt.

**Cultural bias:**
LLMs reflect training data culture.
Predominantly English/Western → can be biased against other cultures.
Non-English languages: Often perform worse.

**Mitigation for LLMs:**
RLHF: Human raters can flag biased outputs.
Constitutional AI: Principles include fairness.
Red-teaming: Test specifically for bias.
Post-hoc filtering: Classifier for harmful/biased content.

---

## Anthropic Insider Angle

Bias in AI is something we take extremely seriously at Anthropic. It's not just an ethical obligation — it affects Claude's usefulness across the full diversity of users.

**Claude's bias mitigation:** Constitutional AI includes explicit principles about fairness and equal treatment. Among the principles: Treat different groups consistently. Don't make negative assumptions about people based on demographic characteristics. Apply the same standards regardless of who is asking. These are actively evaluated.

**The evaluation challenge:** One of the hardest parts of bias mitigation for LLMs is evaluation. Measuring whether Claude is biased in its responses is complex. We use: (1) Counterfactual testing — asking the same question with different group identities, comparing responses. (2) Red-teaming by diverse teams — people from different backgrounds identifying bias their community would notice. (3) Benchmark suites — BBQ (Bias Benchmark for QA), Winogender, etc. But these don't capture all forms of bias.

**The representation problem in training data:** Internet text is not representative of humanity. It overrepresents certain languages, cultures, economic levels. This creates inherent representation bias. No amount of RLHF fully fixes this — the underlying knowledge distribution reflects who creates internet content. We try to mitigate but can't eliminate this.

**Bias vs accuracy tension:** Sometimes there's tension between reducing bias and maintaining accuracy. If a predictive model is more accurate for majority group because more training data is available, and you add fairness constraints to equalize performance, overall accuracy may drop. This is a real tradeoff. No easy answer. Must decide: What matters more in this deployment context?

---

## Common Misconceptions

**Misconception 1: "AI is objective because it's mathematical"**
Algorithmic decisions appear objective. But: Training data reflects human biases. Design choices reflect human values. The objectivity is an illusion. Often worse: Bias appears objective because it's algorithmic.

**Misconception 2: "Removing sensitive attributes prevents bias"**
Removing race from a model doesn't remove race from other correlated features (zip code, school name). The model may still discriminate via proxies. Must address structural causes.

**Misconception 3: "Bias can be fully fixed with better algorithms"**
Algorithmic fixes help but can't fix structural inequalities in training data or deployment context. Technical solutions must be combined with: Diverse teams, stakeholder involvement, ongoing evaluation.

**Misconception 4: "Fairness is a single, well-defined concept"**
Multiple mathematical fairness definitions exist. They're often mutually incompatible. Which one matters depends on context and values. No single "correct" fairness — it's a social/ethical question.

---

## Interview Questions

**Q1: AI bias ke main sources kya hain? Real-world examples ke saath explain karo.**

**Answer:** Main sources: (1) Historical bias: Training data reflects past discrimination. Amazon hiring tool: Trained on historical (mostly male) hires → learned to prefer men. Healthcare algorithm: Used spending as health proxy → perpetuated unequal access. (2) Representation bias: Underrepresented groups in training data. Facial recognition: Mostly white male training data → 34.7% error on darker-skinned women vs 0.3% on white men (MIT study). (3) Label bias: Annotator biases in training labels. Toxic language classifiers: AAVE phrases labeled offensive by majority-culture annotators → AI learned to flag Black vernacular as more "toxic." (4) Measurement bias: Proxy metric doesn't measure what you actually want. Healthcare: Spending ≠ Need (historical inequity in access). Recidivism: Arrest rate ≠ Crime rate (reflects policing patterns). (5) Aggregation bias: One model for diverse populations. HbA1c (diabetes): Normal ranges differ by ethnicity. Single model: Systematically wrong for some groups.

**Q2: Fairness definitions kya hain? Kyun mathematically incompatible hain?**

**Answer:** Key definitions: (1) Demographic parity: Equal outcome rates across groups. Same % loan approved for each racial group. (2) Equal opportunity: Equal true positive rates. Among actually qualified: Same % approved across groups. (3) Equalized odds: Both equal TP and FP rates across groups. (4) Calibration: Predicted probabilities accurate within each group. Why incompatible (Kleinberg et al.): If base rates differ between groups (different % actually qualified), you CANNOT simultaneously satisfy demographic parity + calibration + equal opportunity. Prove: Suppose Group A: 30% actually qualified. Group B: 60% actually qualified. Demographic parity: Equal approval rates (say 45% both). But calibrated model: Would approve 30% of A and 60% of B (following actual rates). Can't do both. Practical implication: Must choose which fairness metric fits your context. Loan decisions: Calibration often prioritized (actuarial fairness). Criminal justice: Equal opportunity often prioritized. No single "correct" choice — it's a values question: What kind of unfairness is worse in this context?

**Q3: Bias detection kaise karein? Kaunse tools available hain?**

**Answer:** Detection approaches: (1) Sliced evaluation: Compute performance metrics separately per demographic group. Accuracy, precision, recall, F1 per group. Flag: When gap between groups exceeds threshold. (2) Counterfactual testing: Change ONLY sensitive attribute. Everything else identical. Does prediction change? "John's resume" vs "Jamal's resume" (identical except name). If different outcome: Racial bias detected. (3) Fairness metrics: Compute formal metrics: Demographic parity difference = positive rate group A - positive rate group B. Equal opportunity difference = TPR group A - TPR group B. Flag when exceeds threshold. (4) Intersectional analysis: Not just race OR gender — race AND gender combined. Bias may be concentrated at intersection. Tools: Fairlearn (Microsoft): Open source. Fairness metrics, mitigation algorithms. Well documented. AI Fairness 360 (IBM): 70+ fairness metrics, 10+ mitigation algorithms. Comprehensive. What-If Tool (Google): Visual, interactive exploration. Great for exploration. Aequitas (CMU): Specifically for criminal justice / risk assessments. Practical approach: Start with sliced evaluation. Add counterfactual testing for high-stakes decisions. Compute formal metrics after defining what fairness means for your context.

**Q4: Pre-processing, in-processing, post-processing bias mitigation mein kya difference hai?**

**Answer:** Three levels of mitigation: Pre-processing (data level): Fix data before training. When to use: When you have control over training data. Techniques: Re-sampling (oversample minority, undersample majority). Re-weighting (higher weight to minority samples). Counterfactual augmentation (generate diverse synthetic examples). Pros: Fundamental fix. Addresses root cause. Cons: Can lose information. May not fully solve problem if bias structural. In-processing (training level): Modify training objective or process. When to use: When you control training process. Techniques: Adversarial debiasing (simultaneously train fairness adversary). Fairness constraints in objective. Regularization for group fairness. Pros: Model structure itself less biased. Cons: More complex training. May hurt accuracy. Post-processing (output level): Adjust model outputs after training. When to use: No control over model, just outputs. Techniques: Different thresholds per group. Calibration per group. Pros: Simple. No retraining. Cons: Surface fix. Doesn't address root cause. Best practice: Combine all three. Pre-processing helps most but can't fix everything alone. In-processing: Build fairness into model structure. Post-processing: Fine-tune for specific deployment.

**Q5: LLMs mein bias kaise manifest hota hai? Kaise mitigate karein?**

**Answer:** LLM bias manifestations: (1) Stereotype perpetuation: "A nurse asked the doctor [her/his] opinion" → More likely to use "his" for doctor, "her" for nurse. Perpetuates gender stereotypes in professional roles. (2) Differential performance: Lower accuracy on questions about non-Western cultures. Worse performance in non-English languages. Reflects training data distribution. (3) Toxic content toward specific groups: Prompted or unprompted generation of harmful stereotypes. (4) Representation bias: Historical figures from certain cultures less known. "Who are famous scientists?" → Skewed toward Western/European. Mitigation: (1) RLHF with diverse raters: Raters from different backgrounds flag biased outputs. Diverse team = more biases caught. (2) Constitutional AI principles: "Treat all groups consistently." "Avoid stereotypes." Applied during training. (3) Red-teaming: Dedicated testing for bias with diverse testers. Test specifically: Counterfactual prompts. Stereotype completions. Cultural knowledge questions. (4) Evaluation benchmarks: BBQ (Bias Benchmark for QA). WinoGender. CrowS-Pairs. Track metrics across model versions. (5) Post-hoc filtering: Classifier for harmful/biased content. Filter at serving time.

**Q6: High-stakes AI systems mein bias audit kaise karein?**

**Answer:** Bias audit process for high-stakes systems: Define: What's the decision? What are protected characteristics? What harm does bias cause? Step 1 — Data audit: Where did training data come from? Is it representative? Check: Representation by demographic group. Historical labeling for discriminatory patterns. Proxy variables that correlate with protected attributes. Step 2 — Model audit: Compute sliced performance metrics per group. Counterfactual testing: Same input, different demographic → different output? Formal fairness metrics: Choose relevant definitions for your use case. Disparate impact analysis: Positive outcome rates by group. Step 3 — Deployment audit: Who makes decisions using this system? How are they trained to understand its limitations? What's the appeals process when someone believes they were treated unfairly? Step 4 — Documentation: Model card: Document training data, performance across groups, known limitations, intended use. Should be public for high-stakes systems. Step 5 — Ongoing monitoring: Bias metrics in production monitoring. Demographic analysis of decisions made. Feedback mechanism for affected individuals. Regular re-audit (annually or when model updated). For hiring, lending, criminal justice, medical: These audits should be required, not optional.

---

## Key Takeaways

- **AI bias** = systematic errors causing unfair outcomes for certain groups; not random, systematic
- **Sources** = historical bias, representation bias, label bias, measurement bias, aggregation bias
- **Fairness definitions** = demographic parity, equal opportunity, equalized odds, calibration — mutually incompatible
- **Detection** = sliced evaluation, counterfactual testing, formal metrics, tools (Fairlearn, AI360)
- **Mitigation levels** = pre-processing (data), in-processing (training), post-processing (output)
- **LLM bias** = stereotype perpetuation, differential performance, cultural bias
- **Claude mitigation** = Constitutional AI principles, diverse RLHF raters, red-teaming, evaluation benchmarks
- **High-stakes systems** = require formal bias audit; model cards; ongoing monitoring; appeals process

---

*Agli file: `03_Hallucination_Theory.md` — AI jhooth kyun bolta hai aur kaise rokein*
