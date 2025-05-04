import React from 'react';
import { cn } from '@/lib/utils';

type CleanButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const CleanButton = React.forwardRef<HTMLButtonElement, CleanButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-transparent hover:underline hover:text-primary',
      secondary: 'text-secondary-foreground hover:underline',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    return (
      <button className={cn(baseStyles, variants[variant], className)} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

CleanButton.displayName = 'CleanButton';
