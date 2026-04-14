import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className = '', ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={`space-y-2 ${className}`} {...props} />
));
RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className = '', ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={`aspect-square h-4 w-4 rounded-full border border-gray-400 dark:border-gray-500 text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 ${className}`}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-1.5 w-1.5 rounded-full bg-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
