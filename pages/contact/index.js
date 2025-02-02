import React, { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { motion } from "framer-motion";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
  Html,
} from "@react-three/drei";

const Model = () => {
  const ref = useRef();
  const { scene, animations, loading, error } = useGLTF("/laptop.glb");

  // Loading state
  if (loading) {
    return (
      <Html center>
        <p>Loading...</p>
      </Html>
    );
  }

  // Error handling
  if (error) {
    console.error("Error loading model:", error);
    return <p>Error loading model</p>;
  }

  // Check if scene is available
  if (!scene) {
    return <p>Model is not loaded properly</p>;
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
      scale={[3, 3, 3]} // Adjust the scale to fit the model into the Canvas
      position={[10, -2, 0]} // Position it properly in the center of the scene
    />
  );
};

const Contact = () => {
  const [errors, setErrors] = useState({});
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
      [name]: "", // Clear error for the current field
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

      if (!data.senderName.trim()) {
        setError("senderName", "Name is required");
      }

      if (!data.email.trim()) {
        setError("email", "Email is required");
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        setError("email", "Invalid email format");
        return;
      }

      if (!data.message.trim()) {
        setError("message", "Reason cannot be empty");
        return;
      }

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
            "Your message has been successfully submitted to Me :)"
          )
        )
        .catch((e) => handleServerResponse(false, e.response.data.error));
    },
    [data]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          maxWidth: "1200px",
        }}
      >
        <div style={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-bold text-center text-white mb-4">
              Contact Us
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              noValidate
            >
              {errors.senderName && <RequiredBox error={errors.senderName} />}
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Your Name"
                type="text"
                value={data.senderName}
                name="senderName"
                onChange={handleChange}
                required
              />
              {errors.email && <RequiredBox error={errors.email} />}
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. example@gmail.com"
                type="email"
                value={data.email}
                name="email"
                onChange={handleChange}
                required
              />
              {status.isEmailChange && (
                <div className="text-sm text-blue-400">
                  Please provide your real email so I can contact you back.
                </div>
              )}
              {errors.message && <RequiredBox error={errors.message} />}
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[8em] transition-all"
                placeholder="Reason of contact?"
                value={data.message}
                name="message"
                onChange={handleChange}
                maxLength={500}
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg transition-all"
              >
                {status.isSubmitting ? "Submitting..." : "Submit"}
              </motion.button>
            </form>
          </motion.div>
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "600px",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Canvas
              camera={{
                position: [8, 5, 7], // Keep camera fixed for proper viewing
                fov: 45,
                near: 0.6,
                far: 100,
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Model />
              <OrbitControls
                enableZoom={true}
                enablePan={false} // Prevents moving the scene with pan gestures
                // rotateSpeed={0.5} // Adjust speed of rotation
                // auto-rotate={false} // Disable automatic rotation
              />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
