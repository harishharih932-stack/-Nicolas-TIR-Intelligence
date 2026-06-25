
// Pure client-side, math-only TIR -> RGB colorization.
type RGB = [number, number, number];
const ANCHORS: { t: number; c: RGB }[] = [
  { t: 0.00, c: [12, 28, 64] },     // deep water
  { t: 0.12, c: [22, 55, 110] },    // shallow water
  { t: 0.22, c: [34, 70, 45] },     // dense forest
  { t: 0.38, c: [70, 110, 55] },    // vegetation / crops
  { t: 0.55, c: [150, 140, 85] },   // dry grass / fallow
  { t: 0.72, c: [185, 160, 120] },  // bare soil
  { t: 0.86, c: [205, 195, 180] },  // sparse urban
  { t: 1.00, c: [235, 232, 225] },  // hot urban / concrete
];
function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }
function mapColor(t: number): RGB {
  if (t <= 0) return ANCHORS[0].c;
  if (t >= 1) return ANCHORS[ANCHORS.length - 1].c;
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i], b = ANCHORS[i + 1];
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / (b.t - a.t);
      return [lerp(a.c[0], b.c[0], k), lerp(a.c[1], b.c[1], k), lerp(a.c[2], b.c[2], k)];
    }
  }
  return ANCHORS[ANCHORS.length - 1].c;
}
function percentileStretch(gray: Float32Array, loP = 0.02, hiP = 0.98) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < gray.length; i++) hist[Math.max(0, Math.min(255, gray[i] | 0))]++;
  const total = gray.length;
  let acc = 0, lo = 0, hi = 255;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc / total >= loP) { lo = i; break; } }
  acc = 0;
  for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc / total >= 1 - hiP) { hi = i; break; } }
  const out = new Float32Array(gray.length);
  const inv = 1 / (hi - lo || 1);
  for (let i = 0; i < gray.length; i++) out[i] = Math.max(0, Math.min(1, (gray[i] - lo) * inv));
  return out;
}
export async function mathColorizeTIR(dataUrl: string, opts: any = {}) {
  const scale = opts.scale ?? 2;
  const img = await new Promise<HTMLImageElement>((resolve) => {
    const im = new Image(); im.onload = () => resolve(im); im.src = dataUrl;
  });
  const cIn = document.createElement("canvas");
  cIn.width = img.naturalWidth; cIn.height = img.naturalHeight;
  const ctxIn = cIn.getContext("2d")!; ctxIn.drawImage(img, 0, 0);
  const src = ctxIn.getImageData(0, 0, cIn.width, cIn.height);
  const gray = new Float32Array(cIn.width * cIn.height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    gray[i] = 0.2126 * src.data[p] + 0.7152 * src.data[p + 1] + 0.0722 * src.data[p + 2];
  }
  const norm = percentileStretch(gray);
  const W = cIn.width * scale, H = cIn.height * scale;
  const cSmall = document.createElement("canvas");
  cSmall.width = cIn.width; cSmall.height = cIn.height;
  const ctxSmall = cSmall.getContext("2d")!;
  const small = ctxSmall.createImageData(cIn.width, cIn.height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    const [r, g, b] = mapColor(norm[i]);
    small.data[p] = r; small.data[p + 1] = g; small.data[p + 2] = b; small.data[p + 3] = 255;
  }
  ctxSmall.putImageData(small, 0, 0);
  const cOut = document.createElement("canvas");
  cOut.width = W; cOut.height = H;
  const ctxOut = cOut.getContext("2d")!;
  ctxOut.imageSmoothingEnabled = true;
  ctxOut.drawImage(cSmall, 0, 0, W, H);
  return cOut.toDataURL("image/png");
}
