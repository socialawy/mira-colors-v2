
import React from 'react';
import { Language, TranslationKey, FunFactCategory } from '../types';
import { FUN_FACTS } from '../constants';

interface FunFactsExplorerViewProps {
  language: Language;
  isTTSOn: boolean;
  t: (key: TranslationKey) => string;
  handlePlaySoundTTS: (text: string, lang: Language) => void;
}

const FunFactsExplorerView: React.FC<FunFactsExplorerViewProps> = ({
  language,
  isTTSOn,
  t,
  handlePlaySoundTTS,
}) => (
  <div className={`p-4 sm:p-6 md:p-8 max-w-4xl mx-auto ${language === Language.AR ? 'rtl' : 'ltr'}`}>
    <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">{t('funFactsExplorer')}</h2>
    {Object.values(FunFactCategory).map(category => (
      <div key={category} className="mb-8">
        <h3 className="text-2xl font-semibold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">
          {t(category.toLowerCase() as TranslationKey)}
        </h3>
        <div className="space-y-4">
          {FUN_FACTS.filter(fact => fact.category === category).map(fact => (
            <div key={fact.id} className="bg-white/90 p-4 rounded-lg shadow-lg flex items-start space-x-3 backdrop-blur-sm">
              <img src={`https://picsum.photos/seed/${fact.id}/50/50`} alt="Fact icon" className="w-12 h-12 rounded-full object-cover flex-shrink-0 mt-1" />
              <div className="flex-grow">
                <p className="text-gray-700 leading-relaxed">{fact.content[language]}</p>
                {isTTSOn && (
                  <button
                    onClick={() => handlePlaySoundTTS(fact.content[language], language)}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                    aria-label={t('tapToHear')}
                  >
                    <i className="fas fa-volume-up"></i><span>{t('tapToHear')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default FunFactsExplorerView;
