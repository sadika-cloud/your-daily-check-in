import { motion } from 'framer-motion';
import { MoodResult } from '@/types/wellness';
import { Sparkles } from 'lucide-react';

interface ResultCardProps {
  normalizedScore: number;
  moodResult: MoodResult;
  onViewRecommendations: () => void;
}

const ResultCard = ({ normalizedScore, moodResult, onViewRecommendations }: ResultCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="wellness-card max-w-lg mx-auto text-center relative overflow-hidden"
    >
      {/* Background gradient based on mood */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${moodResult.color}, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10">
        {/* Score circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 relative"
        >
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={moodResult.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={2 * Math.PI * 45}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 45 * (normalizedScore / 100) 
              }}
              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-5xl"
            >
              {moodResult.emoji}
            </motion.span>
          </div>
        </motion.div>

        {/* Mood label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: moodResult.color }}
          >
            {moodResult.label}
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {moodResult.message}
          </p>
        </motion.div>

        {/* Score display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm mb-6"
        >
          Wellness Score: {100 - normalizedScore}/100
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={onViewRecommendations}
          className="btn-wellness w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-5 h-5" />
          View Personalized Recommendations
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultCard;
