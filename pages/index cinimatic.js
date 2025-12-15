import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";
import ChatBtn from "../components/ChatBtn";
import { fadeIn } from "../variants";

const PageSwitcher = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitionStyle, setTransitionStyle] = useState(0);
  const containerRef = useRef(null);

  // Cool transition styles that rotate
  const transitionStyles = [
    "cube", "flip", "zoom", "slide", "morph", "explode"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Random funny transition each time
      setTransitionStyle(Math.floor(Math.random() * transitionStyles.length));
      setDirection(Math.random() > 0.5 ? 1 : -1);
      setCurrentPage((prev) => (prev === 0 ? 1 : 0));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (newPage) => {
    setTransitionStyle(Math.floor(Math.random() * transitionStyles.length));
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
  };

  // CUBE ROTATION TRANSITION
  const cubeVariants = {
    enter: (direction) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.7,
      x: direction > 0 ? 1000 : -1000,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (direction) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.7,
      x: direction > 0 ? -1000 : 1000,
    }),
  };

  // FLIP TRANSITION
  const flipVariants = {
    enter: {
      rotateX: 180,
      opacity: 0,
      scale: 0.5,
    },
    center: {
      rotateX: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      rotateX: -180,
      opacity: 0,
      scale: 0.5,
    },
  };

  // ZOOM EXPLOSION
  const zoomVariants = {
    enter: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    center: {
      scale: 1,
      rotate: 0,
      opacity: 1,
    },
    exit: {
      scale: 3,
      rotate: 180,
      opacity: 0,
    },
  };

  // SLIDE WITH BOUNCE
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1500 : -1500,
      rotate: direction > 0 ? 45 : -45,
      opacity: 0,
    }),
    center: {
      x: 0,
      rotate: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1500 : 1500,
      rotate: direction > 0 ? -45 : 45,
      opacity: 0,
    }),
  };

  // MORPH TRANSITION
  const morphVariants = {
    enter: {
      scale: [0, 1.5, 0.8, 1.2, 1],
      rotate: [0, 180, -90, 45, 0],
      borderRadius: ["50%", "0%", "50%", "20%", "0%"],
      opacity: [0, 1],
    },
    center: {
      scale: 1,
      rotate: 0,
      borderRadius: "0%",
      opacity: 1,
    },
    exit: {
      scale: [1, 1.2, 0.8, 1.5, 0],
      rotate: [0, -45, 90, -180, 0],
      borderRadius: ["0%", "20%", "50%", "0%", "50%"],
      opacity: [1, 0],
    },
  };

  // EXPLODE PARTICLES
  const explodeVariants = {
    enter: {
      scale: 0,
      opacity: 0,
      filter: "blur(20px)",
    },
    center: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: {
      scale: 2,
      opacity: 0,
      filter: "blur(30px)",
    },
  };

  const getVariant = () => {
    switch (transitionStyles[transitionStyle]) {
      case "cube": return cubeVariants;
      case "flip": return flipVariants;
      case "zoom": return zoomVariants;
      case "slide": return slideVariants;
      case "morph": return morphVariants;
      case "explode": return explodeVariants;
      default: return cubeVariants;
    }
  };

  const getTransition = () => {
    switch (transitionStyles[transitionStyle]) {
      case "cube":
        return { duration: 1.4, ease: [0.87, 0, 0.13, 1] };
      case "flip":
        return { duration: 1.2, ease: [0.68, -0.55, 0.265, 1.55] };
      case "zoom":
        return { duration: 1.5, ease: [0.76, 0, 0.24, 1] };
      case "slide":
        return { type: "spring", damping: 20, stiffness: 100 };
      case "morph":
        return { duration: 2, times: [0, 0.2, 0.5, 0.8, 1] };
      case "explode":
        return { duration: 1.8, ease: "easeInOut" };
      default:
        return { duration: 1.2, ease: "easeInOut" };
    }
  };

  // Crazy avatar animations
  const avatarAnimations = [
    {
      enter: { scale: 0, rotate: -720, y: -500 },
      center: { scale: 1, rotate: 0, y: 0 },
      exit: { scale: 0, rotate: 720, y: 500 },
    },
    {
      enter: { scale: 0, x: -1000, rotate: 180 },
      center: { scale: 1, x: 0, rotate: 0 },
      exit: { scale: 0, x: 1000, rotate: -180 },
    },
    {
      enter: { scale: 3, opacity: 0, filter: "blur(30px)" },
      center: { scale: 1, opacity: 1, filter: "blur(0px)" },
      exit: { scale: 0, opacity: 0, filter: "blur(30px)" },
    },
  ];

  const currentAvatarAnim = avatarAnimations[transitionStyle % avatarAnimations.length];

  // Floating particles
  const FloatingParticle = ({ delay, color, size, duration }) => (
    <motion.div
      className={`absolute rounded-full ${color} blur-2xl`}
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const BluePage = () => (
    <motion.div
      key="blue-page"
      custom={direction}
      variants={getVariant()}
      initial="enter"
      animate="center"
      exit="exit"
      transition={getTransition()}
      className="bg-primary/60 h-full absolute inset-0"
      style={{ perspective: 2000, transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="w-full h-full bg-gradient-to-br from-blue-950/50 via-blue-900/40 via-cyan-900/30 to-black/20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Crazy floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.2}
            color="bg-blue-500/20"
            size={`${Math.random() * 200 + 100}px`}
            duration={Math.random() * 5 + 3}
          />
        ))}

        {/* Animated grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#60a5fa 1px, transparent 1px),
                            linear-gradient(90deg, #60a5fa 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto relative z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
        >
          <motion.h1
            className="h1 mb-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                textShadow: "0 0 30px rgba(96, 165, 250, 0.8)",
              }}
            >
              Full-Stack
            </motion.span>{" "}
            <br />
            <motion.span
              className="text-blue-400 inline-block"
              animate={{
                textShadow: [
                  "0 0 20px rgba(96, 165, 250, 0.5)",
                  "0 0 40px rgba(96, 165, 250, 1)",
                  "0 0 20px rgba(96, 165, 250, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{
                scale: 1.15,
                rotate: [0, 5, -5, 5, 0],
              }}
            >
              Engineer.
            </motion.span>
          </motion.h1>

          <motion.div
            className="hidden xl:flex xl:justify-center xl:space-x-10 xl:items-center xl:absolute xl:bottom-20 xl:transform xl:translate-x-1/6 xl:z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 360,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.8, rotate: -90 }}
            >
              <ProjectsBtn className="scale-90" />
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: -360,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.8, rotate: 90 }}
            >
              <ChatBtn className="scale-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <motion.div
          className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/20 blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        <ParticlesContainer style={{ zIndex: 0 }} />

        <motion.div
          variants={currentAvatarAnim}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.5, type: "spring", damping: 15 }}
          className="w-full h-full max-w-[600px] max-h-[660px] absolute bottom-0 lg:bottom-300 lg:right-[15%]"
          style={{ zIndex: 5 }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="hidden xl:flex xl:max-w-none"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/av6.png"
                width={600}
                height={660}
                alt="Avatar"
                className="translate-z-0 w-full h-full drop-shadow-2xl"
                unoptimized
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const RedPage = () => (
    <motion.div
      key="red-page"
      custom={direction}
      variants={getVariant()}
      initial="enter"
      animate="center"
      exit="exit"
      transition={getTransition()}
      className="bg-primary/60 h-full absolute inset-0"
      style={{ perspective: 2000, transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="w-full h-full bg-gradient-to-br from-red-950/40 via-black/40 via-pink-900/20 to-black/20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Crazy floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.2}
            color="bg-red-500/20"
            size={`${Math.random() * 200 + 100}px`}
            duration={Math.random() * 5 + 3}
          />
        ))}

        {/* Animated grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#ef4444 1px, transparent 1px),
                            linear-gradient(90deg, #ef4444 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto relative z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
        >
          <motion.h1
            className="h1 mb-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.span
              className="inline-block"
              whileHover={{
                scale: 1.1,
                rotate: [0, 5, -5, 5, 0],
                textShadow: "0 0 30px rgba(239, 68, 68, 0.8)",
              }}
            >
              Full-Stack
            </motion.span>{" "}
            <br />
            <motion.span
              className="text-accent inline-block"
              animate={{
                textShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 40px rgba(239, 68, 68, 1)",
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{
                scale: 1.15,
                rotate: [0, -5, 5, -5, 0],
              }}
            >
              Engineer.
            </motion.span>
          </motion.h1>

          <motion.div
            className="hidden xl:flex xl:justify-center xl:space-x-10 xl:items-center xl:absolute xl:bottom-20 xl:transform xl:translate-x-1/6 xl:z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: -360,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.8, rotate: 90 }}
            >
              <ProjectsBtn className="scale-90" />
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 360,
                transition: { duration: 0.6 },
              }}
              whileTap={{ scale: 0.8, rotate: -90 }}
            >
              <ChatBtn className="scale-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <motion.div
          className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -2, 2, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <ParticlesContainer style={{ zIndex: 0 }} />

        <motion.div
          variants={currentAvatarAnim}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.5, type: "spring", damping: 15 }}
          className="w-full h-full max-w-[737px] max-h-[678px] absolute bottom-0 lg:bottom-300 lg:right-[5%]"
          style={{ zIndex: 5 }}
          whileHover={{
            scale: 1.1,
            rotate: [0, 10, -10, 10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <motion.div
            className="hidden xl:flex xl:max-w-none"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/av-removebg.png"
              width={737}
              height={678}
              alt="Avatar"
              className="translate-z-0 w-full h-full drop-shadow-2xl"
              unoptimized
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden relative bg-black">
      <AnimatePresence mode="wait" custom={direction}>
        {currentPage === 0 ? <BluePage /> : <RedPage />}
      </AnimatePresence>

      {/* Funny transition name display */}
      <motion.div
        className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={transitionStyle}
      >
        <motion.div
          className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.2)",
              "0 0 40px rgba(255, 255, 255, 0.4)",
              "0 0 20px rgba(255, 255, 255, 0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            {transitionStyles[transitionStyle]} Mode 🚀
          </span>
        </motion.div>
      </motion.div>

      {/* Epic page indicators */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        {[0, 1].map((page) => (
          <motion.button
            key={page}
            onClick={() => handlePageChange(page)}
            className="relative"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8, rotate: 180 }}
          >
            <motion.div
              className={`w-16 h-16 rounded-full ${
                currentPage === page
                  ? page === 0
                    ? "bg-blue-500/30"
                    : "bg-red-500/30"
                  : "bg-white/10"
              } backdrop-blur-md border-2 ${
                currentPage === page ? "border-white/50" : "border-white/20"
              } flex items-center justify-center`}
              animate={
                currentPage === page
                  ? {
                      boxShadow: [
                        `0 0 20px ${page === 0 ? "rgba(59, 130, 246, 0.5)" : "rgba(239, 68, 68, 0.5)"}`,
                        `0 0 40px ${page === 0 ? "rgba(59, 130, 246, 0.8)" : "rgba(239, 68, 68, 0.8)"}`,
                        `0 0 20px ${page === 0 ? "rgba(59, 130, 246, 0.5)" : "rgba(239, 68, 68, 0.5)"}`,
                      ],
                      rotate: [0, 360],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className={`w-8 h-8 rounded-full ${
                  currentPage === page
                    ? page === 0
                      ? "bg-blue-400"
                      : "bg-red-400"
                    : "bg-white/40"
                }`}
                animate={
                  currentPage === page
                    ? {
                        scale: [1, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            {currentPage === page && (
              <motion.div
                className="absolute -inset-4 border-2 border-white/30 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Epic progress ring */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        style={{ width: 200, height: 200 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <svg width="200" height="200" className="absolute inset-0 -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke={currentPage === 0 ? "#60a5fa" : "#ef4444"}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 565" }}
            animate={{ strokeDasharray: "565 565" }}
            transition={{ duration: 7, ease: "linear" }}
            key={currentPage}
            style={{
              filter: `drop-shadow(0 0 10px ${currentPage === 0 ? "#60a5fa" : "#ef4444"})`,
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default PageSwitcher;