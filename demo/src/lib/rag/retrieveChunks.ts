import type { ChunkType, RagChunk, RetrievedChunk, RetrieveOptions } from "./types.js";
import { createIndex } from "./createIndex.js";
import { normalizeText } from "./normalizeText.js";

function hasAllRequiredTags(chunk: RagChunk, requiredTags: string[]): boolean {
  if (requiredTags.length === 0) return true;

  const chunkTags = new Set(chunk.tags.map((tag) => normalizeText(tag)));
  return requiredTags.every((tag) => chunkTags.has(normalizeText(tag)));
}

function isAllowedType(chunk: RagChunk, chunkTypes?: ChunkType[]): boolean {
  if (!chunkTypes || chunkTypes.length === 0) return true;
  return chunkTypes.includes(chunk.chunk_type);
}

function termsFromResult(result: unknown): string[] | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const maybeTerms = (result as { terms?: unknown }).terms;
  return Array.isArray(maybeTerms) ? maybeTerms.map(String) : undefined;
}

export function retrieveChunks(options: RetrieveOptions): RetrievedChunk[] {
  const topK = options.topK ?? 7;
  const requiredTags = options.requiredTags ?? [];
  const query = normalizeText(options.query);

  if (!query) return [];

  const publicChunks = options.chunks.filter((chunk) => chunk.public_safe === true);
  const { index, documentsById } = createIndex(publicChunks);

  const rawResults = index.search(query);
  const retrieved: RetrievedChunk[] = [];
  const seen = new Set<string>();

  for (const result of rawResults) {
    const resultWithId = result as { id?: unknown; chunk_id?: unknown; score?: unknown };
    const id = String(resultWithId.id ?? resultWithId.chunk_id ?? "");
    if (!id || seen.has(id)) continue;

    const document = documentsById.get(id);
    if (!document) continue;

    const chunk = document.raw;
    if (!isAllowedType(chunk, options.chunkTypes)) continue;
    if (!hasAllRequiredTags(chunk, requiredTags)) continue;

    seen.add(id);
    retrieved.push({
      chunk,
      score: typeof resultWithId.score === "number" ? resultWithId.score : 0,
      terms: termsFromResult(result),
    });

    if (retrieved.length >= topK) break;
  }

  return retrieved;
}
