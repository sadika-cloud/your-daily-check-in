import { Question, MoodOption, Recommendation } from '@/types/wellness';

export const moodOptions: MoodOption[] = [
  { id: 'great', emoji: '😄', label: 'Great', color: 'wellness-green' },
  { id: 'good', emoji: '😊', label: 'Good', color: 'wellness-teal' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'wellness-yellow' },
  { id: 'low', emoji: '😕', label: 'Low', color: 'wellness-yellow' },
  { id: 'veryLow', emoji: '😔', label: 'Very Low', color: 'wellness-orange' },
  { id: 'struggling', emoji: '😢', label: 'Struggling', color: 'wellness-red' },
];

export const questions: Question[] = [
  // Emotional State - 3 questions, 7 marks each = 21 total
  {
    id: 'emotional-1',
    text: 'Do you feel calm and at ease?',
    category: 'emotional',
    points: 7,
  },
  {
    id: 'emotional-2',
    text: 'Do you feel emotionally stable and balanced?',
    category: 'emotional',
    points: 7,
  },
  {
    id: 'emotional-3',
    text: 'Are you able to manage your thoughts effectively?',
    category: 'emotional',
    points: 7,
  },
  // Stress and Pressure - 4 questions, 8 marks each = 32 total
  {
    id: 'stress-1',
    text: 'Are you able to manage stress and pressure effectively?',
    category: 'stress',
    points: 8,
  },
  {
    id: 'stress-2',
    text: 'Are you able to stay relaxed in stressful situations?',
    category: 'stress',
    points: 8,
  },
  {
    id: 'stress-3',
    text: 'Are you able to concentrate without feeling mentally drained?',
    category: 'stress',
    points: 8,
  },
  {
    id: 'stress-4',
    text: 'Do you find it easy to maintain concentration?',
    category: 'stress',
    points: 8,
  },
  // Support and Connection - 2 questions, 7 marks each = 14 total
  {
    id: 'support-1',
    text: 'Do you feel supported or connected to someone you trust?',
    category: 'support',
    points: 7,
  },
  {
    id: 'support-2',
    text: 'Do you feel understood or heard by someone?',
    category: 'support',
    points: 7,
  },
  // Safety Question - 1 question, special scoring
  {
    id: 'safety-1',
    text: 'Do you feel mentally safe and comfortable with your thoughts?',
    category: 'safety',
    points: 20,
    isSensitive: true,
  },
  // Outlook and Energy - 1 question, 13 marks
  {
    id: 'outlook-1',
    text: 'Do you feel able to handle challenges or tasks without feeling drained?',
    category: 'outlook',
    points: 13,
  },
];

export const motivationalQuotes = [
  "Every moment is a fresh beginning. Take a deep breath and start again.",
  "You are stronger than you think, braver than you believe.",
  "It's okay to not be okay. What matters is you're checking in with yourself.",
  "Small steps every day lead to big changes over time.",
  "Your mental health matters. Taking this step shows incredible self-awareness.",
];

export const recommendations: Recommendation[] = [
  // Free recommendations
  {
    id: 'breathing-1',
    title: 'Deep Breathing',
    description: 'Take 5 slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.',
    icon: '🌬️',
    category: 'breathing',
    isPremium: false,
    forMoods: ['doingOkay', 'feelingLow', 'needsExtraCare', 'needsSupport'],
  },
  {
    id: 'hydration-1',
    title: 'Stay Hydrated',
    description: 'Drink a glass of water. Hydration affects both body and mind.',
    icon: '💧',
    category: 'hydration',
    isPremium: false,
    forMoods: ['doingOkay', 'feelingLow', 'needsExtraCare', 'needsSupport'],
  },
  {
    id: 'movement-1',
    title: 'Gentle Stretch',
    description: 'Stand up and stretch your arms above your head. Roll your shoulders.',
    icon: '🧘',
    category: 'movement',
    isPremium: false,
    forMoods: ['doingOkay', 'feelingLow', 'needsExtraCare'],
  },
  {
    id: 'reflection-1',
    title: 'Gratitude Moment',
    description: 'Think of one thing you\'re grateful for right now, no matter how small.',
    icon: '🙏',
    category: 'reflection',
    isPremium: false,
    forMoods: ['doingOkay', 'feelingLow'],
  },
  {
    id: 'rest-1',
    title: 'Take a Break',
    description: 'Give yourself permission to rest for 5 minutes. Close your eyes if possible.',
    icon: '😴',
    category: 'rest',
    isPremium: false,
    forMoods: ['feelingLow', 'needsExtraCare', 'needsSupport'],
  },
  {
    id: 'connection-1',
    title: 'Reach Out',
    description: 'Send a message to someone you trust. Connection helps healing.',
    icon: '💬',
    category: 'connection',
    isPremium: false,
    forMoods: ['needsExtraCare', 'needsSupport'],
  },
  // Premium recommendations
  {
    id: 'breathing-2',
    title: 'Guided Box Breathing',
    description: 'A 10-minute guided session to calm your nervous system.',
    icon: '🎧',
    category: 'breathing',
    isPremium: true,
    forMoods: ['feelingLow', 'needsExtraCare', 'needsSupport'],
  },
  {
    id: 'movement-2',
    title: 'Calming Yoga Flow',
    description: '15-minute gentle yoga designed for stress relief.',
    icon: '🧘‍♀️',
    category: 'movement',
    isPremium: true,
    forMoods: ['doingOkay', 'feelingLow', 'needsExtraCare'],
  },
  {
    id: 'reflection-2',
    title: 'Journaling Prompts',
    description: 'Structured prompts to help process your thoughts and feelings.',
    icon: '📓',
    category: 'reflection',
    isPremium: true,
    forMoods: ['doingOkay', 'feelingLow', 'needsExtraCare'],
  },
  {
    id: 'rest-2',
    title: 'Sleep Meditation',
    description: '20-minute guided meditation for better sleep.',
    icon: '🌙',
    category: 'rest',
    isPremium: true,
    forMoods: ['feelingLow', 'needsExtraCare', 'needsSupport'],
  },
];

export const getCategoryLabel = (category: Question['category']): string => {
  const labels: Record<Question['category'], string> = {
    emotional: 'Emotional State',
    stress: 'Stress & Pressure',
    support: 'Support & Connection',
    safety: 'Safety Check',
    outlook: 'Outlook & Energy',
  };
  return labels[category];
};
