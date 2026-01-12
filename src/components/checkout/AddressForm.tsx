"use client";

import { Input, Textarea } from "@/components/ui";
import { useCustomerStore } from "@/stores/useCustomerStore";

export function AddressForm() {
  const { address, city, pincode, state, errors, setField } = useCustomerStore();

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-serif text-[var(--text-primary)]">
        Delivery Address
      </h3>

      <Textarea
        label="Address"
        value={address}
        onChange={(e) => setField("address", e.target.value)}
        placeholder="House/Flat number, Street name, Landmark"
        error={errors.address}
        required
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          value={city}
          onChange={(e) => setField("city", e.target.value)}
          placeholder="Chennai"
          error={errors.city}
          required
        />

        <Input
          label="Pincode"
          value={pincode}
          onChange={(e) => {
            // Only allow digits
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setField("pincode", value);
          }}
          placeholder="600001"
          error={errors.pincode}
          required
          type="tel"
        />
      </div>

      <Input
        label="State"
        value={state}
        disabled
        className="bg-[var(--surface-default)]"
      />
    </div>
  );
}
