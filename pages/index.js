import React, { useState, useEffect } from "react";
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
  const [showRipple, setShowRipple] = useState(false);

  // Listen for theme changes to trigger ripple effect
  useEffect(() => {
    setShowRipple(true);
    const timer = setTimeout(() => setShowRipple(false), 1000);
    return () => clearTimeout(timer);
  }, [currentTheme]);

  return (
    <div className="bg-primary/60 h-full relative overflow-hidden">
      <ThemeSwitcher />

      {/* Ripple Transition Effect */}
      <AnimatePresence>
        {showRipple && (
          <>
            <motion.div
              className="fixed pointer-events-none z-40"
              style={{
                left: '43%',
                top: '33.33%',
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2"
                  style={{
                    borderColor: theme.glow,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{
                    width: 2000,
                    height: 2000,
                    opacity: 0
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              ))}
            </motion.div>

            {/* Color wash overlay */}
            <motion.div
              className="fixed inset-0 pointer-events-none z-30"
              style={{
                background: `radial-gradient(circle at 43% 33%, ${theme.glow}30, transparent 60%)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Animated Background Gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentTheme}`}
          className={`w-full h-full bg-gradient-to-r ${theme.gradient}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <div className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto">
            {/* Animated Title with Interactive Effects */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentTheme}`}
                variants={fadeIn("down", 0.2)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)', scale: 0.95 }}
                className="h1 mb-20"
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                    textShadow: `0 0 30px ${theme.glow}`,
                    transition: { duration: 0.5 }
                  }}
                >
                  Full-Stack
                </motion.span>{" "}
                <br />
                <motion.span
                  className={`inline-block ${theme.accent}`}
                  animate={{
                    textShadow: [
                      `0 0 20px ${theme.glow}`,
                      `0 0 40px ${theme.glow}`,
                      `0 0 20px ${theme.glow}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{
                    scale: 1.15,
                    rotate: [0, 5, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  Engineer.
                </motion.span>
              </motion.h1>
            </AnimatePresence>

            {/* Animated Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentTheme}`}
                variants={fadeIn("down", 0.3)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -20, filter: "blur(8px)", scale: 0.96 }}
                className={`max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-20 xl:mb-20 ${theme.textColor}`}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {/* You can add your description text here */}
              </motion.p>
            </AnimatePresence>

            {/* For larger screens */}
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
        </motion.div>
      </AnimatePresence>

      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        {/* Background explosion effect */}
        <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0">
          {/* Animated Glow Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`glow-${currentTheme}`}
              className={`absolute inset-0 ${theme.glowOverlay} blur-3xl`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
        </div>

        <ParticlesContainer style={{ zIndex: 0 }} />

        {/* Animated Avatar Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`avatar-container-${currentTheme}`}
            variants={fadeIn("up", 0.5)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.92, filter: 'blur(15px)', y: 20 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-full h-full absolute"
            style={{
              zIndex: 5,
              bottom: theme.position.bottom,
              right: theme.position.lgRight,
              maxWidth: theme.size.maxWidth,
              maxHeight: theme.size.maxHeight
            }}
          >
            <div className="relative">
              {/* Animated Glow Effect */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`avatar-glow-${currentTheme}`}
                  className={`absolute inset-0 ${theme.glowClass} blur-2xl rounded-full`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    exit: { duration: 0.5 }
                  }}
                />
              </AnimatePresence>
              <Avatar />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;