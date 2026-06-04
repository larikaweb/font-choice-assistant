# Prompt Modes

The project includes four prompt files for different execution environments.

## `chat_prompt.md`

Use this when copying the logic into a normal LLM chat. It is the most readable prompt-only version and includes the full answer structure.

## `system_prompt_agent.md`

Use this as the system prompt for GPTs, Gems, Claude Projects, or similar custom agent builders. It keeps the typography behavior active across multiple user turns.

## `compact_prompt_local.md`

Use this for smaller local models or short context windows. It keeps the essential rule:

```text
visible feature -> perception effect -> layout role
```

## `prompt_template_with_rag_context.md`

Use this in the demo app and RAG-backed workflows. The backend inserts retrieved chunks into `{{RETRIEVED_CONTEXT}}` and then sends the filled prompt to the model.

## Shared behavior

All prompt modes should avoid bare lists of attractive font pairs. A good answer explains the project impression, text roles, base font direction, optional accent role, Cyrillic check, and risks.
