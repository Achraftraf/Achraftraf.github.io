import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

const ChatBtn = () => {
  return (
    <div className="flex justify-center items-center mx-auto xl:mx-0">
      <Link
        href={"/cv"} // Replace with the actual path to your AI chat page
        className="relative flex justify-center items-center p-6 border-2 border-accent rounded-full group hover:bg-accent/10 transition-all duration-500 ease-in-out transform hover:scale-105"
      >
        <span className="text-xl text-accent font-semibold group-hover:text-white transition-all duration-300 ease-in-out">
          Explore My CV
        </span>

        <HiArrowRight className="absolute right-[-18px] text-2xl text-accent group-hover:text-white transition-all duration-500 ease-in-out transform group-hover:translate-x-5" />
      </Link>
    </div>
  );
};

export default ChatBtn;
