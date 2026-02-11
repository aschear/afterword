import Link from "next/link";

export const metadata = {
  title: "Log in — Afterword",
  description: "Sign in to your Afterword account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen paper-texture flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">
            Afterword
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Sign in to access your taste profile and recommendations.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 font-body text-left">
          <p className="text-sm text-muted-foreground mb-4">
            Login is a placeholder. Future: Supabase Auth (email, OAuth).
          </p>
          <button type="button" className="btn-sketchy w-full" disabled>
            Sign in (coming soon)
          </button>
        </div>

        <Link
          href="/"
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
