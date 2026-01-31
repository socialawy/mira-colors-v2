
import React from 'react';
import { ColorDefinition, Language, ColorId }   from '../types'; // Added ColorId
import { UI_TEXTS, FUNDAMENTAL_COLOR_IDS, getPatternDataUri } from '../constants'; // Added FUNDAMENTAL_COLOR_IDS and getPatternDataUri

interface RevealAnswerModalProps {
  revealedInfo: {
    target: ColorDefinition;
    inputs: [ColorDefinition, ColorDefinition] | null;
  };
  language: Language;
  onCloseAndNext: () => void;
  onPlaySound?: (text: string, lang: Language) => void;
  isTTSOn: boolean;
  isColorblindModeOn: boolean; // New prop
}

// Small helper component for color circles in the modal
const ModalColorCircle: React.FC<{ 
  colorDef: ColorDefinition, 
  size?: 'sm' | 'md',
  isColorblindModeOn?: boolean 
}> = ({ colorDef, size = 'md', isColorblindModeOn = false }) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-16 h-16 sm:w-20 sm:h-20';
  const patternDataUri = isColorblindModeOn ? getPatternDataUri(colorDef) : null;

  return (
    <div 
      style={{ backgroundColor: colorDef.hex }} 
      className={`relative ${sizeClass} rounded-full border-2 border-gray-300 shadow-inner flex-shrink-0 overflow-hidden`} // Added relative and overflow-hidden
      aria-label={colorDef.name[Language.EN]} // Use EN for aria-label consistency if needed, or pass lang
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
  );
};


const RevealAnswerModal: React.FC<RevealAnswerModalProps> = ({ 
  revealedInfo, 
  language, 
  onCloseAndNext, 
  onPlaySound, 
  isTTSOn,
  isColorblindModeOn 
}) => {
  if (!revealedInfo) return null;

  const t = (key: keyof typeof UI_TEXTS[Language.EN]) => UI_TEXTS[language][key] || UI_TEXTS[Language.EN][key];

  const { target, inputs } = revealedInfo;

  const handlePlaySound = () => {
    if (onPlaySound) {
      let soundText = `${t('theCorrectAnswerIs')} `;
      if (inputs) {
        soundText += `${inputs[0].name[language]} ${t('and')} ${inputs[1].name[language]} ${t('make')} ${target.name[language]}`;
      } else {
        soundText += target.name[language];
        if (FUNDAMENTAL_COLOR_IDS.includes(target.id)) {
            soundText += `. ${t('isAFundamentalColorMessage').replace('{COLOR_NAME}', target.name[language])}`;
        }
      }
      onPlaySound(soundText, language);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`bg-sky-100 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all animate-fadeInScaleUp ${language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h3 className="text-2xl sm:text-3xl font-bold text-sky-700 mb-3">{t('answerRevealedTitle')}</h3>
        
        <p className="text-gray-700 text-lg sm:text-xl mb-4">
          {t('theCorrectAnswerIs')}:
        </p>

        {inputs && (
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
            <ModalColorCircle colorDef={inputs[0]} size="sm" isColorblindModeOn={isColorblindModeOn} />
            <span className="text-xl sm:text-2xl text-gray-600">+</span>
            <ModalColorCircle colorDef={inputs[1]} size="sm" isColorblindModeOn={isColorblindModeOn} />
            <span className="text-xl sm:text-2xl text-gray-600">=</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center my-3">
            <ModalColorCircle colorDef={target} size="md" isColorblindModeOn={isColorblindModeOn} />
            <span 
                className={`text-2xl sm:text-3xl font-bold mt-2 ${target.textColorClass || ''}`} 
                style={{color: target.textColorClass ? undefined : target.hex }}>
                {target.name[language]}
            </span>
        </div>
        
        {!inputs && FUNDAMENTAL_COLOR_IDS.includes(target.id) && (
            <p className="text-sm text-gray-600 mt-2 mb-3">
                {t('isAFundamentalColorMessage').replace('{COLOR_NAME}', target.name[language])}
            </p>
        )}

        {isTTSOn && onPlaySound && (
          <button
            onClick={handlePlaySound}
            className="my-4 p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors flex items-center justify-center mx-auto shadow-lg"
            aria-label={t('playAnswerSound')}
          >
            <i className="fas fa-volume-up text-xl"></i>
          </button>
        )}
        <button
          onClick={onCloseAndNext}
          className="mt-4 px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 shadow-lg"
        >
          {t('nextChallenge')}
        </button>
      </div>
    </div>
  );
};

export default RevealAnswerModal;
