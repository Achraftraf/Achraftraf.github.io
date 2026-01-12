"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, Container, ISourceOptions } from "@tsparticles/engine";

type InteractionMode = "grab" | "repulse" | "bubble" | "connect" | "trail" | "light";
type ParticleShape = "circle" | "edge" | "triangle" | "polygon" | "star" | "heart" | "square";
type ThemePreset = "cosmic" | "neon" | "ocean" | "fire" | "matrix" | "aurora" | "minimal" | "galaxy" | "cyber";
type AnimationStyle = "smooth" | "energetic" | "calm" | "chaotic" | "wave" | "spiral" | "breathing";

interface ColorScheme {
  particles: string[];
  links: string;
  glow?: string;
}

interface ParticlesContainerProps {
  // Core Configuration
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  zIndex?: number;
  
  // Theme & Presets
  theme?: ThemePreset;
  animationStyle?: AnimationStyle;
  customColors?: ColorScheme;
  
  // Particle Settings
  particleCount?: number;
  particleShape?: ParticleShape;
  particleSize?: { min: number; max: number };
  particleOpacity?: number;
  glowEffect?: boolean;
  
  // Link Settings
  enableLinks?: boolean;
  linkDistance?: number;
  linkOpacity?: number;
  linkWidth?: number;
  
  // Animation Settings
  moveSpeed?: number;
  rotationSpeed?: number;
  enablePulse?: boolean;
  enableTwinkle?: boolean;
  
  // Interaction Settings
  interactionMode?: InteractionMode;
  enableHover?: boolean;
  enableClick?: boolean;
  hoverDistance?: number;
  clickPushQuantity?: number;
  
  // Advanced Features
  enableParallax?: boolean;
  parallaxForce?: number;
  enableTrails?: boolean;
  enableCollision?: boolean;
  attractParticles?: boolean;
  
  // Performance & Display
  fps?: number;
  fadeInDuration?: number;
  showLoadingIndicator?: boolean;
  reducedMotion?: boolean;
  
  // Callbacks
  onInit?: (container: Container) => void;
  onDestroy?: () => void;
}

const THEME_PRESETS: Record<ThemePreset, ColorScheme> = {
  cosmic: {
    particles: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
    links: "#8b5cf6",
    glow: "#a78bfa",
  },
  neon: {
    particles: ["#ff0080", "#ff8c00", "#40c9ff", "#e81cff"],
    links: "#ff00ff",
    glow: "#ff00ff",
  },
  ocean: {
    particles: ["#2e3192", "#1bffff", "#4facfe", "#00f2fe"],
    links: "#0ea5e9",
    glow: "#38bdf8",
  },
  fire: {
    particles: ["#ff512f", "#dd2476", "#f09819", "#ff512f"],
    links: "#f97316",
    glow: "#fb923c",
  },
  matrix: {
    particles: ["#00ff41", "#00ff41", "#008f11", "#00ff41"],
    links: "#22c55e",
    glow: "#4ade80",
  },
  aurora: {
    particles: ["#a8edea", "#fed6e3", "#d299c2", "#fef9d7"],
    links: "#c084fc",
    glow: "#e9d5ff",
  },
  minimal: {
    particles: ["#3b82f6", "#60a5fa", "#93c5fd"],
    links: "#60a5fa",
    glow: "#bfdbfe",
  },
  galaxy: {
    particles: ["#8e2de2", "#4a00e0", "#ff00cc", "#333399"],
    links: "#7c3aed",
    glow: "#a78bfa",
  },
  cyber: {
    particles: ["#00f5ff", "#ff00ff", "#ffff00", "#00ff00"],
    links: "#06b6d4",
    glow: "#22d3ee",
  },
};

const ParticlesContainer: React.FC<ParticlesContainerProps> = ({
  style,
  className = "",
  id = "tsparticles-pro",
  zIndex = 0,
  
  theme = "cosmic",
  animationStyle = "smooth",
  customColors,
  
  particleCount = 100,
  particleShape = "circle",
  particleSize = { min: 1, max: 5 },
  particleOpacity = 0.6,
  glowEffect = false,
  
  enableLinks = true,
  linkDistance = 150,
  linkOpacity = 0.4,
  linkWidth = 1,
  
  moveSpeed = 1,
  rotationSpeed = 0,
  enablePulse = false,
  enableTwinkle = false,
  
  interactionMode = "grab",
  enableHover = true,
  enableClick = true,
  hoverDistance = 150,
  clickPushQuantity = 4,
  
  enableParallax = false,
  parallaxForce = 60,
  enableTrails = false,
  enableCollision = false,
  attractParticles = false,
  
  fps = 60,
  fadeInDuration = 1000,
  showLoadingIndicator = true,
  reducedMotion = false,
  
  onInit,
  onDestroy,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const containerRef = useRef<Container | null>(null);
  
  const colorScheme = customColors || THEME_PRESETS[theme];

  useEffect(() => {
    let mounted = true;
    let progressInterval: NodeJS.Timeout;

    const initParticles = async () => {
      try {
        // Simulate loading progress
        progressInterval = setInterval(() => {
          setLoadProgress(prev => Math.min(prev + 10, 90));
        }, 50);

        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
        });
        
        if (mounted) {
          setLoadProgress(100);
          clearInterval(progressInterval);
          
          setTimeout(() => {
            setIsInitialized(true);
            setTimeout(() => setIsVisible(true), 50);
          }, 200);
        }
      } catch (err) {
        console.error("Particles initialization failed:", err);
        if (mounted) {
          setError("Unable to initialize particle system");
          clearInterval(progressInterval);
        }
      }
    };

    initParticles();

    return () => {
      mounted = false;
      clearInterval(progressInterval);
      onDestroy?.();
    };
  }, [onDestroy]);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      containerRef.current = container;
      onInit?.(container);
      console.log("✨ Particle system loaded successfully");
    }
  }, [onInit]);

  const getAnimationConfig = useCallback((style: AnimationStyle) => {
    const configs = {
      smooth: {
        speed: moveSpeed * 0.8,
        random: false,
        straight: false,
        wobble: false,
      },
      energetic: {
        speed: moveSpeed * 2,
        random: true,
        straight: false,
        wobble: true,
      },
      calm: {
        speed: moveSpeed * 0.5,
        random: false,
        straight: false,
        wobble: false,
      },
      chaotic: {
        speed: moveSpeed * 1.8,
        random: true,
        straight: false,
        wobble: true,
      },
      wave: {
        speed: moveSpeed,
        random: false,
        straight: false,
        wobble: true,
      },
      spiral: {
        speed: moveSpeed * 1.2,
        random: false,
        straight: false,
        wobble: false,
      },
      breathing: {
        speed: moveSpeed * 0.6,
        random: false,
        straight: false,
        wobble: false,
      },
    };
    return configs[style];
  }, [moveSpeed]);

  const particlesOptions: ISourceOptions = useMemo(() => {
    const animConfig = getAnimationConfig(animationStyle);
    const isSmooth = animationStyle === "smooth" || animationStyle === "breathing";
    
    return {
      fullScreen: { 
        enable: false,
        zIndex: 0 
      },
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: reducedMotion ? 30 : fps,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { 
            enable: enableHover && !reducedMotion, 
            mode: interactionMode,
            parallax: {
              enable: enableParallax,
              force: parallaxForce,
              smooth: 10,
            }
          },
          onClick: {
            enable: enableClick,
            mode: ["push", "repulse"],
          },
          resize: { 
            enable: true,
            delay: 0.5
          },
        },
        modes: {
          grab: {
            distance: hoverDistance,
            links: {
              opacity: linkOpacity * 2,
              color: colorScheme.links,
            },
          },
          push: {
            quantity: clickPushQuantity,
          },
          repulse: {
            distance: hoverDistance * 1.5,
            duration: 0.4,
            speed: 1,
          },
          bubble: {
            distance: hoverDistance * 1.8,
            size: particleSize.max * 2,
            duration: 0.4,
            opacity: 0.8,
          },
          connect: {
            distance: linkDistance * 1.3,
            radius: linkDistance,
            links: {
              opacity: linkOpacity,
            },
          },
          trail: {
            delay: 0.005,
            quantity: 5,
            pauseOnStop: true,
          },
          light: {
            area: {
              gradient: {
                start: { value: colorScheme.glow || colorScheme.links },
                stop: { value: "#000000" },
              },
              radius: 1000,
            },
            shadow: {
              color: { value: colorScheme.glow || colorScheme.links },
              length: 2000,
            },
          },
        },
      },
      particles: {
        color: { 
          value: colorScheme.particles,
        },
        shadow: glowEffect ? {
          blur: 10,
          color: { value: colorScheme.glow || colorScheme.links },
          enable: true,
          offset: { x: 0, y: 0 },
        } : undefined,
        links: {
          color: colorScheme.links,
          distance: linkDistance,
          enable: enableLinks,
          opacity: linkOpacity,
          width: linkWidth,
          triangles: {
            enable: theme === "cosmic" || theme === "galaxy",
            opacity: linkOpacity * 0.1,
          },
          shadow: glowEffect ? {
            blur: 5,
            color: { value: colorScheme.glow || colorScheme.links },
            enable: true,
          } : undefined,
        },
        move: {
          enable: true,
          speed: animConfig.speed,
          direction: "none",
          random: animConfig.random,
          straight: animConfig.straight,
          outModes: { 
            default: enableTrails ? "destroy" : "bounce",
          },
          attract: {
            enable: attractParticles,
            distance: 200,
            rotate: {
              x: 3000,
              y: 3000,
            },
          },
          trail: enableTrails ? {
            enable: true,
            length: 10,
            fill: {
              color: { value: "#000000" },
            },
          } : undefined,
          vibrate: animConfig.wobble,
          warp: animationStyle === "spiral",
        },
        number: {
          value: particleCount,
          density: { 
            enable: true,
          },
        },
        opacity: { 
          value: particleOpacity,
          animation: {
            enable: enableTwinkle || animationStyle === "breathing",
            speed: enableTwinkle ? 3 : 0.5,
            minimumValue: particleOpacity * 0.2,
            sync: false,
          },
        },
        shape: { 
          type: particleShape,
          options: {
            polygon: { sides: 6 },
            star: { sides: 5 },
            character: {
              fill: true,
              font: "Verdana",
              value: ["✨", "⭐", "💫"],
            },
          },
        },
        size: { 
          value: particleSize,
          animation: {
            enable: enablePulse,
            speed: 3,
            minimumValue: particleSize.min,
            sync: false,
          },
        },
        stroke: glowEffect ? {
          width: 0.5,
          color: { value: colorScheme.glow || colorScheme.links },
        } : undefined,
        rotate: rotationSpeed > 0 ? {
          value: 0,
          animation: {
            enable: true,
            speed: rotationSpeed,
            sync: false,
          },
        } : undefined,
        collisions: {
          enable: enableCollision,
          mode: "bounce",
        },
      },
      detectRetina: true,
      smooth: isSmooth,
      motion: {
        disable: reducedMotion,
        reduce: {
          factor: 4,
          value: true,
        },
      },
      responsive: [
        {
          maxWidth: 1024,
          options: {
            particles: {
              number: { value: Math.floor(particleCount * 0.6) },
              move: { speed: animConfig.speed * 0.8 },
            },
          },
        },
        {
          maxWidth: 768,
          options: {
            particles: {
              number: { value: Math.floor(particleCount * 0.4) },
              move: { speed: animConfig.speed * 0.6 },
              links: { distance: linkDistance * 0.8 },
            },
            interactivity: {
              events: {
                onHover: { enable: false },
              },
            },
          },
        },
        {
          maxWidth: 480,
          options: {
            particles: {
              number: { value: Math.floor(particleCount * 0.25) },
              move: { speed: animConfig.speed * 0.5 },
              links: { 
                enable: particleCount <= 60,
                distance: linkDistance * 0.7,
              },
            },
            interactivity: {
              events: {
                onHover: { enable: false },
                onClick: { enable: false },
              },
            },
          },
        },
      ],
    };
  }, [
    animationStyle,
    attractParticles,
    clickPushQuantity,
    colorScheme,
    enableClick,
    enableCollision,
    enableHover,
    enableLinks,
    enableParallax,
    enablePulse,
    enableTrails,
    enableTwinkle,
    fps,
    getAnimationConfig,
    glowEffect,
    hoverDistance,
    interactionMode,
    linkDistance,
    linkOpacity,
    linkWidth,
    parallaxForce,
    particleCount,
    particleOpacity,
    particleShape,
    particleSize,
    reducedMotion,
    rotationSpeed,
    theme,
  ]);

  if (error) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${className}`} style={{ ...style, zIndex }}>
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return showLoadingIndicator ? (
      <div 
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ ...style, zIndex }}
      >
        <div className="absolute top-6 left-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 pointer-events-auto backdrop-blur-md border border-white/20">
          <div className="flex items-center gap-3">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              <div className="relative w-3 h-3 bg-white rounded-full" />
            </div>
            <div>
              <div className="text-sm font-semibold">Initializing Particles</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <span className="text-xs opacity-75">{loadProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-opacity ${className}`}
      style={{ 
        ...style, 
        zIndex,
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${fadeInDuration}ms`,
      }}
    >
      <Particles
        id={id}
        particlesLoaded={particlesLoaded}
        className="w-full h-full"
        options={particlesOptions}
      />
    </div>
  );
};

export default ParticlesContainer;
