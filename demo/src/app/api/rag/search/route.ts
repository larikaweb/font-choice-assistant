import { NextResponse } from "next/server";
import { buildRagContext, getValidRagChunks } from "@/lib/rag";

export const runtime = "nodejs";

interface SearchRequestBody {
  query?: string;
  topK?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SearchRequestBody;
    const query = body.query?.trim();
    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const chunks = getValidRagChunks();
    const built = buildRagContext({
      userRequest: query,
      chunks,
      topK: body.topK ?? 7,
      maxCharsPerChunk: 900,
    });

    return NextResponse.json({
      query,
      contextMarkdown: built.context,
      chunks: built.selected,
      countsByType: built.countsByType,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown RAG search error" },
      { status: 500 },
    );
  }
}
