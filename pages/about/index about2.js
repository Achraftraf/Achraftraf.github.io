import React, { useState } from "react";
import { FaJava, FaPython, FaJs, FaReact } from "react-icons/fa6";
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
} from "react-icons/si";

import { motion } from "framer-motion";
import CountUp from "react-countup";

const aboutData = [
  {
    title: "skills",
    info: [
      {
        title: "Web Development",
        icons: [
          <SiSpringboot />,
          <SiTailwindcss />,
          <FaJs />,
          <FaReact />,
          <SiNextdotjs />,
        ],
      },
      {
        title: "Programming Languages",
        icons: [<FaJava />, <FaPython />, <TbBrandCSharp />],
      },
      {
        title: "Database Management Systems",
        icons: [<SiNeo4J />, <SiRedis />, <SiPostgresql />, <SiMysql />],
      },
      {
        title: "Data Integration",
        icons: [<SiTalend />],
      },
      {
        title: "Network Administration",
        icons: [<SiCisco />],
      },
    ],
  },
  {
    title: "experience",
    info: [
      { title: "Centers Junior - NTT DATA", stage: "[ 27/03/2023 - Current ]" },
      { title: "Full-stack Developer", stage: "[ 02/11/2022 - 05/12/2022 ]" },
      {
        title: "Manager of Communication Club InfoMath",
        stage: "[ 13/10/2022 - Current ]",
      },
    ],
  },
  {
    title: "education",
    info: [
      {
        title: "Master's degree, Computer Engineering - FS Tétouan",
        stage: "2024",
      },
      {
        title: "Bachelor's Degree in Mathematics and Computer Science",
        stage: "2023",
      },
      { title: "DUG in Mathematics and Computer Science", stage: "2022" },
      {
        title: "Baccalaureate in Mathematical Sciences A-French Option",
        stage: "2018",
      },
    ],
  },
  {
    title: "certificates",
    info: [
      {
        title: "Learn Spring Boot 3 in 100 Steps - No 1 Java Framework",
        stage: "2023",
      },
      { title: "Mini Project on Talend DI", stage: "2023" },
      {
        title: "Emotional Intelligence at Work: Learn from Your Emotions",
        stage: "2023",
      },
      {
        title: "Data Integration & ETL with Talend Open Studio Zero to Hero",
        stage: "2023",
      },
      { title: "Responsive Web Design", stage: "2023" },
    ],
  },
];

const About = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="min-h-screen bg-primary/30 py-16 px-4 md:px-16 lg:px-32 text-center xl:text-left">
      <div className="container mx-auto flex flex-col xl:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center items-center xl:items-start">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-5xl font-bold text-white mb-4"
          >
            Gain <span className="text-accent">Innovate</span> Commit.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex gap-6 justify-center xl:justify-start"
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-accent">
                <CountUp start={0} end={5} duration={2} />+
              </div>
              <div className="text-sm uppercase text-white/80">
                Years of Experience
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-accent">
                <CountUp start={0} end={57} duration={2} />+
              </div>
              <div className="text-sm uppercase text-white/80">
                Finished Projects
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-accent">
                <CountUp start={0} end={10} duration={2} />+
              </div>
              <div className="text-sm uppercase text-white/80">
                Certificates
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-4 justify-center xl:justify-start mb-4"
          >
            {aboutData.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`cursor-pointer capitalize text-lg text-white ${
                  index === itemIndex
                    ? "text-accent font-bold"
                    : "text-white/80"
                }`}
                onClick={() => setIndex(itemIndex)}
              >
                {item.title}
              </div>
            ))}
          </motion.div>
          <div className="bg-white/10 p-4 rounded-lg shadow-lg">
            {aboutData[index].info.map((info, i) => (
              <div key={i} className="mb-4 text-left">
                <h4 className="font-semibold text-white text-lg">
                  {info.title}
                </h4>
                <p className="text-white/70">{info.stage}</p>
                <div className="flex gap-2 mt-2">
                  {info.icons?.map((icon, idx) => (
                    <span key={idx} className="text-2xl text-white/80">
                      {icon}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
