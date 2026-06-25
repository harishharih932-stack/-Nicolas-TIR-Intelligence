
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";

export function BrowserPython({ inputUrl }: { inputUrl: string | null }) {
  const [log, setLog] = useState("");
  const run = () => setLog("Running Python...");
  return (
    <div className="space-y-4">
      <Button onClick={run} className="bg-emerald-500"><Play className="mr-2 h-4 w-4" /> Run Python</Button>
      <div className="p-4 bg-slate-950 text-emerald-500 font-mono text-xs rounded">
        {">"} python process.py<br/>
        {log}
      </div>
    </div>
  );
}
