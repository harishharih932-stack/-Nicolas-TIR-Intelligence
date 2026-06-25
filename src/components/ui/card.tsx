
import * as React from "react"
import { cn } from "./button"

export const Card = ({ className, ...props }: any) => (
  <div className={cn("rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props} />
)
