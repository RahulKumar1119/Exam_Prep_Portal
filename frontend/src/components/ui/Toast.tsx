import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={`fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 ${className}`}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: 'default' | 'success' | 'error' | 'warning';
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  error:   'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700',
  warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
};

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className = '', variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${variantStyles[variant]} ${className}`}
    {...props}
  />
));
Toast.displayName = 'Toast';

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className = '', ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={`ml-auto rounded-sm opacity-70 hover:opacity-100 transition-opacity ${className}`}
    {...props}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </ToastPrimitive.Close>
));
ToastClose.displayName = 'ToastClose';

// ── useToast hook ──────────────────────────────────────────────────────────────
interface ToastState {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

const listeners: Array<(toasts: ToastState[]) => void> = [];
let toasts: ToastState[] = [];

function dispatch(toast: Omit<ToastState, 'id'>) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { ...toast, id }];
  listeners.forEach((l) => l(toasts));
  return id;
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  listeners.forEach((l) => l(toasts));
}

export function useToast() {
  const [state, setState] = React.useState<ToastState[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts: state,
    toast: dispatch,
    dismiss,
  };
}
