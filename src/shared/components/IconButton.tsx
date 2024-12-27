import {
  ButtonSize,
  ButtonSizes,
  ButtonVariant,
  ButtonVariants,
} from '@/theme/buttonStyles';
import { cn } from '../utils/styleUtils';

export interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  hasNotification?: boolean;
}

export default function IconButton({
  className,
  children,
  variant = 'primary',
  size = 'md',
  hasNotification,
  ...props
}: IconButtonProps) {
  const variantClasses = ButtonVariants[variant];
  const sizeClasses = ButtonSizes[size];

  return (
    <button
      {...props}
      className={cn(
        'p-2 rounded-full relative',
        variantClasses,
        sizeClasses,
        className,
      )}
    >
      {children}
      {hasNotification && (
        <span className="absolute top-1 right-1 h-2 w-2 bg-purple-500 rounded-full"></span>
      )}
    </button>
  );
}
