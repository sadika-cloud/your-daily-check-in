import { AnswerOption, Answer, ResultMood, MoodResult, Question } from '@/types/wellness';

export const getScoreForAnswer = (answer: AnswerOption, isSensitive: boolean): number => {
  if (isSensitive) {
    // Sensitive question (now positively framed): "Do you feel mentally safe..."
    // "No" = not safe = high score (bad), "Yes" = safe = low score (good)
    const sensitiveScores: Record<AnswerOption, number> = {
      yes: 0,
      mostly: 5,
      notReally: 15,
      no: 20,
    };
    return sensitiveScores[answer];
  }

  // All questions are now positively framed
  // "Yes" = good = low score, "No" = bad = high score
  const regularScores: Record<AnswerOption, number> = {
    yes: 0,
    mostly: 4,
    notReally: 6,
    no: 8,
  };
  return regularScores[answer];
};

export const calculateTotalScore = (answers: Answer[], questions: Question[]): number => {
  let total = 0;
  
  answers.forEach(answer => {
    total += answer.score;
  });
  
  return total;
};

export const normalizeScore = (totalScore: number): number => {
  // Max possible score calculation:
  // Emotional: 3 questions × 8 max = 24
  // Stress: 4 questions × 8 max = 32
  // Support: 2 questions × 8 max = 16
  // Safety: 1 question × 20 max = 20
  // Outlook: 1 question × 8 max = 8
  // Total max = 100
  const maxScore = 100;
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
