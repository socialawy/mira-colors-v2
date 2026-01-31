
import React from 'react';
import { Language, TranslationKey, ColorDefinition } from '../types';
import { COLORS, getPatternDataUri } from '../constants'; // Added getPatternDataUri

interface AllColorsViewProps {
  language: Language;
  t: (key: TranslationKey) => string;
  handlePlaySoundTTS: (text: string, lang: Language) => void; 
  isTTSOn: boolean;
  isColorblindModeOn: boolean; // New prop
}

const AllColorsView: React.FC<AllColorsViewProps> = ({ language, t, handlePlaySoundTTS, isTTSOn, isColorblindModeOn }) => {
  const allColorDefinitions: ColorDefinition[] = Object.values(COLORS);

  const handleColorClick = (colorDef: ColorDefinition) => {
    if (isTTSOn) {
      handlePlaySoundTTS(colorDef.name[language], language);
    }
  };

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-4xl mx-auto ${language === Language.AR ? 'rtl' : 'ltr'}`}>
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
        {t('allColorsViewTitle')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {allColorDefinitions.map(colorDef => {
          const patternDataUri = isColorblindModeOn ? getPatternDataUri(colorDef) : null;
          return (
            <button
              key={colorDef.id}
              onClick={() => handleColorClick(colorDef)}
              className="relative flex flex-col items-center p-3 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              aria-label={`${colorDef.name[language]} - ${t('tapToHear')}`}
            >
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-300 shadow-inner mb-2 overflow-hidden ${colorDef.tailwindClass}`}
                style={{ backgroundColor: colorDef.hex }} // Ensure accurate color via hex
              >
                {patternDataUri && (
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      backgroundImage: patternDataUri,
                      backgroundRepeat: 'repeat',
                    }}
                  ></div>
                )}
              </div>
              <span className="font-semibold text-center text-slate-700 relative z-10">
                {colorDef.name[language]}
              </span>
              <span className="text-xs text-slate-600 mt-1 relative z-10">{colorDef.hex}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AllColorsView;
