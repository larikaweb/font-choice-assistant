import type { FontRole, RecommendedFont } from "@/lib/fonts";
import type { DemoLanguage, FontSystemJson } from "./types";

type FontFamilyField = "headingFont" | "bodyFont" | "buttonFont" | "captionFont" | "quoteFont" | "labelFont";

const ROLE_TO_FIELD: Record<FontRole, FontFamilyField> = {
  heading: "headingFont",
  body: "bodyFont",
  button: "buttonFont",
  caption: "captionFont",
  quote: "quoteFont",
  label: "labelFont",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonBlock(text: string): unknown | null {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const rawJson = fenced?.[1] ?? null;
  if (!rawJson) return null;

  try {
    return JSON.parse(rawJson);
  } catch {
    return null;
  }
}

function stringField(record: Record<string, unknown>, key: string): string | undefined {
  return typeof record[key] === "string" && record[key].trim() ? record[key].trim() : undefined;
}

function weightsField(record: Record<string, unknown>): FontSystemJson["weights"] {
  if (!isRecord(record.weights)) return undefined;
  const weights: NonNullable<FontSystemJson["weights"]> = {};

  for (const role of Object.keys(ROLE_TO_FIELD) as FontRole[]) {
    const value = record.weights[role];
    if (Array.isArray(value)) {
      const numeric = value.map(Number).filter((item) => Number.isFinite(item));
      if (numeric.length > 0) weights[role] = numeric;
    }
  }

  return Object.keys(weights).length > 0 ? weights : undefined;
}

function rolesField(record: Record<string, unknown>): FontSystemJson["roles"] {
  if (!isRecord(record.roles)) return undefined;
  const roles: NonNullable<FontSystemJson["roles"]> = {};

  for (const role of Object.keys(ROLE_TO_FIELD) as FontRole[]) {
    const value = record.roles[role];
    if (typeof value === "string" && value.trim()) roles[role] = value.trim();
  }

  return Object.keys(roles).length > 0 ? roles : undefined;
}

export function parseFontSystem(text: string, fallbackLanguage: DemoLanguage = "ru"): FontSystemJson {
  const parsed = parseJsonBlock(text);
  const root = isRecord(parsed) && isRecord(parsed.font_system) ? parsed.font_system : parsed;

  if (!isRecord(root)) {
    return {
      headingFont: "Lora",
      bodyFont: "Manrope",
      buttonFont: "Manrope",
      language: fallbackLanguage,
      weights: {
        heading: [600, 700],
        body: [400, 500],
        button: [600],
      },
    };
  }

  const language = ["ru", "en", "auto"].includes(String(root.language))
    ? (String(root.language) as DemoLanguage)
    : fallbackLanguage;

  return {
    headingFont: stringField(root, "headingFont"),
    bodyFont: stringField(root, "bodyFont"),
    buttonFont: stringField(root, "buttonFont"),
    captionFont: stringField(root, "captionFont"),
    quoteFont: stringField(root, "quoteFont"),
    labelFont: stringField(root, "labelFont"),
    language,
    weights: weightsField(root),
    roles: rolesField(root),
  };
}

export function recommendedFontsFromSystem(system: FontSystemJson): RecommendedFont[] {
  const result: RecommendedFont[] = [];

  for (const role of Object.keys(ROLE_TO_FIELD) as FontRole[]) {
    const field = ROLE_TO_FIELD[role];
    const family = system[field];
    if (!family) continue;
    result.push({
      family,
      role,
      weights: system.weights?.[role],
    });
  }

  if (result.length === 0) {
    result.push(
      { family: "Lora", role: "heading", weights: [600, 700] },
      { family: "Manrope", role: "body", weights: [400, 500] },
      { family: "Manrope", role: "button", weights: [600] },
    );
  }

  return result;
}

export function stripMachineJson(text: string): string {
  return text.replace(/```json\s*[\s\S]*?```/gi, "").trim();
}
