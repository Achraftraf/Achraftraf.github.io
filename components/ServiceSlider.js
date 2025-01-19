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
import { RiDatabase2Line } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";

// Initialize SwiperCore modules
SwiperCore.use([Pagination]);

const serviceData = [
  {
    icon: <SiOpenai aria-label="AI Integration" />,
    title: "AI Integration",
    description:
      "Seamlessly integrate AI into websites for smarter, more dynamic user experiences.",
  },
  {
    icon: <RxDesktop aria-label="Development" />,
    title: "Development",
    description:
      "Build modern websites and apps using Spring Boot, React, Next.js, and more.",
  },
  {
    icon: <RxCrop aria-label="PPT Design" />,
    title: "PPT Design",
    description:
      "Create visually stunning and professional 3D PowerPoint presentations.",
  },
  {
    icon: <RxPencil2 aria-label="Design" />,
    title: "Design",
    description:
      "Expert in logo, image, and digital file design. Also experienced in creating reports.",
  },
  {
    icon: <RiDatabase2Line aria-label="Data Processing" />,
    title: "Data Processing",
    description:
      "Efficiently process and analyze data using Talend and PowerBI for actionable insights.",
  },
  {
    icon: <FaGraduationCap aria-label="Teaching" />,
    title: "Teaching Skills",
    description:
      "Empower your career with both technical and soft skills for growth and success.",
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
      loop={true}
      centeredSlides={true}
      className="h-[240px] sm:h-[340px] ml-[20px] sm:ml-[30px] lg:ml-[50px]" // Added left margin to shift slider to the right
    >
      {serviceData.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            className="inline-block bg-[rgba(65,47,123,0.15)] rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300"
            aria-labelledby={`service-title-${index}`}
            role="region"
          >
            <div className="text-4xl text-accent mb-4">{item.icon}</div>
            <div className="mb-8">
              <div
                id={`service-title-${index}`}
                className="mb-2 text-lg font-semibold"
              >
                {item.title}
              </div>
              <p className="max-w-[350px] leading-normal">{item.description}</p>
            </div>
            <div className="text-3xl">
              <RxArrowTopRight className="group-hover:rotate-45 group-hover:text-accent transition-all duration-300" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceSlider;
