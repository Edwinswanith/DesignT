import { NextRequest, NextResponse } from "next/server";

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Working image generation model - upgraded to 2.5 Flash Image (Nano Banana)
const IMAGE_MODEL = "gemini-2.5-flash-image";

function getApiUrl(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

// Types for Gemini API
interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface RequestBody {
  contents: GeminiContent[];
  prompt?: string;
  aspectRatio?: string;
  style?: string;
  referenceImage?: {
    data: string;
    mimeType: string;
  };
}

// Minimal context for t-shirt printing - allows user full creative freedom
const TSHIRT_PRINT_CONTEXT = `Output should be a clean image.`;

// Context for combining multiple images (family photos)
const MULTI_IMAGE_CONTEXT = `Combine the uploaded images into a cohesive composition.
Maintain the likeness and identity of each person/subject accurately.`;

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const aspectRatio = body.aspectRatio || "1:1";
    const style = body.style || "";

    let contents: GeminiContent[];

    if (body.contents && body.contents.length > 0) {
      // Multi-turn conversation mode
      // Enhance the last user message with minimal context - user has full creative freedom
      contents = body.contents.map((content, index) => {
        if (content.role === "user" && index === body.contents.length - 1) {
          const textParts = content.parts.filter(p => p.text);
          const imageParts = content.parts.filter(p => p.inlineData);
          const userText = textParts.map(p => p.text).join(" ").trim();

          // Check context
          const isFollowUp = body.contents.length > 1;
          const hasMultipleImages = imageParts.length > 1;

          // Build prompt with user's full freedom
          let enhancedText = userText;

          // Add style hint if provided (optional quick-select)
          if (style && style !== "none") {
            enhancedText = `${userText}\n\nStyle: ${style}`;
          }

          // Add multi-image combining context for family photos
          if (hasMultipleImages && !isFollowUp) {
            enhancedText = `${MULTI_IMAGE_CONTEXT}\n\n${enhancedText}`;
          }

          // Add minimal t-shirt print context only on first message
          if (!isFollowUp) {
            enhancedText = `${enhancedText}\n\n${TSHIRT_PRINT_CONTEXT}`;
          }

          return {
            role: content.role,
            parts: [
              { text: enhancedText },
              ...imageParts
            ]
          } as GeminiContent;
        }
        return content;
      });
    } else if (body.prompt) {
      // Simple single-turn mode (legacy fallback)
      const parts: GeminiPart[] = [];
      const hasReferenceImage = !!body.referenceImage?.data;

      // Build prompt - user has full creative freedom
      let enhancedPrompt = body.prompt;

      // Add style hint if provided
      if (style && style !== "none") {
        enhancedPrompt = `${body.prompt}\n\nStyle: ${style}`;
      }

      // Add minimal t-shirt print context
      enhancedPrompt = `${enhancedPrompt}\n\n${TSHIRT_PRINT_CONTEXT}`;

      parts.push({ text: enhancedPrompt });

      // Add reference image if provided
      if (body.referenceImage?.data) {
        let imageData = body.referenceImage.data;
        if (imageData.includes(",")) {
          imageData = imageData.split(",")[1];
        }
        parts.push({
          inlineData: {
            mimeType: body.referenceImage.mimeType || "image/png",
            data: imageData,
          },
        });
      }

      contents = [{ role: "user", parts }];
    } else {
      return NextResponse.json(
        { success: false, error: "No prompt or conversation provided" },
        { status: 400 }
      );
    }

    console.log(`[Gemini] Model: ${IMAGE_MODEL}, Aspect: ${aspectRatio}, Style: ${style || 'none'}`);

    // Call Gemini API with proper configuration per documentation
    const response = await fetch(`${getApiUrl(IMAGE_MODEL)}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      }),
    });

    const responseData = await response.json();

    console.log(`[Gemini] Status: ${response.status}`);

    if (!response.ok) {
      console.error("[Gemini] Error:", JSON.stringify(responseData, null, 2));

      const errorMessage = responseData?.error?.message || "";

      if (errorMessage.includes("not found") || errorMessage.includes("not supported")) {
        return NextResponse.json(
          { success: false, error: "Image generation model not available. Please try again later." },
          { status: 503 }
        );
      }

      if (errorMessage.includes("quota") || errorMessage.includes("limit") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          { success: false, error: "API quota exceeded. Please wait a few minutes and try again." },
          { status: 429 }
        );
      }

      if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
        return NextResponse.json(
          { success: false, error: "Content blocked by safety filters. Try a different description." },
          { status: 400 }
        );
      }

      throw new Error(errorMessage || "Failed to generate");
    }

    // Extract response parts
    const candidateParts = responseData.candidates?.[0]?.content?.parts || [];

    const partsInfo = candidateParts.map((p: GeminiPart) =>
      p.text ? 'TEXT' : p.inlineData ? 'IMAGE' : 'UNKNOWN'
    );
    console.log(`[Gemini] Parts: ${JSON.stringify(partsInfo)}`);

    // Find text and image parts
    const textPart = candidateParts.find((part: { text?: string }) => part.text);
    const imagePart = candidateParts.find(
      (part: { inlineData?: { data: string; mimeType: string } }) => part.inlineData
    );

    if (!imagePart?.inlineData) {
      const explanation = textPart?.text || "No image generated";
      console.log("[Gemini] No image. Response:", explanation.slice(0, 300));

      return NextResponse.json(
        {
          success: false,
          error: "Could not generate image. Try rephrasing your request with more detail.",
          text: explanation,
        },
        { status: 500 }
      );
    }

    console.log(`[Gemini] Success! Image MIME: ${imagePart.inlineData.mimeType}`);

    return NextResponse.json({
      success: true,
      text: textPart?.text || "Here's your design!",
      image: {
        data: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      },
    });

  } catch (error: unknown) {
    console.error("[Gemini] Exception:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.toLowerCase().includes("safety") ||
      errorMessage.toLowerCase().includes("blocked")
    ) {
      return NextResponse.json(
        { success: false, error: "Content blocked. Try a different description." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate design. Please try again." },
      { status: 500 }
    );
  }
}
