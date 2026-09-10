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
          'bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-[#1a1a2e] shadow-[0_4px_15px_rgba(0,212,170,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,212,170,0.5)]',
        outline:
          'border-2 border-[#1a1a2e] bg-transparent text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white',
        ghost:
          'bg-[#1a1a2e]/5 text-[#1a1a2e] hover:bg-[#1a1a2e]/10',
        link:
          'text-[#1a1a2e] underline-offset-4 hover:underline',
        light:
          'border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#1a1a2e]',
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
