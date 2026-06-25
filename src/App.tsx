
import { useEffect, useMemo, useRef, useState } from "react";
import { mathColorizeTIR } from "@/lib/mathColorize";
import { geminiEnhance } from "@/lib/geminiBrowser";
import { sendTelegram } from "@/lib/telegram";
import { BrowserPython } from "@/components/BrowserPython";
import { PollutionPanel } from "@/components/PollutionPanel";
import { MapPanel } from "@/components/MapPanel";
import { SourcePanel } from "@/components/SourcePanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { Satellite, Upload, Download, Flame, Snowflake, Activity, LogOut, Sparkles, Calculator, ShieldCheck, Mountain, Thermometer, Layers3, CheckCircle2, ArrowRight, Info, Factory, MapPin, Code2, Settings } from "lucide-react";

// Mock telemetry generators
const genTemp = () => Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  temp: +(18 + 8 * Math.sin(i / 3) + Math.random() * 3).toFixed(1),
  surface: +(22 + 12 * Math.sin(i / 3.2) + Math.random() * 4).toFixed(1),
}));
const genAlt = () => Array.from({ length: 30 }, (_, i) => ({
  x: i,
  alt: +(420 + 60 * Math.sin(i / 2) + Math.random() * 15).toFixed(0),
}));
const genSeismic = () => Array.from({ length: 20 }, (_, i) => ({
  t: i,
  mag: +(0.5 + Math.random() * 2.4 + (i === 12 ? 2.8 : 0)).toFixed(2),
}));

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

  const maxTemp = Math.max(...temp.map((d) => d.surface));
  const minAlt = Math.min(...alt.map((d) => d.alt));
  const maxMag = Math.max(...seis.map((d) => d.mag));
  const volcanoHot = maxTemp > 40;

  const runMath = async () => {
    if (!inputUrl) return;
    setBusy("math");
    try {
      const url = await mathColorizeTIR(inputUrl);
      setMathUrl(url); setStage("gemini");
      toast.success("Math output ready");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(""); }
  };

  const runAI = async () => {
    if (!mathUrl) return;
    setBusy("ai");
    try {
      const url = await geminiEnhance(mathUrl);
      setAiUrl(url); setStage("done");
      toast.success("AI enhancement complete");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(""); }
  };

  const displayUrl = aiUrl || mathUrl;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Toaster theme="light" position="top-right" richColors />
      <header className="sticky top-0 z-40 backdrop-blur border-b border-slate-200 bg-white/85 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Satellite size={20}/></div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Nicolas</h1>
            <p className="text-[11px] text-slate-500 -mt-0.5">TIR Intelligence · PS10</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 hidden sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Live
          </Badge>
          <Button variant="ghost" size="sm"><LogOut size={16} className="mr-2"/>Sign out</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <section className="text-center space-y-4">
          <Badge className="bg-blue-50 text-blue-700">Bharatiya Antariksh Hackathon 2026</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Thermal Infrared {"->"} Photorealistic RGB</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Physics-informed math + Gemini AI colorization.</p>
        </section>

        <Card className="p-4 bg-slate-50 border-slate-200">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-bold ${stage === "upload" ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"}`}>1</div>
                <span className={`text-sm ${stage === "upload" ? "font-bold text-orange-500" : "text-slate-500"}`}>Upload TIR</span>
              </div>
              <ArrowRight size={16} className="text-slate-300"/>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-bold ${stage === "math" ? "bg-blue-500 text-white" : (!!mathUrl ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}`}>2</div>
                <span className={`text-sm ${stage === "math" ? "font-bold text-blue-500" : "text-slate-500"}`}>Math Model</span>
              </div>
              <ArrowRight size={16} className="text-slate-300"/>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-bold ${stage === "gemini" ? "bg-violet-500 text-white" : (!!aiUrl ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}`}>3</div>
                <span className={`text-sm ${stage === "gemini" ? "font-bold text-violet-500" : "text-slate-500"}`}>Gemini AI</span>
              </div>
           </div>
        </Card>

        <Tabs defaultValue="colorize" className="space-y-6">
          <TabsList className="flex-wrap h-auto bg-white border border-slate-200 p-1">
            <TabsTrigger value="colorize">Colorize</TabsTrigger>
            <TabsTrigger value="pollution">Pollution</TabsTrigger>
            <TabsTrigger value="map">Geo Map</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="altitude">Altitude</TabsTrigger>
            <TabsTrigger value="seismic">Seismic</TabsTrigger>
            <TabsTrigger value="volcano">Volcano</TabsTrigger>
            <TabsTrigger value="pybrowser">Python</TabsTrigger>
            <TabsTrigger value="source">Source Code</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="colorize" className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Step 1 — Input TIR @ 200 m</h3>
                <Badge variant="outline" className="text-slate-500">Grayscale</Badge>
              </div>
              <div className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                {inputUrl ? <img src={inputUrl} className="w-full h-full object-cover" /> : (
                  <div className="text-center text-slate-400">
                    <Upload size={48} className="mx-auto mb-2 text-orange-400" />
                    <p className="text-xs">Upload a TIR PNG/JPG</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader(); r.onload = () => { setInputUrl(r.result as string); setStage("math"); }; r.readAsDataURL(f);
                }
              }} />
              <Button onClick={() => fileRef.current?.click()} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold h-14 uppercase shadow-lg hover:brightness-110">Upload TIR Image</Button>
            </Card>

            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Output @ 100 m</h3>
                <Badge variant="outline" className={aiUrl ? "border-violet-300 text-violet-700 bg-violet-50" : "border-blue-300 text-blue-700 bg-blue-50"}>
                  {aiUrl ? "Gemini AI" : mathUrl ? "Math model" : "Awaiting input"}
                </Badge>
              </div>
              <div className="aspect-square bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                {busy ? (
                  <div className="text-center">
                    <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-500">{busy === "math" ? "RUNNING MATH..." : "AI ENHANCING..."}</p>
                  </div>
                ) : displayUrl ? <img src={displayUrl} className="w-full h-full object-cover" /> : <p className="text-slate-400 text-sm">Result will appear here</p>}
              </div>
              <Button onClick={runMath} disabled={!inputUrl || !!busy} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold h-14 uppercase shadow-lg hover:brightness-110">Step 2 · Math Model</Button>
              <Button onClick={runAI} disabled={!mathUrl || !!busy} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold h-14 uppercase shadow-lg hover:brightness-110">Step 3 · Gemini AI Enhance</Button>
            </Card>
          </TabsContent>

          <TabsContent value="pollution"><PollutionPanel imageUrl={displayUrl}/></TabsContent>
          <TabsContent value="map"><MapPanel /></TabsContent>
          
          <TabsContent value="temperature">
            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Thermometer className="text-red-500" size={20}/> Surface Temperature · 24 h</h3>
                <Badge className={maxTemp > 38 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}>Peak {maxTemp}°C</Badge>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={temp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="t" fontSize={11} />
                  <YAxis unit="°C" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="surface" stroke="#f97316" fill="#fed7aa" />
                  <Area type="monotone" dataKey="temp" stroke="#0284c7" fill="#bae6fd" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="altitude">
            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Layers3 className="text-cyan-600" size={20}/> Elevation Profile</h3>
                <Badge className={minAlt < 380 ? "bg-cyan-100 text-cyan-700" : "bg-slate-100"}>Min {minAlt} m</Badge>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={alt}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="x" fontSize={11} />
                  <YAxis unit="m" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="alt" stroke="#0891b2" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="seismic">
            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><Activity className="text-amber-500" size={20}/> Seismic Activity</h3>
                <Badge className={maxMag > 2.5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100"}>Peak M{maxMag}</Badge>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={seis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="t" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mag" stroke="#f59e0b" fill="#fef3c7" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="volcano">
            <Card className="p-6 space-y-4 shadow-sm border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700"><Mountain size={24}/></div>
                <div>
                  <h3 className="font-bold">Volcano Hotspot Detection</h3>
                  <p className="text-xs text-slate-500">Thermal anomaly screening</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Surface Temp</p>
                  <p className="text-xl font-bold">{maxTemp}°C</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Threshold</p>
                  <p className="text-xl font-bold">40°C</p>
                </div>
                <div className={`p-4 rounded-lg border ${volcanoHot ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50"}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                  <p className={`text-xl font-bold ${volcanoHot ? "text-orange-700" : "text-emerald-700"}`}>{volcanoHot ? "ALERT" : "NOMINAL"}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pybrowser"><BrowserPython inputUrl={inputUrl}/></TabsContent>
          <TabsContent value="source"><SourcePanel /></TabsContent>
          <TabsContent value="settings"><SettingsPanel /></TabsContent>
        </Tabs>
      </main>
      <footer className="pt-10 pb-6 text-center text-[10px] text-slate-400 border-t border-slate-100">
        <p>Built by <span className="text-slate-600 font-bold">Team Nicolas</span> · PS10 — Infrared Image Colorization & Enhancement</p>
      </footer>
    </div>
  );
}
