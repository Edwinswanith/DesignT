import { NextRequest, NextResponse } from "next/server";

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Working image generation model
const IMAGE_MODEL = "gemini-2.0-flash-exp-image-generation";

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
  referenceImage?: {
    data: string;
    mimeType: string;
  };
}

// Enhanced prompt templates for t-shirt design generation
const TSHIRT_DESIGN_CONTEXT = `Create a professional t-shirt design illustration that is:
- Suitable for DTF/screen printing on fabric
- Clean edges with transparent or white background
- Vibrant, print-friendly colors with high contrast
- Bold, clear shapes and forms that print well at chest size
- Modern graphic design aesthetic, vector-like quality`;

const REFERENCE_IMAGE_CONTEXT = `Use the uploaded image as style and color inspiration.
Extract the key visual elements, mood, and color palette.
Transform these into an original, print-ready t-shirt design.`;

const STYLE_SUFFIX = `Style: Professional graphic design, crisp illustration,
solid print-friendly colors that work on both light and dark fabric.
Output: High-quality design image suitable for t-shirt printing.`;

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const aspectRatio = body.aspectRatio || "1:1";

    let contents: GeminiContent[];

    if (body.contents && body.contents.length > 0) {
      // Multi-turn conversation mode
      // Enhance the last user message with t-shirt design context
      contents = body.contents.map((content, index) => {
        if (content.role === "user" && index === body.contents.length - 1) {
          const textParts = content.parts.filter(p => p.text);
          const imageParts = content.parts.filter(p => p.inlineData);
          const userText = textParts.map(p => p.text).join(" ").trim();

          // Check if this is a follow-up modification request
          const isFollowUp = body.contents.length > 1;
          const hasReferenceImage = imageParts.length > 0;

          let enhancedText: string;

          if (isFollowUp) {
            // Follow-up request - focus on modification while maintaining t-shirt context
            enhancedText = `${userText}

Remember: Keep the result as a print-ready t-shirt design with clean edges and vibrant colors.`;
          } else if (hasReferenceImage) {
            // First message with reference image
            enhancedText = `${TSHIRT_DESIGN_CONTEXT}

${REFERENCE_IMAGE_CONTEXT}

Design request: ${userText}

${STYLE_SUFFIX}`;
          } else {
            // First message, text only
            enhancedText = `${TSHIRT_DESIGN_CONTEXT}

Design request: ${userText}

${STYLE_SUFFIX}`;
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

      // Build enhanced prompt with t-shirt design context
      let enhancedPrompt: string;

      if (hasReferenceImage) {
        enhancedPrompt = `${TSHIRT_DESIGN_CONTEXT}

${REFERENCE_IMAGE_CONTEXT}

Design request: ${body.prompt}

${STYLE_SUFFIX}`;
      } else {
        enhancedPrompt = `${TSHIRT_DESIGN_CONTEXT}

Design request: ${body.prompt}

${STYLE_SUFFIX}`;
      }

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

    console.log(`[Gemini] Model: ${IMAGE_MODEL}, Aspect: ${aspectRatio}`);

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
