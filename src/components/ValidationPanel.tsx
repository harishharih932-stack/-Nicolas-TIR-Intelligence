import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { simulateIsroDownscale } from "@/lib/isroLogic";
import { Activity, Beaker, CheckCircle2, ChevronRight, FileSearch } from "lucide-react";

export function ValidationPanel() {
  const [refUrl, setRefUrl] = useState<string | null>(null);
  const [simulatedTir, setSimulatedTir] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!refUrl) return;
    // Simulate 30m -> 100m (3.33x) and 30m -> 200m (6.66x) logic from repo
    const res = await simulateIsroDownscale(refUrl, 3.33);
    setSimulatedTir(res);
  };

  return (
    <Card className="p-6 bg-white border-slate-200 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black flex gap-2 items-center"><Beaker className="text-blue-600"/> ISRO Validation Simulator</h3>
          <p className="text-sm text-slate-500">Dataset matching logic from scripts/downscale.py and create_patches.py</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">Level: Expert</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase text-slate-400">1. Reference (30m RGB)</p>
          <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden">
            {refUrl ? <img src={refUrl} className="w-full h-full object-cover" /> : <label className="cursor-pointer text-center p-4">
              <FileSearch className="mx-auto mb-2 text-slate-300"/>
              <span className="text-[10px] text-slate-400">Upload High-res B4-B3-B2 merge</span>
              <input type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { const r = new FileReader(); r.onload = () => setRefUrl(r.result as string); r.readAsDataURL(f); }
              }} />
            </label>}
          </div>
          {refUrl && <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => setRefUrl(null)}>Clear</Button>}
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
           <ChevronRight size={32} className="text-slate-200 hidden md:block" />
           <Button onClick={handleSimulate} disabled={!refUrl} className="bg-blue-600 text-white font-bold h-12 px-6">
             <Activity className="mr-2 h-4 w-4" /> Run Downscale Script
           </Button>
           <p className="text-[10px] text-center text-slate-400 max-w-[150px]">Simulates the factor 3.33x and 6.66x area-averaging from repo.</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase text-slate-400">2. Simulated Input (100m/200m)</p>
          <div className="aspect-square bg-slate-100 rounded-lg border flex items-center justify-center overflow-hidden">
             {simulatedTir ? <img src={simulatedTir} className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-300">Run simulation to generate</span>}
          </div>
          {simulatedTir && <div className="p-3 rounded bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 flex gap-2">
            <CheckCircle2 size={14} className="shrink-0"/>
            Co-registered patch ready for inference benchmarking.
          </div>}
        </div>
      </div>
      
      <Card className="p-4 bg-slate-950 text-slate-200 font-mono text-[10px]">
        <p className="text-blue-400 mb-2">// ISRO Baseline Metric Target</p>
        <p>Goal: Minimize MSE between Colorized(TIR_100m) and Ref_RGB_100m</p>
        <p>Target PSNR: > 28.0 dB</p>
        <p>Target SSIM: > 0.85</p>
      </Card>
    </Card>
  );
}
