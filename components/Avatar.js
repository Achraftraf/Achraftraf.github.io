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
          {/* Glow effect behind avatar */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 60% 50%, ${theme.glow}50, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <Image 
            src={theme.avatar} 
            width={737} 
            height={678} 
            alt="" 
            className='translate-z-0 w-full h-full' 
            unoptimized 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Avatar;