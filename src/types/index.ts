import { TShirtColorId } from "@/constants/colors";
import { SizeId } from "@/constants/sizes";
import { AspectRatioId } from "@/constants/prompts";

// Design Types
export interface DesignState {
  mode: "ai" | "upload";
  prompt: string;
  aspectRatio: AspectRatioId;
  isGenerating: boolean;
  generationError: string | null;
  currentDesign: string | null;
  designHistory: string[];
  uploadedImage: string | null;
  isRemovingBackground: boolean;
}

// Product Types
export interface DesignPosition {
  y: number;
  scale: number;
}

export interface ProductState {
  color: TShirtColorId;
  size: SizeId;
  quantity: number;
  designPosition: DesignPosition;
}

// Customer Types
export interface CustomerState {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  paymentMethod: "prepaid" | "cod";
  errors: Record<string, string>;
}

// Order Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "printing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  addressLine: string;
  city: string;
  pincode: string;
  state: string;
  tshirtColor: TShirtColorId;
  tshirtSize: SizeId;
  quantity: number;
  designUrl: string;
  designPositionY: number;
  designScale: number;
  designAspectRatio: AspectRatioId;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  shippingAmount: number;
  codFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
}

// API Types
export interface GenerateDesignRequest {
  prompt: string;
  aspectRatio: AspectRatioId;
}

export interface GenerateDesignResponse {
  success: boolean;
  image?: {
    data: string;
    mimeType: string;
  };
  error?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine: string;
  city: string;
  pincode: string;
  tshirtColor: TShirtColorId;
  tshirtSize: SizeId;
  quantity: number;
  designUrl: string;
  designPositionY: number;
  designScale: number;
  designAspectRatio: AspectRatioId;
  paymentMethod: "prepaid" | "cod";
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: number;
  };
  error?: string;
}
