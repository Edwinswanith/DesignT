"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Container, Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <Container size="narrow">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-success-light)] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-success)"
                strokeWidth="2.5"
                className="w-10 h-10"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">
              Order Confirmed
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Thank you for your order. We are preparing your custom t-shirt.
            </p>

            {/* Order Details Card */}
            <div className="bg-[var(--surface-raised)] rounded-[20px] p-8 border border-[var(--border-default)] mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border-default)]">
                  <span className="text-[var(--text-secondary)]">Order Number</span>
                  <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">
                    {orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Estimated Delivery</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    5-7 Business Days
                  </span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-[var(--brand-cream)] rounded-[20px] p-6 mb-8 text-left">
              <h3 className="text-lg font-serif text-[var(--text-primary)] mb-4">
                What happens next?
              </h3>
              <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    1
                  </span>
                  <span>You will receive an SMS and email confirmation shortly</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    2
                  </span>
                  <span>Your design will be printed on premium bamboo-cotton fabric</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    3
                  </span>
                  <span>Once shipped, you will receive tracking information</span>
                </li>
              </ol>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg">
                  Back to Home
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg">
                  Create Another Design
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <p className="mt-8 text-sm text-[var(--text-tertiary)]">
              Questions? Contact us at{" "}
              <a
                href="mailto:hello@designt.in"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
              >
                hello@designt.in
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
