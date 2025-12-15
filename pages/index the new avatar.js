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
        {/* Updated gradient with blue tones */}
        <div className="w-full h-full bg-gradient-to-r from-blue-950/40 via-blue-900/30 to-black/20">
          <div className="text-center flex flex-col justify-center xl:p-5 xl:text-left h-full container mx-auto">
            <motion.h1
              variants={fadeIn("down", 0.2)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h1 mb-20"
            >
              Full-Stack <br />
              {/* Changed accent color to blue */}
              <span className="text-blue-400">Engineer.</span>
            </motion.h1>

            <motion.p
              variants={fadeIn("down", 0.3)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-20 xl:mb-20 text-blue-100/80"
            ></motion.p>

            {/* For larger screens */}
            <div className="hidden xl:flex xl:justify-center xl:space-x-10 xl:items-center xl:absolute xl:bottom-20 xl:transform xl:translate-x-1/6 xl:z-20">
              <motion.div
                variants={fadeIn("up", 0.5)}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <ProjectsBtn className="scale-90" />
              </motion.div>

              <motion.div
                variants={fadeIn("down", 0.6)}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
              >
                <ChatBtn className="scale-90" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="w-[1200px] h-full absolute right-0 bottom-0">
          {/* Added blue glow effect */}
          <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0">
            {/* Blue glow overlay */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl"></div>
          </div>

          <ParticlesContainer style={{ zIndex: 0 }} />

          <motion.div
            variants={fadeIn("up", 0.5)}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full max-w-[600px] max-h-[660px] absolute bottom-0 lg:bottom-300 lg:right-[15%]"
            style={{ zIndex: 5 }}
          >
            {/* Added blue glow around avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
              <Avatar />
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  export default Home;