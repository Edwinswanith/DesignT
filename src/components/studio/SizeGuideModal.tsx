"use client";

import { Modal } from "@/components/ui";
import { ADULT_SIZE_LIST, KIDS_SIZE_LIST } from "@/constants/sizes";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="md">
      <div className="space-y-6">
        {/* Measuring Instructions */}
        <div className="p-4 rounded-[12px] bg-[var(--surface-default)] border border-[var(--border-default)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
            How to Measure
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Measure around the fullest part of your chest, keeping the tape
            horizontal. For a relaxed fit, add 2-4 inches to your measurement.
          </p>
        </div>

        {/* Adult Sizes Table */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Adult Sizes
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Size
                </th>
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Chest
                </th>
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Fit
                </th>
              </tr>
            </thead>
            <tbody>
              {ADULT_SIZE_LIST.map((size) => (
                <tr
                  key={size.id}
                  className="border-b border-[var(--border-default)]"
                >
                  <td className="py-3 font-semibold text-[var(--text-primary)]">
                    {size.label}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {size.chest}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {size.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Kids Sizes Table */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Kids Sizes
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Size
                </th>
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Chest
                </th>
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium">
                  Age
                </th>
              </tr>
            </thead>
            <tbody>
              {KIDS_SIZE_LIST.map((size) => (
                <tr
                  key={size.id}
                  className="border-b border-[var(--border-default)]"
                >
                  <td className="py-3 font-semibold text-[var(--text-primary)]">
                    {size.label}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {size.chest}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {size.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
