interface FontWarningListProps {
  warnings: string[];
}

export function FontWarningList({ warnings }: FontWarningListProps) {
  if (!warnings.length) return null;

  return (
    <section aria-label="Font warnings" className="font-warning-list">
      <h3>Warnings</h3>
      <ul>
        {warnings.map((warning, index) => (
          <li key={`${warning}-${index}`}>{warning}</li>
        ))}
      </ul>
    </section>
  );
}
