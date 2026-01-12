"use client";

import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-[var(--brand-charcoal)] text-[var(--text-inverse)] py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-serif tracking-tight">
                DesignT
              </span>
            </Link>
            <p className="mt-4 text-[var(--text-inverse)]/70 max-w-md leading-relaxed">
              Premium custom t-shirts with AI-powered design generation.
              Crafted with care using bamboo-cotton blend fabric and DTF
              printing technology.
            </p>
            <p className="mt-6 text-sm text-[var(--text-inverse)]/50">
              Made with care in Chennai
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-inverse)]/50 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#quality"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  Quality
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  Start Designing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-inverse)]/50 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-[var(--text-inverse)]/70">
                Chennai, Tamil Nadu
              </li>
              <li>
                <a
                  href="mailto:hello@designt.in"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  hello@designt.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-[var(--text-inverse)]/70 hover:text-[var(--text-inverse)] transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--text-inverse)]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-inverse)]/50">
            2024 DesignT. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-[var(--text-inverse)]/50 hover:text-[var(--text-inverse)]/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[var(--text-inverse)]/50 hover:text-[var(--text-inverse)]/70 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/returns"
              className="text-sm text-[var(--text-inverse)]/50 hover:text-[var(--text-inverse)]/70 transition-colors"
            >
              Returns
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
