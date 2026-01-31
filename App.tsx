

import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppState, Language, PaletteId, TranslationKey, AvatarId, AvatarReactionState, ColorDefinition, FunFact, FunFactCategory, Challenge, UserProgressData, Stars, ColorMatchChallengeDefinition, MiniGameType, RainbowSequenceChallengeDefinition, ColorId } from './types';
import { UI_TEXTS, MAX_ATTEMPTS, LANGUAGES, INITIAL_APP_STATE, FUNDAMENTAL_COLOR_IDS, MIXING_RULES, COLORS, PALETTES, CHALLENGES_PER_PALETTE, AVATARS, AVATAR_IDS, PALETTE_BACKGROUND_URLS, FUN_FACTS, HAPTIC_SUCCESS_PATTERN, HAPTIC_FAILURE_PATTERN, COLOR_MATCH_CHALLENGES_DATA, MAX_COLOR_MATCH_ATTEMPTS, COLOR_MATCH_CHALLENGES_PER_SESSION, RAINBOW_SEQUENCE_CHALLENGES_DATA, RAINBOW_SEQUENCE_CHALLENGES_PER_SESSION, MAX_RAINBOW_SEQUENCE_ATTEMPTS } from './constants';
import { useSpeech } from './hooks/useSpeech';

// Sound effect URLs
const SOUND_EFFECT_CORRECT = 'https://www.soundjay.com/buttons/sounds/button-3.mp3'; 
const SOUND_EFFECT_INCORRECT = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
// Updated background music URL
const BACKGROUND_MUSIC_URL = 'https://archive.org/download/100ClassicalMusicMasterpieces/1775%20Mozart%20%2C%20Violin%20Concerto%20No.%203%20in%20G%2C%201st%20movement.mp3'; 


// Import newly created components
import Header from './components/Header';
import Navigation from './components/Navigation';
import ColorMixingGameView from './components/ColorMixingGameView';
import FunFactsExplorerView from './components/FunFactsExplorerView';
import AvatarSelectionModal from './components/AvatarSelectionModal';
import AllColorsView from './components/AllColorsView'; 
import ColorMatchGameView from './components/ColorMatchGameView'; 
import RainbowSequenceGameView from './components/RainbowSequenceGameView';
import MiniGamesLandingView from './components/MiniGamesLandingView'; // Import new landing page


// Helper to calculate effective challenges for a palette
const getEffectiveChallengesPerPalette = (paletteId: PaletteId): number => {
  const paletteInfo = PALETTES[paletteId];
  if (!paletteInfo) return CHALLENGES_PER_PALETTE;
  return Math.min(CHALLENGES_PER_PALETTE, paletteInfo.challengeColorIds.length);
};

// Reducer function
function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_PALETTE': {
      const targetPaletteId = action.payload as PaletteId;
      if (state.userProgress[targetPaletteId]?.unlocked) {
        return { ...state, currentPaletteId: targetPaletteId, currentChallenge: null, selectedMixColors: [], mixedResultColor: null, attemptsLeft: MAX_ATTEMPTS, isAnswerRevealed: false, showSuccessSplash: false, showFailureShake: false, revealedAnswerInfo: null, avatarReaction: null, showDelayedFunFactModal: false, soundToPlayEffect: null, showErrorFlash: false, hapticPatternToPlay: null };
      } else {
        alert(UI_TEXTS[state.language].paletteLockedMessage || UI_TEXTS[Language.EN].paletteLockedMessage)
        return state;
      }
    }
    case 'SET_CHALLENGE':
      return { ...state, currentChallenge: action.payload, selectedMixColors: [], mixedResultColor: null, attemptsLeft: MAX_ATTEMPTS, showSuccessSplash: false, showFailureShake: false, isAnswerRevealed: false, revealedAnswerInfo: null, avatarReaction: null, showDelayedFunFactModal: false, soundToPlayEffect: null, showErrorFlash: false, hapticPatternToPlay: null };
    case 'SELECT_COLOR': {
      if (state.selectedMixColors.length < 2 && !state.selectedMixColors.find(c => c.id === action.payload.id)) {
        return { ...state, selectedMixColors: [...state.selectedMixColors, action.payload] };
      }
      return state;
    }
    case 'RESET_SELECTION':
      return { ...state, selectedMixColors: [], mixedResultColor: state.isAnswerRevealed ? state.mixedResultColor : null, showFailureShake: false, showSuccessSplash: false, showErrorFlash: false };
    case 'MIX_SUCCESS': {
      if (!state.currentChallenge) return state;

      const { result } = action.payload;
      const currentPaletteId = state.currentPaletteId;
      const targetColorId = state.currentChallenge.targetColorId;

      let starsAwarded: Stars = 0;
      if (state.attemptsLeft === MAX_ATTEMPTS) {
        starsAwarded = 3;
      } else if (state.attemptsLeft === MAX_ATTEMPTS - 1) {
        starsAwarded = 2;
      } else {
        starsAwarded = 1;
      }

      const updatedUserProgress = { ...state.userProgress };
      const oldPaletteProgress = state.userProgress[currentPaletteId];
      const paletteProgress = { ...updatedUserProgress[currentPaletteId] };
      paletteProgress.completedChallenges = new Set(paletteProgress.completedChallenges).add(targetColorId);
      paletteProgress.starsPerChallenge = { ...paletteProgress.starsPerChallenge, [targetColorId]: starsAwarded };
      paletteProgress.totalStars = Object.values(paletteProgress.starsPerChallenge).reduce((sum, s) => sum + (s || 0), 0);

      const effectiveChallenges = getEffectiveChallengesPerPalette(currentPaletteId);
      let justMasteredPalette = false;
      if (!paletteProgress.mastered && paletteProgress.completedChallenges.size >= effectiveChallenges) {
        paletteProgress.mastered = true;
        justMasteredPalette = !oldPaletteProgress.mastered;

        if (currentPaletteId === PaletteId.Warm && !updatedUserProgress[PaletteId.Cool].unlocked) {
          updatedUserProgress[PaletteId.Cool] = { ...updatedUserProgress[PaletteId.Cool], unlocked: true };
        } else if (currentPaletteId === PaletteId.Cool && !updatedUserProgress[PaletteId.Neutral].unlocked) {
          updatedUserProgress[PaletteId.Neutral] = { ...updatedUserProgress[PaletteId.Neutral], unlocked: true };
        }
      }
      updatedUserProgress[currentPaletteId] = paletteProgress;

      let funFactToDisplay: FunFact | null = null;
      if (justMasteredPalette) {
        const scienceFacts = FUN_FACTS.filter(f => f.category === FunFactCategory.LightScience);
        if (scienceFacts.length > 0) {
          funFactToDisplay = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
        }
      }
      if (!funFactToDisplay) {
        funFactToDisplay = FUN_FACTS.find(f => f.relatedColorIds?.includes(result.id)) || FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
      }

      return {
        ...state,
        mixedResultColor: result,
        showSuccessSplash: true,
        funFactToShow: funFactToDisplay,
        userProgress: updatedUserProgress,
        isAnswerRevealed: false,
        revealedAnswerInfo: null,
        avatarReaction: 'happy',
        showDelayedFunFactModal: false,
        soundToPlayEffect: 'correct',
        showErrorFlash: false,
        hapticPatternToPlay: HAPTIC_SUCCESS_PATTERN,
      };
    }
    case 'MIX_FAILURE':
      return {
        ...state,
        attemptsLeft: state.attemptsLeft - 1,
        showFailureShake: true,
        mixedResultColor: action.payload.mixedColorResult || null,
        avatarReaction: 'sad',
        soundToPlayEffect: 'incorrect',
        showErrorFlash: true,
        hapticPatternToPlay: HAPTIC_FAILURE_PATTERN,
      };
    case 'RESET_ATTEMPT_ANIMATION':
      return { ...state, showFailureShake: false };
    case 'SHOW_FUN_FACT_MODAL_NOW':
        return { ...state, showDelayedFunFactModal: true };
    case 'CLOSE_FUN_FACT_MODAL':
      return { ...state, funFactToShow: null, showSuccessSplash: false, showDelayedFunFactModal: false };
    case 'TOGGLE_TTS':
      return { ...state, isTTSOn: !state.isTTSOn };
    case 'SET_MIXED_RESULT_COLOR':
        return { ...state, mixedResultColor: action.payload };
    case 'REVEAL_ANSWER': {
      if (!state.currentChallenge) return state;
      
      const { targetColor, inputColors } = action.payload;
      const currentPaletteId = state.currentPaletteId;
      const targetColorId = state.currentChallenge.targetColorId;

      const updatedUserProgress = { ...state.userProgress };
      const paletteProgress = { ...updatedUserProgress[currentPaletteId] };
      paletteProgress.completedChallenges = new Set(paletteProgress.completedChallenges).add(targetColorId);
      paletteProgress.starsPerChallenge = { ...paletteProgress.starsPerChallenge, [targetColorId]: 0 as Stars };
      paletteProgress.totalStars = Object.values(paletteProgress.starsPerChallenge).reduce((sum, s) => sum + (s || 0), 0);

      const effectiveChallenges = getEffectiveChallengesPerPalette(currentPaletteId);
      if (!paletteProgress.mastered && paletteProgress.completedChallenges.size >= effectiveChallenges) {
        paletteProgress.mastered = true;
        if (currentPaletteId === PaletteId.Warm && !updatedUserProgress[PaletteId.Cool].unlocked) {
          updatedUserProgress[PaletteId.Cool] = { ...updatedUserProgress[PaletteId.Cool], unlocked: true };
        } else if (currentPaletteId === PaletteId.Cool && !updatedUserProgress[PaletteId.Neutral].unlocked) {
          updatedUserProgress[PaletteId.Neutral] = { ...updatedUserProgress[PaletteId.Neutral], unlocked: true };
        }
      }
      updatedUserProgress[currentPaletteId] = paletteProgress;

      return {
          ...state,
          isAnswerRevealed: true,
          revealedAnswerInfo: {
              target: targetColor,
              inputs: inputColors
          },
          mixedResultColor: targetColor,
          attemptsLeft: 0,
          userProgress: updatedUserProgress,
          avatarReaction: 'sad',
          soundToPlayEffect: 'incorrect', 
          showErrorFlash: true,
          hapticPatternToPlay: HAPTIC_FAILURE_PATTERN,
      };
    }
    case 'CLOSE_REVEAL_MODAL':
        return { ...state, revealedAnswerInfo: null };
    case 'SELECT_AVATAR':
        return { ...state, selectedAvatarId: action.payload, showAvatarSelectionModal: false };
    case 'TOGGLE_AVATAR_MODAL':
        return { ...state, showAvatarSelectionModal: !state.showAvatarSelectionModal };
    case 'RESET_AVATAR_REACTION':
        return { ...state, avatarReaction: null };
    case 'TOGGLE_SOUND_EFFECTS':
        return { ...state, isSoundEffectsOn: !state.isSoundEffectsOn };
    case 'TOGGLE_BACKGROUND_MUSIC':
        return { ...state, isBackgroundMusicOn: !state.isBackgroundMusicOn };
    case 'CLEAR_SOUND_EFFECT_TO_PLAY': 
        return { ...state, soundToPlayEffect: null };
    case 'HIDE_ERROR_FLASH':
        return { ...state, showErrorFlash: false };
    case 'TOGGLE_COLORBLIND_MODE':
        return { ...state, isColorblindModeOn: !state.isColorblindModeOn };
    case 'TOGGLE_HAPTIC_FEEDBACK':
        return { ...state, isHapticFeedbackOn: !state.isHapticFeedbackOn };
    case 'CLEAR_HAPTIC_PATTERN':
        return { ...state, hapticPatternToPlay: null };
    
    // Mini-Game Actions
    case 'SET_ACTIVE_MINI_GAME': {
        const miniGameType = action.payload as MiniGameType | null;
        let newState = { ...state, activeMiniGame: miniGameType, avatarReaction: null };
        
        // Clear main game state if activating a mini-game OR if deactivating all mini-games (payload is null)
        // This means main game state is cleared whenever we are not strictly in the main game.
        if (miniGameType || state.activeMiniGame ) { 
            newState = { 
                ...newState, 
                currentChallenge: null, 
                selectedMixColors: [], 
                mixedResultColor: null, 
                isAnswerRevealed: false, 
                revealedAnswerInfo: null, 
                showSuccessSplash: false, 
                showFailureShake: false,
                funFactToShow: null 
            };
        }

        // Reset ColorMatch specific state if the new active game is NOT ColorMatch
        if (miniGameType !== 'ColorMatch') {
            newState = {
                ...newState,
                colorMatchSessionChallenges: [],
                currentColorMatchChallengeIndex: null,
                currentColorMatchChallenge: null,
                colorMatchSelectedAnswerId: null,
                colorMatchScore: 0,
                colorMatchAttemptsLeft: MAX_COLOR_MATCH_ATTEMPTS,
                showColorMatchSuccess: false,
                showColorMatchFailure: false,
                colorMatchSessionEnded: false,
            };
        }

        // Reset RainbowSequence specific state if the new active game is NOT RainbowSequence
        if (miniGameType !== 'RainbowSequence') {
            newState = {
                ...newState,
                rainbowSequenceSessionChallenges: [],
                currentRainbowSequenceChallengeIndex: null,
                currentRainbowSequenceChallenge: null,
                playerRainbowSequence: [],
                rainbowSequenceScore: 0,
                rainbowSequenceAttemptsLeft: MAX_RAINBOW_SEQUENCE_ATTEMPTS,
                showRainbowSequenceSuccess: false,
                showRainbowSequenceFailure: false,
                rainbowSequenceSessionEnded: false,
            };
        }
        
        return newState;
    }
    // Color Match Mini-Game Actions
    case 'START_COLOR_MATCH_GAME': {
        const shuffledAllChallenges = [...state.colorMatchChallenges].sort(() => 0.5 - Math.random());
        const sessionChallenges = shuffledAllChallenges.slice(0, COLOR_MATCH_CHALLENGES_PER_SESSION);
        
        if (sessionChallenges.length === 0) {
            console.warn("Color Match: No challenges available to start game.");
            return { ...state, activeMiniGame: null }; 
        }
        return {
            ...state,
            activeMiniGame: 'ColorMatch', // Ensure this is set
            colorMatchSessionChallenges: sessionChallenges,
            currentColorMatchChallengeIndex: 0,
            currentColorMatchChallenge: sessionChallenges[0],
            colorMatchScore: 0,
            colorMatchAttemptsLeft: MAX_COLOR_MATCH_ATTEMPTS,
            colorMatchSelectedAnswerId: null,
            showColorMatchSuccess: false,
            showColorMatchFailure: false,
            colorMatchSessionEnded: false,
            avatarReaction: null, 
        };
    }
    case 'SELECT_COLOR_MATCH_ANSWER':
        if (state.showColorMatchSuccess) return state; 
        return { 
            ...state, 
            colorMatchSelectedAnswerId: action.payload,
            showColorMatchSuccess: false, 
            showColorMatchFailure: false, 
        };
    case 'SUBMIT_COLOR_MATCH_ANSWER': {
        if (!state.currentColorMatchChallenge || state.colorMatchSelectedAnswerId === null || state.showColorMatchSuccess || state.showColorMatchFailure) return state;
        
        const isCorrect = state.currentColorMatchChallenge.correctColorId === state.colorMatchSelectedAnswerId;
        if (isCorrect) {
            return {
                ...state,
                colorMatchScore: state.colorMatchScore + 1,
                showColorMatchSuccess: true,
                showColorMatchFailure: false,
                avatarReaction: 'happy',
                soundToPlayEffect: 'correct',
                hapticPatternToPlay: HAPTIC_SUCCESS_PATTERN,
            };
        } else {
            const attemptsLeft = state.colorMatchAttemptsLeft - 1;
            return {
                ...state,
                colorMatchAttemptsLeft: attemptsLeft,
                showColorMatchSuccess: false,
                showColorMatchFailure: true,
                avatarReaction: 'sad',
                soundToPlayEffect: 'incorrect',
                hapticPatternToPlay: HAPTIC_FAILURE_PATTERN,
            };
        }
    }
    case 'NEXT_COLOR_MATCH_CHALLENGE': {
        const nextIndex = (state.currentColorMatchChallengeIndex ?? -1) + 1;
        if (state.colorMatchSessionChallenges && nextIndex < state.colorMatchSessionChallenges.length) {
            return {
                ...state,
                currentColorMatchChallengeIndex: nextIndex,
                currentColorMatchChallenge: state.colorMatchSessionChallenges[nextIndex],
                colorMatchSelectedAnswerId: null,
                colorMatchAttemptsLeft: MAX_COLOR_MATCH_ATTEMPTS,
                showColorMatchSuccess: false,
                showColorMatchFailure: false,
                avatarReaction: null,
            };
        }
        return { 
            ...state, 
            currentColorMatchChallenge: null, 
            colorMatchSessionEnded: true, 
            avatarReaction: null,
        }; 
    }
    case 'END_COLOR_MATCH_GAME': 
      return { 
          ...state, 
          activeMiniGame: null, 
          // Full reset handled by SET_ACTIVE_MINI_GAME with null payload typically
          colorMatchSessionChallenges: [],
          currentColorMatchChallengeIndex: null, 
          currentColorMatchChallenge: null, 
          colorMatchSelectedAnswerId: null, 
          colorMatchScore: 0, 
          colorMatchAttemptsLeft: MAX_COLOR_MATCH_ATTEMPTS,
          showColorMatchSuccess: false,
          showColorMatchFailure: false,
          colorMatchSessionEnded: false,
          avatarReaction: null,
        };
    
    // Rainbow Sequence Mini-Game Actions
    case 'START_RAINBOW_SEQUENCE_GAME': {
        const shuffledAllChallenges = [...state.rainbowSequenceChallenges].sort(() => 0.5 - Math.random());
        const sessionChallenges = shuffledAllChallenges.slice(0, RAINBOW_SEQUENCE_CHALLENGES_PER_SESSION);

        if (sessionChallenges.length === 0) {
            console.warn("Rainbow Sequence: No challenges available to start game.");
            return { ...state, activeMiniGame: null };
        }
        return {
            ...state,
            activeMiniGame: 'RainbowSequence', // Ensure this is set
            rainbowSequenceSessionChallenges: sessionChallenges,
            currentRainbowSequenceChallengeIndex: 0,
            currentRainbowSequenceChallenge: sessionChallenges[0],
            playerRainbowSequence: [],
            rainbowSequenceScore: 0,
            rainbowSequenceAttemptsLeft: MAX_RAINBOW_SEQUENCE_ATTEMPTS,
            showRainbowSequenceSuccess: false,
            showRainbowSequenceFailure: false,
            rainbowSequenceSessionEnded: false,
            avatarReaction: null,
        };
    }
    case 'TAP_RAINBOW_SEQUENCE_COLOR': {
        if (!state.currentRainbowSequenceChallenge || state.showRainbowSequenceSuccess || state.showRainbowSequenceFailure) {
            return state; // Don't process tap if game is in a final state for the current attempt or challenge
        }

        const tappedColorId = action.payload as ColorId;
        const newPlayerSequence = [...state.playerRainbowSequence, tappedColorId];
        const correctChallengeSequence = state.currentRainbowSequenceChallenge.correctSequence;

        let isCurrentlyCorrect = true;
        for (let i = 0; i < newPlayerSequence.length; i++) {
            if (i >= correctChallengeSequence.length || newPlayerSequence[i] !== correctChallengeSequence[i]) {
                isCurrentlyCorrect = false;
                break;
            }
        }

        if (isCurrentlyCorrect) {
            if (newPlayerSequence.length === correctChallengeSequence.length) {
                // Sequence complete and correct
                return {
                    ...state,
                    playerRainbowSequence: newPlayerSequence,
                    rainbowSequenceScore: state.rainbowSequenceScore + 1,
                    showRainbowSequenceSuccess: true,
                    showRainbowSequenceFailure: false,
                    avatarReaction: 'happy',
                    soundToPlayEffect: 'correct',
                    hapticPatternToPlay: HAPTIC_SUCCESS_PATTERN,
                };
            } else {
                // Sequence correct so far, but not yet complete
                return {
                    ...state,
                    playerRainbowSequence: newPlayerSequence,
                    // Ensure feedback flags are clear if they were somehow set
                    showRainbowSequenceSuccess: false, 
                    showRainbowSequenceFailure: false,
                };
            }
        } else {
            // Incorrect tap in the sequence
            const attemptsLeft = state.rainbowSequenceAttemptsLeft - 1;
            return {
                ...state,
                playerRainbowSequence: newPlayerSequence, // Show the incorrect sequence entered by player
                rainbowSequenceAttemptsLeft: attemptsLeft,
                showRainbowSequenceSuccess: false,
                showRainbowSequenceFailure: true,
                avatarReaction: 'sad',
                soundToPlayEffect: 'incorrect',
                hapticPatternToPlay: HAPTIC_FAILURE_PATTERN,
            };
        }
    }
    case 'RESET_RAINBOW_SEQUENCE_ATTEMPT': {
        if (!state.currentRainbowSequenceChallenge || state.showRainbowSequenceSuccess || state.rainbowSequenceAttemptsLeft < MAX_RAINBOW_SEQUENCE_ATTEMPTS) {
             // Only allow reset if an attempt was made (attemptsLeft < max) and not already succeeded.
             // If attemptsLeft is 0, this action shouldn't be available (Next Challenge should be).
            if (state.rainbowSequenceAttemptsLeft <= 0 && state.showRainbowSequenceFailure) {
                 // If out of attempts and failed, don't reset; user should proceed to next challenge.
                return state;
            }
        }
        return {
            ...state,
            playerRainbowSequence: [],
            showRainbowSequenceFailure: false, // Clear failure flag
            avatarReaction: null, 
            soundToPlayEffect: null, 
            hapticPatternToPlay: null,
        };
    }
    case 'NEXT_RAINBOW_SEQUENCE_CHALLENGE': {
        const nextIndex = (state.currentRainbowSequenceChallengeIndex ?? -1) + 1;
        if (state.rainbowSequenceSessionChallenges && nextIndex < state.rainbowSequenceSessionChallenges.length) {
            return {
                ...state,
                currentRainbowSequenceChallengeIndex: nextIndex,
                currentRainbowSequenceChallenge: state.rainbowSequenceSessionChallenges[nextIndex],
                playerRainbowSequence: [],
                rainbowSequenceAttemptsLeft: MAX_RAINBOW_SEQUENCE_ATTEMPTS, // Reset attempts for new challenge
                showRainbowSequenceSuccess: false,
                showRainbowSequenceFailure: false,
                avatarReaction: null,
                soundToPlayEffect: null,
                hapticPatternToPlay: null,
            };
        }
        // No more challenges in this session
        return { 
            ...state, 
            currentRainbowSequenceChallenge: null, // Mark no active challenge
            currentRainbowSequenceChallengeIndex: null,
            rainbowSequenceSessionEnded: true, 
            avatarReaction: null,
            showRainbowSequenceSuccess: false,
            showRainbowSequenceFailure: false,
            playerRainbowSequence: [],
        };
    }
    case 'END_RAINBOW_SEQUENCE_GAME':
        return {
            ...state,
            activeMiniGame: null, // Full reset handled by SET_ACTIVE_MINI_GAME with null payload typically
            rainbowSequenceSessionChallenges: [],
            currentRainbowSequenceChallengeIndex: null,
            currentRainbowSequenceChallenge: null,
            playerRainbowSequence: [],
            rainbowSequenceScore: 0,
            rainbowSequenceAttemptsLeft: MAX_RAINBOW_SEQUENCE_ATTEMPTS,
            showRainbowSequenceSuccess: false,
            showRainbowSequenceFailure: false,
            rainbowSequenceSessionEnded: false,
            avatarReaction: null,
            soundToPlayEffect: null,
            hapticPatternToPlay: null,
        };

    default:
      return state;
  }
}

const initializeAppState = (initialStateFromConstants: AppState): AppState => {
  const initialUserProgressCopy: UserProgressData = JSON.parse(JSON.stringify(initialStateFromConstants.userProgress));
  for (const paletteIdStr in initialUserProgressCopy) {
    const paletteId = paletteIdStr as PaletteId;
    if (initialUserProgressCopy[paletteId]) {
        initialUserProgressCopy[paletteId].completedChallenges = new Set(Array.from(initialUserProgressCopy[paletteId].completedChallenges));
    }
  }

  let resolvedInitialPaletteId = initialStateFromConstants.currentPaletteId; 
  if (!initialUserProgressCopy[resolvedInitialPaletteId]?.unlocked) {
    if (initialUserProgressCopy[PaletteId.Warm]?.unlocked) {
      resolvedInitialPaletteId = PaletteId.Warm;
    } else {
      const firstUnlockedPalette = Object.values(PaletteId).find(pId => initialUserProgressCopy[pId]?.unlocked);
      if (firstUnlockedPalette) {
        resolvedInitialPaletteId = firstUnlockedPalette;
      } else {
        resolvedInitialPaletteId = PaletteId.Warm;
         console.error("Critical: No palettes are marked as unlocked in INITIAL_USER_PROGRESS_DATA. Defaulting to Warm palette. Please check constants.");
      }
    }
  }
   if (!initialUserProgressCopy[resolvedInitialPaletteId]?.unlocked) {
      const firstTrulyUnlocked = Object.values(PaletteId).find(pId => initialUserProgressCopy[pId]?.unlocked);
      if (firstTrulyUnlocked) {
          resolvedInitialPaletteId = firstTrulyUnlocked;
      }
   }

  return {
    ...initialStateFromConstants,
    userProgress: initialUserProgressCopy,
    currentPaletteId: resolvedInitialPaletteId,
    soundToPlayEffect: null, 
    hapticPatternToPlay: null, 
    showErrorFlash: false,
    colorMatchChallenges: [...COLOR_MATCH_CHALLENGES_DATA], 
    colorMatchSessionChallenges: [],
    rainbowSequenceChallenges: [...RAINBOW_SEQUENCE_CHALLENGES_DATA], 
    rainbowSequenceSessionChallenges: [], 
  };
};

let bgMusicCanPlayThroughListener: (() => void) | null = null;
let bgMusicErrorListener: ((e: Event) => void) | null = null;
let bgMusicStalledListener: (() => void) | null = null;
let bgMusicSuspendListener: (() => void) | null = null;

const MainApplication: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_APP_STATE, initializeAppState);
  const { speak, cancelSpeech } = useSpeech();
  
  const backgroundMusicAudioRef = useRef<HTMLAudioElement | null>(null); 
  const sfxCorrectRef = useRef<HTMLAudioElement | null>(null);
  const sfxIncorrectRef = useRef<HTMLAudioElement | null>(null);

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string>) => {
    let translation = UI_TEXTS[state.language][key] || UI_TEXTS[Language.EN][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
    }
    return translation;
  }, [state.language]);


  useEffect(() => {
    sfxCorrectRef.current = new Audio(SOUND_EFFECT_CORRECT);
    sfxCorrectRef.current.preload = 'auto';
    sfxIncorrectRef.current = new Audio(SOUND_EFFECT_INCORRECT);
    sfxIncorrectRef.current.preload = 'auto';

    const sfxCorrectAudio = sfxCorrectRef.current;
    const sfxIncorrectAudio = sfxIncorrectRef.current;

    if (sfxCorrectAudio) {
        sfxCorrectAudio.oncanplaythrough = () => console.log('[SFX] Correct sound preloaded and ready.');
    }
    if (sfxIncorrectAudio) {
        sfxIncorrectAudio.oncanplaythrough = () => console.log('[SFX] Incorrect sound preloaded and ready.');
    }
    
    const sfxErrorLogger = (type: string) => (e: Event) => {
        console.error(`[SFX] Error preloading/loading ${type} sound. Event:`, e);
        const audioEl = e.target as HTMLAudioElement;
        if (audioEl && audioEl.error) {
            console.error(`[SFX] ${type} sound error details: Code - ${audioEl.error.code}, Message - ${audioEl.error.message}`);
        }
    };
    
    if (sfxCorrectAudio) {
        sfxCorrectAudio.onerror = sfxErrorLogger('correct');
    }
    if (sfxIncorrectAudio) {
        sfxIncorrectAudio.onerror = sfxErrorLogger('incorrect');
    }

  }, []);
  
  useEffect(() => {
    console.log('[Music] Initializing background music audio element.');
    if (!backgroundMusicAudioRef.current) {
        backgroundMusicAudioRef.current = new Audio();
        backgroundMusicAudioRef.current.preload = 'auto'; 
        console.log('[Music] New Audio() element created and assigned to ref.');
    }
    
    const musicAudio = backgroundMusicAudioRef.current;
    if (!musicAudio) {
        console.error("[Music] CRITICAL: musicAudio is null after attempting to initialize ref in init effect.");
        return;
    }

    bgMusicCanPlayThroughListener = () => {
        if (musicAudio) console.log(`[Music] Event 'canplaythrough' fired for ${musicAudio.src}. ReadyState: ${musicAudio.readyState}`);
    };
    bgMusicErrorListener = (e: Event) => {
        if(musicAudio) {
            console.error(`[Music] Error event on background music element. Current src: ${musicAudio.src}`);
            if (musicAudio.error) {
                console.error(`[Music] Error details: Code - ${musicAudio.error.code}, Message - ${musicAudio.error.message}`);
            } else {
                console.error(`[Music] Error event occurred, but musicAudio.error object is null. Event:`, e);
            }
        }
    };
    bgMusicStalledListener = () => {
      if(musicAudio) console.warn(`[Music] Event 'stalled' fired for ${musicAudio.src}. Browser may have stopped fetching media data.`);
    };
    bgMusicSuspendListener = () => {
      if(musicAudio) console.warn(`[Music] Event 'suspend' fired for ${musicAudio.src}. Media data loading suspended.`);
    };

    musicAudio.addEventListener('canplaythrough', bgMusicCanPlayThroughListener);
    musicAudio.addEventListener('error', bgMusicErrorListener);
    musicAudio.addEventListener('stalled', bgMusicStalledListener);
    musicAudio.addEventListener('suspend', bgMusicSuspendListener);

    return () => {
        console.log('[Music] Cleaning up background music audio element and listeners.');
        const audioToClean = backgroundMusicAudioRef.current; 
        if (audioToClean) {
            audioToClean.pause();
            if(bgMusicCanPlayThroughListener) audioToClean.removeEventListener('canplaythrough', bgMusicCanPlayThroughListener);
            if(bgMusicErrorListener) audioToClean.removeEventListener('error', bgMusicErrorListener);
            if(bgMusicStalledListener) audioToClean.removeEventListener('stalled', bgMusicStalledListener);
            if(bgMusicSuspendListener) audioToClean.removeEventListener('suspend', bgMusicSuspendListener);
            console.log('[Music] Audio element paused, listeners removed.');
        } else {
            console.log('[Music] No audio element in ref to clean up.');
        }
    };
  }, []); 


  const playPreloadedSfx = useCallback((type: 'correct' | 'incorrect') => {
    if (!state.isSoundEffectsOn) return;

    let audioToPlay: HTMLAudioElement | null = null;
    let soundUrlForLog = '';

    if (type === 'correct' && sfxCorrectRef.current) {
        audioToPlay = sfxCorrectRef.current;
        soundUrlForLog = SOUND_EFFECT_CORRECT;
    } else if (type === 'incorrect' && sfxIncorrectRef.current) {
        audioToPlay = sfxIncorrectRef.current;
        soundUrlForLog = SOUND_EFFECT_INCORRECT;
    }

    if (audioToPlay) {
        console.log(`[SFX] Attempting to play preloaded: ${type} from ${soundUrlForLog}`);
        audioToPlay.currentTime = 0; 
        audioToPlay.play()
            .then(() => {
                console.log(`[SFX] Preloaded playback initiated for: ${type}`);
            })
            .catch(error => {
                console.error(`[SFX] Error on preloaded audio.play() for ${type} (${soundUrlForLog}):`, error);
            });
    } else {
        console.warn(`[SFX] Preloaded audio element for type '${type}' not ready or not found.`);
    }
  }, [state.isSoundEffectsOn]);

  useEffect(() => {
    if (state.soundToPlayEffect) {
        playPreloadedSfx(state.soundToPlayEffect);
        dispatch({ type: 'CLEAR_SOUND_EFFECT_TO_PLAY' });
    }
  }, [state.soundToPlayEffect, playPreloadedSfx, dispatch]);

  useEffect(() => {
    if (state.hapticPatternToPlay) {
      if (state.isHapticFeedbackOn && navigator.vibrate) {
        try {
          navigator.vibrate(state.hapticPatternToPlay);
        } catch (e) {
          console.error('Error triggering haptic feedback:', e);
        }
      } else if (state.isHapticFeedbackOn && !navigator.vibrate) {
        console.warn('Haptic feedback is ON but navigator.vibrate is not supported.');
      }
      dispatch({ type: 'CLEAR_HAPTIC_PATTERN' });
    }
  }, [state.hapticPatternToPlay, state.isHapticFeedbackOn, dispatch]);


  const handlePlaySoundTTS = useCallback((text: string, lang: Language) => {
    if(state.isTTSOn) speak(text, lang);
  }, [state.isTTSOn, speak]);

  const generateNewChallenge = useCallback((paletteIdToFocus: PaletteId, isAutoAdvance: boolean = false) => {
    let currentPaletteId = paletteIdToFocus;
    let paletteProgress = state.userProgress[currentPaletteId];

    if (paletteProgress?.mastered && isAutoAdvance) {
        const paletteIdsOrder = [PaletteId.Warm, PaletteId.Cool, PaletteId.Neutral];
        const currentPaletteIndex = paletteIdsOrder.indexOf(currentPaletteId);
        for (let i = currentPaletteIndex + 1; i < paletteIdsOrder.length; i++) {
            const nextPId = paletteIdsOrder[i];
            if (state.userProgress[nextPId]?.unlocked && !state.userProgress[nextPId]?.mastered) {
                dispatch({ type: 'SET_PALETTE', payload: nextPId });
                return;
            }
        }
        const allTrulyMastered = Object.values(PaletteId).every(pId => {
            const pInfo = PALETTES[pId];
            const pProg = state.userProgress[pId];
            if (!pInfo || !pProg) return false;
            if (pInfo.challengeColorIds.length === 0) return true;
            return pProg.unlocked && pProg.mastered;
        });
        if (allTrulyMastered) {
            dispatch({ type: 'SET_CHALLENGE', payload: null });
            return;
        }
    }

    if (!paletteProgress || !paletteProgress.unlocked) {
        const firstUnlockedNotMastered = Object.values(PaletteId).find(pId => state.userProgress[pId]?.unlocked && !state.userProgress[pId]?.mastered);
        if (firstUnlockedNotMastered) {
            dispatch({ type: 'SET_PALETTE', payload: firstUnlockedNotMastered });
        } else { 
            dispatch({ type: 'SET_CHALLENGE', payload: null });
        }
        return;
    }

    const paletteInfo = PALETTES[currentPaletteId];

    if (paletteProgress.mastered && !isAutoAdvance) { 
        dispatch({ type: 'SET_CHALLENGE', payload: null });
        return;
    }

    if (paletteProgress.mastered && isAutoAdvance) { 
        dispatch({ type: 'SET_CHALLENGE', payload: null }); 
        return;
    }

    const availableChallengeColors = paletteInfo.challengeColorIds.filter(cid => !paletteProgress.completedChallenges.has(cid));

    if (availableChallengeColors.length === 0) {
        dispatch({ type: 'SET_CHALLENGE', payload: null });
        return;
    }

    const randomTargetColorId = availableChallengeColors[Math.floor(Math.random() * availableChallengeColors.length)];
    dispatch({ type: 'SET_CHALLENGE', payload: { targetColorId: randomTargetColorId, paletteId: currentPaletteId } });

    const targetColorDef = COLORS[randomTargetColorId];
    if (targetColorDef) {
        handlePlaySoundTTS(targetColorDef.name[state.language], state.language);
    }

  }, [state.userProgress, state.language, handlePlaySoundTTS, dispatch]);


  useEffect(() => {
    if (state.activeMiniGame) return; 

    if (state.isAnswerRevealed || state.revealedAnswerInfo || state.funFactToShow || state.showAvatarSelectionModal) {
      return; 
    }

    if (!state.currentChallenge || state.currentChallenge.paletteId !== state.currentPaletteId) {
        const currentPaletteProgress = state.userProgress[state.currentPaletteId];

        if (currentPaletteProgress && currentPaletteProgress.unlocked) {
            generateNewChallenge(state.currentPaletteId, false);
        } else if (!currentPaletteProgress || !currentPaletteProgress.unlocked) {
            const firstUnlocked = Object.values(PaletteId).find(pId => state.userProgress[pId]?.unlocked && !state.userProgress[pId]?.mastered)
                                  || Object.values(PaletteId).find(pId => state.userProgress[pId]?.unlocked); 
            if (firstUnlocked) {
                 dispatch({ type: 'SET_PALETTE', payload: firstUnlocked });
            } else {
                console.error("No unlocked palettes found, cannot generate challenge.");
                dispatch({type: 'SET_CHALLENGE', payload: null});
            }
        }
    }
  }, [state.currentPaletteId, state.currentChallenge, state.isAnswerRevealed, state.revealedAnswerInfo, state.funFactToShow, state.showAvatarSelectionModal, generateNewChallenge, state.userProgress, dispatch, state.activeMiniGame]);


  useEffect(() => {
    document.documentElement.lang = state.language;
    document.documentElement.dir = LANGUAGES[state.language].dir;
  }, [state.language]);

  useEffect(() => {
    if (state.revealedAnswerInfo && state.isTTSOn) {
      const { target, inputs } = state.revealedAnswerInfo;
      let soundText = `${t('theCorrectAnswerIs')} `;
      if (inputs) {
        soundText += `${inputs[0].name[state.language]} ${t('and')} ${inputs[1].name[state.language]} ${t('make')} ${target.name[state.language]}`;
      } else {
        soundText += target.name[state.language];
        if (FUNDAMENTAL_COLOR_IDS.includes(target.id)) {
            soundText += `. ${t('isAFundamentalColorMessage').replace('{COLOR_NAME}', target.name[state.language])}`;
        }
      }
      handlePlaySoundTTS(soundText, state.language);
    }
  }, [state.revealedAnswerInfo, state.isTTSOn, state.language, handlePlaySoundTTS, t]);

  useEffect(() => {
    if (state.avatarReaction) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_AVATAR_REACTION' });
      }, state.avatarReaction === 'happy' ? 600 : 500); 
      return () => clearTimeout(timer);
    }
  }, [state.avatarReaction, dispatch]);

  useEffect(() => {
    if (state.showSuccessSplash && state.funFactToShow && !state.showDelayedFunFactModal) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SHOW_FUN_FACT_MODAL_NOW' });
      }, 2100); 
      return () => clearTimeout(timer);
    }
  }, [state.showSuccessSplash, state.funFactToShow, state.showDelayedFunFactModal, dispatch]);

  useEffect(() => {
    if (state.showErrorFlash) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_ERROR_FLASH' });
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [state.showErrorFlash, dispatch]);

  useEffect(() => {
    const musicAudio = backgroundMusicAudioRef.current;
    if (!musicAudio) {
      console.warn("[Music] Background music audio element ref is null in toggle effect.");
      return;
    }

    if (state.isBackgroundMusicOn) {
      console.log(`[Music] Attempting to play. Target URL: ${BACKGROUND_MUSIC_URL}. Current audio src: ${musicAudio.currentSrc}`);
      musicAudio.loop = true;
      musicAudio.volume = 0.15;

      let playAttempted = false;

      if (musicAudio.currentSrc !== BACKGROUND_MUSIC_URL) {
        console.log(`[Music] src is different or not set. Setting src to ${BACKGROUND_MUSIC_URL} and calling load().`);
        musicAudio.src = BACKGROUND_MUSIC_URL;
        musicAudio.load(); 
      }
      
      const playPromise = musicAudio.play();
      playAttempted = true;

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`[Music] Playback successfully initiated or resumed for: ${musicAudio.currentSrc}`);
          })
          .catch((error) => {
            console.error(`[Music] Error on initial play() for ${musicAudio.currentSrc}. Error:`, error);
            console.error(`[Music] Audio Element State:`, {
              error: musicAudio.error,
              readyState: musicAudio.readyState,
              networkState: musicAudio.networkState,
              paused: musicAudio.paused,
              currentSrc: musicAudio.currentSrc,
            });
            if (musicAudio.currentSrc === BACKGROUND_MUSIC_URL && musicAudio.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
                const handleCanPlayThroughAndRetry = () => {
                    console.log(`[Music] 'canplaythrough' event received for ${musicAudio.currentSrc}. Retrying play.`);
                    musicAudio.play().catch(e => console.error("[Music] Error on retry play in canplaythrough:", e, "State:", musicAudio.error));
                    musicAudio.removeEventListener('canplaythrough', handleCanPlayThroughAndRetry);
                };
                musicAudio.addEventListener('canplaythrough', handleCanPlayThroughAndRetry);
                console.log(`[Music] Added one-time 'canplaythrough' listener to retry play.`);
            }
          });
      } else {
        console.warn(`[Music] musicAudio.play() returned undefined.`);
      }
      
      if(!playAttempted && musicAudio.paused && musicAudio.currentSrc === BACKGROUND_MUSIC_URL) {
         console.log(`[Music] Src is correct, music is paused, play was not attempted in this cycle. Trying play now.`);
         musicAudio.play().catch(e => console.error("[Music] Error on deferred play attempt:", e));
      }

    } else { 
      if (musicAudio && !musicAudio.paused) {
        console.log("[Music] Background music toggled OFF. Pausing music.");
        musicAudio.pause();
      }
    }
  }, [state.isBackgroundMusicOn]);


  const handleLanguageChange = useCallback((lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    if (state.currentChallenge) {
        const targetColorDef = COLORS[state.currentChallenge.targetColorId];
        if (targetColorDef) {
            handlePlaySoundTTS(targetColorDef.name[lang], lang);
        }
    }
  }, [dispatch, state.currentChallenge, handlePlaySoundTTS]); 

  const handlePaletteChange = useCallback((paletteId: PaletteId) => {
    dispatch({ type: 'SET_PALETTE', payload: paletteId });
  }, [dispatch]);

  const handleColorSelect = useCallback((colorDef: ColorDefinition) => {
    if (state.showSuccessSplash || state.isAnswerRevealed || state.revealedAnswerInfo) return;

    const currentTargetId = state.currentChallenge?.targetColorId;
    const isFundamentalTarget = currentTargetId && FUNDAMENTAL_COLOR_IDS.includes(currentTargetId);

    if (isFundamentalTarget) {
        if (state.selectedMixColors.length === 1 && state.selectedMixColors[0].id !== colorDef.id) {
            dispatch({ type: 'RESET_SELECTION'}); 
            dispatch({ type: 'SELECT_COLOR', payload: colorDef });
        } else if (state.selectedMixColors.length === 0) {
            dispatch({ type: 'SELECT_COLOR', payload: colorDef });
        }
    } else { 
        if (state.selectedMixColors.length < 2 && !state.selectedMixColors.find(c => c.id === colorDef.id)) {
            dispatch({ type: 'SELECT_COLOR', payload: colorDef });
        }
    }
    handlePlaySoundTTS(colorDef.name[state.language], state.language);
  }, [state.showSuccessSplash, state.isAnswerRevealed, state.revealedAnswerInfo, state.currentChallenge, state.selectedMixColors, state.language, dispatch, handlePlaySoundTTS]);

  const handleResetSelection = useCallback(() => {
    if (state.showSuccessSplash || state.revealedAnswerInfo) return; 
    dispatch({ type: 'RESET_SELECTION' });
  }, [state.showSuccessSplash, state.revealedAnswerInfo, dispatch]);

  const handleMixAttempt = useCallback(() => {
    if (!state.currentChallenge || state.isAnswerRevealed || state.revealedAnswerInfo || state.attemptsLeft === 0 || state.showSuccessSplash) return;

    const targetColorId = state.currentChallenge.targetColorId;
    const isFundamentalTarget = FUNDAMENTAL_COLOR_IDS.includes(targetColorId);

    if (isFundamentalTarget) {
      if (state.selectedMixColors.length === 1) {
        const selectedColor = state.selectedMixColors[0];
        if (selectedColor.id === targetColorId) {
          dispatch({ type: 'MIX_SUCCESS', payload: { result: selectedColor } });
          handlePlaySoundTTS(`${t('correct')} ${selectedColor.name[state.language]}`, state.language);
        } else {
          dispatch({ type: 'MIX_FAILURE', payload: { mixedColorResult: selectedColor } });
          handlePlaySoundTTS(t('tryAgain'), state.language);
          setTimeout(() => dispatch({ type: 'RESET_ATTEMPT_ANIMATION' }), 500);
        }
      } else { 
        let attemptedMixResult: ColorDefinition | null = null;
        if (state.selectedMixColors.length === 2) { 
            const [color1Id, color2Id] = state.selectedMixColors.map(c => c.id).sort();
            const rule = MIXING_RULES.find(r => r.input[0] === color1Id && r.input[1] === color2Id);
            if (rule?.output) attemptedMixResult = COLORS[rule.output];
        } else if (state.selectedMixColors.length === 1) { 
            attemptedMixResult = state.selectedMixColors[0];
        }
        dispatch({ type: 'MIX_FAILURE', payload: { mixedColorResult: attemptedMixResult } });
        handlePlaySoundTTS(t('tryAgain'), state.language);
        setTimeout(() => dispatch({ type: 'RESET_ATTEMPT_ANIMATION' }), 500);
      }
    } else { 
      if (state.selectedMixColors.length !== 2) {
        dispatch({ type: 'MIX_FAILURE', payload: { mixedColorResult: null } }); 
        handlePlaySoundTTS(t('tryAgain'), state.language);
        setTimeout(() => dispatch({ type: 'RESET_ATTEMPT_ANIMATION' }), 500);
        return;
      }

      const [color1Id, color2Id] = state.selectedMixColors.map(c => c.id).sort();
      const rule = MIXING_RULES.find(r => r.input[0] === color1Id && r.input[1] === color2Id);
      let mixedColorResultDef: ColorDefinition | null = null;
      if (rule && rule.output) {
        mixedColorResultDef = COLORS[rule.output];
      }

      if (mixedColorResultDef && mixedColorResultDef.id === targetColorId) {
        dispatch({ type: 'MIX_SUCCESS', payload: { result: mixedColorResultDef } });
        handlePlaySoundTTS(`${t('correct')} ${mixedColorResultDef.name[state.language]}`, state.language);
      } else {
        dispatch({ type: 'MIX_FAILURE', payload: { mixedColorResult: mixedColorResultDef } });
        handlePlaySoundTTS(t('tryAgain'), state.language);
        setTimeout(() => dispatch({ type: 'RESET_ATTEMPT_ANIMATION' }), 500);
      }
    }
  }, [state.currentChallenge, state.isAnswerRevealed, state.revealedAnswerInfo, state.attemptsLeft, state.showSuccessSplash, state.selectedMixColors, state.language, dispatch, t, handlePlaySoundTTS]);

  const handleCloseFunFactModal = useCallback(() => {
    dispatch({ type: 'CLOSE_FUN_FACT_MODAL' });
    generateNewChallenge(state.currentPaletteId, true); 
  }, [dispatch, generateNewChallenge, state.currentPaletteId]);

  const handleProceedToNextChallengeAfterReveal = useCallback(() => {
    dispatch({ type: 'CLOSE_REVEAL_MODAL' });
    generateNewChallenge(state.currentPaletteId, true); 
  }, [dispatch, generateNewChallenge, state.currentPaletteId]);

  const handleRevealOrNextChallenge = useCallback(() => {
    if (state.isAnswerRevealed && state.revealedAnswerInfo) { 
         handleProceedToNextChallengeAfterReveal();
    } else if (state.currentChallenge && state.attemptsLeft === 0 && !state.showSuccessSplash) { 
        const targetColorDef = COLORS[state.currentChallenge.targetColorId];
        if (!targetColorDef) {
            console.error("Reveal Answer Error: Could not find target color definition for ID:", state.currentChallenge.targetColorId);
            return;
        }

        let inputColorDefs: [ColorDefinition, ColorDefinition] | null = null;
        if (!FUNDAMENTAL_COLOR_IDS.includes(targetColorDef.id)) {
            const rule = MIXING_RULES.find(r => r.output === targetColorDef.id);
            if (rule) {
                const input1 = COLORS[rule.input[0]];
                const input2 = COLORS[rule.input[1]];
                if(input1 && input2) inputColorDefs = [input1, input2];
            }
        }
        dispatch({ type: 'REVEAL_ANSWER', payload: { targetColor: targetColorDef, inputColors: inputColorDefs } });
    }
  }, [state.isAnswerRevealed, state.revealedAnswerInfo, state.currentChallenge, state.attemptsLeft, state.showSuccessSplash, dispatch, handleProceedToNextChallengeAfterReveal]);
  
  const currentBackgroundImageUrl = PALETTE_BACKGROUND_URLS[state.currentPaletteId];
  
  useEffect(() => {
    const audioTest = document.createElement('audio');
    const mp3Support = audioTest.canPlayType('audio/mpeg');
    console.log(`[INIT] Browser MP3 support: ${mp3Support}`);
    if (mp3Support === "") {
        console.warn("[INIT] Browser does not report support for MP3 audio.");
    }
  }, []);


  return (
    <HashRouter>
      <div
        className={`min-h-screen flex flex-col font-sans bg-purple-50 ${LANGUAGES[state.language].dir}`}
        style={{
          backgroundImage: `url(${currentBackgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          transition: 'background-image 0.7s ease-in-out',
        }}
      >
        {state.showErrorFlash && (
          <div className="fixed inset-0 bg-red-500 bg-opacity-20 z-[100] pointer-events-none animate-pulseOnce"></div>
        )}
        <Header 
            language={state.language}
            isTTSOn={state.isTTSOn}
            isSoundEffectsOn={state.isSoundEffectsOn}
            isBackgroundMusicOn={state.isBackgroundMusicOn}
            isColorblindModeOn={state.isColorblindModeOn}
            isHapticFeedbackOn={state.isHapticFeedbackOn} 
            selectedAvatarId={state.selectedAvatarId}
            avatarReaction={state.avatarReaction}
            onToggleTTS={() => dispatch({type: 'TOGGLE_TTS'})}
            onToggleSoundEffects={() => dispatch({type: 'TOGGLE_SOUND_EFFECTS'})}
            onToggleBackgroundMusic={() => dispatch({type: 'TOGGLE_BACKGROUND_MUSIC'})}
            onToggleColorblindMode={() => dispatch({type: 'TOGGLE_COLORBLIND_MODE'})}
            onToggleHapticFeedback={() => dispatch({type: 'TOGGLE_HAPTIC_FEEDBACK'})} 
            onToggleAvatarModal={() => dispatch({type: 'TOGGLE_AVATAR_MODAL'})}
            onLanguageChange={handleLanguageChange}
            t={t}
        />
        <Navigation t={t} dispatch={dispatch} />
        <main className="flex-grow container mx-auto px-0 sm:px-4 py-4 relative z-0">
          <Routes>
            <Route path="/" element={
              <ColorMixingGameView 
                state={state} 
                dispatch={dispatch} 
                t={t} 
                handlePlaySoundTTS={handlePlaySoundTTS}
                generateNewChallenge={generateNewChallenge}
                handleColorSelect={handleColorSelect}
                handleMixAttempt={handleMixAttempt}
                handleResetSelection={handleResetSelection}
                handleCloseFunFactModal={handleCloseFunFactModal}
                handleProceedToNextChallengeAfterReveal={handleProceedToNextChallengeAfterReveal}
                handleRevealOrNextChallenge={handleRevealOrNextChallenge}
                handlePaletteChange={handlePaletteChange}
                isColorblindModeOn={state.isColorblindModeOn}
              />
            } />
            <Route path="/facts" element={
              <FunFactsExplorerView 
                language={state.language}
                isTTSOn={state.isTTSOn}
                t={t}
                handlePlaySoundTTS={handlePlaySoundTTS}
              />
            } />
            <Route path="/all-colors" element={ 
              <AllColorsView
                language={state.language}
                t={t}
                handlePlaySoundTTS={handlePlaySoundTTS}
                isTTSOn={state.isTTSOn}
                isColorblindModeOn={state.isColorblindModeOn}
              />
            } />
             <Route path="/mini-games" element={
              <MiniGamesLandingView
                state={state}
                dispatch={dispatch}
                t={t}
              />
            } />
            <Route path="/color-match" element={
              <ColorMatchGameView
                state={state}
                dispatch={dispatch}
                t={t}
                handlePlaySoundTTS={handlePlaySoundTTS}
                isColorblindModeOn={state.isColorblindModeOn}
              />
            } />
            <Route path="/rainbow-sequence" element={
              <RainbowSequenceGameView
                state={state}
                dispatch={dispatch}
                t={t}
                handlePlaySoundTTS={handlePlaySoundTTS}
                isColorblindModeOn={state.isColorblindModeOn}
              />
            } />
          </Routes>
        </main>
        {state.showAvatarSelectionModal && (
            <AvatarSelectionModal
                isOpen={state.showAvatarSelectionModal}
                onClose={() => dispatch({ type: 'TOGGLE_AVATAR_MODAL' })}
                avatars={AVATAR_IDS.map(id => AVATARS[id])}
                selectedAvatarId={state.selectedAvatarId}
                onSelectAvatar={(avatarId) => dispatch({ type: 'SELECT_AVATAR', payload: avatarId })}
                language={state.language}
                uiTexts={UI_TEXTS[state.language]}
            />
        )}
        <footer className="text-center p-4 bg-gray-800/80 text-gray-300 text-sm relative z-10 backdrop-blur-sm">
          Mira-Colors Learning App &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </HashRouter>
  );
};

export default MainApplication;