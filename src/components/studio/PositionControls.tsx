"use client";

import { Slider, Button } from "@/components/ui";

interface PositionControlsProps {
  position: { y: number; scale: number };
  onChange: (position: Partial<{ y: number; scale: number }>) => void;
  onReset: () => void;
}

export function PositionControls({
  position,
  onChange,
  onReset,
}: PositionControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[var(--text-primary)]">
          Design Position
        </label>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* Vertical Position */}
      <Slider
        label="Vertical Position"
        value={position.y}
        onChange={(e) => onChange({ y: Number(e.target.value) })}
        min={20}
        max={70}
        step={1}
        formatValue={(v) => `${v}%`}
      />

      {/* Scale */}
      <Slider
        label="Design Size"
        value={position.scale * 100}
        onChange={(e) => onChange({ scale: Number(e.target.value) / 100 })}
        min={50}
        max={150}
        step={5}
        formatValue={(v) => `${v}%`}
      />
    </div>
  );
}
