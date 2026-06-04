interface RecommendationCardProps {
  recommendation: string;
  usedMockLlm?: boolean;
}

export function RecommendationCard({ recommendation, usedMockLlm }: RecommendationCardProps) {
  if (!recommendation) return null;

  return (
    <section className="panel recommendation-card">
      <div className="panel-heading">
        <h2>Recommendation</h2>
        {usedMockLlm ? <span className="badge">mock LLM mode</span> : null}
      </div>
      <div className="recommendation-text">
        {recommendation.split(/\n{2,}/).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
