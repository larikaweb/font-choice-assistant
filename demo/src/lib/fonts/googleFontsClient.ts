import type { GoogleFontFamily, GoogleFontsResponse } from "./types.js";

const GOOGLE_FONTS_ENDPOINT = "https://www.googleapis.com/webfonts/v1/webfonts";

let memoryCache: GoogleFontFamily[] | null = null;

export interface FetchGoogleFontsOptions {
  apiKey: string;
  capabilities?: string[];
  sort?: "alpha" | "date" | "popularity" | "style" | "trending";
  fetchImpl?: typeof fetch;
}

export async function fetchGoogleFontsMetadata({
  apiKey,
  capabilities = ["VF", "WOFF2", "FAMILY_TAGS"],
  sort = "alpha",
  fetchImpl = fetch,
}: FetchGoogleFontsOptions): Promise<GoogleFontFamily[]> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("GOOGLE_FONTS_API_KEY is required when metadata is not provided locally.");
  }

  const url = new URL(GOOGLE_FONTS_ENDPOINT);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("sort", sort);
  for (const capability of capabilities) {
    url.searchParams.append("capability", capability);
  }

  const response = await fetchImpl(url.toString());
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Google Fonts metadata request failed: ${response.status} ${response.statusText} ${body}`.trim());
  }

  const data = (await response.json()) as GoogleFontsResponse;
  if (!Array.isArray(data.items)) {
    throw new Error("Google Fonts metadata response does not contain an items array.");
  }

  return data.items;
}

export async function getGoogleFontsMetadataCached(options: FetchGoogleFontsOptions): Promise<GoogleFontFamily[]> {
  if (memoryCache) {
    return memoryCache;
  }
  memoryCache = await fetchGoogleFontsMetadata(options);
  return memoryCache;
}

export function clearGoogleFontsMetadataCache(): void {
  memoryCache = null;
}
