# Security Policy

## Scope

This project is a prompt-first typography assistant and MVP technical prototype.

It is designed for:

- local use;
- prompt-based use in ordinary AI chats;
- public demo RAG data;
- educational and experimental workflows.

It is **not** a production SaaS service.

## API keys and secrets

Never commit real API keys, tokens, credentials, or private `.env` files.

Use local environment files only:

```text
.env
.env.local
```

These files must stay ignored by Git:

```text
.env
.env.local
*.env
```

Use `.env.example` or `.env.local.example` for public examples.

## RAG data safety

The included demo RAG data is intended to be public-safe.

Do not expose private RAG chunks, client data, private project notes, paid materials, or internal business documents in public demo mode.

If you use private RAG data:

- disable debug output of retrieved chunks;
- do not return raw context to the user;
- do not publish logs with retrieved context;
- review what is sent to external LLM APIs.

## Debug context

The demo may show retrieved RAG context for educational purposes.

This is safe only for public demo data.

For private or production use, disable visible RAG context by default.

## User data

The MVP should not store user requests, personal data, or project history by default.

If storage is added later, document:

- what is stored;
- where it is stored;
- how long it is kept;
- how users can delete it.

## External APIs

If external APIs are used, including LLM providers or Google Fonts:

- keep API keys server-side;
- do not expose secrets in frontend code;
- check provider pricing and limits;
- handle request errors and rate limits;
- do not send confidential data unless the user understands the risk.

## Current release status

Current release:

```text
MVP+ technical prototype
```

Planned next iteration:

```text
Telegram assistant pipeline with a configurable LLM provider.
```

The Telegram version should remain local-first or private until secret handling, logging, and user data boundaries are reviewed.

## Reporting issues

If you find a security issue, open an issue without posting secrets, tokens, or private data.

If the issue involves exposed credentials, revoke the key first, then report the problem.
