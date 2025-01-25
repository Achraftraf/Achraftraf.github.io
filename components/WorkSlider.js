import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper/core";
import "swiper/swiper-bundle.css";
import { motion, AnimatePresence } from "framer-motion";

SwiperCore.use([Pagination]);

const workSlides = {
  slides: [
    {
      images: [
        {
          path: "/FrenzyAI.png",
          title: "FrenzyAI",
          url: "https://frenzyai.zarouki-achraf.me/",
          description:
            "Unleash the chaos with The Chatbot That Doesn’t Care About Your Feelings—a snarky, sarcastic, and wildly unpredictable coding assistant. Whether you’re debugging, learning, or just desperate for some comic relief, this bot roasts your code, insults your skills, and somehow still helps you out (probably). Think you can handle its “Overlord of Syntax” attitude? Dive into the madness—if you dare. 💻🔥",
          techStack: ["Next.js", "Tailwind CSS", "openai", "Supabase"],
        },
        {
          path: "/TrainingPortal.png",
          title: "TrainingPortal",
          url: "https://github.com/Achraftraf/TrainingPortal",
          description:
            "A Spring Boot and Angular-powered platform for streamlined training management. Admins can add courses, trainers, and companies, while scheduling sessions on a user-friendly calendar. Participants easily register, and evaluations are collected post-training. The system prioritizes simplicity, security, and intuitive design.",
          techStack: ["Spring Boot ", "Angular", "TypeScript", "MySQL"],
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
        // Add more projects...
      ],
    },
    {
      images: [
        {
          path: "/FrenzyAI.png",
          title: "FrenzyAI",
          url: "https://frenzyai.zarouki-achraf.me/",
          description:
            "A detailed description of Project 1, its features, and its purpose.",
          techStack: ["Next.js", "Tailwind CSS", "openai", "Supabase"],
        },
        {
          path: "/thumb2.jpg",
          title: "Project 2",
          url: "https://project2.com",
          description:
            "An advanced analytics dashboard powered by Next.js and Chart.js.",
          techStack: ["Next.js", "Chart.js", "TypeScript"],
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
        // Add more projects...
      ],
    },
  ],
};

const WorkSlider = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const closeDetails = () => setSelectedProject(null);

  return (
    <div>
      {/* Main Slider */}
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        className="h-[300px] sm:h-[500px]"
      >
        {workSlides.slides.map((slide, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="grid grid-cols-2 grid-rows-2 gap-8"
            >
              {slide.images.map((image, imageIndex) => (
                <motion.div
                  key={imageIndex}
                  className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                  onClick={() => setSelectedProject(image)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* Project Thumbnail */}
                  <img
                    src={image.path}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                  {/* Title */}
                  <div className="absolute bottom-6 left-6 text-white text-lg font-semibold">
                    {image.title}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Project Details Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-[#1E1E2F] text-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={closeDetails}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              {/* Project Content */}
              <h2 className="text-3xl font-bold mb-4">
                {selectedProject.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {selectedProject.description}
              </p>
              {/* Tech Stack */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Tech Stack:</h3>
                <ul className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, index) => (
                    <li
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Buttons */}
              <div className="flex gap-4">
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Visit Project
                </a>
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkSlider;
