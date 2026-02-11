import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const mediaTypeLabel: Record<Recommendation["mediaType"], string> = {
  book: "Book",
  movie: "Movie",
  tv: "TV",
  music: "Music",
  event: "Event",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-6 font-body text-foreground shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {mediaTypeLabel[recommendation.mediaType]}
        </span>
        {recommendation.year && (
          <span className="text-xs text-muted-foreground">
            {recommendation.year}
          </span>
        )}
      </div>
      <h3 className="font-display text-xl font-medium mb-1">{recommendation.title}</h3>
      {recommendation.author && (
        <p className="text-sm text-muted-foreground mb-4">{recommendation.author}</p>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {recommendation.explanation}
      </p>
    </article>
  );
}
