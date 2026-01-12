"use client";

import Link from "next/link";
import { Container } from "@/components/layout";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-cream)] to-[var(--surface-default)] opacity-50" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-6 animate-fade-in">
            Premium Custom T-Shirts
          </p>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight text-[var(--text-primary)] mb-8 animate-slide-up">
            Design Your Story
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up stagger-1">
            Premium bamboo-cotton t-shirts with AI-powered custom designs.
            Create something unique for birthdays, weddings, or any special moment.
          </p>

          {/* CTA Button */}
          <div className="animate-slide-up stagger-2">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center h-14 px-10 text-lg font-semibold
                bg-[var(--brand-charcoal)] text-[var(--text-inverse)] rounded-[12px]
                hover:bg-[var(--brand-black)] transition-all duration-200
                active:scale-[0.98] shadow-[var(--shadow-medium)]"
            >
              Start Creating
              <svg
                className="ml-3 w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--text-tertiary)] animate-fade-in stagger-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Bamboo-Cotton Blend</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>AI Design Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Chennai Delivery</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
