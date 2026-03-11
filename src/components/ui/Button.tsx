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
      font-sans font-semibold tracking-[0.01em]
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-default)]
      disabled:opacity-40 disabled:cursor-not-allowed
      select-none
    `;

    const variants = {
      primary: `
        bg-[var(--accent-primary)]
        text-white
        hover:bg-[var(--accent-primary-hover)] hover:shadow-[var(--shadow-medium)]
        focus-visible:ring-[var(--accent-primary)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-transparent text-[var(--accent-primary)]
        border-2 border-[var(--accent-primary)]/30
        hover:bg-[var(--accent-primary)]/8 hover:border-[var(--accent-primary)]/50
        focus-visible:ring-[var(--accent-primary)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--text-secondary)]
        hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)]
        focus-visible:ring-[var(--border-default)]
      `,
      outline: `
        bg-transparent text-[var(--text-primary)]
        border border-[var(--border-default)]
        hover:border-[var(--border-hover)] hover:bg-[var(--surface-inset)]
        focus-visible:ring-[var(--border-default)]
      `,
    };

    const sizes = {
      sm: "h-8 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-10 px-5 text-sm rounded-xl gap-2",
      lg: "h-12 px-7 text-[0.9375rem] rounded-xl gap-2.5",
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
