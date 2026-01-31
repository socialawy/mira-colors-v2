
import React from 'react';

interface ParticleBurstProps {
  colorHex: string;
  isActive: boolean;
}

const PARTICLE_ANIMATIONS = [
  'animate-particleN',
  'animate-particleNE',
  'animate-particleE',
  'animate-particleSE',
  'animate-particleS',
  'animate-particleSW',
  'animate-particleW',
  'animate-particleNW',
];

// Create a quadrupled list of animations for many particles
const ALL_PARTICLES_ANIMATIONS = [...PARTICLE_ANIMATIONS, ...PARTICLE_ANIMATIONS, ...PARTICLE_ANIMATIONS, ...PARTICLE_ANIMATIONS];


const ParticleBurst: React.FC<ParticleBurstProps> = ({ colorHex, isActive }) => {
  if (!isActive) {
    return null;
  }

  return (
    <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none z-20"> {/* Ensure particles are above color wash */}
      {ALL_PARTICLES_ANIMATIONS.map((animationClass, index) => {
        // Add slight variations for a more natural burst
        const delay = Math.random() * 0.15; // 0 to 150ms delay
        const scale = 1 + Math.random() * 0.8; // scale between 1.0 and 1.8
        const particleSize = 8 + Math.random() * 8; // size between 8px and 16px
        
        return (
          <div
            key={index}
            className={`absolute rounded-full ${animationClass}`}
            style={{ 
              backgroundColor: colorHex,
              width: `${particleSize}px`,
              height: `${particleSize}px`,
              // Ensure particles originate from the center of the emitter div.
              top: `-${particleSize / 2}px`, 
              left: `-${particleSize / 2}px`,
              transform: `scale(${scale})`,
              animationDelay: `${delay}s`,
             }}
          />
        );
      })}
    </div>
  );
};

export default ParticleBurst;