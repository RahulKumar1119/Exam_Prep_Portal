import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  color?: 'blue' | 'green' | 'red' | 'amber';
}

const colorMap = {
  blue:  'bg-blue-600',
  green: 'bg-green-500',
  red:   'bg-red-500',
  amber: 'bg-amber-500',
};

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className = '', value = 0, color = 'blue', ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full transition-all duration-300 ${colorMap[color]}`}
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = 'Progress';
