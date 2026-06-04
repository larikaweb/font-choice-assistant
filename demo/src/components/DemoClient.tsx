"use client";

import { useState } from "react";
import { DEFAULT_FORM_STATE, RequestForm, type DemoFormState } from "./RequestForm";
import { RecommendationCard } from "./RecommendationCard";
import { FontSystemCard } from "./FontSystemCard";
import { RagContextPanel } from "./RagContextPanel";
import { FontPreview } from "./FontPreview";
import { LoadingState } from "./LoadingState";
import { ErrorBox } from "./ErrorBox";
import type { FontPreviewConfig } from "@/lib/fonts";

interface DemoResponse {
  recommendation: string;
  fontSystem: Record<string, unknown>;
  rag: {
    contextMarkdown: string;
    chunks: Array<{
      score: number;
      chunk: {
        chunk_id: string;
        chunk_type: string;
        content: string;
        tags: string[];
      };
    }>;
  };
  preview: FontPreviewConfig;
  warnings: string[];
  usedMockLlm: boolean;
  usedFixtureMetadata: boolean;
  error?: string;
}

export function DemoClient() {
  const [form, setForm] = useState<DemoFormState>(DEFAULT_FORM_STATE);
  const [result, setResult] = useState<DemoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as DemoResponse;
      if (!response.ok) {
        throw new Error(data.error || "Recommendation request failed");
      }

      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Font Choice Assistant MVP</p>
        <h1>Typography recommendations that explain what fonts do in design.</h1>
        <p>
          The demo runs a request through local JSONL retrieval, an LLM prompt, and a Google Fonts preview check.
          The core rule is: visible feature {"->"} perception effect {"->"} layout role.
        </p>
      </section>

      <section className="panel input-panel">
        <RequestForm value={form} loading={loading} onChange={setForm} onSubmit={submit} />
      </section>

      <ErrorBox message={error} />
      {loading ? <LoadingState /> : null}

      {result ? (
        <section className="result-grid">
          <div className="result-main">
            <RecommendationCard recommendation={result.recommendation} usedMockLlm={result.usedMockLlm} />
            <section className="panel preview-panel">
              <div className="panel-heading">
                <h2>Google Fonts preview</h2>
                {result.usedFixtureMetadata ? <span className="badge">fixture metadata</span> : null}
              </div>
              <FontPreview config={result.preview} />
            </section>
          </div>

          <aside className="result-side">
            <FontSystemCard fontSystem={result.fontSystem} />
            {form.showRagContext ? (
              <RagContextPanel contextMarkdown={result.rag.contextMarkdown} chunks={result.rag.chunks} />
            ) : null}
          </aside>
        </section>
      ) : null}
    </main>
  );
}
