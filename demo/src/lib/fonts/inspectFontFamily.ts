import type { FontInspection, GoogleFontFamily, RecommendedFont } from "./types.js";
import { matchFontFamily } from "./matchFontFamily.js";
import { resolveFontWeights } from "./resolveFontWeights.js";

export function inspectFontFamily(
  recommendedFont: RecommendedFont,
  families: GoogleFontFamily[],
  language: string = "auto"
): FontInspection {
  const match = matchFontFamily(recommendedFont.family, families);
  const warnings: string[] = [];

  if (!match.matchedFamily) {
    warnings.push(`Font not found in Google Fonts metadata: ${recommendedFont.family}.`);
    if (match.suggestions.length > 0) {
      warnings.push(`Possible matches: ${match.suggestions.join(", ")}.`);
    }

    return {
      requestedFamily: recommendedFont.family,
      matchedFamily: null,
      role: recommendedFont.role,
      supportsCyrillic: false,
      supportsCyrillicExt: false,
      availableSubsets: [],
      availableVariants: [],
      availableAxes: [],
      requestedWeights: recommendedFont.weights ?? [],
      resolvedWeights: [],
      missingWeights: recommendedFont.weights ?? [],
      isVariableWeight: false,
      warnings,
      suggestions: match.suggestions,
    };
  }

  const family = match.matchedFamily;
  const supportsCyrillic = family.subsets.includes("cyrillic") || family.subsets.includes("cyrillic-ext");
  const supportsCyrillicExt = family.subsets.includes("cyrillic-ext");
  const weightResolution = resolveFontWeights(family, recommendedFont.role, recommendedFont.weights);
  const availableAxes = family.axes?.map((axis) => axis.tag) ?? [];

  if ((language === "ru" || language === "auto") && !supportsCyrillic) {
    warnings.push(`${family.family} does not list Cyrillic support in Google Fonts metadata.`);
  }

  if (weightResolution.resolvedWeights.length === 0) {
    warnings.push(`${family.family} has no resolved requested weights for role "${recommendedFont.role}".`);
  }

  if (weightResolution.missingWeights.length > 0) {
    warnings.push(`${family.family} is missing requested weights: ${weightResolution.missingWeights.join(", ")}.`);
  }

  return {
    requestedFamily: recommendedFont.family,
    matchedFamily: family.family,
    role: recommendedFont.role,
    category: family.category,
    supportsCyrillic,
    supportsCyrillicExt,
    availableSubsets: family.subsets,
    availableVariants: family.variants,
    availableAxes,
    requestedWeights: weightResolution.requestedWeights,
    resolvedWeights: weightResolution.resolvedWeights,
    missingWeights: weightResolution.missingWeights,
    isVariableWeight: weightResolution.isVariableWeight,
    warnings,
    suggestions: [],
  };
}
