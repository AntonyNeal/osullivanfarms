import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-blue-700',
    secondary: 'bg-brand-secondary text-white hover:bg-slate-700',
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
}
