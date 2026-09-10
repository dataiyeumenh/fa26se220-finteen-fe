import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#1a1a2e] placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-[#00d4aa] focus-visible:ring-2 focus-visible:ring-[#00d4aa]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
