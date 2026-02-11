import { NextResponse } from "next/server";
import { generateRecommendationExplanation } from "@/lib/ai/recommendations";
import type { MediaType } from "@/types";

/**
 * POST /api/recommendations — AI pipeline stub.
 * Accepts a single item; returns a literary explanation. Server-side only.
 * Future: accept taste profile, call OpenAI, return full recommendation set.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaType, title, author, year, seedTitles } = body as {
      mediaType?: MediaType;
      title?: string;
      author?: string;
      year?: string;
      seedTitles?: string[];
    };

    if (!title || !mediaType) {
      return NextResponse.json(
        { error: "Missing required fields: title, mediaType" },
        { status: 400 }
      );
    }

    const { explanation } = await generateRecommendationExplanation({
      mediaType,
      title,
      author,
      year,
      seedTitles,
    });

    return NextResponse.json({ explanation });
  } catch (e) {
    console.error("Recommendations API error:", e);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
