"use client";

import { create } from "zustand";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateItem: (id, item) =>
    set((state) => ({
      items: state.items.map((existing) => (existing.id === id ? { ...item, id } : existing)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateItemQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(10, quantity)),
            }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
