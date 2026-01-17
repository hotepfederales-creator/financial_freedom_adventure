import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const JuicyButton: React.FC<Props> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const baseStyles = "btn-juicy rounded-xl font-bold border-b-4 border-black/20 flex items-center justify-center gap-2 transition-all uppercase tracking-wide";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800",
    danger: "bg-red-600 hover:bg-red-500 text-white border-red-800",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800",
    neutral: "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-900"
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-lg",
    lg: "py-4 px-8 text-2xl" 
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};