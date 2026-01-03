import { motion } from 'framer-motion';
import { Question, AnswerOption } from '@/types/wellness';
import { getCategoryLabel } from '@/data/questions';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: AnswerOption | null;
  onAnswer: (answer: AnswerOption) => void;
}

const answerOptions: { value: AnswerOption; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'mostly', label: 'Mostly' },
  { value: 'notReally', label: 'Not Really' },
  { value: 'no', label: 'No' },
];

const flipVariants = {
  initial: {
    rotateY: 90,
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    rotateY: -90,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
};

const QuestionCard = ({ question, selectedAnswer, onAnswer }: QuestionCardProps) => {
  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        key={question.id}
        variants={flipVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="wellness-card"
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          {getCategoryLabel(question.category)}
        </motion.div>

        {/* Question text */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-relaxed"
        >
          {question.text}
        </motion.h3>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {answerOptions.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              onClick={() => onAnswer(option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                selectedAnswer === option.value
                  ? 'border-primary bg-primary/10 text-primary shadow-glow'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionCard;
