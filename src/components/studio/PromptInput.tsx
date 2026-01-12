"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error?: string | null;
}

export function PromptInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
  error,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value.length;
  const minChars = 10;
  const maxChars = 500;
  const isValid = charCount >= minChars && charCount <= maxChars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isGenerating) {
      onGenerate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative rounded-[16px] border-2 transition-all duration-200 bg-[var(--surface-raised)]",
          isFocused
            ? "border-[var(--brand-charcoal)] ring-4 ring-[var(--brand-charcoal)]/10"
            : "border-[var(--border-default)] hover:border-[var(--border-hover)]",
          error && "border-[var(--accent-error)]"
        )}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your design idea... e.g., 'A vibrant birthday celebration with colorful balloons and confetti'"
          rows={4}
          maxLength={maxChars}
          className="w-full px-4 py-4 text-base bg-transparent resize-none outline-none
            text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-default)]">
          <span
            className={cn(
              "text-sm",
              charCount < minChars
                ? "text-[var(--text-tertiary)]"
                : charCount > maxChars
                ? "text-[var(--accent-error)]"
                : "text-[var(--text-secondary)]"
            )}
          >
            {charCount}/{maxChars}
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || isGenerating}
            isLoading={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-3 text-sm text-[var(--accent-error)]">{error}</p>
      )}
    </form>
  );
}
