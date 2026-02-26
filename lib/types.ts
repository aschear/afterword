/**
 * Cultural analysis response from the shelf vision API.
 * Used for MCP integrations (Spotify, Netflix) via themes and archetype.
 */

export interface MusicRecommendation {
  label: string;      // "Artist - Album" as returned by the AI
  url: string | null; // real Spotify track URL, or null if lookup failed
}

export interface CulturalAnalysisRecommendations {
  books_intro?: string;
  books: string[];
  films_intro?: string;
  films: string[];
  music_intro?: string;
  music: MusicRecommendation[];
  podcasts_intro?: string;
  podcasts: string[];
}

export interface AnalyzeShelfResponse {
  detected_books: string[];
  dominant_themes: string[];
  reader_archetype: string;
  tone_profile: string[];
  recommendations: CulturalAnalysisRecommendations;
}
