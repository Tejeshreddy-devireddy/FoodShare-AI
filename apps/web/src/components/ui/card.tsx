import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: 'rgba(255, 252, 249, 0.85)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 4px 20px rgba(15,23,42,0.06), 0 1px 4px rgba(0,0,0,0.03)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(props.style || {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-bold tracking-tight ${className}`} style={{ color: '#0f172a', ...(props.style || {}) }} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm ${className}`} style={{ color: '#64748b', ...(props.style || {}) }} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center pt-4 border-t mt-4 ${className}`} style={{ borderColor: 'rgba(15,23,42,0.08)', ...(props.style || {}) }} {...props}>
      {children}
    </div>
  );
}
