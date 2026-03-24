"use client";

import { Container } from "@/components/layout";

const STEPS = [
  {
    number: "01",
    title: "Create",
    description:
      "Describe your vision or upload a photo. Our AI brings your ideas to life with stunning clarity.",
    limitNote: "You can generate up to 10 images per day; the limit resets every day.",
    instructions: [
      "Go to Design Studio and type what you want (e.g. a logo, pattern, or phrase).",
      "Or upload a reference image; AI will generate designs based on it.",
      "Use the style and aspect ratio options in the prompt bar to refine the look.",
      "Pick a design you like, remove the background if needed, then tap Use to preview on the t-shirt.",
    ],
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
    instructions: [
      "Choose your t-shirt color from the palette (e.g. Midnight Black, Pure White).",
      "Select size: Adult (S–XXL) or Kids (S/M/L); check the size guide for measurements.",
      "Adjust design position: move it up or down, resize, or rotate using the sliders.",
      "Toggle front or back view to see how it looks on both sides before ordering.",
    ],
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
    instructions: [
      "Review your order and enter delivery details (name, phone, address).",
      "Choose payment: prepaid (card/UPI) for a discount, or cash on delivery.",
      "Place order; you get an order confirmation and tracking once it ships.",
      "We print with DTF on premium bamboo-cotton. Expect delivery in 5–7 business days.",
    ],
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
    <section id="how-it-works" className="py-20 md:py-32 bg-[var(--surface-default)]">
      <Container>
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[var(--accent-primary)]" />
            <span className="text-xs tracking-[0.2em] uppercase font-medium text-[var(--accent-primary)]">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">
            Three Steps to Success
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            From idea to delivery in just a few clicks
          </p>
          <p className="mt-2 text-sm text-[var(--text-tertiary)] max-w-2xl">
            Each user can generate up to 10 images per day. The limit resets automatically every day.
          </p>
        </div>

        {/* Steps Row with Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="border border-[var(--border-default)] rounded-lg p-8 flex flex-col items-center text-center"
            >
              {/* 1st: Number */}
              <span className="text-7xl leading-none font-serif text-[var(--border-default)] mb-4">
                {step.number}
              </span>

              {/* 2nd: Icon and Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[var(--accent-primary)]">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-serif text-[var(--text-primary)]">
                  {step.title}
                </h3>
              </div>

              {/* 3rd: Short description */}
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Optional: daily limit note (Create step) */}
              {"limitNote" in step && step.limitNote && (
                <p className="text-xs text-[var(--text-tertiary)] mb-4 px-2 py-1.5 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-default)] w-full text-center">
                  {step.limitNote}
                </p>
              )}

              {/* 4th: Step-by-step instructions */}
              <ul className="text-left w-full space-y-3 text-sm text-[var(--text-secondary)]">
                {step.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
