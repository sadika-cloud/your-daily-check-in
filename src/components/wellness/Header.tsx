import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          </div>
          <span className="font-bold text-lg text-foreground">ARE YOU OK?</span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
