import type { RetrievedChunk } from "@/lib/rag";
import type { FontPreviewConfig, RecommendedFont } from "@/lib/fonts";

export type DemoLanguage = "ru" | "en" | "auto";

export interface RecommendationRequestInput {
  userRequest: string;
  projectType?: string;
  desiredImpression?: string;
  textRoles?: string;
  language?: DemoLanguage;
  platformOrFormat?: string;
  constraints?: string;
  showRagContext?: boolean;
}

export interface FontSystemJson {
  headingFont?: string;
  bodyFont?: string;
  buttonFont?: string;
  captionFont?: string;
  quoteFont?: string;
  labelFont?: string;
  language?: DemoLanguage;
  weights?: Partial<Record<"heading" | "body" | "button" | "caption" | "quote" | "label", number[]>>;
  roles?: Partial<Record<"heading" | "body" | "button" | "caption" | "quote" | "label", string>>;
}

export interface RecommendationPayload {
  recommendation: string;
  fontSystem: FontSystemJson;
  recommendedFonts: RecommendedFont[];
  rag: {
    query: string;
    contextMarkdown: string;
    chunks: RetrievedChunk[];
  };
  preview: FontPreviewConfig;
  warnings: string[];
  usedMockLlm: boolean;
}
