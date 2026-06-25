import { percentileStretch } from "./isroLogic";

type RGB = [number, number, number];

// Physics-informed LUT mapping for Landsat-9 TIR
const ANCHORS: { t: number; c: RGB }[] = [
  { t: 0.00, c: [10, 35, 85] },    // Deep Water (Coldest)
  { t: 0.12, c: [22, 58, 112] },   // Shallow Water
  { t: 0.24, c: [28, 82, 52] },    // Dense Forest
  { t: 0.40, c: [79, 123, 58] },   // Vegetation
  { t: 0.56, c: [145, 138, 82] },  // Soil / Dry Grass
  { t: 0.72, c: [181, 158, 119] }, // Barren / Sand
  { t: 0.88, c: [180, 180, 180] }, // Urban (Warm)
  { t: 1.00, c: [238, 235, 226] }, // Hot built-up / Snow (Brightest)
];

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function mapColor(t: number): RGB {
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i], b = ANCHORS[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / (b.t - a.t);
      return [lerp(a.c[0], b.c[0], k), lerp(a.c[1], b.c[1], k), lerp(a.c[2], b.c[2], k)];
    }
  }
  return ANCHORS[ANCHORS.length - 1].c;
}

export async function mathColorizeTIR(dataUrl: string) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const gray = new Float32Array(canvas.width * canvas.height);
      for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
        gray[i] = 0.299 * src.data[p] + 0.587 * src.data[p + 1] + 0.114 * src.data[p + 2];
      }
      const stretched = percentileStretch(gray);
      const outData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
        const [r, g, b] = mapColor(stretched[i]);
        // ISRO Request: Blue, Green, Red order simulation
        // But for browser display we keep RGBA
        outData.data[p] = r;
        outData.data[p + 1] = g;
        outData.data[p + 2] = b;
        outData.data[p + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);
      
      // Upscale 2x for 100m simulation
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width * 2;
      finalCanvas.height = canvas.height * 2;
      const fctx = finalCanvas.getContext("2d")!;
      fctx.imageSmoothingEnabled = true;
      fctx.imageSmoothingQuality = "high";
      fctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
      resolve(finalCanvas.toDataURL("image/png"));
    };
    img.src = dataUrl;
  });
}
