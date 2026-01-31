
import React from 'react';
import { AppState, Language, PaletteId, TranslationKey, ColorDefinition, ColorId } from '../types';
import { PALETTES, COLORS, SELECTABLE_COLORS_FOR_MIXING_IDS, FUNDAMENTAL_COLOR_IDS, CHALLENGES_PER_PALETTE, getPatternDataUri } from '../constants'; // Added getPatternDataUri
import ColorButton from './ColorButton';
import FunFactModal from './FunFactModal';
import RevealAnswerModal from './RevealAnswerModal';
import ParticleBurst from './ParticleBurst';

// Helper to calculate effective challenges for a palette (copied from App.tsx)
const getEffectiveChallengesPerPalette = (paletteId: PaletteId): number => {
  const paletteInfo = PALETTES[paletteId];
  if (!paletteInfo) return CHALLENGES_PER_PALETTE;
  return Math.min(CHALLENGES_PER_PALETTE, paletteInfo.challengeColorIds.length);
};

interface ColorMixingGameViewProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  t: (key: TranslationKey) => string;
  handlePlaySoundTTS: (text: string, lang: Language) => void;
  generateNewChallenge: (paletteIdToFocus: PaletteId, isAutoAdvance?: boolean) => void;
  handleColorSelect: (colorDef: ColorDefinition) => void;
  handleMixAttempt: () => void;
  handleResetSelection: () => void;
  handleCloseFunFactModal: () => void;
  handleProceedToNextChallengeAfterReveal: () => void;
  handleRevealOrNextChallenge: () => void;
  handlePaletteChange: (paletteId: PaletteId) => void;
  isColorblindModeOn: boolean; // New prop
}

const ColorMixingGameView: React.FC<ColorMixingGameViewProps> = ({
  state,
  dispatch,
  t,
  handlePlaySoundTTS,
  // generateNewChallenge, // Not directly used here, but part of app logic. Actions will trigger it.
  handleColorSelect,
  handleMixAttempt,
  handleResetSelection,
  handleCloseFunFactModal,
  handleProceedToNextChallengeAfterReveal,
  handleRevealOrNextChallenge,
  handlePaletteChange,
  isColorblindModeOn, // New prop
}) => {
  const currentPaletteProgress = state.userProgress[state.currentPaletteId];
  const currentPaletteInfo = PALETTES[state.currentPaletteId];

  const allGamePalettesTrulyMastered = Object.values(PaletteId).every(pId => {
    const paletteInfo = PALETTES[pId];
    const progress = state.userProgress[pId];
    if (!paletteInfo || !progress) return false;
    if (paletteInfo.challengeColorIds.length === 0) return true;
    return progress.unlocked && progress.mastered;
  });

  if (!state.currentChallenge && !state.revealedAnswerInfo && !state.funFactToShow) {
    if (allGamePalettesTrulyMastered) {
      return (
        <div className="text-center p-8 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {t('allChallengesCompleted')}
          </h2>
          <img src="https://picsum.photos/seed/completed_all_final/400/300" alt="Grand Celebration" className="mx-auto rounded-lg shadow-lg" />
          <p className="text-xl mt-4">{t('greatJob')}</p>
        </div>
      );
    }

    if (currentPaletteProgress?.unlocked && currentPaletteProgress?.mastered) {
      return (
        <div className="text-center p-8 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {`${currentPaletteInfo.name[state.language]} - ${t('paletteCompleted')}`}
          </h2>
          <img src={`https://picsum.photos/seed/${state.currentPaletteId}_completed_palette/400/300`} alt="Palette Celebration" className="mx-auto rounded-lg shadow-lg" />
          <p className="text-xl mt-4">{t('greatJob')}!</p>
        </div>
      );
    }
    return <div className="text-center p-8 text-xl bg-white/90 rounded-xl shadow-xl backdrop-blur-sm">Loading challenge...</div>;
  }

  const displayTarget = state.revealedAnswerInfo ? state.revealedAnswerInfo.target : (state.currentChallenge ? COLORS[state.currentChallenge.targetColorId] : (state.mixedResultColor || undefined));

  if (!displayTarget && !state.revealedAnswerInfo && !state.funFactToShow) {
    return <div className="text-center p-8 text-xl bg-white/90 rounded-xl shadow-xl backdrop-blur-sm">Preparing challenge...</div>;
  }
  
  const effectiveChallengesForCurrentPalette = getEffectiveChallengesPerPalette(state.currentPaletteId);

  const isTargetFundamental = state.currentChallenge && FUNDAMENTAL_COLOR_IDS.includes(state.currentChallenge.targetColorId);
  const requiredSelectionsForMix = isTargetFundamental ? 1 : 2;
  const instructionalTextKey = isTargetFundamental ? 'selectTheTargetColorPrompt' : 'selectTwoColors';
  
  const targetPatternDataUri = displayTarget && isColorblindModeOn ? getPatternDataUri(displayTarget) : null;

  return (
    <div className={`relative p-4 sm:p-6 md:p-8 max-w-4xl mx-auto ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
      {/* Full-screen color wash for correct answer */}
      {state.showSuccessSplash && state.mixedResultColor && (
        <div
          className="fixed inset-0 animate-colorWashFade pointer-events-none z-10" // z-10 to be above background but below modals/header
          style={{ backgroundColor: state.mixedResultColor.hex }}
        ></div>
      )}

      <div className="mb-6 flex flex-wrap justify-center gap-1 sm:gap-2 bg-gray-200/80 p-1 rounded-lg backdrop-blur-sm relative z-0">
        {Object.values(PALETTES).map(palette => {
          const progress = state.userProgress[palette.id];
          const isLocked = !progress?.unlocked;
          return (
            <button
              key={palette.id}
              onClick={() => handlePaletteChange(palette.id)}
              disabled={isLocked}
              title={isLocked ? t('paletteLockedMessage') : `${palette.name[state.language]}${progress && progress.unlocked ? ` - ${progress.totalStars} Stars` : ''}`}
              className={`flex-grow px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ease-in-out
                ${state.currentPaletteId === palette.id ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md scale-105' : 'bg-white text-gray-600 hover:bg-gray-50'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {palette.name[state.language]}
              {isLocked ? ' 🔒' : ''}
              {progress && progress.unlocked && !isLocked ? (
                <span className="ml-1 text-xs">
                  ({progress.totalStars}⭐)
                  {progress.mastered ? ' 🌟' : ''}
                </span>
              ) : ''}
            </button>
          );
        })}
      </div>

      {displayTarget && (
        <div className="text-center mb-6 p-4 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm relative z-0">
          <p className="text-lg sm:text-xl text-gray-600">{t('mixColorsToMake')}:</p>
          <div
            className="flex items-center justify-center my-2 animate-glowPulse"
            style={{ color: displayTarget.hex }}
          >
            <div 
              style={{ backgroundColor: displayTarget.hex }} 
              className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-300 shadow-inner overflow-hidden`} // Added relative and overflow-hidden
            >
              {targetPatternDataUri && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    backgroundImage: targetPatternDataUri,
                    backgroundRepeat: 'repeat',
                  }}
                ></div>
              )}
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ml-3 ${displayTarget.textColorClass ? displayTarget.textColorClass : ''}`} style={{ color: displayTarget.textColorClass ? undefined : displayTarget.hex }}>
              {displayTarget.name[state.language]}
            </h2>
          </div>
          <p className="text-sm text-gray-500">{`${t('attemptsLeft')}: ${state.attemptsLeft}`}</p>
          {currentPaletteProgress && <p className="text-sm text-gray-500 mt-1">{`Palette Progress: ${currentPaletteProgress.completedChallenges.size} / ${effectiveChallengesForCurrentPalette} challenges completed. Total Stars: ${currentPaletteProgress.totalStars} ⭐`}</p>}
        </div>
      )}

      <div className="mb-6 p-4 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm relative z-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 place-items-center">
          {SELECTABLE_COLORS_FOR_MIXING_IDS.map(id => COLORS[id]).map(colorDef => (
            <ColorButton
              key={colorDef.id}
              colorDef={colorDef}
              onClick={() => handleColorSelect(colorDef)}
              isSelected={state.selectedMixColors.some(c => c.id === colorDef.id)}
              disabled={
                (isTargetFundamental && state.selectedMixColors.length >= 1 && !state.selectedMixColors.some(c => c.id === colorDef.id)) ||
                (!isTargetFundamental && state.selectedMixColors.length >= 2 && !state.selectedMixColors.some(c => c.id === colorDef.id)) ||
                state.showSuccessSplash || state.isAnswerRevealed || !!state.revealedAnswerInfo
              }
              language={state.language}
              size="sm"
              isColorblindModeOn={isColorblindModeOn} // Pass prop
            />
          ))}
        </div>
      </div>

      <div className={`mb-6 p-4 bg-white/90 rounded-xl shadow-lg flex flex-col items-center backdrop-blur-sm relative z-0 ${state.showFailureShake ? 'animate-shake' : ''}`}>
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center text-white text-3xl shadow-inner ${state.selectedMixColors[0] ? state.selectedMixColors[0].tailwindClass : 'bg-gray-200'}`}>
            {state.selectedMixColors[0] ? '' : '?'}
          </div>
          {!isTargetFundamental && (
            <>
              <span className="text-2xl sm:text-3xl font-bold text-gray-500">+</span>
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center text-white text-3xl shadow-inner ${state.selectedMixColors[1] ? state.selectedMixColors[1].tailwindClass : 'bg-gray-200'}`}>
                {state.selectedMixColors[1] ? '' : '?'}
              </div>
            </>
          )}
          <span className="text-2xl sm:text-3xl font-bold text-gray-500">=</span>
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center text-white text-4xl shadow-md
                ${state.mixedResultColor ? state.mixedResultColor.tailwindClass : 'bg-gray-300'} ${state.mixedResultColor && state.mixedResultColor.textColorClass ? state.mixedResultColor.textColorClass : ''}`}>
            {state.mixedResultColor ? '' : '?'}
            {/* ParticleBurst is triggered by showSuccessSplash */}
            {state.mixedResultColor && <ParticleBurst colorHex={state.mixedResultColor.hex} isActive={state.showSuccessSplash} />}
          </div>
        </div>

        {state.selectedMixColors.length < requiredSelectionsForMix && !state.isAnswerRevealed && !state.revealedAnswerInfo && !state.showSuccessSplash && state.attemptsLeft > 0 && (
          <p className="text-sm text-gray-500 mb-2">{t(instructionalTextKey)}</p>
        )}

        <div className="flex space-x-2 sm:space-x-3">
          {!state.isAnswerRevealed && !state.revealedAnswerInfo && !state.showSuccessSplash && state.attemptsLeft > 0 && (
            <>
              <button
                onClick={handleMixAttempt}
                disabled={
                  state.selectedMixColors.length !== requiredSelectionsForMix ||
                  state.showSuccessSplash ||
                  state.attemptsLeft === 0 ||
                  state.isAnswerRevealed ||
                  !!state.revealedAnswerInfo
                }
                className="px-6 py-3 sm:px-8 sm:py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md active:bg-green-700 disabled:opacity-50"
              >
                {t('mix')}
              </button>
              <button
                onClick={handleResetSelection}
                disabled={state.showSuccessSplash || !!state.revealedAnswerInfo}
                className="px-4 py-3 sm:px-6 sm:py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors shadow-md active:bg-gray-600 disabled:opacity-50"
              >
                {t('reset')}
              </button>
            </>
          )}
        </div>

        {((state.attemptsLeft === 0 && !state.showSuccessSplash && !state.revealedAnswerInfo) || (state.isAnswerRevealed && !state.revealedAnswerInfo && !state.funFactToShow)) && (
          <button
            onClick={handleRevealOrNextChallenge}
            className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            {state.isAnswerRevealed && !state.revealedAnswerInfo ? t('nextChallenge') : t('revealAnswer')}
          </button>
        )}
      </div>

      {state.funFactToShow && state.showDelayedFunFactModal && (
        <FunFactModal
          funFact={state.funFactToShow}
          language={state.language}
          onClose={handleCloseFunFactModal}
          onPlaySound={handlePlaySoundTTS}
          isTTSOn={state.isTTSOn}
        />
      )}
      {state.revealedAnswerInfo && (
        <RevealAnswerModal
          revealedInfo={state.revealedAnswerInfo}
          language={state.language}
          onCloseAndNext={handleProceedToNextChallengeAfterReveal}
          onPlaySound={handlePlaySoundTTS}
          isTTSOn={state.isTTSOn}
          isColorblindModeOn={isColorblindModeOn} // Pass prop
        />
      )}
    </div>
  );
};

export default ColorMixingGameView;
