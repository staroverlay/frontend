import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.97] shadow-lg shadow-brand-primary/25 border border-white/10',
      secondary: 'bg-surface-elevated/50 backdrop-blur-md text-content-primary hover:bg-surface-elevated hover:border-white/20 border border-white/10 shadow-sm active:scale-[0.97]',
      ghost: 'bg-transparent hover:bg-white/5 text-content-dimmed hover:text-content-primary transition-all active:scale-[0.97]',
      danger: 'bg-status-error/10 text-status-error hover:bg-status-error hover:text-white border border-status-error/20 active:scale-[0.97] shadow-sm',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-[11px] uppercase tracking-wider',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
