"use client";

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

  // Extract text and images from parts
  const textParts = message.parts.filter((p) => p.type === "text");
  const imageParts = message.parts.filter((p) => p.type === "image");

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
          isUser
            ? "bg-[var(--brand-charcoal)] text-white"
            : "bg-[var(--brand-cream)] text-[var(--brand-charcoal)] border border-[var(--border-default)]"
        )}
      >
        {isUser ? "U" : "D"}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Text Content */}
        {textParts.map((part, idx) => (
          <div
            key={`text-${idx}`}
            className={cn(
              "px-4 py-3 rounded-[16px] text-sm leading-relaxed",
              isUser
                ? "bg-[var(--brand-charcoal)] text-white rounded-tr-[4px]"
                : "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-tl-[4px]"
            )}
          >
            {part.content}
          </div>
        ))}

        {/* Image Content */}
        {imageParts.map((part, idx) => {
          const imageUrl = `data:${part.mimeType || "image/png"};base64,${part.content}`;

          return (
            <div key={`image-${idx}`} className="relative group">
              <div
                className={cn(
                  "relative rounded-[16px] overflow-hidden border-2 transition-all",
                  isSelected
                    ? "border-[var(--accent-success)] shadow-lg"
                    : "border-[var(--border-default)] hover:border-[var(--border-hover)]"
                )}
              >
                <img
                  src={imageUrl}
                  alt={isUser ? "Uploaded image" : "Generated design"}
                  className="max-w-[300px] max-h-[300px] object-contain bg-white"
                />

                {/* Selection overlay for AI-generated images */}
                {!isUser && onSelectDesign && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      onClick={() => onSelectDesign(imageUrl)}
                      className="shadow-lg"
                    >
                      {isSelected ? "Selected" : "Use This Design"}
                    </Button>
                  </div>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--accent-success)] flex items-center justify-center">
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

              {/* Image label */}
              {!isUser && (
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  Click to use this design
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
