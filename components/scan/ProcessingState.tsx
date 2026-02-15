"use client";

const LINES = [
  "Reading your shelf…",
  "Tracing thematic through-lines…",
  "Mapping cross-media affinities…",
];

export function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="space-y-4 text-center max-w-sm">
        {LINES.map((line, i) => (
          <p
            key={i}
            className="font-body text-charcoal text-lg"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
