const footerLinks = ["About", "How It Works", "Privacy", "Contact"];

export function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-8 w-full">
      <div className="w-[80%] mx-auto min-w-0">
        <div className="mb-6 w-full" style={{ height: "2px" }}>
          <svg
            viewBox="0 0 1200 4"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ display: "block" }}
          >
            <path
              d="M0,2 Q30,0.5 60,2.2 Q90,3.5 120,1.8 Q150,0.3 180,2.5 Q210,3.8 240,1.5 Q270,0.2 300,2.3 Q330,3.6 360,1.7 Q390,0.4 420,2.4 Q450,3.7 480,1.6 Q510,0.3 540,2.2 Q570,3.5 600,1.8 Q630,0.5 660,2.5 Q690,3.8 720,1.5 Q750,0.2 780,2.3 Q810,3.6 840,1.7 Q870,0.4 900,2.4 Q930,3.7 960,1.6 Q990,0.3 1020,2.2 Q1050,3.5 1080,1.8 Q1110,0.5 1140,2.5 Q1170,3.8 1200,1.5"
              stroke="hsl(30, 8%, 35%)"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={`font-body text-sm text-muted-foreground hover:text-foreground transition-colors ${link === "How It Works" ? "whitespace-nowrap" : ""}`}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="X"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
