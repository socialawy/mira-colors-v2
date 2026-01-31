
import React, { useState, useEffect } from 'react';
import { AppState, Language, TranslationKey, ColorId, ColorDefinition } from '../types';
import ColorButton from './ColorButton';
import { COLORS, MAX_RAINBOW_SEQUENCE_ATTEMPTS } from '../constants';

interface RainbowSequenceGameViewProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
  handlePlaySoundTTS: (text: string, lang: Language) => void;
  isColorblindModeOn: boolean;
}

const RainbowSequenceGameView: React.FC<RainbowSequenceGameViewProps> = ({
  state,
  dispatch,
  t,
  handlePlaySoundTTS,
  isColorblindModeOn,
}) => {
  const [shuffledChoices, setShuffledChoices] = useState<ColorDefinition[]>([]);

  const { 
    activeMiniGame,
    currentRainbowSequenceChallenge,
    playerRainbowSequence,
    rainbowSequenceScore,
    rainbowSequenceAttemptsLeft,
    showRainbowSequenceSuccess,
    showRainbowSequenceFailure,
    rainbowSequenceSessionEnded,
    rainbowSequenceSessionChallenges
  } = state;

  useEffect(() => {
    if (activeMiniGame === 'RainbowSequence' && currentRainbowSequenceChallenge) {
      const choices = currentRainbowSequenceChallenge.availableChoices
        .map(id => COLORS[id])
        .filter(Boolean) as ColorDefinition[];
      setShuffledChoices([...choices].sort(() => 0.5 - Math.random()));
    } else {
      setShuffledChoices([]);
    }
  }, [currentRainbowSequenceChallenge, activeMiniGame]);

  if (activeMiniGame !== 'RainbowSequence') {
    return <div className="text-center p-8 text-gray-600">Rainbow Sequence game not active.</div>;
  }

  const handleColorTap = (colorId: ColorId) => {
    if (showRainbowSequenceSuccess || showRainbowSequenceFailure) return; // Don't allow taps if feedback is showing for previous attempt
    
    dispatch({ type: 'TAP_RAINBOW_SEQUENCE_COLOR', payload: colorId });
    const tappedColorDef = COLORS[colorId];
    if (tappedColorDef) {
      handlePlaySoundTTS(tappedColorDef.name[state.language], state.language);
    }
  };

  const handleResetAttempt = () => {
    dispatch({ type: 'RESET_RAINBOW_SEQUENCE_ATTEMPT' });
  };

  const handleNextChallenge = () => {
    dispatch({ type: 'NEXT_RAINBOW_SEQUENCE_CHALLENGE' });
  };
  
  const handlePlayAgain = () => {
    dispatch({ type: 'START_RAINBOW_SEQUENCE_GAME' });
  };

  const handleExitGame = () => {
    dispatch({ type: 'END_RAINBOW_SEQUENCE_GAME' });
  };

  if (rainbowSequenceSessionEnded) {
    return (
      <div className={`p-6 sm:p-8 max-w-md mx-auto bg-white/95 rounded-xl shadow-2xl backdrop-blur-md text-center ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          {t('sessionComplete')}
        </h2>
        <img 
          src="https://source.unsplash.com/300x200/?stars,achievement" 
          alt={t('sessionComplete')}
          className="w-48 h-auto mx-auto rounded-lg shadow-lg mb-6"
        />
        <p className="text-xl text-gray-700 mb-6">
          {t('yourFinalScoreIs', { 
            SCORE: rainbowSequenceScore.toString(), 
            TOTAL_CHALLENGES: (rainbowSequenceSessionChallenges?.length || 0).toString() 
          })}
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handlePlayAgain}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {t('playAgain')}
          </button>
          <button
            onClick={handleExitGame}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {t('exitMiniGame')}
          </button>
        </div>
      </div>
    );
  }

  if (!currentRainbowSequenceChallenge) {
    return (
      <div className={`text-center p-8 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          {t('rainbowSequenceGameTitle')}
        </h2>
        <p className="text-gray-600">Loading next sequence challenge...</p>
      </div>
    );
  }

  const showResetButton = showRainbowSequenceFailure && rainbowSequenceAttemptsLeft > 0;
  const showNextButton = showRainbowSequenceSuccess || (showRainbowSequenceFailure && rainbowSequenceAttemptsLeft === 0);

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-3xl mx-auto bg-white/95 rounded-xl shadow-2xl backdrop-blur-md ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-2">
        {t('rainbowSequenceGameTitle')}
      </h2>
      <p className="text-center text-md text-gray-500 mb-1">
        {t('attemptsLeft')}: {rainbowSequenceAttemptsLeft} / {MAX_RAINBOW_SEQUENCE_ATTEMPTS}
      </p>
       <p className="text-center text-md text-gray-600 mb-4">
        Score: {rainbowSequenceScore}
      </p>

      <div className="mb-6 p-4 bg-indigo-50 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-indigo-800 mb-1 text-center">
          {currentRainbowSequenceChallenge.name[state.language]}
        </h3>
        <p className="text-sm text-gray-600 text-center">
          {currentRainbowSequenceChallenge.description[state.language]}
        </p>
      </div>

      {/* Player's Current Sequence Display */}
      <div className="mb-6 text-center">
        <p className="text-md font-medium text-gray-700 mb-2">{t('yourCurrentSequence')}</p>
        <div className={`flex justify-center items-center space-x-2 h-12 ${state.language === Language.AR ? 'space-x-reverse' : ''}`}>
          {playerRainbowSequence.length > 0 ? playerRainbowSequence.map((colorId, index) => {
            const colorDef = COLORS[colorId];
            return (
              <div 
                key={`${colorId}-${index}`}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md border-2 shadow-sm ${colorDef?.tailwindClass}`}
                style={{ backgroundColor: colorDef?.hex }}
                title={colorDef?.name[state.language]}
              ></div>
            );
          }) : <span className="text-gray-400 italic">Tap colors below...</span>}
        </div>
      </div>
      
      {/* Available Color Choices */}
      <div className="mb-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 place-items-center">
        {shuffledChoices.map(colorDef => (
          <ColorButton
            key={colorDef.id}
            colorDef={colorDef}
            onClick={() => handleColorTap(colorDef.id)}
            disabled={showRainbowSequenceSuccess || showRainbowSequenceFailure} // Disable all choices once an attempt is finalized
            language={state.language}
            showName={false}
            size="md"
            isColorblindModeOn={isColorblindModeOn}
          />
        ))}
      </div>

      <div className="text-center min-h-[3rem] mb-6"> {/* Feedback area */}
        {showRainbowSequenceSuccess && (
          <p className="text-2xl text-green-500 font-bold animate-pulseOnce">{t('sequenceCorrect')}</p>
        )}
        {showRainbowSequenceFailure && (
          <p className="text-2xl text-red-500 font-bold animate-shake">{t('sequenceIncorrect')}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {showResetButton && (
          <button
            onClick={handleResetAttempt}
            className="w-full sm:w-auto px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {t('resetAttemptButton')}
          </button>
        )}
        {showNextButton && (
          <button
            onClick={handleNextChallenge}
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {t('nextChallenge')}
          </button>
        )}
         <button 
          onClick={handleExitGame}
          className="w-full sm:w-auto px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors shadow-md text-sm"
        >
          {t('exitMiniGame')}
        </button>
      </div>
    </div>
  );
};

export default RainbowSequenceGameView;