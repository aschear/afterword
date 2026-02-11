import Image from "next/image";

const features = [
  {
    title: "Discover",
    description:
      "Unearth hidden gems across all media, curated from your reading taste.",
    icon: "/assets/discover-icon.png",
  },
  {
    title: "Connect",
    description:
      "Find local readings, screenings, and concerts that match your literary sensibility.",
    icon: "/assets/connect-icon.png",
  },
  {
    title: "Experience",
    description:
      "Immerse yourself in a world of culture inspired by the stories you love.",
    icon: "/assets/experience-icon.png",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-8 pb-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
        {features.map((feature, index) => (
          <div key={feature.title} className="flex items-start gap-0 flex-1">
            {index > 0 && (
              <div className="hidden lg:block pencil-divider mx-8 self-stretch" />
            )}

            <div className="flex items-center gap-4 w-full max-w-xs md:max-w-2xl lg:max-w-sm min-w-0">
              <div className="flex-shrink-0 w-20 h-20 overflow-hidden">
                <Image
                  src={feature.icon}
                  alt={`${feature.title} illustration`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div>
                <h3 className="font-display text-xl md:text-2xl font-medium mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
