import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Avatar = () => {
  const { theme, currentTheme } = useTheme();
  
  return (
    <div className="hidden xl:flex xl:max-w-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ 
            opacity: 0,
            scale: 0.8,
            rotate: -15,
            x: 100,
            filter: 'blur(20px)'
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0,
            scale: 0.8,
            rotate: 15,
            x: -100,
            filter: 'blur(20px)'
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="relative"
        >
          {/* Enhanced Multi-layer Glow Effect */}
          
          {/* Outer Glow - Largest */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${theme.glow}60, ${theme.glow}30 40%, transparent 70%)`,
              transform: 'scale(1.5)',
              filter: 'blur(60px)'
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6],
              scale: [1.4, 1.6, 1.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Middle Glow - Medium */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${theme.glow}70, ${theme.glow}40 50%, transparent 75%)`,
              transform: 'scale(1.3)',
              filter: 'blur(40px)'
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1.2, 1.4, 1.2]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />

          {/* Inner Glow - Brightest */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${theme.glow}80, ${theme.glow}50 30%, transparent 60%)`,
              filter: 'blur(30px)'
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Directional Light Beams */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `linear-gradient(135deg, ${theme.glow}40, transparent 50%, ${theme.glow}30)`,
              filter: 'blur(50px)',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Pulsing Ring Effect */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              border: `3px solid ${theme.glow}`,
              boxShadow: `0 0 40px ${theme.glow}, inset 0 0 40px ${theme.glow}50`,
              transform: 'scale(0.9)'
            }}
            animate={{
              scale: [0.9, 1.3, 0.9],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* Secondary Pulse Ring */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              border: `2px solid ${theme.glow}`,
              boxShadow: `0 0 30px ${theme.glow}`,
              transform: 'scale(0.95)'
            }}
            animate={{
              scale: [0.95, 1.4, 0.95],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8
            }}
          />
          
          {/* Avatar Image with Enhanced Filter */}
          <motion.div
            animate={{
              filter: [
                `drop-shadow(0 0 30px ${theme.glow}) drop-shadow(0 0 60px ${theme.glow})`,
                `drop-shadow(0 0 50px ${theme.glow}) drop-shadow(0 0 80px ${theme.glow})`,
                `drop-shadow(0 0 30px ${theme.glow}) drop-shadow(0 0 60px ${theme.glow})`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image 
              src={theme.avatar} 
              width={737} 
              height={678} 
              alt="" 
              className='translate-z-0 w-full h-full' 
              unoptimized 
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Avatar;