import {
  ButtonSize,
  ButtonSizes,
  ButtonVariant,
  ButtonVariants,
} from '@/theme/buttonStyles';
import { cn } from '../utils/styleUtils';

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export default function Button({
  className,
  children,
  leftIcon,
  rightIcon,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const variantClasses = ButtonVariants[variant];
  const sizeClasses = ButtonSizes[size];

  return (
    <button
      {...props}
      className={cn(
        'flex items-center space-x-2 rounded-lg font-medium transition-colors',
        variantClasses,
        sizeClasses,
        className,
      )}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
