import { AnswerOption, Answer, ResultMood, MoodResult, Question } from '@/types/wellness';

export const getScoreForAnswer = (answer: AnswerOption, isSensitive: boolean): number => {
  if (isSensitive) {
    // Sensitive question: higher scores for concerning answers
    const sensitiveScores: Record<AnswerOption, number> = {
      yes: 20,
      mostly: 15,
      notReally: 10,
      no: 0,
    };
    return sensitiveScores[answer];
  }

  // Regular questions - note: for positive questions, "yes" = good = low score
  // For negative questions (stress), we need to interpret differently
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
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      // For stress questions (negative framing), invert the scoring
      if (question.category === 'stress') {
        // "Yes I feel overwhelmed" should score HIGH (bad)
        // So we invert: yes=8, no=0
        const invertedScores: Record<AnswerOption, number> = {
          yes: 8,
          mostly: 6,
          notReally: 4,
          no: 0,
        };
        total += invertedScores[answer.answer];
      } else {
        total += answer.score;
      }
    }
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
  if (normalizedScore <= 30) return 'doingOkay';
  if (normalizedScore <= 60) return 'feelingLow';
  if (normalizedScore <= 80) return 'needsExtraCare';
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
