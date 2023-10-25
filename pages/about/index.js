import React, { useState} from 'react';
import { FaJava, FaBootstrap , FaPhp , FaPython } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaWordpress,
  FaFigma,
} from 'react-icons/fa';

import {
  SiNextdotjs,
  SiJquery,
  SiSpringboot,
  SiTailwindcss,
  SiHibernate,
  SiNeo4J,
  SiRedis,
  SiPostgresql,
  SiMysql,
  SiTalend,
  SiCisco
} from 'react-icons/si';

// Data
const aboutData = [
  {
    title: 'skills',
    info: [
      {
        title: 'Web Development',
        icons: [
          <SiSpringboot />,
          <SiTailwindcss />,
          <FaPhp />,
          <FaBootstrap />,
          <FaHtml5 />,
          <FaCss3 />,
          <FaJs />,
          <FaReact />,
          <SiNextdotjs />,
          <SiJquery />,
          <SiHibernate />,
        ],
      },
      {
        title: 'Programming Languages',
        icons: [<FaJava />, <FaPython />, <TbBrandCSharp />],
      },
      {
        title: 'Database Management Systems',
        icons: [<SiNeo4J />, <SiRedis />, <SiPostgresql /> , <SiMysql />],
      },
      {
        title: 'Data Integration',
        icons: [<SiTalend />],
      },
      {
        title: 'Network Administration',
        icons: [<SiCisco />],
      },
    ],
  },
  
  {
    title: 'experience',
    info: [
      {
        title: 'Centers Junior - NTT DATA',
        stage: '[ 27/03/2023 - Current ] ',
      },
      {
        title: 'Full-stack Developer',
        stage: '[ 02/11/2022 - 05/12/2022 ]',
      },
      {
        title: 'Manager of Communication Club InfoMath',
        stage: '[ 13/10/2022 - Current ]',
      },
    ],
  },
  {
    title: 'education',
    info: [
      {
        title: "Master's degree, Computer Engineering - Université Abdelmalek Essaâdi Tétouan",
        stage: ' [ 15/09/2022 - Current ] ',
      },
      {
        title: "Bachelor's Degree in Mathematoics and Computer Science",
        stage: '[ 01/09/2021 - 30/06/2022 ]',
      },
      {
        title: 'General University Studies Diploma Mathematical and computer sciences',
        stage: '[ 01/09/2018 - 30/06/2021 ]',
      },
      {
        title: 'Baccalaureate Mathematical sciences A-French option',
        stage: '[ 01/09/2017 - 30/06/2018 ] ',
      },
    ],
  },
  {
    title: 'certificats',
    info: [
      {
        title: 'Learn Spring Boot 3 in 100 Steps - No 1 Java Framework',
        stage: 'October 5, 2023',
      },
      {
        title: ' Mini projet pratique sur Talend DI',
        stage: 'September 6, 2023',
      },
      {
        title: 'Emotional Intelligence at Work: Learn from Your Emotions',
        stage: 'September 9, 2023',
      },
      {
        title: 'Data Integration & ETL with Talend Open Studio Zero to Hero ',
        stage: 'August 4, 2023',
      },
      {
        title: 'Responsive Web Design',
        stage: 'January 12, 2023',
      },
    ],
  },
];

import Avatar from '../../components/Avatar';
import Avatarabout from '../../components/Avatarabout';
import Circles from '../../components/Circles';

import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

import CountUp from 'react-countup';

const About = () => {
  const [index, setIndex] = useState(0);
  console.log(index);
  return (
    <div className="h-full bg-primary/30 py-32 text-center xl:text-left">
      <Circles />

      {/* Avatar img */}
      <motion.div
        variants={fadeIn('right', 0.2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="hidden xl:flex absolute bottom-0 -left-[370px]"
      >
      <Avatarabout />
      </motion.div>
      <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
        <div className='flex-1 flex flex flex-col justify-center'>
          <motion.h2 
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
          className='h2'>Captiveting <span className='text-accent'>stories</span> birth magnificent designs.</motion.h2>
         <motion.p 
           variants={fadeIn('right', 0.4)}
           initial="hidden"
           animate="show"
           exit="hidden"
         className='max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0'>I'm a dedicated Master's student at Abdelmalek Essaadi University, excelling in my studies while actively pursuing self-directed learning. Currently, I'm gaining valuable real-world experience as a Junior Developer at NTT Data.

I specialize in software engineering, focusing on innovative solutions to enhance efficiency and agility. I bring unwavering commitment, energy, and integrity to any team or project.</motion.p>
<motion.div 
 variants={fadeIn('right', 0.6)}
 initial="hidden"
 animate="show"
 exit="hidden"
className='hidden md:flex md:max-w-xl xl:max-w-none mx-auto xl:mx-0 mb-8'>
<div className='flex flex-1 xl:gap-x-6' >
<div  className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
  <div className='text-2xl xl:text-4xl font-extrabold text-accent mb-2'>
    <CountUp  start={-5} end={5} duration={10} />+ 
  </div>
  <div className='text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]'>Years of experience</div>
</div>


<div  className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
  <div className='text-2xl xl:text-4xl font-extrabold text-accent mb-2'>
    <CountUp  start={0} end={46} duration={10} />+ 
  </div>
  <div className='text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]'>Finished projects</div>
</div>


<div  className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
  <div className='text-2xl xl:text-4xl font-extrabold text-accent mb-2'>
    <CountUp  start={0} end={7} duration={10} />+ 
  </div>
  <div className='text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]'>Finished certificats</div>
</div>
</div>
</motion.div>
        </div>
        <div className='flex flex-col w-full xl:max-w-[48%] h-[480px]'>
          <motion.iv 
           variants={fadeIn('left', 0.4)}
           initial="hidden"
           animate="show"
           exit="hidden"
          className='flex gap-x-4 xl:gap-x-8 mx-auto xl:mx-0 mb-4'>
            {aboutData.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`${index === itemIndex && 'text-accent after:w-[100%] after:bg-accent after:transition-all after:duration-300'} cursor-pointer capitalize xl:text-lg relative after:w-8 after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:-left-0`}
                onClick = {()=> setIndex(itemIndex)}
                >
                {item.title}
              </div>
            ))}
          </motion.iv> 
          <div className='py-2 xl:py-6 flex  flex-col gap-y-2 xl:gap-y-4 item-center xl:items-start'>
            {aboutData[index].info.map((item,itemIndex)=>{
              return (
                <div key={itemIndex} className='flex-1 flex flex-col md:flex-row max-w-max gap-x-2 items-center text-white/60'>
                  {/* <div key={itemIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
                  <div className='font-light mb-2 md-2 md:mb-0'>{item.title}</div>
                  <div className='hidden md:flex'>-</div>
                  <div>{item.stage}</div>
                  <div className='flex gap-x-4'>
                  {item.icons?.map((icon,itemIndex)=>{
                    return <div className='text-2xl text-white'>{icon}</div>
                  })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;