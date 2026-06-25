
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Save } from 'lucide-react'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="header-box">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="opacity-90">API Configuration & Bot Tokens</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Gemini API Key</label>
          <input type="password" placeholder="AI Image Refinement Key" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Telegram Bot Token</label>
          <input type="password" placeholder="For push notifications" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Telegram Chat ID</label>
          <input type="text" placeholder="Your chat ID" className="w-full p-2 border rounded" />
        </div>
        <button className="bg-brand-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-medium">
          <Save size={18} /> Save Configuration
        </button>
      </div>

      <div className="card bg-blue-50 border-blue-200 text-blue-800 text-sm">
        <strong>Note:</strong> Keys are stored browser-side in LocalStorage and never sent to our servers.
      </div>
    </div>
  )
}
