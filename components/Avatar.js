import Image from "next/image";
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Avatar = memo(() => {
  const { theme, currentTheme } = useTheme();

  return (
    <div className="hidden xl:flex xl:max-w-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{
            opacity: 0,
            scale: 0.85,
            rotateX: 25,
            rotateY: -35,
            rotateZ: -8,
            x: 0,
            y: 180,
            z: -100,
            filter: 'blur(25px) brightness(0.4) saturate(0.4) contrast(0.8) hue-rotate(20deg)'
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            x: 0,
            y: 0,
            z: 0,
            filter: 'blur(0px) brightness(1) saturate(1) contrast(1) hue-rotate(0deg)'
          }}
          exit={{
            opacity: 0,
            scale: 0.85,
            rotateX: -25,
            rotateY: 35,
            rotateZ: 8,
            x: 0,
            y: 180,
            z: -100,
            filter: 'blur(25px) brightness(0.4) saturate(0.4) contrast(0.8) hue-rotate(-20deg)'
          }}
          transition={{
            duration: 1.4,
            ease: [0.19, 1.0, 0.22, 1.0],
            scale: {
              duration: 1.5,
              ease: [0.34, 1.56, 0.64, 1],
              times: [0, 0.6, 1]
            },
            rotateX: {
              duration: 1.4,
              ease: [0.25, 0.1, 0.25, 1.0]
            },
            rotateY: {
              duration: 1.4,
              ease: [0.25, 0.1, 0.25, 1.0]
            },
            rotateZ: {
              duration: 1.5,
              ease: [0.33, 0.0, 0.2, 1.0]
            },
            filter: {
              duration: 1.3,
              ease: [0.4, 0.0, 0.2, 1.0]
            },
            y: {
              duration: 1.4,
              ease: [0.33, 0.0, 0.1, 1.0]
            },
            z: {
              duration: 1.4,
              ease: [0.4, 0.0, 0.2, 1.0]
            },
            opacity: {
              duration: 1.2,
              ease: [0.4, 0.0, 0.6, 1.0]
            }
          }}
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '2000px',
            willChange: 'transform'
          }}
        >
          {/* Core glow foundation - simplified */}
          <motion.div
            className="absolute inset-0 -z-40 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 55% 50%, ${theme.glow}40, ${theme.glow}20 55%, transparent 85%)`,
              filter: 'blur(80px)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.6, 0.5, 0.6],
              scale: [0.8, 1.1, 1, 1.1]
            }}
            exit={{
              opacity: [0.6, 0],
              scale: [1.1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            }}
          />

          {/* Radiant core pulse */}
          <motion.div
            className="absolute inset-0 -z-36 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 58% 45%, ${theme.glow}70, ${theme.glow}35 45%, transparent 70%)`,
              filter: 'blur(50px)'
            }}
            animate={{
              opacity: [0.5, 0.8, 0.6, 0.8],
              scale: [0.95, 1.1, 1, 1.1]
            }}
            exit={{
              opacity: [0.8, 0],
              scale: [1.1, 0.8]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            }}
          />

          {/* Main image with optimized transition */}
          <motion.div
            initial={{
              filter: 'saturate(0.5) brightness(0.6) contrast(0.9) drop-shadow(0 0 0px transparent)',
              scale: 0.95,
              opacity: 0
            }}
            animate={{
              filter: 'saturate(1) brightness(1) contrast(1) drop-shadow(0 15px 35px rgba(0,0,0,0.2))',
              scale: 1,
              opacity: 1
            }}
            exit={{
              filter: 'saturate(0.5) brightness(0.6) contrast(0.9) drop-shadow(0 0 0px transparent)',
              scale: 0.95,
              opacity: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                y: [0, -6, 0]
              }}
              transition={{
                duration: 5,
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
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
