import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import type { AnalyzeShelfResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Anthropic only accepts these four image MIME types.
type AnthropicMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
const ALLOWED_MEDIA_TYPES = new Set<AnthropicMediaType>([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
function toAnthropicMediaType(type: string): AnthropicMediaType {
  return ALLOWED_MEDIA_TYPES.has(type as AnthropicMediaType)
    ? (type as AnthropicMediaType)
    : "image/jpeg";
}

const SYSTEM_PROMPT = `You are a literary and cultural critic with deep expertise across literature, cinema, music, and long-form audio. You are analyzing a photo of someone's personal bookshelf.

Analyze the image and output ONLY a raw JSON object — no prose, no markdown, no code fences, no explanation before or after.

If NO books are visible (wrong photo, empty shelf, keyboard, unrecognizable content), return exactly:
{
  "detected_books": [],
  "dominant_themes": [],
  "reader_archetype": "Unknown",
  "tone_profile": [],
  "recommendations": {
    "books_intro": "",
    "books": [],
    "films_intro": "",
    "films": [],
    "music_intro": "",
    "music": [],
    "podcasts_intro": "",
    "podcasts": []
  }
}

If books ARE visible, return a JSON object with these exact keys:
- detected_books: array of strings — each visible title as "Title - Author" (best-effort from spine/cover text)
- dominant_themes: array of 2–4 strings — literary themes derived from the specific titles detected (e.g. "existentialism", "feminist memoir", "southern gothic")
- reader_archetype: string — a single evocative, specific label that captures this reader's sensibility (e.g. "Elegiac Realist", "Baroque Maximalist", "Quiet Apocalypticist"). Never use generic labels.
- tone_profile: array of 2–4 strings — tonal qualities that run across the detected titles (e.g. "melancholic", "absurdist", "formally ambitious", "politically urgent")
- recommendations: object with exactly these keys:

  REASONING INSTRUCTIONS (do not output this section — use it to inform your picks):
  Before selecting any recommendation, identify: (1) the specific aesthetic and moral preoccupations shared across the detected books, (2) the formal qualities — sentence-level rhythm, structural experimentation, narrative voice — not just genre or subject matter, (3) the cultural and historical moment these titles collectively orbit. Then choose items that share that deeper DNA. Actively avoid anything that would appear on a generic "readers also enjoyed" or bestseller algorithm list. Prefer the unexpected and precise over the safe and obvious.

  - books_intro: a 2–3 sentence paragraph written in a warm, critical voice. Name at least 2 of the 5 recommended books and explain specifically why they connect to books actually detected on this shelf — cite the detected titles by name. Focus on aesthetic or thematic resonance, not surface genre.
  - books: 5 strings as "Title - Author" — chosen for aesthetic and thematic DNA, not genre similarity. Each should feel like a discovery, not an algorithm.
  - films_intro: a 2–3 sentence paragraph. Name at least 2 of the 5 recommended films and explain what they share with specific detected books — in terms of moral texture, formal structure, or obsessive subject matter.
  - films: 5 film title strings
  - music_intro: a 2–3 sentence paragraph. Name 1–2 of the recommended artists/albums and describe what reading quality they share with the books on this shelf — tempo, density, emotional register, or lyrical sensibility.
  - music: 5 strings as "Artist - Album"
  - podcasts_intro: a 2–3 sentence paragraph. Name 1–2 of the recommended podcasts and explain why this reader specifically — given what they read — would find them valuable.
  - podcasts: 3 podcast name strings

Output the JSON object only.`;

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

  const ensureOptionalString = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;

  const ensureRecs = (o: unknown): AnalyzeShelfResponse["recommendations"] => {
    if (o && typeof o === "object" && !Array.isArray(o)) {
      const r = o as Record<string, unknown>;
      return {
        books_intro: ensureOptionalString(r.books_intro),
        books: ensureStringArray(r.books),
        films_intro: ensureOptionalString(r.films_intro),
        films: ensureStringArray(r.films),
        music_intro: ensureOptionalString(r.music_intro),
        music: ensureStringArray(r.music),
        podcasts_intro: ensureOptionalString(r.podcasts_intro),
        podcasts: ensureStringArray(r.podcasts),
      };
    }
    return { books: [], films: [], music: [], podcasts: [] };
  };

  return {
    detected_books: ensureStringArray(parsed.detected_books),
    dominant_themes: ensureStringArray(parsed.dominant_themes),
    reader_archetype:
      typeof parsed.reader_archetype === "string" ? parsed.reader_archetype : "Unknown",
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[api/analyze] ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "Analysis service not configured" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = toAnthropicMediaType(file.type);

    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Analyze this shelf image and return the JSON.",
            },
          ],
        },
      ],
    });

    const firstBlock = message.content[0];
    const raw = firstBlock?.type === "text" ? firstBlock.text : null;
    if (raw === null) {
      return NextResponse.json(
        { error: "Empty response from analysis service" },
        { status: 500, headers: rateLimitHeaders(limitResult) }
      );
    }

    // Strip markdown code fences if the model wrapped the JSON (e.g. ```json ... ```)
    const stripped = raw
      .replace(/^\s*```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(stripped) as Record<string, unknown>;
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
