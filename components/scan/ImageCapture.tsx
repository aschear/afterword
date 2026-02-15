"use client";

interface ImageCaptureProps {
  onCapture: (file: File) => void;
}

export function ImageCapture({ onCapture }: ImageCaptureProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onCapture(file);
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <p className="font-body text-charcoal text-center mb-6 max-w-sm">
        Snap a photo of your shelf so we can read its through-lines.
      </p>
      <label className="btn-sketchy cursor-pointer inline-block">
        <span className="block px-6 py-3">Open camera or choose photo</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="sr-only"
          aria-label="Capture or upload shelf photo"
        />
      </label>
    </div>
  );
}
