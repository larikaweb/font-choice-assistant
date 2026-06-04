# Demo App

Next.js demo for the Font Choice Assistant MVP.

## What it does

The app takes a typography request, retrieves relevant local RAG chunks, builds a recommendation prompt, calls an LLM or mock mode, extracts a structured font system, and renders a Google Fonts preview.

```text
user request
-> RAG context
-> LLM/mock recommendation
-> font system extraction
-> Google Fonts preview
-> Cyrillic check
```

## Run from repository root

```bash
npm install
cp demo/.env.example demo/.env.local
npm run dev
```

## Run from this folder

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment

The default setup is no-key friendly:

```env
LLM_MOCK_MODE=true
GOOGLE_FONTS_API_KEY=
```

This mode uses deterministic sample recommendation output and a local Google Fonts metadata fixture.

## API routes

### `POST /api/recommend`

Runs the full pipeline:

```text
user request -> RAG -> prompt -> LLM/mock -> font system -> preview
```

### `POST /api/rag/search`

Debug endpoint for retrieval only.

### `POST /api/fonts/preview`

Debug endpoint for checking a pair of fonts without generating a full recommendation.

## Notes

The MVP intentionally does not include embeddings, a vector database, authentication, persistence, or a complex design editor. The goal is to make the typography logic transparent and portable.
