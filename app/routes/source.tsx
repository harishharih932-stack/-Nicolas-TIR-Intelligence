
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/source')({
  component: SourceCode,
})

const MATH_PIPELINE = `export interface ColorLUT {
  water: number[];
  forest: number[];
  crops: number[];
  soil: number[];
  urban: number[];
}

// Brightness Temperature Calculation
// T = K2 / ln(K1/L_lambda + 1)
export function calculateBrightnessTemp(radiance: number, K1: number, K2: number): number {
  return K2 / Math.log(K1 / radiance + 1);
}

// Percentile contrast stretch
// T_norm = clamp((I - P2)/(P98 - P2), 0, 1)
export function contrastStretch(val: number, p2: number, p98: number): number {
  const norm = (val - p2) / (p98 - p2);
  return Math.max(0, Math.min(1, norm));
}

// Pollution proxy
// AOD = mu/255 * (1 - sigma/90)
// AQI = 250*AOD + 4*Haze% + 6*Smoke%
export function calculateAQI(mu: number, sigma: number, haze: number, smoke: number): number {
  const aod = (mu / 255) * (1 - sigma / 90);
  return 250 * aod + 4 * haze + 6 * smoke;
}`;

function SourceCode() {
  return (
    <div className="space-y-6">
      <div className="header-box">
        <h1 className="text-3xl font-bold">Source Code</h1>
        <p className="opacity-90">Core Math Pipeline (Deterministic)</p>
      </div>

      <div className="card bg-slate-900 text-slate-100 p-6 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          {MATH_PIPELINE}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-2">Algorithm Flow</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
            <li>Single-band TIR Input (200m)</li>
            <li>Radiance to Brightness Temp Conversion</li>
            <li>Contrast Enhancement & Denoising</li>
            <li>LUT-based Colorization (Thermal to RGB)</li>
            <li>Bicubic 2x Super-Resolution to 100m</li>
          </ol>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2">Tech Stack</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
            <li>TanStack Start (Fullstack React)</li>
            <li>Tailwind v4 (Utility Styling)</li>
            <li>Pyodide (In-browser Python kernels)</li>
            <li>Gemini 2.5 Flash (AI refinement)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
