import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan your shelf — Afterword",
  description: "Snap a photo of your shelf and get personalized recommendations.",
};

export default function ScanLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
