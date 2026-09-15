# Tokenization Theory — Text Ko Numbers Mein Convert Karna

> *"Ek baar mein interviewer se mila jisne GPT-4 pe 5 projects kiye the — lekin jab maine poocha 'tokenizer kya karta hai exactly?' — woh blank ho gaya. Bhai, AI engineering mein yeh basics skip nahi karte. Tokenization samjho bina — LLMs ka foundation hi nahi samjha."*

---

## Opening Hook — Jab Claude Ne Hindi Mein Ghalti Ki

"Namaste" — yeh word Claude ko kitne tokens mein dikhta hai?

English mein "Hello" = 1 token.
Hindi mein "Namaste" = sometimes 2-3 tokens depending on the tokenizer.

Iska matlab? Claude ko Hindi/Sanskrit words process karna relatively zyada expensive hai.
"नमस्ते" (Devanagari) = aur bhi zyada tokens.

Yeh ek practical consequence hai tokenization ki. Aur yeh sirf ek example hai.

**Tokenization = The hidden layer of every language model. Jo tum type karte ho — model directly woh nahi dekha. Pehle tokenizer run hota hai. THEN model starts.**

---

## Tokenization Kya Hai?

**Definition:** Process of converting raw text into a sequence of tokens (discrete units) that the model can process.

**Why needed:** Neural networks work with numbers, not text. Tokens = bridge between text and numbers.

**The question:** How to break text into meaningful pieces?

Options tried historically:
1. Character-level: Each character = one token
2. Word-level: Each word = one token
3. Subword-level: Break words into common subunits (CURRENT STANDARD)

---

## Character-Level Tokenization — Simple But Inefficient

Break "Hello World" into: ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']

**Advantages:**
- Small vocabulary (~128 ASCII or ~Unicode range)
- No OOV (out-of-vocabulary) problem — every character exists
- Works for any language, any text

**Disadvantages:**
- Very long sequences: "Hello" = 5 characters = 5 tokens
- For 1000-character document: 1000 tokens
- Model must learn to compose characters into words, words into phrases — much harder
- Attention complexity = O(N²) — 1000 tokens vs 200 tokens = 25x more expensive

**Where still used:** Genetic sequence modeling, character-level language models for specific tasks, code models occasionally.

---

## Word-Level Tokenization — Intuitive But Broken

Break on whitespace: "I love AI" → ["I", "love", "AI"]

**Advantages:**
- Intuitive — words are natural units of meaning
- Short sequences
- Straightforward

**Disadvantages:**

**1. Huge vocabulary:**
English alone: 100K+ words. With other languages: Millions.
Embedding matrix = vocab_size × d_model = millions × thousands = billions of parameters JUST for embeddings.

**2. OOV Problem:**
New words, proper nouns, technical terms → unknown.
"Zarooratmand" (Hindi word) → not in vocabulary.

**3. Morphological blindness:**
"run", "running", "ran", "runs" = completely separate tokens.
No shared representation despite same root.
Wasted capacity — model must learn these separately.

**4. No handling of rare words:**
"Supercalifragilisticexpialidocious" = rare. Never in training data → OOV.

---

## Subword Tokenization — The Goldilocks Solution

**Key insight:** Break words into MEANINGFUL SUBUNITS.

Common subunits can be shared across words.
Rare words decomposed into common pieces.
Vocabulary stays manageable.

"running" → "run" + "ning"
"unhappiness" → "un" + "happiness" (or "un" + "happi" + "ness")
"Transformers" → "Transform" + "ers"

**This gives:**
- Smaller vocabulary than word-level (~30K-100K vs millions)
- Longer sequences than word-level but shorter than character-level
- No OOV for any reasonable text
- Morphological relationships captured

**Three main algorithms:**

---

## BPE — Byte Pair Encoding

**Algorithm (Sennrich et al., 2016):**

Start with characters. Iteratively merge the most frequent pair.

**Step-by-step example:**

Initial vocabulary: all characters in training data.
Training corpus might contain many instances of "e r" together.

1. Find most frequent adjacent pair: Say ('e', 'r') → merge to 'er'
2. Now 'er' is a token. Find next most frequent: ('in', 'g') → 'ing'
3. Continue N times (N = desired vocabulary size)

**What emerges:**
Common words → single tokens ("the", "of", "and")
Common word parts → tokens ("ing", "tion", "er")
Rare words → decomposed into common pieces
Unknown words → decomposed all the way to characters if needed

**Example with actual token:**
"tokenization" → "token" + "ization" → maybe "token" + "iz" + "ation"

**Used by:** GPT-2, GPT-3, GPT-4, LLaMA. Most OpenAI models.

---

## WordPiece — Google's Variant

**Algorithm (Schuster & Nakamura, 2012, popularized by BERT):**

Similar to BPE but uses a different merge criterion.

Instead of most frequent pair:
Merge the pair that maximizes likelihood of training data if merged.

**The difference:**
BPE: Frequency-based merging
WordPiece: Likelihood-based merging

**Notation:**
Subword pieces (not full words) marked with "##"

"playing" → "play" + "##ing"
"##ing" means "this continues previous token"

**Used by:** BERT, DistilBERT, most Google models.

---

## SentencePiece — Language-Agnostic Approach

**Problem with BPE/WordPiece:**
Requires pre-tokenization on whitespace.
Doesn't work well for languages without clear word boundaries (Japanese, Chinese, Thai).

**SentencePiece (Kudo & Richardson, 2018):**
Treats raw text as input — NO pre-tokenization.
Learns subwords directly from character sequences.

**Byte-level BPE:**
Extend to ALL bytes (0-255).
Works for ANY language, even emojis, rare Unicode.
GPT-2 and later OpenAI models use this.

**Used by:** T5, XLNet, many multilingual models.

---

## Tiktoken — OpenAI's Modern Tokenizer

GPT-3.5, GPT-4, Claude — use cl100k_base or similar tokenizer.

**Vocabulary size:** ~100,276 tokens (cl100k_base).

**Properties:**
- Byte-level BPE base
- Large vocabulary → more common words as single tokens → shorter sequences
- Efficient regex pre-tokenization that splits on spaces, punctuation thoughtfully
- Handles Unicode and special characters well

**Example tokenizations (approximate):**
- "hello" → 1 token
- "Hello World" → 2 tokens
- "Anthropic" → 2-3 tokens ("Anthrop" + "ic")
- "tokenization" → 3-4 tokens
- "的" (Chinese character) → 1 token (common) or 3 bytes (rare)

**Token count tool:** OpenAI's Tokenizer Playground lets you see exact tokenization.

---

## Special Tokens — The Hidden Vocabulary

Beyond regular tokens, tokenizers include special tokens:

**Common special tokens:**

`[BOS]` or `<s>`: Beginning of sequence
`[EOS]` or `</s>`: End of sequence
`[PAD]`: Padding (for batching variable-length sequences)
`[UNK]`: Unknown token (fallback)
`[MASK]`: Used in BERT for masked language modeling
`[SEP]`: Separator between sequences
`[CLS]`: Classification token (BERT)

**Chat models add more:**

`<|system|>`, `<|user|>`, `<|assistant|>`: Role markers
`<|endoftext|>`: End of document
`<|startoftext|>`: Start of document

**These are essential for instruction following:**
When you send a message to Claude, there's a whole structure of special tokens wrapping your message that tells the model: this is a system prompt, this is user input, now generate assistant output.

---

## Vocabulary Size — The Tradeoffs

**Smaller vocabulary (e.g., 30K):**
- Shorter embedding table → fewer parameters
- But: More tokens per sequence → longer context length
- Less efficient for common words/phrases

**Larger vocabulary (e.g., 100K+):**
- Common words → single tokens → shorter sequences
- More efficient attention computation (quadratic!)
- But: Larger embedding table → more parameters

**LLaMA models:** 32K vocabulary (smaller, efficient for research)
**GPT-4 (tiktoken):** ~100K (larger, better efficiency for common text)

**Tradeoff principle:** Larger vocabulary pays upfront (more embedding parameters) but saves at inference time (shorter sequences = less computation).

---

## Fertility — How Many Tokens Per Word?

**Fertility:** Average number of tokens per word for a given text.

English text with good tokenizer: ~1.3 tokens/word
Complex English (technical, rare words): ~1.8 tokens/word
Hindi (Devanagari): ~3-5 tokens/word (underrepresented in training data)
Code: Often >2 tokens/word (many special characters)

**Why this matters:**
Model has limited context window (e.g., 200K tokens for Claude).
If your input language has high fertility: Fewer actual words fit in context.

**For multilingual AI:**
Current English-dominated tokenizers are UNFAIR to other languages.
"Same" text in English vs Hindi → English uses far fewer tokens.
Hindi users pay more (API costs per token) for same semantic content.

Active research: Better multilingual tokenizers.

---

## Tokenization and Model Capabilities

Tokenization affects what models can and can't do:

**Arithmetic problems:**
"1 + 2 = 3" — numbers often tokenized inconsistently.
"100" might be 1 token.
"1000" might be 2 tokens (10 + 00 or 1 + 000).

Models must learn arithmetic despite inconsistent number representations.
This is part of why math is harder for LLMs.

**Spelling tasks:**
"Count letters in 'strawberry'"
Model must reason about characters within tokens.
"strawberry" = possibly "st" + "raw" + "berry"
Character 'r' appears multiple times but is INSIDE different tokens.
Model doesn't directly "see" characters — must infer from token representations.

**Code understanding:**
Whitespace is significant in Python.
Tokenizers that don't handle indentation carefully → model struggles with Python.

---

## How Tokenizers Are Trained

Tokenizer training happens BEFORE model training:

**Step 1:** Collect training text corpus (subset of what model will train on).
**Step 2:** Count all character/byte pairs.
**Step 3:** Iteratively merge most frequent (BPE) or highest likelihood (WordPiece) pairs.
**Step 4:** Repeat until desired vocabulary size reached.
**Step 5:** Freeze tokenizer. It does NOT change during model training.

**Critical:** Model and tokenizer are COUPLED.
Can't use GPT-4's tokenizer with Claude's weights.
Different vocabularies = different token ID → embedding mappings.

---

## Tokenization Challenges

**Challenge 1: Multi-byte characters**
Unicode has 143,859 characters. Most tokenizers handle via byte-level BPE.
Each Unicode character = 1-4 bytes.
A single Chinese character like '语' = 3 bytes → might be 3 tokens.

**Challenge 2: Number handling**
1234567 could be: "1234567" (1 token), "123" + "4567" (2 tokens), "1" + "2" + "3" + "4" + "5" + "6" + "7" (7 tokens)
Inconsistency makes numerical reasoning harder.

**Challenge 3: Language bias**
Tokenizers trained on English-heavy corpora → non-English text fragmented.
Solution: Include more multilingual data in tokenizer training.

**Challenge 4: Code and special characters**
`print(f"Hello {name}")` — brackets, quotes, f-string syntax.
Good code tokenizers treat these specially. GitHub Copilot's tokenizer tuned for code.

---

## Anthropic Insider Angle

Tokenization at Anthropic is more important than most engineers realize.

When we trained Claude models, one key consideration was context length efficiency. A model with 100K token context window isn't equally useful for all languages — for languages with high fertility tokenization, it's effectively a much shorter context window.

**Specific finding:** Early in Claude's development, we noticed that certain types of questions about text structure (counting characters, finding anagrams, checking spelling) performed worse than expected. Investigation traced back to tokenization — the model doesn't see individual characters, it sees tokens. For a question like "does 'rhythm' contain the letter 'e'?" — the model must infer character presence from token representations, not directly observe it.

**Constitutional AI and tokenization:** Harmful request detection at the token level is interesting — some jailbreaks work by manipulating tokenization. "How to make d-r-u-g-s" tokenizes differently than "How to make drugs" — early safety training on one might not generalize to the other. Addressing this requires understanding the tokenization boundary.

**Practical engineering insight:** When I debugged Claude's behavior on specific inputs, I always first tokenized the input. Surprising behaviors often trace to unexpected tokenizations. "Why does the model behave oddly on this edge case?" Often answer: Weird tokenization creating unusual token sequence.

---

## Common Misconceptions

**Misconception 1: "Each word = one token"**
Absolutely not. "tokenization" = possibly 3-4 tokens. "!" = 1 token. "2024" = 1-2 tokens. Depends on tokenizer and training data frequencies.

**Misconception 2: "More context window = can read more text"**
Context window is in TOKENS, not words or characters. "100K token context" ≠ 100K words. For English: ~75K words. For Hindi: ~25K words. Language efficiency varies.

**Misconception 3: "Tokenizer can be changed without retraining model"**
Tokenizer and model are coupled at the token ID → embedding level. Changing tokenizer requires retraining from scratch.

**Misconception 4: "All tokenizers are the same"**
GPT-4 tokenizer ≠ LLaMA tokenizer ≠ BERT tokenizer. Different vocabularies, different segmentations, different token counts for same text. Cross-model token count comparisons meaningless without specifying tokenizer.

---

## Interview Questions

**Q1: Tokenization kya hai aur language models mein kyun zaruri hai?**

**Answer:** Tokenization = converting raw text into discrete numerical tokens that neural networks can process. Zaruri kyun: (1) Neural networks work on numbers, not text. Direct text input impossible. (2) Language has variable-length structure — tokenization provides fixed-size vocabulary of units. (3) Subword tokenization balances: vocabulary size (manageable), sequence length (not too long), OOV handling (no unknown tokens), morphological relationships (shared subwords). Without tokenization, you'd need to map individual characters → very long sequences, or individual words → massive vocabulary. Subword tokenization is the Goldilocks solution.

**Q2: BPE algorithm kaise kaam karta hai? Step by step explain karo.**

**Answer:** BPE (Byte Pair Encoding) algorithm: Input: Large text corpus. Goal: Build vocabulary of N subword tokens. Step 1: Initialize vocabulary with all individual characters (and special tokens). Step 2: Count all adjacent pairs of tokens in corpus. Step 3: Find most frequent pair. Step 4: Merge that pair into a new token. Add to vocabulary. Step 5: Repeat steps 2-4 until vocabulary size N reached. Result: Common words → single tokens (frequency). Common subwords → tokens (shared prefixes/suffixes). Rare words → decomposed into common pieces. Example: If "er" very frequent → merged to single token. Then "er" + "s" frequent → "ers" merged. Building up from characters to increasingly large common subwords.

**Q3: Vocabulary size ka tradeoff kya hai?**

**Answer:** Smaller vocabulary (30K): Fewer embedding parameters. More tokens per sequence → longer sequences. Higher fertility → less context efficiency. More characters/subwords per word. Larger vocabulary (100K+): More embedding parameters. Fewer tokens per sequence → shorter, more efficient sequences. Common words → single tokens → fast processing. Better context efficiency for deployment. Real cost: Embedding table size × 2 (input + output projection, often tied). GPT-2: 50K vocab × 768 dim = 38M params just for embeddings. GPT-3: 50K × 12288 = 600M params for embeddings. Tradeoff: Pay once at model training for large vocab → save at every inference invocation. For large-scale deployment (billions of queries), shorter sequences = significant cost savings.

**Q4: Special tokens kya hain aur kaise use hote hain?**

**Answer:** Special tokens: Reserved tokens for structural/control purposes, not regular text. Types: BOS/EOS: Marks sequence boundaries. PAD: Fills batches to same length. MASK: For BERT masked language modeling. SEP/CLS: BERT-specific structural tokens. Role tokens: `<|user|>`, `<|assistant|>`, `<|system|>` in chat models. Usage in practice: When you send message to ChatGPT/Claude, your message wrapped in structure like: [BOS][system_token]System prompt[user_token]Your message[assistant_token] Model generates → stops at [EOS]. This structure tells model: This is system context, this is human input, now generate assistant response. Without special tokens, chat models couldn't distinguish roles. Instruction following is largely about learning the patterns around these special tokens.

**Q5: Tokenization spelling/arithmetic tasks ko kyun hard banata hai?**

**Answer:** Spelling tasks: "How many r's in 'strawberry'?" "strawberry" → tokens: "straw" + "berry" (or similar). Model doesn't see individual characters — it sees tokens. Must INFER character composition from token representations. Doesn't have direct character-level access. This requires learning: "straw" starts with 's', 't', 'r', 'a', 'w'... indirect inference. Arithmetic: Numbers tokenize inconsistently. "100" = 1 token. "1000" = maybe "10" + "00". Digit carry operations require reasoning about positional values that cut across token boundaries. "1234 + 5678 = ?" — model must reason about digit alignment despite irregular tokenization. Solution attempts: Byte-level tokenization gives consistent character access but very long sequences. Some models add explicit character-level supervision. Chain-of-thought helps by reasoning step-by-step explicitly.

**Q6: Different languages mein tokenization kyun unequal hai?**

**Answer:** Root cause: Tokenizers trained predominantly on English data. English: Large portion of training corpus → English words/subwords very common → merged early in BPE → single tokens. Hindi, Arabic, Chinese: Less training data → subwords less frequent → fragmented into more tokens. Fertility difference: English: ~1.3 tokens/word. Hindi: ~3-5 tokens/word. Japanese (no spaces): ~2-3 tokens/character group. Practical implications: Same semantic content needs 3-5x more tokens in Hindi than English. Context window effectively 3-5x smaller for Hindi users. API costs proportionally higher for non-English users. Performance: Models have seen less data per character for non-English → poorer quality. Solutions: Train tokenizer on balanced multilingual data. Include more non-English in training corpus. Larger vocabularies to accommodate multilingual needs. Industry trend: Google's mT5, Meta's NLLB, and multilingual models specifically address this with balanced tokenizers.

---

## Key Takeaways

- **Tokenization** = text → discrete tokens → numbers; neural networks require this
- **Character-level** = too long sequences; **Word-level** = too large vocabulary; OOV problem
- **Subword (BPE/WordPiece)** = Goldilocks solution — manageable vocab, no OOV
- **Special tokens** = structural markers for chat models, BERT masking, etc.
- **Vocabulary size tradeoff** = larger vocab → shorter sequences → faster inference (but more embedding params)
- **Non-English languages** = unfairly fragmented → fewer words fit in context window
- **Model and tokenizer are coupled** = changing tokenizer requires full retraining
- **Tokenization artifacts** = directly cause spelling/arithmetic challenges in LLMs

---

*Agli file: `03_Embeddings_Deep_Dive.md` — Words ko vectors mein transform karna*
