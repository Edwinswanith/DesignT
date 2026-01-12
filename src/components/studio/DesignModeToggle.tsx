"use client";

import { cn } from "@/lib/utils";

interface DesignModeToggleProps {
  mode: "ai" | "upload";
  onChange: (mode: "ai" | "upload") => void;
}

export function DesignModeToggle({ mode, onChange }: DesignModeToggleProps) {
  return (
    <div className="inline-flex p-1 bg-[var(--surface-default)] rounded-[12px] border border-[var(--border-default)]">
      <button
        onClick={() => onChange("ai")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200",
          mode === "ai"
            ? "bg-[var(--brand-charcoal)] text-[var(--text-inverse)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        Generate with AI
      </button>
      <button
        onClick={() => onChange("upload")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200",
          mode === "upload"
            ? "bg-[var(--brand-charcoal)] text-[var(--text-inverse)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload Image
      </button>
    </div>
  );
}
