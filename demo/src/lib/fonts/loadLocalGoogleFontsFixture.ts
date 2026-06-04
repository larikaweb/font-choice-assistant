import path from "node:path";
import { readFileSync } from "node:fs";
import type { GoogleFontFamily, GoogleFontsResponse } from "./types.js";

const FIXTURE_PATH = path.join(process.cwd(), "..", "visualizer", "fixtures", "google-fonts-sample.json");

let fixtureCache: GoogleFontFamily[] | null = null;

export function loadLocalGoogleFontsFixture(): GoogleFontFamily[] {
  if (fixtureCache) return fixtureCache;
  const raw = readFileSync(FIXTURE_PATH, "utf8");
  const parsed = JSON.parse(raw) as GoogleFontsResponse | GoogleFontFamily[];
  fixtureCache = Array.isArray(parsed) ? parsed : parsed.items;
  return fixtureCache;
}
