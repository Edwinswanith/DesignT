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
          <span className="text-sm text-[var(--text-secondary)]">
            {selectedSize.chest} chest
          </span>
        )}
      </div>

      {/* Adult Sizes */}
      <div>
        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
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
                  "min-w-[60px] px-4 py-3 rounded-[10px] border-2 text-sm font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)] text-[var(--text-inverse)]"
                    : "border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] bg-[var(--surface-raised)]"
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
        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
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
                  "px-4 py-3 rounded-[10px] border-2 text-sm font-semibold transition-all duration-200",
                  isSelected
                    ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)] text-[var(--text-inverse)]"
                    : "border-[var(--border-default)] hover:border-[var(--border-hover)] text-[var(--text-primary)] bg-[var(--surface-raised)]"
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
