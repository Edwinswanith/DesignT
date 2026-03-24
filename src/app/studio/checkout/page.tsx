"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import { TShirtPreview, ShowBackButton } from "@/components/studio";
import { PaymentOptions, TrustBadges } from "@/components/checkout";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useCartStore } from "@/stores/useCartStore";
import { TSHIRT_COLORS } from "@/constants/colors";
import { ALL_SIZES } from "@/constants/sizes";
import { calculatePricing, formatPrice } from "@/constants/pricing";
import type { OrderVariant } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const { items: cartItems, clearCart, updateItemQuantity, removeItem } = useCartStore();
  const { name, phone, email: customerEmail, address, city, pincode, state, paymentMethod } =
    useCustomerStore();
  const navigatingToOrderSuccess = useRef(false);

  const email = session?.user?.email || customerEmail || "";
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const pricing = calculatePricing(totalQuantity, paymentMethod);

  // Redirect if no cart items or customer info (skip when we just placed order and are going to /order/[id])
  useEffect(() => {
    if (navigatingToOrderSuccess.current) return;
    if (cartItems.length === 0 || !name || !phone || !address) {
      router.push("/studio");
    }
  }, [cartItems.length, name, phone, address, router]);

  const handleBack = () => {
    router.push("/studio/details");
  };

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Build variants array
      const variants: OrderVariant[] = cartItems.map((item) => ({
        tshirtColor: item.color,
        tshirtSize: item.size,
        quantity: item.quantity,
        designUrl: item.designImage,
        backDesignUrl: item.backDesignImage ?? undefined,
        designPositionY: item.designPosition.y,
        designScale: item.designPosition.scale,
        designAspectRatio: item.aspectRatio,
        unitPrice: pricing.unitPrice,
      }));

      // Use first variant for flat fields (backward compatibility)
      const first = variants[0];

      // Prepare order data
      const orderData = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        addressLine: address,
        city,
        pincode,
        state,
        tshirtColor: first.tshirtColor,
        tshirtSize: first.tshirtSize,
        quantity: first.quantity,
        designUrl: first.designUrl,
        ...(first.backDesignUrl ? { backDesignUrl: first.backDesignUrl } : {}),
        designPositionY: first.designPositionY,
        designScale: first.designScale,
        designAspectRatio: first.designAspectRatio,
        unitPrice: pricing.unitPrice,
        subtotal: pricing.subtotal,
        gstAmount: pricing.gst,
        shippingAmount: pricing.shipping || 0,
        codFee: pricing.codFee,
        discountAmount: pricing.discount,
        totalAmount: pricing.total,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        // Include variants only if multi-variant
        ...(cartItems.length > 1 ? { variants } : {}),
      };

      // Call the order API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      const orderId = data?.orderId;

      if (!orderId) {
        throw new Error("Order created but no order ID returned");
      }

      navigatingToOrderSuccess.current = true;
      clearCart();
      router.push(`/order/${orderId}`);
    } catch (error) {
      console.error("Order error:", error);
      setIsProcessing(false);
    }
  }, [router, name, phone, email, address, city, pincode, state, paymentMethod, cartItems, pricing, clearCart]);

  return (
    <StudioLayout currentStep={4}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Panel - Order Review */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Details */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif text-[var(--text-primary)]">
                Your Order — {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
              </h3>
              <button
                onClick={() =>
                  router.push(
                    cartItems[0]?.id
                      ? `/studio/customize?editItem=${encodeURIComponent(cartItems[0].id)}`
                      : "/studio/customize"
                  )
                }
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, idx) => {
                const colorData = TSHIRT_COLORS[item.color];
                const sizeData = ALL_SIZES[item.size];
                const isExpanded = expandedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-[var(--border-default)] last:border-0 last:pb-0"
                  >
                    {/* Product Image */}
                    <div
                      className="w-24 flex-shrink-0 space-y-2 cursor-pointer"
                      onClick={() =>
                        setExpandedItemId(isExpanded ? null : item.id)
                      }
                    >
                      <TShirtPreview
                        color={item.color}
                        designImage={item.designImage}
                        backDesignImage={item.backDesignImage}
                        designPosition={item.designPosition}
                        backDesignPosition={item.backDesignPosition}
                        size="sm"
                        side="front"
                      />
                      {isExpanded && (
                        <div className="flex justify-center">
                          <ShowBackButton
                            side="front"
                            onToggle={() => {}}
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Item {idx + 1} — {colorData.name} / {sizeData.label}
                      </h4>
                      <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                        <p>Chest: {sizeData.chest}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-raised)]"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.id,
                              Math.min(10, item.quantity + 1)
                            )
                          }
                          disabled={item.quantity >= 10}
                          className="w-7 h-7 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-raised)]"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {formatPrice(pricing.unitPrice)} each
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            router.push(`/studio/customize?editItem=${encodeURIComponent(item.id)}`)
                          }
                          className="text-xs font-medium text-[var(--text-secondary)] hover:underline underline-offset-2"
                        >
                          Customize
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-[var(--accent-error)] hover:underline underline-offset-2"
                        >
                          Remove item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          <div className="sticky top-0 space-y-6">
            {/* Price Breakdown */}
            <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
              <h3 className="text-lg font-serif text-[var(--text-primary)] mb-6">
                Price Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Subtotal ({totalQuantity} item{totalQuantity > 1 ? "s" : ""})
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
