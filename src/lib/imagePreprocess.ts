/**
 * Image preprocessing utility for DesignT
 * Resizes and compresses images before sending to API
 * Handles large images from user uploads
 */

interface PreprocessResult {
  data: string; // Base64 data URL
  mimeType: string;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
}

interface PreprocessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: "jpeg" | "webp" | "png";
}

const DEFAULT_OPTIONS: Required<PreprocessOptions> = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.85,
  outputFormat: "jpeg",
};

/**
 * Preprocesses an image by resizing and compressing it
 * @param dataUrl - The original image as a data URL
 * @param options - Preprocessing options
 * @returns Promise with the processed image data
 */
export async function preprocessImage(
  dataUrl: string,
  options: PreprocessOptions = {}
): Promise<PreprocessResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate original size from data URL
        const originalSize = Math.round((dataUrl.length * 3) / 4);

        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > opts.maxWidth || height > opts.maxHeight) {
          if (width / opts.maxWidth > height / opts.maxHeight) {
            width = opts.maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = opts.maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output format and mime type
        const mimeType =
          opts.outputFormat === "png"
            ? "image/png"
            : opts.outputFormat === "webp"
            ? "image/webp"
            : "image/jpeg";

        // Convert to compressed data URL
        const processedDataUrl = canvas.toDataURL(mimeType, opts.quality);

        // Calculate processed size
        const processedSize = Math.round((processedDataUrl.length * 3) / 4);
        const compressionRatio = originalSize / processedSize;

        // Log compression info for debugging
        console.log(
          `[ImagePreprocess] Original: ${formatBytes(originalSize)} → Processed: ${formatBytes(processedSize)} ` +
            `(${compressionRatio.toFixed(1)}x compression, ${width}x${height})`
        );

        resolve({
          data: processedDataUrl,
          mimeType,
          originalSize,
          processedSize,
          compressionRatio,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for preprocessing"));
    };

    img.src = dataUrl;
  });
}

/**
 * Batch preprocesses multiple images
 * @param images - Array of image data URLs with mime types
 * @param options - Preprocessing options
 * @returns Promise with array of processed images
 */
export async function preprocessImages(
  images: { data: string; mimeType: string }[],
  options: PreprocessOptions = {}
): Promise<{ data: string; mimeType: string }[]> {
  const results = await Promise.all(
    images.map(async (img) => {
      try {
        const result = await preprocessImage(img.data, options);
        return {
          data: result.data,
          mimeType: result.mimeType,
        };
      } catch (error) {
        console.error("[ImagePreprocess] Failed to process image:", error);
        // Return original if preprocessing fails
        return img;
      }
    })
  );

  return results;
}

/**
 * Checks if an image needs preprocessing based on size
 * @param dataUrl - Image data URL
 * @param maxSizeBytes - Maximum allowed size in bytes (default 500KB)
 * @returns boolean indicating if preprocessing is needed
 */
export function needsPreprocessing(
  dataUrl: string,
  maxSizeBytes: number = 500 * 1024
): boolean {
  const estimatedSize = Math.round((dataUrl.length * 3) / 4);
  return estimatedSize > maxSizeBytes;
}

/**
 * Gets estimated byte size from a data URL
 * @param dataUrl - Image data URL
 * @returns Estimated size in bytes
 */
export function getDataUrlSize(dataUrl: string): number {
  return Math.round((dataUrl.length * 3) / 4);
}

/**
 * Formats bytes to human-readable string
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Extracts base64 data from a data URL
 * @param dataUrl - Full data URL string
 * @returns Just the base64 data portion
 */
export function extractBase64(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return dataUrl;
  return dataUrl.substring(commaIndex + 1);
}

/**
 * Creates a data URL from base64 and mime type
 * @param base64 - Base64 encoded data
 * @param mimeType - MIME type of the image
 * @returns Complete data URL
 */
export function createDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}
