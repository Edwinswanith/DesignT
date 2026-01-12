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
} from "@/components/studio";
import { useConversationStore, MessagePart } from "@/stores/useConversationStore";
import { useProductStore } from "@/stores/useProductStore";
import { useDesignStore } from "@/stores/useDesignStore";

// Suggestions for empty state
const PROMPT_SUGGESTIONS = [
  "A minimalist mountain silhouette at sunset",
  "Retro 80s synthwave palm trees",
  "Japanese wave illustration",
  "Abstract geometric patterns",
  "Vintage motorcycle illustration",
  "Botanical line art flowers",
];

export default function StudioPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState("Creating your design...");

  const {
    messages,
    isGenerating,
    error,
    selectedDesign,
    addUserMessage,
    addModelMessage,
    setGenerating,
    setError,
    setSelectedDesign,
    clearConversation,
    getGeminiHistory,
  } = useConversationStore();

  const { color, setColor, designPosition } = useProductStore();
  const { setCurrentDesign, setMode } = useDesignStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (text: string, images: { data: string; mimeType: string }[]) => {
      // Add user message to conversation
      addUserMessage(text, images);

      setGenerating(true);
      setError(null);

      // Progress messages
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
        // Get full conversation history for API
        const history = getGeminiHistory();

        const response = await fetch("/api/generate-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: history }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate design");
        }

        // Build model response parts
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

        // Add model response to conversation
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
    [addUserMessage, addModelMessage, setGenerating, setError, getGeminiHistory]
  );

  // Handle selecting a design to use
  const handleSelectDesign = useCallback(
    (imageData: string) => {
      setSelectedDesign(imageData);
      setCurrentDesign(imageData);
      setMode("ai");
    },
    [setSelectedDesign, setCurrentDesign, setMode]
  );

  // Handle continuing to customization
  const handleContinue = useCallback(() => {
    if (selectedDesign) {
      router.push("/studio/customize");
    }
  }, [selectedDesign, router]);

  // Handle starting fresh
  const handleNewConversation = useCallback(() => {
    clearConversation();
    setSelectedDesign(null);
  }, [clearConversation, setSelectedDesign]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion, []);
    },
    [handleSendMessage]
  );

  const hasMessages = messages.length > 0;

  return (
    <StudioLayout currentStep={1}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Left Panel - Chat Interface */}
        <div className="lg:col-span-3 flex flex-col bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
            <div>
              <h2 className="text-lg font-serif text-[var(--text-primary)]">
                Design Studio
              </h2>
              <p className="text-sm text-[var(--text-tertiary)]">
                Describe your idea, upload references, and refine with AI
              </p>
            </div>
            {hasMessages && (
              <button
                onClick={handleNewConversation}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
              >
                Start Fresh
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Empty State */}
            {!hasMessages && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-[var(--brand-cream)] flex items-center justify-center mb-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brand-charcoal)"
                    strokeWidth="1.5"
                    className="w-8 h-8"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">
                  What would you like to create?
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md">
                  Describe your design idea, upload reference images, or try one of these suggestions
                </p>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 text-sm rounded-full border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-charcoal)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {suggestion}
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
                      selectedDesign?.includes(p.content.slice(0, 50))
                  )
                }
              />
            ))}

            {/* Loading State */}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--brand-cream)] flex items-center justify-center text-sm font-medium text-[var(--brand-charcoal)] border border-[var(--border-default)]">
                  D
                </div>
                <div className="px-4 py-3 rounded-[16px] rounded-tl-[4px] bg-[var(--surface-default)] border border-[var(--border-default)]">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[var(--brand-charcoal)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {loadingMessage}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-center">
                <div className="px-4 py-3 rounded-[12px] bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/20 text-[var(--accent-error)] text-sm">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--border-default)]">
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

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* T-Shirt Preview */}
          <div className="flex-1 bg-[var(--surface-raised)] rounded-[24px] p-6 border border-[var(--border-default)] flex flex-col">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
              Preview
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <TShirtPreview
                color={color}
                designImage={selectedDesign}
                designPosition={designPosition}
                size="lg"
              />
            </div>
          </div>

          {/* Quick Color Switcher */}
          <div className="bg-[var(--surface-raised)] rounded-[20px] p-4 border border-[var(--border-default)]">
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
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Button>

          {/* Help Text */}
          {!selectedDesign && hasMessages && (
            <p className="text-xs text-[var(--text-tertiary)] text-center">
              Click on a generated design to select it for your t-shirt
            </p>
          )}
        </div>
      </div>
    </StudioLayout>
  );
}
