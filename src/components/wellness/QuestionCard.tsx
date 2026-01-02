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

const QuestionCard = ({ question, selectedAnswer, onAnswer }: QuestionCardProps) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="wellness-card"
    >
      {/* Category badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
      >
        {getCategoryLabel(question.category)}
      </motion.div>

      {/* Question text */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            transition={{ delay: 0.3 + index * 0.1 }}
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
  );
};

export default QuestionCard;
