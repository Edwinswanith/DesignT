/**
 * Client-side background removal using canvas.
 * Detects the dominant corner color (background) and makes similar pixels transparent.
 * Returns a PNG data URL with transparency.
 */

interface RemoveBgOptions {
  /** Color distance threshold (0-255). Higher = more aggressive removal. Default: 50 */
  threshold?: number;
  /** Edge feathering in pixels. Default: 2 */
  feather?: number;
}

/**
 * Removes the background from a base64 image by detecting and removing the
 * dominant background color sampled from the corners.
 */
export async function removeBackground(
  imageDataUrl: string,
  options: RemoveBgOptions = {}
): Promise<string> {
  const { threshold = 50, feather = 2 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(imageDataUrl); // fallback to original
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample corners to determine background color
        const cornerSamples: [number, number, number][] = [];
        const sampleSize = Math.max(4, Math.floor(Math.min(w, h) * 0.03));

        // Sample from 4 corners
        for (let dy = 0; dy < sampleSize; dy++) {
          for (let dx = 0; dx < sampleSize; dx++) {
            // Top-left
            const tl = ((dy) * w + dx) * 4;
            cornerSamples.push([data[tl], data[tl + 1], data[tl + 2]]);
            // Top-right
            const tr = ((dy) * w + (w - 1 - dx)) * 4;
            cornerSamples.push([data[tr], data[tr + 1], data[tr + 2]]);
            // Bottom-left
            const bl = ((h - 1 - dy) * w + dx) * 4;
            cornerSamples.push([data[bl], data[bl + 1], data[bl + 2]]);
            // Bottom-right
            const br = ((h - 1 - dy) * w + (w - 1 - dx)) * 4;
            cornerSamples.push([data[br], data[br + 1], data[br + 2]]);
          }
        }

        // Find the average background color
        const avgR = Math.round(cornerSamples.reduce((s, c) => s + c[0], 0) / cornerSamples.length);
        const avgG = Math.round(cornerSamples.reduce((s, c) => s + c[1], 0) / cornerSamples.length);
        const avgB = Math.round(cornerSamples.reduce((s, c) => s + c[2], 0) / cornerSamples.length);

        // Check if corners are consistent enough to be a background
        const variance = cornerSamples.reduce((s, c) => {
          return s + Math.abs(c[0] - avgR) + Math.abs(c[1] - avgG) + Math.abs(c[2] - avgB);
        }, 0) / cornerSamples.length;

        // If corners are too varied, likely no uniform background
        if (variance > 80) {
          console.log("[removeBackground] Corners too varied, skipping removal. Variance:", variance);
          resolve(imageDataUrl);
          return;
        }

        // Remove pixels similar to background color
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Color distance from background
          const distance = Math.sqrt(
            (r - avgR) ** 2 +
            (g - avgG) ** 2 +
            (b - avgB) ** 2
          );

          if (distance < threshold) {
            // Fully transparent
            data[i + 3] = 0;
          } else if (distance < threshold + feather * 10) {
            // Feathered edge — gradual transparency
            const alpha = Math.round(((distance - threshold) / (feather * 10)) * 255);
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Export as PNG (supports transparency)
        const result = canvas.toDataURL("image/png");
        resolve(result);
      } catch (err) {
        console.error("[removeBackground] Error:", err);
        resolve(imageDataUrl); // fallback
      }
    };

    img.onerror = () => {
      console.error("[removeBackground] Failed to load image");
      resolve(imageDataUrl); // fallback
    };

    img.src = imageDataUrl;
  });
}
