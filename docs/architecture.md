# Architecture

This document describes the architecture of the Font Choice Assistant MVP.

The project demonstrates one portable typography recommendation principle across several usage modes:

```text
visible feature -> perception effect -> layout role
```

A font recommendation is incomplete if it only lists font names and does not explain what the fonts do visually and perceptually in the project context.

## Architecture goals

The MVP supports:

1. A ChatGPT Skill package.
2. Prompt-only usage in any text LLM.
3. System prompt usage for custom agents.
4. Lightweight local RAG over public-safe JSONL chunks.
5. A Next.js demo app.
6. Google Fonts metadata lookup and live preview.
7. Cloud LLM mode through an OpenAI-compatible provider.
8. Optional local LLM mode through an Ollama-compatible endpoint.
9. A no-key mock mode for immediate local demo runs.

## Non-goals

The MVP is not intended to be:

- a full design system generator;
- a complete typography course;
- a production font licensing checker;
- a visual design approval tool;
- a vector database demo;
- a platform-specific implementation for Tilda, Webflow, Framer, Figma, or any other builder.

The application should not make unsupported platform claims such as “this font is built into this platform,” “this font is cached well there,” or “this font loads faster on that service” unless the implementation verifies that specific fact.

## Selected stack

```text
Frontend/backend: Next.js App Router
Language: TypeScript
LLM integration: Vercel AI SDK
Default LLM mode: OpenAI-compatible cloud provider
Optional local LLM mode: Ollama-compatible endpoint
Retrieval: MiniSearch lexical retrieval over JSONL
Font metadata: Google Fonts Developer API
Font rendering: Google Fonts CSS2 API
License: MIT
```

The project intentionally avoids embeddings and vector search in the MVP. The knowledge base is small, inspectable, and well-suited to local lexical retrieval.

## High-level system overview

```text
User brief
  -> RAG query
  -> MiniSearch over JSONL chunks
  -> Retrieved processing/perception/pairing chunks
  -> Prompt builder
  -> LLM or mock generator
  -> Recommendation text + machine-readable font system
  -> Google Fonts metadata check
  -> CSS2 URL generation
  -> Preview UI with Cyrillic check
```

## Repository layers

### 1. Skill layer

Path:

```text
skill/font-choice/
skill/skill.zip
```

Purpose:

- Provide a ChatGPT Skill version of the font-choice logic.
- Trigger on requests about fonts, font pairs, Google Fonts, typography mood, Cyrillic quality, and font perception.
- Keep the decision logic reusable and compact.

Core behavior:

- Start from the project context.
- Choose a readable base font direction before naming fonts.
- Use a second font only if it has a clear role.
- Explain each recommendation through `visible feature -> perception effect -> layout role`.
- Check Cyrillic when the project uses Russian or another Cyrillic language.
- Avoid unsupported platform claims.

### 2. Prompt layer

Path:

```text
prompts/
```

Files:

```text
chat_prompt.md
system_prompt_agent.md
compact_prompt_local.md
prompt_template_with_rag_context.md
```

Purpose:

- Make the same typography logic portable outside ChatGPT Skills.
- Support ordinary chat usage, custom agents, local models, and RAG-backed calls.

### 3. RAG data layer

Path:

```text
rag/data/
```

Files:

```text
font_rag_full_local.jsonl
font_rag_chunk_schema.md
```

The RAG data layer contains public-safe distilled knowledge. It does not expose the full Skill instruction.

Chunk schema:

```json
{
  "chunk_id": "string",
  "source_type": "spreadsheet | skill_distilled",
  "source_name": "string",
  "source_sheet": "string | null",
  "chunk_type": "font_perception | font_pairing_principle | processing_principle",
  "content": "string",
  "tags": ["string"],
  "public_safe": true
}
```

Chunk types:

```text
processing_principle
font_perception
font_pairing_principle
```

### 4. Retrieval layer

Paths:

```text
demo/src/lib/rag/
rag/scripts/
```

Core files:

```text
loadChunks.ts
validateChunk.ts
normalizeText.ts
createIndex.ts
retrieveChunks.ts
formatContext.ts
buildRagContext.ts
loadRagData.ts
```

CLI files:

```text
rag/scripts/validate.ts
rag/scripts/search.ts
rag/scripts/build_context.ts
```

The MVP uses MiniSearch for local lexical retrieval.

Index fields:

```text
content
tagsText
chunk_type
source_name
source_sheet
title
```

Recommended field priority:

```text
tagsText > chunk_type > title/source_name/source_sheet > content
```

Retrieval flow:

```text
user request
-> load and validate JSONL chunks
-> retrieve top-k chunks with MiniSearch
-> ensure several processing principles are present
-> group chunks by chunk_type
-> format retrieved context as Markdown
-> inject context into prompt_template_with_rag_context.md
-> call LLM or mock generator
```

The model does not access the JSONL database directly. The backend retrieves chunks and inserts only the selected context.

### 5. Model and prompt layer

Path:

```text
demo/src/lib/llm/
```

Files:

```text
buildRecommendationPrompt.ts
modelClient.ts
parseFontSystem.ts
types.ts
index.ts
```

Responsibilities:

- Read the RAG prompt template.
- Insert retrieved context and user parameters.
- Route generation through mock mode, cloud mode, or local Ollama-compatible mode.
- Parse the machine-readable `font_system` JSON block from the model response.
- Convert the parsed font system into preview roles.

Environment variables:

```env
LLM_PROVIDER=openai
LLM_MODEL=gpt-4.1-mini
OPENAI_API_KEY=

OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3:8b
OLLAMA_API_KEY=ollama

LLM_MOCK_MODE=true
GOOGLE_FONTS_API_KEY=
DEFAULT_LANGUAGE=ru
```

### 6. Recommendation output layer

The LLM response should include both a readable explanation and a machine-readable JSON block that the UI can use.

Minimal structured font system:

```json
{
  "font_system": {
    "headingFont": "Lora",
    "bodyFont": "Manrope",
    "buttonFont": "Manrope",
    "language": "ru",
    "weights": {
      "heading": [600, 700],
      "body": [400, 500],
      "button": [600]
    },
    "roles": {
      "heading": "authorial editorial accent",
      "body": "clean readable base",
      "button": "same family as body for clarity"
    }
  }
}
```

The UI should not treat the font list as the whole answer. The reasoning chain is part of the product.

### 7. Google Fonts metadata and preview layer

Paths:

```text
demo/src/lib/fonts/
visualizer/scripts/preview.ts
visualizer/fixtures/google-fonts-sample.json
```

Core files:

```text
googleFontsClient.ts
normalizeFontName.ts
matchFontFamily.ts
resolveFontWeights.ts
inspectFontFamily.ts
buildCss2Url.ts
buildPreviewText.ts
buildFontPreview.ts
loadLocalGoogleFontsFixture.ts
```

Responsibilities:

- Check whether a recommended family exists in Google Fonts metadata.
- Read metadata such as variants, subsets, category, files, axes, and tags when available.
- Check whether Cyrillic or Cyrillic Extended appears in available subsets.
- Resolve requested weights.
- Build a Google Fonts CSS2 URL.
- Render preview text for headings, body, buttons, quotes, labels, captions, and Cyrillic checks.

Boundary:

Metadata can confirm technical availability and subset information. It cannot prove that the Cyrillic design quality is visually good. The preview and manual inspection still matter.

### 8. Demo UI layer

Paths:

```text
demo/src/app/
demo/src/components/
```

Main components:

```text
RequestForm.tsx
RecommendationCard.tsx
FontSystemCard.tsx
FontPreview.tsx
FontWarningList.tsx
CyrillicCheckBlock.tsx
RagContextPanel.tsx
```

UI responsibilities:

- Accept a project brief.
- Show the recommendation in a scannable format.
- Display the selected font roles.
- Show a live preview of headings, body text, buttons, quotes, labels, and Cyrillic test strings.
- Warn when Google Fonts metadata does not show Cyrillic support or requested weights are missing.
- Optionally display retrieved RAG chunks for transparency.

The preview is not only decorative. It is the validation surface for the recommendation.

## API routes

### `POST /api/recommend`

Input:

```json
{
  "userRequest": "Russian-language landing page for an educational consultant...",
  "language": "ru",
  "constraints": "Google Fonts, Cyrillic required"
}
```

Flow:

```text
validate input
-> retrieve chunks
-> build prompt
-> call LLM or mock generator
-> parse font system
-> build Google Fonts preview
-> return recommendation + RAG + preview
```

### `POST /api/rag/search`

Input:

```json
{
  "query": "русский экспертный лендинг спокойный доверительный",
  "topK": 7
}
```

Flow:

```text
validate input
-> retrieve chunks
-> format context
-> return chunks and contextMarkdown
```

### `POST /api/fonts/preview`

Input:

```json
{
  "headingFont": "Lora",
  "bodyFont": "Manrope",
  "language": "ru"
}
```

Flow:

```text
validate input
-> inspect font families
-> resolve weights
-> build CSS2 URL
-> return preview config and warnings
```

## Data and privacy boundaries

The MVP sends the user's project brief to the configured LLM provider when mock mode is disabled. If local mode is used through an Ollama-compatible endpoint, generation can run locally depending on the user's setup.

The Google Fonts metadata call uses Google's API when `GOOGLE_FONTS_API_KEY` is provided. The preview may load font CSS from Google Fonts unless the project is adapted to self-host fonts.

The RAG data is local JSONL and does not require a database service.

## Error handling

The demo should handle:

- empty user brief;
- missing LLM API key when mock mode is disabled;
- unreachable local Ollama endpoint;
- missing Google Fonts API key;
- recommended font not found in Google Fonts;
- no Cyrillic subset detected;
- malformed LLM response;
- no RAG chunks retrieved.

Fallback behavior:

- If `LLM_MOCK_MODE=true`, return deterministic sample output.
- If Google Fonts API key is missing, use the local sample metadata fixture.
- If Google Fonts lookup fails, show the text recommendation and mark preview warnings.
- If Cyrillic support is missing or uncertain, warn the user and suggest visual testing or an alternative font.

## Quality checks

A recommendation passes the MVP quality check when it includes:

- project impression;
- base font direction;
- one readable base font or 2-4 base options;
- optional accent font only when it has a clear role;
- `visible feature -> perception effect -> layout role`;
- Cyrillic check when relevant;
- risks and what to avoid;
- no unsupported platform claims;
- no bare list of pretty font pairs.

## Extension points

The MVP can later be extended with:

- vector or hybrid retrieval;
- saved recommendation history;
- downloadable font-pair cards;
- Figma plugin integration;
- self-hosted font preview mode;
- automated screenshot-based preview comparison;
- richer font metadata and licensing checks.

These are extension points, not MVP requirements.
