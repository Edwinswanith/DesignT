"use client";

import { cn } from "@/lib/utils";
import { TSHIRT_COLORS, TSHIRT_COLOR_LIST, TShirtColorId } from "@/constants/colors";

interface ColorSelectorProps {
  value: TShirtColorId;
  onChange: (color: TShirtColorId) => void;
  size?: "compact" | "full";
  /** When true, only swatches are shown (no "Color" label / color name row) */
  hideLabelRow?: boolean;
}

export function ColorSelector({
  value,
  onChange,
  size = "full",
  hideLabelRow = false,
}: ColorSelectorProps) {
  const selectedColor = TSHIRT_COLORS[value];

  return (
    <div className="space-y-2">
      {!hideLabelRow && (
        <div className="flex items-center justify-between">
          <label className={cn(
          "block font-semibold",
          size === "compact"
            ? "text-xs uppercase tracking-widest text-[var(--text-tertiary)]"
            : "text-sm text-[var(--text-primary)]"
        )}>
          {size === "compact" ? "Color" : "Color"}
        </label>
        <span className="text-xs text-[var(--text-tertiary)]">
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
                size === "compact" ? "w-7 h-7" : "w-11 h-11",
                isSelected
                  ? "ring-2 ring-offset-2 ring-[var(--accent-primary)] ring-offset-[var(--surface-raised)] scale-110"
                  : "hover:scale-110 hover:ring-1 hover:ring-[var(--border-hover)] hover:ring-offset-1 hover:ring-offset-[var(--surface-raised)]"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isLight ? "var(--brand-black)" : "white"}
                  strokeWidth="3"
                  className={cn(
                    "absolute inset-0 m-auto",
                    size === "compact" ? "w-3 h-3" : "w-4 h-4"
                  )}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {isLight && !isSelected && (
                <span className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.15)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
