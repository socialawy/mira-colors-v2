
import React from 'react';
import { AvatarDefinition, AvatarId, Language, TranslationKey, UITexts } from '../types';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatars: AvatarDefinition[];
  selectedAvatarId: AvatarId;
  onSelectAvatar: (avatarId: AvatarId) => void;
  language: Language;
  uiTexts: Record<TranslationKey, string>; // Pass relevant part of UI_TEXTS
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  isOpen,
  onClose,
  avatars,
  selectedAvatarId,
  onSelectAvatar,
  language,
  uiTexts,
}) => {
  if (!isOpen) return null;

  const t = (key: TranslationKey) => uiTexts[key] || key;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeInScaleUp">
      <div className={`bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg text-center transform transition-all ${language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">{t('avatarSelectionTitle')}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar.id)}
              className={`p-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none
                          ${selectedAvatarId === avatar.id 
                            ? 'bg-white ring-4 ring-purple-500 shadow-lg scale-105' 
                            : 'bg-white/70 hover:bg-white hover:shadow-md'}`}
              aria-label={`${t(avatar.id + 'Name' as TranslationKey)}`}
            >
              <img 
                src={avatar.imageUrl} 
                alt={avatar.name[language]} 
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 rounded-md object-contain" 
              />
              <p className={`text-sm font-semibold ${selectedAvatarId === avatar.id ? 'text-purple-700' : 'text-gray-700'}`}>
                {avatar.name[language]}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 shadow-md"
        >
          {t('closeAvatarSelection')}
        </button>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;