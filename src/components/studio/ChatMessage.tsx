"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/stores/useConversationStore";
import { removeBackground } from "@/lib/removeBackground";
import { Button } from "@/components/ui";

interface ChatMessageProps {
  message: ConversationMessage;
  onSelectDesign?: (imageData: string) => void;
  isSelected?: boolean;
}

export function ChatMessage({ message, onSelectDesign, isSelected }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [removedBgImages, setRemovedBgImages] = useState<Record<number, string>>({});
  const [removingBg, setRemovingBg] = useState<Record<number, boolean>>({});

  const textParts = message.parts.filter((p) => p.type === "text");
  const imageParts = message.parts.filter((p) => p.type === "image");

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => new Set(prev).add(idx));
  };

  const handleRemoveBg = async (idx: number, imageUrl: string) => {
    setRemovingBg((prev) => ({ ...prev, [idx]: true }));
    try {
      const result = await removeBackground(imageUrl, { threshold: 45, feather: 3 });
      setRemovedBgImages((prev) => ({ ...prev, [idx]: result }));
    } catch (error) {
      console.error("Background removal failed:", error);
    } finally {
      setRemovingBg((prev) => ({ ...prev, [idx]: false }));
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-message-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-transform duration-300 hover:scale-105",
          isUser
            ? "bg-[var(--brand-charcoal)] text-white shadow-sm"
            : "bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--border-accent)]"
        )}
      >
        {isUser ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-3 max-w-[82%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Text Content */}
        {textParts.map((part, idx) => (
          <div
            key={`text-${idx}`}
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300",
              isUser
                ? "bg-[var(--accent-primary)] text-white rounded-tr-md shadow-sm"
                : "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-tl-md shadow-sm"
            )}
          >
            {part.content}
          </div>
        ))}

        {/* Image Content */}
        {imageParts.map((part, idx) => {
          const originalImageUrl = `data:${part.mimeType || "image/png"};base64,${part.content}`;
          const displayImageUrl = removedBgImages[idx] ?? originalImageUrl;
          const isLoaded = loadedImages.has(idx);

          return (
            <div key={`image-${idx}`} className="relative group">
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ease-out",
                  !isUser && "checkerboard",
                  isSelected
                    ? "border-[var(--accent-primary)] shadow-[var(--shadow-glow)] animate-glow-pulse"
                    : "border-[var(--border-default)] hover:border-[var(--accent-primary)]/40 hover:shadow-[var(--shadow-medium)]",
                  !isLoaded && "min-h-[200px] min-w-[200px]"
                )}
              >
                {/* Loading skeleton */}
                {!isLoaded && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-[var(--surface-default)] via-[var(--surface-overlay)] to-[var(--surface-default)] bg-[length:200%_100%]" />
                )}

                <img
                  src={displayImageUrl}
                  alt={isUser ? "Uploaded image" : "Generated design"}
                  className={cn(
                    "max-w-[380px] max-h-[380px] w-auto h-auto object-contain transition-all duration-500",
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                  style={{ backgroundColor: "transparent" }}
                  onLoad={() => handleImageLoad(idx)}
                />

                {/* Selection overlay for AI-generated images */}
                {!isUser && onSelectDesign && isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5 gap-2">
                    {!removedBgImages[idx] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveBg(idx, originalImageUrl)}
                        disabled={removingBg[idx]}
                        className="shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1.5">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11l1 9h2l1-9m-4 0h4" />
                        </svg>
                        {removingBg[idx] ? "Removing..." : "Remove BG"}
                      </Button>
                    )}
                    {removedBgImages[idx] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled
                        className="shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 !bg-[var(--accent-success)]/10 !text-[var(--accent-success)]"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        BG Removed
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onSelectDesign(displayImageUrl)}
                      className={cn(
                        "shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300",
                        isSelected && "!bg-[var(--accent-success)] !text-white hover:!bg-[var(--accent-success)]"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 mr-1.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Selected
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 mr-1.5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          Use This Design
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Selected indicator badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-lg animate-scale-in">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Helper text for AI images */}
              {!isUser && isLoaded && (
                <p className="mt-2 text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                    <path d="M15 15l-2 5L9 9l11 4-5 2z" />
                  </svg>
                  {isSelected ? "Design selected — continue below" : "Hover to select this design"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
