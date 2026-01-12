"use client";

import { cn } from "@/lib/utils";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { formatPrice, PRICING } from "@/constants/pricing";

export function PaymentOptions() {
  const { paymentMethod, setPaymentMethod } = useCustomerStore();

  const options = [
    {
      id: "prepaid" as const,
      title: "Pay Online",
      description: "Cards, UPI, Net Banking",
      badge: `Save ${formatPrice(PRICING.PREPAID_DISCOUNT)}`,
      badgeColor: "bg-[var(--accent-success)] text-white",
    },
    {
      id: "cod" as const,
      title: "Cash on Delivery",
      description: "Pay when you receive",
      badge: `+${formatPrice(PRICING.COD_FEE)} fee`,
      badgeColor: "bg-[var(--surface-default)] text-[var(--text-secondary)]",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-[var(--text-primary)]">
        Payment Method
      </h3>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = paymentMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setPaymentMethod(option.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all duration-200 text-left",
                isSelected
                  ? "border-[var(--brand-charcoal)] bg-[var(--brand-charcoal)]/5"
                  : "border-[var(--border-default)] hover:border-[var(--border-hover)] bg-[var(--surface-raised)]"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Radio Circle */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected
                      ? "border-[var(--brand-charcoal)]"
                      : "border-[var(--border-default)]"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-charcoal)]" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {option.title}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  option.badgeColor
                )}
              >
                {option.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
