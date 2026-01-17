import Link from 'next/link';
import Socials from '../components/Socials';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Ultimate Mecha-Holo Logo Component
const RobotLogo = ({ theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [text, setText] = useState("zarouki achraf");

  // Binary Scramble Logic
  useEffect(() => {
    let interval;
    if (isHovered) {
      let iteration = 0;
      const targetText = "zarouki achraf";
      const codingChars = "010101_██▓▒░<>";

      interval = setInterval(() => {
        setText(targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            return codingChars[Math.floor(Math.random() * codingChars.length)];
          })
          .join("")
        );
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 2;
      }, 30);
    } else {
      setText("zarouki achraf");
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative cursor-pointer select-none p-2"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Tech Borders - Animated Corners */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <motion.div
          animate={{ x: isHovered ? -5 : 0, y: isHovered ? -5 : 0, opacity: isHovered ? 1 : 0 }}
          className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${theme.accent.replace('text-', 'border-')}`}
        />
        {/* Bottom Right */}
        <motion.div
          animate={{ x: isHovered ? 5 : 0, y: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0 }}
          className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${theme.accent.replace('text-', 'border-')}`}
        />
      </div>

      {/* Main Container */}
      <motion.div
        className="flex items-center gap-1.5 font-mono relative z-20"
        initial={{ scale: 0.95 }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Left Bracket */}
        <motion.span
          animate={{ x: isHovered ? -8 : 0 }}
          className={`text-xl lg:text-3xl font-bold ${theme.accent}`}
        >
          &lt;
        </motion.span>

        {/* The Name with RGB Glitch Effect */}
        <div className="relative">
          {/* Glitch Layer Red */}
          <motion.span
            className="absolute inset-0 text-red-500 opacity-0 mix-blend-screen"
            animate={{
              opacity: isHovered ? [0, 0.8, 0] : 0,
              x: isHovered ? [-2, 2, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 0.5 }}
          >
            {text}
          </motion.span>

          {/* Glitch Layer Blue */}
          <motion.span
            className="absolute inset-0 text-blue-500 opacity-0 mix-blend-screen"
            animate={{
              opacity: isHovered ? [0, 0.8, 0] : 0,
              x: isHovered ? [2, -2, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 0.4 }}
          >
            {text}
          </motion.span>

          {/* Main Text */}
          <motion.span
            className={`text-lg lg:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${theme.brightGradient ? theme.brightGradient : 'from-white to-gray-400'} z-10 relative`}
          >
            {text}
          </motion.span>

          {/* Laser Scanner Eye */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute top-0 bottom-0 w-2 bg-white blur-[2px] opacity-50 z-20 mix-blend-overlay`}
          />
        </div>

        {/* Right Bracket */}
        <motion.span
          animate={{ x: isHovered ? 8 : 0 }}
          className={`text-xl lg:text-3xl font-bold ${theme.accent}`}
        >
          /&gt;
        </motion.span>
      </motion.div>

      {/* HUD Details */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`absolute -bottom-4 left-0 right-0 flex justify-between text-[7px] lg:text-[8px] tracking-widest ${theme.accent}`}
          >
            <span>SYS.OK</span>
            <span>SECURE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Pulse on Hover */}
      <motion.div
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        className={`absolute inset-0 bg-gradient-to-r ${theme.brightGradient} blur-xl -z-10 transition-all duration-300`}
      />
    </motion.div>
  );
};

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className='absolute z-30 w-full flex items-center px-6 sm:px-12 xl:px-0 h-[80px] lg:h-[100px]'>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center py-6 lg:py-8'>

          <Link href={'/'}>
            <RobotLogo theme={theme} />
          </Link>

          {/* Socials */}
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
