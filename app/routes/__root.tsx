
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { LayoutDashboard, Settings, Code } from 'lucide-react'
import './app.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl font-bold">🛰️ NOVA-TIR</span>
        </div>
        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-3 p-2 rounded hover:bg-brand-medium transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-2 rounded hover:bg-brand-medium transition-colors">
            <Settings size={20} /> Settings
          </Link>
          <Link to="/source" className="flex items-center gap-3 p-2 rounded hover:bg-brand-medium transition-colors">
            <Code size={20} /> Source Code
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
