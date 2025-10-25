import React from 'react';

/**
 * Animated Background Component
 * Creates floating neural network-style animation
 */
const AnimatedBackground = ({ scrollY = 0, density = 12, opacity = 0.4 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(density)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          index={i} 
          scrollY={scrollY} 
          opacity={opacity}
        />
      ))}
    </div>
  );
};

/**
 * Individual floating particle component
 */
const FloatingParticle = ({ index, scrollY, opacity }) => {
  const baseLeft = 10 + index * 8;
  const baseTop = 15 + (index % 4) * 20;
  const animationDelay = index * 0.3;
  const scrollMultiplier = 0.1 + index * 0.02;
  
  return (
    <div
      className="absolute animate-pulse"
      style={{
        left: `${baseLeft}%`,
        top: `${baseTop}%`,
        animationDelay: `${animationDelay}s`,
        transform: `translateY(${scrollY * scrollMultiplier}px)`
      }}
    >
      {/* Main particle */}
      <div 
        className="w-1 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full" 
        style={{ opacity }}
      />
      
      {/* Ripple effect for every third particle */}
      {index % 3 === 0 && (
        <div className="absolute inset-0 w-8 h-8 border border-purple-200/30 rounded-full animate-ping" />
      )}
    </div>
  );
};

export default AnimatedBackground;