
import React from 'react';
import { AppState, Language, TranslationKey, ColorDefinition, ColorId } from '../types';
import { COLORS, MAX_COLOR_MATCH_ATTEMPTS } from '../constants';
import ColorButton from './ColorButton';

interface ColorMatchGameViewProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
  handlePlaySoundTTS: (text: string, lang: Language) => void;
  isColorblindModeOn: boolean;
}

const ColorMatchGameView: React.FC<ColorMatchGameViewProps> = ({
  state,
  dispatch,
  t,
  handlePlaySoundTTS,
  isColorblindModeOn,
}) => {
  if (state.activeMiniGame !== 'ColorMatch') {
    return <div className="text-center p-8 text-gray-600">Mini-game not active.</div>;
  }

  const { 
    currentColorMatchChallenge, 
    colorMatchSelectedAnswerId, 
    colorMatchScore, 
    colorMatchAttemptsLeft, 
    showColorMatchSuccess, 
    showColorMatchFailure,
    colorMatchSessionChallenges,
    colorMatchSessionEnded,
  } = state;

  const handleSelectAnswer = (colorId: ColorId) => {
    // Allow selection if the game is not showing success feedback.
    // If failure feedback was shown, selecting a new answer implies a retry.
    if (showColorMatchSuccess) return; 
    
    dispatch({ type: 'SELECT_COLOR_MATCH_ANSWER', payload: colorId });
    const selectedColorDef = COLORS[colorId];
    if (selectedColorDef) {
        handlePlaySoundTTS(selectedColorDef.name[state.language], state.language);
    }
  };

  const handleSubmitAnswer = () => {
    if (colorMatchSelectedAnswerId && !showColorMatchSuccess && !showColorMatchFailure) {
      dispatch({ type: 'SUBMIT_COLOR_MATCH_ANSWER' });
    }
  };

  const handleNextChallenge = () => {
    dispatch({ type: 'NEXT_COLOR_MATCH_CHALLENGE' });
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'START_COLOR_MATCH_GAME' });
  };

  const handleExitGame = () => {
    dispatch({ type: 'END_COLOR_MATCH_GAME' });
  };


  if (colorMatchSessionEnded) {
    return (
      <div className={`p-6 sm:p-8 max-w-md mx-auto bg-white/95 rounded-xl shadow-2xl backdrop-blur-md text-center ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          {t('sessionComplete')}
        </h2>
        <img 
          src="https://source.unsplash.com/300x200/?celebration,success" 
          alt={t('sessionComplete')}
          className="w-48 h-auto mx-auto rounded-lg shadow-lg mb-6"
        />
        <p className="text-xl text-gray-700 mb-6">
          {t('yourFinalScoreIs', { 
            SCORE: colorMatchScore.toString(), 
            TOTAL_CHALLENGES: (colorMatchSessionChallenges?.length || 0).toString() 
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
  
  if (!currentColorMatchChallenge) {
    return (
      <div className={`text-center p-8 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          {t('colorMatchGameTitle')}
        </h2>
        <p className="text-gray-600">Loading next challenge...</p>
      </div>
    );
  }

  const currentChallengeData = currentColorMatchChallenge;
  const choiceColorDefinitions: ColorDefinition[] = currentChallengeData.choiceColorIds
    .map(id => COLORS[id])
    .filter(Boolean) as ColorDefinition[];

  const canSubmit = colorMatchSelectedAnswerId !== null && !showColorMatchSuccess && !showColorMatchFailure;
  const showNextButton = showColorMatchSuccess || (showColorMatchFailure && colorMatchAttemptsLeft === 0);

  return (
    <div className={`p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white/95 rounded-xl shadow-2xl backdrop-blur-md ${state.language === Language.AR ? 'rtl' : 'ltr'}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-700 mb-4">
        {t('colorMatchGameTitle')}
      </h2>
      <p className="text-center text-md text-gray-500 mb-1">
        {t('attemptsLeft')}: {colorMatchAttemptsLeft} / {MAX_COLOR_MATCH_ATTEMPTS}
      </p>
       <p className="text-center text-md text-gray-600 mb-4">
        Score: {colorMatchScore}
      </p>
      
      <div className="text-center mb-6">
        <img 
            src={currentChallengeData.imageUrl} 
            alt={currentChallengeData.objectName[state.language]} 
            className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg shadow-lg object-cover mb-3 border-4 border-purple-300"
        />
        <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {t('whatColorIsThe', { OBJECT_NAME: currentChallengeData.objectName[state.language] })}
        </p>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6`}>
        {choiceColorDefinitions.map(colorDef => (
          <ColorButton
            key={colorDef.id}
            colorDef={colorDef}
            onClick={() => handleSelectAnswer(colorDef.id)}
            isSelected={colorMatchSelectedAnswerId === colorDef.id}
            disabled={showColorMatchSuccess || (showColorMatchFailure && colorMatchAttemptsLeft === 0)}
            language={state.language}
            showName={false} 
            size="md"
            isColorblindModeOn={isColorblindModeOn}
          />
        ))}
      </div>

      <div className="text-center min-h-[3rem] mb-6"> {/* Feedback area */}
        {showColorMatchSuccess && (
            <p className="text-2xl text-green-500 font-bold animate-pulseOnce">{t('correct')}</p>
        )}
        {showColorMatchFailure && (
            <p className="text-2xl text-red-500 font-bold animate-shake">{t('tryAgain')}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {!showNextButton && (
          <button
            onClick={handleSubmitAnswer}
            disabled={!canSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            {t('submitAnswer')}
          </button>
        )}
        {showNextButton && (
          <button
            onClick={handleNextChallenge}
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {t('nextObject')}
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

export default ColorMatchGameView;
