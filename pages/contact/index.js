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

// 3D Laptop Model Component
const Model = () => {
  const ref = useRef();
  const { scene, animations, loading, error } = useGLTF("/laptop.glb");

  // Loading state
  if (loading) {
    return (
      <Html center>
        <div className="text-cyan-400">Loading...</div>
      </Html>
    );
  }

  // Error handling
  if (error) {
    console.error("Error loading model:", error);
    return (
      <Html center>
        <div className="text-red-400">Error loading model</div>
      </Html>
    );
  }

  // Check if scene is available
  if (!scene) {
    return (
      <Html center>
        <div className="text-yellow-400">Model not available</div>
      </Html>
    );
  }

  const { actions } = useAnimations(animations, scene);

  // Play animation if present
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]].play();
    }
  }, [actions]);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={[3, 3, 3]}
      position={[10, -2, 0]}
    />
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
      }, 5000);
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
      value: "contact@example.com",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@yourusername",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "your-profile",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="h-full min-h-screen bg-site py-8 lg:py-12 px-4 sm:px-6 lg:px-8 xl:pr-32 overflow-hidden flex flex-col justify-center relative">
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

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col xl:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Left Section - Form */}
          <motion.div
            variants={itemVariants}
            className="w-full xl:w-[45%] space-y-6"
          >
            {/* Header */}
            <div className="text-center xl:text-left">
              <motion.h1
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-white mb-3"
              >
                Get In <span className="text-cyan-400">Touch</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-sm text-gray-400 max-w-md mx-auto xl:mx-0"
              >
                Have a project in mind or just want to chat? Drop me a message
                and I'll get back to you soon.
              </motion.p>
            </div>

            {/* Form */}
            <motion.div
              variants={itemVariants}
              className="bg-[#20202d]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
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
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
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
                        className="text-xs text-cyan-400 flex items-center gap-2"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>I'll use this to get back to you</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none min-h-[120px] transition-all"
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
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status.isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
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
                      className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${status.info.isError
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}
                    >
                      {status.info.isError ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>{status.info.msg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Quick Contact Links */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 text-center xl:text-left">
                Quick Connect
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {quickContacts.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3 }}
                      className="group relative cursor-pointer"
                    >
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${contact.color} rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300`}
                      />
                      <div className="relative bg-[#20202d] rounded-lg p-3 border border-white/10 group-hover:border-white/20 transition-all">
                        <div className={`p-2 rounded-md bg-gradient-to-br ${contact.color} w-fit mx-auto mb-2`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs text-gray-400 text-center group-hover:text-cyan-400 transition-colors">
                          {contact.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - 3D Model */}
          <motion.div
            variants={itemVariants}
            onHoverStart={() => setHoveredModel(true)}
            onHoverEnd={() => setHoveredModel(false)}
            className="w-full xl:w-[55%] relative"
          >
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: hoveredModel ? 1.05 : 1,
                opacity: hoveredModel ? 0.6 : 0.4,
              }}
              transition={{ duration: 0.4 }}
              className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl pointer-events-none"
            />

            {/* Model Container */}
            <div className="relative bg-[#20202d]/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 overflow-hidden">
              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl pointer-events-none"
              />
              <motion.div
                animate={{
                  y: [15, -15, 15],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl pointer-events-none"
              />

              <div className="aspect-[16/10] relative">
                <Canvas
                  camera={{
                    position: [8, 5, 7],
                    fov: 45,
                    near: 0.6,
                    far: 100,
                  }}
                  className="rounded-xl"
                >
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1.2} />
                  <spotLight position={[10, 10, 10]} intensity={0.5} />
                  <Model />
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                  />
                  <Environment preset="sunset" />
                </Canvas>
              </div>

              {/* Info badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center"
              >
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">
                    Interactive 3D Model - Drag to Rotate
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
