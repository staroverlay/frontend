interface ContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string;
}

export default function Container({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={`glass rounded-xl ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
