export const SOURCE_TYPES = ["spreadsheet", "skill_distilled"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const CHUNK_TYPES = [
  "font_perception",
  "font_pairing_principle",
  "processing_principle",
] as const;
export type ChunkType = (typeof CHUNK_TYPES)[number];

export interface RagChunk {
  chunk_id: string;
  source_type: SourceType;
  source_name: string;
  source_sheet?: string | null;
  chunk_type: ChunkType;
  content: string;
  tags: string[];
  public_safe: true;

  // Public enriched fields. The JSONL can contain extra structured data from
  // the spreadsheet layer. These fields are optional and safe to pass into RAG.
  title?: string;
  group?: string;
  type_or_parameter?: string;
  read_as?: string;
  mechanism?: string;
  perception_example?: string;
  font_examples?: string[] | string;
  risks?: string[] | string;
  risk?: string;
  principle?: string;
  working_formula?: string;
  good_pairs_or_directions?: string[] | string;
  anti_example?: string;
  when_to_use?: string;

  [key: string]: unknown;
}

export interface ParseError {
  line: number;
  message: string;
  raw: string;
}

export interface ValidationIssue {
  line?: number;
  chunk_id?: string;
  severity: "error" | "warning";
  message: string;
}

export interface ValidationReport {
  ok: boolean;
  filePath?: string;
  totalRecords: number;
  validChunks: RagChunk[];
  parseErrors: ParseError[];
  issues: ValidationIssue[];
  countsByType: Record<string, number>;
}

export interface RetrievedChunk {
  chunk: RagChunk;
  score: number;
  terms?: string[];
}

export interface RetrieveOptions {
  query: string;
  chunks: RagChunk[];
  topK?: number;
  chunkTypes?: ChunkType[];
  requiredTags?: string[];
}

export interface BuildRagContextOptions {
  userRequest: string;
  chunks: RagChunk[];
  topK?: number;
  maxProcessingPrinciples?: number;
  maxCharsPerChunk?: number;
  ensureProcessingPrinciples?: boolean;
}

export interface BuiltRagContext {
  context: string;
  selected: RetrievedChunk[];
  selectedIds: string[];
  countsByType: Record<ChunkType, number>;
}
