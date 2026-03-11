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
  ShowBackButton,
} from "@/components/studio";
import { useDesignStore } from "@/stores/useDesignStore";
import { useProductStore } from "@/stores/useProductStore";

export default function CustomizePage() {
  const router = useRouter();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [side, setSide] = useState<"front" | "back">("front");

  const { mode, currentDesign, uploadedImage, backDesign } = useDesignStore();
  const {
    color,
    setColor,
    size,
    setSize,
    designPosition,
    backDesignPosition,
    setDesignPosition,
    setBackDesignPosition,
    resetPosition,
  } = useProductStore();

  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;

  if (!activeDesign) {
    router.push("/studio");
    return null;
  }

  const handleBack = () => router.push("/studio");
  const handleContinue = () => router.push("/studio/details");

  return (
    <StudioLayout currentStep={2}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left Panel - Customization Options */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
            <ColorSelector value={color} onChange={setColor} />
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
            <SizeSelector value={size} onChange={setSize} />
            <button
              onClick={() => setShowSizeGuide(true)}
              className="mt-4 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              View Size Guide
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
            <PositionControls
              position={side === "back" ? backDesignPosition : designPosition}
              onChange={side === "back" ? setBackDesignPosition : setDesignPosition}
              onReset={resetPosition}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-5">
          <div className="bg-[var(--surface-raised)] rounded-2xl p-6 border border-[var(--border-default)] sticky top-20 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                Preview
              </h3>
              <ShowBackButton side={side} onToggle={setSide} />
            </div>
            <TShirtPreview
              color={color}
              designImage={activeDesign}
              backDesignImage={backDesign}
              designPosition={designPosition}
              backDesignPosition={backDesignPosition}
              size="lg"
              side={side}
            />

            <div className="mt-5 pt-5 border-t border-[var(--border-default)]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Color</span>
                  <p className="font-semibold text-[var(--text-primary)] capitalize mt-0.5">
                    {color.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Size</span>
                  <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                    {size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
              <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Button>
            <Button size="lg" onClick={handleContinue} className="flex-1">
              Continue
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </StudioLayout>
  );
}
