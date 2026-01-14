"use client";

import { cn } from "@/lib/utils";
import { IMAGE_STYLES, ImageStyleId } from "@/constants/styles";

interface StyleSelectorProps {
  value: ImageStyleId;
  onChange: (value: ImageStyleId) => void;
  size?: "default" | "compact";
}

// Icon components for each style
function StyleIcon({ icon, className }: { icon: string; className?: string }) {
  const iconClass = cn("w-5 h-5", className);

  switch (icon) {
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "film":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={iconClass}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export function StyleSelector({
  value,
  onChange,
  size = "default",
}: StyleSelectorProps) {
  if (size === "compact") {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-[var(--text-secondary)]">
          Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {IMAGE_STYLES.map((style) => {
            const isSelected = value === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onChange(style.id)}
                title={style.hint || "Any style"}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full border transition-all duration-200",
                  isSelected
                    ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)] text-white"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-charcoal)] hover:text-[var(--text-primary)]"
                )}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Style (Optional)
      </label>
      <div className="grid grid-cols-3 gap-2">
        {IMAGE_STYLES.map((style) => {
          const isSelected = value === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onChange(style.id)}
              className={cn(
                "flex flex-col items-center p-3 rounded-[12px] border-2 transition-all duration-200",
                isSelected
                  ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)]/5"
                  : "border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--surface-raised)]"
              )}
            >
              <StyleIcon
                icon={style.icon}
                className={cn(
                  "mb-2",
                  isSelected
                    ? "text-[var(--brand-charcoal)]"
                    : "text-[var(--text-tertiary)]"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {style.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--text-tertiary)]">
        Or describe any style you want in your prompt
      </p>
    </div>
  );
}
