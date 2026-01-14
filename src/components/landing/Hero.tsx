"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout";

// Sample T-shirt showcase data with real AI-generated images
const SAMPLE_DESIGNS = [
  {
    id: 1,
    title: "Family Portrait",
    description: "Animated style",
    image: "/samples/family-portrait.png",
  },
  {
    id: 2,
    title: "Birthday Celebration",
    description: "Realistic style",
    image: "/samples/birthday-celebration.png",
  },
  {
    id: 3,
    title: "Wedding Memory",
    description: "Artistic style",
    image: "/samples/wedding-memory.png",
  },
  {
    id: 4,
    title: "Pet Portrait",
    description: "Anime style",
    image: "/samples/pet-portrait.png",
  },
  {
    id: 5,
    title: "Vintage Travel",
    description: "Retro style",
    image: "/samples/vintage-travel.png",
  },
];

export function Hero() {
  const [activeDesign, setActiveDesign] = useState(0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-cream)] to-[var(--surface-default)] opacity-50" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-6 animate-fade-in">
              AI-Powered Custom T-Shirts
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight text-[var(--text-primary)] mb-6 animate-slide-up">
              Turn Your Photos Into Wearable Art
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-slide-up stagger-1">
              Upload family photos, describe your vision — animated, realistic, or artistic.
              Our AI creates unique designs in any style you imagine.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 animate-slide-up stagger-1">
              {["Combine Multiple Photos", "Any Style", "16:9 / 9:16 / 1:1"].map((feature) => (
                <span
                  key={feature}
                  className="px-4 py-1.5 text-sm bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-full text-[var(--text-secondary)]"
                >
                  {feature}
                </span>
              ))}
            </div>

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
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-[var(--text-tertiary)] animate-fade-in stagger-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <span>Gemini AI</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right - T-Shirt Showcase */}
          <div className="relative animate-slide-up stagger-2">
            {/* Main T-Shirt Display */}
            <div className="relative max-w-[360px] mx-auto">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <Image
                  src={SAMPLE_DESIGNS[activeDesign].image}
                  alt={SAMPLE_DESIGNS[activeDesign].title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              {/* Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {SAMPLE_DESIGNS[activeDesign].title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] text-center">
                  {SAMPLE_DESIGNS[activeDesign].description}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-3 mt-6">
              {SAMPLE_DESIGNS.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => setActiveDesign(index)}
                  className={`w-14 h-[72px] rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                    activeDesign === index
                      ? "border-[var(--brand-charcoal)] scale-110 shadow-lg"
                      : "border-[var(--border-default)] opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <div className="w-full h-full relative bg-gray-100">
                    <Image
                      src={design.image}
                      alt={design.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Style badges */}
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-xs text-[var(--text-tertiary)]">Styles: </span>
              {["Realistic", "Animated", "Anime", "Artistic", "Vintage"].map((style) => (
                <span key={style} className="text-xs text-[var(--text-secondary)] bg-[var(--surface-raised)] px-2 py-0.5 rounded">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
