import { NextResponse } from "next/server";
import { buildFontPreview, loadLocalGoogleFontsFixture, type PreviewLanguage, type RecommendedFont } from "@/lib/fonts";
import { env } from "@/lib/config/env";

export const runtime = "nodejs";

interface PreviewRequestBody {
  headingFont?: string;
  bodyFont?: string;
  buttonFont?: string;
  quoteFont?: string;
  captionFont?: string;
  labelFont?: string;
  language?: PreviewLanguage;
}

function recommendedFontsFromBody(body: PreviewRequestBody): RecommendedFont[] {
  const bodyFamily = body.bodyFont?.trim() || "Manrope";
  const headingFamily = body.headingFont?.trim() || bodyFamily;
  return [
    { family: headingFamily, role: "heading", weights: [600, 700] },
    { family: bodyFamily, role: "body", weights: [400, 500] },
    { family: body.buttonFont?.trim() || bodyFamily, role: "button", weights: [600] },
    { family: body.quoteFont?.trim() || headingFamily, role: "quote", weights: [400] },
    { family: body.captionFont?.trim() || bodyFamily, role: "caption", weights: [400] },
    { family: body.labelFont?.trim() || bodyFamily, role: "label", weights: [500] },
  ];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PreviewRequestBody;
    const useFixture = !env.googleFontsApiKey;
    const preview = await buildFontPreview({
      recommendedFonts: recommendedFontsFromBody(body),
      language: body.language ?? "ru",
      apiKey: env.googleFontsApiKey,
      metadata: useFixture ? loadLocalGoogleFontsFixture() : undefined,
    });

    return NextResponse.json({
      preview,
      usedFixtureMetadata: useFixture,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown font preview error" },
      { status: 500 },
    );
  }
}
