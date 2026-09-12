import * as React from 'react'
import { cn } from '@/lib/utils'

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-100 text-[#1a3a1a]',
    accent: 'bg-[#22c55e]/15 text-[#16a34a]',
    green: 'bg-[#22c55e]/15 text-[#16a34a]',
    lime: 'bg-[#84cc16]/15 text-[#65a30d]',
    dark: 'bg-[#16a34a]/15 text-[#16a34a]',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
  }
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
