import { motion } from 'framer-motion';

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top left blob */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Top right blob */}
      <motion.div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-wellness-lavender/20 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Bottom left blob */}
      <motion.div
        className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-wellness-peach/20 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Bottom right blob */}
      <motion.div
        className="absolute -bottom-10 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center accent */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-primary/3 to-wellness-lavender/3 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default FloatingShapes;
