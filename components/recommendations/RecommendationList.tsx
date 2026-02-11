import type { Recommendation } from "@/types";
import { RecommendationCard } from "./RecommendationCard";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <p className="font-body text-muted-foreground text-center py-8">
        No recommendations yet. Scan your shelf to get started.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec) => (
        <li key={rec.id}>
          <RecommendationCard recommendation={rec} />
        </li>
      ))}
    </ul>
  );
}
