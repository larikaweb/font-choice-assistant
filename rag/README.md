# RAG scripts

This folder contains the lightweight local RAG pipeline for the Font Choice Assistant MVP.

The goal is intentionally small: use public-safe JSONL chunks, retrieve the most relevant typography principles with MiniSearch, and build a compact context block that can be injected into an LLM prompt.

The MVP does not use embeddings, a vector database, a reranker, or LangChain.

## Files

```text
rag/
  data/
    font_rag_full_local.jsonl
    font_rag_chunk_schema.md
  scripts/
    validate.ts
    search.ts
    build_context.ts

demo/src/lib/rag/
  types.ts
  loadChunks.ts
  validateChunk.ts
  normalizeText.ts
  createIndex.ts
  retrieveChunks.ts
  formatContext.ts
  buildRagContext.ts
  index.ts
```

The CLI scripts in `rag/scripts/` are thin wrappers around the reusable RAG core in `demo/src/lib/rag/`. The same core can later be used by a Next.js API route.

## Install

From the repository root:

```bash
npm install
```

## Validate the JSONL database

```bash
npm run rag:validate
```

Direct usage:

```bash
tsx rag/scripts/validate.ts rag/data/font_rag_full_local.jsonl
```

The validator checks:

- JSONL parse errors;
- required fields;
- allowed `source_type` and `chunk_type` values;
- unique `chunk_id` values;
- `public_safe: true`;
- string array `tags`;
- `source_sheet` for spreadsheet chunks;
- accidental forbidden internal fields such as `hidden_prompt`, `full_skill_instruction`, or `internal_notes`.

`source_sheet` is required for `spreadsheet` chunks. It is optional for `skill_distilled` chunks.

## Search chunks

```bash
npm run rag:search -- "русский экспертный лендинг спокойный доверительный"
```

With options:

```bash
npm run rag:search -- "psychologist landing warm cyrillic" -- --topK 5 --type font_perception
```

Supported options:

```text
--topK <number>
--type <font_perception | font_pairing_principle | processing_principle>
--tag <tag>
--data <path>
--json
```

The search uses MiniSearch over these fields:

```text
content
tags
chunk_type
source_name
source_sheet
title
```

Field boost:

```text
tags: 3
chunk_type: 2
source_name: 1.5
source_sheet: 1.25
title: 1.5
content: 1
```

## Build RAG context

```bash
npm run rag:context -- "сайт психолога на русском, мягко и доверительно"
```

Build a full prompt from the RAG template:

```bash
npm run rag:context -- "expert landing page in Russian" -- \
  --template prompts/prompt_template_with_rag_context.md \
  --out tmp/rag_prompt.md
```

Supported options:

```text
--topK <number>
--maxProcessingPrinciples <number>
--template <path>
--out <path>
--data <path>
--json
```

The context builder always tries to include a few `processing_principle` chunks, because they preserve the main logic of the project:

```text
visible feature -> perception effect -> layout role
```

## Pipeline

```text
user request
-> load JSONL chunks
-> validate chunks
-> retrieve top-k chunks with MiniSearch
-> ensure processing principles are present
-> group chunks by type
-> format retrieved context
-> optionally inject context into prompt template
-> send final prompt to an LLM
```

## Why no embeddings in the MVP

The database is small and curated. A lexical retrieval layer is easier to inspect, easier to run locally, and sufficient for the first GitHub MVP. Vector search can be added later as an extension, but it is not part of this minimal implementation.
