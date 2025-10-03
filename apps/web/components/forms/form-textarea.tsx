'use client';

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextareaProps {
  label: string;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, placeholder, required, disabled, rows = 4, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm resize-vertical
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
