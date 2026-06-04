import type { FontInspection } from "./types.js";
import { encodeGoogleFontFamilyName } from "./normalizeFontName.js";

const CSS2_ENDPOINT = "https://fonts.googleapis.com/css2";

export interface BuildCss2UrlOptions {
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  text?: string;
}

function uniqueSortedNumbers(values: number[]): number[] {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

export function buildCss2Url(inspections: FontInspection[], options: BuildCss2UrlOptions = {}): string | null {
  const display = options.display ?? "swap";
  const familyWeights = new Map<string, number[]>();

  for (const inspection of inspections) {
    if (!inspection.matchedFamily) continue;
    const existing = familyWeights.get(inspection.matchedFamily) ?? [];
    familyWeights.set(inspection.matchedFamily, [...existing, ...inspection.resolvedWeights]);
  }

  if (familyWeights.size === 0) return null;

  const params: string[] = [];
  for (const [family, weights] of Array.from(familyWeights.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const encodedFamily = encodeGoogleFontFamilyName(family);
    const uniqueWeights = uniqueSortedNumbers(weights);

    if (uniqueWeights.length > 0) {
      params.push(`family=${encodedFamily}:wght@${uniqueWeights.join(";")}`);
    } else {
      params.push(`family=${encodedFamily}`);
    }
  }

  params.push(`display=${encodeURIComponent(display)}`);
  if (options.text && options.text.trim().length > 0) {
    params.push(`text=${encodeURIComponent(options.text)}`);
  }

  return `${CSS2_ENDPOINT}?${params.join("&")}`;
}
