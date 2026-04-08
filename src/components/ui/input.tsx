import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-black uppercase tracking-widest text-content-dimmed mb-1.5 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-border-subtle bg-surface-panel/50 px-4 py-2 text-sm text-content-primary ring-offset-surface-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-dimmed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-status-error/50 focus-visible:ring-status-error/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 ml-1 text-xs text-status-error font-bold">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
