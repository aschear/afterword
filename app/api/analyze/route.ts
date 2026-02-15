import { NextResponse } from "next/server";
import { getMockExtractedTitles, analyzeShelf } from "@/lib/ai/analyzeShelf";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

function rateLimitHeaders(result: { limit: number; remaining: number; resetAt: number }) {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(retryAfter),
  };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitResult = checkRateLimit(ip);

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: rateLimitHeaders(limitResult),
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid image file" },
        { status: 400 }
      );
    }

    // MVP: do not implement real OCR; use mock titles
    const extractedTitles = getMockExtractedTitles();

    const result = await analyzeShelf(extractedTitles);

    return NextResponse.json(result, {
      headers: rateLimitHeaders(limitResult),
    });
  } catch (err) {
    console.error("[api/analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
