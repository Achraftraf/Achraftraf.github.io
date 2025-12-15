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
    <div className="bg-primary/60 h-full">
      <ThemeSwitcher />
      
      {/* Animated Background Gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentTheme}`}
          className={`w-full h-full bg-gradient-to-r ${theme.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto">
            {/* Animated Title with Interactive Effects */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentTheme}`}
                variants={fadeIn("down", 0.2)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                className="h1 mb-20"
                transition={{ duration: 0.5 }}
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
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                className={`max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-20 xl:mb-20 ${theme.textColor}`}
                transition={{ duration: 0.5, delay: 0.1 }}
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
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
                    opacity: 1, 
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
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