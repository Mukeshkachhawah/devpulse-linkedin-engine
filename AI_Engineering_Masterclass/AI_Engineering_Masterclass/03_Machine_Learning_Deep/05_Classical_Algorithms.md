# Classical Algorithms — Linear Regression Se SVM Tak

> *"Deep learning engineers jo classical algorithms nahi jaante, unhe ek problem hoti hai: Jab deep learning fail karta hai — aur woh fail hoga — unke paas koi alternative nahi hota. Classical algorithms wo first-aid kit hain jo har engineer ke paas hona chahiye."*

---

## Opening Hook — Ek $2 Million Decision

2018. A major bank. They need to predict loan default risk.

Data scientist team: "Use deep neural network!"
Another engineer: "Let me try logistic regression first."

Results: Neural network — 87.3% accuracy. Logistic regression — 86.8% accuracy.

0.5% accuracy difference. But:
- Logistic regression: Explainable. Regulators can audit. Each factor's weight clear.
- Neural network: Black box. Cannot explain why loan rejected. Violates fair lending laws.

They went with logistic regression. **$2 million compliance issue avoided.**

Lesson: Best algorithm depends on context, not just accuracy.

---

## Why Learn Classical Algorithms?

1. **Still state of art for tabular data:** XGBoost (gradient boosted trees) wins most tabular data Kaggle competitions over deep learning.

2. **Interpretability requirements:** Healthcare, finance, legal — often require explainable models.

3. **Limited data:** Complex models need lots of data. With 100 examples, linear model often beats neural network.

4. **Fast iteration:** Train in seconds, not hours. Rapid prototyping.

5. **Foundation understanding:** Deep learning "extends" classical ideas — understanding the foundation helps understand deep learning.

---

## Linear Regression — The Foundation

### Core Concept

Goal: Predict continuous output from input features.

Model: ŷ = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ

Parameters (weights w) are learned from data to minimize prediction error.

**Loss function:** Mean Squared Error (MSE)
MSE = (1/n) × Σ(yᵢ - ŷᵢ)²

Minimize MSE → find weights that make predictions closest to actual values.

### Closed Form Solution

Linear regression has exact solution (unlike neural networks that need iterative gradient descent):

w* = (XᵀX)⁻¹Xᵀy

This matrix equation directly gives optimal weights. No iterative training needed.

Only feasible for small feature counts (matrix inversion expensive for large dimensions).

### Geometric Interpretation

Linear regression = fitting a line (2D), plane (3D), or hyperplane (nD) through data.

OLS (Ordinary Least Squares) minimizes vertical distances from data points to this hyperplane.

### Ridge Regression (L2)

Add L2 regularization:
Loss = MSE + λ||w||²

Effect: Shrinks weights toward zero. Prevents overfitting. Handles multicollinearity (correlated features).

### Lasso Regression (L1)

Add L1 regularization:
Loss = MSE + λ|w|

Effect: Drives some weights EXACTLY to zero. Automatic feature selection.

### Elastic Net

Combine L1 + L2. Good of both worlds.

---

## Logistic Regression — For Classification

Misleading name: "Regression" but used for CLASSIFICATION.

**Core idea:** Apply sigmoid to linear combination of features.

P(y=1|x) = σ(w₀ + w₁x₁ + ... + wₙxₙ)
σ(z) = 1/(1+e⁻ᶻ)

Sigmoid squashes output to [0,1] — interpretable as probability.

**Decision boundary:** P(y=1|x) > 0.5 → class 1

**Loss function:** Binary cross-entropy (negative log-likelihood)
Loss = -[y×log(ŷ) + (1-y)×log(1-ŷ)]

### Why It's Still Used in 2024

1. **Interpretability:** Each feature's weight = log-odds ratio. Clear meaning.
2. **Calibration:** Outputs are well-calibrated probabilities.
3. **Regularization:** L1/L2 work well. L1 for feature selection.
4. **Speed:** Trains in milliseconds.
5. **Industry standard for baselines:** Always start here before complex models.

### Extensions

**Multinomial logistic regression:** Multi-class classification.
Softmax instead of sigmoid.

This IS the final layer of most neural networks for classification!

Neural network = many layers of transformations + logistic regression at the end.

---

## Decision Trees — Explainable Splitting

### How Decision Trees Work

Build a tree where:
- Each node = decision based on a feature
- Each branch = outcome of decision
- Each leaf = final prediction

**Building process (CART algorithm):**
At each node, find the feature + threshold that best splits data:
- For classification: Minimize Gini impurity or entropy
- For regression: Minimize MSE

Recurse until stopping criterion (max depth, min samples per leaf, etc.)

### Intuition

Decision tree = sequence of "if-else" questions about features.

Example for credit approval:
- Is income > $50k?
  - Yes: Is credit score > 700? → Yes: Approve. No: Review.
  - No: Reject.

This is explainable. Anyone can trace the path to understand a decision.

### Gini Impurity

Gini(T) = 1 - Σ pᵢ²

Where pᵢ = proportion of class i at node T.

Perfect purity (all same class): Gini = 0
Maximum impurity (equal split): Gini = 0.5 (for binary)

Find split that maximizes information gain (reduction in Gini).

### Limitations

- **Overfitting:** Trees can grow very deep and memorize training data.
- **Instability:** Small data changes → very different trees (high variance).
- **Piecewise constant:** Decision tree predictions are step-functions, not smooth.

Solution: Ensemble methods! (Random Forest, Gradient Boosting)

---

## Support Vector Machines (SVMs) — The Theoretical Elegance

### Core Concept

Find the hyperplane that MAXIMALLY SEPARATES two classes.

Not just any separating hyperplane — the one with maximum margin.

**Margin:** Distance from hyperplane to nearest data point on each side.

Maximum margin = most "confident" separation = best generalization.

### Support Vectors

The data points closest to the decision boundary (defining the margin) are "support vectors."

Interesting property: Only support vectors matter. If you remove all other data points, the SVM remains exactly the same. This makes SVMs somewhat robust to outliers away from the boundary.

### Soft Margin SVM

Real data is never perfectly separable. "Soft margin" allows some misclassifications:

Minimize: ||w||²/2 + C × Σ slack variables

C controls tradeoff:
- Small C: Wider margin, more misclassifications allowed (high bias, low variance)
- Large C: Narrow margin, fewer misclassifications (low bias, high variance)

### Kernel Trick

Data not linearly separable in original space?

Kernel function maps data to higher-dimensional space where it IS separable:

k(x, x') = φ(x)·φ(x') — dot product in high-dimensional space, WITHOUT computing φ explicitly.

Common kernels:
- RBF (Radial Basis Function): k(x, x') = exp(-γ||x-x'||²)
  Maps to infinite-dimensional space. Most commonly used.
- Polynomial: k(x, x') = (x·x' + r)^d
- Sigmoid: k(x, x') = tanh(αx·x' + c)

### Why SVMs Important to Understand

SVMs have strong theoretical foundations (VC theory, margin theory). Many generalization guarantees were first proven for SVMs.

Understanding SVMs helps understand:
- Why margins matter (appear in neural network analysis)
- Why kernel methods work (connect to neural networks via NTKK theory)
- Theoretical basis for regularization

In practice: SVMs still used for:
- Small-medium datasets (< 100K samples)
- High-dimensional sparse features (text)
- When theoretical guarantees needed

---

## k-Nearest Neighbors (k-NN) — The Simplest Classifier

### Concept

No explicit training. Just store all training examples.

For a new point: Find k most similar training examples. Majority vote (classification) or average (regression).

**Distance:** Usually Euclidean. For text: Cosine similarity.

### Characteristics

**Pros:**
- No training (just store data)
- Handles multi-class naturally
- Non-parametric (no assumptions about data distribution)
- Naturally captures local structure

**Cons:**
- Slow at inference — O(n×d) per prediction (compare to all training points)
- Sensitive to irrelevant features (they affect distance)
- Needs feature normalization
- Memory — stores all training data

### KD-Trees and Ball-Trees

Approximate nearest neighbor search structures that make k-NN practical for larger datasets.

These ideas connect to **vector databases for RAG** — which are essentially "approximate nearest neighbor" search at scale for high-dimensional embeddings!

k-NN at its core = semantic search in embedding space.

---

## Naive Bayes — Probabilistic Simplicity

### Core Idea

Apply Bayes' theorem with "naive" assumption: All features are conditionally independent given class.

P(class|features) ∝ P(class) × ΠP(feature_i | class)

### Why "Naive"?

Conditional independence assumption is almost never true. "spam" and "buy" as features for spam detection are correlated.

Yet Naive Bayes works surprisingly well, especially for:
- Text classification
- Sentiment analysis
- Spam filtering

### Why It Works Despite Wrong Assumption

You only need the RANKING of class probabilities to be correct, not exact values. Even with wrong assumption, relative rankings often preserved.

Speed: Training = just counting frequencies. Extremely fast.

---

## Comparing Algorithms — Decision Guide

| Algorithm | Best For | Pros | Cons |
|-----------|----------|------|------|
| Linear Regression | Regression, continuous prediction | Interpretable, fast | Linear relationships only |
| Logistic Regression | Binary/multi classification | Interpretable, calibrated | Linear decision boundary |
| Decision Tree | Categorical features, explainability | Highly interpretable | Overfits easily |
| Random Forest | General purpose | Robust, handles non-linearity | Less interpretable |
| Gradient Boosting | Tabular data, competitions | Often best performance | Slow training, hyperparameters |
| SVM | Small/medium datasets, high-dimensional | Strong theory, effective | Slow for large data, kernel choice |
| k-NN | Simple, local structure | No training, intuitive | Slow inference, memory |
| Naive Bayes | Text, fast baseline | Very fast, few parameters | Independence assumption |

---

## The Algorithm Selection Framework

When choosing an algorithm:

1. **What type of problem?** Classification, regression, clustering, anomaly detection?

2. **How much data?** <1K → simple algorithms. 1K-100K → classical ML. >1M → consider deep learning or scalable methods.

3. **Interpretability required?** Regulated domain → linear models, decision trees. Business insights needed → tree importance.

4. **Features type?** Tabular → gradient boosting. Images → CNNs. Text → Transformers. Sequences → LSTMs/Transformers.

5. **Baseline first:** ALWAYS start with simplest algorithm (logistic regression for classification). Beat baseline before complexifying.

---

## Anthropic Insider Angle

Classical algorithms at Anthropic context:

When we built evaluation pipelines for Claude, we extensively used classical ML for analyzing results.

Specifically: Logistic regression to identify which "features" of prompts (question type, length, topic domain) correlated with different failure modes. This interpretability was crucial for understanding systematic biases.

k-NN in context of interpretability: Concept activation vectors (CAVs) in neural networks work like k-NN in latent space. "What training examples are most similar to this input in internal representation space?" — this helps explain why model produces certain outputs.

An important observation: Anthropic's evaluation teams use "behavioral" analyses that are essentially classical ML classification: "Given a model response (text features, length, sentiment), predict if human raters will flag it as harmful." This is logistic regression over engineered features from model outputs.

The message: Classical algorithms aren't replaced by deep learning in a complete stack — they're complementary tools used at different stages.

---

## Interview Questions

**Q1: Logistic regression kaise kaam karta hai? Neural network se kaise different hai?**

**Answer:** Logistic regression: Linear combination of features → sigmoid function → probability [0,1]. Decision: Probability > threshold → class 1. Training: Minimize binary cross-entropy loss via gradient descent. Learns single hyperplane decision boundary. Neural network: Multiple layers of linear transformations + non-linear activations → complex non-linear decision boundaries. More parameters, more flexible. Key difference: Logistic regression = one linear transformation. Neural network = multiple non-linear transformations. Logistic regression = special case of neural network with zero hidden layers. Practical: For well-separated, linearly-separable data: Logistic regression often matches or beats neural network. For complex non-linear patterns with lots of data: Neural network wins. For interpretability, speed, calibration: Logistic regression preferred.

**Q2: Decision tree mein "Gini impurity" aur "Information gain" kya hain?**

**Answer:** Gini impurity at a node: 1 - Σpᵢ² (sum of squared class probabilities). Range: 0 (all same class = pure) to 0.5 (equal split binary). Information gain (for classification): Reduction in entropy when splitting on a feature. Entropy H = -Σpᵢlog(pᵢ). Information gain = H(parent) - weighted average H(children). How used: At each node, try ALL possible (feature, threshold) splits. Choose split that maximally reduces Gini/maximally increases information gain. Practical: Gini and entropy usually give similar splits. Gini faster to compute. Entropy more information-theoretically motivated. CART algorithm uses Gini. ID3/C4.5 use entropy.

**Q3: SVM ka "kernel trick" kya hai?**

**Answer:** Problem: Many real datasets not linearly separable in original feature space. Solution in principle: Map to higher-dimensional space where they ARE separable. Problem with solution: Computing φ(x) in high-dimensional space is expensive or infinite-dimensional. Kernel trick: We never compute φ explicitly. We compute dot product in high-dim space: k(x, x') = φ(x)·φ(x'). This is calculated from original features x, x' without computing φ. RBF kernel: k(x,x') = exp(-γ||x-x'||²). This corresponds to mapping to infinite-dimensional space! Practical effect: SVM with RBF kernel can learn arbitrarily complex decision boundaries (given appropriate γ and C). This is NOT the same as deep learning — kernel methods require all training data at inference time. But mathematically: Neural networks with certain activations relate to kernel methods via Neural Tangent Kernel theory.

**Q4: k-NN kaise kaam karta hai? Kab use karna chahiye?**

**Answer:** k-NN: Store all training data. For new input: Find k nearest training examples by distance. Classify by majority vote (or average for regression). No explicit training — just memory. When to use: (1) Non-parametric baseline — no assumptions about data; (2) Small dataset where distance computation feasible; (3) Variable local structure in data; (4) When neighborhood matters (geographic data, recommendation by similar users); (5) Prototype-based classification (e.g., one-shot learning). When not to use: (1) Large dataset — inference O(n×d), too slow; (2) High-dimensional sparse data — "curse of dimensionality" — distances become uninformative; (3) Need to deploy fast inference model. Modern connection: Approximate k-NN is the core of vector databases used in RAG systems — semantic search is k-NN in embedding space.

**Q5: Linear regression aur logistic regression mein kya fundamental difference hai?**

**Answer:** Linear regression: Predicts continuous output. Output = w₀ + w₁x₁ + ... (unbounded). Loss: MSE (mean squared error). Logistic regression: Predicts probability of binary class. Output = σ(w₀ + w₁x₁ + ...) = [0,1] via sigmoid. Loss: Binary cross-entropy. Key insight: Logistic regression adds sigmoid non-linearity to make output a valid probability. The "log-odds" (log(p/1-p)) IS linear in features — so it's "regression" in that sense. Extension: Multiple linear regression → multiple logistic regression (softmax) → neural networks. Linear/logistic regression = one layer neural network. Every deep learning classification network ends with logistic regression layer.

**Q6: "No Free Lunch" theorem kya hai practical terms mein?**

**Answer:** No algorithm is universally best. Averaged over all possible data distributions: all algorithms perform equally. Why matters: (1) You can't say "neural networks are always better" — on specific problem types, simpler models win; (2) Algorithm choice must be based on domain knowledge about your data structure; (3) Empirical comparison on your specific dataset is necessary; (4) Theoretically justifies trying multiple algorithms. Practical examples: Random Forest ≈ or > XGBoost on low-signal tabular data. Logistic regression ≈ deep learning for simple credit scoring. k-NN > complex models for geographic recommendation in dense areas. Linear SVM > RBF SVM for very high-dimensional text. Takeaway: Benchmark multiple algorithms on your problem. Have toolkit knowledge, not allegiance.

---

## Key Takeaways

- **Linear/Logistic Regression** = interpretable baselines — always start here
- **Decision Trees** = explainable but overfit alone — better in ensembles
- **SVMs** = max margin, kernel trick for non-linear — theoretically elegant
- **k-NN** = simple, non-parametric — basis of vector search in RAG
- **Naive Bayes** = fast probabilistic classifier — still competitive for text
- **Algorithm selection** = depends on data, interpretability, compute constraints
- **Classical algorithms live on** — XGBoost dominates tabular data in 2024
- **Baselines first** — always compare deep learning to classical ML

---

*Agli file: `06_Ensemble_Methods.md` — Multiple models ka power*
