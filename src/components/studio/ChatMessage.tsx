"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/stores/useConversationStore";
import { Button } from "@/components/ui";

interface ChatMessageProps {
  message: ConversationMessage;
  onSelectDesign?: (imageData: string) => void;
  isSelected?: boolean;
}

export function ChatMessage({ message, onSelectDesign, isSelected }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Extract text and images from parts
  const textParts = message.parts.filter((p) => p.type === "text");
  const imageParts = message.parts.filter((p) => p.type === "image");

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => new Set(prev).add(idx));
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
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-transform duration-300 hover:scale-105",
          isUser
            ? "bg-gradient-to-br from-[var(--brand-charcoal)] to-[var(--brand-black)] text-white shadow-md"
            : "bg-gradient-to-br from-[var(--brand-cream)] to-[var(--surface-raised)] text-[var(--brand-charcoal)] border border-[var(--border-default)] shadow-sm"
        )}
      >
        {isUser ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-3 max-w-[85%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Text Content */}
        {textParts.map((part, idx) => (
          <div
            key={`text-${idx}`}
            className={cn(
              "px-4 py-3 rounded-[18px] text-sm leading-relaxed transition-all duration-300",
              isUser
                ? "bg-gradient-to-br from-[var(--brand-charcoal)] to-[#252525] text-white rounded-tr-[6px] shadow-md"
                : "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-tl-[6px] shadow-sm"
            )}
          >
            {part.content}
          </div>
        ))}

        {/* Image Content */}
        {imageParts.map((part, idx) => {
          const imageUrl = `data:${part.mimeType || "image/png"};base64,${part.content}`;
          const isLoaded = loadedImages.has(idx);

          return (
            <div key={`image-${idx}`} className="relative group">
              <div
                className={cn(
                  "relative rounded-[20px] overflow-hidden border-2 transition-all duration-300 ease-out",
                  isSelected
                    ? "border-[var(--accent-success)] shadow-[0_8px_32px_rgba(45,106,79,0.2)]"
                    : "border-[var(--border-default)] hover:border-[var(--brand-charcoal)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
                  !isLoaded && "min-h-[200px] min-w-[200px]"
                )}
              >
                {/* Loading skeleton */}
                {!isLoaded && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-[var(--surface-default)] via-[var(--surface-raised)] to-[var(--surface-default)] bg-[length:200%_100%]" />
                )}

                <img
                  src={imageUrl}
                  alt={isUser ? "Uploaded image" : "Generated design"}
                  className={cn(
                    "max-w-[400px] max-h-[400px] w-auto h-auto object-contain bg-white transition-all duration-500",
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                  onLoad={() => handleImageLoad(idx)}
                />

                {/* Selection overlay for AI-generated images */}
                {!isUser && onSelectDesign && isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <Button
                      size="sm"
                      onClick={() => onSelectDesign(imageUrl)}
                      className={cn(
                        "shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300",
                        isSelected && "bg-[var(--accent-success)] hover:bg-[var(--accent-success)]"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Selected
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
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
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--accent-success)] flex items-center justify-center shadow-lg animate-scale-in">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      className="w-4 h-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Helper text for AI images */}
              {!isUser && isLoaded && (
                <p className="mt-2 text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  {isSelected ? "Design selected for your t-shirt" : "Hover to select this design"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
