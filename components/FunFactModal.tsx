
import React from 'react';
import { FunFact, Language }   from '../types';
import { UI_TEXTS } from '../constants';

interface FunFactModalProps {
  funFact: FunFact;
  language: Language;
  onClose: () => void;
  onPlaySound?: (text: string, lang: Language) => void;
  isTTSOn: boolean;
}

const FunFactModal: React.FC<FunFactModalProps> = ({ funFact, language, onClose, onPlaySound, isTTSOn }) => {
  if (!funFact) return null;

  const t = (key: keyof typeof UI_TEXTS[Language.EN]) => UI_TEXTS[language][key] || UI_TEXTS[Language.EN][key];

  const handlePlaySound = () => {
    if (onPlaySound && funFact.content[language]) {
      onPlaySound(funFact.content[language], language);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`bg-yellow-100 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all animate-fadeInScaleUp ${language === Language.AR ? 'rtl' : 'ltr'}`}>
        <img 
          src={`https://picsum.photos/300/150?random=${funFact.id}`} 
          alt="Fun illustration" 
          className="rounded-lg mb-4 w-full h-32 object-cover" 
        />
        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-3">{t('greatJob')}</h3>
        <p className="text-gray-700 text-lg sm:text-xl mb-4 leading-relaxed">
          {funFact.content[language]}
        </p>
        {isTTSOn && onPlaySound && (
          <button
            onClick={handlePlaySound}
            className="mb-4 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center mx-auto"
            aria-label={t('pressPlayToHearFact')}
          >
            <i className="fas fa-volume-up text-xl"></i>
          </button>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
        >
          {t('nextChallenge')}
        </button>
      </div>
    </div>
  );
};

export default FunFactModal;
