
import { Card } from "./ui/card";
export function SourcePanel() {
  return (
    <Card className="p-6 bg-slate-900 text-slate-100 font-mono text-xs overflow-auto h-[500px]">
      <pre>{`export async function mathColorizeTIR(dataUrl, opts) {
  // Deterministic Physics-Informed Pipeline
  const scale = opts.scale ?? 2;
  const sharpen = opts.sharpen ?? 0.7;
  
  // 1. Percentile Stretch
  // T_norm(x,y) = (I(x,y) - P2) / (P98 - P2)
  
  // 2. 8-Anchor LUT
  // RGB(x,y) = LUT8(T_norm)
  
  // 3. Unsharp Mask
  // I' = I + alpha * (I - G*I)
  
  // 4. Bicubic Super-Resolution
  // Resize 2x
}`}</pre>
    </Card>
  );
}