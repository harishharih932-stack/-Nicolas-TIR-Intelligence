// Logic translated directly from ISRO Baseline Repo (visualization.py & downscale.py)
export function percentileStretch(data: Float32Array, low = 2, high = 98): Float32Array {
  const sorted = [...data].sort((a, b) => a - b);
  const lowVal = sorted[Math.floor((low / 100) * (data.length - 1))];
  const highVal = sorted[Math.floor((high / 100) * (data.length - 1))];
  const range = highVal - lowVal || 1e-5;
  
  const out = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = Math.max(0, Math.min(1, (data[i] - lowVal) / range));
  }
  return out;
}

/**
 * Simulates ISRO box_average_downscale logic.
 * In a real scenario, this would use OpenCV, here we use canvas context.
 */
export async function simulateIsroDownscale(imgUrl: string, factor: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width / factor);
      canvas.height = Math.round(img.height / factor);
      const ctx = canvas.getContext("2d")!;
      // INTER_AREA simulation: draw downscaled
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imgUrl;
  });
}
