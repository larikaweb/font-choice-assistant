export function normalizeFontName(value: string): string {
  return value
    .replace(/\+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function encodeGoogleFontFamilyName(value: string): string {
  return value.trim().replace(/\s+/g, "+");
}
