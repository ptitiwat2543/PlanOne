import React, { forwardRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, rightIcon: RightIcon, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Icon size={18} />
            </div>
          )}
          
          <input
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              "w-full rounded-md border border-gray-300 dark:border-gray-700",
              "py-2 text-gray-800 dark:text-gray-200",
              "bg-white dark:bg-gray-900",
              "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              Icon ? "pl-10" : "pl-3",
              (RightIcon || isPassword) ? "pr-10" : "pr-3",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          )}
          
          {RightIcon && !isPassword && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <RightIcon size={18} />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export { AnimatedInput } from './animated-input';
export default Input;