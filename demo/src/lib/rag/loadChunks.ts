import { readFileSync } from "node:fs";
import type { ParseError } from "./types.js";

export interface LoadedJsonlRecords {
  records: Array<{ value: unknown; line: number }>;
  parseErrors: ParseError[];
}

export function loadJsonlRecords(filePath: string): LoadedJsonlRecords {
  const raw = readFileSync(filePath, "utf8");
  const records: Array<{ value: unknown; line: number }> = [];
  const parseErrors: ParseError[] = [];

  raw.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      records.push({ value: JSON.parse(trimmed), line: lineNumber });
    } catch (error) {
      parseErrors.push({
        line: lineNumber,
        message: error instanceof Error ? error.message : "Invalid JSON",
        raw: line,
      });
    }
  });

  return { records, parseErrors };
}
