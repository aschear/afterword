import OpenAI from "openai";
import type { AnalyzeShelfResponse } from "@/lib/types";

const MOCK_TITLES = [
  "The Stranger - Albert Camus",
  "Slouching Towards Bethlehem - Joan Didion",
  "Never Let Me Go - Kazuo Ishiguro",
];

const SYSTEM_PROMPT = `You are a literary and cultural critic with an editorial voice. Given a list of book titles from someone's shelf, you produce a taste profile and cross-media recommendations.

Respond only with valid JSON matching this structure (no markdown, no code fence):
{
  "taste_profile": {
    "dominant_themes": ["theme1", "theme2", "theme3"],
    "aesthetic_tone": "2-3 sentences describing the overall aesthetic and tone of their taste.",
    "intellectual_gravity": "2-3 sentences on the intellectual depth and preoccupations suggested by the shelf."
  },
  "recommendations": {
    "books": [{ "title": "", "creator": "", "explanation": "3-5 sentence essay-style explanation.", "why_it_connects": "One sentence on how it connects to the shelf." }],
    "films": [{ "title": "", "creator": "", "explanation": "", "why_it_connects": "" }],
    "music": [{ "title": "", "creator": "", "explanation": "", "why_it_connects": "" }],
    "events": [{ "title": "", "creator": "", "explanation": "", "why_it_connects": "" }],
    "unexpected": [{ "title": "", "creator": "", "explanation": "", "why_it_connects": "" }]
  }
}

Rules:
- Give 2-3 items per category. "unexpected" can be anything: a podcast, a place, a recipe, a ritual—something that feels surprising but true to their taste.
- Tone: literary, editorial, thoughtful. No generic streaming-algorithm language.
- Each explanation should feel like a short essay: specific, opinionated, and connected to the shelf.`;

export function getMockExtractedTitles(): string[] {
  return [...MOCK_TITLES];
}

export async function analyzeShelf(
  extractedTitles: string[]
): Promise<AnalyzeShelfResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });

  const userContent = `Here are the book titles extracted from this person's shelf:\n\n${extractedTitles.map((t) => `• ${t}`).join("\n")}\n\nProduce the taste profile and recommendations JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from OpenAI");
  }

  const parsed = JSON.parse(raw) as AnalyzeShelfResponse;

  // Normalize: ensure all arrays exist and items have required fields
  const ensureItem = (o: unknown) => ({
    title: typeof (o as Record<string, unknown>)?.title === "string" ? (o as Record<string, string>).title : "",
    creator: typeof (o as Record<string, unknown>)?.creator === "string" ? (o as Record<string, string>).creator : "",
    explanation: typeof (o as Record<string, unknown>)?.explanation === "string" ? (o as Record<string, string>).explanation : "",
    why_it_connects: typeof (o as Record<string, unknown>)?.why_it_connects === "string" ? (o as Record<string, string>).why_it_connects : "",
  });

  const categories = ["books", "films", "music", "events", "unexpected"] as const;
  const recs = parsed.recommendations as unknown as Record<string, unknown[]>;
  for (const cat of categories) {
    if (!Array.isArray(recs[cat])) {
      recs[cat] = [];
    }
    recs[cat] = recs[cat].map(ensureItem);
  }

  if (!parsed.taste_profile) {
    parsed.taste_profile = {
      dominant_themes: [],
      aesthetic_tone: "",
      intellectual_gravity: "",
    };
  } else {
    if (!Array.isArray(parsed.taste_profile.dominant_themes)) {
      parsed.taste_profile.dominant_themes = [];
    }
    parsed.taste_profile.aesthetic_tone = String(parsed.taste_profile.aesthetic_tone ?? "");
    parsed.taste_profile.intellectual_gravity = String(parsed.taste_profile.intellectual_gravity ?? "");
  }

  return parsed;
}
