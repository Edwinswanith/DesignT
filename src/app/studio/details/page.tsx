"use client";

import { useRouter } from "next/navigation";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  ContactForm,
  AddressForm,
  QuantitySelector,
  OrderSummary,
} from "@/components/checkout";
import { useDesignStore } from "@/stores/useDesignStore";
import { useCustomerStore } from "@/stores/useCustomerStore";

export default function DetailsPage() {
  const router = useRouter();
  const { mode, currentDesign, uploadedImage } = useDesignStore();
  const { validate } = useCustomerStore();

  // Get the active design
  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;

  // Redirect if no design
  if (!activeDesign) {
    router.push("/studio");
    return null;
  }

  const handleBack = () => {
    router.push("/studio/customize");
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

          {/* Quantity */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <QuantitySelector />
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
          <div className="sticky top-24 space-y-6">
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
