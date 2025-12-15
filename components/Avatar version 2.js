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
            scale: 0.5,
            rotateY: -90,
            rotateZ: -25,
            x: 200,
            y: -100,
            filter: 'blur(30px) brightness(0.3)'
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateZ: 0,
            x: 0,
            y: 0,
            filter: 'blur(0px) brightness(1)'
          }}
          exit={{ 
            opacity: 0,
            scale: 0.6,
            rotateY: 90,
            rotateZ: 25,
            x: -200,
            y: 100,
            filter: 'blur(30px) brightness(0.3)'
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.6, 0.01, 0.05, 0.95],
            scale: { duration: 0.7 },
            rotateY: { duration: 0.8 },
            filter: { duration: 0.6 }
          }}
          className="relative"
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        >
          {/* Animated Ring Glow */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${theme.glow}00, ${theme.glow}60 40%, ${theme.glow}00)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Pulsing Glow Effect */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(ellipse at 60% 40%, ${theme.glow}70, transparent 60%)`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.95, 1.15, 0.95]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Sparkle Particles */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full -z-10"
                style={{
                  background: theme.glow,
                  boxShadow: `0 0 20px ${theme.glow}`,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(angle * Math.PI / 180) * 150, 0],
                  y: [0, Math.sin(angle * Math.PI / 180) * 150, 0],
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            );
          })}

          {/* Orbital Ring */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              border: `2px solid ${theme.glow}40`,
              borderRadius: '50%',
              transform: 'scale(1.2)'
            }}
            animate={{
              rotate: 360,
              scale: [1.2, 1.3, 1.2],
              borderColor: [`${theme.glow}40`, `${theme.glow}80`, `${theme.glow}40`]
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          {/* Main Image with Shimmer Effect */}
          <motion.div
            className="relative overflow-hidden"
            animate={{
              y: [0, -15, 0]
            }}
            transition={{
              duration: 4,
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
            
            {/* Shimmer Overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${theme.glow}40 50%, transparent 70%)`,
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Avatar;