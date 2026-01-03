import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, History, ArrowRight } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';

interface LoginPromptProps {
  isOpen: boolean;
  onLogin: () => void;
  onContinueWithoutLogin: () => void;
}

const LoginPrompt = ({ isOpen, onLogin, onContinueWithoutLogin }: LoginPromptProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleLoginClick = () => {
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    onLogin();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showAuthDialog && (
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
              className="wellness-card max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 gradient-calm" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Almost There! ✨
                  </h2>
                  <p className="text-muted-foreground">
                    Would you like to save your wellness journey?
                  </p>
                </motion.div>

                <div className="space-y-3">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleLoginClick}
                    className="w-full p-4 rounded-xl border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-foreground">Log In / Sign Up</h3>
                      <p className="text-sm text-muted-foreground">
                        Save your history & track progress
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={onContinueWithoutLogin}
                    className="w-full p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/50 transition-all duration-300 flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <History className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-foreground">Continue Without Login</h3>
                      <p className="text-sm text-muted-foreground">
                        View your score (won't be saved)
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default LoginPrompt;
