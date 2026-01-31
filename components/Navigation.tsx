
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TranslationKey } from '../types';
import { GameControllerIcon, LightbulbIcon, PaletteIcon, PuzzlePieceIcon } from './icons';

interface NavigationProps {
  t: (key: TranslationKey) => string;
  dispatch: React.Dispatch<any>; 
}

const Navigation: React.FC<NavigationProps> = ({ t, dispatch }) => {
  const handleMainNavLinkClick = () => {
    dispatch({ type: 'SET_ACTIVE_MINI_GAME', payload: null });
  };

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) => `px-3 py-2 rounded-md text-lg font-medium flex items-center space-x-2 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            onClick={handleMainNavLinkClick} 
          > <GameControllerIcon className="w-5 h-5" /> <span>{t('colorMixingGame')}</span>
          </NavLink>
          <NavLink
            to="/facts"
            className={({ isActive }) => `ml-4 px-3 py-2 rounded-md text-lg font-medium flex items-center space-x-2 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            onClick={handleMainNavLinkClick}
          > <LightbulbIcon className="w-5 h-5" /> <span>{t('funFactsExplorer')}</span>
          </NavLink>
          <NavLink
            to="/all-colors" 
            className={({ isActive }) => `ml-4 px-3 py-2 rounded-md text-lg font-medium flex items-center space-x-2 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            onClick={handleMainNavLinkClick}
          > <PaletteIcon className="w-5 h-5" /> <span>{t('allColorsViewTabTitle')}</span>
          </NavLink>
          <NavLink
            to="/mini-games" // New link to the mini-games landing page
            className={({ isActive }) => `ml-4 px-3 py-2 rounded-md text-lg font-medium flex items-center space-x-2 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            onClick={handleMainNavLinkClick} // Also clears active mini-game state when navigating TO the landing page
          > <PuzzlePieceIcon className="w-5 h-5" /> <span>{t('miniGamesNavTitle')}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;