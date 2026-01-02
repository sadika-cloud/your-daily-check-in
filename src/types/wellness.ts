export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'veryLow' | 'struggling';

export interface MoodOption {
  id: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export type AnswerOption = 'yes' | 'mostly' | 'notReally' | 'no';

export interface Question {
  id: string;
  text: string;
  category: 'emotional' | 'stress' | 'support' | 'safety' | 'outlook';
  points: number;
  isSensitive?: boolean;
}

export interface Answer {
  questionId: string;
  answer: AnswerOption;
  score: number;
}

export interface QuestionnaireResult {
  totalScore: number;
  normalizedScore: number;
  mood: ResultMood;
  answers: Answer[];
  completedAt: Date;
}

export type ResultMood = 'doingOkay' | 'feelingLow' | 'needsExtraCare' | 'needsSupport';

export interface MoodResult {
  mood: ResultMood;
  label: string;
  emoji: string;
  color: string;
  colorClass: string;
  message: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'breathing' | 'movement' | 'reflection' | 'connection' | 'rest' | 'hydration';
  isPremium: boolean;
  forMoods: ResultMood[];
}
