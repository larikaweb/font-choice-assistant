interface FontSystemCardProps {
  fontSystem: Record<string, unknown> | null;
}

const DISPLAY_FIELDS = [
  ["headingFont", "Heading"],
  ["bodyFont", "Body"],
  ["buttonFont", "Button"],
  ["quoteFont", "Quote"],
  ["captionFont", "Caption"],
  ["labelFont", "Label"],
] as const;

export function FontSystemCard({ fontSystem }: FontSystemCardProps) {
  if (!fontSystem) return null;

  return (
    <section className="panel font-system-card">
      <h2>Font system</h2>
      <dl>
        {DISPLAY_FIELDS.map(([key, label]) => {
          const value = fontSystem[key];
          if (typeof value !== "string" || !value.trim()) return null;
          return (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
