"use client";

import { cn } from "@/lib/utils";
import { ASPECT_RATIOS, AspectRatioId } from "@/constants/prompts";

interface AspectRatioSelectorProps {
  value: AspectRatioId;
  onChange: (value: AspectRatioId) => void;
}

export function AspectRatioSelector({
  value,
  onChange,
}: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Design Shape
      </label>
      <div className="flex gap-3">
        {ASPECT_RATIOS.map((ratio) => {
          const isSelected = value === ratio.id;
          return (
            <button
              key={ratio.id}
              onClick={() => onChange(ratio.id)}
              className={cn(
                "flex-1 p-4 rounded-[12px] border-2 transition-all duration-200",
                isSelected
                  ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)]/5"
                  : "border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--surface-raised)]"
              )}
            >
              {/* Aspect Ratio Preview */}
              <div className="flex justify-center mb-3">
                <div
                  className={cn(
                    "border-2 rounded-sm",
                    isSelected
                      ? "border-[var(--brand-charcoal)]"
                      : "border-[var(--text-tertiary)]"
                  )}
                  style={{
                    width: ratio.width === 1 ? 32 : ratio.width > ratio.height ? 40 : 24,
                    height: ratio.height === 1 ? 32 : ratio.height > ratio.width ? 40 : 24,
                  }}
                />
              </div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isSelected
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {ratio.label}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                {ratio.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
