"use client";

import Link from "next/link";
import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--surface-default)]/95 backdrop-blur-sm border-b border-[var(--border-default)]">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-serif tracking-tight text-[var(--text-primary)]">
              DesignT
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#quality"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Quality
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* CTA Button */}
          <Link
            href="/studio"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold
              bg-[var(--brand-charcoal)] text-[var(--text-inverse)] rounded-[10px]
              hover:bg-[var(--brand-black)] transition-all duration-200 active:scale-[0.98]"
          >
            Start Designing
          </Link>
        </div>
      </Container>
    </header>
  );
}
