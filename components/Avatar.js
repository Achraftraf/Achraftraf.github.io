import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Avatar = () => {
  const { theme, currentTheme } = useTheme();
  
  return (
    <div className="hidden xl:flex xl:max-w-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ 
            opacity: 0,
            scale: 0.6,
            rotateY: -90,
            rotateZ: -25,
            x: 200,
            y: -50,
            filter: 'blur(40px) brightness(0.2) saturate(0.2) hue-rotate(45deg)'
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateZ: 0,
            x: 0,
            y: 0,
            filter: 'blur(0px) brightness(1) saturate(1) hue-rotate(0deg)'
          }}
          exit={{ 
            opacity: 0,
            scale: 0.5,
            rotateY: 90,
            rotateZ: 25,
            x: -200,
            y: 50,
            filter: 'blur(45px) brightness(0.1) saturate(0.1) hue-rotate(-45deg)'
          }}
          transition={{ 
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1.5, ease: [0.34, 1.56, 0.64, 1] },
            rotateY: { duration: 1.6, ease: [0.19, 1, 0.22, 1] },
            filter: { duration: 1.2 }
          }}
          className="relative"
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: '2000px',
            willChange: 'transform'
          }}
        >
          {/* Deep ambient glow foundation */}
          <motion.div
            className="absolute inset-0 -z-40 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 55% 50%, ${theme.glow}60, ${theme.glow}30 55%, transparent 85%)`,
              filter: 'blur(100px)'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.8, 0.6, 0.8],
              scale: [0.5, 1.25, 1.1, 1.25]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95],
              times: [0, 0.33, 0.66, 1]
            }}
          />

          {/* Flowing energy aura */}
          <motion.div
            className="absolute inset-0 -z-38 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 60% 48%, ${theme.glow}50, ${theme.glow}20 50%, transparent 75%)`,
              filter: 'blur(80px)',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0.4, 0.75, 0.5, 0.75],
              scale: [1, 1.18, 1.08, 1.18],
              x: [-15, 15, -8, 15],
              y: [-8, 8, -4, 8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            }}
          />

          {/* Radiant core pulse */}
          <motion.div
            className="absolute inset-0 -z-36 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 58% 45%, ${theme.glow}85, ${theme.glow}45 45%, transparent 70%)`,
              filter: 'blur(60px)'
            }}
            animate={{
              opacity: [0.6, 1, 0.7, 1],
              scale: [0.9, 1.15, 1, 1.15]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1],
              times: [0, 0.33, 0.66, 1]
            }}
          />

          {/* Massive entrance explosion */}
          <motion.div
            className="absolute inset-0 -z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ 
              opacity: [0, 1.5, 0.9, 0],
              scale: [0.3, 2, 1.6, 3]
            }}
            transition={{ 
              duration: 1.8,
              times: [0, 0.25, 0.5, 1],
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              background: `radial-gradient(circle, ${theme.glow}FF, ${theme.glow}AA 30%, ${theme.glow}50 55%, transparent 80%)`,
              mixBlendMode: 'screen',
              filter: 'blur(50px)'
            }}
          />

          {/* Expanding cosmic rings */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`cosmic-ring-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: '0',
                border: `${3 - i * 0.4}px solid ${theme.glow}`,
                boxShadow: `
                  0 0 ${35 - i * 6}px ${theme.glow}DD,
                  inset 0 0 ${25 - i * 4}px ${theme.glow}AA,
                  0 0 ${50 - i * 8}px ${theme.glow}60
                `,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ 
                scale: 0.4,
                opacity: 0,
                rotate: -180
              }}
              animate={{
                scale: [0.4, 1.8 + i * 0.35, 2.8 + i * 0.45],
                opacity: [0, 0.95, 0.7, 0],
                rotate: [-180, 90 + i * 45, 360 + i * 90]
              }}
              transition={{
                duration: 2.2,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.35, 0.7, 1]
              }}
            />
          ))}

          {/* Orbiting energy spheres */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            const radius = 200 + (i % 4) * 30;
            const duration = 2.5 + (i % 5) * 0.3;
            const delay = i * 0.06;
            
            return (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '14px',
                  height: '14px',
                  background: `radial-gradient(circle, white, ${theme.glow}FF 30%, ${theme.glow}AA)`,
                  boxShadow: `
                    0 0 25px ${theme.glow}FF,
                    0 0 40px ${theme.glow}AA,
                    0 0 60px ${theme.glow}60
                  `,
                  left: '50%',
                  top: '50%',
                  filter: 'blur(1.5px)'
                }}
                initial={{ 
                  opacity: 0,
                  x: 0,
                  y: 0,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 1, 0.9, 0.7, 0],
                  x: [
                    0, 
                    Math.cos((angle - 30) * Math.PI / 180) * radius * 0.4,
                    Math.cos(angle * Math.PI / 180) * radius,
                    Math.cos((angle + 40) * Math.PI / 180) * radius * 0.7,
                    Math.cos((angle + 80) * Math.PI / 180) * radius * 0.3
                  ],
                  y: [
                    0,
                    Math.sin((angle - 30) * Math.PI / 180) * radius * 0.4,
                    Math.sin(angle * Math.PI / 180) * radius,
                    Math.sin((angle + 40) * Math.PI / 180) * radius * 0.7,
                    Math.sin((angle + 80) * Math.PI / 180) * radius * 0.3
                  ],
                  scale: [0, 1.4, 1.8, 1.3, 0]
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.2, 0.5, 0.8, 1]
                }}
              />
            );
          })}

          {/* Double helix spiral */}
          {[...Array(20)].map((_, i) => {
            const helixAngle = (i * 360) / 10 + i * 18;
            const helixRadius = 80 + i * 10;
            const helixHeight = (i % 2) * 40 - 20;
            
            return (
              <motion.div
                key={`helix-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '8px',
                  height: '8px',
                  background: `radial-gradient(circle, ${theme.glow}FF, ${theme.glow}CC)`,
                  boxShadow: `0 0 16px ${theme.glow}FF, 0 0 30px ${theme.glow}80`,
                  left: '50%',
                  top: '50%',
                  filter: 'blur(1px)'
                }}
                initial={{ 
                  opacity: 0,
                  x: 0,
                  y: 0,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 0.95, 0.75, 0],
                  x: Math.cos(helixAngle * Math.PI / 180) * helixRadius,
                  y: Math.sin(helixAngle * Math.PI / 180) * helixRadius + helixHeight,
                  scale: [0, 1.8, 1.5, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.3, 0.7, 1]
                }}
              />
            );
          })}

          {/* Electric lightning bolts */}
          {[...Array(8)].map((_, i) => {
            const boltAngle = (i * 360) / 8;
            const boltDistance = 150;
            
            return (
              <motion.div
                key={`bolt-${i}`}
                className="absolute pointer-events-none"
                style={{
                  width: '3px',
                  height: '80px',
                  background: `linear-gradient(to bottom, ${theme.glow}FF, ${theme.glow}AA 50%, transparent)`,
                  boxShadow: `0 0 12px ${theme.glow}FF, 0 0 25px ${theme.glow}AA`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'top center',
                  transform: `translate(-50%, -50%) rotate(${boltAngle}deg)`,
                  filter: 'blur(1px)'
                }}
                initial={{ 
                  opacity: 0,
                  scaleY: 0
                }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scaleY: [0, 1.5, 1, 0],
                  x: Math.cos(boltAngle * Math.PI / 180) * boltDistance,
                  y: Math.sin(boltAngle * Math.PI / 180) * boltDistance
                }}
                transition={{
                  duration: 1,
                  delay: 0.2 + i * 0.05,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.3, 0.6, 1]
                }}
              />
            );
          })}

          {/* Stardust cloud */}
          {[...Array(30)].map((_, i) => {
            const cloudX = (Math.random() - 0.5) * 400;
            const cloudY = (Math.random() - 0.5) * 400;
            const cloudDelay = Math.random() * 0.8;
            const cloudDuration = 2 + Math.random() * 1.5;
            const cloudSize = 3 + Math.random() * 5;
            
            return (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${cloudSize}px`,
                  height: `${cloudSize}px`,
                  background: `radial-gradient(circle, white, ${theme.glow}FF)`,
                  boxShadow: `0 0 ${cloudSize * 3}px ${theme.glow}FF`,
                  left: '50%',
                  top: '50%',
                  filter: `blur(${cloudSize * 0.3}px)`
                }}
                initial={{ 
                  opacity: 0,
                  x: cloudX * 0.1,
                  y: cloudY * 0.1,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 0.9, 0.7, 0],
                  x: [cloudX * 0.1, cloudX * 0.8, cloudX * 1.2],
                  y: [cloudY * 0.1, cloudY * 0.8, cloudY * 1.2],
                  scale: [0, 1.5, 1, 0]
                }}
                transition={{
                  duration: cloudDuration,
                  delay: cloudDelay,
                  ease: "easeOut",
                  times: [0, 0.3, 0.7, 1]
                }}
              />
            );
          })}

          {/* Smooth dimensional rift effect */}
          <motion.div
            className="absolute inset-0 -z-25 pointer-events-none"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, 
                ${theme.glow}40 0deg,
                transparent 60deg,
                ${theme.glow}30 120deg,
                transparent 180deg,
                ${theme.glow}40 240deg,
                transparent 300deg,
                ${theme.glow}40 360deg
              )`,
              filter: 'blur(40px)',
              mixBlendMode: 'screen'
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
          />

          {/* Main image with perfect transition */}
          <motion.div
            initial={{ 
              filter: 'saturate(0.2) brightness(0.4) contrast(0.7) hue-rotate(30deg)',
              scale: 0.9,
              opacity: 0
            }}
            animate={{ 
              filter: 'saturate(1) brightness(1) contrast(1) hue-rotate(0deg)',
              scale: 1,
              opacity: 1
            }}
            transition={{ 
              duration: 1.3,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative z-10"
          >
            <Image 
              src={theme.avatar} 
              width={737} 
              height={678} 
              alt="" 
              className='translate-z-0 w-full h-full' 
              unoptimized 
            />
          </motion.div>

          {/* Ethereal atmosphere */}
          <motion.div
            className="absolute inset-0 -z-35 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 70% at 50% 52%, ${theme.glow}15, transparent 75%)`,
              filter: 'blur(120px)',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0.3, 0.6, 0.4, 0.6],
              scale: [1.2, 1.6, 1.35, 1.6]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Avatar;