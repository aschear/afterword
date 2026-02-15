/**
 * Cultural analysis response from the shelf vision API.
 * Used for MCP integrations (Spotify, Netflix) via themes and archetype.
 */
export interface CulturalAnalysisRecommendations {
  books: string[];
  films: string[];
  music: string[];
  podcasts: string[];
}

export interface AnalyzeShelfResponse {
  detected_books: string[];
  dominant_themes: string[];
  reader_archetype: string;
  tone_profile: string[];
  recommendations: CulturalAnalysisRecommendations;
}
