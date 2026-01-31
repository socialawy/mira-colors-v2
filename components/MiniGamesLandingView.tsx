
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppState, Language, TranslationKey, MiniGameType } from '../types';
import { PuzzlePieceIcon, Bars3BottomLeftIcon } from './icons';

interface MiniGamesLandingViewProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const MiniGamesLandingView: React.FC<MiniGamesLandingViewProps> = ({ state, dispatch, t }) => {
  const handleGameSelection = (gameType: MiniGameType) => {
    // First, set the active mini-game type. This will also clear other game states if needed.
    dispatch({ type: 'SET_ACTIVE_MINI_GAME', payload: gameType });
    
    // Then, dispatch the specific start action for that game.
    if (gameType === 'ColorMatch') {
      dispatch({ type: 'START_COLOR_MATCH_GAME' });
    } else if (gameType === 'RainbowSequence') {
      dispatch({ type: 'START_RAINBOW_SEQUENCE_GAME' });
    }
  };

  const gameCards = [
    {
      path: '/color-match',
      titleKey: 'colorMatchGameTitle' as TranslationKey,
      icon: PuzzlePieceIcon,
      gameType: 'ColorMatch' as MiniGameType,
      gradient: 'from-blue-400 to-indigo-500',
      hoverGradient: 'hover:from-blue-500 hover:to-indigo-600',
    },
    {
      path: '/rainbow-sequence',
      titleKey: 'rainbowSequenceGameTitle' as TranslationKey,
      icon: Bars3BottomLeftIcon,
      gameType: 'RainbowSequence' as MiniGameType,
      gradient: 'from-green-400 to-teal-500',
      hoverGradient: 'hover:from-green-500 hover:to-teal-600',
    },
  ];

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-3xl mx-auto ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-700 mb-8 sm:mb-12">
        {t('miniGamesLandingTitle')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {gameCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <NavLink
              key={card.path}
              to={card.path}
              onClick={() => handleGameSelection(card.gameType)}
              className={`
                group
                p-6 sm:p-8 rounded-xl 
                bg-gradient-to-br ${card.gradient}
                text-white 
                flex flex-col items-center justify-center 
                shadow-lg hover:shadow-xl 
                transform hover:scale-105 
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75
                ${card.hoverGradient}
              `}
              aria-label={t(card.titleKey)}
            >
              <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 mb-4 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-xl sm:text-2xl font-semibold text-center">
                {t(card.titleKey)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MiniGamesLandingView;