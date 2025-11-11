import React, { type ReactNode, type ButtonHTMLAttributes, type ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps): ReactElement {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  const focus = 'focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClass =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : variant === 'secondary'
      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
      : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';

  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [base, focus, variantClass, sizeClass, disabledClass, className].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}