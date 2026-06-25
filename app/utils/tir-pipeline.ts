
export interface ColorLUT {
  water: number[];
  forest: number[];
  crops: number[];
  soil: number[];
  urban: number[];
}

export const DEFAULT_LUT: ColorLUT = {
  water: [0, 0, 128],
  forest: [34, 139, 34],
  crops: [154, 205, 50],
  soil: [139, 69, 19],
  urban: [128, 128, 128]
};

/**
 * Brightness Temperature: T = K2 / ln(K1/L_lambda + 1)
 */
export function calculateBrightnessTemp(radiance: number, K1: number, K2: number): number {
  return K2 / Math.log(K1 / radiance + 1);
}

/**
 * Percentile contrast stretch: T_norm = clamp((I - P2)/(P98 - P2), 0, 1)
 */
export function contrastStretch(val: number, p2: number, p98: number): number {
  const norm = (val - p2) / (p98 - p2);
  return Math.max(0, Math.min(1, norm));
}

/**
 * Simple 8-anchor land-cover LUT colorization
 */
export function applyLUT(norm: number, lut: ColorLUT): number[] {
  if (norm < 0.1) return lut.water;
  if (norm < 0.3) return lut.forest;
  if (norm < 0.5) return lut.crops;
  if (norm < 0.8) return lut.soil;
  return lut.urban;
}

/**
 * Pollution proxy: AOD = mu/255 * (1 - sigma/90), AQI = 250*AOD + 4*Haze% + 6*Smoke%
 */
export function calculateAQI(mu: number, sigma: number, haze: number, smoke: number): number {
  const aod = (mu / 255) * (1 - sigma / 90);
  return 250 * aod + 4 * haze + 6 * smoke;
}

/**
 * Volcano hotspot: pixels where T > T_bg + 3*sigma AND T > 313 K
 */
export function isVolcanoHotspot(t: number, tBg: number, sigma: number): boolean {
  return t > tBg + 3 * sigma && t > 313;
}
