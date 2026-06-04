import type { FontInspection, FontPreviewConfig, FontRole } from "../lib/fonts";
import { CyrillicCheckBlock } from "./CyrillicCheckBlock";
import { FontWarningList } from "./FontWarningList";

interface FontPreviewProps {
  config: FontPreviewConfig;
}

function fontForRole(fonts: FontInspection[], role: FontRole): FontInspection | undefined {
  return fonts.find((font) => font.role === role && font.matchedFamily);
}

function fontFamilyCss(font?: FontInspection, fallback = "system-ui, sans-serif") {
  return font?.matchedFamily ? `'${font.matchedFamily}', ${fallback}` : fallback;
}

function firstResolvedWeight(font: FontInspection | undefined, fallback: number): number {
  return font?.resolvedWeights[0] ?? fallback;
}

export function FontPreview({ config }: FontPreviewProps) {
  const headingFont = fontForRole(config.fonts, "heading");
  const bodyFont = fontForRole(config.fonts, "body");
  const buttonFont = fontForRole(config.fonts, "button") ?? bodyFont;
  const captionFont = fontForRole(config.fonts, "caption") ?? bodyFont;
  const quoteFont = fontForRole(config.fonts, "quote") ?? headingFont ?? bodyFont;
  const labelFont = fontForRole(config.fonts, "label") ?? bodyFont;

  return (
    <section aria-label="Font preview" className="font-preview">
      {config.cssUrl ? <link rel="stylesheet" href={config.cssUrl} /> : null}

      <div className="font-preview-card">
        <p
          className="font-preview-label"
          style={{
            fontFamily: fontFamilyCss(labelFont),
            fontWeight: firstResolvedWeight(labelFont, 500),
          }}
        >
          {config.previewText.label}
        </p>

        <h2
          style={{
            fontFamily: fontFamilyCss(headingFont, "Georgia, serif"),
            fontWeight: firstResolvedWeight(headingFont, 700),
          }}
        >
          {config.previewText.heading}
        </h2>

        <p
          style={{
            fontFamily: fontFamilyCss(bodyFont),
            fontWeight: firstResolvedWeight(bodyFont, 400),
          }}
        >
          {config.previewText.body}
        </p>

        <blockquote
          style={{
            fontFamily: fontFamilyCss(quoteFont, "Georgia, serif"),
            fontWeight: firstResolvedWeight(quoteFont, 400),
          }}
        >
          {config.previewText.quote}
        </blockquote>

        <button
          type="button"
          style={{
            fontFamily: fontFamilyCss(buttonFont),
            fontWeight: firstResolvedWeight(buttonFont, 600),
          }}
        >
          {config.previewText.button}
        </button>

        <p
          className="font-preview-caption"
          style={{
            fontFamily: fontFamilyCss(captionFont),
            fontWeight: firstResolvedWeight(captionFont, 400),
          }}
        >
          {config.previewText.caption}
        </p>
      </div>

      <CyrillicCheckBlock previewText={config.previewText} fontFamily={bodyFont?.matchedFamily ?? undefined} />
      <FontWarningList warnings={config.warnings} />
    </section>
  );
}
