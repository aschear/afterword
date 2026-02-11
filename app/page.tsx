import { HeroSection } from "@/components/marketing/HeroSection";
import { TornPaperDivider } from "@/components/marketing/TornPaperDivider";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen paper-texture flex flex-col">
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <HeroSection />
          <TornPaperDivider />
          <FeaturesSection />
        </div>
        <Footer />
      </main>
    </div>
  );
}
