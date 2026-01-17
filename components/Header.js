import Link from 'next/link';
import Socials from '../components/Socials';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className='absolute z-30 w-full flex items-center px-6 sm:px-12 xl:px-0 h-[80px] lg:h-[100px]'>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center py-6 lg:py-8'>
          {/* Logo - Pro & Fantastic */}
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

                {/* Name with Staggered Letter Animation */}
                <motion.span
                  className="relative flex items-center overflow-hidden"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
                  }}
                >
                  {"zarouki achraf".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: { opacity: 1, y: 0, rotateX: 0 }
                      }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.brightGradient ? theme.brightGradient : 'from-white to-gray-400'} font-extrabold tracking-tight cursor-default inline-block hover:text-white transition-colors duration-300`}
                      whileHover={{
                        y: -5,
                        scale: 1.3,
                        rotate: Math.random() * 10 - 5,
                        color: "#fff",
                        textShadow: "0 0 8px rgba(255,255,255,0.8)"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}

                  {/* Blinking Cursor */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className={`w-[3px] h-6 lg:h-8 ml-1 ${theme.accent.replace('text-', 'bg-')}`}
                  />
                </motion.span>

                {/* Underline Glow - now more subtle and aligned */}
                <span className={`absolute -bottom-2 md:-bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${theme.brightGradient || 'from-blue-500 to-purple-500'} group-hover:w-full transition-all duration-700 ease-out`} />

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
