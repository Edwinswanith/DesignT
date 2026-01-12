"use client";

import { cn } from "@/lib/utils";
import { TSHIRT_COLORS, TSHIRT_COLOR_LIST, TShirtColorId } from "@/constants/colors";

interface ColorSelectorProps {
  value: TShirtColorId;
  onChange: (color: TShirtColorId) => void;
  size?: "compact" | "full";
}

export function ColorSelector({
  value,
  onChange,
  size = "full",
}: ColorSelectorProps) {
  const selectedColor = TSHIRT_COLORS[value];

  return (
    <div className="space-y-3">
      {size === "full" && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-[var(--text-primary)]">
            Color
          </label>
          <span className="text-sm text-[var(--text-secondary)]">
            {selectedColor.name}
          </span>
        </div>
      )}
      <div className={cn("flex", size === "compact" ? "gap-2" : "gap-3")}>
        {TSHIRT_COLOR_LIST.map((color) => {
          const isSelected = value === color.id;
          const isLight = ["pure-white", "cream", "warm-beige"].includes(color.id);
          return (
            <button
              key={color.id}
              onClick={() => onChange(color.id)}
              className={cn(
                "relative rounded-full transition-all duration-200",
                size === "compact" ? "w-8 h-8" : "w-12 h-12",
                isSelected
                  ? "ring-2 ring-offset-2 ring-[var(--brand-charcoal)]"
                  : "hover:scale-110"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isLight ? "var(--brand-charcoal)" : "white"}
                  strokeWidth="3"
                  className={cn(
                    "absolute inset-0 m-auto",
                    size === "compact" ? "w-4 h-4" : "w-5 h-5"
                  )}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {/* Border for light colors */}
              {isLight && !isSelected && (
                <span className="absolute inset-0 rounded-full border border-[var(--border-default)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
