import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine: string;
  city: string;
  pincode: string;
  state: string;
  tshirtColor: string;
  tshirtSize: string;
  quantity: number;
  designUrl: string;
  backDesignUrl?: string;
  designPositionY: number;
  designScale: number;
  designAspectRatio: string;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  shippingAmount: number;
  codFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: "prepaid" | "cod";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  status: "pending" | "confirmed" | "processing" | "printing" | "shipped" | "delivered" | "cancelled";
  variants?: Array<{
    tshirtColor: string;
    tshirtSize: string;
    quantity: number;
    designUrl: string;
    backDesignUrl?: string;
    designPositionY: number;
    designScale: number;
    designAspectRatio: string;
    unitPrice: number;
  }>;
  userEmail?: string;
  createdAt: Date;
}

const orderVariantSchema = new Schema(
  {
    tshirtColor: { type: String, required: true },
    tshirtSize: { type: String, required: true },
    quantity: { type: Number, required: true },
    designUrl: { type: String, required: true },
    backDesignUrl: { type: String },
    designPositionY: { type: Number, required: true },
    designScale: { type: Number, required: true },
    designAspectRatio: { type: String, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    tshirtColor: { type: String, required: true },
    tshirtSize: { type: String, required: true },
    quantity: { type: Number, required: true },
    designUrl: { type: String, required: true },
    backDesignUrl: { type: String },
    designPositionY: { type: Number, required: true },
    designScale: { type: Number, required: true },
    designAspectRatio: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    shippingAmount: { type: Number, required: true },
    codFee: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["prepaid", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    status: { type: String, enum: ["pending", "confirmed", "processing", "printing", "shipped", "delivered", "cancelled"], default: "pending" },
    variants: { type: [orderVariantSchema], default: undefined },
    userEmail: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
