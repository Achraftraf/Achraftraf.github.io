import React, { useCallback, memo } from 'react';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesContainer = memo(() => {
  // init
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // You can perform additional actions here when particles are loaded
  }, []);

  return (
    <Particles
      className='w-full h-full absolute translate-z-0'
      id='tsparticles'
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: 'black' // Specify a color value here, e.g., 'black'
          }
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: false,
            },
            onHover: {
              enable: true,
              mode: 'grab',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5
              }
            },
          },
        },
        particles: {
          color: {
            value: '#e68e2e',
          },
          links: {
            color: '#f5d393',
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'out',
            random: false,
            speed: 0.6,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40,
          },
          opacity: {
            value: 0.5,
          },
          shape: { type: 'circle', },
          size: {
            value: {
              min: 1,
              max: 3 // You need to specify both min and max values
            },
          },
          detectRetina: true,
        },
      }}
    />
  );
});

ParticlesContainer.displayName = 'ParticlesContainer';

export default ParticlesContainer;
