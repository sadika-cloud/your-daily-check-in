import { motion } from 'framer-motion';
import { moodOptions } from '@/data/questions';
import { MoodLevel } from '@/types/wellness';

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  onSelect: (mood: MoodLevel) => void;
}

const MoodSelector = ({ selectedMood, onSelect }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-3xl mx-auto">
      {moodOptions.map((option, index) => (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          onClick={() => onSelect(option.id)}
          className={`emoji-btn min-w-[80px] md:min-w-[100px] ${
            selectedMood === option.id ? 'selected' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-4xl md:text-5xl"
            animate={selectedMood === option.id ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {option.emoji}
          </motion.span>
          <span className="text-sm font-medium text-muted-foreground">
            {option.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default MoodSelector;
