export interface RecommendationItem {
  title: string;
  creator: string;
  explanation: string;
  why_it_connects: string;
}

export interface TasteProfile {
  dominant_themes: string[];
  aesthetic_tone: string;
  intellectual_gravity: string;
}

export interface Recommendations {
  books: RecommendationItem[];
  films: RecommendationItem[];
  music: RecommendationItem[];
  events: RecommendationItem[];
  unexpected: RecommendationItem[];
}

export interface AnalyzeShelfResponse {
  taste_profile: TasteProfile;
  recommendations: Recommendations;
}
