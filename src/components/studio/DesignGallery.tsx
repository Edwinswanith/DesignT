"use client";

import { cn } from "@/lib/utils";

interface DesignGalleryProps {
  designs: string[];
  currentDesign: string | null;
  onSelect: (design: string) => void;
}

export function DesignGallery({
  designs,
  currentDesign,
  onSelect,
}: DesignGalleryProps) {
  if (designs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Recent Designs
      </label>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {designs.map((design, index) => {
          const isSelected = design === currentDesign;
          return (
            <button
              key={index}
              onClick={() => onSelect(design)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-[12px] overflow-hidden border-2 transition-all duration-200",
                isSelected
                  ? "border-[var(--brand-charcoal)] ring-2 ring-[var(--brand-charcoal)]/20"
                  : "border-[var(--border-default)] hover:border-[var(--border-hover)]"
              )}
            >
              <img
                src={design}
                alt={`Design ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
