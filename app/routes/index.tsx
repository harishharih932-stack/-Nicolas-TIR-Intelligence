
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Upload, Flame, Waves, Wind, Mountain } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

const MOCK_DATA = [
  { name: '10:00', temp: 28, aqi: 120 },
  { name: '10:05', temp: 30, aqi: 125 },
  { name: '10:10', temp: 35, aqi: 130 },
  { name: '10:15', temp: 42, aqi: 160 },
  { name: '10:20', temp: 40, aqi: 155 },
]

function Dashboard() {
  const [image, setImage] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="header-box">
        <h1 className="text-3xl font-bold">Earth Intelligence Dashboard</h1>
        <p className="opacity-90">Real-time TIR Colorization & Hazard Monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card min-h-[400px] flex flex-col items-center justify-center border-dashed border-2">
            {!image ? (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-brand-medium mb-4" />
                <span className="text-lg font-medium">Upload Landsat-9 TIR-1 Image</span>
                <span className="text-sm text-slate-500">200m single-band .tif or .jpg</span>
                <input type="file" className="hidden" onChange={(e) => setImage('mock-url')} />
              </label>
            ) : (
              <div className="w-full h-full relative">
                 <img src="https://via.placeholder.com/800x400?text=Colorized+TIR+Result" alt="Result" className="w-full h-full object-cover rounded-lg" />
                 <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full">X</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="stat-card">
                <div className="text-slate-500 text-xs uppercase font-bold">Avg Temperature</div>
                <div className="text-2xl font-bold text-orange-600">38.5°C</div>
             </div>
             <div className="stat-card">
                <div className="text-slate-500 text-xs uppercase font-bold">Pollution AQI</div>
                <div className="text-2xl font-bold text-purple-600">158</div>
             </div>
          </div>

          <div className="card h-[300px]">
            <h3 className="font-bold mb-4">Thermal & AQI Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#ea580c" />
                <Line type="monotone" dataKey="aqi" stroke="#9333ea" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Details */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Flame size={18} className="text-red-500" /> Active Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="font-bold text-red-700 text-sm">FIRE ALERT</div>
                <div className="text-xs text-red-600">Hotspot detected at 12.5°N, 76.2°E (&gt;38°C)</div>
              </div>
              <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                <div className="font-bold text-purple-700 text-sm">POLLUTION ALERT</div>
                <div className="text-xs text-purple-600">AQI ≥ 150 detected in urban sector</div>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="font-bold text-blue-700 text-sm">GLACIER MELT</div>
                <div className="text-xs text-blue-600">Low altitude ice detected (&lt;380m)</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Math Metadata</h3>
            <div className="text-xs font-mono space-y-2 text-slate-600">
              <p>T = K₂ / ln(K₁/Lλ + 1)</p>
              <p>Y = 0.299R + 0.587G + 0.114B</p>
              <p>Unsharp Mask α = 0.7</p>
              <p>Super-Res: 2x Bicubic</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
