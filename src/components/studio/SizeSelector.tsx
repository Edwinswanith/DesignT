"use client";

import { cn } from "@/lib/utils";
import { ALL_SIZES, ADULT_SIZE_LIST, KIDS_SIZE_LIST, SizeId } from "@/constants/sizes";

interface SizeSelectorProps {
  value: SizeId;
  onChange: (size: SizeId) => void;
  showMeasurements?: boolean;
}

export function SizeSelector({
  value,
  onChange,
  showMeasurements = true,
}: SizeSelectorProps) {
  const selectedSize = ALL_SIZES[value];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[var(--text-primary)]">
          Size
        </label>
        {showMeasurements && (
          <span className="text-xs text-[var(--text-tertiary)]">
            {selectedSize.chest} chest
          </span>
        )}
      </div>

      {/* Adult Sizes */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
          Adult
        </p>
        <div className="flex flex-wrap gap-2">
          {ADULT_SIZE_LIST.map((size) => {
            const isSelected = value === size.id;
            return (
              <button
                key={size.id}
                onClick={() => onChange(size.id)}
                className={cn(
                  "min-w-[56px] px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[var(--border-accent)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] bg-[var(--surface-overlay)]"
                )}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kids Sizes */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
          Kids
        </p>
        <div className="flex flex-wrap gap-2">
          {KIDS_SIZE_LIST.map((size) => {
            const isSelected = value === size.id;
            return (
              <button
                key={size.id}
                onClick={() => onChange(size.id)}
                className={cn(
                  "px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[var(--border-accent)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] bg-[var(--surface-overlay)]"
                )}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
