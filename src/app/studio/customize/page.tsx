"use client";

import { useState, useEffect } from "react";
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
import { useCartStore } from "@/stores/useCartStore";
import { PRICING } from "@/constants/pricing";
import type { CartItem } from "@/types";

type MobileTab = "color" | "size" | "position" | "summary";

export default function CustomizePage() {
  const router = useRouter();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [side, setSide] = useState<"front" | "back">("front");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [mobileTab, setMobileTab] = useState<MobileTab>("color");

  const { mode, currentDesign, uploadedImage, backDesign, aspectRatio, reset: resetDesign } = useDesignStore();
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
    reset: resetProduct,
  } = useProductStore();
  const { addItem, items: cartItems } = useCartStore();

  const activeDesign = mode === "ai" ? currentDesign : uploadedImage;

  useEffect(() => {
    if (!activeDesign) {
      router.push("/studio");
    }
  }, [activeDesign, router]);

  const buildCartItem = (designImage: string): CartItem => ({
    id: crypto.randomUUID(),
    color,
    size,
    quantity: itemQuantity,
    designImage,
    backDesignImage: backDesign ?? null,
    designPosition,
    backDesignPosition,
    aspectRatio,
    mode,
  });

  const handleBack = () => router.push("/studio");

  const handleContinueToOrder = () => {
    if (!activeDesign) return;
    addItem(buildCartItem(activeDesign));
    router.push("/studio/details");
  };

  const handleAddAnother = () => {
    if (!activeDesign) return;
    addItem(buildCartItem(activeDesign));
    resetDesign();
    resetProduct();
    router.push("/studio");
  };

  return (
    <StudioLayout currentStep={2}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_220px] gap-5 lg:gap-6">
        {/* Left Panel - Desktop only; customization options stacked */}
        <div className="hidden lg:block space-y-5 order-2 lg:order-1">
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

        {/* Center Panel - Preview (order-1 lg:order-2) */}
        <div className="order-1 lg:order-2">
          <div className="bg-[var(--surface-raised)] rounded-2xl p-6 border border-[var(--border-default)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
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
          </div>
        </div>

        {/* Mobile: tabbed editing + bottom actions */}
        <div className="lg:hidden order-2 space-y-4">
          <div className="rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] overflow-hidden">
            <div className="flex border-b border-[var(--border-default)]">
              {(["color", "size", "position", "summary"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMobileTab(tab)}
                  className={`flex-1 py-3 px-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    mobileTab === tab
                      ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-5 min-h-[200px]">
              {mobileTab === "color" && (
                <ColorSelector value={color} onChange={setColor} />
              )}
              {mobileTab === "size" && (
                <>
                  <SizeSelector value={size} onChange={setSize} />
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="mt-4 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
                  >
                    View Size Guide
                  </button>
                </>
              )}
              {mobileTab === "position" && (
                <PositionControls
                  position={side === "back" ? backDesignPosition : designPosition}
                  onChange={side === "back" ? setBackDesignPosition : setDesignPosition}
                  onReset={resetPosition}
                />
              )}
              {mobileTab === "summary" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Color</span>
                      <p className="font-semibold text-[var(--text-primary)] capitalize mt-0.5 text-sm">
                        {color.replace("-", " ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Size</span>
                      <p className="font-semibold text-[var(--text-primary)] mt-0.5 text-sm">
                        {size}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">Quantity</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setItemQuantity((q) => Math.max(PRICING.MIN_QUANTITY, q - 1))}
                          disabled={itemQuantity <= PRICING.MIN_QUANTITY}
                          className="w-8 h-8 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-inset)] transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[var(--text-primary)]">
                          {itemQuantity}
                        </span>
                        <button
                          onClick={() => setItemQuantity((q) => Math.min(PRICING.MAX_QUANTITY, q + 1))}
                          disabled={itemQuantity >= PRICING.MAX_QUANTITY}
                          className="w-8 h-8 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-inset)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {cartItems.length > 0 && (
                    <div className="text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-lg px-3 py-1.5 text-center">
                      Cart: {cartItems.length} item{cartItems.length > 1 ? "s" : ""} saved
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 pb-6">
            <Button variant="outline" size="md" onClick={handleBack} className="w-full">
              <svg className="mr-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Button>
            <Button size="md" onClick={handleContinueToOrder} className="w-full">
              Continue to Order
              <svg className="ml-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
            <Button variant="outline" size="md" onClick={handleAddAnother} className="w-full">
              + Add Another T-shirt
            </Button>
          </div>
        </div>

        {/* Right Panel - Summary & Actions (desktop only) */}
        <div className="hidden lg:block order-3">
          <div className="bg-[var(--surface-raised)] rounded-2xl p-5 border border-[var(--border-default)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Summary</h3>
            <div className="space-y-3 pb-4 border-b border-[var(--border-default)]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Color</span>
                <p className="font-semibold text-[var(--text-primary)] capitalize mt-0.5 text-sm">
                  {color.replace("-", " ")}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--text-tertiary)]">Size</span>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 text-sm">
                  {size}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-4 pb-4 border-b border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setItemQuantity((q) => Math.max(PRICING.MIN_QUANTITY, q - 1))}
                    disabled={itemQuantity <= PRICING.MIN_QUANTITY}
                    className="w-8 h-8 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-inset)] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-[var(--text-primary)]">
                    {itemQuantity}
                  </span>
                  <button
                    onClick={() => setItemQuantity((q) => Math.min(PRICING.MAX_QUANTITY, q + 1))}
                    disabled={itemQuantity >= PRICING.MAX_QUANTITY}
                    className="w-8 h-8 rounded-lg border border-[var(--border-default)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--surface-inset)] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Badge */}
            {cartItems.length > 0 && (
              <div className="pt-4 pb-4 border-b border-[var(--border-default)]">
                <div className="text-xs font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-lg px-3 py-1.5 text-center">
                  Cart: {cartItems.length} item{cartItems.length > 1 ? "s" : ""} saved
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`${cartItems.length > 0 ? "pt-4" : "pt-4"} space-y-2`}>
              <Button variant="outline" size="md" onClick={handleBack} className="w-full">
                <svg className="mr-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </Button>
              <Button size="md" onClick={handleContinueToOrder} className="w-full">
                Continue to Order
                <svg className="ml-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
              <Button variant="outline" size="md" onClick={handleAddAnother} className="w-full">
                + Add Another T-shirt
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </StudioLayout>
  );
}
