import type { GoogleFontFamily } from "./types.js";
import { normalizeFontName } from "./normalizeFontName.js";

export interface FontFamilyMatch {
  requestedFamily: string;
  matchedFamily: GoogleFontFamily | null;
  suggestions: string[];
}

function tokenOverlapScore(a: string, b: string): number {
  const aTokens = new Set(a.split(" ").filter(Boolean));
  const bTokens = new Set(b.split(" ").filter(Boolean));
  if (aTokens.size === 0 || bTokens.size === 0) return 0;

  let overlap = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) overlap += 1;
  }
  return overlap / Math.max(aTokens.size, bTokens.size);
}

export function matchFontFamily(requestedFamily: string, families: GoogleFontFamily[]): FontFamilyMatch {
  const normalizedRequest = normalizeFontName(requestedFamily);

  const exact = families.find((family) => normalizeFontName(family.family) === normalizedRequest);
  if (exact) {
    return { requestedFamily, matchedFamily: exact, suggestions: [] };
  }

  const suggestions = families
    .map((family) => ({ family: family.family, score: tokenOverlapScore(normalizedRequest, normalizeFontName(family.family)) }))
    .filter((item) => item.score >= 0.5)
    .sort((a, b) => b.score - a.score || a.family.localeCompare(b.family))
    .slice(0, 5)
    .map((item) => item.family);

  return { requestedFamily, matchedFamily: null, suggestions };
}
