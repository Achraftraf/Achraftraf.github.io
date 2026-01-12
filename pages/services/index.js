import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Code2,
  Presentation,
  Palette,
  Database,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const serviceData = [
    {
      icon: Brain,
      title: "AI Integration",
      description: "Seamlessly integrate AI into websites for smarter, more dynamic user experiences.",
      color: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/20",
      features: ["NLP implementation", "Chatbot integration", "Smart recommendations", "Data analysis"]
    },
    {
      icon: Code2,
      title: "Development",
      description: "Build modern websites and apps using Spring Boot, React, Next.js, and more.",
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/20",
      features: ["Full-stack dev", "Responsive design", "Performance optimization", "Scalable architecture"]
    },
    {
      icon: Presentation,
      title: "PPT Design",
      description: "Create visually stunning and professional 3D PowerPoint presentations.",
      color: "from-orange-500 to-red-500",
      bgGlow: "bg-orange-500/20",
      features: ["3D elements", "Custom animations", "Data visualization", "Corporate branding"]
    },
    {
      icon: Palette,
      title: "Design",
      description: "Expert in logo, image, and digital file design. Also experienced in creating reports.",
      color: "from-green-500 to-emerald-500",
      bgGlow: "bg-green-500/20",
      features: ["Logo design", "UI/UX design", "Brand identity", "Digital assets"]
    },
    {
      icon: Database,
      title: "Data Processing",
      description: "Efficiently process and analyze data using Talend and PowerBI for actionable insights.",
      color: "from-indigo-500 to-purple-500",
      bgGlow: "bg-indigo-500/20",
      features: ["ETL pipelines", "Data cleaning", "PowerBI dashboards", "Real-time analytics"]
    },
    {
      icon: GraduationCap,
      title: "Teaching Skills",
      description: "Empower your career with both technical and soft skills for growth and success.",
      color: "from-yellow-500 to-orange-500",
      bgGlow: "bg-yellow-500/20",
      features: ["Technical workshops", "Coding mentorship", "Soft skills training", "Career guidance"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="h-full min-h-screen bg-site py-8 lg:py-12 px-4 sm:px-6 lg:px-8 xl:pr-32 overflow-hidden flex flex-col justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full bg-white/20"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: [null, Math.random() * 1000],
              opacity: [null, 0, Math.random() * 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col justify-center h-full lg:pl-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12 mb-6 lg:mb-8"
        >

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-2"
          >
            My <span className="text-accent">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-400 max-w-lg mx-auto"
          >
            Professional services tailored to your needs.
          </motion.p>
        </motion.div>

        {/* Services Grid - Compact & Colorful */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full"
        >
          {serviceData.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => setSelectedService(service)}
                className="group relative cursor-pointer"
              >
                {/* Vibrant Glow Effect - Restored */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.8 : 0,
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
                />

                {/* Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-full bg-[#20202d] backdrop-blur-xl rounded-xl p-4 border border-white/5 group-hover:border-white/20 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Subtle gradient overlay */}
                  <div className={`absolute top-0 right-0 p-16 opacity-10 bg-gradient-to-br ${service.color} blur-2xl rounded-bl-full pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-20' : ''}`} />

                  {/* Icon & Arrow */}
                  <div className="flex items-start justify-between mb-3 z-10">
                    <motion.div
                      animate={{ rotate: isHovered ? 360 : 0 }}
                      transition={{ duration: 0.6 }}
                      className={`p-2 rounded-lg bg-gradient-to-br ${service.color} shadow-lg shadow-${service.color.split(' ')[0]}/20`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>

                    <motion.div
                      animate={{
                        x: isHovered ? 3 : 0,
                        y: isHovered ? -3 : 0
                      }}
                      className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-accent" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-1.5 z-10 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-accent transition-all">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3 flex-grow line-clamp-2 z-10 group-hover:text-gray-300 transition-colors">
                    {service.description}
                  </p>

                  {/* Quick feature badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto z-10">
                    {service.features.slice(0, 2).map((feature, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 group-hover:text-white/80 transition-all"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 lg:mt-8 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-5 py-2 rounded-full font-medium transition-all duration-300 text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden shadow-2xl"
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedService.color}`} />

              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Content */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center flex-shrink-0 shadow-lg mx-auto sm:mx-0`}
                >
                  <selectedService.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 text-center sm:text-left">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  >
                    {selectedService.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-purple-400 font-medium mb-4"
                  >
                    Professional Service
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 leading-relaxed mb-6"
                  >
                    {selectedService.description}
                  </motion.p>

                  {/* Features - Compact Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-2 mb-6"
                  >
                    {selectedService.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="bg-white/5 rounded-lg p-2.5 flex items-center gap-2 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all font-medium border border-white/10 text-sm"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all font-medium shadow-lg flex items-center justify-center gap-2 text-sm">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;