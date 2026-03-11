"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="DesignT"
              width={130}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="#quality"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              Quality
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              FAQ
            </Link>
          </nav>

          {/* CTA Button */}
          <Link
            href="/studio"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold
              bg-[var(--accent-primary)] text-white rounded-xl
              hover:bg-[var(--accent-primary-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Start Designing
          </Link>
        </div>
      </Container>
    </header>
  );
}
