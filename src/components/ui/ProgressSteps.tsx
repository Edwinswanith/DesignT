"use client";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    `w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all duration-300`,
                    isCompleted && "bg-[var(--accent-success)] text-white",
                    isCurrent &&
                      "bg-[var(--brand-charcoal)] text-white ring-4 ring-[var(--brand-charcoal)]/20",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-[var(--border-default)] text-[var(--text-tertiary)]"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium whitespace-nowrap",
                    isCurrent
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)]"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3 transition-all duration-300",
                    isCompleted
                      ? "bg-[var(--accent-success)]"
                      : "bg-[var(--border-default)]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
