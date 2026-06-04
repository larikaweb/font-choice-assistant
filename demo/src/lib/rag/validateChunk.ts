import {
  CHUNK_TYPES,
  SOURCE_TYPES,
  type ChunkType,
  type RagChunk,
  type SourceType,
  type ValidationIssue,
  type ValidationReport,
  type ParseError,
} from "./types.js";

const REQUIRED_FIELDS = [
  "chunk_id",
  "source_type",
  "source_name",
  "chunk_type",
  "content",
  "tags",
  "public_safe",
] as const;

const FORBIDDEN_INTERNAL_FIELDS = new Set([
  "full_skill",
  "full_skill_instruction",
  "hidden_prompt",
  "system_prompt_private",
  "private_notes",
  "internal_notes",
  "chain_of_thought",
  "cot",
  "secret",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSourceType(value: unknown): value is SourceType {
  return typeof value === "string" && SOURCE_TYPES.includes(value as SourceType);
}

function isChunkType(value: unknown): value is ChunkType {
  return typeof value === "string" && CHUNK_TYPES.includes(value as ChunkType);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function issue(
  message: string,
  severity: "error" | "warning" = "error",
  line?: number,
  chunk_id?: string,
): ValidationIssue {
  return { message, severity, line, chunk_id };
}

export function validateChunkRecord(
  value: unknown,
  line?: number,
): { chunk?: RagChunk; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  if (!isRecord(value)) {
    return { issues: [issue("record must be a JSON object", "error", line)] };
  }

  const chunkId = typeof value.chunk_id === "string" ? value.chunk_id : undefined;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in value)) {
      issues.push(issue(`missing required field: ${field}`, "error", line, chunkId));
    }
  }

  for (const key of Object.keys(value)) {
    if (FORBIDDEN_INTERNAL_FIELDS.has(key)) {
      issues.push(issue(`forbidden internal field: ${key}`, "error", line, chunkId));
    }
  }

  if (typeof value.chunk_id !== "string" || value.chunk_id.trim().length === 0) {
    issues.push(issue("chunk_id must be a non-empty string", "error", line, chunkId));
  }

  if (!isSourceType(value.source_type)) {
    issues.push(
      issue(
        `source_type must be one of: ${SOURCE_TYPES.join(", ")}`,
        "error",
        line,
        chunkId,
      ),
    );
  }

  if (typeof value.source_name !== "string" || value.source_name.trim().length === 0) {
    issues.push(issue("source_name must be a non-empty string", "error", line, chunkId));
  }

  if (!isChunkType(value.chunk_type)) {
    issues.push(
      issue(
        `chunk_type must be one of: ${CHUNK_TYPES.join(", ")}`,
        "error",
        line,
        chunkId,
      ),
    );
  }

  if (typeof value.content !== "string" || value.content.trim().length === 0) {
    issues.push(issue("content must be a non-empty string", "error", line, chunkId));
  }

  if (!isStringArray(value.tags)) {
    issues.push(issue("tags must be an array of strings", "error", line, chunkId));
  }

  if (value.public_safe !== true) {
    issues.push(issue("public_safe must be true", "error", line, chunkId));
  }

  if (value.source_type === "spreadsheet") {
    if (!("source_sheet" in value)) {
      issues.push(
        issue(
          "source_sheet is required for spreadsheet chunks",
          "error",
          line,
          chunkId,
        ),
      );
    } else if (
      value.source_sheet !== null &&
      typeof value.source_sheet !== "string"
    ) {
      issues.push(issue("source_sheet must be a string or null", "error", line, chunkId));
    }
  }

  if ("source_sheet" in value && value.source_sheet !== null && typeof value.source_sheet !== "string") {
    issues.push(issue("source_sheet must be a string or null", "error", line, chunkId));
  }

  const hasErrors = issues.some((item) => item.severity === "error");
  if (hasErrors) return { issues };

  const chunk = {
    ...value,
    chunk_id: value.chunk_id as string,
    source_type: value.source_type as SourceType,
    source_name: value.source_name as string,
    source_sheet: (value.source_sheet ?? null) as string | null,
    chunk_type: value.chunk_type as ChunkType,
    content: value.content as string,
    tags: value.tags as string[],
    public_safe: true as const,
  } satisfies RagChunk;

  return { chunk, issues };
}

export function validateRecords(
  records: Array<{ value: unknown; line: number }>,
  parseErrors: ParseError[] = [],
  filePath?: string,
): ValidationReport {
  const issues: ValidationIssue[] = parseErrors.map((parseError) => ({
    line: parseError.line,
    severity: "error",
    message: `invalid JSON: ${parseError.message}`,
  }));
  const validChunks: RagChunk[] = [];
  const seenIds = new Map<string, number>();
  const countsByType: Record<string, number> = {};

  for (const record of records) {
    const result = validateChunkRecord(record.value, record.line);
    issues.push(...result.issues);

    if (!result.chunk) continue;

    const previousLine = seenIds.get(result.chunk.chunk_id);
    if (previousLine !== undefined) {
      issues.push({
        line: record.line,
        chunk_id: result.chunk.chunk_id,
        severity: "error",
        message: `duplicate chunk_id; first seen on line ${previousLine}`,
      });
      continue;
    }

    seenIds.set(result.chunk.chunk_id, record.line);
    validChunks.push(result.chunk);
    countsByType[result.chunk.chunk_type] = (countsByType[result.chunk.chunk_type] ?? 0) + 1;
  }

  const ok = !issues.some((item) => item.severity === "error");

  return {
    ok,
    filePath,
    totalRecords: records.length,
    validChunks,
    parseErrors,
    issues,
    countsByType,
  };
}
