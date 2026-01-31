
import React from 'react';
import { ColorDefinition, Language } from '../types';
import { getPatternDataUri } from '../constants'; // Import pattern helper

interface ColorButtonProps {
  colorDef: ColorDefinition;
  onClick: (colorDef: ColorDefinition) => void;
  isSelected?: boolean;
  disabled?: boolean;
  language: Language;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isColorblindModeOn?: boolean; // New prop
}

const ColorButton: React.FC<ColorButtonProps> = ({
  colorDef,
  onClick,
  isSelected = false,
  disabled = false,
  language,
  showName = false,
  size = 'md',
  isColorblindModeOn = false, // Default to off
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 sm:w-28 sm:h-28 text-sm',
    lg: 'w-32 h-32 sm:w-36 sm:h-36 text-base',
  };
  
  const dynamicGlowStyle = isSelected ? { boxShadow: `0 0 15px 5px ${colorDef.hex}AA` } : {};

  const patternDataUri = isColorblindModeOn ? getPatternDataUri(colorDef) : null;

  return (
    <button
      type="button"
      onClick={() => onClick(colorDef)}
      disabled={disabled}
      className={`
        relative ${sizeClasses[size]} /* Added relative for pattern overlay */
        ${colorDef.tailwindClass} 
        ${colorDef.textColorClass || 'text-white'}
        rounded-full 
        flex flex-col items-center justify-center
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${isSelected ? 'ring-4 ring-offset-2 ring-blue-400' : 'hover:ring-2 hover:ring-gray-300'}
        font-semibold shadow-lg hover:shadow-xl
      `}
      aria-label={`${colorDef.name[language]} color`}
      style={dynamicGlowStyle}
    >
      {patternDataUri && (
        <div
          className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
          style={{
            backgroundImage: patternDataUri,
            backgroundRepeat: 'repeat',
          }}
        ></div>
      )}
      {showName && <span className="relative z-10 mt-1 p-1 bg-black bg-opacity-20 rounded">{colorDef.name[language]}</span> /* Ensure name is above pattern */}
    </button>
  );
};

export default ColorButton;
