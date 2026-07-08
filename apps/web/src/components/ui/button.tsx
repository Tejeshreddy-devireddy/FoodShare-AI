import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  style,
  children,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none";

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(16,185,129,0.28)',
    },
    secondary: {
      backgroundColor: 'rgba(15,23,42,0.06)',
      color: '#0f172a',
      border: '1px solid rgba(15,23,42,0.12)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#475569',
      border: '1px solid rgba(15,23,42,0.15)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
    },
    danger: {
      backgroundColor: 'rgba(239,68,68,0.08)',
      color: '#dc2626',
      border: '1px solid rgba(239,68,68,0.20)',
    },
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-3",
  };

  return (
    <button
      className={`${baseStyle} ${sizes[size]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
export default Button;
