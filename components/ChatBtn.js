import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";

const ChatBtn = () => {
  return (
 
     <motion.div
        className="flex justify-center items-center mx-auto xl:mx-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}

      >
        <motion.div
          className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.2)",
              "0 0 40px rgba(255, 255, 255, 0.4)",
              "0 0 20px rgba(255, 255, 255, 0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
            
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            <Link
        href={"/cv"} // Replace with the actual path to your AI chat page 
      >  check my cv <HiArrowRight className="inline-block ml-2 mb-1" /></Link>     
          </span>
        </motion.div>
      </motion.div>

  );
};

export default ChatBtn;
