import type { PreviewText } from "../lib/fonts";

interface CyrillicCheckBlockProps {
  previewText: PreviewText;
  fontFamily?: string;
}

export function CyrillicCheckBlock({ previewText, fontFamily }: CyrillicCheckBlockProps) {
  if (
    previewText.cyrillicWords.length === 0 &&
    previewText.cyrillicLetters.length === 0 &&
    previewText.cyrillicCombinations.length === 0
  ) {
    return null;
  }

  const style = fontFamily ? { fontFamily: `'${fontFamily}', system-ui, sans-serif` } : undefined;

  return (
    <section aria-label="Cyrillic check" className="cyrillic-check-block" style={style}>
      <h3>Cyrillic check</h3>
      <p>{previewText.cyrillicWords.join(" · ")}</p>
      <p>{previewText.cyrillicLetters.join(" ")}</p>
      <p>{previewText.cyrillicCombinations.join(" · ")}</p>
    </section>
  );
}
