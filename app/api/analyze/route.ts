import { NextResponse } from "next/server";
import { getMockExtractedTitles, analyzeShelf } from "@/lib/ai/analyzeShelf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
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

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
