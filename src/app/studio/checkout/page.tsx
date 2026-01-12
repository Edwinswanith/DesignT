"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import { TShirtPreview } from "@/components/studio";
import { PaymentOptions, TrustBadges } from "@/components/checkout";
import { useDesignStore } from "@/stores/useDesignStore";
import { useProductStore } from "@/stores/useProductStore";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { TSHIRT_COLORS } from "@/constants/colors";
import { ALL_SIZES } from "@/constants/sizes";
import { calculatePricing, formatPrice } from "@/constants/pricing";

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { mode, currentDesign, uploadedImage } = useDesignStore();
  const { color, size, quantity, designPosition } = useProductStore();
  const { name, phone, email, address, city, pincode, paymentMethod } =
    useCustomerStore();

  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;
  const colorData = TSHIRT_COLORS[color];
  const sizeData = ALL_SIZES[size];
  const pricing = calculatePricing(quantity, paymentMethod);

  // Redirect if no design or customer info
  if (!activeDesign || !name || !phone || !address) {
    router.push("/studio");
    return null;
  }

  const handleBack = () => {
    router.push("/studio/details");
  };

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);

    try {
      // For now, simulate order creation
      // In production, this would call the API endpoints
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock order ID
      const orderId = `TS${Date.now().toString().slice(-8)}`;

      // Navigate to order confirmation
      router.push(`/order/${orderId}`);
    } catch (error) {
      console.error("Order error:", error);
      setIsProcessing(false);
    }
  }, [router]);

  return (
    <StudioLayout currentStep={4}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Panel - Order Review */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Details */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif text-[var(--text-primary)]">
                Your Order
              </h3>
              <button
                onClick={() => router.push("/studio/customize")}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
              >
                Edit
              </button>
            </div>

            <div className="flex gap-6">
              {/* Product Image */}
              <div className="w-32 flex-shrink-0">
                <TShirtPreview
                  color={color}
                  designImage={activeDesign}
                  designPosition={designPosition}
                  size="sm"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-3">
                <h4 className="font-semibold text-[var(--text-primary)]">
                  Custom Design T-Shirt
                </h4>
                <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <p>Color: {colorData.name}</p>
                  <p>
                    Size: {sizeData.label} ({sizeData.chest})
                  </p>
                  <p>Quantity: {quantity}</p>
                </div>
                <p className="font-semibold text-[var(--text-primary)]">
                  {formatPrice(pricing.unitPrice)} each
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif text-[var(--text-primary)]">
                Delivery Details
              </h3>
              <button
                onClick={() => router.push("/studio/details")}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{name}</p>
                <p className="text-[var(--text-secondary)]">+91 {phone}</p>
                {email && (
                  <p className="text-[var(--text-secondary)]">{email}</p>
                )}
              </div>
              <div>
                <p className="text-[var(--text-secondary)]">{address}</p>
                <p className="text-[var(--text-secondary)]">
                  {city}, Tamil Nadu - {pincode}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Estimated Delivery: 5-7 business days
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <PaymentOptions />
          </div>
        </div>

        {/* Right Panel - Price Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Breakdown */}
            <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
              <h3 className="text-lg font-serif text-[var(--text-primary)] mb-6">
                Price Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Subtotal ({quantity} item{quantity > 1 ? "s" : ""})
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {formatPrice(pricing.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">GST (5%)</span>
                  <span className="text-[var(--text-primary)]">
                    {formatPrice(pricing.gst)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Shipping</span>
                  <span className="text-[var(--accent-success)] font-medium">
                    FREE
                  </span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-[var(--accent-success)]">
                    <span>Prepaid Discount</span>
                    <span>-{formatPrice(pricing.discount)}</span>
                  </div>
                )}
                {pricing.codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">COD Fee</span>
                    <span className="text-[var(--text-primary)]">
                      +{formatPrice(pricing.codFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-[var(--border-default)]">
                  <span className="text-lg font-semibold text-[var(--text-primary)]">
                    Total
                  </span>
                  <span className="text-xl font-semibold text-[var(--text-primary)]">
                    {formatPrice(pricing.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              isLoading={isProcessing}
              className="w-full"
            >
              {isProcessing
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order"
                : "Pay Now"}
            </Button>

            <Button variant="ghost" size="lg" onClick={handleBack} className="w-full">
              Back
            </Button>

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
