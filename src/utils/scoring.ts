import { AnswerOption, Answer, ResultMood, MoodResult, Question } from '@/types/wellness';

export const getScoreForAnswer = (answer: AnswerOption, question: Pick<Question, 'points' | 'isSensitive'>): number => {
  const points = question.points;

  // Sensitive question: higher score = more concerning
  if (question.isSensitive) {
    const sensitiveRatios: Record<AnswerOption, number> = {
      yes: 0,
      mostly: 0.25,
      notReally: 0.75,
      no: 1,
    };

    return Math.round(points * sensitiveRatios[answer]);
  }

  // Regular questions: all positively framed
  // Yes = good (0), No = bad (max points)
  const regularRatios: Record<AnswerOption, number> = {
    yes: 0,
    mostly: 0.5,
    notReally: 0.75,
    no: 1,
  };

  return Math.round(points * regularRatios[answer]);
};

export const calculateTotalScore = (answers: Answer[]): number => {
  return answers.reduce((sum, a) => sum + a.score, 0);
};

export const normalizeScore = (totalScore: number, questions: Question[]): number => {
  const maxScore = questions.reduce((sum, q) => sum + (q.points ?? 0), 0) || 100;
  return Math.min(100, Math.round((totalScore / maxScore) * 100));
};

export const getMoodFromScore = (normalizedScore: number): ResultMood => {
  if (normalizedScore <= 25) return 'doingOkay';
  if (normalizedScore <= 50) return 'feelingLow';
  if (normalizedScore <= 75) return 'needsExtraCare';
  return 'needsSupport';
};

export const getMoodResult = (normalizedScore: number): MoodResult => {
  const mood = getMoodFromScore(normalizedScore);
  
  const moodResults: Record<ResultMood, MoodResult> = {
    doingOkay: {
      mood: 'doingOkay',
      label: 'Doing Okay',
      emoji: '😊',
      color: 'hsl(145, 60%, 50%)',
      colorClass: 'text-wellness-green',
      message: "You're doing well! Keep nurturing your mental wellness with healthy habits.",
    },
    feelingLow: {
      mood: 'feelingLow',
      label: 'Feeling Low',
      emoji: '😔',
      color: 'hsl(45, 90%, 60%)',
      colorClass: 'text-wellness-yellow',
      message: "It's okay to have low moments. Be gentle with yourself and try some calming activities.",
    },
    needsExtraCare: {
      mood: 'needsExtraCare',
      label: 'Needs Extra Care',
      emoji: '🫂',
      color: 'hsl(25, 90%, 55%)',
      colorClass: 'text-wellness-orange',
      message: "You deserve extra care right now. Consider reaching out to someone you trust.",
    },
    needsSupport: {
      mood: 'needsSupport',
      label: 'Needs Support',
      emoji: '💙',
      color: 'hsl(0, 70%, 55%)',
      colorClass: 'text-wellness-red',
      message: "You're not alone. Please consider talking to someone who can help. Your wellbeing matters.",
    },
  };
  
  return moodResults[mood];
};
