"use client";

interface UploadPreviewProps {
  imageUrl: string;
  onGenerate: () => void;
  isProcessing: boolean;
}

export function UploadPreview({
  imageUrl,
  onGenerate,
  isProcessing,
}: UploadPreviewProps) {
  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-lg mx-auto">
      <p className="font-body text-charcoal text-center mb-4">
        Here’s your shelf. Ready when you are.
      </p>
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[hsl(0,0%,80%)] bg-white mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Your shelf"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={isProcessing}
        className="btn-sketchy w-full max-w-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Generating…" : "Generate Recommendations"}
      </button>
    </div>
  );
}
