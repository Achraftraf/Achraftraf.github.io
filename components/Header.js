import Link from 'next/link';
import Socials from '../components/Socials';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const GlitchText = ({ text, theme }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text
        .split("")
        .map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; // Speed of decoding
    }, 30);
  };

  return (
    <motion.span
      onHoverStart={scramble}
      className={`relative font-mono font-bold tracking-tighter ${theme.brightGradient ? 'bg-clip-text text-transparent bg-gradient-to-r ' + theme.brightGradient : 'text-white'}`}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className={`inline-block w-[10px] h-[3px] mb-1 ml-1 ${theme.accent.replace('text-', 'bg-')}`}
      />
    </motion.span>
  );
};

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className='absolute z-30 w-full flex items-center px-6 sm:px-12 xl:px-0 h-[80px] lg:h-[100px]'>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center py-6 lg:py-8'>
          {/* Logo - Ultra Pro & Fantastic Entrance */}
          <Link href={'/'}>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="group cursor-pointer relative py-2"
            >
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter flex items-center gap-2 font-mono">
                {/* Opening Bracket - Slides in */}
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`text-2xl lg:text-3xl ${theme.accent} transition-transform duration-500 group-hover:-translate-x-2 group-hover:scale-110`}
                >
                  &lt;
                </motion.span>

                {/* Cyberpunk Glitch Text */}
                <div className="relative">
                  <GlitchText text="zarouki achraf" theme={theme} />
                  {/* Scanline Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />
                </div>

                {/* Closing Bracket - Slides in */}
                <motion.span
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`text-2xl lg:text-3xl ${theme.accent} transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-110`}
                >
                  /&gt;
                </motion.span>
              </h1>

              {/* Cinematic Glow - Pulses on load */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.3, 0], scale: 1.2 }}
                transition={{ delay: 1, duration: 1.5 }}
                className={`absolute -inset-4 bg-gradient-to-r ${theme.brightGradient} rounded-full blur-2xl -z-10`}
              />
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.brightGradient} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700 -z-10`} />
            </motion.div>
          </Link>

          {/* Socials */}
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
