

export enum Language {
  EN = 'en',
  AR = 'ar',
}

export type ColorId =
  | 'red' | 'yellow' | 'blue'
  | 'orange' | 'green' | 'purple'
  | 'white' | 'black' | 'gray' | 'brown' | 'pink'
  | 'vermilion' | 'amber' | 'chartreuse' | 'teal' | 'violet' | 'magenta'
  | 'cyan' | 'lime' | 'turquoise' | 'gold' | 'silver';

export interface ColorDefinition {
  id: ColorId;
  name: Record<Language, string>;
  hex: string;
  tailwindClass: string;
  textColorClass?: string;
}

export enum PaletteId {
  Warm = 'Warm',
  Cool = 'Cool',
  Neutral = 'Neutral',
}

export interface PaletteInfo {
  id: PaletteId;
  name: Record<Language, string>;
  challengeColorIds: ColorId[]; // Target colors for this palette's challenges
  displayColors?: ColorId[]; // Colors to display for this palette (optional aesthetic)
}

export interface MixingRule {
  input: [ColorId, ColorId]; // Sorted array of input color IDs
  output: ColorId;
}

export enum FunFactCategory {
  GeneralColors = 'GeneralColors',
  Vision = 'Vision',
  LightScience = 'LightScience',
}

export interface FunFact {
  id: string;
  category: FunFactCategory;
  content: Record<Language, string>;
  relatedColorIds?: ColorId[];
}

export interface Challenge {
  targetColorId: ColorId;
  paletteId: PaletteId;
}

// Avatar Types
export type AvatarId = 'avatar1' | 'avatar2' | 'avatar3' | 'avatar4' | 'avatar5';

export interface AvatarDefinition {
  id: AvatarId;
  name: Record<Language, string>; // Name for the avatar (e.g., "Friendly Robot", "Curious Cat")
  imageUrl: string; // URL to the avatar image
}

export type AvatarReactionState = 'happy' | 'sad' | null;


export type TranslationKey =
  | 'appTitle' | 'mixColorsToMake' | 'mix' | 'reset' | 'attemptsLeft' | 'correct' | 'tryAgain'
  | 'warmPalette' | 'coolPalette' | 'neutralPalette' | 'funFactsExplorer' | 'colorMixingGame'
  | 'generalColors' | 'vision' | 'lightScience' | 'tapToHear' | 'greatJob' | 'wantToHearFunFact'
  | 'yes' | 'noThanks' | 'selectTwoColors' | 'revealAnswer' | 'nextChallenge' | 'allChallengesCompleted'
  | 'paletteCompleted' | 'toggleTTS' | 'pressPlayToHearFact' | 'answerRevealedTitle' | 'theCorrectAnswerIs'
  | 'playAnswerSound' | 'and' | 'make' | 'isAFundamentalColorMessage' | 'paletteLockedMessage'
  | 'selectTheTargetColorPrompt'
  // Avatar UI Translation Keys
  | 'avatarSelectionTitle' | 'selectYourAvatarButton' | 'closeAvatarSelection'
  | 'avatar1Name' | 'avatar2Name' | 'avatar3Name' | 'avatar4Name' | 'avatar5Name'
  // Audio Toggle Translation Keys
  | 'toggleSoundEffects' | 'toggleBackgroundMusic'
  // All Colors View
  | 'allColorsViewTabTitle' | 'allColorsViewTitle'
  // Colorblind Mode
  | 'toggleColorblindMode'
  // Haptic Feedback
  | 'toggleHapticFeedback'
  // Color Match Mini-Game
  | 'miniGamesNavTitle' | 'colorMatchGameTitle' | 'whatColorIsThe' | 'submitAnswer' | 'nextObject'
  | 'sessionComplete' | 'yourFinalScoreIs' | 'playAgain' | 'exitMiniGame'
  // Rainbow Sequence Mini-Game
  | 'rainbowSequenceGameTitle' | 'tapColorsInOrder' | 'yourCurrentSequence' | 'sequenceCorrect' | 'sequenceIncorrect'
  | 'resetAttemptButton'
  // Mini-Games Landing Page
  | 'miniGamesLandingTitle';


export type UITexts = Record<Language, Record<TranslationKey, string>>;

// New types for Progress Tracking System
export type Stars = 0 | 1 | 2 | 3;

export interface PaletteProgress {
  unlocked: boolean;
  completedChallenges: Set<ColorId>;
  starsPerChallenge: Partial<Record<ColorId, Stars>>;
  totalStars: number;
  mastered: boolean;
}

export type UserProgressData = Record<PaletteId, PaletteProgress>;

// Color Match Mini-Game Types
export interface ColorMatchChallengeDefinition {
  id: string;
  objectName: Record<Language, string>;
  imageUrl: string;
  correctColorId: ColorId;
  choiceColorIds: ColorId[]; // Should include correctColorId + distractors
}

// Rainbow Sequence Mini-Game Types
export interface RainbowSequenceChallengeDefinition {
  id: string;
  name: Record<Language, string>; // e.g., "Primary Colors", "Rainbow Order"
  description: Record<Language, string>; // e.g., "Tap the primary colors: Red, Yellow, Blue."
  correctSequence: ColorId[];
  availableChoices: ColorId[]; // All colors presented to the user (shuffled)
}

export type MiniGameType = 'ColorMatch' | 'RainbowSequence';

export interface AppState {
  language: Language;
  currentPaletteId: PaletteId;
  currentChallenge: Challenge | null;
  selectedMixColors: ColorDefinition[];
  mixedResultColor: ColorDefinition | null;
  attemptsLeft: number;
  showSuccessSplash: boolean;
  showFailureShake: boolean;
  funFactToShow: FunFact | null;
  isTTSOn: boolean;
  userProgress: UserProgressData;
  isAnswerRevealed: boolean;
  revealedAnswerInfo: {
    target: ColorDefinition;
    inputs: [ColorDefinition, ColorDefinition] | null;
  } | null;
  selectedAvatarId: AvatarId;
  showAvatarSelectionModal: boolean;
  avatarReaction: AvatarReactionState;
  showDelayedFunFactModal: boolean;
  isSoundEffectsOn: boolean; 
  isBackgroundMusicOn: boolean;
  soundToPlayEffect: 'correct' | 'incorrect' | null;
  showErrorFlash: boolean;
  isColorblindModeOn: boolean;
  isHapticFeedbackOn: boolean; 
  hapticPatternToPlay: number | number[] | null;

  // Mini-Game Shared State
  activeMiniGame: MiniGameType | null;

  // Color Match Mini-Game State
  colorMatchChallenges: ColorMatchChallengeDefinition[]; // Holds all available challenges loaded from constants
  colorMatchSessionChallenges: ColorMatchChallengeDefinition[]; // Holds the current session's challenges
  currentColorMatchChallengeIndex: number | null;
  currentColorMatchChallenge: ColorMatchChallengeDefinition | null;
  colorMatchSelectedAnswerId: ColorId | null;
  colorMatchScore: number;
  colorMatchAttemptsLeft: number;
  showColorMatchSuccess: boolean; // For visual feedback in mini-game
  showColorMatchFailure: boolean; // For visual feedback in mini-game
  colorMatchSessionEnded: boolean; // Flag to indicate the current session is over

  // Rainbow Sequence Mini-Game State
  rainbowSequenceChallenges: RainbowSequenceChallengeDefinition[];
  rainbowSequenceSessionChallenges: RainbowSequenceChallengeDefinition[];
  currentRainbowSequenceChallengeIndex: number | null;
  currentRainbowSequenceChallenge: RainbowSequenceChallengeDefinition | null;
  playerRainbowSequence: ColorId[]; // The sequence of colors the player has tapped
  rainbowSequenceScore: number;
  rainbowSequenceAttemptsLeft: number; // Added for consistency if we want attempts per sequence
  showRainbowSequenceSuccess: boolean;
  showRainbowSequenceFailure: boolean;
  rainbowSequenceSessionEnded: boolean;
}