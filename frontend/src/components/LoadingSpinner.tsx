import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', fullScreen = true }) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`} />
  );

  if (!fullScreen) {
    return spinner;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {spinner}
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
