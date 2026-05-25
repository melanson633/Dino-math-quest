import { parse } from 'yaml';
import dinoIslandYaml from './dino-island.yaml?raw';

export type CompanionId = 'none' | 'mama' | 'dada' | 'river' | 'gracie' | 'max';
export type LearningAreaId = 'math' | 'spelling' | 'speech' | 'music';
export type LearningAreaStatus = 'playable' | 'scaffold';
export type DifficultyPace = 'quicker' | 'gentle';

export interface WeightedAvatarVariant {
  id: string;
  label: string;
  asset: string | null;
  weight: number;
}

export interface CompanionContent {
  id: CompanionId;
  name: string;
  shortLabel: string;
  role: string;
  color: string;
  homeVariants: WeightedAvatarVariant[];
  actionVariants: Partial<Record<LearningAreaId, WeightedAvatarVariant[]>>;
}

export interface LearningAreaContent {
  id: LearningAreaId;
  name: string;
  shortLabel: string;
  icon: string;
  status: LearningAreaStatus;
  description: string;
  difficultyPace: DifficultyPace;
  accent: string;
}

export interface SpeechMomentContent {
  retryLimit: number;
  positiveOnly: boolean;
  starterPrompts: Array<{
    id: string;
    focusSound: string;
    text: string;
    rhythm: string[];
  }>;
}

export interface MusicMomentContent {
  id: string;
  learningArea: LearningAreaId;
  style: string;
  title: string;
}

export interface SpellingWordContent {
  id: string;
  word: string;
  icon: string;
  clue: string;
  sound: string;
  sayPrompt: string;
  rhythm: string[];
  contextHints: string[];
  group: 'family' | 'dino' | 'speech';
  difficulty: 'support' | 'steady' | 'stretch';
}

export interface MusicPatternContent {
  id: string;
  name: string;
  beats: string[];
  learningArea: LearningAreaId;
}

export interface DinoIslandContent {
  version: number;
  theme: {
    name: string;
    styleMix: {
      montessoriCalm: number;
      sesameStreetFun: number;
    };
    primarySurface: string;
  };
  companions: CompanionContent[];
  learningAreas: LearningAreaContent[];
  speechMoments: SpeechMomentContent;
  musicMoments: MusicMomentContent[];
  spellingWords: SpellingWordContent[];
  musicPatterns: MusicPatternContent[];
  featureFlags: {
    elevenLabsVoices: boolean;
    liveVoiceParticipation: boolean;
    generatedSongs: boolean;
  };
}

export const dinoIslandContent = parse(dinoIslandYaml) as DinoIslandContent;

export const COMPANIONS = dinoIslandContent.companions;
export const LEARNING_AREAS = dinoIslandContent.learningAreas;

export function getCompanion(id: CompanionId): CompanionContent {
  return COMPANIONS.find((companion) => companion.id === id) ?? COMPANIONS[0];
}

export function pickCompanionActionVariant(companion: CompanionContent, learningAreaId: LearningAreaId): WeightedAvatarVariant | null {
  return pickWeightedVariant(companion.actionVariants[learningAreaId] ?? companion.homeVariants);
}

export function pickWeightedVariant(variants: WeightedAvatarVariant[]): WeightedAvatarVariant | null {
  if (variants.length === 0) return null;
  const totalWeight = variants.reduce((sum, variant) => sum + Math.max(0, variant.weight), 0);
  if (totalWeight <= 0) return variants[0];

  let roll = Math.random() * totalWeight;
  for (const variant of variants) {
    roll -= Math.max(0, variant.weight);
    if (roll <= 0) return variant;
  }
  return variants[variants.length - 1];
}

export function pickStableWeightedVariant(variants: WeightedAvatarVariant[], key: string): WeightedAvatarVariant | null {
  if (variants.length === 0) return null;
  const totalWeight = variants.reduce((sum, variant) => sum + Math.max(0, variant.weight), 0);
  if (totalWeight <= 0) return variants[0];

  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }

  let roll = hash % totalWeight;
  for (const variant of variants) {
    roll -= Math.max(0, variant.weight);
    if (roll < 0) return variant;
  }
  return variants[variants.length - 1];
}
