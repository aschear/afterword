"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageCapture } from "@/components/scan/ImageCapture";
import { UploadPreview } from "@/components/scan/UploadPreview";
import { ProcessingState } from "@/components/scan/ProcessingState";
import type { AnalyzeShelfResponse } from "@/lib/types";

const RESULT_KEY = "afterword_scan_result";
const IMAGE_KEY = "afterword_scan_image";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<"capture" | "preview" | "processing">(
    "capture"
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl(url);
    setStep("preview");
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!imageFile || !imageUrl) return;
    setStep("processing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed");
      }

      const data: AnalyzeShelfResponse = await res.json();

      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
        sessionStorage.setItem(IMAGE_KEY, imageUrl);
      }

      router.push("/results");
    } catch (err) {
      setError(
        "We couldn't interpret your shelf this time. Try another photo."
      );
      setStep("preview");
    }
  }, [imageFile, imageUrl, router]);

  const handleRetry = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageFile(null);
    setStep("capture");
    setError(null);
  }, [imageUrl]);

  return (
    <div className="min-h-screen paper-texture flex flex-col">
      <header className="px-4 py-4 flex items-center justify-between max-w-xl mx-auto w-full">
        <Link
          href="/"
          className="font-body text-sm text-muted-foreground hover:text-charcoal"
        >
          ← Back
        </Link>
        <h1 className="font-display text-lg font-medium text-charcoal">
          Scan your shelf
        </h1>
        <span className="w-14" aria-hidden />
      </header>

      <main className="flex-1 flex flex-col">
        {step === "capture" && <ImageCapture onCapture={handleCapture} />}
        {step === "preview" && imageUrl && (
          <>
            {error && (
              <div className="mx-4 mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="font-body text-sm text-red-800">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="font-body text-sm font-medium text-red-700 mt-2 underline"
                >
                  Try another photo
                </button>
              </div>
            )}
            <UploadPreview
              imageUrl={imageUrl}
              onGenerate={handleGenerate}
              isProcessing={false}
            />
          </>
        )}
        {step === "processing" && <ProcessingState />}
      </main>
    </div>
  );
}
