"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { preprocessImage, needsPreprocessing } from "@/lib/imagePreprocess";
import { StyleSelector } from "./StyleSelector";
import type { ImageStyleId } from "@/constants/styles";
import type { AspectRatioId } from "@/constants/prompts";

interface AttachedImage {
  id: string;
  data: string;
  mimeType: string;
  preview: string;
}

interface ChatInputProps {
  onSend: (message: string, images: { data: string; mimeType: string }[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  /** When provided, shows a settings icon that opens a dropdown for style and aspect ratio */
  imageStyle?: ImageStyleId;
  aspectRatio?: AspectRatioId;
  onImageStyleChange?: (value: ImageStyleId) => void;
  onAspectRatioChange?: (value: AspectRatioId) => void;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 3;

export function ChatInput({
  onSend,
  isDisabled = false,
  placeholder = "Describe your design idea...",
  imageStyle,
  aspectRatio,
  onImageStyleChange,
  onAspectRatioChange,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const showSettings = imageStyle !== undefined && aspectRatio !== undefined && onImageStyleChange && onAspectRatioChange;

  useEffect(() => {
    if (!settingsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsOpen]);

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
        let processedData = result;
        let processedMimeType = file.type;

        if (needsPreprocessing(result)) {
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
    reader.onerror = () => setError("Failed to read image");
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) Array.from(files).forEach(processFile);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  const handleRemoveImage = useCallback((id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleSend = useCallback(() => {
    if ((!message.trim() && attachedImages.length === 0) || isDisabled) return;

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
          if (file) processFile(file);
          break;
        }
      }
    },
    [processFile]
  );

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
          if (file.type.startsWith("image/")) processFile(file);
        });
      }
    },
    [processFile]
  );

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
      className="space-y-2.5"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="rounded-2xl p-8 border-2 border-dashed border-[var(--accent-primary)] bg-[var(--surface-overlay)] shadow-2xl animate-scale-in">
            <div className="text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="w-10 h-10 mx-auto mb-3">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-base font-medium text-[var(--text-primary)]">Drop images here</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">PNG, JPG, or WebP up to {MAX_SIZE_MB}MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Attached Images Preview */}
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[var(--surface-overlay)] rounded-xl border border-[var(--border-default)] animate-scale-in relative">
          {attachedImages.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.preview}
                alt="Attached"
                className="w-16 h-16 object-cover rounded-lg border border-[var(--border-default)] transition-transform duration-200 group-hover:scale-105"
              />
              <button
                onClick={() => handleRemoveImage(img.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--accent-error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {attachedImages.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg border border-dashed border-[var(--border-hover)] hover:border-[var(--accent-primary)]/40 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
          <span className="absolute top-1.5 right-2 text-[10px] text-[var(--text-tertiary)]">
            {attachedImages.length}/{MAX_IMAGES}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/20 animate-scale-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-error)" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-[var(--accent-error)]">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div ref={settingsRef} className="relative">
        {/* Style & resolution dropdown */}
        {showSettings && settingsOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-[min(320px,calc(100vw-2rem))] rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-lift)] p-3 space-y-3 z-50 animate-slide-down">
            <StyleSelector value={imageStyle!} onChange={onImageStyleChange!} size="compact" />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                Aspect ratio
              </label>
              <div className="flex gap-1.5">
                {(["1:1", "16:9", "9:16"] as const).map((ratio) => {
                  const isActive = aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => onAspectRatioChange!(ratio)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200",
                        isActive
                          ? "border-[var(--border-accent)] bg-[var(--accent-primary)]/8 text-[var(--accent-primary)]"
                          : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block border rounded-sm",
                          isActive ? "border-[var(--accent-primary)]/50" : "border-current opacity-40",
                          ratio === "1:1" ? "w-2.5 h-2.5" : ratio === "16:9" ? "w-3.5 h-2" : "w-2 h-3.5"
                        )}
                      />
                      {ratio}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      <div
        className={cn(
          "flex items-end gap-2 p-2.5 rounded-2xl border transition-all duration-300",
          isDisabled
            ? "bg-[var(--surface-default)] border-[var(--border-default)] opacity-50"
            : isDragOver
            ? "bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30"
            : isFocused
            ? "bg-[var(--surface-overlay)] border-[var(--border-hover)] shadow-[0_0_0_3px_rgba(79,109,245,0.08)]"
            : "bg-[var(--surface-overlay)] border-[var(--border-default)] hover:border-[var(--border-hover)]"
        )}
      >
        {/* Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || attachedImages.length >= MAX_IMAGES}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
            isDisabled || attachedImages.length >= MAX_IMAGES
              ? "text-[var(--text-tertiary)] cursor-not-allowed"
              : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/8 active:scale-95"
          )}
          title={attachedImages.length >= MAX_IMAGES ? "Maximum images reached" : "Attach image"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
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

        {/* Style & resolution trigger (inside input row) */}
        {showSettings && (
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
              settingsOpen
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/8 active:scale-95"
            )}
            title="Style & aspect ratio"
            aria-expanded={settingsOpen}
            aria-haspopup="true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </button>
        )}

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
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
            !canSend
              ? "bg-[var(--surface-default)] text-[var(--text-tertiary)] cursor-not-allowed"
              : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] hover:shadow-md active:scale-95 shadow-sm"
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)] px-1 opacity-60">
        <p className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded text-[9px] font-mono">Enter</kbd>
          <span>send</span>
          <span className="mx-0.5 text-[var(--border-hover)]">/</span>
          <kbd className="px-1 py-0.5 bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded text-[9px] font-mono">Shift+Enter</kbd>
          <span>new line</span>
        </p>
        <p className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Drop or paste images
        </p>
      </div>
    </div>
  );
}
