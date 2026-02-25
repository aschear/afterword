"use client";

import type { AnalyzeShelfResponse } from "@/lib/types";

interface RecommendationsViewProps {
  data: AnalyzeShelfResponse;
  shelfImageUrl: string | null;
}

function Section({
  title,
  items,
  intro,
}: {
  title: string;
  items: string[];
  intro?: string;
}) {
  if (!items?.length) return null;
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-medium text-charcoal mb-3">
        {title}
      </h2>
      {intro && (
        <p className="font-body text-sm text-charcoal/80 leading-relaxed mb-4 italic">
          {intro}
        </p>
      )}
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="font-body text-charcoal">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecommendationsView({ data, shelfImageUrl }: RecommendationsViewProps) {
  const {
    detected_books,
    dominant_themes,
    reader_archetype,
    tone_profile,
    recommendations,
  } = data;

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
          {detected_books?.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Detected books
              </p>
              <p className="font-body text-charcoal">
                {detected_books.join(" · ")}
              </p>
            </div>
          )}
          {dominant_themes?.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Dominant themes
              </p>
              <p className="font-body text-charcoal">
                {dominant_themes.join(" · ")}
              </p>
            </div>
          )}
          {reader_archetype && reader_archetype !== "Unknown" && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Reader archetype
              </p>
              <p className="font-body text-charcoal">
                {reader_archetype}
              </p>
            </div>
          )}
          {tone_profile?.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Tone profile
              </p>
              <p className="font-body text-charcoal">
                {tone_profile.join(" · ")}
              </p>
            </div>
          )}
        </div>

        <Section title="Books" items={recommendations.books} intro={recommendations.books_intro} />
        <Section title="Films" items={recommendations.films} intro={recommendations.films_intro} />
        <Section title="Music" items={recommendations.music} intro={recommendations.music_intro} />
        <Section title="Podcasts" items={recommendations.podcasts} intro={recommendations.podcasts_intro} />
      </div>
    </div>
  );
}
