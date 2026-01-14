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

// Helper to darken/lighten colors for shading
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function TShirtPreview({
  color,
  designImage,
  designPosition = { y: 35, scale: 1 },
  size = "md",
  className,
}: TShirtPreviewProps) {
  const colorData = TSHIRT_COLORS[color];
  const baseColor = colorData.hex;
  const shadowColor = adjustColor(baseColor, -25);
  const highlightColor = adjustColor(baseColor, 15);
  const darkShadow = adjustColor(baseColor, -40);

  const sizes = {
    sm: "max-w-[200px]",
    md: "max-w-[320px]",
    lg: "max-w-[400px]",
  };

  // Calculate design dimensions based on scale
  const designWidth = 38 * designPosition.scale;
  const designMaxHeight = 42 * designPosition.scale;

  // Unique ID for gradients
  const gradientId = `tshirt-gradient-${color}`;
  const shadowGradientId = `tshirt-shadow-${color}`;
  const collarGradientId = `collar-gradient-${color}`;

  return (
    <div className={cn("relative w-full mx-auto", sizes[size], className)}>
      <svg
        viewBox="0 0 300 360"
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }}
      >
        <defs>
          {/* Main body gradient for depth */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="50%" stopColor={baseColor} />
            <stop offset="100%" stopColor={shadowColor} />
          </linearGradient>

          {/* Side shadow gradient */}
          <linearGradient id={shadowGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={darkShadow} stopOpacity="0.3" />
            <stop offset="15%" stopColor={baseColor} stopOpacity="0" />
            <stop offset="85%" stopColor={baseColor} stopOpacity="0" />
            <stop offset="100%" stopColor={darkShadow} stopOpacity="0.3" />
          </linearGradient>

          {/* Collar gradient */}
          <linearGradient id={collarGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={shadowColor} />
            <stop offset="100%" stopColor={baseColor} />
          </linearGradient>

          {/* Clip path for design area */}
          <clipPath id="design-clip">
            <ellipse cx="150" cy="180" rx="55" ry="70" />
          </clipPath>
        </defs>

        {/* T-Shirt Body - Professional shape */}
        <g>
          {/* Main body */}
          <path
            d="M60 55
               L60 340
               Q60 350 70 350
               L230 350
               Q240 350 240 340
               L240 55
               L200 75
               Q150 95 100 75
               L60 55"
            fill={`url(#${gradientId})`}
          />

          {/* Left sleeve */}
          <path
            d="M60 55
               L100 75
               Q85 85 75 95
               L20 75
               Q10 70 15 60
               L40 40
               Q50 35 60 40
               L60 55"
            fill={baseColor}
          />

          {/* Right sleeve */}
          <path
            d="M240 55
               L200 75
               Q215 85 225 95
               L280 75
               Q290 70 285 60
               L260 40
               Q250 35 240 40
               L240 55"
            fill={baseColor}
          />

          {/* Left sleeve shadow */}
          <path
            d="M60 55
               L100 75
               Q85 85 75 95
               L20 75
               Q10 70 15 60
               L40 40
               Q50 35 60 40
               L60 55"
            fill={shadowColor}
            opacity="0.15"
          />

          {/* Right sleeve highlight */}
          <path
            d="M240 55
               L200 75
               Q215 85 225 95
               L280 75
               Q290 70 285 60
               L260 40
               Q250 35 240 40
               L240 55"
            fill={highlightColor}
            opacity="0.1"
          />

          {/* Side shadows overlay */}
          <rect
            x="60"
            y="55"
            width="180"
            height="295"
            fill={`url(#${shadowGradientId})`}
          />

          {/* Collar */}
          <path
            d="M100 75
               Q120 50 150 45
               Q180 50 200 75
               Q175 85 150 88
               Q125 85 100 75"
            fill={`url(#${collarGradientId})`}
          />

          {/* Inner collar line */}
          <path
            d="M115 70
               Q135 55 150 52
               Q165 55 185 70"
            fill="none"
            stroke={shadowColor}
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Subtle body fold lines */}
          <path
            d="M90 150 Q95 200 90 280"
            fill="none"
            stroke={shadowColor}
            strokeWidth="0.5"
            opacity="0.15"
          />
          <path
            d="M210 150 Q205 200 210 280"
            fill="none"
            stroke={shadowColor}
            strokeWidth="0.5"
            opacity="0.15"
          />

          {/* Hem shadow */}
          <path
            d="M70 345 L230 345"
            fill="none"
            stroke={shadowColor}
            strokeWidth="2"
            opacity="0.2"
          />
        </g>

        {/* Outline for definition */}
        <g fill="none" stroke={color === "midnight-black" ? "#333" : "#00000015"} strokeWidth="0.5">
          {/* Body outline */}
          <path
            d="M60 55
               L60 340
               Q60 350 70 350
               L230 350
               Q240 350 240 340
               L240 55"
          />
          {/* Left sleeve outline */}
          <path
            d="M60 55 L100 75 Q85 85 75 95 L20 75 Q10 70 15 60 L40 40 Q50 35 60 40 L60 55"
          />
          {/* Right sleeve outline */}
          <path
            d="M240 55 L200 75 Q215 85 225 95 L280 75 Q290 70 285 60 L260 40 Q250 35 240 40 L240 55"
          />
        </g>
      </svg>

      {/* Design Overlay */}
      {designImage && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${designPosition.y}%`,
            width: `${designWidth}%`,
            maxHeight: `${designMaxHeight}%`,
          }}
        >
          <img
            src={
              designImage.startsWith("data:")
                ? designImage
                : `data:image/png;base64,${designImage}`
            }
            alt="Your design"
            className="w-full h-auto object-contain"
            style={{
              mixBlendMode: color === "midnight-black" ? "screen" : "multiply",
              opacity: color === "midnight-black" ? 0.95 : 0.9,
              filter: "contrast(1.05)",
            }}
          />
        </div>
      )}

      {/* Empty State Placeholder */}
      {!designImage && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[32%] aspect-square flex items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300"
          style={{
            top: "38%",
            borderColor:
              color === "midnight-black"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)",
            backgroundColor:
              color === "midnight-black"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
          }}
        >
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 mx-auto mb-1"
              style={{
                color:
                  color === "midnight-black"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.2)",
              }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span
              className="text-xs font-medium"
              style={{
                color:
                  color === "midnight-black"
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(0,0,0,0.3)",
              }}
            >
              Your design
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
