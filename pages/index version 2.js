import Image from "next/image";
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";
import ChatBtn from "../components/ChatBtn";
import ThemeSwitcher from "../components/ThemeSwitcher";

import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../variants";
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme, currentTheme } = useTheme();

  return (
    <div className="bg-primary/60 h-full relative overflow-hidden">
      <ThemeSwitcher />
      
      {/* Animated Background with Color Waves */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentTheme}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Base Gradient */}
          <div className={`w-full h-full bg-gradient-to-r ${theme.gradient}`} />
          
          {/* Animated Color Waves */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${theme.glow}30, transparent 50%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 80% 30%, ${theme.glow}20, transparent 40%)`,
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              x: [50, 0, 50],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className={`w-full h-full relative z-10`}>
        <div className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto">
          {/* Title with Advanced Animations */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentTheme}`}
                className="h1 mb-20 relative"
                initial={{ 
                  opacity: 0, 
                  y: 60,
                  scale: 0.9,
                  rotateX: -20,
                  filter: 'blur(20px)'
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  filter: 'blur(0px)'
                }}
                exit={{ 
                  opacity: 0, 
                  y: -60,
                  scale: 1.1,
                  rotateX: 20,
                  filter: 'blur(20px)'
                }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.6, 0.01, 0.05, 0.95]
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  textShadow: `0 0 80px ${theme.glow}80, 0 0 40px ${theme.glow}60`
                }}
              >
                Full-Stack <br />
                <motion.span 
                  className={theme.accent}
                  animate={{
                    textShadow: [
                      `0 0 20px ${theme.glow}60`,
                      `0 0 60px ${theme.glow}90`,
                      `0 0 20px ${theme.glow}60`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Engineer.
                </motion.span>
              </motion.h1>
            </AnimatePresence>

            {/* Glowing Underline Effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`underline-${currentTheme}`}
                className="absolute -bottom-4 left-0 h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.glow}, transparent)`,
                  boxShadow: `0 0 20px ${theme.glow}`
                }}
                initial={{ width: '0%', opacity: 0 }}
                animate={{ width: '60%', opacity: 1 }}
                exit={{ width: '0%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </AnimatePresence>
          </div>

          {/* Description with Staggered Letters */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentTheme}`}
              className={`max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-20 xl:mb-20 ${theme.textColor} relative`}
              initial={{ 
                opacity: 0,
                y: 40,
                filter: 'blur(15px)'
              }}
              animate={{ 
                opacity: 1,
                y: 0,
                filter: 'blur(0px)'
              }}
              exit={{ 
                opacity: 0,
                y: -40,
                filter: 'blur(15px)'
              }}
              transition={{ 
                duration: 0.7,
                delay: 0.2,
                ease: [0.6, 0.01, 0.05, 0.95]
              }}
            >
              {/* Add glow effect to text */}
              <motion.span
                animate={{
                  textShadow: [
                    `0 0 10px ${theme.glow}20`,
                    `0 0 20px ${theme.glow}40`,
                    `0 0 10px ${theme.glow}20`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Your text content here */}
              </motion.span>
            </motion.p>
          </AnimatePresence>

          <div className="hidden xl:flex xl:justify-center xl:space-x-10 xl:items-center xl:absolute xl:bottom-20 xl:transform xl:translate-x-1/6 xl:z-20">
            <motion.div
              variants={fadeIn("up", 0.5)}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <ProjectsBtn className="scale-90" />
            </motion.div>

            <motion.div
              variants={fadeIn("down", 0.6)}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            >
              <ChatBtn className="scale-90" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0">
          {/* Multi-layered Animated Glow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`glow-${currentTheme}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Layer 1 - Fast pulse */}
              <motion.div
                className={`absolute inset-0 ${theme.glowOverlay} blur-3xl`}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Layer 2 - Slow wave */}
              <motion.div
                className={`absolute inset-0 ${theme.glowOverlay} blur-2xl`}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <ParticlesContainer style={{ zIndex: 0 }} />

        {/* Avatar with Epic Entry */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`avatar-container-${currentTheme}`}
            className="w-full h-full absolute"
            style={{
              zIndex: 5,
              bottom: theme.position.bottom,
              right: theme.position.lgRight, 
              maxWidth: theme.size.maxWidth,
              maxHeight: theme.size.maxHeight
            }}
            initial={{ 
              opacity: 0,
              scale: 0.7,
              x: 300,
              rotateY: -60,
              filter: 'blur(40px) brightness(0.2)'
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: 0,
              rotateY: 0,
              filter: 'blur(0px) brightness(1)'
            }}
            exit={{ 
              opacity: 0,
              scale: 0.8,
              x: -300,
              rotateY: 60,
              filter: 'blur(40px) brightness(0.2)'
            }}
            transition={{ 
              duration: 1,
              ease: [0.6, 0.01, 0.05, 0.95],
              delay: 0.2
            }}
          >
            <div className="relative">
              {/* Explosive Glow Entry */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`avatar-glow-${currentTheme}`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${theme.glow}60, ${theme.glow}30 50%, transparent 80%)`,
                  }}
                  initial={{ 
                    scale: 0,
                    opacity: 0,
                    rotate: -180
                  }}
                  animate={{ 
                    scale: [0, 2.5, 1.5],
                    opacity: [0, 1, 0.6],
                    rotate: 0
                  }}
                  exit={{ 
                    scale: 0,
                    opacity: 0,
                    rotate: 180
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: "easeOut",
                    scale: { duration: 1 }
                  }}
                />
              </AnimatePresence>

              {/* Continuous Pulse */}
              <motion.div
                className={`absolute inset-0 ${theme.glowClass} blur-2xl rounded-full`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <Avatar />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;