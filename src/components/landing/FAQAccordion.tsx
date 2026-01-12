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
    <section id="faq" className="py-20 md:py-32 bg-[var(--surface-default)]">
      <Container size="narrow">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">
            Frequently Asked
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "border border-[var(--border-default)] rounded-[16px] overflow-hidden transition-all duration-200",
                  isOpen && "border-[var(--border-hover)] shadow-[var(--shadow-soft)]"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <span className="text-lg font-semibold text-[var(--text-primary)] pr-4">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full bg-[var(--surface-default)] flex items-center justify-center transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-[var(--text-secondary)]"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed">
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
