import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import WorkSlider from "../../components/WorkSlider";
import { ParticleBackground } from "../../components/particle-background";
import { Sparkles, ArrowRight, Zap, Target, Award, TrendingUp, Eye } from "lucide-react";

const Work = () => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-3, 3]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const stats = [
    { icon: Target, value: "15+", label: "Projects", color: "from-purple-500 to-pink-500" },
    { icon: Award, value: "100%", label: "Satisfaction", color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, value: "50+", label: "Happy Clients", color: "from-orange-500 to-red-500" },
    { icon: Zap, value: "3+", label: "Years Exp", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="h-full min-h-screen bg-site pt-28 pb-12 lg:pt-36 lg:pb-12 px-4 sm:px-6 lg:px-8 xl:pl-16 xl:pr-36 overflow-hidden flex flex-col justify-center relative">
      <ParticleBackground />

      {/* Animated gradient orbs - Optimized */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col xl:flex-row items-center xl:items-center gap-6 lg:gap-10 xl:gap-12"
        >
          {/* Text Section */}
          <motion.div
            variants={itemVariants}
            className="text-center xl:text-left xl:w-[45%] space-y-4 lg:space-y-6"
          >

            {/* Title with gradient animation */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="inline-block bg-gradient-to-r from-white via-purple-200 to-white bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  My Creative
                </motion.span>
                <br />
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                  className="inline-block bg-gradient-to-r from-accent via-pink-400 to-accent bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  Portfolio
                </motion.span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto xl:mx-0"
            >
              Dive into a collection of{" "}
              <span className="text-accent font-semibold">cutting-edge projects</span>{" "}
              that showcase innovation, creativity, and technical excellence. Each work tells a unique story of problem-solving and design mastery.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto xl:mx-0"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300`} />

                    <div className="relative bg-[#1a1a2e]/90 backdrop-blur-xl rounded-xl p-2.5 border border-white/10 group-hover:border-white/30 transition-all">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.5 }}
                          className={`p-1 rounded-lg bg-gradient-to-br ${stat.color}`}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </motion.div>
                        <div>
                          <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-none">
                            {stat.value}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-none mt-0.5">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-2.5 justify-center xl:justify-start max-w-lg mx-auto xl:mx-0 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group overflow-hidden px-6 py-3 rounded-full font-bold text-xs sm:text-sm"
              >
                {/* Animated gradient background */}
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto]"
                />

                <span className="relative flex items-center justify-center gap-2 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Projects</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-semibold text-xs sm:text-sm backdrop-blur-xl transition-all"
              >
                Contact Me
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Work Slider Section */}
          <motion.div
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="w-full xl:w-[55%] relative"
          >
            {/* Glow effects */}
            <motion.div
              animate={{
                scale: isHovered ? 1.05 : 1,
                opacity: isHovered ? 0.6 : 0.3,
              }}
              transition={{ duration: 0.4 }}
              className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-2xl pointer-events-none"
            />

            {/* Slider container */}
            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl pointer-events-none"
              />
              <motion.div
                animate={{
                  y: [15, -15, 15],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl pointer-events-none"
              />

              <WorkSlider />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Work;