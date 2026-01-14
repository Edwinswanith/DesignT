"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AspectRatioId } from "@/constants/prompts";

interface DesignState {
  mode: "ai" | "upload";
  prompt: string;
  aspectRatio: AspectRatioId;
  isGenerating: boolean;
  generationError: string | null;
  currentDesign: string | null;
  designHistory: string[];
  uploadedImage: string | null;
  referenceImage: string | null;
  isRemovingBackground: boolean;
}

interface DesignActions {
  setMode: (mode: "ai" | "upload") => void;
  setPrompt: (prompt: string) => void;
  setAspectRatio: (ratio: AspectRatioId) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setCurrentDesign: (design: string | null) => void;
  addToHistory: (design: string) => void;
  selectFromHistory: (design: string) => void;
  setUploadedImage: (image: string | null) => void;
  setReferenceImage: (image: string | null) => void;
  setRemovingBackground: (isRemoving: boolean) => void;
  reset: () => void;
}

const initialState: DesignState = {
  mode: "ai",
  prompt: "",
  aspectRatio: "1:1",
  isGenerating: false,
  generationError: null,
  currentDesign: null,
  designHistory: [],
  uploadedImage: null,
  referenceImage: null,
  isRemovingBackground: false,
};

export const useDesignStore = create<DesignState & DesignActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),

      setPrompt: (prompt) => set({ prompt }),

      setAspectRatio: (aspectRatio) => set({ aspectRatio }),

      setGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationError: (generationError) => set({ generationError }),

      setCurrentDesign: (currentDesign) => set({ currentDesign }),

      addToHistory: (design) => {
        const history = get().designHistory;
        // Add to beginning, limit to 5
        const newHistory = [design, ...history.filter((d) => d !== design)].slice(0, 5);
        set({ designHistory: newHistory });
      },

      selectFromHistory: (design) => {
        set({ currentDesign: design });
      },

      setUploadedImage: (uploadedImage) => set({ uploadedImage }),

      setReferenceImage: (referenceImage) => set({ referenceImage }),

      setRemovingBackground: (isRemovingBackground) => set({ isRemovingBackground }),

      reset: () => set(initialState),
    }),
    {
      name: "designt-design-store",
      // Only persist lightweight settings, NOT base64 images (which slow down hydration)
      partialize: (state) => ({
        aspectRatio: state.aspectRatio,
        mode: state.mode,
      }),
    }
  )
);
