import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your recommendations — Afterword",
  description: "Your taste profile and recommendations from your shelf.",
};

export default function ResultsLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
