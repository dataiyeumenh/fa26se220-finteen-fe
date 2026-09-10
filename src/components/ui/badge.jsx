import * as React from 'react'
import { cn } from '@/lib/utils'

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-100 text-[#1a1a2e]',
    accent: 'bg-gradient-to-r from-[#00d4aa]/20 to-[#00b894]/20 text-[#00b894]',
    coral: 'bg-gradient-to-r from-[#ff6b6b]/20 to-[#ee5a24]/20 text-[#ff6b6b]',
    purple: 'bg-gradient-to-r from-[#a855f7]/20 to-[#7c3aed]/20 text-[#a855f7]',
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
