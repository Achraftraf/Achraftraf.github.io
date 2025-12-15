import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('crimson');

  const themes = {
    crimson: {
      name: 'Crimson Blade',
      primary: '#dc2626',
      secondary: '#450a0a',
      accent: '#7f1d1d',
      glow: '#ef4444',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 50%, #991b1b 100%)'
    },
    shadow: {
      name: 'Shadow Realm',
      primary: '#7c3aed',
      secondary: '#2e1065',
      accent: '#4c1d95',
      glow: '#a78bfa',
      icon: '🌙',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #6d28d9 100%)'
    },
    emerald: {
      name: 'Emerald Assassin',
      primary: '#059669',
      secondary: '#064e3b',
      accent: '#065f46',
      glow: '#34d399',
      icon: '🗡️',
      gradient: 'linear-gradient(135deg, #022c22 0%, #047857 50%, #059669 100%)'
    },
    midnight: {
      name: 'Midnight Steel',
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#1e3a8a',
      glow: '#60a5fa',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)'
    },
    obsidian: {
      name: 'Obsidian Void',
      primary: '#18181b',
      secondary: '#09090b',
      accent: '#27272a',
      glow: '#71717a',
      icon: '💀',
      gradient: 'linear-gradient(135deg, #000000 0%, #27272a 50%, #3f3f46 100%)'
    },
    phoenix: {
      name: 'Phoenix Fire',
      primary: '#ea580c',
      secondary: '#7c2d12',
      accent: '#9a3412',
      glow: '#fb923c',
      icon: '🔥',
      gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 50%, #ea580c 100%)'
    }
  };

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState(null);

  const currentThemeData = themes[currentTheme];

  return (
    <>
      {/* Overlay background when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-8 right-8 z-50">
        {/* Main Toggle Button with Epic Design */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${currentThemeData.glow}, transparent 60%, ${currentThemeData.glow})`,
              filter: `blur(8px)`,
              opacity: 0.8
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle pulsing aura */}
          <motion.div
            className="absolute -inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${currentThemeData.glow}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Main button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-20 h-20 rounded-full overflow-hidden"
            whileTap={{ scale: 0.9 }}
            style={{
              background: currentThemeData.gradient,
              boxShadow: `0 0 40px ${currentThemeData.glow}60, 
                          0 0 80px ${currentThemeData.glow}30,
                          inset 0 2px 20px rgba(255,255,255,0.1),
                          inset 0 -2px 20px rgba(0,0,0,0.5)`
            }}
          >
            {/* Animated border */}
            <motion.div
              className="absolute inset-0.5 rounded-full"
              style={{
                background: currentThemeData.gradient,
                boxShadow: `inset 0 0 20px ${currentThemeData.secondary}`
              }}
            />

            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={currentTheme}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-4xl"
                style={{
                  filter: `drop-shadow(0 0 8px ${currentThemeData.glow})`
                }}
              >
                {currentThemeData.icon}
              </motion.div>
            </div>

            {/* Hexagon overlay pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, ${currentThemeData.glow} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Rotating shine */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(var(--angle), transparent 0%, ${currentThemeData.glow}40 50%, transparent 100%)`,
              }}
              animate={{ 
                '--angle': ['0deg', '360deg']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Cross slash effect */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <motion.div
                className="absolute w-1 h-full left-1/2 -translate-x-1/2"
                style={{ 
                  background: `linear-gradient(to bottom, transparent, ${currentThemeData.glow}, transparent)`,
                  transform: 'rotate(45deg)',
                  transformOrigin: 'center'
                }}
                animate={{
                  scaleY: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.button>

          {/* Orbiting particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: currentThemeData.glow,
                top: '50%',
                left: '50%',
                boxShadow: `0 0 10px ${currentThemeData.glow}`
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 2) * 50],
                y: [0, Math.sin(i * Math.PI / 2) * 50],
                scale: [1, 0.5, 1],
                opacity: [0.8, 0.3, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Theme Selection Menu - Epic Grid */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-24 right-0 p-6 rounded-2xl"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${currentThemeData.glow}40`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.8), 
                            0 0 40px ${currentThemeData.glow}20,
                            inset 0 1px 0 rgba(255,255,255,0.1)`
              }}
            >
              {/* Menu title */}
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-white tracking-wider mb-1">
                  SELECT YOUR POWER
                </h3>
                <div 
                  className="h-0.5 w-32 mx-auto"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${currentThemeData.glow}, transparent)`
                  }}
                />
              </motion.div>

              {/* Theme grid */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(themes).map(([key, theme], index) => {
                  const isActive = currentTheme === key;
                  const isHovered = hoveredTheme === key;
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                    >
                      <motion.button
                        onClick={() => {
                          switchTheme(key);
                          setTimeout(() => setIsOpen(false), 300);
                        }}
                        onHoverStart={() => setHoveredTheme(key)}
                        onHoverEnd={() => setHoveredTheme(null)}
                        className="relative w-36 h-32 rounded-xl overflow-hidden group"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: theme.gradient,
                          boxShadow: isActive 
                            ? `0 0 30px ${theme.glow}80, 
                               0 10px 30px rgba(0,0,0,0.5),
                               inset 0 0 20px ${theme.glow}40`
                            : `0 5px 20px rgba(0,0,0,0.5),
                               inset 0 0 10px rgba(0,0,0,0.5)`,
                          border: isActive ? `2px solid ${theme.glow}` : '2px solid transparent'
                        }}
                      >
                        {/* Animated background pattern */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `repeating-linear-gradient(
                              45deg,
                              ${theme.glow} 0px,
                              ${theme.glow} 2px,
                              transparent 2px,
                              transparent 12px
                            )`
                          }}
                        />

                        {/* Diagonal shine sweep */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(120deg, transparent 30%, ${theme.glow}50 50%, transparent 70%)`
                          }}
                          initial={{ x: '-100%', y: '-100%' }}
                          animate={isHovered ? { x: '100%', y: '100%' } : {}}
                          transition={{ duration: 0.6 }}
                        />

                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center p-4 z-10">
                          {/* Icon */}
                          <motion.div
                            className="text-5xl mb-3"
                            animate={isActive ? { 
                              rotate: [0, 10, -10, 10, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ 
                              duration: 0.6,
                              repeat: isActive ? Infinity : 0,
                              repeatDelay: 2
                            }}
                            style={{
                              filter: `drop-shadow(0 0 12px ${theme.glow})`
                            }}
                          >
                            {theme.icon}
                          </motion.div>

                          {/* Name */}
                          <div className="text-white font-bold text-xs text-center tracking-wider leading-tight">
                            {theme.name}
                          </div>

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <motion.div
                                className="w-3 h-3 rounded-full"
                                style={{ 
                                  backgroundColor: theme.glow,
                                  boxShadow: `0 0 15px ${theme.glow}`
                                }}
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [1, 0.6, 1]
                                }}
                                transition={{ 
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </motion.div>
                          )}

                          {/* Bottom glow bar */}
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1"
                            style={{ backgroundColor: theme.glow }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: isActive || isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 opacity-50"
                             style={{ borderColor: theme.glow }} />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 opacity-50"
                             style={{ borderColor: theme.glow }} />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating energy particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: currentThemeData.glow,
                boxShadow: `0 0 8px ${currentThemeData.glow}`,
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 120],
                y: [0, (Math.random() - 0.5) * 120],
                opacity: [0.9, 0],
                scale: [1, 0.3]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// Demo Component
const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <ThemeSwitcher />
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
            DARK REALM
          </h1>
          <p className="text-gray-400 text-lg">
            Click the orb to unleash your power
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;