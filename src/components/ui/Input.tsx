"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
          >
            {label}
            {props.required && (
              <span className="text-[var(--accent-error)] ml-1">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-medium">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              `w-full h-12 px-4 text-base
              bg-[var(--surface-raised)] text-[var(--text-primary)]
              border border-[var(--border-default)] rounded-[10px]
              placeholder:text-[var(--text-tertiary)]
              transition-all duration-200
              hover:border-[var(--border-hover)]
              focus:outline-none focus:border-[var(--brand-charcoal)] focus:ring-1 focus:ring-[var(--brand-charcoal)]
              disabled:opacity-50 disabled:cursor-not-allowed`,
              prefix && "pl-14",
              error && "border-[var(--accent-error)] focus:border-[var(--accent-error)] focus:ring-[var(--accent-error)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--accent-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
