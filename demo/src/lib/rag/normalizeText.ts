export function normalizeText(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[“”«»]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[^\p{L}\p{N}\s_+\-./#]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqueNormalizedTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const normalized = normalizeText(String(tag));
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}
