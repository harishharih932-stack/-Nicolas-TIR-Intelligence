
import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Button = React.forwardRef(({ className, variant, size, ...props }: any, ref: any) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        variant === "ghost" ? "hover:bg-slate-100" : "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        className
      )}
      {...props}
    />
  )
})
