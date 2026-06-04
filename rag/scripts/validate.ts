#!/usr/bin/env tsx
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadJsonlRecords } from "../../demo/src/lib/rag/loadChunks.js";
import { validateRecords } from "../../demo/src/lib/rag/validateChunk.js";

function printUsage(): void {
  console.log(`Usage:\n  tsx rag/scripts/validate.ts [path/to/font_rag_full_local.jsonl] [--json]\n`);
}

function parseArgs(argv: string[]): { filePath: string; json: boolean; help: boolean } {
  const args = [...argv];
  const json = args.includes("--json");
  const help = args.includes("--help") || args.includes("-h");
  const fileArg = args.find((arg) => !arg.startsWith("--"));

  return {
    filePath: resolve(process.cwd(), fileArg ?? "rag/data/font_rag_full_local.jsonl"),
    json,
    help,
  };
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printUsage();
  process.exit(0);
}

if (!existsSync(args.filePath)) {
  console.error(`RAG validation failed.\n\nFile not found: ${args.filePath}`);
  process.exit(1);
}

const loaded = loadJsonlRecords(args.filePath);
const report = validateRecords(loaded.records, loaded.parseErrors, args.filePath);

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

if (report.ok) {
  console.log("RAG validation passed.\n");
} else {
  console.log("RAG validation failed.\n");
}

console.log(`File: ${args.filePath}`);
console.log(`Records: ${report.totalRecords}`);
console.log(`Valid chunks: ${report.validChunks.length}`);
console.log("");
console.log("By type:");
for (const [type, count] of Object.entries(report.countsByType).sort()) {
  console.log(`- ${type}: ${count}`);
}

const errors = report.issues.filter((issue) => issue.severity === "error");
const warnings = report.issues.filter((issue) => issue.severity === "warning");
console.log("");
console.log("Safety:");
console.log(`- public_safe true: ${report.validChunks.filter((chunk) => chunk.public_safe === true).length}/${report.validChunks.length}`);
console.log(`- errors: ${errors.length}`);
console.log(`- warnings: ${warnings.length}`);

if (report.issues.length > 0) {
  console.log("\nIssues:");
  for (const item of report.issues) {
    const location = item.line ? `Line ${item.line}` : "File";
    const id = item.chunk_id ? ` (${item.chunk_id})` : "";
    console.log(`- [${item.severity}] ${location}${id}: ${item.message}`);
  }
}

process.exit(report.ok ? 0 : 1);
