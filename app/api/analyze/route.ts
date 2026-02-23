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

const SYSTEM_PROMPT = `You are a literary and cultural critic analyzing a photo of someone's bookshelf or book collection.

Analyze the image and output ONLY a raw JSON object — no prose, no markdown, no code fences, no explanation before or after.

If NO books are visible (wrong photo, empty shelf, keyboard, unrecognizable content), return exactly:
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

If books ARE visible, return a JSON object with these exact keys:
- detected_books: array of strings — each visible title as "Title - Author" (best-effort from spine/cover text)
- dominant_themes: array of 2–4 strings — literary themes (e.g. "existentialism", "feminist memoir", "southern gothic")
- reader_archetype: string — a single evocative label (e.g. "Existential Modernist", "Romantic Maximalist", "Speculative Realist")
- tone_profile: array of 2–4 strings — tonal qualities (e.g. "melancholic", "absurdist", "hopeful", "ironic")
- recommendations: object with exactly four array keys:
    - books: 5 strings as "Title - Author"
    - films: 5 film title strings
    - music: 5 strings as artist names or "Artist - Album"
    - podcasts: 3 podcast name strings

Be specific and varied. No generic answers. Output the JSON object only.`;

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
      max_tokens: 1024,
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
