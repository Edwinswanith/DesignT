"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudioLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  TShirtPreview,
  ColorSelector,
  SizeSelector,
  PositionControls,
  SizeGuideModal,
} from "@/components/studio";
import { useDesignStore } from "@/stores/useDesignStore";
import { useProductStore } from "@/stores/useProductStore";

export default function CustomizePage() {
  const router = useRouter();
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { mode, currentDesign, uploadedImage } = useDesignStore();
  const {
    color,
    setColor,
    size,
    setSize,
    designPosition,
    setDesignPosition,
    resetPosition,
  } = useProductStore();

  // Get the active design
  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;

  // Redirect if no design
  if (!activeDesign) {
    router.push("/studio");
    return null;
  }

  const handleBack = () => {
    router.push("/studio");
  };

  const handleContinue = () => {
    router.push("/studio/details");
  };

  return (
    <StudioLayout currentStep={2}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Panel - Customization Options */}
        <div className="space-y-8">
          {/* Color Selection */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <ColorSelector value={color} onChange={setColor} />
          </div>

          {/* Size Selection */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <SizeSelector value={size} onChange={setSize} />
            <button
              onClick={() => setShowSizeGuide(true)}
              className="mt-4 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors"
            >
              View Size Guide
            </button>
          </div>

          {/* Position Controls */}
          <div className="p-6 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border-default)]">
            <PositionControls
              position={designPosition}
              onChange={setDesignPosition}
              onReset={resetPosition}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          {/* T-Shirt Preview */}
          <div className="bg-[var(--surface-raised)] rounded-[24px] p-8 border border-[var(--border-default)] sticky top-24">
            <TShirtPreview
              color={color}
              designImage={activeDesign}
              designPosition={designPosition}
              size="lg"
            />

            {/* Selected Options Summary */}
            <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-tertiary)]">Color</span>
                  <p className="font-semibold text-[var(--text-primary)] capitalize">
                    {color.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)]">Size</span>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
              <svg
                className="mr-2 w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Button>
            <Button size="lg" onClick={handleContinue} className="flex-1">
              Continue
              <svg
                className="ml-2 w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </StudioLayout>
  );
}
