"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-sans font-semibold tracking-wide
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      select-none
    `;

    const variants = {
      primary: `
        bg-[var(--brand-charcoal)] text-[var(--text-inverse)]
        hover:bg-[var(--brand-black)]
        focus-visible:ring-[var(--brand-charcoal)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-transparent text-[var(--brand-charcoal)]
        border-2 border-[var(--brand-charcoal)]
        hover:bg-[var(--brand-charcoal)] hover:text-[var(--text-inverse)]
        focus-visible:ring-[var(--brand-charcoal)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--text-secondary)]
        hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]
        focus-visible:ring-[var(--border-default)]
      `,
      outline: `
        bg-transparent text-[var(--text-primary)]
        border border-[var(--border-default)]
        hover:border-[var(--border-hover)] hover:bg-[var(--surface-raised)]
        focus-visible:ring-[var(--border-default)]
      `,
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-md gap-2",
      md: "h-11 px-6 text-base rounded-[10px] gap-2",
      lg: "h-14 px-8 text-lg rounded-[12px] gap-3",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
