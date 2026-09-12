import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#22c55e] text-white shadow-[0_4px_15px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 hover:bg-[#16a34a] hover:shadow-[0_8px_25px_rgba(34,197,94,0.45)]',
        outline:
          'border-2 border-[#22c55e] bg-transparent text-[#16a34a] hover:bg-[#22c55e] hover:text-white',
        ghost:
          'bg-[#22c55e]/10 text-[#16a34a] hover:bg-[#22c55e]/20',
        link:
          'text-[#16a34a] underline-offset-4 hover:underline',
        light:
          'border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#16a34a]',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
