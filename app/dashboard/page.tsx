import Link from "next/link";
import { RecommendationList } from "@/components/recommendations/RecommendationList";
import { MOCK_RECOMMENDATIONS } from "@/lib/mock-recommendations";

export const metadata = {
  title: "Dashboard — Afterword",
  description: "Your taste profile and cultural recommendations.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen paper-texture flex flex-col">
      <header className="border-b border-border px-6 md:px-12 lg:px-20 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl italic font-medium tracking-tight">
            Afterword
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 lg:px-20 py-10 max-w-6xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-2">
          Your recommendations
        </h2>
        <p className="font-body text-muted-foreground mb-8">
          Curated from your shelf. More coming once you connect your library.
        </p>
        <RecommendationList recommendations={MOCK_RECOMMENDATIONS} />
      </main>
    </div>
  );
}
