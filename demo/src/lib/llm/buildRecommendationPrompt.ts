import { readFileSync } from "node:fs";
import path from "node:path";
import type { RecommendationRequestInput } from "./types";

const TEMPLATE_PATH = path.join(process.cwd(), "..", "prompts", "prompt_template_with_rag_context.md");

let cachedTemplate: string | null = null;

function template(): string {
  if (cachedTemplate) return cachedTemplate;
  const loaded = readFileSync(TEMPLATE_PATH, "utf8");
  cachedTemplate = loaded;
  return loaded;
}

function fill(value: string | undefined, fallback = "not specified"): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function buildRecommendationPrompt(input: RecommendationRequestInput, retrievedContext: string): string {
  const filled = template()
    .replaceAll("{{RETRIEVED_CONTEXT}}", retrievedContext)
    .replaceAll("{{USER_REQUEST}}", fill(input.userRequest, ""))
    .replaceAll("{{PROJECT_TYPE}}", fill(input.projectType))
    .replaceAll("{{DESIRED_IMPRESSION}}", fill(input.desiredImpression))
    .replaceAll("{{TEXT_ROLES}}", fill(input.textRoles))
    .replaceAll("{{LANGUAGE}}", fill(input.language))
    .replaceAll("{{PLATFORM_OR_FORMAT}}", fill(input.platformOrFormat))
    .replaceAll("{{CONSTRAINTS}}", fill(input.constraints));

  return `${filled}

## Machine-readable output requirement

After the user-facing recommendation, include exactly one fenced JSON block with this shape:

\`\`\`json
{
  "font_system": {
    "headingFont": "Lora",
    "bodyFont": "Manrope",
    "buttonFont": "Manrope",
    "captionFont": "Manrope",
    "quoteFont": "Lora",
    "labelFont": "Manrope",
    "language": "ru",
    "weights": {
      "heading": [600, 700],
      "body": [400, 500],
      "button": [600],
      "caption": [400],
      "quote": [400],
      "label": [500]
    },
    "roles": {
      "heading": "expressive heading accent",
      "body": "readable body text",
      "button": "clear action label"
    }
  }
}
\`\`\`

Use real recommended fonts in the JSON. Keep the JSON valid. Do not include comments inside the JSON.`;
}
