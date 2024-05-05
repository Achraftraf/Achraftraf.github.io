import React from 'react';
import WorkSlider from '../../components/WorkSlider';
import Bulb from '../../components/Bulb';
import Circles from '../../components/Circles';
import { motion } from 'framer-motion';
import { fadeIn, stagger } from '../../variants'; // Import additional animation variants

const Work = () => {
  return (
    <motion.div
      variants={stagger}
      initial='hidden'
      animate='show'
      exit='hidden'
      className='h-full bg-primary/30 py-36 flex items-center'>
      <Circles />
      <div className='container mx-auto'>
        <motion.div
          variants={fadeIn('up', 0.2)}
          className='flex flex-col xl:flex-row gap-x-8'>
          <motion.div
            className='text-center flex xl:w-[30vm] flex-col lg:text-left mb-4 xl:mb-0'>
            <motion.h2 variants={fadeIn('up', 0.2)} className='h2 x-13 xl:mt-12'>
              my Work<span className='text-accent'>.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn('up', 0.2)}
              className='m-4 max-w-[400px] mx-auto lg:mx-0'>
             
            </motion.p>
          </motion.div>
          <motion.div
            variants={fadeIn('down', 0.6)}
            className='w-full xl:max-w-[65%]'>
            <WorkSlider />
          </motion.div>
        </motion.div>
      </div>
      {/* <Bulb /> */}
    </motion.div>
  );
};

export default Work;
