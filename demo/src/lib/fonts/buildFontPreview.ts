import type { BuildFontPreviewInput, FontPreviewConfig, GoogleFontFamily } from "./types.js";
import { getGoogleFontsMetadataCached } from "./googleFontsClient.js";
import { inspectFontFamily } from "./inspectFontFamily.js";
import { buildCss2Url } from "./buildCss2Url.js";
import { buildPreviewText } from "./buildPreviewText.js";

function dedupeRecommendedFonts(input: BuildFontPreviewInput["recommendedFonts"]): BuildFontPreviewInput["recommendedFonts"] {
  const seen = new Set<string>();
  const result: BuildFontPreviewInput["recommendedFonts"] = [];

  for (const font of input) {
    const key = `${font.family.trim().toLowerCase()}::${font.role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(font);
  }

  return result;
}

async function resolveMetadata(input: BuildFontPreviewInput): Promise<GoogleFontFamily[]> {
  if (input.metadata) return input.metadata;
  return getGoogleFontsMetadataCached({ apiKey: input.apiKey ?? "" });
}

export async function buildFontPreview(input: BuildFontPreviewInput): Promise<FontPreviewConfig> {
  const language = input.language ?? "auto";
  const recommendedFonts = dedupeRecommendedFonts(input.recommendedFonts);
  const metadata = await resolveMetadata(input);

  const fonts = recommendedFonts.map((recommendedFont) => inspectFontFamily(recommendedFont, metadata, language));
  const cssUrl = buildCss2Url(fonts, { display: input.display ?? "swap" });
  const previewText = buildPreviewText(language);
  const warnings = fonts.flatMap((font) => font.warnings);

  if (!cssUrl) {
    warnings.push("No CSS2 URL could be generated because no requested font family was matched.");
  }

  return {
    cssUrl,
    fonts,
    previewText,
    warnings,
  };
}
