"use client";

import type { AnalyzeShelfResponse, RecommendationItem } from "@/lib/types";

interface RecommendationsViewProps {
  data: AnalyzeShelfResponse;
  shelfImageUrl: string | null;
}

function RecommendationCard({ item }: { item: RecommendationItem }) {
  return (
    <article className="border-b border-[hsl(0,0%,88%)] pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
      <h3 className="font-display text-lg font-medium text-charcoal mb-0.5">
        {item.title}
      </h3>
      <p className="font-body text-sm text-muted-foreground mb-3">
        {item.creator}
      </p>
      <p className="font-body text-sm leading-relaxed text-charcoal mb-2">
        {item.explanation}
      </p>
      <p className="font-body text-xs italic text-muted-foreground">
        {item.why_it_connects}
      </p>
    </article>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: RecommendationItem[];
}) {
  if (!items?.length) return null;
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-medium text-charcoal mb-4">
        {title}
      </h2>
      <div className="space-y-0">
        {items.map((item, i) => (
          <RecommendationCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}

export function RecommendationsView({ data, shelfImageUrl }: RecommendationsViewProps) {
  const { taste_profile, recommendations } = data;

  return (
    <div className="min-h-screen paper-texture pb-20">
      <div className="px-4 md:px-6 max-w-xl mx-auto pt-6">
        {shelfImageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden border border-[hsl(0,0%,85%)] aspect-video w-full max-h-40 object-cover bg-[hsl(0,0%,96%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shelfImageUrl}
              alt="Your shelf"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="font-display text-2xl font-medium text-charcoal mb-6">
          Your Taste Profile
        </h1>

        <div className="mb-8 space-y-4">
          {taste_profile.dominant_themes?.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Dominant themes
              </p>
              <p className="font-body text-charcoal">
                {taste_profile.dominant_themes.join(" · ")}
              </p>
            </div>
          )}
          {taste_profile.aesthetic_tone && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Aesthetic tone
              </p>
              <p className="font-body text-charcoal leading-relaxed">
                {taste_profile.aesthetic_tone}
              </p>
            </div>
          )}
          {taste_profile.intellectual_gravity && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Intellectual gravity
              </p>
              <p className="font-body text-charcoal leading-relaxed">
                {taste_profile.intellectual_gravity}
              </p>
            </div>
          )}
        </div>

        <Section title="Books" items={recommendations.books} />
        <Section title="Films" items={recommendations.films} />
        <Section title="Music" items={recommendations.music} />
        <Section title="Events" items={recommendations.events} />
        <Section title="Unexpected" items={recommendations.unexpected} />
      </div>
    </div>
  );
}
