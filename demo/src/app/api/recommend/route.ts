import { NextResponse } from "next/server";
import { buildRagContext, getValidRagChunks } from "@/lib/rag";
import { buildFontPreview, loadLocalGoogleFontsFixture } from "@/lib/fonts";
import {
  buildRecommendationPrompt,
  generateRecommendationText,
  parseFontSystem,
  recommendedFontsFromSystem,
  stripMachineJson,
  type RecommendationRequestInput,
} from "@/lib/llm";
import { env } from "@/lib/config/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendationRequestInput;
    const userRequest = body.userRequest?.trim();

    if (!userRequest) {
      return NextResponse.json({ error: "userRequest is required" }, { status: 400 });
    }

    const chunks = getValidRagChunks();
    const ragContext = buildRagContext({
      userRequest,
      chunks,
      topK: 7,
      maxProcessingPrinciples: 3,
      maxCharsPerChunk: 900,
    });

    const prompt = buildRecommendationPrompt(
      {
        ...body,
        userRequest,
        language: body.language ?? (env.defaultLanguage === "en" ? "en" : "ru"),
      },
      ragContext.context,
    );

    const generated = await generateRecommendationText(prompt);
    const fontSystem = parseFontSystem(generated.text, body.language ?? "ru");
    const recommendedFonts = recommendedFontsFromSystem(fontSystem);
    const useFixture = !env.googleFontsApiKey;

    const preview = await buildFontPreview({
      recommendedFonts,
      language: fontSystem.language ?? body.language ?? "ru",
      apiKey: env.googleFontsApiKey,
      metadata: useFixture ? loadLocalGoogleFontsFixture() : undefined,
    });

    return NextResponse.json({
      recommendation: stripMachineJson(generated.text),
      fontSystem,
      recommendedFonts,
      rag: {
        query: userRequest,
        contextMarkdown: ragContext.context,
        chunks: ragContext.selected,
        countsByType: ragContext.countsByType,
      },
      preview,
      warnings: preview.warnings,
      usedMockLlm: generated.usedMock,
      usedFixtureMetadata: useFixture,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown recommendation error" },
      { status: 500 },
    );
  }
}
