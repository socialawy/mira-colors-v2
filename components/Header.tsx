

import React from 'react';
import { Language, AvatarId, AvatarReactionState, TranslationKey } from '../types';
import { LANGUAGES, AVATARS, UI_TEXTS } from '../constants';
import { UserCircleIcon, SoundOnIcon, SoundOffIcon, BellIcon, BellSlashIcon, MusicNoteIcon, MusicNoteSlashIcon, LowVisionIcon, VibrationOnIcon, VibrationOffIcon } from './icons'; // Added LowVisionIcon, VibrationOnIcon, VibrationOffIcon

interface HeaderProps {
  language: Language;
  isTTSOn: boolean;
  isSoundEffectsOn: boolean;
  isBackgroundMusicOn: boolean;
  isColorblindModeOn: boolean;
  isHapticFeedbackOn: boolean; // New prop
  selectedAvatarId: AvatarId;
  avatarReaction: AvatarReactionState;
  onToggleTTS: () => void;
  onToggleSoundEffects: () => void;
  onToggleBackgroundMusic: () => void;
  onToggleColorblindMode: () => void;
  onToggleHapticFeedback: () => void; // New prop
  onToggleAvatarModal: () => void;
  onLanguageChange: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const Header: React.FC<HeaderProps> = ({
  language,
  isTTSOn,
  isSoundEffectsOn,
  isBackgroundMusicOn,
  isColorblindModeOn,
  isHapticFeedbackOn, // New prop
  selectedAvatarId,
  avatarReaction,
  onToggleTTS,
  onToggleSoundEffects,
  onToggleBackgroundMusic,
  onToggleColorblindMode,
  onToggleHapticFeedback, // New prop
  onToggleAvatarModal,
  onLanguageChange,
  t,
}) => {
  const selectedAvatar = AVATARS[selectedAvatarId];
  let avatarAnimationClass = '';
  if (avatarReaction === 'happy') {
    avatarAnimationClass = 'animate-avatarHappy';
  } else if (avatarReaction === 'sad') {
    avatarAnimationClass = 'animate-avatarSad';
  }

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 shadow-lg flex flex-col sm:flex-row justify-between items-center relative z-10">
      <div className="flex items-center">
        {selectedAvatar && (
          <img
            src={selectedAvatar.imageUrl}
            alt={selectedAvatar.name[language]}
            className={`w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm ${avatarAnimationClass}`}
          />
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('appTitle')}</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 mt-2 sm:mt-0">
        <button
          onClick={onToggleAvatarModal}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title={t('selectYourAvatarButton')}
        >
          <UserCircleIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onToggleTTS}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${isTTSOn ? 'bg-white/30' : ''}`}
          title={t('toggleTTS')}
          aria-pressed={isTTSOn}
        >
          {isTTSOn ? <SoundOnIcon className="w-6 h-6" /> : <SoundOffIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={onToggleSoundEffects}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${isSoundEffectsOn ? 'bg-white/30' : ''}`}
          title={UI_TEXTS[language].toggleSoundEffects || UI_TEXTS[Language.EN].toggleSoundEffects}
          aria-pressed={isSoundEffectsOn}
        >
          {isSoundEffectsOn ? <BellIcon className="w-6 h-6" /> : <BellSlashIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={onToggleBackgroundMusic}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${isBackgroundMusicOn ? 'bg-white/30' : ''}`}
          title={UI_TEXTS[language].toggleBackgroundMusic || UI_TEXTS[Language.EN].toggleBackgroundMusic}
          aria-pressed={isBackgroundMusicOn}
        >
          {isBackgroundMusicOn ? <MusicNoteIcon className="w-6 h-6" /> : <MusicNoteSlashIcon className="w-6 h-6" />}
        </button>
        <button
          onClick={onToggleColorblindMode}
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${isColorblindModeOn ? 'bg-white/30' : ''}`}
          title={t('toggleColorblindMode')}
          aria-pressed={isColorblindModeOn}
        >
          <LowVisionIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onToggleHapticFeedback} // Action for the new toggle
          className={`p-2 rounded-full hover:bg-white/20 transition-colors ${isHapticFeedbackOn ? 'bg-white/30' : ''}`}
          title={t('toggleHapticFeedback')}
          aria-pressed={isHapticFeedbackOn}
        >
          {isHapticFeedbackOn ? <VibrationOnIcon className="w-6 h-6" /> : <VibrationOffIcon className="w-6 h-6" />}
        </button>
        {Object.values(Language).map(lang => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${language === lang ? 'bg-white text-purple-600 scale-110' : 'hover:bg-white/20'}`}
          >
            {LANGUAGES[lang].name}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;