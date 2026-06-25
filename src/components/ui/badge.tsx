
import * as React from "react"
import { cn } from "./button"

export const Badge = ({ className, variant, ...props }: any) => (
  <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", className)} {...props} />
)
