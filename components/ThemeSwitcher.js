import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { currentTheme, switchTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNearButton, setIsNearButton] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Magnetic hover effect handler
  const handleMouseMove = (e) => {
    const button = e.currentTarget.getBoundingClientRect();
    const centerX = button.left + button.width / 2;
    const centerY = button.top + button.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < 100) {
      setIsNearButton(true);
      setMousePosition({
        x: distanceX * 0.15,
        y: distanceY * 0.15
      });
    } else {
      setIsNearButton(false);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  // Particle burst on click
  const createParticleBurst = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i * 360) / 12,
      color: themes[currentTheme].glow
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleThemeSwitch = (themeName) => {
    setIsTransitioning(true);
    createParticleBurst();
    setTimeout(() => {
      switchTheme(themeName);
      setIsOpen(false);
      setTimeout(() => setIsTransitioning(false), 600);
    }, 150);
  };

  return (
    <motion.div
      className="fixed top-1/3 left-[43%] transform -translate-x-1/2 -translate-y-1/2 z-50"
      initial={{
        scale: 0,
        rotate: -360,
        opacity: 0,
        y: -200,
        filter: "blur(20px)"
      }}
      animate={{
        scale: 1,
        rotate: 0,
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        x: mousePosition.x,
        y: mousePosition.y
      }}
      transition={{
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", stiffness: 100, damping: 15, delay: 0.3 },
        rotate: { duration: 1.5, ease: "easeOut" },
        opacity: { duration: 1.2 },
        y: { type: "spring", stiffness: 80, damping: 12, delay: 0.2 },
        filter: { duration: 1.2 },
        x: { type: "spring", stiffness: 150, damping: 20 },
      }}
      onAnimationComplete={() => setHasAnimated(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsNearButton(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Main Toggle Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          createParticleBurst();
        }}
        className="relative w-16 h-16 rounded-full overflow-hidden"
        whileHover={{
          scale: 1.12,
          rotateY: isNearButton ? mousePosition.x * 0.3 : 0,
          rotateX: isNearButton ? -mousePosition.y * 0.3 : 0,
        }}
        whileTap={{ scale: 0.88 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        style={{
          background: `linear-gradient(135deg, ${themes[currentTheme].primary}, ${themes[currentTheme].secondary})`,
          boxShadow: `
            0 0 40px ${themes[currentTheme].glow}50,
            0 8px 32px rgba(0,0,0,0.6),
            inset 0 0 25px rgba(0,0,0,0.5),
            inset 0 2px 2px rgba(255,255,255,0.1)
          `,
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Initial explosion ring */}
        {!hasAnimated && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${themes[currentTheme].glow}ff, ${themes[currentTheme].glow}00)`,
              border: `2px solid ${themes[currentTheme].glow}`
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 3, 5],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 1.5,
              delay: 0.8,
              ease: "easeOut"
            }}
          />
        )}

        {/* Rotating border glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${themes[currentTheme].glow}dd, transparent 120deg, ${themes[currentTheme].glow}dd 240deg, transparent)`,
            opacity: 0.6
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Shimmer sweep effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${themes[currentTheme].glow}60, transparent)`,
            opacity: 0
          }}
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />

        {/* Inner circle with enhanced depth */}
        <div
          className="absolute inset-[3px] rounded-full flex items-center justify-center text-2xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${themes[currentTheme].primary}f0, ${themes[currentTheme].secondary}f0)`,
            boxShadow: `
              inset 0 0 20px ${themes[currentTheme].glow}30,
              inset 0 -2px 8px rgba(0,0,0,0.7),
              0 0 15px ${themes[currentTheme].glow}20
            `
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTheme}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {themes[currentTheme].icon}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Enhanced pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${themes[currentTheme].glow}40, transparent 70%)`,
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Corner sparkles */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: themes[currentTheme].glow,
              boxShadow: `0 0 6px ${themes[currentTheme].glow}`,
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${angle}deg) translateX(30px)`
            }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Multi-layer Glow Rings */}
        {[1, 2, 3].map((layer) => (
          <motion.div
            key={`glow-${layer}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: `-${layer * 8}px`,
              border: `1px solid ${themes[currentTheme].glow}`,
              opacity: 0.15 / layer
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15 / layer, 0.25 / layer, 0.15 / layer]
            }}
            transition={{
              duration: 2 + layer * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: layer * 0.2
            }}
          />
        ))}

        {/* Rotating energy ring */}
        <motion.div
          className="absolute inset-[-12px] rounded-full pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${themes[currentTheme].glow}40, transparent, ${themes[currentTheme].glow}40, transparent)`,
            opacity: 0.4
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.button>

      {/* Particle Burst Effect */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px'
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              x: Math.cos((particle.angle * Math.PI) / 180) * 80,
              y: Math.sin((particle.angle * Math.PI) / 180) * 80,
              opacity: [1, 0.8, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}
          />
        ))}
      </AnimatePresence>

      {/* Aurora Background Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated aurora waves */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '300px',
                  height: '300px',
                  marginLeft: '-150px',
                  marginTop: '-150px',
                  background: `radial-gradient(circle, ${themes[currentTheme].glow}15, transparent 70%)`,
                  filter: 'blur(20px)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Constellation Lines Between Orbs */}
      <AnimatePresence>
        {isOpen && (
          <svg
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: '400px',
              height: '400px',
              overflow: 'visible'
            }}
          >
            {Object.entries(themes).map(([key, theme], index) => {
              const angle = (index * 360) / Object.entries(themes).length;
              const radius = 103;
              const x1 = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y1 = Math.sin((angle - 90) * Math.PI / 180) * radius;

              const nextIndex = (index + 1) % Object.entries(themes).length;
              const nextAngle = (nextIndex * 360) / Object.entries(themes).length;
              const x2 = Math.cos((nextAngle - 90) * Math.PI / 180) * radius;
              const y2 = Math.sin((nextAngle - 90) * Math.PI / 180) * radius;

              return (
                <motion.line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={themes[currentTheme].glow}
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: `drop-shadow(0 0 4px ${themes[currentTheme].glow})`
                  }}
                />
              );
            })}
          </svg>
        )}
      </AnimatePresence>

      {/* Theme Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-2 top-0 flex flex-row gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Object.entries(themes).map(([key, theme], index) => {
              const angle = (index * 360) / Object.entries(themes).length;
              const radius = 103;
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

              return (
                <motion.div
                  key={key}
                  className="absolute"
                  style={{ left: 0, top: 0 }}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0,
                    rotate: -180,
                    filter: "blur(10px)"
                  }}
                  animate={{
                    opacity: 1,
                    x: [x, x * 1.02, x],
                    y: [y, y * 1.02, y],
                    scale: 1,
                    rotate: [0, 5, 0],
                    filter: "blur(0px)"
                  }}
                  exit={{
                    opacity: 0,
                    x: x * 0.3,
                    y: y * 0.3,
                    scale: 0,
                    rotate: 180,
                    filter: "blur(10px)"
                  }}
                  transition={{
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    mass: 0.8,
                    x: { duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <motion.button
                    onClick={() => handleThemeSwitch(key)}
                    className="group relative w-16 h-16 rounded-full overflow-hidden"
                    whileHover={{
                      scale: 1.15,
                      rotate: 15,
                      transition: { type: "spring", stiffness: 400, damping: 20 }
                    }}
                    whileTap={{ scale: 0.90 }}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      boxShadow: currentTheme === key
                        ? `
                            0 0 40px ${theme.glow}80,
                            0 0 70px ${theme.glow}40,
                            0 8px 28px rgba(0,0,0,0.8),
                            inset 0 0 25px rgba(0,0,0,0.6),
                            inset 0 2px 2px rgba(255,255,255,0.15)
                          `
                        : `
                            0 6px 22px rgba(0,0,0,0.7),
                            0 2px 10px rgba(0,0,0,0.6),
                            inset 0 0 15px rgba(0,0,0,0.5),
                            inset 0 1px 1px rgba(255,255,255,0.08)
                          `
                    }}
                  >
                    {/* Rotating border for each orb */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, ${theme.glow}cc, transparent 180deg, ${theme.glow}cc)`,
                        opacity: 0.6
                      }}
                      animate={{ rotate: currentTheme === key ? 360 : -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Animated shine sweep */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${theme.glow}50, transparent)`,
                        opacity: 0
                      }}
                      whileHover={{
                        opacity: 1,
                        rotate: [0, 180],
                        transition: { duration: 0.6, ease: "easeInOut" }
                      }}
                    />

                    {/* Diagonal pattern with depth */}
                    <div
                      className="absolute inset-0 rounded-full opacity-[0.08]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg, 
                          ${theme.glow} 0px, 
                          ${theme.glow} 1px, 
                          transparent 1px, 
                          transparent 6px
                        )`
                      }}
                    />

                    {/* Active state glowing border */}
                    {currentTheme === key && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2px solid ${theme.glow}`,
                            boxShadow: `
                              inset 0 0 20px ${theme.glow}50,
                              0 0 25px ${theme.glow}40
                            `
                          }}
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [0.95, 1, 0.95]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        {/* Inner glow layer */}
                        <div
                          className="absolute inset-[2px] rounded-full"
                          style={{
                            background: `radial-gradient(circle, ${theme.glow}12, transparent 60%)`
                          }}
                        />
                      </>
                    )}

                    {/* Particle trail for each orb */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`trail-${i}`}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: theme.glow,
                          boxShadow: `0 0 4px ${theme.glow}`,
                          left: '50%',
                          top: '50%',
                          marginLeft: '-2px',
                          marginTop: '-2px'
                        }}
                        animate={{
                          x: [0, -15 - i * 5, 0],
                          y: [0, -15 - i * 5, 0],
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeOut"
                        }}
                      />
                    ))}

                    {/* Content - Icon centered */}
                    <div className="relative flex items-center justify-center h-full w-full">
                      {/* Icon with mystical animation */}
                      <motion.div
                        className="text-3xl"
                        style={{
                          filter: `drop-shadow(0 0 10px ${theme.glow}90)`,
                          textShadow: `0 0 15px ${theme.glow}`
                        }}
                        animate={currentTheme === key ? {
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.15, 1]
                        } : {}}
                        transition={{
                          duration: 1.3,
                          repeat: currentTheme === key ? Infinity : 0,
                          repeatDelay: 2
                        }}
                      >
                        {theme.icon}
                      </motion.div>
                    </div>

                    {/* Pulse ring for active theme */}
                    {currentTheme === key && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: `1px solid ${theme.glow}`,
                          opacity: 0.6
                        }}
                        animate={{
                          scale: [1, 1.3, 1.5],
                          opacity: [0.6, 0.3, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}

                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                      initial={{ opacity: 0, y: -5 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className="px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}dd, ${theme.secondary}dd)`,
                          boxShadow: `0 4px 12px rgba(0,0,0,0.6), 0 0 20px ${theme.glow}30`,
                          color: 'white',
                          textShadow: `0 0 8px ${theme.glow}60`
                        }}
                      >
                        {theme.name}
                      </div>
                    </motion.div>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mystical floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: themes[currentTheme].glow,
              boxShadow: `0 0 6px ${themes[currentTheme].glow}`,
              left: '50%',
              top: '50%',
              filter: 'blur(0.5px)'
            }}
            animate={{
              x: [0, (Math.cos(i * 72 * Math.PI / 180) * 50)],
              y: [0, (Math.sin(i * 72 * Math.PI / 180) * 50)],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ThemeSwitcher;