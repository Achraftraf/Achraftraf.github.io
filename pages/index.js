import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";
import ChatBtn from "../components/ChatBtn";
import ThemeSwitcher from "../components/ThemeSwitcher";

import { fadeIn } from "../variants";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const { theme, currentTheme } = useTheme();
  const [transitioning, setTransitioning] = useState(false);
  const [afterTransition, setAfterTransition] = useState(null);

  const startThemeTransition = (callback) => {
    setTransitioning(true);

    setTimeout(() => {
      callback();
    }, 450);

    setTimeout(() => {
      setTransitioning(false);
    }, 900);
  };

  return (
    <div className="bg-primary/60 h-full overflow-hidden">
      {/* 🎬 CINEMATIC THEME CURTAIN */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.45, ease: [0.77, 0, 0.18, 1] }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </AnimatePresence>

      <ThemeSwitcher startThemeTransition={startThemeTransition} />

      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          className={`w-full h-full bg-gradient-to-r ${theme.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto h-full flex flex-col justify-center">
            <motion.h1
              variants={fadeIn("down", 0.2)}
              initial="hidden"
              animate="show"
              className="h1 mb-20"
            >
              Full-Stack <br />
              <span className={theme.accent}>Engineer.</span>
            </motion.h1>

            <div className="hidden xl:flex gap-10">
              <ProjectsBtn />
              <ChatBtn />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ParticlesContainer />

      <motion.div
        key={`avatar-${currentTheme}`}
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        animate="show"
        className="absolute right-0 bottom-0"
        style={{
          maxWidth: theme.size.maxWidth,
          maxHeight: theme.size.maxHeight
        }}
      >
        <Avatar />
      </motion.div>
    </div>
  );
};

export default Home;
