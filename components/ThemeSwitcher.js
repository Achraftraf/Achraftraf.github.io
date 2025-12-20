import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = ({ startThemeTransition }) => {
  const { currentTheme, switchTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSwitch = (themeName) => {
    setIsOpen(false);
    startThemeTransition(() => switchTheme(themeName));
  };

  return (
    <div className="fixed top-1/3 left-[43%] -translate-x-1/2 -translate-y-1/2 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full overflow-hidden"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          background: `linear-gradient(135deg, ${themes[currentTheme].primary}, ${themes[currentTheme].secondary})`,
          boxShadow: `0 0 40px ${themes[currentTheme].glow}60`
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTheme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="absolute inset-0 flex items-center justify-center text-2xl"
          >
            {themes[currentTheme].icon}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Object.entries(themes).map(([key, theme], i) => {
              const angle = (i * 360) / Object.keys(themes).length;
              const x = Math.cos(angle * Math.PI / 180) * 110;
              const y = Math.sin(angle * Math.PI / 180) * 110;

              return (
                <motion.button
                  key={key}
                  onClick={() => handleThemeSwitch(key)}
                  className="absolute w-14 h-14 rounded-full text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 0 25px ${theme.glow}70`
                  }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ x, y, scale: 1 }}
                  exit={{ x: 0, y: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {theme.icon}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
