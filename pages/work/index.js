import React from "react";
import WorkSlider from "../../components/WorkSlider";
import Circles from "../../components/Circles";
import { motion } from "framer-motion";
import { fadeIn, stagger } from "../../variants";

const Work = () => {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="h-full bg-primary/30 py-20 flex items-center relative overflow-hidden"
    >
      {/* Background decorative circles */}
      <Circles />

      <div className="container mx-auto px-9 lg:px-39">
        {/* Main content */}
        <motion.div
          variants={fadeIn("up", 0.2)}
          className="flex flex-col xl:flex-row items-center xl:items-start gap-12"
        >
          {/* Text section */}
          <motion.div
            variants={fadeIn("up", 0.3)}
            className="text-center xl:text-left xl:w-1/3"
          >
            <motion.h2
              variants={fadeIn("up", 0.4)}
              className="text-5xl font-bold leading-tight text-gray-900 dark:text-white"
            >
              My Work<span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.5)}
              className="mt-6 text-lg text-gray-700 dark:text-gray-300"
            >
              Discover some of the projects I’ve worked on, showcasing my skills
              in design, development, and creativity. From innovative ideas to
              polished solutions, each project reflects my passion and
              expertise.
            </motion.p>
          </motion.div>

          {/* Work Slider */}
          <motion.div
            variants={fadeIn("down", 0.6)}
            className="w-full xl:w-2/3"
          >
            <WorkSlider />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Work;
