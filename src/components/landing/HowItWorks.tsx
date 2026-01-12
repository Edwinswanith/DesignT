"use client";

import { Container } from "@/components/layout";

const STEPS = [
  {
    number: "01",
    title: "Create",
    description:
      "Describe your vision or upload a photo. Our AI brings your ideas to life with stunning clarity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Customize",
    description:
      "Pick your perfect color, size, and placement. See it on the t-shirt before you buy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Receive",
    description:
      "We print with care using DTF technology on premium fabric. Delivered to your door in 5-7 days.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-[var(--surface-raised)]">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            From idea to delivery in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="relative p-8 rounded-[20px] bg-[var(--surface-default)] border border-[var(--border-default)]
                transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-medium)]"
            >
              {/* Step Number */}
              <span className="absolute -top-4 left-8 text-6xl font-serif text-[var(--border-default)]">
                {step.number}
              </span>

              {/* Icon */}
              <div className="mt-8 mb-6 text-[var(--text-primary)]">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-3">
                {step.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line (hidden on mobile, shown between steps on desktop) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-[var(--border-default)]" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
