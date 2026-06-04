---
name: font-choice
description: typography and font recommendation guidance for websites, landing pages, guides, presentations, brand pages, portfolios, social media templates, and other visual projects. use when the user asks for fonts, font pairs, google fonts, typography mood, cyrillic font quality, or how fonts affect perception, hierarchy, and text roles.
---

# Font Choice

## Purpose

Help the user choose fonts and font pairs by connecting visible typography features to the desired project impression. Keep recommendations practical, context-specific, and readable.

Use this skill to recommend typography for websites, landing pages, guides, presentations, brand pages, portfolios, social media templates, and similar visual projects.

This is an independent community skill configuration for experimentation. It is not affiliated with, endorsed by, or officially supported by OpenAI.

Answer in the user's language.

## Core principle

Treat a font as a perception tool, not as decoration or a fixed emotional label.

A font can make a message feel clear, strict, soft, modern, bookish, technical, premium, friendly, official, energetic, calm, or human. Explain what the font does in this specific context.

Do not use stereotypes such as:
- serif = trust;
- sans-serif = modern;
- script = warmth;
- monospace = IT;
- Playfair Display = premium;
- Montserrat = modern for everything.

Prefer explanations based on visible features:
- high contrast strokes;
- thin lines;
- dramatic rhythm;
- glossy editorial feeling;
- soft rounded forms;
- dense condensed letters;
- handwritten gesture;
- neutral rhythm;
- strong or calm letter spacing.

For every font recommendation, connect the typography choice through this chain:

> visible feature -> perception effect -> layout role

Example: "Lora has a softer serif rhythm and book-like letter shapes, so it makes headings feel calmer and more authorial; use it for headings or quotes, while the body font keeps long text readable."

Do not answer with a bare list of attractive font pairs. If the draft answer only lists pairs without explaining visible features, perception effects, and layout roles, rewrite it before responding.

## Workflow

### 1. Identify or infer the task

Before recommending fonts, identify or infer:

1. Project type: expert, consulting, legal, educational, premium, aesthetic, soft, caring, technology, AI, IT, creative, authorial, event-based, or another relevant type.
2. Desired impression: trust, clarity, warmth, status, calmness, precision, energy, structure, authorial voice, or another target perception.
3. Text roles: heading, body text, button, caption, quote, technical label, emotional accent.
4. Language: if the project uses Russian or another Cyrillic language, explicitly check Cyrillic quality.

Do not ask many questions before helping. If details are missing, give one safe starting recommendation and offer focused refinement.

### 2. Choose the base font direction

Choose the readable base direction first. Do not choose a base font only from a fixed list.

Use these directions as starting points:

| Direction | Use when the project needs | Examples |
|---|---|---|
| neutral / interface / universal | clarity, structure, fast reading | Inter, Roboto, Noto Sans |
| human / calm / friendly | trust, warmth, comfortable reading without decoration | Open Sans, Lato, Source Sans 3, PT Sans |
| modern / soft / polished | clean modern look without a cold technical feeling | Manrope, Mulish, Rubik |
| rounded / approachable | softness, friendliness, accessibility | Nunito Sans, Quicksand, Varela Round |
| editorial / literary but readable | authorial, bookish, or literary tone | Lora, Merriweather, Spectral |

These are examples, not the full list. Suggest other fonts when they match the role, support the tone, remain readable, support the required language, and do not create visual noise.

Do not always default to Inter. Inter is safe for interfaces, but not always the best emotional fit.

Use one font family if the project needs clarity, order, and simplicity. A single family with several weights is often enough:
- regular for body text;
- medium for important phrases;
- semibold or bold for headings;
- medium or semibold for buttons.

Warn that a one-font system can feel flat if hierarchy is weak.

### 3. Decide whether an accent font is needed

Use a second font only if it has a clear role.

Good general formula:

> expressive heading font + calm body font

First choose the pairing direction, then suggest specific fonts.

Use these pairing directions:

| Pairing direction | Use when the project needs | Examples |
|---|---|---|
| literary serif + neutral sans | atmosphere, bookishness, authorial voice, clean reading | Cormorant Garamond + Inter; Lora + Manrope; EB Garamond + Inter; Merriweather + Open Sans |
| editorial serif + calm sans | elegance, visual status, magazine-like feeling | Playfair Display + Source Sans 3; Cormorant Garamond + Manrope; Prata + Lato; DM Serif Display + Open Sans |
| strong display + readable sans | energy, event feeling, poster mood, strong first impression | Bebas Neue + Source Sans 3; Oswald + Open Sans; Unbounded + Inter; Russo One + Roboto |
| soft serif + friendly sans | warmth, trust, less formal emotional tone | Lora + Lato; Merriweather + Nunito Sans; Cormorant Garamond + Open Sans; Spectral + Manrope |
| one-font literary system | simplicity and unified authorial voice | Spectral; Lora; Merriweather |
| one-font clean system | order, clarity, minimal visual risk | Inter; Manrope; Source Sans 3; Noto Sans |

The accent font creates character. The base font keeps text easy to read.

### 4. Avoid bad pairings

Avoid:
- two fonts that look almost the same;
- two highly decorative fonts;
- script fonts for long text;
- monospace fonts for everything;
- choosing a font only because it looks beautiful;
- using a font stereotype without explaining visible features.

Replace weak logic with contextual logic:
- Instead of “use serif because it means trust,” say “this serif adds a bookish, formal layer, but should be tested in Cyrillic.”
- Instead of “use monospace everywhere for an IT page,” say “this monospace font is useful for tags or code-like labels, not for all body text.”
- Instead of “use script for warmth,” say “this script works only as a short personal accent.”

### 5. Check Cyrillic when needed

For Russian-language or Cyrillic projects, explicitly test real words:
- Образование;
- Консультация;
- Документы;
- Стоимость;
- Архитектура;
- Заявка;
- Психология;
- Программа.

Check letters:
- Ж;
- Д;
- У;
- Щ;
- Я;
- ф.

Check combinations:
- ст;
- ск;
- пр;
- ия;
- нт;
- ция.

Warn that a font may look good in English but feel weak, heavy, narrow, awkward, or poorly balanced in Cyrillic.

### 6. Be careful with claims

Do not claim platform-specific behavior unless verified.

Avoid unsupported statements such as:
- “this font is cached well in Tilda”;
- “this font is built into this platform”;
- “this font loads faster on this service”;
- “this platform supports this font by default.”

If the user asks about a specific platform, say what needs to be checked:
- whether the font is available there;
- whether it supports Cyrillic;
- how it looks in real text;
- whether it affects page loading.

Do not invent narrow professional associations such as “this font is for arbitration law” or “this font is for psychologists only.” Connect fonts to tone instead: academic, calm, formal, warm, technical, premium, editorial, practical.

Avoid vague gender or taste labels unless the visible features are explained.

## Output format

When recommending fonts, use this structure:

1. **Project impression needed** — briefly say what the page or project should communicate.
2. **Base font direction** — say what kind of base font is needed and why.
3. **Base font recommendation** — recommend one readable base font or 2–4 options.
4. **Optional accent font** — suggest a second font only if it has a clear role.
5. **Why it works / what the fonts do visually** — explain the perception mechanism in simple words using the chain: visible feature -> perception effect -> layout role.
6. **What to check visually** — tell the user what words, letters, density, and mood to inspect.
7. **What to avoid** — warn about weak Cyrillic, too much decoration, similar fonts, unsupported platform claims, or excessive contrast.

Keep the answer practical. Do not overload the user with too many font pairs, long theory, unnecessary platform details, internal reasoning steps, broad typography history, or mismatched options.

If the user asks for one font pair, give:
- one main recommendation;
- the role of each font;
- a short explanation of why it works;
- at least one visible feature for each font and the perception effect it creates;
- what to check visually;
- what to avoid.

If alternatives are useful, give only 2–3 and explain how they differ by tone.

## Example pattern

For a Russian-language expert legal landing page, the typography should feel clear, calm, and professional without becoming cold or bureaucratic.

The base font direction should be a readable humanist or neutral sans-serif: it should support long reading, quick scanning, and a calm expert tone.

Good base options: Inter, Manrope, Open Sans, Lato, or Source Sans 3.

If the page needs a more bookish or expert tone, add Lora or Merriweather for headings. They can add warmth and authority without making the page too decorative.

A good pair would be:
- Heading: Lora;
- Body text and buttons: Inter or Manrope.

Why it works: Lora gives the headings a softer editorial character, while Inter or Manrope keeps the main text clear and easy to scan.

Check Cyrillic on words like “Консультация”, “Документы”, “Образование”, and “Стоимость”. Look at letters Ж, Д, У, Щ. Make sure the heading does not feel too decorative and the body text does not feel too cold.

Avoid script fonts, very thin fonts, or two similar sans-serif fonts used together without a clear reason.

## Focused refinement

If the user's request is broad, give a useful starting recommendation first, then offer focused refinement.

Example:

> For a fantasy author, a safe starting pair is Cormorant Garamond + Inter. If you clarify the tone of the project, I can suggest 2–3 more precise alternatives.

Offer refinement by only a few useful dimensions:
- genre tone: dark fantasy, epic fantasy, romantic fantasy, gothic, mythic, cozy magical, literary fantasy, young adult, adult fantasy;
- audience: readers, clients, publishers, students, fans, professional peers;
- project format: landing page, author site, book page, PDF guide, presentation, social media card, portfolio;
- emotional direction: ancient, elegant, severe, warm, mysterious, brutal, delicate, cinematic, scholarly, modern;
- practical constraint: one-font system, google fonts only, Cyrillic support, high readability, premium look, lightweight page loading;
- visual role: heading font, body font, button font, quote font, technical label, decorative accent.

## Final rule

A good font pair works when:
1. one font creates the visual character;
2. the other keeps the text easy to read;
3. both support the same message and do not fight for attention.

Before finalizing the answer, check that each recommended font has a clear chain:

visible feature -> perception effect -> layout role.

If this chain is missing, the recommendation is not finished yet.
