#!/usr/bin/env tsx
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadJsonlRecords } from "../../demo/src/lib/rag/loadChunks.js";
import { validateRecords } from "../../demo/src/lib/rag/validateChunk.js";
import { retrieveChunks } from "../../demo/src/lib/rag/retrieveChunks.js";
import { CHUNK_TYPES, type ChunkType } from "../../demo/src/lib/rag/types.js";

interface Args {
  query: string;
  dataPath: string;
  topK: number;
  types: ChunkType[];
  tags: string[];
  json: boolean;
  help: boolean;
}

function printUsage(): void {
  console.log(`Usage:\n  tsx rag/scripts/search.ts "query" [--topK 7] [--type font_perception] [--tag cyrillic] [--data path] [--json]\n\nExamples:\n  npm run rag:search -- "русский экспертный лендинг спокойный"\n  npm run rag:search -- "psychologist landing warm cyrillic" -- --topK 5 --type font_perception\n`);
}

function takeValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function takeAllValues(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function parseArgs(argv: string[]): Args {
  const help = argv.includes("--help") || argv.includes("-h");
  const json = argv.includes("--json");
  const dataPath = resolve(process.cwd(), takeValue(argv, "--data") ?? "rag/data/font_rag_full_local.jsonl");
  const topK = Number(takeValue(argv, "--topK") ?? 7);
  const types = takeAllValues(argv, "--type").filter((type): type is ChunkType =>
    CHUNK_TYPES.includes(type as ChunkType),
  );
  const tags = takeAllValues(argv, "--tag");

  const queryParts: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token) continue;
    if (token.startsWith("--")) {
      if (["--data", "--topK", "--type", "--tag"].includes(token)) index += 1;
      continue;
    }
    queryParts.push(token);
  }

  return {
    query: queryParts.join(" ").trim(),
    dataPath,
    topK: Number.isFinite(topK) && topK > 0 ? topK : 7,
    types,
    tags,
    json,
    help,
  };
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.query) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

if (!existsSync(args.dataPath)) {
  console.error(`RAG search failed.\n\nFile not found: ${args.dataPath}`);
  process.exit(1);
}

const loaded = loadJsonlRecords(args.dataPath);
const report = validateRecords(loaded.records, loaded.parseErrors, args.dataPath);

if (!report.ok) {
  console.error("RAG search failed because validation failed. Run rag:validate first.");
  process.exit(1);
}

const results = retrieveChunks({
  query: args.query,
  chunks: report.validChunks,
  topK: args.topK,
  chunkTypes: args.types,
  requiredTags: args.tags,
});

if (args.json) {
  console.log(JSON.stringify({ query: args.query, count: results.length, results }, null, 2));
  process.exit(0);
}

console.log(`Found ${results.length} chunks for:`);
console.log(`"${args.query}"\n`);

results.forEach((result, index) => {
  const chunk = result.chunk;
  const preview = chunk.content.length > 260 ? `${chunk.content.slice(0, 257).trimEnd()}...` : chunk.content;
  const title = typeof chunk.title === "string" ? ` — ${chunk.title}` : "";

  console.log(`${index + 1}. ${chunk.chunk_type}:${chunk.chunk_id}${title}`);
  console.log(`Score: ${result.score.toFixed(2)}`);
  console.log(`Tags: ${chunk.tags.join(", ")}`);
  console.log(`Preview: ${preview}`);
  console.log("");
});
