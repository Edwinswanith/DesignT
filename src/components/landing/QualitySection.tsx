"use client";

import { Container } from "@/components/layout";

const QUALITY_POINTS = [
  {
    title: "60/40 Bamboo-Cotton Blend",
    description:
      "Sourced from Tirupur's finest mills. Bamboo's natural softness combined with cotton's durability creates a fabric that's breathable, antibacterial, and incredibly gentle on your skin.",
  },
  {
    title: "DTF Print Technology",
    description:
      "Every design is printed using Direct-to-Film technology, ensuring vibrant colors that last 100+ washes without cracking or fading.",
  },
  {
    title: "Sustainable Choice",
    description:
      "Bamboo grows faster than any other plant, needs no pesticides, and regenerates naturally. Your comfort, nature's gift.",
  },
];

export function QualitySection() {
  return (
    <section id="quality" className="py-20 md:py-32 bg-[var(--surface-raised)]">
      <Container>
        {/* Header */}
        <div className="mb-12 flex items-center gap-3">
          <div className="w-8 h-px bg-[var(--accent-primary)]" />
          <span className="text-xs tracking-[0.2em] uppercase font-medium text-[var(--accent-primary)]">
            Premium Materials
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-12 lg:gap-20 items-center">
          {/* Left - Visual (order-2 lg:order-1) */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-[32px] bg-[var(--surface-default)] border border-[var(--border-default)] overflow-hidden shadow-[var(--shadow-medium)]">
              {/* Placeholder for fabric/t-shirt image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      className="w-16 h-16"
                    >
                      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-serif text-[var(--text-primary)] mb-2">
                    Premium Quality
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Feel the difference
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[var(--accent-primary)]/8 -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[var(--accent-primary)]/8 -z-10" />
          </div>

          {/* Right - Content (order-1 lg:order-2) */}
          <div className="relative order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-6">
              Crafted for Comfort
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed">
              We believe that great design deserves great fabric. Every DesignT
              t-shirt is made with premium materials and printed with care.
            </p>

            {/* Quality Points */}
            <div className="space-y-8">
              {QUALITY_POINTS.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--surface-inset)] flex items-center justify-center text-[var(--accent-primary)]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="w-5 h-5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                      {point.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
