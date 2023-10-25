

import ServiceSlider from '../../components/ServiceSlider';
import Bulb from '../../components/Bulb';
import Circles from '../../components/Circles';

import {motion} from 'framer-motion'
import { fadeIn } from '../../variants';

const Services = () => {
  return <div  className='h-full bg-primary/30 py-36 flex items-center'>
    <Circles />
    <div className='container mx-auto'>
    <div className='flex flex-col xl:flex-row gap-x-8'>
      <div className='text-center flex xl:w-[30vm] flex-col lg:text-left mb-4 xl:mb-0'>
       <h2 className='h2 xl:mt-8'> my work <span className='text-accent'>.</span></h2>
       <p className='m-4 max-w-[400px] mx-auto lg:mx-0'>I'm a dedicated Master's student at Abdelmalek Essaadi University, excelling in my studies while actively pursuing self-directed
learning. Currently, I'm gaining valuable real-world experience as a Junior Developer at NTT Data.</p>
      </div>
      <ServiceSlider />
    </div>
    </div>
    <Bulb />
  </div>;
};

export default Services;

