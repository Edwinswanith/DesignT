export const PRICING = {
  BASE_PRICE: 899,
  GST_RATE: 0.05,
  SHIPPING_FEE: 0,
  COD_FEE: 50,
  PREPAID_DISCOUNT: 50,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10,
} as const;

export function calculatePricing(
  quantity: number,
  paymentMethod: "prepaid" | "cod"
) {
  const subtotal = PRICING.BASE_PRICE * quantity;
  const gst = Math.round(subtotal * PRICING.GST_RATE);
  const shipping = PRICING.SHIPPING_FEE;
  const codFee = paymentMethod === "cod" ? PRICING.COD_FEE : 0;
  const discount = paymentMethod === "prepaid" ? PRICING.PREPAID_DISCOUNT : 0;
  const total = subtotal + gst + shipping + codFee - discount;

  return {
    unitPrice: PRICING.BASE_PRICE,
    subtotal,
    gst,
    shipping,
    codFee,
    discount,
    total,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
