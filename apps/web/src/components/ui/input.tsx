import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none ${
            error ? 'ring-1 ring-red-400' : ''
          } ${className}`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.80)',
            border: error ? '1px solid rgba(239,68,68,0.50)' : '1px solid rgba(15,23,42,0.12)',
            color: '#0f172a',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.border = '1px solid rgba(16,185,129,0.50)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)';
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.border = '1px solid rgba(15,23,42,0.12)';
              e.currentTarget.style.boxShadow = 'none';
            }
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium mt-1" style={{ color: '#dc2626' }}>{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 min-h-[100px] resize-none focus:outline-none ${className}`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.80)',
            border: error ? '1px solid rgba(239,68,68,0.50)' : '1px solid rgba(15,23,42,0.12)',
            color: '#0f172a',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(16,185,129,0.50)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(15,23,42,0.12)';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium mt-1" style={{ color: '#dc2626' }}>{error}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none ${className}`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.80)',
            border: error ? '1px solid rgba(239,68,68,0.50)' : '1px solid rgba(15,23,42,0.12)',
            color: '#0f172a',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(16,185,129,0.50)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(15,23,42,0.12)';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: '#fff', color: '#0f172a' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs font-medium mt-1" style={{ color: '#dc2626' }}>{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
