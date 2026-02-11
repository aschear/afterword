export type MediaType = "book" | "movie" | "tv" | "music" | "event";

export interface Recommendation {
  id: string;
  title: string;
  mediaType: MediaType;
  author?: string;
  year?: string;
  explanation: string;
  imageUrl?: string;
  link?: string;
}

export interface TasteProfile {
  userId: string;
  bookTitles: string[];
  normalizedTitles: string[];
  updatedAt: string;
}
