import path from "node:path";
import { loadJsonlRecords } from "./loadChunks.js";
import { validateRecords } from "./validateChunk.js";
import type { RagChunk, ValidationReport } from "./types.js";

const DATA_PATH = path.join(process.cwd(), "..", "rag", "data", "font_rag_full_local.jsonl");

let cachedReport: ValidationReport | null = null;

export function loadRagData(): ValidationReport {
  if (cachedReport) return cachedReport;

  const { records, parseErrors } = loadJsonlRecords(DATA_PATH);
  cachedReport = validateRecords(records, parseErrors, DATA_PATH);
  return cachedReport;
}

export function getValidRagChunks(): RagChunk[] {
  const report = loadRagData();
  if (!report.ok) {
    const messages = report.issues
      .filter((issue) => issue.severity === "error")
      .slice(0, 5)
      .map((issue) => `line ${issue.line ?? "?"}: ${issue.message}`)
      .join("; ");
    throw new Error(`RAG data validation failed: ${messages}`);
  }
  return report.validChunks;
}
