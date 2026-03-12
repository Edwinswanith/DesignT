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
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-inset)] via-[var(--surface-default)] to-[var(--surface-default)] opacity-100" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="w-8 h-px bg-[var(--accent-primary)]" />
              <span className="text-xs tracking-[0.2em] uppercase font-medium text-[var(--accent-primary)]">
                AI-Powered Custom T-Shirts
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-[var(--text-primary)] mb-6 animate-slide-up">
              Turn Your Photos Into Wearable Art
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-slide-up stagger-1">
              Upload family photos, describe your vision — animated, realistic, or artistic.
              Our AI creates unique designs in any style you imagine.
            </p>

            {/* CTA Button */}
            <div className="animate-slide-up stagger-2">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center h-14 px-10 text-lg font-semibold
                  bg-[var(--accent-primary)] text-white rounded-xl
                  hover:shadow-[var(--shadow-medium)] transition-all duration-200
                  active:scale-[0.98]"
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right - T-Shirt Showcase - Main preview on top / thumbnails at bottom on mobile */}
          <div className="relative animate-slide-up stagger-2 flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails: horizontal row on mobile, vertical column on desktop */}
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0">
              {SAMPLE_DESIGNS.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => setActiveDesign(index)}
                  className={`shrink-0 w-16 h-20 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                    activeDesign === index
                      ? "border-[var(--accent-primary)] shadow-lg"
                      : "border-[var(--border-default)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="w-full h-full relative bg-gray-100">
                    <Image
                      src={design.image}
                      alt={design.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Main Display */}
            <div className="flex-1 relative">
              {/* Main T-Shirt Display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100" style={{ transform: "rotate(1.5deg)" }}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={SAMPLE_DESIGNS[activeDesign].image}
                    alt={SAMPLE_DESIGNS[activeDesign].title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              </div>

              {/* Design Info Label */}
              <div className="mt-4">
                <p className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                  {SAMPLE_DESIGNS[activeDesign].title}
                </p>
              </div>

              {/* Style Tags - Underlined Text */}
              <div className="mt-3 flex flex-wrap gap-3">
                {["Realistic", "Animated", "Anime", "Artistic", "Vintage"].map((style) => (
                  <span
                    key={style}
                    className="text-xs text-[var(--text-secondary)] border-b border-[var(--accent-primary)] pb-0.5"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
