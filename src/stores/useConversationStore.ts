"use client";

import { create } from "zustand";
import { AspectRatioId } from "@/constants/prompts";
import { ImageStyleId } from "@/constants/styles";

// Types for conversation messages
export interface MessagePart {
  type: "text" | "image";
  content: string; // text content or base64 image data
  mimeType?: string; // for images
}

export interface ConversationMessage {
  id: string;
  role: "user" | "model";
  parts: MessagePart[];
  timestamp: number;
}

// API format for Gemini
export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface ConversationState {
  messages: ConversationMessage[];
  isGenerating: boolean;
  error: string | null;
  selectedDesign: string | null; // The design user wants to use for t-shirt
  aspectRatio: AspectRatioId;
  imageStyle: ImageStyleId;
}

interface ConversationActions {
  addUserMessage: (text: string, images?: { data: string; mimeType: string }[]) => string;
  addModelMessage: (parts: MessagePart[]) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDesign: (design: string | null) => void;
  setAspectRatio: (ratio: AspectRatioId) => void;
  setImageStyle: (style: ImageStyleId) => void;
  clearConversation: () => void;
  getGeminiHistory: () => GeminiContent[];
}

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useConversationStore = create<ConversationState & ConversationActions>()(
  (set, get) => ({
    messages: [],
    isGenerating: false,
    error: null,
    selectedDesign: null,
    aspectRatio: "1:1",
    imageStyle: "none",

    addUserMessage: (text, images) => {
      const parts: MessagePart[] = [];

      // Add text part
      if (text.trim()) {
        parts.push({ type: "text", content: text });
      }

      // Add image parts
      if (images && images.length > 0) {
        images.forEach((img) => {
          // Strip data URL prefix if present
          let imageData = img.data;
          if (imageData.includes(",")) {
            imageData = imageData.split(",")[1];
          }
          parts.push({
            type: "image",
            content: imageData,
            mimeType: img.mimeType,
          });
        });
      }

      const message: ConversationMessage = {
        id: generateId(),
        role: "user",
        parts,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, message],
      }));

      return message.id;
    },

    addModelMessage: (parts) => {
      const message: ConversationMessage = {
        id: generateId(),
        role: "model",
        parts,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, message],
      }));
    },

    setGenerating: (isGenerating) => set({ isGenerating }),

    setError: (error) => set({ error }),

    setSelectedDesign: (selectedDesign) => set({ selectedDesign }),

    setAspectRatio: (aspectRatio) => set({ aspectRatio }),

    setImageStyle: (imageStyle) => set({ imageStyle }),

    clearConversation: () =>
      set({
        messages: [],
        error: null,
        selectedDesign: null,
        aspectRatio: "1:1",
        imageStyle: "none",
      }),

    // Convert conversation to Gemini API format
    getGeminiHistory: () => {
      const { messages } = get();

      return messages.map((msg) => {
        const geminiParts: GeminiPart[] = msg.parts.map((part) => {
          if (part.type === "text") {
            return { text: part.content };
          } else {
            return {
              inlineData: {
                mimeType: part.mimeType || "image/png",
                data: part.content,
              },
            };
          }
        });

        return {
          role: msg.role,
          parts: geminiParts,
        };
      });
    },
  })
);
