import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import 'swiper/swiper-bundle.css';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Initialize SwiperCore modules
SwiperCore.use([Pagination]);

const workSlides = {
  slides: [
    {
      images: [
        { path: '/thumb1.jpg', title: 'Image 1 Title' },
        { path: '/thumb2.jpg', title: 'Image 2 Title' },
        { path: '/thumb3.jpg', title: 'Image 3 Title' },
        { path: '/thumb4.jpg', title: 'Image 4 Title' },
      ],
    },
    {
      images: [
        { path: '/thumb1.jpg', title: 'Image 5 Title' },
        { path: '/thumb2.jpg', title: 'Image 6 Title' },
        { path: '/thumb3.jpg', title: 'Image 7 Title' },
        { path: '/thumb4.jpg', title: 'Image 8 Title' },
      ],
    },
  ],
};

const WorkSlider = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Swiper
      spaceBetween={10}
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className='h-[280px] sm:h-[480px]'
    >
      {workSlides.slides.map((slide, slideIndex) => (
        <SwiperSlide key={slideIndex}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='grid grid-cols-2 grid-rows-2 gap-4'
          >
            {slide.images.map((image, imageIndex) => (
              <motion.div
                key={imageIndex}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='relative overflow-hidden rounded-lg'
                onMouseEnter={() => setHoveredIndex(imageIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.img
                  src={image.path}
                  alt={`Image ${imageIndex}`}
                  className='w-full h-full object-cover transition-transform duration-300'
                />
                {/* overlay gradient */}
                <div className={`absolute inset-0 bg-gradient-to-l from-transparent to-[#e838cc] ${hoveredIndex === imageIndex ? 'opacity-80' : 'opacity-0'} transition-all duration-700`}></div>
                {/* title */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center ${hoveredIndex === imageIndex ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>
                  <span>{image.title}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default WorkSlider;
