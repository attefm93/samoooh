import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'][i]} 0%, transparent 70%)`,
            animation: `pulse ${4 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
      
      {/* Moving light rays */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"
            style={{
              width: '200%',
              left: '-50%',
              top: `${20 + i * 30}%`,
              animation: `moveRight ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};