"use client";

import { Input } from "@/components/ui";
import { useCustomerStore } from "@/stores/useCustomerStore";

export function ContactForm() {
  const { name, phone, email, errors, setField } = useCustomerStore();

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-serif text-[var(--text-primary)]">
        Contact Information
      </h3>

      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="Enter your full name"
        error={errors.name}
        required
      />

      <Input
        label="Phone Number"
        value={phone}
        onChange={(e) => {
          // Only allow digits
          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
          setField("phone", value);
        }}
        placeholder="9876543210"
        prefix="+91"
        error={errors.phone}
        required
        type="tel"
      />

      <Input
        label="Email Address"
        value={email}
        onChange={(e) => setField("email", e.target.value)}
        placeholder="your.email@example.com (optional)"
        error={errors.email}
        type="email"
      />
    </div>
  );
}
