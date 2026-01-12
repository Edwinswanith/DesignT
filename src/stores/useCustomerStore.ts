"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { validatePhone, validateEmail, validatePincode } from "@/lib/utils";

interface CustomerState {
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

interface CustomerActions {
  setField: <K extends keyof CustomerState>(field: K, value: CustomerState[K]) => void;
  setPaymentMethod: (method: "prepaid" | "cod") => void;
  setErrors: (errors: Record<string, string>) => void;
  clearError: (field: string) => void;
  validate: () => boolean;
  reset: () => void;
}

const initialState: CustomerState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "Chennai",
  pincode: "",
  state: "Tamil Nadu",
  paymentMethod: "prepaid",
  errors: {},
};

export const useCustomerStore = create<CustomerState & CustomerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setField: (field, value) => {
        set({ [field]: value });
        // Clear error when field is edited
        const errors = get().errors;
        if (errors[field as string]) {
          const newErrors = { ...errors };
          delete newErrors[field as string];
          set({ errors: newErrors });
        }
      },

      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      setErrors: (errors) => set({ errors }),

      clearError: (field) => {
        const errors = get().errors;
        if (errors[field]) {
          const newErrors = { ...errors };
          delete newErrors[field];
          set({ errors: newErrors });
        }
      },

      validate: () => {
        const state = get();
        const errors: Record<string, string> = {};

        // Name validation
        if (!state.name.trim()) {
          errors.name = "Name is required";
        } else if (state.name.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        }

        // Phone validation
        if (!state.phone) {
          errors.phone = "Phone number is required";
        } else if (!validatePhone(state.phone)) {
          errors.phone = "Enter a valid 10-digit mobile number";
        }

        // Email validation (optional but must be valid if provided)
        if (state.email && !validateEmail(state.email)) {
          errors.email = "Enter a valid email address";
        }

        // Address validation
        if (!state.address.trim()) {
          errors.address = "Address is required";
        } else if (state.address.trim().length < 10) {
          errors.address = "Please enter complete address";
        }

        // City validation
        if (!state.city.trim()) {
          errors.city = "City is required";
        }

        // Pincode validation
        if (!state.pincode) {
          errors.pincode = "Pincode is required";
        } else if (!validatePincode(state.pincode)) {
          errors.pincode = "Enter a valid 6-digit pincode";
        }

        set({ errors });
        return Object.keys(errors).length === 0;
      },

      reset: () => set(initialState),
    }),
    {
      name: "designt-customer-store",
      partialize: (state) => ({
        name: state.name,
        phone: state.phone,
        email: state.email,
        address: state.address,
        city: state.city,
        pincode: state.pincode,
      }),
    }
  )
);
