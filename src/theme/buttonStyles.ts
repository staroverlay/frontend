// Variants
export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'primary-link';

export const ButtonVariants: {
  [key in ButtonVariant]: string[];
} = {
  primary: [
    'bg-purple-500',
    'text-white',
    'hover:bg-purple-600',
    'hover:text-white',
  ],
  danger: [
    'bg-red-500/10',
    'text-red-400',
    'hover:bg-red-500/20',
    'hover:text-red-500',
  ],
  ghost: ['hover:bg-white/5'],
  'primary-link': ['text-purple-400', 'hover:text-purple-300'],
};

// Sizes
export type ButtonSize = 'sm' | 'md' | 'lg';

export const ButtonSizes: {
  [key in ButtonSize]: string[];
} = {
  sm: ['text-sm', 'py-1', 'px-2'],
  md: ['text-base', 'py-2', 'px-4'],
  lg: ['text-lg', 'py-3', 'px-6'],
};
