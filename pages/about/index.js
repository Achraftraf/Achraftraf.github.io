import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  FaJava,
  FaJs,
  FaReact,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaJava as FaJava6, FaPython as FaPython6 } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";
import {
  SiNextdotjs,
  SiSpringboot,
  SiTailwindcss,
  SiNeo4J,
  SiRedis,
  SiPostgresql,
  SiMysql,
  SiTalend,
  SiCisco,
  SiAngular,
  SiDocker,
  SiGit,
  SiPhp,
} from "react-icons/si";
import {
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Target,
} from "lucide-react";

import { ParticleBackground } from "../../components/particle-background";

// Data
const aboutData = [
  {
    title: "skills",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    info: [
      {
        title: "Web Technologies",
        icons: [
          <SiNextdotjs key="next" />,
          <FaReact key="react" />,
          <SiAngular key="angular" />,
          <SiSpringboot key="spring" />,
          <SiTailwindcss key="tailwind" />,
          <FaJs key="js" />,
        ],
      },
      {
        title: "Programming Languages",
        icons: [<FaJava6 key="java" />, <FaPython6 key="python" />, <TbBrandCSharp key="csharp" />, <SiPhp key="php" />],
      },
      {
        title: "Database & DevOps",
        icons: [<SiNeo4J key="neo4j" />, <SiPostgresql key="postgres" />, <SiMysql key="mysql" />, <SiDocker key="docker" />, <SiGit key="git" />],
      },
      {
        title: "Network & Security",
        icons: [<SiCisco key="cisco" />],
      },
      {
        title: "Data Integration",
        icons: [<SiTalend key="talend" />],
      },
    ],
  },
  {
    title: "experience",
    icon: Briefcase,
    color: "from-purple-500 to-pink-500",
    info: [
      {
        title: "IT Administrator - Faculty of Medicine Rabat",
        stage: "01/2026 - Present",
      },
      {
        title: "Software Developer - NTT DATA",
        stage: "2023 - 2026",
      },
      {
        title: "Programming Instructor - Algorithmics",
        stage: "2025 - Present",
      },
      {
        title: "Freelance AI Developer",
        stage: "2025 - Present",
      },
    ],
  },
  {
    title: "education",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    info: [
      {
        title: "Doctorate in Artificial Intelligence - FS Tétouan",
        stage: "2024 - Current",
      },
      {
        title: "Master's degree, Computer Engineering - FS Tétouan",
        stage: "2022 - 2024",
      },
      {
        title: "Bachelor's Degree in Math & CS",
        stage: "2022",
      },
    ],
  },
  {
    title: "certificates",
    icon: Award,
    color: "from-yellow-400 to-amber-500", // Gold
    info: [
      {
        title: "NextJS & OpenAI - 2024 Edition",
        stage: "2024",
      },
      {
        title: "Learn Spring Boot 3 in 100 Steps",
        stage: "2023",
      },
      {
        title: "Data Integration & ETL with Talend",
        stage: "2023",
      },
      {
        title: "Emotional Intelligence at Work",
        stage: "2023",
      },
    ],
  },
];

const ITEMS_PER_PAGE = 3;

const About = () => {
  const [index, setIndex] = useState(0);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(0);
  }, [index]);

  const stats = [
    {
      label: "Years Experience",
      value: 5,
      suffix: "+",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Projects",
      value: 57,
      suffix: "+",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      label: "Certificates",
      value: 10,
      suffix: "+",
      icon: Award,
      color: "from-yellow-400 to-amber-500" // Gold
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // Pagination Logic
  const currentData = aboutData[index].info;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const visibleItems = currentData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const paginate = (newDirection) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < totalPages) {
      setDirection(newDirection);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-full min-h-screen bg-site py-6 lg:py-10 px-4 sm:px-6 lg:px-8 xl:pr-32 overflow-hidden flex flex-col justify-center relative">
      <ParticleBackground />

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col justify-center h-full lg:pl-10">
        {/* Header - More Compact */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 lg:mb-5 mt-6 lg:mt-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl lg:text-4xl font-bold text-white mb-2"
          >
            <span className="text-cyan-400">Gain</span> Innovate <span className="text-cyan-400">Commit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs lg:text-sm text-gray-400 max-w-xl mx-auto"
          >
            Full-stack developer specializing in AI integration and data processing
          </motion.p>
        </motion.div>

        {/* Stats Cards - Compact Version */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-5"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isHovered = hoveredStat === idx;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                onHoverStart={() => setHoveredStat(idx)}
                onHoverEnd={() => setHoveredStat(null)}
                className="group relative"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.5 : 0,
                    scale: isHovered ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-lg blur-md`}
                />

                {/* Card */}
                <div className="relative h-full bg-[#20202d] backdrop-blur-xl rounded-lg p-3 lg:p-4 border border-white/5 group-hover:border-white/20 transition-all duration-300">
                  <div className={`p-1.5 lg:p-2 rounded-md bg-gradient-to-br ${stat.color} w-fit mb-2`}>
                    <Icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>

                  <div className={`text-xl lg:text-3xl font-bold text-transparent bg-gradient-to-r ${stat.color} bg-clip-text mb-0.5`}>
                    <CountUp start={0} end={stat.value} duration={2.5} />
                    {stat.suffix}
                  </div>

                  <div className="text-[10px] lg:text-xs text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs - Responsive Grid/Flex */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4 sm:justify-center"
        >
          {aboutData.map((item, itemIndex) => {
            const Icon = item.icon;
            const isActive = index === itemIndex;

            return (
              <motion.button
                key={itemIndex}
                onClick={() => setIndex(itemIndex)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center justify-center gap-1.5 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full font-medium capitalize transition-all duration-300 text-xs lg:text-sm min-w-[110px] sm:min-w-0 ${isActive
                  ? "bg-gradient-to-r text-white shadow-md"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                  } ${isActive ? item.color : ""}`}
              >
                <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.title}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full -z-10 blur-sm opacity-40`}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area - Animated Pagination */}
        <div className="relative bg-[#20202d]/40 backdrop-blur-xl rounded-xl p-4 lg:p-5 border border-white/5 min-h-[300px] mb-6 flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage + index} // Unique key triggers animation on page/tab change
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="space-y-2 lg:space-y-3"
            >
              {visibleItems.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: itemIndex * 0.05 }}
                  className="group"
                >
                  {/* Card for each item - Compact */}
                  <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm lg:text-base text-white font-semibold mb-0.5 group-hover:text-cyan-400 transition-colors truncate">
                          {item.title}
                        </h3>
                        {item.stage && (
                          <p className="text-xs text-gray-400">{item.stage}</p>
                        )}
                      </div>

                      {/* Icons - Compact */}
                      {item.icons && (
                        <div className="flex gap-2 flex-wrap">
                          {item.icons.map((icon, iconIndex) => (
                            <motion.div
                              key={iconIndex}
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              className={`text-base lg:text-xl p-1.5 lg:p-2 rounded-md bg-gradient-to-br ${aboutData[index].color} text-white shadow-md`}
                            >
                              {icon}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <button
                onClick={() => paginate(-1)}
                disabled={currentPage === 0}
                className={`p-2 rounded-full transition-all ${currentPage === 0
                  ? "opacity-30 cursor-not-allowed text-gray-500"
                  : "hover:bg-white/10 text-white"
                  }`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentPage
                      ? `bg-gradient-to-r ${aboutData[index].color} w-4`
                      : "bg-white/20"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => paginate(1)}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full transition-all ${currentPage === totalPages - 1
                  ? "opacity-30 cursor-not-allowed text-gray-500"
                  : "hover:bg-white/10 text-white"
                  }`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
