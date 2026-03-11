"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "How does the AI design work?",
    answer:
      "Our AI design studio uses advanced image generation technology. Simply describe what you want - a birthday celebration, a family portrait style, or any creative idea - and the AI will create a unique design. You can generate multiple variations until you find the perfect one.",
  },
  {
    question: "What file formats can I upload?",
    answer:
      "We accept PNG, JPG, JPEG, and WebP formats up to 10MB in size. For best results, use high-resolution images with clear subjects. Our background removal tool can help isolate your design from its background.",
  },
  {
    question: "Can I see the design before buying?",
    answer:
      "Yes! Our live preview feature shows exactly how your design will look on the t-shirt. You can see it on different colors, adjust the size and position, and make sure everything is perfect before placing your order.",
  },
  {
    question: "What is the return policy?",
    answer:
      "We accept returns for quality defects within 7 days of delivery. Since each t-shirt is custom-made with your unique design, we cannot accept returns for change of mind. Please use our preview feature to ensure you're happy with the design before ordering.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders within Chennai and Tamil Nadu are typically delivered within 5-7 business days. We print each t-shirt fresh after receiving your order to ensure the highest quality. You'll receive tracking information via SMS and email.",
  },
  {
    question: "Is the print durable?",
    answer:
      "Our DTF (Direct-to-Film) prints are designed to last. With proper care - washing inside-out in cold water and avoiding direct heat on the print - your design will stay vibrant for 100+ washes without cracking or fading.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit and debit cards, UPI payments (GPay, PhonePe, Paytm), net banking, and Cash on Delivery. Prepaid orders get a special discount of Rs. 50 off your order.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32 bg-[var(--surface-raised)]">
      <Container size="narrow">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[var(--accent-primary)]" />
            <span className="text-xs tracking-[0.2em] uppercase font-medium text-[var(--accent-primary)]">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">
            Frequently Asked
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Items */}
        <div className="divide-y divide-[var(--border-default)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-start justify-between py-6 text-left hover:bg-[var(--surface-overlay)] transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-xs font-serif text-[var(--text-tertiary)] min-w-fit pt-1 group-hover:text-[var(--accent-primary)] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-lg font-serif transition-colors",
                        isOpen ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                      )}
                    >
                      {item.question}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "flex-shrink-0 text-[var(--accent-primary)] transition-transform duration-200 ml-4 pt-0.5",
                      isOpen ? "rotate-45" : ""
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pl-12 pb-6 text-[var(--text-secondary)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
