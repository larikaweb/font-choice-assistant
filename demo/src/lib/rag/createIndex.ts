import MiniSearch from "minisearch";
import type { RagChunk } from "./types.js";
import { normalizeText, uniqueNormalizedTags } from "./normalizeText.js";

export interface IndexedChunkDocument {
  chunk_id: string;
  content: string;
  tagsText: string;
  chunk_type: string;
  source_name: string;
  source_sheet: string;
  title: string;
  raw: RagChunk;
}

export interface RagSearchIndex {
  index: MiniSearch<IndexedChunkDocument>;
  documentsById: Map<string, IndexedChunkDocument>;
}

function asSearchText(value: unknown): string {
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return String(value);
}

export function createIndex(chunks: RagChunk[]): RagSearchIndex {
  const documents = chunks.map((chunk) => {
    const enrichedText = [
      chunk.content,
      chunk.title,
      chunk.group,
      chunk.type_or_parameter,
      chunk.read_as,
      chunk.mechanism,
      chunk.perception_example,
      chunk.font_examples,
      chunk.risks,
      chunk.risk,
      chunk.principle,
      chunk.working_formula,
      chunk.good_pairs_or_directions,
      chunk.anti_example,
      chunk.when_to_use,
    ]
      .map(asSearchText)
      .filter(Boolean)
      .join(" ");

    return {
      chunk_id: chunk.chunk_id,
      content: normalizeText(enrichedText),
      tagsText: uniqueNormalizedTags(chunk.tags).join(" "),
      chunk_type: chunk.chunk_type,
      source_name: normalizeText(chunk.source_name),
      source_sheet: normalizeText(chunk.source_sheet ?? ""),
      title: normalizeText(chunk.title ?? ""),
      raw: chunk,
    } satisfies IndexedChunkDocument;
  });

  const index = new MiniSearch<IndexedChunkDocument>({
    idField: "chunk_id",
    fields: ["content", "tagsText", "chunk_type", "source_name", "source_sheet", "title"],
    storeFields: ["chunk_id", "chunk_type", "source_name", "source_sheet", "title", "tagsText"],
    searchOptions: {
      boost: {
        tagsText: 3,
        chunk_type: 2,
        source_name: 1.5,
        source_sheet: 1.25,
        title: 1.5,
        content: 1,
      },
      prefix: true,
      fuzzy: 0.2,
    },
  });

  index.addAll(documents);

  return {
    index,
    documentsById: new Map(documents.map((document) => [document.chunk_id, document])),
  };
}
