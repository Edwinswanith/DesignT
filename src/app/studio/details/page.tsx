"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  ContactForm,
  AddressForm,
  OrderSummary,
} from "@/components/checkout";
import { useDesignStore } from "@/stores/useDesignStore";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useCartStore } from "@/stores/useCartStore";
import { TSHIRT_COLORS } from "@/constants/colors";
import { ALL_SIZES } from "@/constants/sizes";
import type { CartItem } from "@/types";

export default function DetailsPage() {
  const router = useRouter();
  const { validate } = useCustomerStore();
  const { items: cartItems } = useCartStore();

  // Redirect if no items in cart
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/studio");
    }
  }, [cartItems.length, router]);

  const handleBack = () => {
    router.push(
      cartItems[0]?.id
        ? `/studio/customize?editItem=${encodeURIComponent(cartItems[0].id)}`
        : "/studio/customize"
    );
  };

  const handleContinue = () => {
    const isValid = validate();
    if (isValid) {
      router.push("/studio/checkout");
    }
  };

  return (
    <StudioLayout currentStep={3}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Panel - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <ContactForm />
          </div>

          {/* Delivery Address */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <AddressForm />
          </div>

          {/* Cart Summary */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Your Cart — {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
            </h3>
            <div className="space-y-2">
              {cartItems.map((item, idx) => {
                const colorData = TSHIRT_COLORS[item.color];
                const sizeData = ALL_SIZES[item.size];
                return (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[var(--border-default)] flex-shrink-0"
                      style={{ backgroundColor: colorData.hex }}
                    />
                    <span className="text-[var(--text-secondary)]">
                      Item {idx + 1} — {colorData.name} / {sizeData.label} × {item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation - Mobile */}
          <div className="lg:hidden flex gap-4">
            <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button size="lg" onClick={handleContinue} className="flex-1">
              Continue to Checkout
            </Button>
          </div>
        </div>

        {/* Right Panel - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-0 space-y-6">
            <OrderSummary />

            {/* Navigation - Desktop */}
            <div className="hidden lg:flex flex-col gap-3">
              <Button size="lg" onClick={handleContinue} className="w-full">
                Continue to Checkout
                <svg
                  className="ml-2 w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
              <Button variant="ghost" size="lg" onClick={handleBack} className="w-full">
                Back to Customize
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
