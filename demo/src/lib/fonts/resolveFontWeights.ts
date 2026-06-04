import type { FontRole, FontWeightResolution, GoogleFontAxis, GoogleFontFamily } from "./types.js";

const DEFAULT_WEIGHTS_BY_ROLE: Record<FontRole, number[]> = {
  heading: [600, 700],
  body: [400, 500],
  button: [600],
  caption: [400, 500],
  quote: [400, 500],
  label: [400, 500],
};

export function getDefaultWeightsForRole(role: FontRole): number[] {
  return DEFAULT_WEIGHTS_BY_ROLE[role] ?? [400];
}

function parseVariantWeight(variant: string): number | null {
  if (variant === "regular" || variant === "italic") return 400;
  const cleaned = variant.replace("italic", "");
  const weight = Number.parseInt(cleaned, 10);
  return Number.isFinite(weight) ? weight : null;
}

function getStaticWeights(family: GoogleFontFamily): number[] {
  return Array.from(
    new Set(
      family.variants
        .map(parseVariantWeight)
        .filter((weight): weight is number => weight !== null)
    )
  ).sort((a, b) => a - b);
}

function getWeightAxis(family: GoogleFontFamily): GoogleFontAxis | undefined {
  return family.axes?.find((axis) => axis.tag === "wght");
}

export function resolveFontWeights(
  family: GoogleFontFamily,
  role: FontRole,
  requestedWeights?: number[]
): FontWeightResolution {
  const weights = Array.from(new Set((requestedWeights?.length ? requestedWeights : getDefaultWeightsForRole(role)).map(Number)))
    .filter((weight) => Number.isFinite(weight) && weight >= 1)
    .sort((a, b) => a - b);

  const weightAxis = getWeightAxis(family);
  if (weightAxis) {
    const resolvedWeights = weights.filter((weight) => weight >= weightAxis.start && weight <= weightAxis.end);
    const missingWeights = weights.filter((weight) => weight < weightAxis.start || weight > weightAxis.end);
    return {
      requestedWeights: weights,
      resolvedWeights,
      missingWeights,
      isVariableWeight: true,
      weightAxis,
    };
  }

  const availableWeights = getStaticWeights(family);
  const resolvedWeights = weights.filter((weight) => availableWeights.includes(weight));
  const missingWeights = weights.filter((weight) => !availableWeights.includes(weight));

  return {
    requestedWeights: weights,
    resolvedWeights,
    missingWeights,
    isVariableWeight: false,
  };
}
