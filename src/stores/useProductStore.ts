"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TShirtColorId } from "@/constants/colors";
import { SizeId } from "@/constants/sizes";
import { PRICING } from "@/constants/pricing";

interface DesignPosition {
  y: number;
  scale: number;
  rotation: number;
}

interface ProductState {
  color: TShirtColorId;
  size: SizeId;
  quantity: number;
  designPosition: DesignPosition;
  backDesignPosition: DesignPosition;
  unitPrice: number;
}

interface ProductActions {
  setColor: (color: TShirtColorId) => void;
  setSize: (size: SizeId) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  setDesignPosition: (position: Partial<DesignPosition>) => void;
  setBackDesignPosition: (position: Partial<DesignPosition>) => void;
  resetPosition: () => void;
  reset: () => void;
}

const DEFAULT_POSITION: DesignPosition = {
  y: 35,
  scale: 1,
  rotation: 0,
};

const initialState: ProductState = {
  color: "midnight-black",
  size: "M",
  quantity: 1,
  designPosition: DEFAULT_POSITION,
  backDesignPosition: DEFAULT_POSITION,
  unitPrice: PRICING.BASE_PRICE,
};

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setColor: (color) => set({ color }),

      setSize: (size) => set({ size }),

      setQuantity: (quantity) => {
        const clampedQuantity = Math.max(
          PRICING.MIN_QUANTITY,
          Math.min(PRICING.MAX_QUANTITY, quantity)
        );
        set({ quantity: clampedQuantity });
      },

      incrementQuantity: () => {
        const currentQty = get().quantity;
        if (currentQty < PRICING.MAX_QUANTITY) {
          set({ quantity: currentQty + 1 });
        }
      },

      decrementQuantity: () => {
        const currentQty = get().quantity;
        if (currentQty > PRICING.MIN_QUANTITY) {
          set({ quantity: currentQty - 1 });
        }
      },

      setDesignPosition: (position) => {
        const current = get().designPosition;
        const newY = position.y !== undefined
          ? Math.max(20, Math.min(70, position.y))
          : current.y;
        const newScale = position.scale !== undefined
          ? Math.max(0.5, Math.min(1.5, position.scale))
          : current.scale;
        const newRotation = position.rotation !== undefined
          ? Math.max(-45, Math.min(45, position.rotation))
          : current.rotation;
        set({
          designPosition: {
            y: newY,
            scale: newScale,
            rotation: newRotation,
          },
        });
      },

      setBackDesignPosition: (position) => {
        const current = get().backDesignPosition;
        const newY = position.y !== undefined
          ? Math.max(20, Math.min(70, position.y))
          : current.y;
        const newScale = position.scale !== undefined
          ? Math.max(0.5, Math.min(1.5, position.scale))
          : current.scale;
        const newRotation = position.rotation !== undefined
          ? Math.max(-45, Math.min(45, position.rotation))
          : current.rotation;
        set({
          backDesignPosition: {
            y: newY,
            scale: newScale,
            rotation: newRotation,
          },
        });
      },

      resetPosition: () => set({
        designPosition: DEFAULT_POSITION,
        backDesignPosition: DEFAULT_POSITION,
      }),

      reset: () => set(initialState),
    }),
    {
      name: "designt-product-store",
    }
  )
);
