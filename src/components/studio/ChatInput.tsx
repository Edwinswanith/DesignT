"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { preprocessImage, needsPreprocessing } from "@/lib/imagePreprocess";

interface AttachedImage {
  id: string;
  data: string; // Full data URL
  mimeType: string;
  preview: string; // For display
}

interface ChatInputProps {
  onSend: (message: string, images: { data: string; mimeType: string }[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 3;

export function ChatInput({
  onSend,
  isDisabled = false,
  placeholder = "Describe your design idea...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload PNG, JPG, or WebP images");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`Images must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = reader.result as string;

        // Preprocess large images for better API performance
        let processedData = result;
        let processedMimeType = file.type;

        if (needsPreprocessing(result)) {
          console.log("[ChatInput] Large image detected, preprocessing...");
          const processed = await preprocessImage(result, {
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.85,
            outputFormat: "jpeg",
          });
          processedData = processed.data;
          processedMimeType = processed.mimeType;
        }

        const newImage: AttachedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          data: processedData,
          mimeType: processedMimeType,
          preview: processedData,
        };

        setAttachedImages((prev) => {
          if (prev.length >= MAX_IMAGES) {
            setError(`Maximum ${MAX_IMAGES} images allowed`);
            return prev;
          }
          return [...prev, newImage];
        });
      } catch (err) {
        console.error("[ChatInput] Image processing error:", err);
        setError("Failed to process image");
      }
    };
    reader.onerror = () => {
      setError("Failed to read image");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach(processFile);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFile]
  );

  const handleRemoveImage = useCallback((id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleSend = useCallback(() => {
    if ((!message.trim() && attachedImages.length === 0) || isDisabled) {
      return;
    }

    const images = attachedImages.map((img) => ({
      data: img.data,
      mimeType: img.mimeType,
    }));

    onSend(message.trim(), images);
    setMessage("");
    setAttachedImages([]);
    setError(null);
  }, [message, attachedImages, isDisabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    },
    [processFile]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files) {
        Array.from(files).forEach((file) => {
          if (file.type.startsWith("image/")) {
            processFile(file);
          }
        });
      }
    },
    [processFile]
  );

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  const canSend = !isDisabled && (message.trim() || attachedImages.length > 0);

  return (
    <div
      className="space-y-3"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-[var(--brand-charcoal)]/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-[24px] p-8 shadow-2xl border-2 border-dashed border-[var(--brand-charcoal)] animate-scale-in">
            <div className="text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--brand-charcoal)" strokeWidth="1.5" className="w-12 h-12 mx-auto mb-3">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-lg font-medium text-[var(--text-primary)]">Drop images here</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">PNG, JPG, or WebP up to {MAX_SIZE_MB}MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Attached Images Preview */}
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-3 p-4 bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] animate-scale-in">
          {attachedImages.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.preview}
                alt="Attached"
                className="w-20 h-20 object-cover rounded-[12px] border border-[var(--border-default)] shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <button
                onClick={() => handleRemoveImage(img.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {attachedImages.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-[12px] border-2 border-dashed border-[var(--border-default)] hover:border-[var(--brand-charcoal)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--surface-default)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}

          {/* Attachment count badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--brand-charcoal)] text-white text-xs rounded-full">
            {attachedImages.length}/{MAX_IMAGES}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/20 animate-scale-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-error)" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-[var(--accent-error)]">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div
        className={cn(
          "flex items-end gap-3 p-3 rounded-[20px] border-2 transition-all duration-300",
          isDisabled
            ? "bg-[var(--surface-default)] border-[var(--border-default)] opacity-60"
            : isDragOver
            ? "bg-[var(--accent-success)]/5 border-[var(--accent-success)]"
            : isFocused
            ? "bg-[var(--surface-raised)] border-[var(--brand-charcoal)] shadow-[0_0_0_4px_rgba(26,26,26,0.06)]"
            : "bg-[var(--surface-raised)] border-[var(--border-default)] hover:border-[var(--border-hover)]"
        )}
      >
        {/* Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || attachedImages.length >= MAX_IMAGES}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
            isDisabled || attachedImages.length >= MAX_IMAGES
              ? "text-[var(--text-tertiary)] cursor-not-allowed"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-default)] active:scale-95"
          )}
          title={attachedImages.length >= MAX_IMAGES ? "Maximum images reached" : "Attach image"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            "flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none outline-none text-sm leading-relaxed max-h-[150px] py-2",
            isDisabled && "cursor-not-allowed"
          )}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
            !canSend
              ? "bg-[var(--surface-default)] text-[var(--text-tertiary)] cursor-not-allowed"
              : "bg-[var(--brand-charcoal)] text-white hover:bg-[var(--brand-black)] active:scale-95 shadow-md hover:shadow-lg"
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
        <p className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded text-[10px] font-mono">Enter</kbd>
          <span>to send</span>
          <span className="mx-1 text-[var(--border-default)]">|</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded text-[10px] font-mono">Shift + Enter</kbd>
          <span>new line</span>
        </p>
        <p className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Drop or paste images</span>
        </p>
      </div>
    </div>
  );
}
