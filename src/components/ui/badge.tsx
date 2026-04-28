import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-yummi-accent text-white',
  secondary: 'bg-bg-light-gray text-text-dark',
  outline: 'border border-yummi-accent text-yummi-accent',
  success: 'bg-green-600 text-white',
  warning: 'bg-orange-500 text-white'
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variantStyles[variant], className)}
    {...props}
  />
))
Badge.displayName = 'Badge'

export { Badge }
