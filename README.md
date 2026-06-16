# Font Choice Assistant

Font Choice Assistant is a portable typography decision system.

It helps choose and explain font directions through a simple recommendation logic:

```text
visible feature -> perception effect -> layout role
```

The project does not only suggest attractive font pairs. It explains what each font does visually and perceptually in a specific design context.

This repository is not meant to be used as one mandatory full-stack application.

It contains several ready-to-use formats and implementation layers for the same font-choice logic.

Use only the part that matches your current workflow:

* prompt;
* system prompt;
* compact prompt;
* Skill package;
* RAG data;
* visualizer;
* optional demo pipeline.

Some parts are ready-to-use carriers of the logic.

Other parts are implementation layers, validation tools, or examples that show how the same logic can be reused in a larger system.

The main point of the repository is not the demo app.

The main point is the portable processing logic:

```text
project context
-> desired impression
-> text roles
-> visible typographic features
-> perception effect
-> layout role
-> Cyrillic quality check when needed
```

## Choose your format first

| If you need...                                                                       | Use this part                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| quick font advice in a normal LLM chat                                               | `prompts/chat_prompt.md`                               |
| reusable behavior for a custom assistant, GPT, Gem, Claude Project, or similar agent | `prompts/system_prompt_agent.md`                       |
| a compact version for smaller local models or short context windows                  | `prompts/compact_prompt_local.md`                      |
| a ChatGPT Skill package                                                              | `skill/font-choice/` or `skill/skill.zip`              |
| a searchable knowledge layer for an assistant implementation                         | `rag/` + `prompts/prompt_template_with_rag_context.md` |
| a standalone CLI check for Google Fonts preview and Cyrillic rendering               | `visualizer/`                                          |
| an optional integration pipeline showing how the parts work together                 | `demo/`                                                |
| examples of expected input and output                                                | `examples/`                                            |
| technical structure and implementation details                                       | `docs/`                                                |

## Packaging note

This repository is not a single MVP application.

The same font-choice logic is packaged in several forms so it can be used in different environments:

* **prompt files** — for ordinary LLM chats;
* **Skill package** — for environments that support ChatGPT Skills;
* **system prompt** — for custom agents and assistants;
* **compact prompt** — for local models or short context windows;
* **RAG data and scripts** — for building a local or sandboxed assistant with public-safe searchable font knowledge;
* **visualizer CLI** — for checking Google Fonts preview and Cyrillic rendering without running the full demo app;
* **optional integration demo** — for testing the full workflow from request to recommendation preview;
* **examples and schemas** — for validating and reusing the output structure;
* **documentation** — for understanding the architecture, prompt modes, RAG pipeline, visual preview flow, examples, and limitations.

The repository separates finished usage formats from implementation layers.

Prompts and the Skill package are ready-to-use carriers.

RAG data is a searchable knowledge layer that can be attached to an assistant implementation.

The visualizer is a validation tool.

The demo is an optional integration pipeline that shows how retrieval, prompt assembly, model output, structured extraction, and preview can work together.

All of these parts exist to preserve and reuse the same core processing logic, not to force one application structure.

The demo is not the whole product.
The RAG layer is not the whole product.
The Skill is not the whole product.
The prompts are not the whole product.

They are different carriers or implementation paths for the same decision rule.

Choose the format that matches your current use case and use only that part if the rest is not needed.

You do not need to install or run the demo to use the prompt, Skill, or RAG materials.

## What this project solves

Many font recommendation workflows produce lists of attractive font pairs without explaining why they work.

This project uses a different decision rule:

1. Start from the project context.
2. Identify the desired impression.
3. Define text roles: headings, body text, buttons, captions, quotes, labels, or accents.
4. Choose a readable base font direction first.
5. Add an accent font only when it has a clear role.
6. Explain every recommendation through visible typographic features.
7. Check Cyrillic quality when the project uses Russian or another Cyrillic language.

The goal is not to say “this font is beautiful.”

The goal is to explain what the font changes in the design.

A good recommendation should connect visual typography to design function.

For example:

```text
narrow proportions -> more editorial and concentrated tone -> useful for headings
open apertures -> clearer reading at small sizes -> useful for body text and UI labels
soft terminals -> warmer and less formal impression -> useful for human-centered services
high contrast strokes -> elegant and literary tone -> useful for titles or accent quotes
```

The project is especially useful when font choice must be explained, reused, documented, or adapted across several design contexts.

## Design rule

A good font recommendation in this project must answer three questions:

```text
What visible feature does the font have?
What perception effect does that feature create?
What layout role should the font play?
```

A bare list of attractive font pairs is not enough.

The recommendation should explain why a font works in a specific layout and what role it should play there.

The core chain is:

```text
visible feature -> perception effect -> layout role
```

This means the assistant should avoid vague statements such as:

```text
This font looks beautiful.
This font is modern.
This pair is stylish.
```

Instead, it should produce explanations such as:

```text
The body font has open letterforms and moderate spacing, so it stays readable in longer Russian text. It should be used for paragraphs, descriptions, and FAQ blocks.
```

or:

```text
The heading font has a literary rhythm and moderate contrast, so it adds a more personal and editorial tone without becoming decorative. It should be used only for headings and short emphasis.
```

## Repository layout

```text
font-choice-assistant/
  README.md
  SECURITY.md
  LICENSE
  package.json
  .env.example
  .gitignore

  skill/
    font-choice/
      SKILL.md
      agents/
        openai.yaml
    skill.zip

  prompts/
    chat_prompt.md
    system_prompt_agent.md
    compact_prompt_local.md
    prompt_template_with_rag_context.md

  rag/
    README.md
    data/
      font_rag_full_local.jsonl
      font_rag_chunk_schema.md
    scripts/
      validate.ts
      search.ts
      build_context.ts

  visualizer/
    README.md
    scripts/
      preview.ts
    fixtures/
      google-fonts-sample.json

  demo/
    README.md
    package.json
    .env.example
    next.config.ts
    tsconfig.json
    src/
      app/
      components/
      lib/

  docs/
    architecture.md
    prompt_modes.md
    rag_pipeline.md
    visualization_pipeline.md
    examples.md
    limitations.md

  examples/
    input_expert_landing_ru.json
    input_psychologist_ru.json
    input_author_site_ru.json
    output_expert_landing_ru.md
    output_psychologist_ru.md
    output_author_site_ru.md
    output_mock_ru.md
```

If the repository is still named `font-choice-assistant-mvp`, the folder name in this layout can remain as:

```text
font-choice-assistant-mvp/
```

If the repository is renamed, update this line to match the new repository name.

## Usage modes

The repository can be used in several modes.

You do not need to use all of them.

Choose the mode that matches your environment, copy or install only the relevant files, and ignore the rest unless you need to inspect or extend the system.

### 1. Prompt-only chat mode

Use:

```text
prompts/chat_prompt.md
```

This is the fastest mode.

Copy the prompt into any text-based LLM chat and add the project brief.

Use this mode when you need quick font advice in an ordinary chat interface.

Recommended for:

* fast experiments;
* one-off font recommendations;
* design consultations;
* checking typography direction before building a full system;
* working in any LLM chat without installing anything.

Typical flow:

```text
copy chat_prompt.md
-> paste it into an LLM chat
-> add project context
-> get font recommendation with explanations
```

This mode is ready to use.

It does not require the demo app, RAG scripts, Google Fonts API, or local development setup.

### 2. Agent system prompt mode

Use:

```text
prompts/system_prompt_agent.md
```

This version is designed for custom assistants such as GPTs, Gems, Claude Projects, or similar agent builders.

Use this mode when you want reusable assistant behavior rather than a one-time prompt.

Recommended for:

* custom GPTs;
* Claude Projects;
* Gemini Gems;
* internal design assistants;
* reusable typography helpers;
* structured recommendation workflows.

Typical flow:

```text
create custom assistant
-> paste system_prompt_agent.md as behavior instruction
-> optionally add examples or RAG context
-> use the assistant for font recommendation tasks
```

This mode is ready to use as an assistant behavior layer.

It can work on its own or be combined with examples and retrieved RAG context.

### 3. Compact local prompt mode

Use:

```text
prompts/compact_prompt_local.md
```

This is a shorter prompt for local models or small context windows.

Use this mode when the model has limited context capacity or struggles with long instructions.

Recommended for:

* local models;
* small models;
* short context windows;
* fast experiments with reduced instruction size;
* environments where prompt length must stay low.

Typical flow:

```text
copy compact_prompt_local.md
-> add short project brief
-> ask for font direction, roles, and explanation
```

This mode is ready to use.

It keeps the core recommendation rule but reduces instruction size.

### 4. ChatGPT Skill mode

Use:

```text
skill/font-choice/
skill/skill.zip
```

The Skill version is for environments that support ChatGPT Skills.

It triggers on requests about:

* fonts;
* font pairs;
* typography mood;
* Google Fonts;
* Cyrillic quality;
* font perception;
* font roles in layouts;
* readable font systems for websites and landing pages.

Use this mode when you want the logic to be packaged as a skill rather than pasted as a prompt.

Recommended for:

* ChatGPT Skill-compatible environments;
* reusable workflows;
* assistant behavior that should activate on typography requests;
* packaged instruction sets.

Typical flow:

```text
use skill/font-choice/
or
upload/use skill.zip
-> ask for typography recommendation
-> receive structured font advice
```

This mode is a ready-to-use package for compatible environments.

It should preserve the same core decision logic:

```text
visible feature -> perception effect -> layout role
```

### 5. RAG knowledge layer mode

Use:

```text
rag/data/font_rag_full_local.jsonl
rag/data/font_rag_chunk_schema.md
prompts/prompt_template_with_rag_context.md
```

The RAG layer stores public-safe distilled knowledge.

It does not expose a full internal instruction.

It provides only processing principles, font perception chunks, and font pairing principle chunks.

Use this mode when you want to add searchable public-safe font knowledge to a local or sandboxed assistant.

Recommended for:

* local assistants;
* sandboxed assistants;
* explainable retrieval;
* public-safe font knowledge;
* lightweight RAG without embeddings;
* environments where the knowledge base should be inspectable.

Minimal RAG flow:

```text
user request
-> retrieve top-k chunks with MiniSearch
-> inject chunks into prompt_template_with_rag_context.md
-> call LLM
-> return font recommendation
```

The RAG mode is intentionally lightweight.

It uses lexical search over structured JSONL chunks rather than embeddings or a vector database.

This mode is an implementation layer, not a hosted product and not a complete assistant by itself.

The included scripts help validate the data, search chunks, and build prompt context.

### 6. Visualizer CLI mode

Use:

```text
visualizer/
```

The visualizer is a standalone CLI tool for checking Google Fonts preview and Cyrillic rendering.

It can test recommended heading and body fonts without running the full Next.js demo app.

Use this mode when you want to check whether recommended fonts look acceptable in real text samples.

Recommended for:

* Cyrillic rendering checks;
* quick visual validation;
* testing heading/body combinations;
* inspecting difficult Cyrillic letters;
* checking font metadata from Google Fonts;
* validating recommendations before using them in a layout.

Example command:

```bash
npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru --metadata visualizer/fixtures/google-fonts-sample.json
```

Without `--metadata`, the visualizer expects `GOOGLE_FONTS_API_KEY` to be available:

```bash
GOOGLE_FONTS_API_KEY=your_key_here npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru
```

This mode is a validation tool.

It is especially useful because a font may technically contain Cyrillic glyphs and still look weak in real Russian-language text.

### 7. Optional integration demo mode

Use:

```text
demo/
```

The demo app is an optional integration pipeline for testing the full workflow.

It connects:

* user request;
* local RAG retrieval;
* prompt assembly;
* LLM or mock generation;
* structured font system extraction;
* Google Fonts metadata check;
* CSS2 preview URL generation;
* visual preview with Cyrillic test text.

It is not required for using the prompts, Skill package, RAG data, examples, or documentation.

Use this mode only when you want to run the local demo UI or inspect how all parts can work together.

Recommended for:

* testing the full workflow;
* previewing recommendations in a UI;
* checking Cyrillic rendering visually;
* demonstrating the recommendation pipeline;
* experimenting with mock, cloud, or local LLM modes;
* inspecting how RAG, prompt assembly, model output, extraction, and preview connect.

The demo app is only one implementation path for the recommendation logic.

It is not the center of the repository.

## Optional integration demo stack

The optional integration demo uses:

* **Next.js App Router** for the demo UI and backend route handlers.
* **TypeScript** for typed recommendation, RAG, and preview structures.
* **Vercel AI SDK** for LLM calls through a provider-flexible interface.
* **OpenAI-compatible cloud provider** as the default cloud LLM mode.
* **Ollama OpenAI-compatible endpoint** as the optional local LLM mode.
* **MiniSearch** for lightweight local lexical retrieval over JSONL chunks.
* **Google Fonts Developer API** for font metadata.
* **Google Fonts CSS2 API** for live font preview rendering.
* **MIT License**.

This repository includes an OpenAI-compatible skill configuration generated for testing and experimentation.

The project itself is independent and is not affiliated with, endorsed by, or officially supported by OpenAI.

The optional demo intentionally does not use embeddings or a vector database.

The RAG base is small enough for local lexical retrieval, and MiniSearch keeps the project easy to run and inspect.

## Optional integration demo quick start

The default demo setup is no-key friendly.

It uses mock LLM output and a local Google Fonts metadata fixture, so the demo can run before any API keys are configured.

```bash
npm install
cp demo/.env.example demo/.env.local
npm run dev
```

Open the local Next.js URL printed by the terminal and try a request such as:

```text
Нужна пара шрифтов для лендинга психолога на русском: мягко, спокойно, доверительно, но не слишком декоративно.
```

This quick start is only for the optional integration demo.

If you only want to use the prompt, system prompt, Skill package, RAG data, visualizer, examples, or documentation, you do not need this step.

## Environment

The optional integration demo reads environment variables from:

```text
demo/.env.local
```

Example environment:

```env
LLM_MOCK_MODE=true
GOOGLE_FONTS_API_KEY=
OPENAI_API_KEY=
LLM_PROVIDER=openai
LLM_MODEL=gpt-4.1-mini
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3:8b
DEFAULT_LANGUAGE=ru
```

### Mock mode

Mock mode is enabled by default:

```env
LLM_MOCK_MODE=true
```

In this mode, the demo can run without an LLM API key.

It uses mock output for local testing and interface validation.

Use mock mode when you want to test the UI and preview flow before connecting a model provider.

### Cloud LLM mode

Set:

```env
LLM_MOCK_MODE=false
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
LLM_MODEL=gpt-4.1-mini
```

This mode uses an OpenAI-compatible cloud provider.

Use it when you want the demo to generate real recommendations through a cloud LLM API.

### Local LLM mode through Ollama

Set:

```env
LLM_MOCK_MODE=false
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3:8b
OLLAMA_API_KEY=ollama
```

This mode uses an Ollama OpenAI-compatible endpoint.

Use it when you want to run generation through a local model.

### Google Fonts live metadata mode

Set:

```env
GOOGLE_FONTS_API_KEY=your_google_fonts_api_key
```

If this key is empty, the demo falls back to:

```text
visualizer/fixtures/google-fonts-sample.json
```

This allows the demo and visualizer to work without live Google Fonts metadata during local testing.

## Optional local demo and deployment note

The optional integration demo is optimized for local MVP usage.

For production deployment, make sure prompt templates, RAG JSONL data, and Google Fonts fixture files are included in the server bundle or copied into the demo app directory.

The demo depends on local files that may not be automatically available after deployment unless the build configuration includes them.

This is especially relevant for:

* prompt templates;
* RAG JSONL data;
* Google Fonts metadata fixtures;
* preview-related files;
* local scripts used by the demo workflow.

The core prompt, Skill, RAG, visualizer, examples, and documentation materials can be used independently of the demo deployment.

## Main commands

From the repository root:

```bash
npm run dev
npm run typecheck
npm run rag:validate
npm run rag:search -- "русский экспертный лендинг спокойный"
npm run rag:context -- "сайт психолога на русском, мягко и доверительно"
npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru --metadata visualizer/fixtures/google-fonts-sample.json
```

Without `--metadata`, the visualizer expects `GOOGLE_FONTS_API_KEY` to be available:

```bash
GOOGLE_FONTS_API_KEY=your_key_here npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru
```

## Optional integration demo app flow

The optional integration demo combines retrieval, generation, structured extraction, metadata checking, and visual preview.

The flow is:

```text
User brief
-> MiniSearch retrieval over JSONL chunks
-> prompt assembly
-> LLM or mock generation
-> recommendation card
-> structured font system extraction
-> Google Fonts metadata check
-> CSS2 preview URL
-> visual preview with Cyrillic test text
```

The preview shows:

* heading sample;
* body text sample;
* button or label sample;
* Cyrillic words;
* difficult Cyrillic letters;
* common Cyrillic combinations.

Suggested Cyrillic test set:

```text
Консультация
Документы
Стоимость
Образование
Архитектура
Заявка
Психология
Программа
Ж Д У Щ Я ф
ст ск пр ия нт ция
```

The preview is useful because Cyrillic support can look technically available but visually weak.

A font may contain Cyrillic glyphs and still be unsuitable for a Russian-language interface if the letter shapes, spacing, rhythm, or weight balance are poor.

The visual preview helps catch this before the recommendation is used in a real layout.

## Expected recommendation behavior

A recommendation should include:

* project context interpretation;
* desired visual impression;
* recommended font direction;
* heading font suggestion;
* body font suggestion;
* optional accent font suggestion;
* role of each font in the layout;
* visible typographic features;
* perceptual effect of those features;
* Cyrillic quality check when relevant;
* usage warnings when a font should not be overused.

A recommendation should not be only a list like:

```text
Use Lora + Manrope.
```

A better recommendation should explain:

```text
Use Manrope as the base font because its open forms and neutral rhythm keep Russian interface text readable. Use Lora for headings only if the project needs a softer editorial tone, because its contrast and literary rhythm add personality but may become too decorative in long text.
```

## Examples

Example input and output files are stored in:

```text
examples/
```

The repository includes examples for several Russian-language design contexts:

```text
examples/
  input_expert_landing_ru.json
  input_psychologist_ru.json
  input_author_site_ru.json
  output_expert_landing_ru.md
  output_psychologist_ru.md
  output_author_site_ru.md
  output_mock_ru.md
```

Use these files to inspect expected input structure and output style.

The examples are useful for:

* testing prompt behavior;
* validating output structure;
* comparing prompt-only and RAG-assisted modes;
* checking whether the assistant explains typography decisions rather than listing fonts;
* adapting the system to new design contexts.

## RAG data

The RAG data is stored in:

```text
rag/data/
```

Main files:

```text
rag/data/font_rag_full_local.jsonl
rag/data/font_rag_chunk_schema.md
```

The RAG data contains public-safe distilled chunks.

It is designed to support retrieval of typography principles, font perception notes, and pairing logic.

It should not contain private internal prompts or sensitive project data.

The intended use is:

```text
user request
-> retrieve relevant public-safe chunks
-> insert them into prompt_template_with_rag_context.md
-> generate recommendation
```

The RAG data is intentionally small and inspectable.

This keeps the project lightweight and makes retrieval behavior easier to debug.

The RAG data is not the complete product by itself.

It is a knowledge layer that helps preserve the same font-choice logic when the assistant is implemented in a retrieval-based workflow.

## RAG scripts

The RAG scripts are stored in:

```text
rag/scripts/
```

Main scripts:

```text
validate.ts
search.ts
build_context.ts
```

Use them to validate the JSONL data, search over chunks, and build prompt context.

Typical commands:

```bash
npm run rag:validate
npm run rag:search -- "русский экспертный лендинг спокойный"
npm run rag:context -- "сайт психолога на русском, мягко и доверительно"
```

The RAG scripts use lightweight lexical retrieval.

The project does not require embeddings or a vector database.

## Visualizer

The visualizer is stored in:

```text
visualizer/
```

Main files:

```text
visualizer/
  README.md
  scripts/
    preview.ts
  fixtures/
    google-fonts-sample.json
```

The visualizer can check selected font combinations against sample text.

It is especially useful for Cyrillic projects because visual quality cannot be fully checked from metadata alone.

Use it when you need to inspect:

* heading rendering;
* body text rendering;
* button or label rendering;
* difficult Cyrillic glyphs;
* common Cyrillic combinations;
* whether the selected pair works visually in Russian.

Example:

```bash
npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru --metadata visualizer/fixtures/google-fonts-sample.json
```

The visualizer is not the whole product.

It is a validation tool for checking one part of the typography recommendation workflow.

## Skill package

The Skill package is stored in:

```text
skill/
```

Main files:

```text
skill/
  font-choice/
    SKILL.md
    agents/
      openai.yaml
  skill.zip
```

Use this package in environments that support ChatGPT Skills.

The skill is designed to activate on typography-related requests and produce structured font recommendations.

It should preserve the same core decision logic:

```text
visible feature -> perception effect -> layout role
```

## Prompts

Prompt files are stored in:

```text
prompts/
```

Main files:

```text
prompts/
  chat_prompt.md
  system_prompt_agent.md
  compact_prompt_local.md
  prompt_template_with_rag_context.md
```

Use:

```text
chat_prompt.md
```

for ordinary LLM chats.

Use:

```text
system_prompt_agent.md
```

for custom assistants and reusable agent behavior.

Use:

```text
compact_prompt_local.md
```

for smaller local models or short context windows.

Use:

```text
prompt_template_with_rag_context.md
```

when retrieved RAG chunks should be inserted before generation.

## Documentation

Documentation files are stored in:

```text
docs/
```

Main files:

```text
docs/
  architecture.md
  prompt_modes.md
  rag_pipeline.md
  visualization_pipeline.md
  examples.md
  limitations.md
```

Use the documentation when you need to understand or modify the system.

Suggested reading order:

1. `docs/architecture.md`
2. `docs/prompt_modes.md`
3. `docs/rag_pipeline.md`
4. `docs/visualization_pipeline.md`
5. `docs/examples.md`
6. `docs/limitations.md`

## Security note

Do not commit real API keys.

Use `.env.local` for local secrets and keep it out of Git.

The optional demo may show retrieved RAG context for educational clarity.

This is safe only for public demo chunks.

Do not expose private RAG data in debug output.

See:

```text
SECURITY.md
```

## Limitations

This repository does not include:

* authentication;
* saved projects;
* PDF export;
* screenshot rendering;
* font file downloading;
* self-hosted fonts;
* embeddings;
* vector search;
* a production font licensing checker.

The optional integration demo app is only one implementation path for the recommendation logic.

It is included for testing the workflow and visually checking font recommendations, not as the only intended way to use the project.

The RAG layer is intentionally lightweight and public-safe.

The prompt files are intended as reusable instruction formats, not as a complete hosted product.

The Skill package is intended for compatible environments and may need adaptation depending on the platform.

The visualizer checks rendering and metadata, but it does not replace a full typography review inside a real layout.

## License

MIT.
