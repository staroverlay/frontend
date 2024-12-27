interface ProgressBarProps {
  percentage: number;
  backgroundColor?: string;
  className?: string;
  barClassName?: string;
}

const ProgressBar = ({
  percentage,
  backgroundColor = '',
  className = '',
  barClassName = '',
}: ProgressBarProps) => {
  return (
    <div className={`w-full bg-white/5 rounded-full h-2 mb-2 ${className}`}>
      <div
        className={`rounded-full h-2 transition-all ${barClassName}`}
        style={{
          width: `${percentage}%`,
          backgroundColor,
        }}
      />
    </div>
  );
};

export default ProgressBar;
