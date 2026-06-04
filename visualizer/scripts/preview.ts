#!/usr/bin/env tsx
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { GoogleFontFamily, GoogleFontsResponse, PreviewLanguage, RecommendedFont } from "../../demo/src/lib/fonts/types.js";
import { buildFontPreview } from "../../demo/src/lib/fonts/buildFontPreview.js";

interface CliOptions {
  heading?: string;
  body?: string;
  button?: string;
  lang: PreviewLanguage;
  weightsHeading?: number[];
  weightsBody?: number[];
  weightsButton?: number[];
  metadata?: string;
  json: boolean;
}

function printHelp(): void {
  console.log(`Google Fonts visualizer preview

Usage:
  npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru
  npm run fonts:preview -- --heading "Lora" --body "Manrope" --metadata visualizer/fixtures/google-fonts-sample.json

Options:
  --heading <family>           Heading font family
  --body <family>              Body font family
  --button <family>            Button font family, defaults to body in UI
  --lang <ru|en|auto>          Preview language, default: ru
  --weights-heading <list>     Comma-separated weights, e.g. 600,700
  --weights-body <list>        Comma-separated weights, e.g. 400,500
  --weights-button <list>      Comma-separated weights, e.g. 600
  --metadata <path>            Local Google Fonts metadata JSON fixture
  --json                       Print full JSON config
  --help                       Show help

Environment:
  GOOGLE_FONTS_API_KEY         Used when --metadata is not provided. If no key is set, the script falls back to visualizer/fixtures/google-fonts-sample.json when available.
`);
}

function parseWeightList(value: string | undefined): number[] | undefined {
  if (!value) return undefined;
  const weights = value
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((weight) => Number.isFinite(weight));
  return weights.length > 0 ? weights : undefined;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { lang: "ru", json: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case "--heading":
        options.heading = next;
        i += 1;
        break;
      case "--body":
        options.body = next;
        i += 1;
        break;
      case "--button":
        options.button = next;
        i += 1;
        break;
      case "--lang":
        if (next === "ru" || next === "en" || next === "auto") {
          options.lang = next;
        } else {
          throw new Error("--lang must be ru, en, or auto.");
        }
        i += 1;
        break;
      case "--weights-heading":
        options.weightsHeading = parseWeightList(next);
        i += 1;
        break;
      case "--weights-body":
        options.weightsBody = parseWeightList(next);
        i += 1;
        break;
      case "--weights-button":
        options.weightsButton = parseWeightList(next);
        i += 1;
        break;
      case "--metadata":
        options.metadata = next;
        i += 1;
        break;
      case "--json":
        options.json = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}


function resolveDefaultFixturePath(): string | undefined {
  const candidates = [
    resolve(process.cwd(), "visualizer/fixtures/google-fonts-sample.json"),
    resolve(process.cwd(), "../visualizer/fixtures/google-fonts-sample.json"),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

async function loadMetadata(path: string): Promise<GoogleFontFamily[]> {
  const raw = await readFile(resolve(path), "utf8");
  const parsed = JSON.parse(raw) as GoogleFontsResponse | GoogleFontFamily[];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.items)) return parsed.items;
  throw new Error(`Metadata file does not contain an items array: ${path}`);
}

function buildRecommendedFonts(options: CliOptions): RecommendedFont[] {
  const fonts: RecommendedFont[] = [];
  if (options.heading) {
    fonts.push({ family: options.heading, role: "heading", weights: options.weightsHeading });
  }
  if (options.body) {
    fonts.push({ family: options.body, role: "body", weights: options.weightsBody });
  }
  if (options.button) {
    fonts.push({ family: options.button, role: "button", weights: options.weightsButton });
  }
  return fonts;
}

function printTextReport(config: Awaited<ReturnType<typeof buildFontPreview>>): void {
  console.log("Font preview config generated.\n");
  console.log("CSS:");
  console.log(config.cssUrl ?? "No CSS URL generated.");
  console.log("\nFonts:");

  for (const font of config.fonts) {
    const family = font.matchedFamily ?? `${font.requestedFamily} (not found)`;
    const cyrillic = font.supportsCyrillic ? "yes" : "no";
    const weights = font.resolvedWeights.length > 0 ? font.resolvedWeights.join(", ") : "none";
    const variable = font.isVariableWeight ? "variable" : "static";
    console.log(`- ${family} / ${font.role} / ${font.category ?? "unknown"} / Cyrillic: ${cyrillic} / weights: ${weights} / ${variable}`);
  }

  console.log("\nPreview text:");
  console.log(`Heading: ${config.previewText.heading}`);
  console.log(`Body: ${config.previewText.body}`);
  if (config.previewText.cyrillicLetters.length > 0) {
    console.log(`Check: ${config.previewText.cyrillicLetters.join(" ")} / ${config.previewText.cyrillicCombinations.join(" ")}`);
  }

  if (config.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of config.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const recommendedFonts = buildRecommendedFonts(options);

  if (recommendedFonts.length === 0) {
    throw new Error("Provide at least --heading or --body.");
  }

  const metadataPath = options.metadata ?? (!process.env.GOOGLE_FONTS_API_KEY ? resolveDefaultFixturePath() : undefined);
  const metadata = metadataPath ? await loadMetadata(metadataPath) : undefined;
  const config = await buildFontPreview({
    recommendedFonts,
    language: options.lang,
    apiKey: process.env.GOOGLE_FONTS_API_KEY,
    metadata,
  });

  if (options.json) {
    console.log(JSON.stringify(config, null, 2));
  } else {
    printTextReport(config);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
