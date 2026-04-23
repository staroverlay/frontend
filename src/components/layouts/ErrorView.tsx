import React from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  onRetry,
  title = "Something went wrong"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-status-error/5 border border-status-error/10 rounded-2xl backdrop-blur-sm">
      <div className="w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-status-error" />
      </div>

      <h3 className="text-xl font-bold text-content-primary mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-status-error/80 mb-6 max-w-sm text-sm font-medium leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 bg-status-error hover:bg-status-error/90 text-white rounded-xl transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-status-error/20 active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
