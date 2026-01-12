"use client";

import { Button } from "@/components/ui";
import { useProductStore } from "@/stores/useProductStore";
import { PRICING } from "@/constants/pricing";

export function QuantitySelector() {
  const { quantity, incrementQuantity, decrementQuantity } = useProductStore();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        Quantity
      </label>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-[var(--border-default)] rounded-[10px] overflow-hidden">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= PRICING.MIN_QUANTITY}
            className="w-12 h-12 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-default)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="w-16 text-center text-lg font-semibold text-[var(--text-primary)]">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= PRICING.MAX_QUANTITY}
            className="w-12 h-12 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-default)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <span className="text-sm text-[var(--text-tertiary)]">
          Max {PRICING.MAX_QUANTITY} per order
        </span>
      </div>
    </div>
  );
}
