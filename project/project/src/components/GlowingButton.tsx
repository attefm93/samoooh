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
  animated = true
}) => {
  const baseClasses = "relative font-bold text-white rounded-xl transition-all duration-500 transform hover:scale-105 active:scale-95 overflow-hidden group";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 shadow-2xl hover:shadow-purple-500/60",
    secondary: "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-700 hover:via-teal-600 hover:to-cyan-700 shadow-2xl hover:shadow-emerald-500/60",
    danger: "bg-gradient-to-r from-red-600 via-pink-500 to-rose-600 hover:from-red-700 hover:via-pink-600 hover:to-rose-700 shadow-2xl hover:shadow-red-500/60"
  };

  const glowColors = {
    primary: '#8b5cf6',
    secondary: '#10b981',
    danger: '#ef4444'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${animated ? 'animate-pulse hover:animate-none' : ''}`}
      style={{
        boxShadow: `0 0 30px ${glowColors[variant]}60, 0 0 60px ${glowColors[variant]}30`,
      }}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
      
      {/* Glow border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{
             background: `linear-gradient(45deg, ${glowColors[variant]}40, transparent, ${glowColors[variant]}40)`,
             padding: '2px'
           }}>
        <div className="w-full h-full rounded-xl bg-transparent"></div>
      </div>
    </button>
  );
};