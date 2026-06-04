#!/usr/bin/env tsx
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadJsonlRecords } from "../../demo/src/lib/rag/loadChunks.js";
import { validateRecords } from "../../demo/src/lib/rag/validateChunk.js";
import { buildRagContext } from "../../demo/src/lib/rag/buildRagContext.js";

interface Args {
  userRequest: string;
  dataPath: string;
  topK: number;
  maxProcessingPrinciples: number;
  templatePath?: string;
  outPath?: string;
  json: boolean;
  help: boolean;
}

function printUsage(): void {
  console.log(`Usage:\n  tsx rag/scripts/build_context.ts "user request" [--topK 7] [--template prompts/prompt_template_with_rag_context.md] [--out tmp/rag_prompt.md] [--json]\n\nExamples:\n  npm run rag:context -- "сайт психолога на русском, мягко и доверительно"\n  npm run rag:context -- "expert landing page in Russian" -- --template prompts/prompt_template_with_rag_context.md --out tmp/prompt.md\n`);
}

function takeValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function parseArgs(argv: string[]): Args {
  const help = argv.includes("--help") || argv.includes("-h");
  const json = argv.includes("--json");
  const dataPath = resolve(process.cwd(), takeValue(argv, "--data") ?? "rag/data/font_rag_full_local.jsonl");
  const topK = Number(takeValue(argv, "--topK") ?? 7);
  const maxProcessingPrinciples = Number(takeValue(argv, "--maxProcessingPrinciples") ?? 3);
  const templateArg = takeValue(argv, "--template");
  const outArg = takeValue(argv, "--out");

  const requestParts: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token) continue;
    if (token.startsWith("--")) {
      if (["--data", "--topK", "--maxProcessingPrinciples", "--template", "--out"].includes(token)) index += 1;
      continue;
    }
    requestParts.push(token);
  }

  return {
    userRequest: requestParts.join(" ").trim(),
    dataPath,
    topK: Number.isFinite(topK) && topK > 0 ? topK : 7,
    maxProcessingPrinciples: Number.isFinite(maxProcessingPrinciples) && maxProcessingPrinciples >= 0 ? maxProcessingPrinciples : 3,
    templatePath: templateArg ? resolve(process.cwd(), templateArg) : undefined,
    outPath: outArg ? resolve(process.cwd(), outArg) : undefined,
    json,
    help,
  };
}

function fillTemplate(template: string, replacements: Record<string, string>): string {
  return template.replace(/{{\s*([A-Z0-9_]+)\s*}}/g, (_match, key: string) => replacements[key] ?? "");
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.userRequest) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

if (!existsSync(args.dataPath)) {
  console.error(`RAG context build failed.\n\nFile not found: ${args.dataPath}`);
  process.exit(1);
}

const loaded = loadJsonlRecords(args.dataPath);
const report = validateRecords(loaded.records, loaded.parseErrors, args.dataPath);

if (!report.ok) {
  console.error("RAG context build failed because validation failed. Run rag:validate first.");
  process.exit(1);
}

const built = buildRagContext({
  userRequest: args.userRequest,
  chunks: report.validChunks,
  topK: args.topK,
  maxProcessingPrinciples: args.maxProcessingPrinciples,
});

let output = built.context;

if (args.templatePath) {
  if (!existsSync(args.templatePath)) {
    console.error(`Template not found: ${args.templatePath}`);
    process.exit(1);
  }

  const template = readFileSync(args.templatePath, "utf8");
  output = fillTemplate(template, {
    RETRIEVED_CONTEXT: built.context,
    USER_REQUEST: args.userRequest,
    PROJECT_TYPE: "",
    DESIRED_IMPRESSION: "",
    TEXT_ROLES: "",
    PLATFORM_OR_FORMAT: "",
    LANGUAGE: "",
    CONSTRAINTS: "",
  });
}

if (args.json) {
  console.log(JSON.stringify({ request: args.userRequest, ...built, output }, null, 2));
  process.exit(0);
}

if (args.outPath) {
  mkdirSync(dirname(args.outPath), { recursive: true });
  writeFileSync(args.outPath, output, "utf8");
  console.log(`RAG context written to: ${args.outPath}`);
  console.log(`Selected chunks: ${built.selectedIds.join(", ")}`);
} else {
  console.log(output);
}
