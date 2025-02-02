import React, { useState, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name || !formState.email || !formState.message) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setSuccess("Your message has been sent successfully!");
        setFormState({ name: "", email: "", message: "" });
      } else {
        const errorData = await res.json();
        setError(
          errorData.message ||
            "There was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      setError("There was an error sending your message. Please try again.");
    }
  };

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
          <div
            style={{
              width: "100%",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <h1 style={{ textAlign: "center" }}>Contact Us</h1>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "green", textAlign: "center" }}>{success}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    boxSizing: "border-box",
                    color: "black",
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
          </div>
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
