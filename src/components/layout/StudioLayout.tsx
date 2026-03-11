"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Container } from "./Container";

const STUDIO_STEPS = [
  { id: 1, label: "Design", icon: "sparkle" },
  { id: 2, label: "Customize", icon: "adjust" },
  { id: 3, label: "Details", icon: "user" },
  { id: 4, label: "Checkout", icon: "bag" },
];

interface StudioLayoutProps {
  children: ReactNode;
  currentStep: number;
}

function StepIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        </svg>
      );
    case "adjust":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    default:
      return null;
  }
}

export function StudioLayout({ children, currentStep }: StudioLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--surface-default)] relative texture-noise">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 glass">
        <Container size="wide">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-lg font-serif tracking-tight text-[var(--text-primary)]">
                DesignT
              </span>
            </Link>

            {/* Progress Steps — Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {STUDIO_STEPS.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`
                        flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                        ${isActive
                          ? "bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--border-accent)]"
                          : isCompleted
                          ? "text-[var(--accent-primary-muted)]"
                          : "text-[var(--text-tertiary)]"
                        }
                      `}
                    >
                      <StepIcon
                        icon={step.icon}
                        className={`w-3.5 h-3.5 ${isActive ? "text-[var(--accent-primary)]" : isCompleted ? "text-[var(--accent-primary-muted)]" : ""}`}
                      />
                      {step.label}
                    </div>
                    {idx < STUDIO_STEPS.length - 1 && (
                      <div className={`w-8 h-px mx-1 ${isCompleted ? "bg-[var(--accent-primary-muted)]" : "bg-[var(--border-default)]"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Indicator — Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--accent-primary)]">
                {currentStep}/{STUDIO_STEPS.length}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {STUDIO_STEPS[currentStep - 1]?.label}
              </span>
            </div>
          </div>
        </Container>

        {/* Mobile Progress Bar */}
        <div className="md:hidden h-0.5 bg-[var(--border-default)]">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / STUDIO_STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative py-4 md:py-6">
        <Container size="wide">{children}</Container>
      </main>
    </div>
  );
}
