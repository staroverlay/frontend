import { cn } from '../utils/styleUtils';

export interface HeadingProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  className?: string;
}

export default function Heading({
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <h1
      {...props}
      className={cn(
        'text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </h1>
  );
}
