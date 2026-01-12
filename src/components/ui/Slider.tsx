"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      showValue = true,
      formatValue = (v) => String(v),
      id,
      value,
      ...props
    },
    ref
  ) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentValue = typeof value === "number" ? value : Number(value) || 0;

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-3">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-sm font-semibold text-[var(--text-primary)]"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {formatValue(currentValue)}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={sliderId}
          type="range"
          value={value}
          className={cn(
            `w-full h-2 rounded-full appearance-none cursor-pointer
            bg-[var(--border-default)]
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--brand-charcoal)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[var(--brand-charcoal)]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed`,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
