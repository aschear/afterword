"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import type { AnalyzeShelfResponse } from "@/lib/types";

const RESULT_KEY = "afterword_scan_result";
const IMAGE_KEY = "afterword_scan_image";

export default function ResultsPage() {
  const [data, setData] = useState<AnalyzeShelfResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const raw = sessionStorage.getItem(RESULT_KEY);
    const img = sessionStorage.getItem(IMAGE_KEY);
    if (!raw) {
      setMissing(true);
      return;
    }
    try {
      setData(JSON.parse(raw) as AnalyzeShelfResponse);
      setImageUrl(img);
    } catch {
      setMissing(true);
    }
  }, []);

  if (missing || !data) {
    return (
      <div className="min-h-screen paper-texture flex flex-col items-center justify-center px-6">
        <p className="font-body text-charcoal text-center mb-4">
          {missing
            ? "No results found. Scan your shelf first."
            : "Loading…"}
        </p>
        <Link href="/scan" className="btn-sketchy inline-block">
          Go to Scan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-4 flex items-center justify-between max-w-xl mx-auto w-full border-b border-[hsl(0,0%,90%)]">
        <Link
          href="/"
          className="font-body text-sm text-muted-foreground hover:text-charcoal"
        >
          ← Home
        </Link>
        <span className="font-display text-lg font-medium text-charcoal">
          Your recommendations
        </span>
        <span className="w-14" aria-hidden />
      </header>

      <RecommendationsView data={data} shelfImageUrl={imageUrl} />
    </div>
  );
}
