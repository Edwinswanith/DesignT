"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  TShirtPreview,
  ChatMessage,
  ChatInput,
  ColorSelector,
  StyleSelector,
  AspectRatioSelector,
  ShowBackButton,
} from "@/components/studio";
import { useConversationStore, MessagePart } from "@/stores/useConversationStore";
import { useProductStore } from "@/stores/useProductStore";
import { useDesignStore } from "@/stores/useDesignStore";

// Suggestions for empty state
const PROMPT_SUGGESTIONS = [
  { text: "A minimalist mountain silhouette at sunset", icon: "mountain" },
  { text: "Retro 80s synthwave palm trees", icon: "palm" },
  { text: "Japanese wave illustration", icon: "wave" },
  { text: "Abstract geometric patterns", icon: "geo" },
  { text: "Vintage motorcycle illustration", icon: "moto" },
  { text: "Botanical line art flowers", icon: "flower" },
];

function SuggestionIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = className || "w-4 h-4";
  switch (icon) {
    case "mountain":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M8 21l4-10 4 10" /><path d="M2 21h20" /><path d="M15 7l3 6" /><circle cx="18" cy="5" r="2" /></svg>;
    case "palm":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M12 21V11" /><path d="M5 11c3-3 5-3 7 0" /><path d="M19 11c-3-3-5-3-7 0" /><path d="M3 8c4-4 6-3 9 0" /><path d="M21 8c-4-4-6-3-9 0" /></svg>;
    case "wave":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /><path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /></svg>;
    case "geo":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg>;
    case "moto":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" /><path d="M5 14l4-7h6l2 3h3" /></svg>;
    case "flower":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><circle cx="12" cy="12" r="3" /><path d="M12 2a4 4 0 010 6 4 4 0 010-6z" /><path d="M19 5a4 4 0 01-4 5 4 4 0 014-5z" /><path d="M22 12a4 4 0 01-6 0 4 4 0 016 0z" /><path d="M12 22a4 4 0 010-6 4 4 0 010 6z" /></svg>;
    default:
      return null;
  }
}

export default function StudioPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState("Creating your design...");
  const [side, setSide] = useState<"front" | "back">("front");

  const {
    messages,
    isGenerating,
    error,
    selectedDesign,
    aspectRatio,
    imageStyle,
    addUserMessage,
    addModelMessage,
    setGenerating,
    setError,
    setSelectedDesign,
    setAspectRatio,
    setImageStyle,
    clearConversation,
    getGeminiHistory,
  } = useConversationStore();

  const { color, setColor, designPosition } = useProductStore();
  const { setCurrentDesign, setMode, backDesign, setBackDesign } = useDesignStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (text: string, images: { data: string; mimeType: string }[]) => {
      addUserMessage(text, images);
      setGenerating(true);
      setError(null);

      const progressMessages = [
        "Creating your design...",
        "Adding details...",
        "Refining the artwork...",
        "Almost there...",
      ];
      let messageIndex = 0;
      setLoadingMessage(progressMessages[0]);

      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % progressMessages.length;
        setLoadingMessage(progressMessages[messageIndex]);
      }, 2500);

      try {
        const history = getGeminiHistory();

        const response = await fetch("/api/generate-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: history,
            aspectRatio,
            style: imageStyle !== "none" ? imageStyle : undefined,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate design");
        }

        const modelParts: MessagePart[] = [];

        if (data.text) {
          modelParts.push({ type: "text", content: data.text });
        }

        if (data.image) {
          modelParts.push({
            type: "image",
            content: data.image.data,
            mimeType: data.image.mimeType,
          });
        }

        addModelMessage(modelParts);
      } catch (err) {
        console.error("Generation error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate design. Please try again."
        );
      } finally {
        clearInterval(messageInterval);
        setGenerating(false);
      }
    },
    [addUserMessage, addModelMessage, setGenerating, setError, getGeminiHistory, aspectRatio, imageStyle]
  );

  const handleSelectDesign = useCallback(
    (imageData: string) => {
      if (side === "back") {
        setBackDesign(imageData);
      } else {
        setSelectedDesign(imageData);
        setCurrentDesign(imageData);
        setMode("ai");
      }
    },
    [side, setSelectedDesign, setCurrentDesign, setMode]
  );

  const handleContinue = useCallback(() => {
    if (selectedDesign) {
      router.push("/studio/customize");
    }
  }, [selectedDesign, router]);

  const handleNewConversation = useCallback(() => {
    clearConversation();
    setSelectedDesign(null);
    setBackDesign(null);
    setSide("front");
  }, [clearConversation, setSelectedDesign, setBackDesign]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion, []);
    },
    [handleSendMessage]
  );

  const hasMessages = messages.length > 0;

  return (
    <StudioLayout currentStep={1}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-120px)] min-h-[600px]">

        {/* ── Left Panel — Chat Interface ── */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface-raised)] relative">
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-default)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-inset)] flex items-center justify-center border border-[var(--border-default)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans tracking-wide">
                  Design Studio
                </h2>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Describe, upload, refine with AI
                </p>
              </div>
            </div>
            {hasMessages && (
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors duration-200 px-2.5 py-1.5 rounded-lg hover:bg-[var(--accent-primary)]/5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
                New
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Empty State */}
            {!hasMessages && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                {/* Animated icon cluster */}
                <div className="relative mb-8 animate-float">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--surface-inset)] flex items-center justify-center border border-[var(--border-default)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="w-7 h-7">
                      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
                    </svg>
                  </div>
                  {/* Decorative orbiting dots */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-primary)]/40 animate-pulse" />
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]/25 animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-2">
                  What would you like to create?
                </h3>
                <p className="text-sm text-[var(--text-tertiary)] mb-8 max-w-sm leading-relaxed">
                  Describe your vision, upload references, or pick a starting point
                </p>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg w-full">
                  {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group flex items-center gap-2 px-3 py-2.5 text-xs text-left rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all duration-200"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <SuggestionIcon icon={suggestion.icon} className="w-3.5 h-3.5" />
                      </span>
                      <span className="line-clamp-2 leading-snug">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onSelectDesign={message.role === "model" ? handleSelectDesign : undefined}
                isSelected={
                  message.role === "model" &&
                  message.parts.some(
                    (p) =>
                      p.type === "image" &&
                      (selectedDesign?.includes(p.content.slice(0, 50)) ||
                        backDesign?.includes(p.content.slice(0, 50)))
                  )
                }
              />
            ))}

            {/* Loading State */}
            {isGenerating && (
              <div className="flex gap-3 animate-message-enter">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent flex items-center justify-center border border-[var(--border-accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="w-3.5 h-3.5">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                  </svg>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-[var(--surface-overlay)] border border-[var(--border-default)]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce-dot" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce-dot" style={{ animationDelay: "160ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce-dot" style={{ animationDelay: "320ms" }} />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] italic pl-1 animate-thinking-pulse">
                    {loadingMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-center animate-scale-in">
                <div className="px-4 py-3 rounded-xl bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/20 text-[var(--accent-error)] text-sm flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3.5 border-t border-[var(--border-default)]">
            <ChatInput
              onSend={handleSendMessage}
              isDisabled={isGenerating}
              placeholder={
                hasMessages
                  ? "Ask for changes or describe a new design..."
                  : "Describe your t-shirt design idea..."
              }
            />
          </div>
        </div>

        {/* ── Right Panel — Preview & Controls ── */}
        <div className="lg:col-span-6 flex flex-col gap-4">

          {/* T-Shirt Preview Card */}
          <div className="flex-1 rounded-2xl p-5 border border-[var(--border-default)] bg-[var(--surface-raised)] flex flex-col relative overflow-hidden">
            {/* Subtle top edge highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

            {/* Ambient glow behind preview when design selected */}
            {selectedDesign && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[var(--accent-primary)]/5 blur-3xl" />
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                Preview
              </h3>
              <div className="flex items-center gap-2">
                {(selectedDesign || backDesign) && (
                  <ShowBackButton
                    side={side}
                    onToggle={setSide}
                    hasBackDesign={!!(selectedDesign || backDesign)}
                  />
                )}
                {(selectedDesign || backDesign) && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--accent-success)] bg-[var(--accent-success)]/10 px-2 py-0.5 rounded-full">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Design selected
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <TShirtPreview
                color={color}
                designImage={selectedDesign}
                backDesignImage={backDesign}
                designPosition={designPosition}
                size="lg"
                side={side}
              />
            </div>
          </div>

          {/* Design Options Panel */}
          <div className="rounded-2xl p-4 border border-[var(--border-default)] bg-[var(--surface-raised)] space-y-4 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

            <StyleSelector value={imageStyle} onChange={setImageStyle} size="compact" />

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                Aspect Ratio
              </label>
              <div className="flex gap-1.5">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => {
                  const isActive = aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`
                        flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200
                        ${isActive
                          ? "border-[var(--border-accent)] bg-[var(--accent-primary)]/8 text-[var(--accent-primary)]"
                          : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                        }
                      `}
                    >
                      {/* Tiny ratio icon */}
                      <span className={`
                        inline-block border rounded-sm
                        ${isActive ? "border-[var(--accent-primary)]/50" : "border-current opacity-40"}
                        ${ratio === "1:1" ? "w-2.5 h-2.5" : ratio === "16:9" ? "w-3.5 h-2" : "w-2 h-3.5"}
                      `} />
                      {ratio}
                    </button>
                  );
                })}
              </div>
            </div>

            <ColorSelector value={color} onChange={setColor} size="compact" />
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            disabled={!selectedDesign}
            onClick={handleContinue}
            className="w-full"
          >
            Continue to Customize
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>

          {/* Help Text */}
          {!selectedDesign && hasMessages && (
            <p className="text-xs text-[var(--text-tertiary)] text-center flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M15 15l-2 5L9 9l11 4-5 2z" />
              </svg>
              Click on a generated design to select it
            </p>
          )}
        </div>
      </div>
    </StudioLayout>
  );
}
