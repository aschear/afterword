import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import type { AnalyzeShelfResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a literary and cultural critic analyzing a photo of someone's bookshelf or book collection.

Your task: analyze the image and return STRICT JSON only (no markdown, no code fence, no extra text).

If NO books are visible in the image (e.g., wrong photo, keyboard, empty shelf, unrecognizable), return exactly:
{
  "detected_books": [],
  "dominant_themes": [],
  "reader_archetype": "Unknown",
  "tone_profile": [],
  "recommendations": {
    "books": [],
    "films": [],
    "music": [],
    "podcasts": []
  }
}

If books ARE visible:
1. detected_books: list each visible book as "Title - Author" (best effort from spine/cover text)
2. dominant_themes: 2–4 literary themes (e.g., "existentialism", "feminist memoir", "southern gothic")
3. reader_archetype: a single archetype label (e.g., "Existential Modernist", "Romantic Maximalist", "Speculative Realist")
4. tone_profile: 2–4 tonal qualities (e.g., "melancholic", "absurdist", "hopeful", "ironic")
5. recommendations:
   - books: 5 book recommendations as "Title - Author"
   - films: 5 film recommendations
   - music: 5 music artists or albums
   - podcasts: 3 podcast recommendations

Return ONLY valid JSON matching this structure. Be specific and varied—avoid generic answers.`;

function rateLimitHeaders(result: { limit: number; remaining: number; resetAt: number }) {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(retryAfter),
  };
}

function normalizeResponse(parsed: Record<string, unknown>): AnalyzeShelfResponse {
  const ensureStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  const ensureRecs = (o: unknown): AnalyzeShelfResponse["recommendations"] => {
    if (o && typeof o === "object" && !Array.isArray(o)) {
      const r = o as Record<string, unknown>;
      return {
        books: ensureStringArray(r.books),
        films: ensureStringArray(r.films),
        music: ensureStringArray(r.music),
        podcasts: ensureStringArray(r.podcasts),
      };
    }
    return { books: [], films: [], music: [], podcasts: [] };
  };

  return {
    detected_books: ensureStringArray(parsed.detected_books),
    dominant_themes: ensureStringArray(parsed.dominant_themes),
    reader_archetype: typeof parsed.reader_archetype === "string" ? parsed.reader_archetype : "Unknown",
    tone_profile: ensureStringArray(parsed.tone_profile),
    recommendations: ensureRecs(parsed.recommendations),
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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[api/analyze] OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "Analysis service not configured" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type.startsWith("image/") ? file.type : "image/jpeg";

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this shelf image and return the JSON." },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from analysis service" },
        { status: 500, headers: rateLimitHeaders(limitResult) }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.error("[api/analyze] Failed to parse AI response as JSON:", raw?.slice(0, 200));
      return NextResponse.json(
        { error: "Analysis produced invalid output" },
        { status: 500, headers: rateLimitHeaders(limitResult) }
      );
    }

    const result = normalizeResponse(parsed);
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
