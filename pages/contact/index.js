import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, Html } from '@react-three/drei';
import { useSpring, animated as a } from 'react-spring';

const Model = () => {
  const ref = useRef();
  const { scene, animations } = useGLTF('/star_wars_droide_b2_by_oscar_creativo.glb');
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]].play();
    }
  }, [actions]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01; // Adjust the speed of rotation as needed
    }
  });

  return <primitive ref={ref} object={scene} scale={[3, 3, 3]} position={[0, -4, 0]} />;
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animateModel, setAnimateModel] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name || !formState.email || !formState.message) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setSuccess('Your message has been sent successfully!');
        setFormState({ name: '', email: '', message: '' });
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'There was an error sending your message. Please try again.');
      }
    } catch (error) {
      setError('There was an error sending your message. Please try again.');
    }
  };

  const formAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const modelAnimation = useSpring({
    transform: animateModel ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 200, friction: 12 },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%', maxWidth: '1200px' }}>
        <div style={{ flex: 1 }}>
          <a.div style={{ ...formAnimation, width: '100%', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Contact Us</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', color: 'black' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', color: 'black' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', color: 'black' }}
                ></textarea>
              </div>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
            </form>
          </a.div>
        </div>
        <div style={{ flex: 1, marginLeft: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <a.div
            style={{ ...modelAnimation, width: '300px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setAnimateModel(!animateModel)} // Toggle animation on click
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <Suspense fallback={<Html center>Loading...</Html>}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Model />
                <OrbitControls enableZoom={true} rotateSpeed={0.2} />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </a.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
