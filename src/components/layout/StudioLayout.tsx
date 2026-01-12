"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { ProgressSteps } from "@/components/ui/ProgressSteps";

const STUDIO_STEPS = [
  { id: 1, label: "Design" },
  { id: 2, label: "Customize" },
  { id: 3, label: "Details" },
  { id: 4, label: "Checkout" },
];

interface StudioLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export function StudioLayout({ children, currentStep }: StudioLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--surface-default)]">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 bg-[var(--surface-raised)] border-b border-[var(--border-default)]">
        <Container size="wide">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-serif tracking-tight text-[var(--text-primary)]">
                DesignT
              </span>
            </Link>

            {/* Progress Steps - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <ProgressSteps steps={STUDIO_STEPS} currentStep={currentStep} />
            </div>

            {/* Step Indicator - Mobile */}
            <div className="md:hidden text-sm font-medium text-[var(--text-secondary)]">
              Step {currentStep} of {STUDIO_STEPS.length}
            </div>
          </div>
        </Container>

        {/* Mobile Progress Bar */}
        <div className="md:hidden h-1 bg-[var(--border-default)]">
          <div
            className="h-full bg-[var(--brand-charcoal)] transition-all duration-300"
            style={{ width: `${(currentStep / STUDIO_STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 md:py-10">
        <Container size="wide">{children}</Container>
      </main>
    </div>
  );
}
