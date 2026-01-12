"use client";

import { create } from "zustand";

type OrderStatus =
  | "idle"
  | "creating"
  | "payment-pending"
  | "processing-payment"
  | "completed"
  | "failed";

interface OrderState {
  orderId: string | null;
  orderNumber: string | null;
  razorpayOrderId: string | null;
  status: OrderStatus;
  error: string | null;
  totalAmount: number | null;
}

interface OrderActions {
  setOrderId: (id: string) => void;
  setOrderNumber: (orderNumber: string) => void;
  setRazorpayOrderId: (id: string) => void;
  setStatus: (status: OrderStatus) => void;
  setError: (error: string | null) => void;
  setTotalAmount: (amount: number) => void;
  reset: () => void;
}

const initialState: OrderState = {
  orderId: null,
  orderNumber: null,
  razorpayOrderId: null,
  status: "idle",
  error: null,
  totalAmount: null,
};

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  ...initialState,

  setOrderId: (orderId) => set({ orderId }),

  setOrderNumber: (orderNumber) => set({ orderNumber }),

  setRazorpayOrderId: (razorpayOrderId) => set({ razorpayOrderId }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  setTotalAmount: (totalAmount) => set({ totalAmount }),

  reset: () => set(initialState),
}));
