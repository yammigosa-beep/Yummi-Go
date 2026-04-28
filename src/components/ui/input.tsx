import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-text-dark placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yummi-accent/40',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
