"use client";

import type { AnalyzeShelfResponse } from "@/lib/types";

interface RecommendationsViewProps {
  data: AnalyzeShelfResponse;
  shelfImageUrl: string | null;
}

function PencilDivider() {
  return (
    <div className="w-full my-6" aria-hidden>
      <svg viewBox="0 0 400 8" preserveAspectRatio="none" className="w-full h-2">
        <path
          d="M0,4 C25,2 55,6 90,4 C125,2 155,6 200,4 C245,2 275,6 310,4 C345,2 375,6 400,4"
          stroke="hsl(30, 8%, 65%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </svg>
    </div>
  );
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
    <section className="mb-4">
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

        <div className="mb-2 space-y-3">
          {dominant_themes?.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Dominant themes
              </p>
              <ul className="space-y-0.5">
                {dominant_themes.map((t, i) => (
                  <li key={i} className="font-body text-charcoal text-sm">
                    · {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {reader_archetype && reader_archetype !== "Unknown" && (
            <p className="font-body text-charcoal text-sm">
              <span className="uppercase tracking-wider text-xs text-muted-foreground font-semibold">
                Reader archetype
              </span>
              : {reader_archetype}
            </p>
          )}
          {tone_profile?.length > 0 && (
            <p className="font-body text-charcoal text-sm">
              <span className="uppercase tracking-wider text-xs text-muted-foreground font-semibold">
                Tone profile
              </span>
              : {tone_profile.join(" · ")}
            </p>
          )}
        </div>

        <PencilDivider />
        <Section title="Books" items={recommendations.books} intro={recommendations.books_intro} />
        <PencilDivider />
        <Section title="Films" items={recommendations.films} intro={recommendations.films_intro} />
        <PencilDivider />
        <Section title="Music" items={recommendations.music} intro={recommendations.music_intro} />
        <PencilDivider />
        <Section title="Podcasts" items={recommendations.podcasts} intro={recommendations.podcasts_intro} />
      </div>
    </div>
  );
}
