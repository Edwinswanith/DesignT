"use client";

import { cn } from "@/lib/utils";
import { TSHIRT_COLORS, TShirtColorId } from "@/constants/colors";

interface TShirtPreviewProps {
  color: TShirtColorId;
  designImage: string | null;
  designPosition?: { y: number; scale: number };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TShirtPreview({
  color,
  designImage,
  designPosition = { y: 35, scale: 1 },
  size = "md",
  className,
}: TShirtPreviewProps) {
  const colorData = TSHIRT_COLORS[color];

  const sizes = {
    sm: "max-w-[200px]",
    md: "max-w-[320px]",
    lg: "max-w-[400px]",
  };

  // Calculate design dimensions
  const designWidth = 40 * designPosition.scale; // Base width is 40%

  return (
    <div className={cn("relative w-full mx-auto", sizes[size], className)}>
      {/* T-Shirt Shape SVG */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}
      >
        {/* T-Shirt Path */}
        <path
          d="M40 0 L80 0 Q100 20 120 0 L160 0 L200 40 L180 60 L160 50 L160 240 L40 240 L40 50 L20 60 L0 40 Z"
          fill={colorData.hex}
          stroke="var(--border-default)"
          strokeWidth="0.5"
        />
        {/* Collar */}
        <path
          d="M80 0 Q100 25 120 0"
          fill="none"
          stroke={color === "midnight-black" ? "#333" : "#ddd"}
          strokeWidth="1.5"
        />
      </svg>

      {/* Design Overlay */}
      {designImage && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200"
          style={{
            top: `${designPosition.y}%`,
            width: `${designWidth}%`,
          }}
        >
          <img
            src={designImage}
            alt="Your design"
            className="w-full h-auto object-contain rounded-sm"
            style={{
              maxHeight: "45%",
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!designImage && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[35%] aspect-square flex items-center justify-center rounded-lg border-2 border-dashed"
          style={{
            top: `${designPosition.y}%`,
            borderColor: color === "midnight-black" ? "#444" : "var(--border-default)",
          }}
        >
          <span
            className="text-xs font-medium text-center px-2"
            style={{
              color: color === "midnight-black" ? "#666" : "var(--text-tertiary)",
            }}
          >
            Your design here
          </span>
        </div>
      )}
    </div>
  );
}
