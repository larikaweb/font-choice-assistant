import {
  CHUNK_TYPES,
  type BuiltRagContext,
  type BuildRagContextOptions,
  type ChunkType,
  type RetrievedChunk,
} from "./types.js";
import { retrieveChunks } from "./retrieveChunks.js";
import { formatRetrievedContext } from "./formatContext.js";

function countByType(selected: RetrievedChunk[]): Record<ChunkType, number> {
  const counts = Object.fromEntries(CHUNK_TYPES.map((type) => [type, 0])) as Record<ChunkType, number>;
  for (const item of selected) counts[item.chunk.chunk_type] += 1;
  return counts;
}

export function buildRagContext(options: BuildRagContextOptions): BuiltRagContext {
  const topK = options.topK ?? 7;
  const maxProcessingPrinciples = options.maxProcessingPrinciples ?? 3;
  const ensureProcessingPrinciples = options.ensureProcessingPrinciples ?? true;

  const retrieved = retrieveChunks({
    query: options.userRequest,
    chunks: options.chunks,
    topK: topK + maxProcessingPrinciples,
  });

  const selectedById = new Map<string, RetrievedChunk>();
  for (const item of retrieved.slice(0, topK)) {
    selectedById.set(item.chunk.chunk_id, item);
  }

  if (ensureProcessingPrinciples) {
    const selectedPrincipleCount = [...selectedById.values()].filter(
      (item) => item.chunk.chunk_type === "processing_principle",
    ).length;

    const missingPrinciples = Math.max(0, maxProcessingPrinciples - selectedPrincipleCount);

    if (missingPrinciples > 0) {
      const fallbackPrinciples = options.chunks
        .filter((chunk) => chunk.public_safe === true && chunk.chunk_type === "processing_principle")
        .slice(0, missingPrinciples);

      for (const chunk of fallbackPrinciples) {
        if (!selectedById.has(chunk.chunk_id)) {
          selectedById.set(chunk.chunk_id, { chunk, score: 0 });
        }
      }
    }
  }

  const selected = [...selectedById.values()]
    .sort((a, b) => {
      if (a.chunk.chunk_type === "processing_principle" && b.chunk.chunk_type !== "processing_principle") return -1;
      if (a.chunk.chunk_type !== "processing_principle" && b.chunk.chunk_type === "processing_principle") return 1;
      return b.score - a.score;
    })
    .slice(0, topK + maxProcessingPrinciples);

  return {
    context: formatRetrievedContext(selected, options.maxCharsPerChunk),
    selected,
    selectedIds: selected.map((item) => item.chunk.chunk_id),
    countsByType: countByType(selected),
  };
}
