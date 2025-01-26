import Image from "next/image";
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";
import ChatBtn from "../components/ChatBtn";

import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const Home = () => {
  return (
    <div className="bg-primary/60 h-full">
      <div className="w-full h-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10">
        <div className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h1 mb-20"
          >
            Full-Stack <br />
            <span className="text-accent">Engineer.</span>
          </motion.h1>

          <motion.p
            variants={fadeIn("down", 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-20 xl:mb-20"
          ></motion.p>

          <div className="hidden xl:flex xl:justify-center xl:space-x-10 xl:absolute xl:bottom-20 xl:transform xl:translate-x-1/6 xl:z-20">
            <ProjectsBtn className="scale-90" />

            <ChatBtn className="scale-90" />
          </div>

          <div className="flex justify-center xl:hidden relative z-10">
            <ProjectsBtn className="scale-75" />
          </div>

          <div className="flex justify-center xl:hidden relative z-10 mt-10">
            <ChatBtn className="scale-75" />
          </div>
        </div>
      </div>

      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0"></div>

        <ParticlesContainer style={{ zIndex: 0 }} />

        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          animate="show"
          exit="hidden"
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full h-full max-w-[737px] max-h-[678px] absolute -bottom-30 lg:bottom-300 lg:right-[5%]"
          style={{ zIndex: 5 }}
        >
          <Avatar />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
