import { motion } from 'framer-motion';
import { Recommendation, ResultMood } from '@/types/wellness';
import { recommendations } from '@/data/questions';
import { Lock, ArrowLeft, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecommendationListProps {
  mood: ResultMood;
  onRetake: () => void;
  onBack: () => void;
}

const RecommendationList = ({ mood, onRetake, onBack }: RecommendationListProps) => {
  const { toast } = useToast();
  
  const filteredRecommendations = recommendations.filter(rec => 
    rec.forMoods.includes(mood)
  );

  const freeRecs = filteredRecommendations.filter(rec => !rec.isPremium);
  const premiumRecs = filteredRecommendations.filter(rec => rec.isPremium);

  const handlePremiumClick = (rec: Recommendation) => {
    toast({
      title: '🔒 Premium Feature',
      description: `"${rec.title}" is a premium activity. Upgrade to unlock guided exercises and more.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Wellness Toolkit 🌿
        </h2>
        <p className="text-muted-foreground">
          Activities chosen just for you based on how you're feeling
        </p>
      </motion.div>

      {/* Free recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>✨</span> Start Here (Free)
        </h3>
        <div className="grid gap-4">
          {freeRecs.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="wellness-card p-4 flex items-start gap-4 cursor-pointer"
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-3xl">{rec.icon}</span>
              <div>
                <h4 className="font-semibold text-foreground">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium recommendations */}
      {premiumRecs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>🌟</span> Premium Activities
          </h3>
          <div className="grid gap-4">
            {premiumRecs.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handlePremiumClick(rec)}
                className="wellness-card p-4 flex items-start gap-4 cursor-pointer relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-3xl grayscale">{rec.icon}</span>
                <div>
                  <h4 className="font-semibold text-foreground">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <button
          onClick={onBack}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-border text-foreground font-medium hover:bg-muted/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </button>
        <button
          onClick={onRetake}
          className="flex-1 btn-wellness"
        >
          <RotateCcw className="w-5 h-5" />
          Check In Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationList;
