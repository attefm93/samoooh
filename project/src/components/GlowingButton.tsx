import React from 'react';

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  size = 'md',
  animated = false
}) => {
  const baseClasses = "relative font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  } as const;
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 hover:from-blue-700 hover:via-sky-700 hover:to-indigo-800 shadow-xl hover:shadow-sky-500/50",
    secondary: "bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 hover:from-sky-700 hover:via-cyan-700 hover:to-blue-800 shadow-xl hover:shadow-cyan-500/50",
    danger: "bg-gradient-to-r from-red-600 via-rose-600 to-pink-700 hover:from-red-700 hover:via-rose-700 hover:to-pink-800 shadow-xl hover:shadow-rose-500/50"
  } as const;

  const glowColors = {
    primary: '#3b82f6',
    secondary: '#06b6d4',
    danger: '#ef4444'
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${animated ? 'animate-pulse' : ''}`}
      style={{ boxShadow: `0 0 22px ${glowColors[variant]}50, 0 0 42px ${glowColors[variant]}25` }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ background: `linear-gradient(45deg, ${glowColors[variant]}40, transparent, ${glowColors[variant]}40)`, padding: '2px' }}>
        <div className="w-full h-full rounded-xl bg-transparent"></div>
      </div>
    </button>
  );
};