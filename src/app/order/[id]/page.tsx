"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Container, Header } from "@/components/layout";
import { Button } from "@/components/ui";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 flex flex-col">
        <Container size="narrow" className="flex-1 flex flex-col">
          <div className="text-center flex-1 flex flex-col">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-success)]/10 flex items-center justify-center">
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

            {/* Order placed message */}
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--text-primary)] mb-2">
              Order placed
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Thank you. Your order has been received and we are preparing your custom t-shirt.
            </p>

            {/* Order Details Card */}
            <div className="bg-[var(--surface-raised)] rounded-2xl p-6 md:p-8 border border-[var(--border-default)] mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border-default)]">
                  <span className="text-[var(--text-secondary)]">Order number</span>
                  <span className="font-mono text-base font-semibold text-[var(--text-primary)]">
                    {orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Estimated delivery</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    5–7 business days
                  </span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-[var(--surface-overlay)] rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
                What happens next?
              </h3>
              <ol className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    1
                  </span>
                  <span>You will receive an SMS and email confirmation shortly.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    2
                  </span>
                  <span>Your design will be printed on premium bamboo-cotton fabric.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-xs font-semibold text-[var(--text-primary)]">
                    3
                  </span>
                  <span>Once shipped, you will receive tracking information.</span>
                </li>
              </ol>
            </div>

            {/* Support */}
            <p className="mb-8 text-sm text-[var(--text-tertiary)]">
              Questions?{" "}
              <a
                href="mailto:hello@designt.in"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
              >
                hello@designt.in
              </a>
            </p>

            {/* Go back button at bottom */}
            <div className="mt-auto pt-6 border-t border-[var(--border-default)]">
              <Link href="/studio" className="block">
                <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                  <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Go back
                </Button>
              </Link>
              <p className="mt-3 text-xs text-[var(--text-tertiary)]">
                Returns to Design Studio to create another design
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
