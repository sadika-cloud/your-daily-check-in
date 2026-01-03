import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, MessageCircle } from 'lucide-react';

interface SafetyAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyAlert = ({ isOpen, onClose }: SafetyAlertProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="wellness-card max-w-md w-full text-center relative overflow-hidden"
          >
            {/* Soft gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-wellness-blue/30 to-wellness-lavender/20" />
            
            <div className="relative z-10">
              {/* Gentle pulsing heart */}
              <motion.div
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-wellness-blue/30 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-10 h-10 text-primary" fill="currentColor" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                You're Not Alone 💙
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-6 leading-relaxed"
              >
                It takes courage to acknowledge difficult feelings. 
                Whatever you're going through, there are people who care 
                and want to help. You matter.
              </motion.p>

              {/* Support options */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 mb-6"
              >
                <div className="p-4 rounded-xl bg-card/50 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Emergency Helplines
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <a href="tel:1166" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="font-medium text-foreground">1166</span> - Mental Health Helpline (Nepal)
                    </a>
                    <a href="tel:100" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="font-medium text-foreground">100</span> - Police Emergency
                    </a>
                    <a href="tel:102" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <span className="font-medium text-foreground">102</span> - Ambulance Service
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">
                    Talking about it can help lighten the load
                  </span>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="btn-wellness w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                I Understand, Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SafetyAlert;
