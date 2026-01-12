"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ReferenceImageUploaderProps {
  onImageSelect: (imageBase64: string | null) => void;
  currentImage: string | null;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ReferenceImageUploader({
  onImageSelect,
  currentImage,
}: ReferenceImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a PNG, JPG, or WebP image");
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        setError(`Image must be under ${MAX_SIZE_MB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onImageSelect(result);
      };
      reader.onerror = () => {
        setError("Failed to read image. Please try again.");
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  if (currentImage) {
    return (
      <div className="p-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--surface-raised)]">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-[8px] overflow-hidden border border-[var(--border-default)]">
            <img
              src={currentImage}
              alt="Reference image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              Reference Image Added
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mb-3">
              AI will use this as inspiration for your design
            </p>
            <button
              onClick={() => onImageSelect(null)}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent-error)] underline underline-offset-2 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-[12px] border border-dashed p-4 transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)]/5"
            : "border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--surface-raised)]"
        )}
      >
        <input
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--surface-default)] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-[var(--text-secondary)]"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Add Reference Image
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Optional: Upload an image to inspire the AI
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[var(--accent-error)]">{error}</p>
      )}
    </div>
  );
}
