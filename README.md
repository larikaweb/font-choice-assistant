# Font Choice Assistant MVP

A small open-source MVP for context-aware font recommendations with LLMs.

The project demonstrates a portable typography recommendation logic: it does not only suggest font pairs, but explains what each font does visually and perceptually in a specific design context.

```text
visible feature -> perception effect -> layout role
```

The same logic is packaged in several forms: a ChatGPT Skill, reusable prompts, a lightweight local RAG layer, and a Next.js demo app with Google Fonts preview.

## What this project solves

Many font recommendation workflows produce lists of attractive font pairs without explaining why they work. This project uses a different decision rule:

1. Start from the project context.
2. Identify the desired impression.
3. Define text roles: headings, body text, buttons, captions, quotes, labels, or accents.
4. Choose a readable base font direction first.
5. Add an accent font only when it has a clear role.
6. Explain every recommendation through visible typographic features.
7. Check Cyrillic quality when the project uses Russian or another Cyrillic language.

The goal is not to say “this font is beautiful.” The goal is to explain what the font changes in the design.

## MVP stack

- **Next.js App Router** for the demo UI and backend route handlers.
- **TypeScript** for typed recommendation, RAG, and preview structures.
- **Vercel AI SDK** for LLM calls through a provider-flexible interface.
- **OpenAI-compatible cloud provider** as the default cloud LLM mode.
- **Ollama OpenAI-compatible endpoint** as the optional local LLM mode.
- **MiniSearch** for lightweight local lexical retrieval over JSONL chunks.
- **Google Fonts Developer API** for font metadata.
- **Google Fonts CSS2 API** for live font preview rendering.
- **MIT License**.

This repository includes an OpenAI-compatible skill configuration generated for testing and experimentation. The project itself is independent and is not affiliated with, endorsed by, or officially supported by OpenAI.

The MVP intentionally does not use embeddings or a vector database. The RAG base is small enough for local lexical retrieval, and MiniSearch keeps the project easy to run and inspect.

## Repository layout

```text
font-choice-assistant-mvp/
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

## Quick start

The default setup is no-key friendly. It uses mock LLM output and a local Google Fonts metadata fixture, so the demo can run before any API keys are configured.

```bash
npm install
cp demo/.env.example demo/.env.local
npm run dev
```

Open the local Next.js URL printed by the terminal and try a request such as:

```text
Нужна пара шрифтов для лендинга психолога на русском: мягко, спокойно, доверительно, но не слишком декоративно.
```

## Environment

The demo reads environment variables from `demo/.env.local`.

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

### Cloud LLM mode

Set:

```env
LLM_MOCK_MODE=false
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
LLM_MODEL=gpt-4.1-mini
```

### Local LLM mode through Ollama

Set:

```env
LLM_MOCK_MODE=false
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3:8b
OLLAMA_API_KEY=ollama
```

### Google Fonts live metadata mode

Set:

```env
GOOGLE_FONTS_API_KEY=your_google_fonts_api_key
```

If this key is empty, the demo falls back to `visualizer/fixtures/google-fonts-sample.json`.

## Local MVP and deployment note

The demo is optimized for local MVP usage. For production deployment, make sure prompt templates, RAG JSONL data, and Google Fonts fixture files are included in the server bundle or copied into the demo app directory.

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

## Usage modes

### 1. ChatGPT Skill mode

Use:

```text
skill/font-choice/
skill/skill.zip
```

The Skill version is for environments that support ChatGPT Skills. It triggers on requests about fonts, font pairs, typography mood, Google Fonts, Cyrillic quality, and font perception.

### 2. Prompt-only chat mode

Use:

```text
prompts/chat_prompt.md
```

Copy the prompt into any text-based LLM chat and add the project brief.

### 3. Agent system prompt mode

Use:

```text
prompts/system_prompt_agent.md
```

This version is designed for custom assistants such as GPTs, Gems, Claude Projects, or similar agent builders.

### 4. Compact local prompt mode

Use:

```text
prompts/compact_prompt_local.md
```

This is a shorter prompt for local models or small context windows.

### 5. RAG mode

Use:

```text
rag/data/font_rag_full_local.jsonl
rag/data/font_rag_chunk_schema.md
prompts/prompt_template_with_rag_context.md
```

The RAG layer stores public-safe distilled knowledge. It does not expose a full internal instruction. It provides only processing principles, font perception chunks, and font pairing principle chunks.

Minimal RAG flow:

```text
user request
-> retrieve top-k chunks with MiniSearch
-> inject chunks into prompt_template_with_rag_context.md
-> call LLM
-> return font recommendation
```

## Demo app flow

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

- heading sample;
- body text sample;
- button or label sample;
- Cyrillic words;
- difficult Cyrillic letters;
- common Cyrillic combinations.

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

## Design rule

A good font recommendation in this project must answer three questions:

```text
What visible feature does the font have?
What perception effect does that feature create?
What layout role should the font play?
```

A bare list of attractive font pairs is not enough.

## Limitations

This MVP does not include authentication, saved projects, PDF export, screenshot rendering, font file downloading, self-hosted fonts, embeddings, vector search, or a production font licensing checker.

## Security note

Do not commit real API keys.

Use `.env.local` for local secrets and keep it out of Git.

The demo may show retrieved RAG context for educational clarity. This is safe only for public demo chunks. Do not expose private RAG data in debug output.

See [SECURITY.md](./SECURITY.md).

## License

MIT.
