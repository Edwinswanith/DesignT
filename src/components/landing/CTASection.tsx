"use client";

import Link from "next/link";
import { Container } from "@/components/layout";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-[var(--brand-charcoal)]">
      <Container>
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--text-inverse)] mb-6">
            Ready to Create?
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-inverse)]/70 max-w-2xl mx-auto mb-10">
            Your unique t-shirt is just a few clicks away. Start with our AI
            design studio or upload your own artwork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center h-14 px-10 text-lg font-semibold
                bg-[var(--surface-raised)] text-[var(--brand-charcoal)] rounded-[12px]
                hover:bg-white transition-all duration-200 active:scale-[0.98]"
            >
              Start Designing
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

          {/* Pricing Teaser */}
          <p className="mt-8 text-sm text-[var(--text-inverse)]/50">
            Starting at Rs. 899 | Free shipping | 5-7 day delivery
          </p>
        </div>
      </Container>
    </section>
  );
}
