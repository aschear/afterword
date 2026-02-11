import type { Recommendation } from "@/types";

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    title: "Stoner",
    mediaType: "book",
    author: "John Williams",
    year: "1965",
    explanation:
      "Like a thread connecting your shelf to the wider world—Stoner speaks to the same preoccupations that run through the books you love: the weight of memory, the pull of place, and the quiet insistence of character over plot. A novel that refuses to shout; it earns its place in the canon of quiet American realism.",
  },
  {
    id: "2",
    title: "Aftersun",
    mediaType: "movie",
    year: "2022",
    explanation:
      "Memory and absence sit at the centre of this film, much as they do in the best literary fiction. If your shelf leans toward introspective, character-driven work, Aftersun will feel like a natural extension—a late-summer ache rendered with precision and restraint.",
  },
  {
    id: "3",
    title: "The Bear",
    mediaType: "tv",
    year: "2022",
    explanation:
      "Chaos and craft, family and failure—The Bear carries the same emotional density as a great short-story collection. Each episode feels like a chapter in a book you can’t put down, with dialogue that crackles and characters that stay with you long after the credits.",
  },
];
