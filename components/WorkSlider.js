import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

const workSlides = {
  slides: [
    {
      images: [
        {
          path: "/FrenzyAI.png",
          title: "FrenzyAI",
          url: "https://frenzyai.zarouki-achraf.me/",
          description:
            "Unleash the chaos with The Chatbot That Doesn't Care About Your Feelings—a snarky, sarcastic, and wildly unpredictable coding assistant. Whether you're debugging, learning, or just desperate for some comic relief, this bot roasts your code, insults your skills, and somehow still helps you out (probably). Think you can handle its \"Overlord of Syntax\" attitude? Dive into the madness—if you dare. 💻🔥",
          techStack: ["Next.js", "Tailwind CSS", "OpenAI", "Supabase"],
        },
        {
          path: "/TrainingPortal.png",
          title: "TrainingPortal",
          url: "https://github.com/Achraftraf/TrainingPortal",
          description:
            "A Spring Boot and Angular-powered platform for streamlined training management. Admins can add courses, trainers, and companies, while scheduling sessions on a user-friendly calendar. Participants easily register, and evaluations are collected post-training. The system prioritizes simplicity, security, and intuitive design.",
          techStack: ["Spring Boot", "Angular", "TypeScript", "MySQL"],
        },
        {
          path: "/thumb3.jpg",
          title: "Portfolio Website",
          url: "https://portfolio.com",
          description:
            "A sleek personal portfolio to showcase projects and skills.",
          techStack: ["React", "CSS Modules", "Framer Motion"],
        },
        {
          path: "/thumb4.jpg",
          title: "E-commerce Store",
          url: "https://ecommerce-store.com",
          description:
            "A full-stack e-commerce platform with a modern user experience.",
          techStack: ["Vue.js", "Node.js", "MongoDB"],
        },
      ],
    },
    {
      images: [
        {
          path: "/thumb2.jpg",
          title: "Analytics Dashboard",
          url: "https://project2.com",
          description:
            "An advanced analytics dashboard powered by Next.js and Chart.js.",
          techStack: ["Next.js", "Chart.js", "TypeScript"],
        },
        {
          path: "/FrenzyAI.png",
          title: "FrenzyAI Clone",
          url: "https://frenzyai.zarouki-achraf.me/",
          description:
            "A detailed description of Project 1, its features, and its purpose.",
          techStack: ["Next.js", "Tailwind CSS", "OpenAI", "Supabase"],
        },
        {
          path: "/thumb3.jpg",
          title: "Portfolio Website",
          url: "https://portfolio.com",
          description:
            "A sleek personal portfolio to showcase projects and skills.",
          techStack: ["React", "CSS Modules", "Framer Motion"],
        },
        {
          path: "/thumb4.jpg",
          title: "E-commerce Store",
          url: "https://ecommerce-store.com",
          description:
            "A full-stack e-commerce platform with a modern user experience.",
          techStack: ["Vue.js", "Node.js", "MongoDB"],
        },
      ],
    },
  ],
};

const WorkSlider = forwardRef((props, ref) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [swiperKey, setSwiperKey] = useState(0);

  const closeDetails = () => setSelectedProject(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openFirstProject: () => {
      // Open the first project from the first slide
      if (workSlides.slides[0]?.images[0]) {
        setSelectedProject(workSlides.slides[0].images[0]);
      }
    }
  }));

  // Reset swiper when component mounts
  useEffect(() => {
    setSwiperKey((prevKey) => prevKey + 1);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  return (
    <div className="w-full h-full">
      {/* Main Slider */}
      <Swiper
        key={swiperKey}
        spaceBetween={20}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        loop={false}
        className="h-[240px] sm:h-[320px] lg:h-[380px] xl:h-[420px] w-full"
        style={{
          "--swiper-pagination-color": "#e879f9",
          "--swiper-pagination-bullet-inactive-color": "#999999",
          "--swiper-pagination-bullet-inactive-opacity": "0.4",
          "--swiper-pagination-bullet-size": "8px",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        }}
      >
        {workSlides.slides.map((slide, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 lg:gap-4 h-full p-1.5"
            >
              {slide.images.map((image, imageIndex) => (
                <motion.div
                  key={imageIndex}
                  className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl group cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900"
                  onClick={() => setSelectedProject(image)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: imageIndex * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Project Thumbnail */}
                  <div className="w-full h-full overflow-hidden">
                    <motion.img
                      src={image.path}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Hover Effect - Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.4 }}
                  />

                  {/* Title - Always Visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
                    <motion.h3
                      className="text-white text-sm sm:text-base lg:text-lg font-bold mb-1 drop-shadow-lg"
                      initial={{ y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      {image.title}
                    </motion.h3>

                    {/* Hover Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2">
                        {image.description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center gap-2 text-accent text-xs sm:text-sm font-semibold">
                        <span>View Details</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent/60 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </motion.div>
              ))}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Full-Screen Project Details Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDetails}
          >
            <motion.div
              className="relative w-full max-w-5xl h-auto bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/95 to-[#0f3460]/95 rounded-lg sm:rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={closeDetails}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all backdrop-blur-md group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Left Side - Image Section */}
                <motion.div
                  className="relative h-48 sm:h-56 lg:h-72 xl:h-80 bg-black/50"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <img
                    src={selectedProject.path}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1a1a2e]/80" />

                  {/* Floating Decorative Elements */}
                  <motion.div
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                  />
                  <motion.div
                    animate={{
                      y: [10, -10, 10],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                  />
                </motion.div>

                {/* Right Side - Content Section */}
                <motion.div
                  className="flex flex-col justify-center p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 space-y-3 sm:space-y-3.5 lg:space-y-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Title Section */}
                  <div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "2.5rem" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-0.5 bg-gradient-to-r from-accent via-pink-500 to-purple-500 rounded-full mb-2.5"
                    />

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-white mb-1.5 leading-tight"
                    >
                      <motion.span
                        initial={{ backgroundPosition: "0% 50%" }}
                        animate={{ backgroundPosition: "100% 50%" }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="bg-gradient-to-r from-white via-accent to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent"
                      >
                        {selectedProject.title}
                      </motion.span>
                    </motion.h2>
                  </div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[11px] sm:text-xs text-gray-300 leading-relaxed line-clamp-4"
                  >
                    {selectedProject.description}
                  </motion.p>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                      <span className="w-5 h-0.5 bg-accent/50 rounded-full"></span>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.techStack.map((tech, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="relative group"
                        >
                          {/* Glow effect */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-pink-500 rounded-md blur opacity-0 group-hover:opacity-50 transition duration-300" />

                          <span className="relative px-2.5 py-1 bg-white/5 border border-white/10 group-hover:border-accent/50 rounded-md text-[10px] sm:text-[11px] text-gray-300 font-medium backdrop-blur-sm transition-all block">
                            {tech}
                          </span>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-2"
                  >
                    <motion.a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent via-pink-600 to-purple-600 hover:from-accent/90 hover:via-pink-600/90 hover:to-purple-600/90 text-white rounded-lg font-bold text-[11px] sm:text-xs transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 group relative overflow-hidden"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        animate={{
                          x: [-200, 200],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />

                      <span className="relative text-[11px] sm:text-xs">View Live Project</span>
                      <ExternalLink className="w-3.5 h-3.5 relative group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default WorkSlider;