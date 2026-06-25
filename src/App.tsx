import { useMemo, useRef, useState } from "react";
import { mathColorizeTIR } from "@/lib/mathColorize";
import { geminiEnhance } from "@/lib/geminiBrowser";
import { BrowserPython } from "@/components/BrowserPython";
import { PollutionPanel } from "@/components/PollutionPanel";
import { MapPanel } from "@/components/MapPanel";
import { SourcePanel } from "@/components/SourcePanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ValidationPanel } from "@/components/ValidationPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { Satellite, Upload, Download, Sparkles, Calculator, ShieldCheck, Mountain, Thermometer, Layers3, Activity, ArrowRight, Info, Factory, MapPin, Code2, Settings, Beaker } from "lucide-react";

const genTemp = () => Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  tir: +(294 + 8 * Math.sin(i / 3) + Math.random() * 2).toFixed(1),
  c: +(21 + 9 * Math.sin(i / 3) + Math.random() * 2).toFixed(1),
}));
const genAlt = () => Array.from({ length: 30 }, (_, i) => ({ x: i, alt: +(420 + 60 * Math.sin(i / 2) + Math.random() * 15).toFixed(0) }));
const genSeismic = () => Array.from({ length: 20 }, (_, i) => ({ t: i, mag: +(0.4 + Math.random() * 1.8 + (i === 12 ? 2.7 : 0)).toFixed(2) }));

function MetricCard({ icon, title, value, note, tone = "blue" }: any) {
  const toneMap: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  };
  return <Card className={`p-4 border ${toneMap[tone]}`}>
    <div className="flex items-center justify-between gap-3">
      <div>{icon}</div>
      <Badge variant="outline" className="bg-white/70">BAH 2026</Badge>
    </div>
    <p className="mt-3 text-[11px] font-bold uppercase opacity-70">{title}</p>
    <p className="text-2xl font-black tracking-tight">{value}</p>
    <p className="text-xs opacity-75">{note}</p>
  </Card>;
}

export default function Dashboard() {
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [mathUrl, setMathUrl] = useState<string | null>(null);
  const [aiUrl, setAiUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "math" | "ai">("");
  const [stage, setStage] = useState<"upload" | "math" | "gemini" | "done">("upload");
  const fileRef = useRef<HTMLInputElement>(null);

  const temp = useMemo(genTemp, []);
  const alt = useMemo(genAlt, []);
  const seis = useMemo(genSeismic, []);
  const maxTemp = Math.max(...temp.map((d) => d.c));
  const minAlt = Math.min(...alt.map((d) => d.alt));
  const maxMag = Math.max(...seis.map((d) => d.mag));
  const displayUrl = aiUrl || mathUrl;

  const resetForNewFile = (url: string) => {
    setInputUrl(url);
    setMathUrl(null);
    setAiUrl(null);
    setStage("math");
  };

  const runMath = async () => {
    if (!inputUrl) return toast.error("Upload 200m TIR image first");
    setBusy("math");
    try {
      const url = await mathColorizeTIR(inputUrl);
      setMathUrl(url);
      setAiUrl(null);
      setStage("gemini");
      toast.success("Step 2 complete: 100m super-resolved + colorized output ready");
    } catch (e: any) { toast.error(e.message || "Math model failed"); }
    finally { setBusy(""); }
  };

  const runAI = async () => {
    if (!mathUrl) return toast.error("Run Math Model first");
    setBusy("ai");
    try {
      const url = await geminiEnhance(mathUrl);
      setAiUrl(url);
      setStage("done");
      toast.success("Gemini refinement complete");
    } catch (e: any) { toast.error(e.message || "Gemini failed"); }
    finally { setBusy(""); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Toaster theme="light" position="top-right" richColors />
      <header className="sticky top-0 z-40 backdrop-blur border-b border-slate-200 bg-white/90 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-sm"><Satellite size={20}/></div>
          <div>
            <h1 className="text-base font-black tracking-tight">Nicolas TIR Intelligence</h1>
            <p className="text-[11px] text-slate-500 -mt-0.5">ISRO BAH 2026 • PS10 Infrared Image Colorization & Enhancement</p>
          </div>
        </div>
        <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 hidden sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Prototype Live
        </Badge>
      </header>

      <main className="max-w-7xl mx-auto p-5 md:p-6 space-y-7">
        <section className="text-center space-y-4 pt-4">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">Bharatiya Antariksh Hackathon 2026</Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Thermal Infrared {'->'} Photorealistic RGB</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Single-channel Landsat-9 TIR/B10 @ 200m ko 100m super-resolved TIR + realistic colorized RGB me convert karne ka ISRO-aligned prototype.
          </p>
        </section>

        <div className="grid md:grid-cols-4 gap-4">
          <MetricCard tone="blue" icon={<Satellite size={22}/>} title="Challenge Input" value="B10 TIR" note="200m low-resolution thermal band" />
          <MetricCard tone="emerald" icon={<Calculator size={22}/>} title="Math Stage" value="2× SR" note="P2-P98 stretch + LUT" />
          <MetricCard tone="violet" icon={<Sparkles size={22}/>} title="AI Stage" value="Optional" note="Gemini visual refinement" />
          <MetricCard tone="orange" icon={<Layers3 size={22}/>} title="Target Result" value="100m RGB" note="Blue-Green-Red order" />
        </div>

        <Tabs defaultValue="colorize" className="space-y-5">
          <TabsList className="flex-wrap h-auto bg-white border border-slate-200 p-1 shadow-sm">
            <TabsTrigger value="colorize"><Sparkles size={14} className="mr-1"/>Colorize</TabsTrigger>
            <TabsTrigger value="validation"><Beaker size={14} className="mr-1"/>ISRO Validation</TabsTrigger>
            <TabsTrigger value="pollution"><Factory size={14} className="mr-1"/>Pollution</TabsTrigger>
            <TabsTrigger value="map"><MapPin size={14} className="mr-1"/>Geo Map</TabsTrigger>
            <TabsTrigger value="temperature"><Thermometer size={14} className="mr-1"/>Temperature</TabsTrigger>
            <TabsTrigger value="altitude"><Layers3 size={14} className="mr-1"/>Altitude</TabsTrigger>
            <TabsTrigger value="seismic"><Activity size={14} className="mr-1"/>Seismic</TabsTrigger>
            <TabsTrigger value="volcano"><Mountain size={14} className="mr-1"/>Volcano</TabsTrigger>
            <TabsTrigger value="pybrowser"><Code2 size={14} className="mr-1"/>Python</TabsTrigger>
            <TabsTrigger value="source"><Settings size={14} className="mr-1"/>Source</TabsTrigger>
          </TabsList>

          <TabsContent value="colorize" className="grid lg:grid-cols-2 gap-6">
            <Card className="p-5 md:p-6 space-y-4 shadow-sm border-slate-200 bg-white">
              <div className="flex items-center justify-between"><h3 className="font-black">Step 1 — Input TIR @ 200m</h3><Badge variant="outline">Grayscale B10</Badge></div>
              <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                {inputUrl ? <img src={inputUrl} className="w-full h-full object-cover" /> : <div className="text-center text-slate-400"><Upload size={48} className="mx-auto mb-2 text-orange-400"/><p className="text-xs">Upload TIR PNG/JPG preview</p></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { const r = new FileReader(); r.onload = () => resetForNewFile(r.result as string); r.readAsDataURL(f); }
              }} />
              <Button onClick={() => fileRef.current?.click()} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black h-12 uppercase shadow hover:brightness-110">{inputUrl ? "Re-upload TIR Image" : "Upload TIR Image"}</Button>
            </Card>

            <Card className="p-5 md:p-6 space-y-4 shadow-sm border-slate-200 bg-white">
              <div className="flex items-center justify-between"><h3 className="font-black">Step 2/3 — Output @ 100m</h3><Badge variant="outline" className={aiUrl ? "border-violet-300 text-violet-700 bg-violet-50" : mathUrl ? "border-blue-300 text-blue-700 bg-blue-50" : ""}>{aiUrl ? "Gemini refined" : mathUrl ? "Math model" : "Awaiting input"}</Badge></div>
              <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                {busy ? <div className="text-center"><div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/><p className="text-xs font-bold text-slate-500">{busy === "math" ? "RUNNING SUPER-RESOLUTION..." : "GEMINI ENHANCING..."}</p></div> : displayUrl ? <img src={displayUrl} className="w-full h-full object-cover" /> : <p className="text-slate-400 text-sm">Result will appear here</p>}
              </div>
              <Button onClick={runMath} disabled={!inputUrl || !!busy} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black h-12 uppercase shadow hover:brightness-110"><Calculator size={16} className="mr-2"/>Step 2 - Math Model</Button>
              <Button onClick={runAI} disabled={!mathUrl || !!busy} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black h-12 uppercase shadow hover:brightness-110"><Sparkles size={16} className="mr-2"/>Step 3 - Gemini AI Enhance</Button>
            </Card>
          </TabsContent>

          <TabsContent value="validation"><ValidationPanel /></TabsContent>
          <TabsContent value="pollution"><PollutionPanel imageUrl={displayUrl}/></TabsContent>
          <TabsContent value="map"><MapPanel /></TabsContent>
          <TabsContent value="temperature"><Card className="p-6 bg-white"><div className="flex justify-between items-center mb-4"><h3 className="font-black flex gap-2"><Thermometer className="text-red-500"/>Surface Temp Proxy</h3><Badge className={maxTemp > 38 ? "bg-red-100 text-red-700" : "bg-emerald-100"}>Peak {maxTemp}°C</Badge></div><ResponsiveContainer width="100%" height={320}><AreaChart data={temp}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="t" fontSize={11}/><YAxis unit="°C" fontSize={11}/><Tooltip/><Area type="monotone" dataKey="c" stroke="#f97316" fill="#fed7aa"/><Area type="monotone" dataKey="tir" stroke="#0284c7" fill="#bae6fd"/></AreaChart></ResponsiveContainer></Card></TabsContent>
          <TabsContent value="altitude"><Card className="p-6 bg-white"><div className="flex justify-between items-center mb-4"><h3 className="font-black flex gap-2"><Layers3 className="text-cyan-600"/>Elevation Profile</h3><Badge>Min {minAlt} m</Badge></div><ResponsiveContainer width="100%" height={320}><LineChart data={alt}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="x" fontSize={11}/><YAxis unit="m" fontSize={11}/><Tooltip/><Line type="monotone" dataKey="alt" stroke="#0891b2" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></Card></TabsContent>
          <TabsContent value="seismic"><Card className="p-6 bg-white"><div className="flex justify-between items-center mb-4"><h3 className="font-black flex gap-2"><Activity className="text-amber-500"/>Seismic Proxy</h3><Badge className={maxMag > 2.5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100"}>Peak M{maxMag}</Badge></div><ResponsiveContainer width="100%" height={320}><AreaChart data={seis}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="t" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Area type="monotone" dataKey="mag" stroke="#f59e0b" fill="#fef3c7"/></AreaChart></ResponsiveContainer></Card></TabsContent>
          <TabsContent value="volcano"><Card className="p-6 bg-white space-y-4"><h3 className="font-black flex gap-2"><Mountain className="text-orange-600"/>Volcano Interpretation</h3><div className="grid md:grid-cols-3 gap-4"><div className="p-4 rounded border bg-slate-50"><p className="text-[10px] font-bold uppercase text-slate-500">Threshold</p><p className="text-xl font-black">40°C+</p></div><div className="p-4 rounded border bg-slate-50"><p className="text-[10px] font-bold uppercase text-slate-500">Band</p><p className="text-xl font-black">B10 TIR</p></div><div className="p-4 rounded border bg-emerald-50 text-emerald-700"><p className="text-[10px] font-bold uppercase opacity-70">Status</p><p className="text-xl font-black">{maxTemp > 38 ? "Watch" : "Nominal"}</p></div></div></Card></TabsContent>
          <TabsContent value="pybrowser"><BrowserPython inputUrl={inputUrl}/></TabsContent>
          <TabsContent value="source"><SourcePanel /></TabsContent>
        </Tabs>
      </main>
      <footer className="pt-10 pb-6 text-center text-[11px] text-slate-400 border-t border-slate-100"><p>Built by <span className="text-slate-600 font-bold">Team Nicolas</span> • ISRO BAH 2026 PS10</p></footer>
    </div>
  );
}
