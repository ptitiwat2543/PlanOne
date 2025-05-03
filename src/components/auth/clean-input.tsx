'use client';

import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface CleanInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  showPasswordToggle?: boolean;
}

export const CleanInput = forwardRef<HTMLInputElement, CleanInputProps>(
  ({ label, icon, error, showPasswordToggle = false, className, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </div>
          
          <input
            ref={ref}
            type={inputType}
            className={`w-full rounded-lg border border-gray-200 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10 ${
              showPasswordToggle ? 'pr-10' : ''
            } ${className || ''}`}
            {...props}
          />
          
          {showPasswordToggle && (
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

CleanInput.displayName = 'CleanInput';