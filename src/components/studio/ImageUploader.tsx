"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface ImageUploaderProps {
  onImageSelect: (imageBase64: string) => void;
  currentImage: string | null;
  isProcessing?: boolean;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploader({
  onImageSelect,
  currentImage,
  isProcessing = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      // Validate type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a PNG, JPG, or WebP image");
        return;
      }

      // Validate size
      if (file.size > MAX_SIZE_BYTES) {
        setError(`Image must be under ${MAX_SIZE_MB}MB`);
        return;
      }

      // Convert to base64
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
      <div className="space-y-4">
        <div className="relative rounded-[16px] overflow-hidden border border-[var(--border-default)] bg-[var(--surface-raised)]">
          <img
            src={currentImage}
            alt="Uploaded design"
            className="w-full h-auto max-h-[300px] object-contain"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-[var(--brand-charcoal)]/80 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onImageSelect("")}
          className="w-full"
        >
          Remove and Upload New Image
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-[16px] border-2 border-dashed p-8 text-center transition-all duration-200",
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

        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--surface-default)] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-[var(--text-secondary)]"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-[var(--text-primary)]">
              Drag and drop your image here
            </p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            PNG, JPG, WebP up to {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--accent-error)]">{error}</p>
      )}
    </div>
  );
}
