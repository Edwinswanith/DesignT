"use client";

import { useId } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TShirtColorId } from "@/constants/colors";

interface TShirtPreviewProps {
  color: TShirtColorId;
  designImage: string | null;
  designPosition?: { y: number; scale: number };
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Map color IDs to mockup images
const MOCKUP_IMAGES: Record<TShirtColorId, string> = {
  "midnight-black": "/mockups/tshirt-black.png",
  "pure-white": "/mockups/tshirt-white.png",
  "silver-grey": "/mockups/tshirt-grey.png",
  "warm-beige": "/mockups/tshirt-beige.png",
  "cream": "/mockups/tshirt-cream.png",
};

export function TShirtPreview({
  color,
  designImage,
  designPosition = { y: 35, scale: 1 },
  size = "md",
  className,
}: TShirtPreviewProps) {
  const mockupImage = MOCKUP_IMAGES[color];
  const clipId = useId();
  const filterId = `fabric-warp-${useId()}`;

  const sizes = {
    sm: "max-w-[200px]",
    md: "max-w-[320px]",
    lg: "max-w-[400px]",
  };

  // Calculate design dimensions based on scale
  const designWidth = 42 * designPosition.scale;
  const designTop = designPosition.y + 5;

  return (
    <div className={cn("relative w-full mx-auto", sizes[size], className)}>
      {/* Realistic T-shirt mockup */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50">
        {/* Chest-shaped clip-path for design overlay (print area) */}
        <svg aria-hidden className="absolute w-0 h-0" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <rect x="0.02" y="0.02" width="0.96" height="0.96" rx="0.12" ry="0.12" />
            </clipPath>
            <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.025 0.015"
                numOctaves="4"
                seed="5"
                result="warpNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warpNoise"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
                result="warped"
              />
            </filter>
          </defs>
        </svg>
        <Image
          src={mockupImage}
          alt={`${color} t-shirt`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 200px, 400px"
          priority
        />

        {/* Design Overlay */}
        {designImage && (
          <div
            className="absolute pointer-events-none transition-all duration-300 ease-out overflow-hidden"
            style={{
              left: "50%",
              top: `${designTop}%`,
              width: `${designWidth}%`,
              clipPath: `url(#${clipId})`,
              transform: size === "sm"
                ? "translateX(-50%)"
                : "perspective(600px) rotateX(4deg) rotateY(0deg) translateX(-50%)",
              transformOrigin: "center top",
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
                opacity: color === "midnight-black" ? 0.95 : 0.88,
                filter: `url(#${filterId}) saturate(0.95) contrast(1.08)`,
              }}
            />
            {/* Fabric depth vignette — simulates the ink sitting in woven fabric */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(0,0,0,0.12) 100%)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {/* Empty State Placeholder */}
        {!designImage && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[35%] aspect-square flex items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300"
            style={{
              top: "38%",
              borderColor:
                color === "midnight-black"
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.15)",
              backgroundColor:
                color === "midnight-black"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
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
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.25)",
                }}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    color === "midnight-black"
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.35)",
                }}
              >
                Your design
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
