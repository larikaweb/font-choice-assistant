export type FontRole = "heading" | "body" | "button" | "caption" | "quote" | "label";

export type PreviewLanguage = "ru" | "en" | "auto";

export type GoogleFontCategory = "serif" | "sans-serif" | "display" | "handwriting" | "monospace";

export interface RecommendedFont {
  family: string;
  role: FontRole;
  weights?: number[];
  italic?: boolean;
}

export interface GoogleFontAxis {
  tag: string;
  start: number;
  end: number;
}

export interface GoogleFontTag {
  name?: string;
  tag?: string;
  weight?: number;
}

export interface GoogleFontFamily {
  family: string;
  variants: string[];
  subsets: string[];
  category: GoogleFontCategory;
  files?: Record<string, string>;
  axes?: GoogleFontAxis[];
  tags?: GoogleFontTag[];
  version?: string;
  lastModified?: string;
  kind?: string;
  menu?: string;
}

export interface GoogleFontsResponse {
  kind?: string;
  items: GoogleFontFamily[];
}

export interface FontWeightResolution {
  requestedWeights: number[];
  resolvedWeights: number[];
  missingWeights: number[];
  isVariableWeight: boolean;
  weightAxis?: GoogleFontAxis;
}

export interface FontInspection {
  requestedFamily: string;
  matchedFamily: string | null;
  role: FontRole;
  category?: GoogleFontCategory;
  supportsCyrillic: boolean;
  supportsCyrillicExt: boolean;
  availableSubsets: string[];
  availableVariants: string[];
  availableAxes: string[];
  requestedWeights: number[];
  resolvedWeights: number[];
  missingWeights: number[];
  isVariableWeight: boolean;
  warnings: string[];
  suggestions: string[];
}

export interface PreviewText {
  heading: string;
  body: string;
  button: string;
  caption: string;
  quote: string;
  label: string;
  cyrillicWords: string[];
  cyrillicLetters: string[];
  cyrillicCombinations: string[];
}

export interface FontPreviewConfig {
  cssUrl: string | null;
  fonts: FontInspection[];
  previewText: PreviewText;
  warnings: string[];
}

export interface BuildFontPreviewInput {
  recommendedFonts: RecommendedFont[];
  language?: PreviewLanguage;
  apiKey?: string;
  metadata?: GoogleFontFamily[];
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
}
