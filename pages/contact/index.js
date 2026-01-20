import React, { useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
  Html,
} from "@react-three/drei";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Github,
  Linkedin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { ParticleBackground } from "../../components/particle-background";

// Premium Holographic Loader - High-Tech Design
const CanvasLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 20); // 100 steps * 20ms = 2000ms (Matches Model timeout)
    return () => clearInterval(interval);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-64">
        <div className="relative flex items-center justify-center w-32 h-32 mb-8">
          {/* Ambient Background Glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"
          />

          {/* Core Reacting Orb */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 backdrop-blur-sm"
            style={{ boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          </motion.div>

          {/* Inner Dashed Ring - Fast Rotation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 border-2 border-dashed border-cyan-500/40 rounded-full"
          />

          {/* Outer Scanner Ring - Counter Rotation */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 rounded-full border border-white/5"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
          </motion.div>

          {/* Tech Markers */}
          <div className="absolute w-full h-full">
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-36 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
              />
            ))}
          </div>

          {/* Center Digital Readout */}
          <div className="absolute font-mono text-xl font-bold text-white tabular-nums tracking-widest text-shadow-glow">
            {progress}
            <span className="text-xs text-cyan-400">%</span>
          </div>
        </div>

        {/* Status Text with Typing Cursor */}
        <div className="space-y-2 text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-sm tracking-[0.2em] text-cyan-300 uppercase"
          >
            System Initializing
          </motion.div>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between w-48 text-[10px] text-gray-400 font-mono">
            <span>DATA_STREAM</span>
            <span>SECURE_LINK</span>
          </div>
        </div>
      </div>
    </Html>
  );
};

// 3D Laptop Model Component with visible loading
const Model = () => {
  const ref = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const { scene, animations } = useGLTF("/laptop.glb");
  const { actions } = useAnimations(animations, ref);

  // Control loading state with minimum 10 second display
  useEffect(() => {
    if (scene) {
      // Keep loading for minimum 10 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 10 seconds - change this value as needed

      return () => clearTimeout(timer);
    }
  }, [scene]);

  // Play animation when model is ready
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0 && !isLoading) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [actions, isLoading]);

  // Show loader while loading
  if (isLoading) {
    return <CanvasLoader />;
  }

  // Show model when loaded
  return (
    <motion.group
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <primitive
        ref={ref}
        object={scene}
        scale={[3, 3, 3]}
        position={[10, -2, 0]}
      />
    </motion.group>
  );
};

// Error message component
const ErrorBox = ({ error }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
  >
    <AlertCircle className="w-3.5 h-3.5" />
    <span>{error}</span>
  </motion.div>
);

const Contact = () => {
  const [errors, setErrors] = useState({});
  const [hoveredModel, setHoveredModel] = useState(false);
  const [status, setStatus] = useState({
    isSubmitted: false,
    isSubmitting: false,
    isEmailChange: false,
    info: {
      isError: false,
      msg: "",
    },
  });

  const [data, setData] = useState({
    senderName: "",
    email: "",
    message: "",
  });

  const handleChange = useCallback((e) => {
    const { value, name } = e.target;
    setStatus((prev) => ({
      ...prev,
      isEmailChange: name === "email",
    }));

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const setError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleServerResponse = (ok, msg) => {
    setData({
      senderName: "",
      email: "",
      message: "",
    });
    if (ok) {
      setStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        info: { isError: false, msg: msg },
      }));
      setTimeout(() => {
        setStatus((prev) => ({
          ...prev,
          isSubmitted: false,
        }));
      }, 2000);
    } else {
      setStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        info: { isError: true, msg: msg },
      }));
    }
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setErrors({});

      let hasError = false;

      if (!data.senderName.trim()) {
        setError("senderName", "Name is required");
        hasError = true;
      }

      if (!data.email.trim()) {
        setError("email", "Email is required");
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        setError("email", "Invalid email format");
        hasError = true;
      }

      if (!data.message.trim()) {
        setError("message", "Message cannot be empty");
        hasError = true;
      }

      if (hasError) return;

      setStatus((prev) => ({
        ...prev,
        isSubmitting: true,
        isEmailChange: false,
      }));

      axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_FORM_URL}`,
        data,
      })
        .then((_response) =>
          handleServerResponse(
            true,
            "Your message has been successfully submitted! 🎉"
          )
        )
        .catch((e) =>
          handleServerResponse(
            false,
            e.response?.data?.error || "Something went wrong. Please try again."
          )
        );
    },
    [data]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const quickContacts = [
    {
      icon: Mail,
      label: "Email",
      value: "achrafzarouki20@gmail.com",
      href: "mailto:achrafzarouki20@gmail.com",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@Achraftraf",
      href: "https://github.com/Achraftraf",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Achraf Zarouki",
      href: "https://www.linkedin.com/in/achraf-zarouki-058888244/",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="h-full min-h-screen bg-site pt-8 lg:pt-10 pb-4 lg:pb-6 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden flex flex-col justify-center relative">
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header - Top Center of Page */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 lg:mb-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-2"
          >
            Get In <span className="text-cyan-400">Touch</span>
          </motion.h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col xl:flex-row items-start xl:items-center gap-6 lg:gap-8"
        >
          {/* Left Section - Form */}
          <motion.div
            variants={itemVariants}
            className="w-full xl:w-[40%] space-y-4"
          >
            {/* Form */}
            <motion.div
              variants={itemVariants}
              className="bg-[#20202d]/40 backdrop-blur-xl rounded-xl p-4 border border-white/10"
            >
              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                      placeholder="Your Name"
                      type="text"
                      value={data.senderName}
                      name="senderName"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {errors.senderName && <ErrorBox error={errors.senderName} />}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                      placeholder="your.email@example.com"
                      type="email"
                      value={data.email}
                      name="email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && <ErrorBox error={errors.email} />}
                  </AnimatePresence>
                  <AnimatePresence>
                    {status.isEmailChange && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-cyan-400 flex items-center gap-2 pl-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>I'll use this to get back to you</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none min-h-[100px] transition-all"
                      placeholder="Your message..."
                      value={data.message}
                      name="message"
                      onChange={handleChange}
                      maxLength={500}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {errors.message && <ErrorBox error={errors.message} />}
                  </AnimatePresence>
                  <div className="text-xs text-gray-500 text-right">
                    {data.message.length}/500
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status.isSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status.isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </motion.div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {/* Success/Error Message */}
                <AnimatePresence>
                  {(status.isSubmitted || status.info.msg) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${status.info.isError
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}
                    >
                      {status.info.isError ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{status.info.msg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Quick Contact Links */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 text-center">
                Quick Connect
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {quickContacts.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <motion.a
                      key={index}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="group relative cursor-pointer block"
                    >
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${contact.color} rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300`}
                      />
                      <div className="relative bg-[#20202d] rounded-lg p-2 border border-white/10 group-hover:border-white/20 transition-all">
                        <div className={`p-1.5 rounded-md bg-gradient-to-br ${contact.color} w-fit mx-auto mb-1.5`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-[10px] text-gray-400 text-center group-hover:text-cyan-400 transition-colors">
                          {contact.label}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - 3D Model (No Card, Larger) */}
          <motion.div
            variants={itemVariants}
            onHoverStart={() => setHoveredModel(true)}
            onHoverEnd={() => setHoveredModel(false)}
            className="w-full xl:w-[60%] relative"
          >
            {/* Enhanced Glow effect */}
            <motion.div
              animate={{
                scale: hoveredModel ? 1.08 : 1.02,
                opacity: hoveredModel ? 0.7 : 0.5,
              }}
              transition={{ duration: 0.4 }}
              className="absolute -inset-8 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 rounded-full blur-3xl pointer-events-none"
            />

            {/* Floating decorative elements - More prominent */}
            <motion.div
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-xl pointer-events-none"
            />
            <motion.div
              animate={{
                y: [20, -20, 20],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl pointer-events-none"
            />
            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [15, -15, 15],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-1/2 right-0 w-12 h-12 bg-gradient-to-br from-blue-400/25 to-cyan-400/25 rounded-full blur-lg pointer-events-none"
            />

            {/* 3D Model - Direct Canvas without container card */}
            <div className="relative aspect-[16/9]">
              <Canvas
                camera={{
                  position: [10, 6, 8],
                  fov: 50,
                  near: 0.5,
                  far: 120,
                }}
                className="rounded-2xl"
              >
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 8]} intensity={1.5} />
                <directionalLight position={[-5, 5, -5]} intensity={0.8} />
                <spotLight position={[15, 15, 15]} intensity={0.8} angle={0.3} penumbra={1} />
                <pointLight position={[0, 10, 0]} intensity={0.5} />
                <Model />
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  autoRotate={true}
                  autoRotateSpeed={0.8}
                  minDistance={5}
                  maxDistance={20}
                />
                <Environment preset="city" />
              </Canvas>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
