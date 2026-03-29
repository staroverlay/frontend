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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-red-400/80 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
