
import * as React from "react"
import { cn } from "./button"

const TabsContext = React.createContext<{value: string, setValue: (v: string) => void}>({value: "", setValue: () => {}})

export const Tabs = ({ children, defaultValue, className }: any) => {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className }: any) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
    {children}
  </div>
)

export const TabsTrigger = ({ children, value, className }: any) => {
  const { value: activeValue, setValue } = React.useContext(TabsContext)
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        activeValue === value ? "bg-white text-slate-950 shadow-sm" : "hover:text-slate-700 hover:bg-slate-50/50",
        className
      )}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ children, value, className }: any) => {
  const { value: activeValue } = React.useContext(TabsContext)
  if (activeValue !== value) return null
  return <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2", className)}>{children}</div>
}
