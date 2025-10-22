/**
 * Button component
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark hover:opacity-90',
    secondary: 'bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark',
    outline: 'border border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-bg-secondary dark:hover:bg-bg-secondary-dark',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
