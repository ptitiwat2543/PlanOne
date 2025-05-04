import * as React from 'react';
import { cn } from '@/lib/utils';
import * as ReactDOM from 'react-dom/client';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2" />
    </>
  );
};

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, title, description, variant = 'default', duration = 5000, onClose, ...props },
    ref
  ) => {
    React.useEffect(() => {
      if (duration) {
        const timer = setTimeout(() => {
          onClose?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const variantClassMap = {
      default:
        'border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50',
      success:
        'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
      error:
        'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
      warning:
        'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
      info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto relative w-full max-w-sm rounded-lg border p-4 shadow-md animate-in fade-in zoom-in duration-200',
          variantClassMap[variant],
          className
        )}
        {...props}
      >
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        {description && <div className="text-sm opacity-90">{description}</div>}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = 'Toast';

// Hook for creating and managing toasts
export const useToast = () => {
  const createToast = React.useCallback((props: Omit<ToastProps, 'ref'>) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastElement = document.createElement('div');
    container.appendChild(toastElement);

    const removeToast = () => {
      toastElement.classList.add('animate-out', 'fade-out', 'zoom-out');
      setTimeout(() => {
        container.removeChild(toastElement);
      }, 200); // Animation duration
    };

    const { onClose: originalOnClose, ...restProps } = props;
    const onClose = () => {
      originalOnClose?.();
      removeToast();
    };

    // Create a new React root and render the Toast component
    const root = ReactDOM.createRoot(toastElement);
    root.render(<Toast {...restProps} onClose={onClose} />);

    return removeToast;
  }, []);

  return { toast: createToast };
};
