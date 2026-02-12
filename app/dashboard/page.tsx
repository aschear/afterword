import Link from "next/link";
import Image from "next/image";
import { TornPaperDivider } from "@/components/marketing/TornPaperDivider";
import { Footer } from "@/components/marketing/Footer";

/* Placeholder category items for the 2x2 grid. Uses placehold.co for images. */
const CATEGORY_DATA = {
  books: {
    heading: "Books",
    aspect: "portrait" as const,
    items: [
      { id: "b1", title: "The Silent Archive", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Cover" },
      { id: "b2", title: "History of Fiction", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Cover" },
      { id: "b3", title: "Echoes of Summer", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Cover" },
      { id: "b4", title: "Starfall Gambit", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Cover" },
    ],
  },
  moviesTv: {
    heading: "Movies and TV",
    aspect: "portrait" as const,
    items: [
      { id: "m1", title: "The Silent Night", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Poster" },
      { id: "m2", title: "The Gilded Cage", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Poster" },
      { id: "m3", title: "Summer Clean", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Poster" },
      { id: "m4", title: "Echoes of Summer", imageUrl: "https://placehold.co/120x180/F5F0E6/1a1a1a?text=Poster" },
    ],
  },
  music: {
    heading: "Music",
    aspect: "square" as const,
    items: [
      { id: "u1", title: "Starfall Gambit of Eldoria", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Album" },
      { id: "u2", title: "The Gilded Cage", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Album" },
      { id: "u3", title: "Moonlight Sonata Recital", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Album" },
    ],
  },
  events: {
    heading: "Events",
    aspect: "square" as const,
    items: [
      { id: "e1", title: "Poets & Pages Evening", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Event" },
      { id: "e2", title: "Literary Event", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Event" },
      { id: "e3", title: "Find Tickets", imageUrl: "https://placehold.co/140x140/F5F0E6/1a1a1a?text=Event" },
    ],
  },
} as const;

function CategoryBlock({
  heading,
  items,
  aspect,
}: {
  heading: string;
  items: readonly { id: string; title: string; imageUrl: string }[];
  aspect: "portrait" | "square";
}) {
  const isPortrait = aspect === "portrait";
  const imgWidth = isPortrait ? 120 : 140;
  const imgHeight = isPortrait ? 180 : 140;

  return (
    <div className="w-full">
      <h3 className="font-display text-xl md:text-2xl font-medium text-charcoal mb-4">
        {heading}
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[var(--img-w)]"
            style={{ "--img-w": `${imgWidth}px` } as React.CSSProperties}
          >
            <div
              className="relative w-full overflow-hidden rounded-sm bg-card"
              style={{
                aspectRatio: isPortrait ? "2/3" : "1/1",
              }}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={imgWidth}
                height={imgHeight}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="font-body text-sm text-charcoal mt-2 line-clamp-2">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Dashboard — Afterword",
  description: "Your taste profile and cultural recommendations.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen paper-texture flex flex-col">
      <header className="px-6 md:px-12 lg:px-20 py-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <Image
            src="/assets/book-illustration.png"
            alt="Open book with leaves"
            width={48}
            height={48}
            className="h-12 w-auto mb-2"
          />
          <Link
            href="/"
            className="font-display text-2xl italic font-medium tracking-tight text-charcoal hover:opacity-80 transition-opacity"
          >
            Afterword
          </Link>
          <h2 className="font-display text-2xl md:text-3xl font-medium mt-6 mb-2 text-charcoal">
            Your Curated Universe Awaits
          </h2>
          <p className="font-body text-charcoal max-w-xl">
            Based on your bookshelf, discover or explore these personalized recommendations.
          </p>
          <nav className="mt-6">
            <Link
              href="/login"
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 lg:px-20 pb-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <CategoryBlock
            heading={CATEGORY_DATA.books.heading}
            items={CATEGORY_DATA.books.items}
            aspect={CATEGORY_DATA.books.aspect}
          />
          <CategoryBlock
            heading={CATEGORY_DATA.moviesTv.heading}
            items={CATEGORY_DATA.moviesTv.items}
            aspect={CATEGORY_DATA.moviesTv.aspect}
          />
        </div>

        <div className="mt-8 -mx-6 md:-mx-12 lg:-mx-20">
          <TornPaperDivider />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mt-8">
          <CategoryBlock
            heading={CATEGORY_DATA.music.heading}
            items={CATEGORY_DATA.music.items}
            aspect={CATEGORY_DATA.music.aspect}
          />
          <CategoryBlock
            heading={CATEGORY_DATA.events.heading}
            items={CATEGORY_DATA.events.items}
            aspect={CATEGORY_DATA.events.aspect}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
