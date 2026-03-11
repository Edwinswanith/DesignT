"use client";

interface ShowBackButtonProps {
  side: "front" | "back";
  onToggle: (side: "front" | "back") => void;
  hasBackDesign?: boolean;
}

export function ShowBackButton({
  side,
  onToggle,
  hasBackDesign = true,
}: ShowBackButtonProps) {
  if (!hasBackDesign) return null;

  return (
    <button
      onClick={() => onToggle(side === "front" ? "back" : "front")}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] transition-all duration-200"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-3.5 h-3.5"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-3-10l4-4 4 4" />
      </svg>
      {side === "front" ? "Show Back" : "Show Front"}
    </button>
  );
}
