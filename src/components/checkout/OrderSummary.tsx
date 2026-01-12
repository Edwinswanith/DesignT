"use client";

import { TShirtPreview } from "@/components/studio";
import { useDesignStore } from "@/stores/useDesignStore";
import { useProductStore } from "@/stores/useProductStore";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { TSHIRT_COLORS } from "@/constants/colors";
import { ALL_SIZES } from "@/constants/sizes";
import { calculatePricing, formatPrice } from "@/constants/pricing";

interface OrderSummaryProps {
  showDelivery?: boolean;
}

export function OrderSummary({ showDelivery = false }: OrderSummaryProps) {
  const { mode, currentDesign, uploadedImage } = useDesignStore();
  const { color, size, quantity, designPosition } = useProductStore();
  const { paymentMethod, address, city, pincode } = useCustomerStore();

  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;
  const colorData = TSHIRT_COLORS[color];
  const sizeData = ALL_SIZES[size];
  const pricing = calculatePricing(quantity, paymentMethod);

  return (
    <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
      <h3 className="text-lg font-serif text-[var(--text-primary)] mb-6">
        Order Summary
      </h3>

      {/* Mini Preview */}
      <div className="mb-6">
        <TShirtPreview
          color={color}
          designImage={activeDesign}
          designPosition={designPosition}
          size="sm"
        />
      </div>

      {/* Selected Options */}
      <div className="space-y-3 pb-4 border-b border-[var(--border-default)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Color</span>
          <span className="font-medium text-[var(--text-primary)]">
            {colorData.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Size</span>
          <span className="font-medium text-[var(--text-primary)]">
            {sizeData.label} ({sizeData.chest})
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Quantity</span>
          <span className="font-medium text-[var(--text-primary)]">
            {quantity}
          </span>
        </div>
      </div>

      {/* Delivery Address (if shown) */}
      {showDelivery && address && (
        <div className="py-4 border-b border-[var(--border-default)]">
          <p className="text-sm text-[var(--text-secondary)] mb-1">Deliver to</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {address}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {city}, {pincode}
          </p>
        </div>
      )}

      {/* Pricing */}
      <div className="pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">
            {formatPrice(pricing.unitPrice)} x {quantity}
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
          <span className="text-[var(--accent-success)] font-medium">FREE</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Prepaid Discount</span>
            <span className="text-[var(--accent-success)]">
              -{formatPrice(pricing.discount)}
            </span>
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
        <div className="flex justify-between pt-3 border-t border-[var(--border-default)]">
          <span className="font-semibold text-[var(--text-primary)]">Total</span>
          <span className="text-xl font-semibold text-[var(--text-primary)]">
            {formatPrice(pricing.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
