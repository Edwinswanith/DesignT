"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
          >
            {label}
            {props.required && (
              <span className="text-[var(--accent-error)] ml-1">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            `w-full min-h-[120px] px-4 py-3 text-base
            bg-[var(--surface-raised)] text-[var(--text-primary)]
            border border-[var(--border-default)] rounded-[10px]
            placeholder:text-[var(--text-tertiary)]
            transition-all duration-200 resize-none
            hover:border-[var(--border-hover)]
            focus:outline-none focus:border-[var(--brand-charcoal)] focus:ring-1 focus:ring-[var(--brand-charcoal)]
            disabled:opacity-50 disabled:cursor-not-allowed`,
            error && "border-[var(--accent-error)] focus:border-[var(--accent-error)] focus:ring-[var(--accent-error)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--accent-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
