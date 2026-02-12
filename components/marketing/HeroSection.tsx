import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative px-6 md:px-12 lg:px-20 pt-12 pb-0 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <h1 className="font-display text-4xl md:text-5xl italic font-medium tracking-tight">
          Afterword
        </h1>
        <Image
          src="/assets/book-illustration.png"
          alt="Open book with leaves"
          width={48}
          height={48}
          className="h-10 md:h-12 w-auto"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
        <div className="flex-1 max-w-md">
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] leading-tight mb-6 font-medium">
            Your bookshelf is just the beginning.
          </h2>
          <p className="font-body text-base md:text-lg leading-relaxed mb-8 text-charcoal">
            Scan your library. Discover your next favorite book, movie, album, or local event.
          </p>
          <a href="/dashboard" className="btn-sketchy inline-block">
            Scan Your Shelf & Get Recommendations
          </a>
        </div>

        <div className="flex-1 flex justify-center items-center w-full">
          <Image
            src="/assets/hero-illustration.png"
            alt="Bookshelf with phone scanning books, arrows pointing to movie reel, vinyl record, and calendar illustrations"
            width={512}
            height={512}
            className="w-full max-w-md md:max-w-2xl lg:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
}
