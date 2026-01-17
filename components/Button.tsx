
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg disabled:opacity-50 disabled:scale-100";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white border-b-4 border-blue-700",
    secondary: "bg-yellow-400 hover:bg-yellow-500 text-blue-900 border-b-4 border-yellow-600",
    accent: "bg-green-500 hover:bg-green-600 text-white border-b-4 border-green-700",
    danger: "bg-red-500 hover:bg-red-600 text-white border-b-4 border-red-700",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
