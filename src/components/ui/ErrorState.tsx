import React from 'react';
import { Wifi, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  title?: string;
  icon?: React.ReactNode;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  icon
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="bg-red-50 rounded-full p-3 mb-4">
      {icon || <Wifi className="w-8 h-8 text-red-400" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-2">{title}</h3>
    <p className="text-gray-600 text-center max-w-md mb-6">
      {error}
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </button>
  </div>
);

export default ErrorState;