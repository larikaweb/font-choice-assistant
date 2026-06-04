# RAG Pipeline

The MVP uses local lexical retrieval over JSONL chunks with MiniSearch. It does not use embeddings or a vector database.

## Data

```text
rag/data/font_rag_full_local.jsonl
rag/data/font_rag_chunk_schema.md
```

Chunk types:

- `processing_principle`
- `font_perception`
- `font_pairing_principle`

The data is public-safe distilled knowledge. It is not the full Skill instruction.

## CLI scripts

Run from the repository root:

```bash
npm run rag:validate
npm run rag:search -- "русский экспертный лендинг спокойный"
npm run rag:context -- "сайт психолога на русском, мягко и доверительно"
```

## Runtime flow

```text
user request
-> load JSONL
-> validate schema and safety fields
-> build MiniSearch index
-> retrieve top-k chunks
-> ensure processing principles are included
-> group chunks by type
-> format Markdown context
-> inject context into the RAG prompt template
```

## Why no embeddings in the MVP

The dataset is small and inspectable. Lexical retrieval is easier to run, debug, and explain in a compact GitHub MVP. Vector or hybrid retrieval can be added later if the dataset grows.
