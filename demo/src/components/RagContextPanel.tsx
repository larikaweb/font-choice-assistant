interface RagContextPanelProps {
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
}

export function RagContextPanel({ contextMarkdown, chunks }: RagContextPanelProps) {
  if (!contextMarkdown || chunks.length === 0) return null;

  return (
    <details className="panel rag-panel">
      <summary>Retrieved RAG context ({chunks.length} chunks)</summary>
      <div className="chunk-list">
        {chunks.map((item) => (
          <article key={item.chunk.chunk_id} className="chunk-card">
            <header>
              <strong>{item.chunk.chunk_type}</strong>
              <span>{item.chunk.chunk_id}</span>
            </header>
            <p>{item.chunk.content}</p>
            <small>{item.chunk.tags.join(" · ")}</small>
          </article>
        ))}
      </div>
      <pre>{contextMarkdown}</pre>
    </details>
  );
}
