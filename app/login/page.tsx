import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Log in — Afterword",
  description: "Sign in to your Afterword account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen paper-texture flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/book-illustration.png"
            alt="Open book with leaves"
            width={56}
            height={56}
            className="h-14 w-auto"
          />
          <h1 className="font-display text-3xl font-medium tracking-tight text-charcoal">
            Afterword
          </h1>
        </div>

        <div className="w-full rounded-2xl bg-white p-6 font-body text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="font-body text-sm text-charcoal block"
              >
                Email
              </label>
              <div className="input-page-corner relative">
                <Image
                  src="/assets/corner-cap.png"
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="absolute -top-4 -left-4 z-10 pointer-events-none w-12 h-12"
                />
                <Image
                  src="/assets/corner-cap.png"
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="absolute -bottom-4 -right-4 z-10 pointer-events-none rotate-180 w-12 h-12"
                />
                <input
                  id="email"
                  type="email"
                  placeholder=""
                  className="input-with-corner-caps w-full px-4 py-3 border border-[hsl(0,0%,80%)] bg-white font-body text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="font-body text-sm text-charcoal block"
              >
                Password
              </label>
              <div className="input-page-corner relative">
                <Image
                  src="/assets/corner-cap.png"
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="absolute -top-4 -left-4 z-10 pointer-events-none w-12 h-12"
                />
                <Image
                  src="/assets/corner-cap.png"
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="absolute -bottom-4 -right-4 z-10 pointer-events-none rotate-180 w-12 h-12"
                />
                <input
                  id="password"
                  type="password"
                  placeholder=""
                  className="input-with-corner-caps w-full px-4 py-3 border border-[hsl(0,0%,80%)] bg-white font-body text-charcoal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>
            <Link
              href="/dashboard"
              className="block w-full py-3 rounded-xl bg-charcoal text-white font-body font-semibold text-base hover:opacity-90 transition-opacity text-center"
            >
              Sign In
            </Link>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="#"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
