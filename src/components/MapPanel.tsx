
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
export function MapPanel() {
  const [lat, setLat] = useState("28.6139");
  const [lon, setLon] = useState("77.2090");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon)-0.1},${parseFloat(lat)-0.1},${parseFloat(lon)+0.1},${parseFloat(lat)+0.1}&layer=mapnik&marker=${lat},${lon}`;
  return (
    <Card className="p-6 space-y-4">
      <div className="flex gap-2">
        <Input value={lat} onChange={(e:any)=>setLat(e.target.value)} placeholder="Lat" />
        <Input value={lon} onChange={(e:any)=>setLon(e.target.value)} placeholder="Lon" />
        <Button className="bg-emerald-600"><MapPin size={16}/></Button>
      </div>
      <iframe title="map" src={src} className="w-full h-[400px] border rounded" />
    </Card>
  );
}