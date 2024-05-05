import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper as SwiperCore, Pagination } from "swiper";
import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RiBarChart2Line,
  RxRocket,
  RxArrowTopRight,
} from "react-icons/rx";
import { RiDatabase2Line } from 'react-icons/ri';
import { FaGraduationCap } from 'react-icons/fa';

// Initialize SwiperCore modules
SwiperCore.use([Pagination]);

const serviceData = [
  {
    icon: <RxDesktop />,
    title: "Development",
    description: "I develop websites and apps using Spring Boot, React, Next.js, and other languages.",
  },
  {
    icon: <RxCrop />,
    title: "PPT",
    description: "I can design a professional 3D PowerPoint presentation for any subject.",
  },
  {
    icon: <RxPencil2 />,
    title: "Design",
    description: "I specialize in designing logos, images, and digital files.",
  },
 
  {
    icon: <RiDatabase2Line />,
    title: "Processing data",
    description: "I adeptly use Talend and PowerBI for efficient data processing and analysis.",
  },
  {
    icon: <FaGraduationCap />,
    title: "teaching skills",
    description: "I teach both soft and technical skills to help you land the job and grow.",
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 15 },
        640: { slidesPerView: 3, spaceBetween: 15 },
      }}
      freeMode={true}
      pagination={{ clickable: true }}
      className="h-[240px] sm:h-[340px]"
    >
      {serviceData.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="inline-block bg-[rgba(65,47,123,0.15)] rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65, 169,0.15)] transition-all duration-300">
            <div className="text-4xl text-accent mb-4">{item.icon}</div>
            <div className="mb-8">
              <div className="mb-2  text-lg">{item.title}</div>
              <p className="max-w-[350px] leading-normal">{item.description}</p>
            </div>
            <div className="text-3xl">
              <RxArrowTopRight className='group-hover:rotate-45
group-hover: text-accent transition-all duration-300' />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceSlider;
