"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processFile = useCallback((file: File) => {
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
    reader.onload = () => {
      const result = reader.result as string;
      const newImage: AttachedImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        data: result,
        mimeType: file.type,
        preview: result,
      };

      setAttachedImages((prev) => {
        if (prev.length >= MAX_IMAGES) {
          setError(`Maximum ${MAX_IMAGES} images allowed`);
          return prev;
        }
        return [...prev, newImage];
      });
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

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Attached Images Preview */}
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[var(--surface-raised)] rounded-[12px] border border-[var(--border-default)]">
          {attachedImages.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.preview}
                alt="Attached"
                className="w-16 h-16 object-cover rounded-[8px] border border-[var(--border-default)]"
              />
              <button
                onClick={() => handleRemoveImage(img.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--accent-error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {attachedImages.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-[8px] border-2 border-dashed border-[var(--border-default)] hover:border-[var(--border-hover)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-[var(--accent-error)]">{error}</p>
      )}

      {/* Input Area */}
      <div
        className={cn(
          "flex items-end gap-2 p-3 rounded-[16px] border transition-all",
          isDisabled
            ? "bg-[var(--surface-default)] border-[var(--border-default)]"
            : "bg-[var(--surface-raised)] border-[var(--border-default)] focus-within:border-[var(--brand-charcoal)]"
        )}
      >
        {/* Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || attachedImages.length >= MAX_IMAGES}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isDisabled || attachedImages.length >= MAX_IMAGES
              ? "text-[var(--text-tertiary)] cursor-not-allowed"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-default)]"
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
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
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            "flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none outline-none text-sm leading-relaxed max-h-[150px]",
            isDisabled && "cursor-not-allowed opacity-50"
          )}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isDisabled || (!message.trim() && attachedImages.length === 0)}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isDisabled || (!message.trim() && attachedImages.length === 0)
              ? "bg-[var(--surface-default)] text-[var(--text-tertiary)] cursor-not-allowed"
              : "bg-[var(--brand-charcoal)] text-white hover:bg-[var(--brand-black)]"
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-[var(--text-tertiary)] text-center">
        Press Enter to send, Shift+Enter for new line. Paste or attach up to {MAX_IMAGES} images.
      </p>
    </div>
  );
}
