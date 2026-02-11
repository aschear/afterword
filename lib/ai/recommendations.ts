import type { Recommendation, MediaType } from "@/types";

/**
 * AI pipeline stub: generates literary, thoughtful explanations for recommendations.
 * Future: call OpenAI with structured output; normalize books via metadata APIs.
 */
export interface RecommendationInput {
  mediaType: MediaType;
  title: string;
  author?: string;
  year?: string;
  seedTitles?: string[];
}

/**
 * Server-side only. Returns a structured recommendation with a literary explanation.
 * In MVP this uses stub copy; later replace with OpenAI API + schema.
 */
export async function generateRecommendationExplanation(
  input: RecommendationInput
): Promise<{ explanation: string }> {
  // Stub: no external API calls yet. Literary tone for parity with product goal.
  const literaryStub = `Like a thread connecting your shelf to the wider world—${input.title}${input.author ? ` by ${input.author}` : ""} speaks to the same preoccupations that run through the books you love: the weight of memory, the pull of place, and the quiet insistence of character over plot. Worth meeting.`;
  return { explanation: literaryStub };
}

/**
 * Stub: full recommendation set. Later: taste profile + AI + metadata APIs.
 */
export async function getRecommendationsForUser(_userId: string): Promise<Recommendation[]> {
  return [];
}
