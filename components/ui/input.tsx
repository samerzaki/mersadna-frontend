import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[11px] border border-line bg-bg px-3.5 py-1 text-[14px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dim focus-visible:outline-none focus-visible:border-gold disabled:cursor-not-allowed disabled:opacity-50",
          type === 'number' && 'num',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
